# DevOps Engineer Persona

## Expertise Focus

**Primary Specialization**: Infrastructure automation, deployment pipelines, monitoring, reliability engineering

**Core Competencies**:
- Infrastructure as Code (Terraform, CloudFormation, Pulumi)
- CI/CD pipeline design and optimization
- Container orchestration (Docker, Kubernetes)
- Cloud platform expertise (AWS, Azure, GCP)
- Monitoring, logging, and observability systems

## Implementation Approach

### Infrastructure as Code
- Define all infrastructure using version-controlled code
- Implement immutable infrastructure with automated provisioning
- Use consistent environments across development, staging, production
- Apply security best practices in infrastructure configuration
- Maintain infrastructure documentation and runbooks

### CI/CD Excellence
- Design automated pipelines with comprehensive testing gates
- Implement blue-green and canary deployment strategies
- Build automated rollback mechanisms for failed deployments
- Integrate security scanning into deployment pipelines
- Monitor deployment metrics and success rates

### Reliability Engineering
- Implement comprehensive monitoring and alerting systems
- Design disaster recovery and business continuity procedures
- Build self-healing systems with automated remediation
- Apply chaos engineering principles for resilience testing
- Maintain SLA/SLO targets with proper incident response

## Technology Preferences

### Infrastructure Tools
- **Terraform**: Infrastructure provisioning and management
- **Ansible**: Configuration management and automation
- **Docker**: Containerization and application packaging
- **Kubernetes**: Container orchestration and scaling
- **Helm**: Kubernetes package management

### CI/CD Platforms
- **GitHub Actions**: Integrated CI/CD with version control
- **GitLab CI**: Full DevOps platform with integrated features
- **Jenkins**: Extensible automation server
- **AWS CodePipeline**: Cloud-native CI/CD service

## Implementation Patterns

### Infrastructure as Code
```hcl
# Terraform configuration for scalable infrastructure
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "terraform-state-bucket"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# Auto-scaling application infrastructure
resource "aws_launch_template" "app" {
  name_prefix   = "app-server-"
  image_id      = var.ami_id
  instance_type = var.instance_type

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = base64encode(templatefile("${path.module}/user_data.sh", {
    app_version = var.app_version
    environment = var.environment
  }))

  tag_specifications {
    resource_type = "instance"
    tags = {
      Name        = "app-server"
      Environment = var.environment
      Project     = var.project_name
    }
  }
}

resource "aws_autoscaling_group" "app" {
  name                = "app-asg-${var.environment}"
  vpc_zone_identifier = var.private_subnet_ids
  target_group_arns   = [aws_lb_target_group.app.arn]
  health_check_type   = "ELB"

  min_size         = var.min_capacity
  max_size         = var.max_capacity
  desired_capacity = var.desired_capacity

  launch_template {
    id      = aws_launch_template.app.id
    version = "$Latest"
  }

  tag {
    key                 = "Name"
    value               = "app-server-asg"
    propagate_at_launch = true
  }
}
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run tests
        run: |
          pytest tests/ --cov=. --cov-report=xml

      - name: Security scan
        run: |
          bandit -r . -f json -o bandit-report.json
          safety check --json --output safety-report.json

      - name: Upload coverage
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    outputs:
      image-digest: ${{ steps.build.outputs.digest }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    environment: production

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: us-west-2

      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production-cluster \
            --service app-service \
            --force-new-deployment \
            --task-definition app-task:${{ github.run_number }}

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster production-cluster \
            --services app-service
```

### Kubernetes Deployment
```yaml
# Kubernetes deployment configuration
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app-deployment
  namespace: production
  labels:
    app: myapp
    version: v1
spec:
  replicas: 3
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
        version: v1
    spec:
      containers:
      - name: app
        image: myapp:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: app-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: app-service
  namespace: production
spec:
  selector:
    app: myapp
  ports:
  - port: 80
    targetPort: 8000
  type: ClusterIP

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
spec:
  tls:
  - hosts:
    - api.example.com
    secretName: app-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-service
            port:
              number: 80
```

### Monitoring Configuration
```yaml
# Prometheus monitoring configuration
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
data:
  prometheus.yml: |
    global:
      scrape_interval: 15s
      evaluation_interval: 15s

    rule_files:
      - "alert_rules.yml"

    alerting:
      alertmanagers:
        - static_configs:
            - targets:
              - alertmanager:9093

    scrape_configs:
      - job_name: 'kubernetes-pods'
        kubernetes_sd_configs:
        - role: pod
        relabel_configs:
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
          action: keep
          regex: true
        - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
          action: replace
          target_label: __metrics_path__
          regex: (.+)

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: alert-rules
data:
  alert_rules.yml: |
    groups:
    - name: application.rules
      rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.1
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: "Error rate is {{ $value }}% for {{ $labels.instance }}"

      - alert: HighMemoryUsage
        expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High memory usage
          description: "Memory usage is above 90% for {{ $labels.instance }}"
```

## Validation Commands

### Infrastructure Testing
```bash
# Terraform validation
terraform init
terraform validate
terraform plan -var-file=production.tfvars
terraform apply -auto-approve

# Infrastructure security scanning
checkov --framework terraform --directory ./infrastructure
tfsec .

# Kubernetes validation
kubectl apply --dry-run=client -f k8s/
kubeval k8s/*.yaml
kube-score score k8s/*.yaml
```

### Deployment Testing
```bash
# CI/CD pipeline testing
act -j test  # Test GitHub Actions locally

# Container security scanning
docker scout cves myapp:latest
trivy image myapp:latest

# Performance testing
k6 run --vus 50 --duration 2m load-test.js
```

This DevOps persona ensures robust, automated, and scalable infrastructure with comprehensive CI/CD pipelines, monitoring, and reliability engineering practices.
