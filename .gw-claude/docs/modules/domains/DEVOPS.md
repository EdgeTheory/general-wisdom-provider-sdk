# DevOps Domain Context

## When This Module Loads

**Trigger Keywords**: devops, infrastructure, deployment, ci/cd, docker, kubernetes, terraform, ansible, monitoring

**Intent Patterns**: infrastructure_setup, deployment_automation, monitoring_configuration, cicd_pipeline

**Tools Predicted**: terraform, ansible, docker, kubernetes, jenkins, github actions, prometheus, grafana

## DevOps Engineering Principles

### Infrastructure as Code (IaC)
- **Version Controlled Infrastructure**: All infrastructure defined in code repositories
- **Immutable Infrastructure**: Replace rather than modify infrastructure components
- **Environment Consistency**: Identical environments across development, staging, and production
- **Automated Provisioning**: Scripted infrastructure deployment and configuration
- **Security by Design**: Security controls embedded in infrastructure code

### Continuous Integration/Continuous Deployment
- **Automated Pipelines**: End-to-end automation from code commit to production
- **Testing Gates**: Comprehensive testing at every pipeline stage
- **Deployment Strategies**: Blue-green, canary, and rolling deployment patterns
- **Rollback Capabilities**: Quick and reliable rollback mechanisms
- **Environment Promotion**: Consistent promotion process across environments

### Observability and Monitoring
- **Comprehensive Monitoring**: Infrastructure, application, and business metrics
- **Centralized Logging**: Structured logging with correlation IDs
- **Distributed Tracing**: Request tracing across microservices
- **Alerting Strategy**: Meaningful alerts with clear escalation paths
- **SLA/SLO Management**: Service level objectives with monitoring

### Reliability Engineering
- **High Availability**: Multi-zone deployment with failover capabilities
- **Disaster Recovery**: Automated backup and recovery procedures
- **Chaos Engineering**: Proactive failure testing and resilience validation
- **Capacity Planning**: Proactive scaling based on metrics and forecasts
- **Incident Response**: Structured incident management and post-mortems

## Infrastructure Implementation Patterns

### Terraform Infrastructure
```hcl
# main.tf - AWS EKS Cluster with best practices
terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.23"
    }
  }

  backend "s3" {
    bucket         = "company-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-west-2"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name        = "${var.project_name}-vpc"
    Environment = var.environment
  }
}

resource "aws_subnet" "private" {
  count = length(var.availability_zones)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnets[count.index]
  availability_zone = var.availability_zones[count.index]

  tags = {
    Name                              = "${var.project_name}-private-${count.index + 1}"
    Environment                       = var.environment
    "kubernetes.io/role/internal-elb" = "1"
  }
}

resource "aws_subnet" "public" {
  count = length(var.availability_zones)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnets[count.index]
  availability_zone       = var.availability_zones[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name                     = "${var.project_name}-public-${count.index + 1}"
    Environment              = var.environment
    "kubernetes.io/role/elb" = "1"
  }
}

# EKS Cluster
resource "aws_eks_cluster" "main" {
  name     = "${var.project_name}-eks"
  role_arn = aws_iam_role.cluster.arn
  version  = var.kubernetes_version

  vpc_config {
    subnet_ids              = concat(aws_subnet.private[*].id, aws_subnet.public[*].id)
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = var.cluster_endpoint_public_access_cidrs
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.eks.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  depends_on = [
    aws_iam_role_policy_attachment.cluster_policy,
    aws_iam_role_policy_attachment.vpc_resource_controller,
    aws_cloudwatch_log_group.cluster,
  ]

  tags = {
    Environment = var.environment
  }
}

# Node Groups
resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.project_name}-nodes"
  node_role_arn   = aws_iam_role.nodes.arn
  subnet_ids      = aws_subnet.private[*].id

  capacity_type  = "ON_DEMAND"
  instance_types = var.node_instance_types

  scaling_config {
    desired_size = var.node_desired_size
    max_size     = var.node_max_size
    min_size     = var.node_min_size
  }

  update_config {
    max_unavailable_percentage = 25
  }

  # Launch template for custom AMI and user data
  launch_template {
    id      = aws_launch_template.nodes.id
    version = aws_launch_template.nodes.latest_version
  }

  depends_on = [
    aws_iam_role_policy_attachment.nodes_policy,
    aws_iam_role_policy_attachment.cni_policy,
    aws_iam_role_policy_attachment.registry_policy,
  ]

  tags = {
    Environment = var.environment
  }
}
```

### CI/CD Pipeline (GitHub Actions)
```yaml
# .github/workflows/deploy.yml
name: Deploy to Kubernetes

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}
  CLUSTER_NAME: production-eks
  AWS_REGION: us-west-2

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 3s
          --health-retries 5

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install -r requirements-dev.txt

      - name: Run linting
        run: |
          flake8 .
          black --check .
          isort --check-only .

      - name: Run type checking
        run: mypy .

      - name: Run tests
        run: |
          pytest tests/ --cov=. --cov-report=xml --cov-report=html
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379

      - name: Security scan
        run: |
          bandit -r . -f json -o bandit-report.json
          safety check --json --output safety-report.json

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage.xml

  build:
    needs: test
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    outputs:
      image-digest: ${{ steps.build.outputs.digest }}
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=sha,prefix={{branch}}-
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push Docker image
        id: build
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  security-scan:
    needs: build
    runs-on: ubuntu-latest
    if: github.event_name == 'push'

    steps:
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ needs.build.outputs.image-tag }}
          format: 'sarif'
          output: 'trivy-results.sarif'

      - name: Upload Trivy scan results to GitHub Security tab
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'

  deploy-staging:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'

    environment:
      name: staging
      url: https://staging.example.com

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name staging-eks

      - name: Deploy to staging
        run: |
          helm upgrade --install myapp ./helm/myapp \
            --namespace staging \
            --create-namespace \
            --set image.repository=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }} \
            --set image.tag=${{ github.sha }} \
            --set environment=staging \
            --wait --timeout=10m

      - name: Run smoke tests
        run: |
          kubectl wait --for=condition=ready pod -l app=myapp -n staging --timeout=300s
          ./scripts/smoke-tests.sh https://staging.example.com

  deploy-production:
    needs: [build, security-scan]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    environment:
      name: production
      url: https://example.com

    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_PROD_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig --region ${{ env.AWS_REGION }} --name ${{ env.CLUSTER_NAME }}

      - name: Deploy to production (Blue/Green)
        run: |
          # Deploy to green environment
          helm upgrade --install myapp-green ./helm/myapp \
            --namespace production \
            --set image.repository=${{ env.REGISTRY }}/${{ env.IMAGE_NAME }} \
            --set image.tag=${{ github.sha }} \
            --set environment=production \
            --set deployment.name=myapp-green \
            --wait --timeout=15m

          # Run health checks
          ./scripts/health-check.sh production myapp-green

          # Switch traffic (Blue/Green deployment)
          kubectl patch service myapp -n production -p '{"spec":{"selector":{"version":"green"}}}'

          # Wait and verify
          sleep 60
          ./scripts/health-check.sh production myapp

          # Clean up old blue deployment
          helm uninstall myapp-blue -n production || true
```

### Kubernetes Deployment (Helm)
```yaml
# helm/myapp/templates/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "myapp.fullname" . }}
  namespace: {{ .Values.namespace }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      {{- include "myapp.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      annotations:
        checksum/config: {{ include (print $.Template.BasePath "/configmap.yaml") . | sha256sum }}
        prometheus.io/scrape: "true"
        prometheus.io/port: "8000"
        prometheus.io/path: "/metrics"
      labels:
        {{- include "myapp.selectorLabels" . | nindent 8 }}
        version: {{ .Values.image.tag | default .Chart.AppVersion }}
    spec:
      serviceAccountName: {{ include "myapp.serviceAccountName" . }}
      securityContext:
        {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
      - name: {{ .Chart.Name }}
        image: "{{ .Values.image.repository }}:{{ .Values.image.tag | default .Chart.AppVersion }}"
        imagePullPolicy: {{ .Values.image.pullPolicy }}
        ports:
        - name: http
          containerPort: 8000
          protocol: TCP
        - name: metrics
          containerPort: 8001
          protocol: TCP
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: {{ include "myapp.fullname" . }}-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: {{ include "myapp.fullname" . }}-secrets
              key: redis-url
        - name: ENVIRONMENT
          value: {{ .Values.environment }}
        envFrom:
        - configMapRef:
            name: {{ include "myapp.fullname" . }}-config
        livenessProbe:
          httpGet:
            path: /health
            port: http
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
          failureThreshold: 3
        readinessProbe:
          httpGet:
            path: /ready
            port: http
          initialDelaySeconds: 5
          periodSeconds: 5
          timeoutSeconds: 3
          failureThreshold: 3
        resources:
          {{- toYaml .Values.resources | nindent 12 }}
        securityContext:
          {{- toYaml .Values.securityContext | nindent 12 }}
        volumeMounts:
        - name: tmp
          mountPath: /tmp
        - name: cache
          mountPath: /app/cache
      volumes:
      - name: tmp
        emptyDir: {}
      - name: cache
        emptyDir: {}
      {{- with .Values.nodeSelector }}
      nodeSelector:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.affinity }}
      affinity:
        {{- toYaml . | nindent 8 }}
      {{- end }}
      {{- with .Values.tolerations }}
      tolerations:
        {{- toYaml . | nindent 8 }}
      {{- end }}

---
apiVersion: v1
kind: Service
metadata:
  name: {{ include "myapp.fullname" . }}
  namespace: {{ .Values.namespace }}
  labels:
    {{- include "myapp.labels" . | nindent 4 }}
spec:
  type: {{ .Values.service.type }}
  ports:
  - port: 80
    targetPort: http
    protocol: TCP
    name: http
  selector:
    {{- include "myapp.selectorLabels" . | nindent 4 }}

---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ include "myapp.fullname" . }}
  namespace: {{ .Values.namespace }}
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - {{ .Values.ingress.host }}
    secretName: {{ include "myapp.fullname" . }}-tls
  rules:
  - host: {{ .Values.ingress.host }}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: {{ include "myapp.fullname" . }}
            port:
              number: 80
```

### Monitoring Configuration
```yaml
# monitoring/prometheus-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: prometheus-config
  namespace: monitoring
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
        - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
          action: replace
          regex: ([^:]+)(?::\d+)?;(\d+)
          replacement: $1:$2
          target_label: __address__

      - job_name: 'kubernetes-nodes'
        kubernetes_sd_configs:
        - role: node
        relabel_configs:
        - action: labelmap
          regex: __meta_kubernetes_node_label_(.+)
        - target_label: __address__
          replacement: kubernetes.default.svc:443
        - source_labels: [__meta_kubernetes_node_name]
          regex: (.+)
          target_label: __metrics_path__
          replacement: /api/v1/nodes/${1}/proxy/metrics

---
apiVersion: v1
kind: ConfigMap
metadata:
  name: alert-rules
  namespace: monitoring
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
        expr: (container_memory_usage_bytes / container_spec_memory_limit_bytes) > 0.9
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: High memory usage
          description: "Memory usage is above 90% for {{ $labels.container }}"

      - alert: PodCrashLooping
        expr: increase(kube_pod_container_status_restarts_total[15m]) > 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: Pod is crash looping
          description: "Pod {{ $labels.pod }} in namespace {{ $labels.namespace }} is crash looping"
```

## Validation Commands

### Infrastructure Validation
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

# Kubernetes validation
kubectl apply --dry-run=client -f k8s/
kubeval k8s/*.yaml
kube-score score k8s/*.yaml
```

### Deployment Testing
```bash
# Container security scanning
docker scout cves myapp:latest
trivy image myapp:latest
hadolint Dockerfile

# CI/CD pipeline testing
act -j test  # Test GitHub Actions locally
gh workflow run deploy.yml

# Load testing
k6 run --vus 50 --duration 2m load-test.js
artillery run --target https://api.example.com stress-test.yml
```

### Monitoring and Alerting
```bash
# Prometheus query testing
promtool query instant 'up'
promtool test rules alert_rules.yml

# Grafana dashboard validation
curl -X POST https://grafana.example.com/api/dashboards/db

# Log aggregation testing
curl -X POST "http://elasticsearch:9200/_search" -H 'Content-Type: application/json'
```

This DevOps domain ensures robust, automated, and scalable infrastructure with comprehensive CI/CD pipelines, monitoring, and reliability engineering practices.
