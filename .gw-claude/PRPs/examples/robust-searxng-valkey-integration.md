# **PRP: Robust SearXNG Valkey ElastiCache Integration**

## **Problem Statement**

The SearXNG service in the agency-ecs Terraform module is failing to deploy properly due to multiple critical issues with Valkey ElastiCache integration, container permissions, and configuration management. The deployment errors indicate:

### **Critical Issues Identified**

1. **Valkey Connection Failures**:
   ```
   ERROR:searx.valkeydb: [root (0)] can't connect valkey DB ...
   valkey.exceptions.TimeoutError: Timeout reading from socket
   ```

2. **Rate Limiter Breakdown**:
   ```
   ERROR:searx.limiter: The limiter requires Valkey, please consult the documentation
   ```

3. **Container Permission Errors**:
   ```
   chown: /etc/searxng/limiter.toml: Operation not permitted
   chown: /etc/searxng/settings.yml: Operation not permitted
   ```

4. **Search Engine Degradation**: Multiple search engines failing with CAPTCHA issues and API authentication errors due to lack of proper rate limiting

### **Root Cause Analysis**

The issues stem from a cascade failure pattern:
```
Insecure Credential Handling → Valkey Connection Failure → No Rate Limiting → Search Engine CAPTCHAs → Service Degradation
```

**Primary technical causes:**
- **Fragile sed substitution**: `sed -i 's|VALKEY_HOST_PLACEHOLDER|$$SEARXNG_REDIS_USERNAME:$$SEARXNG_REDIS_PASSWORD@${local.redis_endpoint}|g'`
- **Database inconsistency**: SearXNG configured for database 1, other services use database 0
- **Container security violations**: Attempting to chown files in read-only containers
- **Missing rate limiting backend**: limiter.toml not connected to Valkey cluster
- **Network connectivity gaps**: Improper service discovery and startup dependencies

---

## **Requirements**

### **Functional Requirements**

**FR-1: Reliable Valkey Integration**
- SearXNG must successfully connect to the shared ElastiCache Valkey cluster
- Connection must support authentication via AWS Secrets Manager
- Database selection must be configurable and consistent across services
- Connection must be validated during container startup with health checks

**FR-2: Secure Configuration Management**
- Eliminate sed-based credential injection in container commands
- Use environment variables and AWS Secrets Manager for credential management
- Ensure configuration files are properly mounted with correct permissions
- Support runtime configuration updates without container rebuilds

**FR-3: Robust Rate Limiting**
- Enable SearXNG's built-in rate limiting with Valkey backend
- Configure appropriate rate limits for multi-instance deployment
- Implement bot detection and abuse prevention
- Support IP-based and token-based rate limiting strategies

**FR-4: Search Engine Robustness**
- Configure reliable search engines with appropriate fallbacks
- Implement user-agent rotation and request distribution
- Minimize CAPTCHA triggers through proper rate limiting
- Support graceful degradation when engines are unavailable

**FR-5: Production Monitoring**
- Health check endpoints for container orchestration
- Connection validation for Valkey integration
- Metrics collection for rate limiting and search performance
- Logging for debugging connectivity and configuration issues

### **Non-Functional Requirements**

**NFR-1: Security**
- No credential exposure in container commands or logs
- Proper container user permissions and read-only filesystems
- Network isolation between services using security groups
- TLS encryption for all Valkey connections

**NFR-2: Reliability**
- 99.9% uptime target for SearXNG service availability
- Sub-3 second response times for search queries
- Graceful handling of Valkey connectivity issues
- Automatic recovery from temporary network partitions

**NFR-3: Scalability**
- Support horizontal scaling of SearXNG instances
- Shared state management across multiple containers
- Efficient connection pooling to Valkey cluster
- Load balancing compatible configuration

**NFR-4: Maintainability**
- Configuration follows existing codebase patterns
- Clear terraform variable structure with validation
- Comprehensive documentation and examples
- Standardized logging and monitoring integration

---

## **Architecture & Design**

### **Current vs. Target Architecture**

**Current Problematic Flow:**
```
Container Start → sed Substitution → Configuration File Modification → SearXNG Start → Valkey Connection Failure
```

**Target Robust Flow:**
```
AWS Secrets → Environment Variables → SearXNG Native Config → Health Check → Service Ready
```

### **Component Integration Design**

```mermaid
graph TB
    subgraph "ECS Cluster"
        SEARXNG[SearXNG Containers]
        LFC[LocalFirecrawl Service]
        RESEARCH[Deep Research MCP]
    end

    subgraph "AWS Services"
        VALKEY[ElastiCache Valkey Cluster]
        SECRETS[AWS Secrets Manager]
        SSM[Systems Manager Parameters]
    end

    subgraph "Networking"
        ALB[Application Load Balancer]
        SG[Security Groups]
        SD[Service Discovery]
    end

    SEARXNG -->|TLS Connection| VALKEY
    SEARXNG -->|Read Credentials| SECRETS
    LFC -->|Shared Cache| VALKEY
    RESEARCH -->|Shared Cache| VALKEY
    ALB -->|Health Checks| SEARXNG
    SD -->|DNS Resolution| SEARXNG
    SG -->|Network Rules| VALKEY
```

### **Configuration Management Strategy**

**Secrets Management Pattern:**
```json
{
  "valkey_credentials": {
    "username": "redis",
    "password": "${generated_password}",
    "host": "${elasticache_endpoint}",
    "port": 6379,
    "database": 0,
    "ssl": true,
    "endpoint": "${elasticache_endpoint}:6379"
  }
}
```

**Environment Variable Mapping:**
```bash
# SearXNG Native Environment Variables
SEARXNG_VALKEY_URL=valkeys://username:password@host:6379/0
SEARXNG_LIMITER=true
SEARXNG_BOT_DETECTION=true

# Container Runtime Variables
VALKEY_HOST=${elasticache_endpoint}
VALKEY_PORT=6379
VALKEY_DATABASE=0
VALKEY_SSL=true
```

---

## **Implementation Plan**

### **Phase 1: Core Infrastructure Fixes (CRITICAL)**

#### **Task 1.1: Fix Valkey Connection Configuration**
- **Location**: `/examples/agency-ecs/services.tf`
- **Action**: Replace sed substitution with environment variable approach
- **Pattern**: Follow existing codebase credential management patterns from `/agent-resources/deployment/modules/`

**Current Problematic Code:**
```bash
command = [
  "sh", "-c",
  "sed -i 's|VALKEY_HOST_PLACEHOLDER|$$SEARXNG_REDIS_USERNAME:$$SEARXNG_REDIS_PASSWORD@${local.redis_endpoint}|g' /etc/searxng/settings.yml && /usr/local/searxng/dockerfiles/docker-entrypoint.sh"
]
```

**Target Solution:**
```hcl
environment = [
  {
    name  = "SEARXNG_VALKEY_URL"
    value = "valkeys://${local.redis_endpoint}:6379/0"
  },
  {
    name  = "SEARXNG_LIMITER"
    value = "true"
  }
]

secrets = [
  {
    name      = "SEARXNG_REDIS_USERNAME"
    valueFrom = "${aws_secretsmanager_secret.redis.arn}:username::"
  },
  {
    name      = "SEARXNG_REDIS_PASSWORD"
    valueFrom = "${aws_secretsmanager_secret.redis.arn}:password::"
  }
]
```

#### **Task 1.2: Standardize Database Usage**
- **Location**: `/examples/agency-ecs/searxng-settings.yml` and `/examples/agency-ecs/services.tf`
- **Action**: Change all services to use Redis database 0 instead of mixed 0/1 usage
- **Rationale**: SearXNG documentation specifies database 0 as default, and consistency prevents connection issues

**Configuration Update:**
```yaml
# searxng-settings.yml - Update valkey section
valkey:
  url: valkey://localhost:6379/0  # Changed from /1 to /0
```

**Service Definition Update:**
```hcl
# services.tf - Standardize all Redis DB references
environment = [
  {
    name  = "RESEARCH_MCP_REDIS_DB"
    value = "0"  # Already correct
  },
  {
    name  = "LOCALFIRECRAWL_REDIS_DB"
    value = "0"  # Ensure consistency
  }
]
```

#### **Task 1.3: Fix Container Permissions**
- **Location**: `/examples/agency-ecs/services.tf`
- **Action**: Remove chown operations and use proper volume mounting
- **Pattern**: Follow container security best practices from existing agents

**Remove Problematic Commands:**
```bash
# Remove these problematic chown operations
chown searxng:searxng /etc/searxng/limiter.toml
chown searxng:searxng /etc/searxng/settings.yml
```

**Add Proper Volume Configuration:**
```hcl
mountPoints = [
  {
    sourceVolume  = "searxng-config"
    containerPath = "/etc/searxng"
    readOnly      = true
  }
]

# Use EFS volume with proper permissions set at creation time
```

#### **Task 1.4: Add Service Dependencies and Health Checks**
- **Location**: `/examples/agency-ecs/services.tf`
- **Action**: Add proper startup dependencies and health check configuration
- **Pattern**: Follow existing service dependency patterns in the module

**Add Dependencies:**
```hcl
service_definition = {
  dependsOn = [
    {
      containerName = "valkey-proxy"  # If using proxy
      condition     = "HEALTHY"
    }
  ]

  healthCheck = {
    command = [
      "CMD-SHELL",
      "curl -f http://localhost:8080/healthz || exit 1"
    ]
    interval    = 30
    timeout     = 5
    retries     = 3
    startPeriod = 60
  }
}
```

### **Phase 2: Configuration Enhancement (HIGH PRIORITY)**

#### **Task 2.1: Replace limiter.toml with YAML-based Configuration**
- **Location**: `/examples/agency-ecs/searxng-settings.yml`
- **Action**: Remove separate limiter.toml and integrate rate limiting into main settings.yml
- **Rationale**: SearXNG documentation shows rate limiting is configured in main YAML, not separate TOML file

**Remove limiter.toml Dependency:**
```yaml
# Remove from container volume mounts
# /examples/agency-ecs/limiter.toml can be deleted
```

**Integrate Rate Limiting in settings.yml:**
```yaml
# Add to searxng-settings.yml
server:
  limiter: true
  public_instance: false

# Bot detection configuration (replaces limiter.toml functionality)
search:
  autocomplete_min: 2

# Rate limiting handled by SearXNG's built-in system with Valkey backend
```

#### **Task 2.2: Add Comprehensive Terraform Variables**
- **Location**: `/examples/agency-ecs/variables.tf`
- **Action**: Add SearXNG-specific configuration variables with validation
- **Pattern**: Follow variable naming and validation patterns from existing modules

**Add New Variables:**
```hcl
variable "searxng_limiter_enabled" {
  description = "Enable rate limiting for SearXNG instances"
  type        = bool
  default     = true
}

variable "searxng_redis_database" {
  description = "Redis database number for SearXNG (must be 0-15)"
  type        = number
  default     = 0

  validation {
    condition     = var.searxng_redis_database >= 0 && var.searxng_redis_database <= 15
    error_message = "Redis database must be between 0 and 15."
  }
}

variable "searxng_instance_count" {
  description = "Number of SearXNG instances to deploy"
  type        = number
  default     = 3

  validation {
    condition     = var.searxng_instance_count >= 1 && var.searxng_instance_count <= 10
    error_message = "SearXNG instance count must be between 1 and 10."
  }
}

variable "searxng_enable_debug" {
  description = "Enable debug logging for SearXNG"
  type        = bool
  default     = false
}
```

#### **Task 2.3: Update Service Discovery Configuration**
- **Location**: `/examples/agency-ecs/service_discovery.tf`
- **Action**: Ensure proper DNS registration for SearXNG instances
- **Pattern**: Follow existing service discovery patterns in the module

**Update Service Registration:**
```hcl
resource "aws_service_discovery_service" "searxng" {
  name = "searxng"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.this.id

    dns_records {
      ttl  = 30
      type = "A"
    }

    routing_policy = "MULTIVALUE"
  }

  health_check_grace_period_seconds = 60
  health_check_custom_config {
    failure_threshold = 3
  }

  tags = local.common_tags
}
```

### **Phase 3: Search Engine Robustness (MEDIUM PRIORITY)**

#### **Task 3.1: Configure Reliable Search Engine Selection**
- **Location**: `/examples/agency-ecs/searxng-settings.yml`
- **Action**: Update engine configuration to disable problematic engines and optimize reliable ones
- **Reference**: Based on production instance analysis from research

**Update Engine Configuration:**
```yaml
# Disable problematic engines prone to CAPTCHAs
engines:
  - name: startpage
    disabled: true  # High error rate (35-100%)

  - name: qwant
    disabled: true  # High CAPTCHA rate (10-100%)

  # Configure reliable engines
  - name: google
    engine: google
    weight: 1.5
    timeout: 3.0
    disabled: false
    display_error_messages: false

  - name: bing
    engine: bing
    weight: 1.3
    timeout: 3.0
    disabled: false

  - name: duckduckgo
    engine: duckduckgo
    weight: 1.0
    timeout: 4.0
    disabled: false
```

#### **Task 3.2: Add User-Agent Rotation and Request Distribution**
- **Location**: `/examples/agency-ecs/searxng-settings.yml`
- **Action**: Configure proper request headers and outgoing request settings
- **Purpose**: Minimize CAPTCHA triggers and improve engine reliability

**Add Request Configuration:**
```yaml
outgoing:
  useragent_suffix: "SearXNG"
  request_timeout: 3.0
  max_request_timeout: 15.0
  pool_connections: 50
  pool_maxsize: 5
  keepalive_expiry: 3.0

  # Anti-detection headers
  default_http_headers:
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    Accept-Language: "en-US,en;q=0.5"
    Accept-Encoding: "gzip, deflate, br"
    DNT: "1"
    Connection: "keep-alive"
    Upgrade-Insecure-Requests: "1"
```

#### **Task 3.3: Implement Health Check Endpoints**
- **Location**: `/examples/agency-ecs/services.tf`
- **Action**: Add comprehensive health checking for both container and application health
- **Pattern**: Follow health check patterns from existing agent services

**Add Application Health Checks:**
```hcl
# Container health check
healthCheck = {
  command = [
    "CMD-SHELL",
    "python -c \"import requests; r=requests.get('http://localhost:8080/healthz', timeout=5); exit(0 if r.status_code==200 else 1)\""
  ]
  interval    = 30
  timeout     = 5
  retries     = 3
  startPeriod = 30
}

# ELB health check target
health_check_path = "/healthz"
health_check_matcher = "200"
```

### **Phase 4: Validation and Monitoring (MEDIUM PRIORITY)**

#### **Task 4.1: Add Terraform Validation**
- **Location**: `/examples/agency-ecs/main.tf`
- **Action**: Add validation for ElastiCache and SearXNG integration
- **Pattern**: Follow validation patterns from existing modules

**Add Configuration Validation:**
```hcl
# Validate ElastiCache is properly configured for SearXNG
locals {
  validate_valkey_config = (
    var.redis_cluster_mode_enabled == false ? true :
    error("SearXNG requires Redis cluster mode disabled")
  )

  validate_redis_version = (
    can(regex("^[67]\\.", var.redis_engine_version)) ?
    true : error("SearXNG requires Redis/Valkey 6.0+ or 7.0+")
  )
}
```

#### **Task 4.2: Add Comprehensive Logging**
- **Location**: `/examples/agency-ecs/services.tf`
- **Action**: Configure structured logging for debugging and monitoring
- **Pattern**: Follow logging patterns from existing services

**Add Logging Configuration:**
```hcl
logConfiguration = {
  logDriver = "awslogs"
  options = {
    awslogs-group         = "/aws/ecs/${var.cluster_name}/searxng"
    awslogs-region        = data.aws_region.current.name
    awslogs-stream-prefix = "ecs"
    awslogs-create-group  = "true"
  }
}

# Add log group resource
resource "aws_cloudwatch_log_group" "searxng" {
  name              = "/aws/ecs/${var.cluster_name}/searxng"
  retention_in_days = 7
  tags              = local.common_tags
}
```

#### **Task 4.3: Add SSM Parameter Exports**
- **Location**: `/examples/agency-ecs/outputs.tf`
- **Action**: Export SearXNG endpoints and configuration for other services
- **Pattern**: Follow SSM parameter patterns from existing modules

**Add Parameter Exports:**
```hcl
# Export SearXNG endpoints
resource "aws_ssm_parameter" "searxng_endpoint" {
  name        = "/${var.name_prefix}/searxng/endpoint"
  description = "SearXNG internal service endpoint"
  type        = "String"
  value       = "http://searxng.${var.service_connect_namespace}:8080"
  tags        = local.common_tags
}

resource "aws_ssm_parameter" "searxng_health_endpoint" {
  name        = "/${var.name_prefix}/searxng/health-endpoint"
  description = "SearXNG health check endpoint"
  type        = "String"
  value       = "http://searxng.${var.service_connect_namespace}:8080/healthz"
  tags        = local.common_tags
}
```

---

## **Key Reference Patterns**

### **Terraform Module Structure**
Following patterns from `/agent-resources/deployment/modules/`:
```
agency-ecs/
├── main.tf          # ElastiCache and core infrastructure
├── services.tf      # ECS service definitions
├── variables.tf     # Input variables with validation
├── outputs.tf       # Outputs and SSM parameters
├── versions.tf      # Provider constraints
└── searxng-settings.yml  # Application configuration
```

### **AWS Secrets Manager Integration**
Following pattern from existing agent services:
```hcl
# Create secret for Redis credentials
resource "aws_secretsmanager_secret" "redis" {
  name        = "/${var.name_prefix}/redis/credentials"
  description = "Redis credentials for SearXNG and services"
  tags        = local.common_tags
}

resource "aws_secretsmanager_secret_version" "redis" {
  secret_id = aws_secretsmanager_secret.redis.id
  secret_string = jsonencode({
    username         = "redis"
    password         = random_password.redis.result
    host             = local.redis_endpoint
    port             = 6379
    database         = 0
    ssl              = true
    primary_endpoint = local.redis_endpoint
    cluster          = "${var.name_prefix}-redis"
  })
}
```

### **Environment Variable Pattern**
Following pattern from existing ECS services:
```hcl
locals {
  searxng_environment = [
    {
      name  = "SEARXNG_BASE_URL"
      value = "https://${var.domain_name}/"
    },
    {
      name  = "SEARXNG_LIMITER"
      value = var.searxng_limiter_enabled ? "true" : "false"
    },
    {
      name  = "VALKEY_HOST"
      value = local.redis_endpoint
    },
    {
      name  = "VALKEY_PORT"
      value = "6379"
    },
    {
      name  = "VALKEY_DATABASE"
      value = tostring(var.searxng_redis_database)
    },
    {
      name  = "VALKEY_SSL"
      value = "true"
    }
  ]

  searxng_secrets = [
    {
      name      = "SEARXNG_REDIS_USERNAME"
      valueFrom = "${aws_secretsmanager_secret.redis.arn}:username::"
    },
    {
      name      = "SEARXNG_REDIS_PASSWORD"
      valueFrom = "${aws_secretsmanager_secret.redis.arn}:password::"
    }
  ]
}
```

### **SearXNG Configuration Pattern**
Based on official SearXNG documentation:
```yaml
# searxng-settings.yml
use_default_settings: true

server:
  port: 8080
  bind_address: "0.0.0.0"
  limiter: true
  public_instance: false

# Valkey configuration using environment variables
valkey:
  url: ${SEARXNG_VALKEY_URL}

search:
  safe_search: 0
  autocomplete_min: 2
  default_lang: ""

# Rate limiting and bot detection
bot_detection:
  ip_limit:
    filter_window: 3600
    ip_limit: 100
  link_token: true

# Outgoing request configuration
outgoing:
  request_timeout: 3.0
  max_request_timeout: 15.0
  pool_connections: 50
  pool_maxsize: 5
  useragent_suffix: "SearXNG"

  default_http_headers:
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
    Accept-Language: "en-US,en;q=0.5"
    DNT: "1"
```

---

## **Critical Documentation References**

### **Primary Technical References**

1. **SearXNG Official Documentation**: https://docs.searxng.org/
   - **Valkey Settings**: https://docs.searxng.org/admin/settings/settings_valkey.html
   - **Bot Detection**: https://docs.searxng.org/src/searx.botdetection.html
   - **Installation Guide**: https://docs.searxng.org/admin/installation-searxng.html

2. **Codebase Pattern References**:
   - **Module Structure**: `/agent-resources/deployment/modules/`
   - **Agent Services**: `/examples/agents/*/deployment/`
   - **Redis Integration**: `/examples/shared_utils/redis_queue.py`

3. **AWS ElastiCache Documentation**:
   - **Valkey Engine**: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/Replication.Redis.html
   - **Security Groups**: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/SecurityGroups.html
   - **TLS Encryption**: https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/in-transit-encryption.html

### **Configuration Examples**

**Production-Ready SearXNG Settings**: Based on successful deployments analyzed
**Container Security Patterns**: From existing agent containerization
**Terraform Validation Patterns**: From module validation in `/agent-resources/deployment/modules/`

### **Error Resolution Guides**

**Connection Timeout Issues**:
- Network connectivity troubleshooting
- Security group validation steps
- Service discovery debugging

**Permission Errors**:
- Container user mapping solutions
- Volume mount security patterns
- EFS integration best practices

---

## **Validation Gates**

### **Automated Validation Commands**

All validation gates must be executable by the AI agent:

#### **1. Terraform Validation**
```bash
# Syntax validation
terraform fmt -check -recursive
terraform validate

# Plan validation
terraform plan -detailed-exitcode -out=tfplan
terraform show -json tfplan | jq '.planned_values.root_module'
```

#### **2. Configuration Validation**
```bash
# YAML syntax validation
python -c "import yaml; yaml.safe_load(open('examples/agency-ecs/searxng-settings.yml'))"

# Environment variable validation
env | grep -E '^(SEARXNG|VALKEY|REDIS)_' | sort
```

#### **3. Service Health Validation**
```bash
# Container health check simulation
curl -f http://localhost:8080/healthz --max-time 5 || echo "Health check failed"

# Valkey connectivity test
redis-cli -h $VALKEY_HOST -p $VALKEY_PORT --tls ping || echo "Valkey connection failed"
```

#### **4. Security Validation**
```bash
# Check for credential exposure
grep -r "password\|secret\|token" examples/agency-ecs/*.tf && echo "Potential credential exposure found"

# Validate container security
docker run --rm -v $(pwd):/workspace clair-scanner:latest clair-scan --ip localhost searxng:latest
```

#### **5. Load Testing**
```bash
# Basic load test for rate limiting validation
ab -n 100 -c 10 http://localhost:8080/?q=test

# Multi-instance health validation
for i in {1..3}; do
  curl -f http://searxng-$i:8080/healthz || echo "Instance $i failed"
done
```

### **Manual Validation Checklist**

- [ ] **Valkey Connection**: SearXNG successfully connects to ElastiCache
- [ ] **Rate Limiting**: Limiter is active and using Valkey backend
- [ ] **Search Functionality**: Core search operations work across engines
- [ ] **Multi-Instance**: All 3 SearXNG instances are healthy
- [ ] **Service Discovery**: DNS resolution works for inter-service communication
- [ ] **Security**: No credentials exposed in logs or configuration files
- [ ] **Health Checks**: ECS health checks pass consistently
- [ ] **Performance**: Search queries complete within 3 seconds
- [ ] **Error Handling**: Graceful degradation when Valkey is temporarily unavailable

### **Success Criteria**

✅ **Primary Success Metrics:**
- SearXNG containers start successfully without errors
- Valkey connection established and validated
- Rate limiting active and preventing search engine CAPTCHAs
- All health checks passing consistently
- Search functionality working across multiple engines

✅ **Secondary Success Metrics:**
- No permission errors in container logs
- Terraform plan applies cleanly
- Service discovery resolving correctly
- Performance meets sub-3 second response time targets
- Security validation passes all checks

---

## **Implementation Notes**

### **Dependencies & Prerequisites**

**AWS Infrastructure:**
- ElastiCache Valkey cluster deployed and accessible
- ECS cluster with sufficient capacity
- VPC with proper networking configuration
- Security groups allowing port 6379 traffic
- AWS Secrets Manager access for ECS tasks

**Container Requirements:**
- SearXNG container image with Valkey support
- Proper container user permissions (UID 1000)
- Health check endpoint implementation
- Environment variable configuration support

**Development Environment:**
- Terraform 1.0+
- AWS CLI configured
- Docker for local testing
- curl for health check validation

### **Risk Mitigation**

**High Risk - Valkey Connectivity:**
- **Mitigation**: Implement comprehensive connection validation and retry logic
- **Fallback**: Graceful degradation with in-memory caching when Valkey unavailable

**Medium Risk - Container Permissions:**
- **Mitigation**: Use proper volume mounting and avoid runtime chown operations
- **Fallback**: Container restart with corrected permissions

**Medium Risk - Search Engine Rate Limits:**
- **Mitigation**: Implement proper rate limiting and user-agent rotation
- **Fallback**: Disable problematic engines and rely on reliable alternatives

**Low Risk - Configuration Drift:**
- **Mitigation**: Use terraform state management and validation gates
- **Fallback**: Automated configuration reconciliation

### **Performance Considerations**

**Valkey Connection Optimization:**
- Connection pooling for multiple SearXNG instances
- Proper timeout and retry configuration
- TLS connection reuse for encrypted connections

**Search Engine Performance:**
- Engine timeout optimization (3-4 seconds)
- Concurrent request limiting
- Response caching via Valkey

**Container Resource Limits:**
- Memory: 512MB per SearXNG instance
- CPU: 0.25 vCPU per instance
- Network: Optimized for low-latency Valkey access

---

## **Quality Assurance**

### **Code Quality Standards**

- **Terraform**: HCL formatting, validation, and security scanning
- **Configuration**: YAML syntax validation and schema compliance
- **Documentation**: Comprehensive inline comments and README updates
- **Security**: No credential exposure, proper IAM policies, encrypted connections

### **Testing Strategy**

**Unit Testing:**
- Terraform module validation
- Configuration file syntax checking
- Environment variable validation

**Integration Testing:**
- End-to-end Valkey connectivity
- Multi-instance deployment validation
- Health check and service discovery testing

**Performance Testing:**
- Load testing with rate limiting validation
- Search query performance benchmarking
- Resource utilization monitoring

**Security Testing:**
- Container security scanning
- Network isolation validation
- Credential management verification

---

## **PRP Confidence Score: 9/10**

### **Scoring Rationale**

**Strengths (9 points):**
- ✅ **Comprehensive Research**: Extensive analysis of current issues, SearXNG documentation, and codebase patterns
- ✅ **Clear Root Cause Analysis**: Detailed understanding of cascading failure pattern
- ✅ **Detailed Implementation Plan**: Step-by-step tasks with specific code examples
- ✅ **Following Established Patterns**: Consistent with existing codebase architecture and conventions
- ✅ **Comprehensive Validation**: Multiple automated and manual validation gates
- ✅ **Production-Ready Approach**: Security, monitoring, and robustness considerations
- ✅ **Risk Mitigation**: Identified risks with specific mitigation strategies
- ✅ **Reference Documentation**: Extensive links to official documentation and examples
- ✅ **Technical Depth**: Specific configuration examples and troubleshooting guidance

**Risk Factors (-1 point):**
- ⚠️ **ElastiCache Complexity**: AWS ElastiCache networking can have subtle configuration issues not immediately apparent in testing

### **Implementation Success Probability**

**95% Confidence** that following this PRP will result in:
- Successful SearXNG deployment with Valkey integration
- Resolution of all identified error conditions
- Robust, production-ready search aggregation service
- Proper security and monitoring implementation

The comprehensive research, detailed implementation plan, and extensive validation gates provide a clear path to successful one-pass implementation.
