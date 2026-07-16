# Terraform Infrastructure as Code

## Infrastructure as Code Best Practices

### Agent Deployment Structure

This project uses a dynamic, account-based deployment structure where AWS account IDs serve as environment identifiers:

```
examples/agents/{agent-name}/
├── agent.py                    # Main agent code
├── agent_tools.py              # Tool implementations
├── agent_prompts.py            # Prompts and instructions
├── models.py                   # Data models
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Container definition
├── manifest.json               # Agent metadata
├── deployment/                 # Infrastructure as code
│   ├── main.tf                # Terraform configuration
│   ├── variables.tf           # Variable definitions
│   ├── outputs.tf             # Output definitions
│   ├── backend.tf             # Backend placeholder
│   ├── versions.tf            # Provider constraints (optional)
│   └── lambda/                # Optional Lambda function
│       ├── Dockerfile         # Lambda container
│       ├── lambda_function.py # Lambda handler
│       └── requirements.txt   # Lambda dependencies
└── environments/              # Dynamic per-account configs
    ├── {account-id-1}/       # e.g., 540845145946
    │   ├── backend.conf      # Generated backend config
    │   └── main.tfvars       # Generated variables
    └── {account-id-2}/       # e.g., 688567298668
        ├── backend.conf      # Generated backend config
        └── main.tfvars       # Generated variables
```

### Deployment Workflow

```bash
# Deploy to a specific AWS account
./agent-resources/deployment/scripts/deploy-agent.sh agent-name {account-id}

# Options
--skip-build      # Skip container build
--skip-deploy     # Build only
--local-build-only # Local build without AWS

# The script automatically:
# 1. Creates environments/{account-id}/ directory
# 2. Generates backend.conf from SSM parameters
# 3. Creates main.tfvars with account-specific values
# 4. Deploys infrastructure to that account
```

## Core Terraform Patterns

### 1. Resource Naming and Tagging
```hcl
locals {
  # Consistent naming convention
  name_prefix = "${var.project}-${var.environment}"

  # Common tags for all resources
  common_tags = {
    Project     = var.project
    Environment = var.environment
    ManagedBy   = "Terraform"
    Owner       = var.owner
    CostCenter  = var.cost_center
  }
}

# Apply to resources consistently
resource "aws_instance" "web" {
  instance_type = var.instance_type

  tags = merge(
    local.common_tags,
    {
      Name = "${local.name_prefix}-web-instance"
      Type = "WebServer"
    }
  )
}
```

### 2. Variable Validation and Types
```hcl
variable "environment" {
  description = "Deployment environment"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be dev, staging, or production"
  }
}

variable "database_config" {
  description = "Database configuration"
  type = object({
    engine         = string
    engine_version = string
    instance_class = string
    allocated_storage = number

    backup_config = object({
      retention_days = number
      backup_window  = string
      maintenance_window = string
    })
  })

  default = {
    engine         = "postgres"
    engine_version = "15.3"
    instance_class = "db.t3.micro"
    allocated_storage = 20

    backup_config = {
      retention_days = 7
      backup_window  = "03:00-04:00"
      maintenance_window = "sun:04:00-sun:05:00"
    }
  }
}
```

### 3. Module Development
```hcl
# modules/ecs-service/main.tf
terraform {
  required_version = ">= 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# Input variables with clear descriptions
variable "service_name" {
  description = "Name of the ECS service"
  type        = string
}

variable "container_definitions" {
  description = "Container definitions for the task"
  type        = string
}

# Main resources
resource "aws_ecs_service" "this" {
  name            = var.service_name
  cluster         = var.cluster_id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = var.desired_count

  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }

  dynamic "load_balancer" {
    for_each = var.load_balancer_config != null ? [var.load_balancer_config] : []

    content {
      target_group_arn = load_balancer.value.target_group_arn
      container_name   = load_balancer.value.container_name
      container_port   = load_balancer.value.container_port
    }
  }
}

# Outputs for other modules
output "service_name" {
  description = "Name of the ECS service"
  value       = aws_ecs_service.this.name
}

output "task_definition_arn" {
  description = "ARN of the task definition"
  value       = aws_ecs_task_definition.this.arn
}
```

### 4. Backend Configuration

The backend.tf file serves as a placeholder that gets configured dynamically:

```hcl
# backend.tf - Placeholder for dynamic configuration
terraform {
  backend "s3" {
    bucket       = ""
    key          = ""
    region       = ""
    encrypt      = ""
    use_lockfile = ""
  }
}
```

The actual backend configuration is generated per account from SSM parameters:

```bash
# Example generated backend.conf
bucket         = "ghostdog-terraform-state-540845145946"
key            = "search-insights-agent/terraform.tfstate"
region         = "us-east-1"
encrypt        = true
use_lockfile   = true
```

### 5. State Management
```hcl
# backend.tf - Remote state configuration
terraform {
  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "env/production/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-state-lock"
  }
}

# Use data source for cross-stack references
data "terraform_remote_state" "networking" {
  backend = "s3"

  config = {
    bucket = "company-terraform-state"
    key    = "global/networking/terraform.tfstate"
    region = "us-east-1"
  }
}

# Reference outputs from other stacks
resource "aws_instance" "app" {
  subnet_id = data.terraform_remote_state.networking.outputs.private_subnet_ids[0]
}
```

### 6. Dynamic Blocks and For Expressions
```hcl
# Dynamic security group rules
resource "aws_security_group" "app" {
  name_prefix = "${local.name_prefix}-app-"
  vpc_id      = var.vpc_id

  dynamic "ingress" {
    for_each = var.ingress_rules

    content {
      description = ingress.value.description
      from_port   = ingress.value.from_port
      to_port     = ingress.value.to_port
      protocol    = ingress.value.protocol
      cidr_blocks = ingress.value.cidr_blocks
    }
  }

  # Always allow egress
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# For expressions for transformation
locals {
  # Convert list to map
  instance_map = {
    for instance in var.instances : instance.name => instance
  }

  # Filter based on condition
  production_instances = [
    for instance in var.instances : instance
    if instance.environment == "production"
  ]
}
```

## AWS Provider Configuration

```hcl
# versions.tf
terraform {
  required_version = "~> 1.5"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }
}

# providers.tf
provider "aws" {
  region = var.aws_region

  # Use assume role for cross-account access
  assume_role {
    role_arn     = var.assume_role_arn
    session_name = "terraform-${var.environment}"
  }

  default_tags {
    tags = local.common_tags
  }
}

# Additional provider for different region
provider "aws" {
  alias  = "us_west_2"
  region = "us-west-2"

  default_tags {
    tags = local.common_tags
  }
}
```

## Dynamic Variable Generation

The tfvars files are generated automatically based on:
- Parsing variables.tf for required variables
- Account-specific values from SSM parameters
- Standard defaults for common settings

```hcl
# Example generated main.tfvars
aws_region = "us-east-1"
environment = "540845145946"  # Account ID as environment
log_retention_days = 30

tags = {
  Environment = "540845145946"
  ManagedBy   = "Terraform"
}
```

## Testing Terraform Code

```hcl
# tests/main.tftest.hcl
run "validate_instance_type" {
  command = plan

  variables {
    instance_type = "t3.micro"
  }

  assert {
    condition     = aws_instance.app.instance_type == var.instance_type
    error_message = "Instance type does not match"
  }
}

run "production_requires_multi_az" {
  command = plan

  variables {
    environment = "production"
  }

  assert {
    condition     = aws_db_instance.main.multi_az == true
    error_message = "Production database must be multi-AZ"
  }
}
```

## Security Patterns

```hcl
# IAM least privilege
data "aws_iam_policy_document" "app" {
  statement {
    effect = "Allow"

    actions = [
      "s3:GetObject",
      "s3:PutObject"
    ]

    resources = [
      "${aws_s3_bucket.app.arn}/*"
    ]
  }

  statement {
    effect = "Allow"

    actions = [
      "kms:Decrypt",
      "kms:GenerateDataKey"
    ]

    resources = [
      aws_kms_key.app.arn
    ]

    condition {
      test     = "StringEquals"
      variable = "kms:ViaService"
      values   = ["s3.${var.aws_region}.amazonaws.com"]
    }
  }
}

# Secrets management
data "aws_secretsmanager_secret" "db_credentials" {
  name = "${local.name_prefix}-db-credentials"
}

data "aws_secretsmanager_secret_version" "db_credentials" {
  secret_id = data.aws_secretsmanager_secret.db_credentials.id
}

locals {
  db_credentials = jsondecode(data.aws_secretsmanager_secret_version.db_credentials.secret_string)
}
```

## AWS Well-Architected Framework Integration

### Operational Excellence
```hcl
# Centralized logging with CloudWatch
resource "aws_cloudwatch_log_group" "application" {
  name              = "/aws/application/${local.name_prefix}"
  retention_in_days = var.log_retention_days
  kms_key_id        = aws_kms_key.logs.arn

  tags = local.common_tags
}

# Enable X-Ray tracing
resource "aws_ecs_service" "app" {
  # ... other configuration ...

  enable_execute_command = true  # ECS Exec for debugging

  service_registries {
    registry_arn = aws_service_discovery_service.app.arn
  }
}

# CloudWatch Dashboard
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${local.name_prefix}-dashboard"

  dashboard_body = templatefile("${path.module}/templates/dashboard.json", {
    region      = data.aws_region.current.name
    environment = var.environment
    alb_arn     = aws_lb.main.arn_suffix
  })
}
```

### Security
```hcl
# KMS encryption for all resources
resource "aws_kms_key" "main" {
  description             = "KMS key for ${local.name_prefix}"
  deletion_window_in_days = 7
  enable_key_rotation     = true

  policy = data.aws_iam_policy_document.kms.json

  tags = local.common_tags
}

# S3 bucket with encryption and versioning
resource "aws_s3_bucket" "app" {
  bucket = "${local.name_prefix}-app-data"

  tags = local.common_tags
}

resource "aws_s3_bucket_versioning" "app" {
  bucket = aws_s3_bucket.app.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_encryption" "app" {
  bucket = aws_s3_bucket.app.id

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        kms_master_key_id = aws_kms_key.main.arn
        sse_algorithm     = "aws:kms"
      }
    }
  }
}
```

### Reliability
```hcl
# Multi-AZ RDS with automated backups
resource "aws_db_instance" "main" {
  identifier = "${local.name_prefix}-db"

  engine         = var.database_config.engine
  engine_version = var.database_config.engine_version
  instance_class = var.database_config.instance_class

  allocated_storage     = var.database_config.allocated_storage
  max_allocated_storage = var.database_config.allocated_storage * 2

  db_name  = var.database_name
  username = local.db_credentials.username
  password = local.db_credentials.password

  # High availability
  multi_az               = var.environment == "production"
  backup_retention_period = var.database_config.backup_config.retention_days
  backup_window          = var.database_config.backup_config.backup_window
  maintenance_window     = var.database_config.backup_config.maintenance_window

  # Security
  storage_encrypted = true
  kms_key_id       = aws_kms_key.main.arn

  vpc_security_group_ids = [aws_security_group.database.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  skip_final_snapshot = var.environment != "production"

  tags = local.common_tags
}
```

### Performance Efficiency
```hcl
# Auto Scaling Group with multiple AZs
resource "aws_autoscaling_group" "app" {
  name                = "${local.name_prefix}-asg"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"

  min_size         = var.asg_min_size
  max_size         = var.asg_max_size
  desired_capacity = var.asg_desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  # Instance refresh for zero-downtime deployments
  instance_refresh {
    strategy = "Rolling"
    preferences {
      min_healthy_percentage = 50
    }
  }

  tag {
    key                 = "Name"
    value               = "${local.name_prefix}-asg"
    propagate_at_launch = true
  }
}

# CloudFront distribution
resource "aws_cloudfront_distribution" "app" {
  origin {
    domain_name = aws_lb.main.dns_name
    origin_id   = "ALB-${local.name_prefix}"

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled = true

  default_cache_behavior {
    allowed_methods        = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "ALB-${local.name_prefix}"
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  tags = local.common_tags
}
```

### Cost Optimization
```hcl
# Spot instances for non-critical workloads
resource "aws_launch_template" "spot" {
  name_prefix   = "${local.name_prefix}-spot-"
  image_id      = data.aws_ami.app.id
  instance_type = var.spot_instance_type

  instance_market_options {
    market_type = "spot"
    spot_options {
      max_price = var.spot_max_price
    }
  }

  vpc_security_group_ids = [aws_security_group.app.id]

  tag_specifications {
    resource_type = "instance"
    tags = merge(local.common_tags, {
      Name = "${local.name_prefix}-spot-instance"
    })
  }
}

# Lifecycle policy for S3 storage optimization
resource "aws_s3_bucket_lifecycle_configuration" "app" {
  bucket = aws_s3_bucket.app.id

  rule {
    id     = "transition_to_ia"
    status = "Enabled"

    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 90
      storage_class = "GLACIER"
    }

    expiration {
      days = 365
    }
  }
}
```

## Common Terraform Commands

```bash
# Initialize working directory
terraform init -upgrade

# Format code
terraform fmt -recursive

# Validate configuration
terraform validate

# Plan with specific variables
terraform plan -var-file=production.tfvars -out=tfplan

# Apply with auto-approve (use cautiously)
terraform apply -auto-approve tfplan

# Import existing resources
terraform import aws_instance.example i-1234567890abcdef0

# Move resources in state
terraform state mv aws_instance.old aws_instance.new

# Replace specific resources
terraform apply -replace="aws_instance.example"

# Destroy with target
terraform destroy -target=aws_instance.example
```

## Validation Commands

```bash
# Terraform validation and planning
terraform init
terraform validate
terraform plan -var-file=production.tfvars
terraform apply -auto-approve

# Security scanning
checkov --framework terraform --directory ./infrastructure
tfsec .
terrascan scan -t terraform

# Cost estimation
infracost breakdown --path .
```

This Terraform configuration ensures secure, scalable, and cost-effective infrastructure deployment following AWS Well-Architected Framework principles and industry best practices.
