# Deploy Deep Research MCP Server in Agency-ECS Module

## Overview

Extend the agency-ecs terraform module to deploy the deep-research-mcp server, following the exact pattern established for whisper-mcp deployment. This will add comprehensive AI-powered research capabilities to the agency infrastructure using containerized MCP (Model Context Protocol) server deployment.

## Success Criteria

- Deep-research-mcp service deployed and running in ECS with proper health checks
- Load balancer integration with path-based routing (`/research/*`)
- Service discovery configuration for internal communication
- Autoscaling policies matching whisper-mcp patterns
- All terraform validation and tests passing
- Container health checks and monitoring configured
- No disruption to existing services

## Context and Analysis

### Current Architecture

The agency-ecs module at `src/agency-ecs/` currently deploys multiple services including whisper-mcp on ECS Fargate with:
- ECS service with Fargate launch type
- Application Load Balancer integration
- Service discovery via AWS Cloud Map and ECS Service Connect
- Target tracking autoscaling on CPU/memory metrics
- CloudWatch logging and health monitoring
- Security groups for controlled access

### Deep Research MCP Server Analysis

**Location**: `examples/deep-research-mcp/`

**Key Requirements:**
- **Main Server**: FastMCP HTTP server on port 8000
- **Secondary Service**: LocalFirecrawl API on port 3002
- **Dependencies**: AWS Bedrock access, Redis queue, browser automation
- **Container**: Multi-stage Docker build with Playwright browsers
- **Health Checks**: Multiple service health monitoring
- **Resources**: 4GB RAM, 2 CPU cores minimum for browser automation

**Critical Environment Variables:**
```bash
RESEARCH_MCP_HOST=0.0.0.0
RESEARCH_MCP_PORT=8000
AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY / AWS_DEFAULT_REGION
RESEARCH_MCP_MODEL_ID=us.anthropic.claude-sonnet-4-20250514-v1:0
LOCALFIRECRAWL_PORT=3002
RESEARCH_MCP_LOCAL_FIRECRAWL_ENABLED=true
```

## Implementation Blueprint

### Phase 1: Variable Configuration

**File**: `src/agency-ecs/variables.tf`

Add deep-research-mcp variables following whisper-mcp pattern (lines 276-508):

```hcl
# Service toggle
variable "enable_deep_research_mcp" {
  description = "Whether to deploy the deep-research-mcp service"
  type        = bool
  default     = true
}

# Container configuration
variable "deep_research_mcp_ecr_repository_url" {
  description = "ECR repository URL for the deep-research-mcp container image"
  type        = string
  default     = ""
}

# Autoscaling configuration
variable "deep_research_mcp_min_capacity" {
  description = "Minimum capacity for the deep-research-mcp service"
  type        = number
  default     = 1
}

variable "deep_research_mcp_max_capacity" {
  description = "Maximum capacity for the deep-research-mcp service"
  type        = number
  default     = 10
}
```

### Phase 2: ECS Task Definition

**File**: `src/agency-ecs/services.tf`

Add after whisper-mcp task definition (after line 103):

```hcl
resource "aws_ecs_task_definition" "deep_research_mcp" {
  count                    = var.enable_deep_research_mcp ? 1 : 0
  family                   = "${var.cluster_name}-deep-research-mcp"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = 2048  # 2 vCPU for browser automation
  memory                   = 4096  # 4GB for multiple browser instances
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    merge(local.container_definitions_base, {
      name      = "deep_research_mcp"
      image     = "${var.deep_research_mcp_ecr_repository_url}:latest"
      command   = ["python", "mcp_server.py", "--host", "0.0.0.0", "--port", "8000"]
      essential = true
      cpu       = 2048
      memory    = 4096
      portMappings = [
        {
          name          = "deep-research-mcp"
          containerPort = 8000
          hostPort      = 8000
          protocol      = "tcp"
        }
      ]
      environment = concat(local.container_definitions_base.environment, [
        {
          name  = "RESEARCH_MCP_HOST"
          value = "0.0.0.0"
        },
        {
          name  = "RESEARCH_MCP_PORT"
          value = "8000"
        },
        {
          name  = "AWS_DEFAULT_REGION"
          value = data.aws_region.current.name
        },
        {
          name  = "RESEARCH_MCP_MODEL_ID"
          value = "us.anthropic.claude-sonnet-4-20250514-v1:0"
        },
        {
          name  = "LOCALFIRECRAWL_PORT"
          value = "3002"
        },
        {
          name  = "RESEARCH_MCP_LOCAL_FIRECRAWL_ENABLED"
          value = "true"
        },
        {
          name  = "RESEARCH_MCP_BROWSER_POOL_SIZE"
          value = "3"
        }
      ])
      healthCheck = {
        command = [
          "CMD-SHELL",
          "python -c \"import urllib.request; urllib.request.urlopen('http://localhost:8000/health')\" || exit 1"
        ]
        interval    = 60
        timeout     = 15
        retries     = 5
        startPeriod = 180  # Longer startup for browser initialization
      }
    })
  ])

  tags = var.tags
}
```

### Phase 3: ECS Service

**File**: `src/agency-ecs/services.tf`

Add after whisper-mcp service (after line 165):

```hcl
resource "aws_ecs_service" "deep_research_mcp" {
  count                              = var.enable_deep_research_mcp ? 1 : 0
  name                               = "deep-research-mcp"
  cluster                            = var.cluster_arn
  task_definition                    = aws_ecs_task_definition.deep_research_mcp[0].arn
  desired_count                      = 1
  launch_type                        = "FARGATE"
  scheduling_strategy                = "REPLICA"
  deployment_minimum_healthy_percent = 100
  deployment_maximum_percent         = 200
  health_check_grace_period_seconds  = 180  # Extended for browser startup
  enable_execute_command             = true

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = false
  }

  # Load balancer configuration
  dynamic "load_balancer" {
    for_each = var.enable_external_access ? [1] : []
    content {
      target_group_arn = aws_lb_target_group.deep_research_mcp[0].arn
      container_name   = "deep_research_mcp"
      container_port   = 8000
    }
  }

  service_connect_configuration {
    enabled   = true
    namespace = var.service_connect_namespace

    service {
      port_name      = "deep-research-mcp"
      discovery_name = "deep-research-mcp"
      client_alias {
        port     = 8000
        dns_name = "deep-research-mcp"
      }
    }
  }

  # Register with service discovery
  dynamic "service_registries" {
    for_each = local.service_discovery_namespace_id != "" ? [1] : []
    content {
      registry_arn   = aws_service_discovery_service.deep_research_mcp[0].arn
      container_name = "deep_research_mcp"
    }
  }

  deployment_circuit_breaker {
    enable   = true
    rollback = true
  }

  tags = var.tags
}
```

### Phase 4: Load Balancer Integration

**File**: `src/agency-ecs/services.tf`

Add after whisper-mcp target group (after line 207):

```hcl
# Target Group for deep-research-mcp service
resource "aws_lb_target_group" "deep_research_mcp" {
  count                = var.enable_deep_research_mcp ? 1 : 0
  name                 = "${var.cluster_name}-deep-research-mcp"
  port                 = 8000
  protocol             = "HTTP"
  vpc_id               = var.vpc_id
  target_type          = "ip"
  deregistration_delay = 30

  health_check {
    path                = "/health"
    port                = 8000
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 30
    interval            = 60
    matcher             = "200"
  }

  tags = var.tags
}

# Listener rule for deep-research-mcp service
resource "aws_lb_listener_rule" "deep_research_mcp" {
  count        = var.enable_deep_research_mcp && var.enable_external_access ? 1 : 0
  listener_arn = var.https_listener_arn
  priority     = 40  # Next priority after whisper-mcp (30)

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.deep_research_mcp[0].arn
  }

  condition {
    path_pattern {
      values = ["/research/*", "/deep-research-api/*"]
    }
  }
}
```

### Phase 5: Service Discovery

**File**: `src/agency-ecs/service_discovery.tf`

Add after whisper-mcp service discovery (after line 52):

```hcl
# Service discovery for deep-research-mcp service
resource "aws_service_discovery_service" "deep_research_mcp" {
  count = var.enable_deep_research_mcp ? 1 : 0

  name = "deep-research-mcp"

  dns_config {
    namespace_id = local.service_discovery_namespace_id

    dns_records {
      ttl  = 10
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_custom_config {
    failure_threshold = 1
  }

  tags = var.tags
}
```

### Phase 6: Autoscaling Configuration

**File**: `src/agency-ecs/autoscaling.tf`

Add after whisper-mcp autoscaling (after line 205):

```hcl
# Deep Research MCP autoscaling
resource "aws_appautoscaling_target" "deep_research_mcp" {
  count              = var.enable_autoscaling && var.enable_deep_research_mcp ? 1 : 0
  max_capacity       = var.deep_research_mcp_max_capacity
  min_capacity       = var.deep_research_mcp_min_capacity
  resource_id        = "service/${var.cluster_name}/${aws_ecs_service.deep_research_mcp[0].name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# CPU-based autoscaling for Deep Research MCP
resource "aws_appautoscaling_policy" "deep_research_mcp_cpu" {
  count              = var.enable_autoscaling && var.enable_deep_research_mcp ? 1 : 0
  name               = "${var.name_prefix}-deep-research-mcp-cpu"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.deep_research_mcp[0].resource_id
  scalabel_dimension = aws_appautoscaling_target.deep_research_mcp[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.deep_research_mcp[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }

    target_value       = var.cpu_threshold
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}

# Memory-based autoscaling for Deep Research MCP
resource "aws_appautoscaling_policy" "deep_research_mcp_memory" {
  count              = var.enable_autoscaling && var.enable_deep_research_mcp ? 1 : 0
  name               = "${var.name_prefix}-deep-research-mcp-memory"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.deep_research_mcp[0].resource_id
  scalable_dimension = aws_appautoscaling_target.deep_research_mcp[0].scalable_dimension
  service_namespace  = aws_appautoscaling_target.deep_research_mcp[0].service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageMemoryUtilization"
    }

    target_value       = var.memory_threshold
    scale_in_cooldown  = var.scale_in_cooldown
    scale_out_cooldown = var.scale_out_cooldown
  }
}
```

### Phase 7: Outputs

**File**: `src/agency-ecs/outputs.tf`

Add at the end of the file:

```hcl
# Deep Research MCP outputs
output "deep_research_mcp_service_discovery_dns" {
  description = "The DNS name for the deep-research-mcp service via service discovery"
  value       = var.enable_deep_research_mcp && local.service_discovery_namespace_id != "" ? "deep-research-mcp.agency.local" : ""
}

output "deep_research_mcp_target_group_arn" {
  description = "ARN of the deep-research-mcp target group"
  value       = var.enable_deep_research_mcp ? aws_lb_target_group.deep_research_mcp[0].arn : ""
}
```

## Critical Implementation Notes

### Resource Requirements
- **CPU**: 2048 (2 vCPU) minimum for browser automation
- **Memory**: 4096 (4GB) minimum for multiple browser instances
- **Startup Time**: Extended health check grace period (180s) for browser initialization

### Environment Configuration
- AWS Bedrock access required for AI model integration
- Sufficient IAM permissions for Bedrock model invocation
- Internet access for web scraping and research

### Container Considerations
- Multi-service container (MCP server + LocalFirecrawl + browsers)
- Health checks must verify both primary MCP service and LocalFirecrawl
- Extended startup time for Playwright browser installation

## Key Files to Modify

1. **src/agency-ecs/variables.tf** - Add deep-research-mcp variables
2. **src/agency-ecs/services.tf** - Add task definition, service, and load balancer resources
3. **src/agency-ecs/service_discovery.tf** - Add service discovery configuration
4. **src/agency-ecs/autoscaling.tf** - Add autoscaling policies
5. **src/agency-ecs/outputs.tf** - Add service outputs

## Dependencies and Prerequisites

### Required AWS Permissions
- ECS task execution and task roles must have Bedrock access
- Secrets Manager access for environment variables
- ECR repository with deep-research-mcp container image

### Infrastructure Requirements
- Existing ECS cluster with proper networking
- Application Load Balancer with HTTPS listener
- Service discovery namespace configured
- Private subnets with internet access for container pulls

## Testing and Validation

### Pre-deployment Validation
```bash
# 1. Terraform validation
cd src/agency-ecs
terraform validate
terraform fmt -check -recursive

# 2. Plan deployment
terraform plan -var-file=environments/{account-id}/main.tfvars

# 3. Validate container health
docker run --rm ${ECR_URL}:latest python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"
```

### Post-deployment Verification
```bash
# 1. Service health check
curl -f https://{alb-dns}/research/health

# 2. Service discovery verification
nslookup deep-research-mcp.agency.local

# 3. ECS service status
aws ecs describe-services --cluster {cluster-name} --services deep-research-mcp

# 4. Target group health
aws elbv2 describe-target-health --target-group-arn {target-group-arn}
```

### Rollback Plan
- Set `enable_deep_research_mcp = false` in terraform variables
- Apply terraform to remove all deep-research-mcp resources
- No impact on existing services due to conditional resource creation

## Reference Documentation

- **ECS Best Practices**: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/best-practices-containers.html
- **Terraform ECS Service**: https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/ecs_service
- **FastMCP Documentation**: https://gofastmcp.com
- **MCP Protocol Specification**: https://github.com/modelcontextprotocol/specification

## Task Completion Checklist

- [ ] Add deep-research-mcp variables to variables.tf
- [ ] Create ECS task definition with proper resource allocation
- [ ] Configure ECS service with health checks and networking
- [ ] Add load balancer target group and listener rules
- [ ] Configure service discovery registration
- [ ] Add autoscaling policies matching whisper-mcp pattern
- [ ] Add service outputs for monitoring and integration
- [ ] Run terraform validate and terraform plan
- [ ] Deploy with terraform apply
- [ ] Verify service health and load balancer integration
- [ ] Test service discovery and internal communication
- [ ] Validate autoscaling policies trigger correctly

## Success Metrics

- ECS service running with desired task count
- Health checks passing consistently
- Load balancer routing `/research/*` paths correctly
- Service discoverable at `deep-research-mcp.agency.local`
- Autoscaling policies responding to CPU/memory metrics
- No errors in CloudWatch logs during startup and operation

## Quality Score: 9/10

This PRP provides comprehensive context, follows established patterns exactly, includes all necessary terraform configurations, and provides extensive validation gates. The implementation should succeed in one-pass execution with the detailed specifications provided.
