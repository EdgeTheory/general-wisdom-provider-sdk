# Framework Configuration Management

Comprehensive configuration management for the PRP framework including persona routing, MCP server integration, and system optimization settings.

## Usage

```
/framework:config [ACTION] [OPTIONS]
```

## Actions

- `show`: Display current configuration
- `edit`: Edit configuration interactively
- `validate`: Validate configuration files
- `reset`: Reset to default configuration
- `export`: Export configuration for backup
- `import`: Import configuration from backup
- `optimize`: Optimize configuration for performance

## Options

**Configuration Scope:**
- `--component [COMPONENT]`: Target specific component (persona, mcp, cache, validation)
- `--profile [PROFILE]`: Configuration profile (developer, enterprise, production)
- `--environment [ENV]`: Environment-specific configuration (dev, staging, prod)

**Display Options:**
- `--format [FORMAT]`: Output format (json, yaml, table) default: table
- `--show-secrets`: Include sensitive configuration values
- `--show-defaults`: Show default values alongside current values
- `--diff`: Show differences from default configuration

**Modification Options:**
- `--set [KEY=VALUE]`: Set specific configuration value
- `--unset [KEY]`: Remove configuration value
- `--merge [FILE]`: Merge configuration from file
- `--backup`: Create backup before making changes

## Examples

### View Current Configuration
```bash
/framework:config show
```

### View Specific Component Configuration
```bash
/framework:config show --component persona --format json
```

### Configure MCP Servers
```bash
/framework:config edit --component mcp
```

### Set Specific Configuration Value
```bash
/framework:config --set persona.routing.confidence_threshold=0.8
```

### Optimize for Production
```bash
/framework:config optimize --profile production --backup
```

### Export Configuration
```bash
/framework:config export --format yaml > prp_framework_config.yaml
```

## Configuration Components

### Core Framework Settings
```yaml
framework:
  version: "2.1.0"
  debug_mode: false
  log_level: "INFO"
  cache_enabled: true
  performance_monitoring: true

environment:
  profile: "developer"  # developer, enterprise, production
  max_concurrent_prps: 5
  timeout_default: 30
  retry_attempts: 3
```

### Persona Routing Configuration
```yaml
persona_routing:
  enabled: true
  confidence_threshold: 0.75
  auto_fallback: true
  fallback_persona: "architect"

  personas:
    architect:
      keywords: ["architecture", "system", "design", "scalability"]
      confidence_boost: 0.1
      specializations: ["system_design", "scalability", "integration"]

    security:
      keywords: ["security", "auth", "encryption", "vulnerability"]
      confidence_boost: 0.15
      specializations: ["threat_modeling", "compliance", "penetration_testing"]

    frontend:
      keywords: ["ui", "ux", "react", "component", "accessibility"]
      confidence_boost: 0.1
      specializations: ["responsive_design", "accessibility", "performance"]

    backend:
      keywords: ["api", "database", "server", "microservice"]
      confidence_boost: 0.1
      specializations: ["api_design", "database_optimization", "service_architecture"]
```

### MCP Server Configuration
```yaml
mcp_servers:
  enabled: true
  timeout: 30
  retry_attempts: 3
  fallback_enabled: true

  servers:
    context7:
      enabled: true
      endpoint: "context7://documentation"
      timeout: 10
      features: ["documentation_search", "best_practices"]

    sequential:
      enabled: true
      endpoint: "sequential://analysis"
      timeout: 25
      features: ["complex_analysis", "multi_step_reasoning"]

    magic:
      enabled: true
      endpoint: "magic://ui_components"
      timeout: 15
      features: ["ui_generation", "component_library"]
```

### Context Optimization Settings
```yaml
context_optimization:
  enabled: true
  auto_compress_threshold: 8000
  compression_mode: "moderate"  # none, light, moderate, aggressive
  compression_target: 0.7
  preserve_critical: true

  compression_patterns:
    code_examples: "summarize"
    documentation: "compress"
    verbose_descriptions: "condense"
    redundant_context: "remove"
```

### Validation Framework Configuration
```yaml
validation:
  enabled: true
  default_level: "comprehensive"  # basic, comprehensive, domain_specific
  auto_fix: false
  fail_fast: false

  validation_gates:
    syntax: true
    type_checking: true
    unit_tests: true
    integration_tests: true
    security_scan: true
    performance_check: false

  domain_specific:
    security:
      - "vulnerability_scan"
      - "penetration_test"
      - "compliance_check"

    frontend:
      - "accessibility_test"
      - "responsive_test"
      - "browser_compatibility"

    backend:
      - "api_contract_test"
      - "database_integrity"
      - "load_test"
```

### Caching and Performance Settings
```yaml
caching:
  enabled: true
  cache_size_mb: 500
  ttl_default: 3600
  intelligent_invalidation: true

  cache_policies:
    persona_routing:
      ttl: 1800
      max_entries: 1000

    mcp_responses:
      ttl: 3600
      max_entries: 500

    validation_results:
      ttl: 7200
      max_entries: 200

performance:
  max_concurrent_requests: 10
  request_timeout: 45
  batch_operations: true
  async_processing: true

  optimization:
    token_usage_tracking: true
    performance_profiling: true
    resource_monitoring: true
```

## Configuration Profiles

### Developer Profile
Optimized for development workflow:
```yaml
profile: developer
persona_routing:
  confidence_threshold: 0.65  # Lower threshold for experimentation
context_optimization:
  auto_compress_threshold: 12000  # Higher threshold for detailed context
validation:
  default_level: "basic"  # Faster validation for rapid iteration
performance:
  max_concurrent_requests: 3  # Conservative for local development
```

### Enterprise Profile
Optimized for enterprise deployment:
```yaml
profile: enterprise
persona_routing:
  confidence_threshold: 0.85  # Higher threshold for accuracy
context_optimization:
  compression_mode: "aggressive"  # Maximum efficiency
validation:
  default_level: "domain_specific"  # Comprehensive validation
  security_scan: true
  compliance_check: true
performance:
  max_concurrent_requests: 20  # High throughput
  async_processing: true
```

### Production Profile
Optimized for production stability:
```yaml
profile: production
persona_routing:
  auto_fallback: true  # Always have fallback
  fallback_persona: "architect"
mcp_servers:
  fallback_enabled: true  # Graceful degradation
  retry_attempts: 5
validation:
  fail_fast: true  # Stop on first critical issue
performance:
  performance_profiling: true  # Monitor performance
  resource_monitoring: true
```

## Configuration Management Actions

### Interactive Configuration Editor
```bash
/framework:config edit --component persona
```

Opens interactive editor:
```
┌─ Persona Routing Configuration ─────────────────────────────────────┐
│                                                                     │
│ Confidence Threshold: [0.75    ] (0.5-0.95)                       │
│ Auto Fallback:        [✓] Enabled                                  │
│ Fallback Persona:     [architect ▼] (architect|security|frontend)  │
│                                                                     │
│ Persona Specializations:                                            │
│ ┌─ Architect ─────────────────────────────────────────────────────┐ │
│ │ Keywords: architecture, system, design, scalability            │ │
│ │ Confidence Boost: [0.1  ] (-0.2 to 0.3)                       │ │
│ │ Specializations: [Edit...                                   ]  │ │
│ └─────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│ [Save] [Cancel] [Reset to Defaults] [Test Configuration]           │
└─────────────────────────────────────────────────────────────────────┘
```

### Configuration Validation
```bash
/framework:config validate
```

Output:
```
Configuration Validation Report
==============================

✅ Core Framework: VALID
   - All required settings present
   - Value ranges within acceptable limits
   - Dependencies satisfied

✅ Persona Routing: VALID
   - All personas properly configured
   - Confidence thresholds valid
   - Keywords and specializations complete

⚠️  MCP Servers: WARNING
   - Magic server endpoint unreachable
   - Sequential server timeout too low (recommended: >20s)

❌ Context Optimization: ERROR
   - compression_target invalid (1.5 > 1.0)
   - auto_compress_threshold conflicts with cache_size

Recommendations:
1. Update Magic server endpoint configuration
2. Increase Sequential server timeout to 25s
3. Fix compression_target value (should be 0.1-0.9)
4. Adjust auto_compress_threshold or increase cache_size
```

### Configuration Optimization
```bash
/framework:config optimize --profile production
```

Automatically optimizes configuration:
```
Configuration Optimization Complete
==================================

Applied optimizations:
✅ Increased MCP server timeouts for reliability
✅ Adjusted persona confidence thresholds for accuracy
✅ Enabled comprehensive validation for quality
✅ Optimized caching settings for performance
✅ Configured monitoring and alerting

Performance improvements:
- 23% reduction in token usage
- 31% improvement in persona routing accuracy
- 18% faster PRP execution time
- Enhanced error handling and recovery

Backup created: ~/.prp_framework/backups/config_20250118_143025.yaml
```

## Environment-Specific Configuration

### Development Environment
```bash
/framework:config --environment dev --set debug_mode=true --set log_level=DEBUG
```

### Staging Environment
```bash
/framework:config --environment staging --profile enterprise --set validation.default_level=comprehensive
```

### Production Environment
```bash
/framework:config --environment prod --profile production --set performance.resource_monitoring=true
```

## Configuration Backup and Recovery

### Create Backup
```bash
/framework:config export --format yaml --include-secrets > config_backup_$(date +%Y%m%d).yaml
```

### Restore from Backup
```bash
/framework:config import config_backup_20250118.yaml --backup --validate
```

### Reset to Defaults
```bash
/framework:config reset --component mcp --backup
```

## Security Considerations

### Sensitive Configuration
- **API Keys**: Stored in secure environment variables
- **Authentication Tokens**: Encrypted at rest
- **Connection Strings**: Masked in configuration displays
- **Secrets Management**: Integration with external secret stores

### Access Control
- **Configuration Access**: Role-based access to configuration sections
- **Audit Logging**: All configuration changes logged
- **Change Approval**: Production configuration changes require approval
- **Rollback Capability**: Automatic rollback on configuration errors

## Integration with Development Workflow

### CI/CD Integration
```bash
# Validate configuration in CI pipeline
/framework:config validate --fail-on-warnings

# Deploy environment-specific configuration
/framework:config --environment $DEPLOY_ENV --profile $PROFILE
```

### Team Configuration Management
```bash
# Share team configuration
/framework:config export --format yaml --no-secrets > team_config.yaml

# Apply team configuration
/framework:config import team_config.yaml --merge
```
