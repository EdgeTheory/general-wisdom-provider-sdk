# Framework Health Check Command

Comprehensive health monitoring and diagnostics for the PRP framework, including persona routing, MCP server connectivity, and system performance validation.

## Usage

```
/framework:health [OPTIONS]
```

## Options

**Health Check Scope:**
- `--full`: Complete system health check (default)
- `--quick`: Basic connectivity and configuration check
- `--deep`: Comprehensive analysis including performance benchmarks
- `--component [COMPONENT]`: Check specific component (persona-router, mcp-servers, cache, etc.)

**Component-Specific Checks:**
- `--persona-routing`: Check persona routing system health and accuracy
- `--mcp-servers`: Validate all MCP server connections and performance
- `--context-optimization`: Test context compression and optimization systems
- `--validation-framework`: Check validation pattern integrity and execution
- `--caching-system`: Validate intelligent caching system performance

**Diagnostic Options:**
- `--fix-issues`: Automatically fix common configuration issues
- `--benchmark`: Run performance benchmarks for key components
- `--connectivity-test`: Test all external service connections
- `--configuration-validation`: Validate all configuration files and settings

**Output Options:**
- `--output-format [FORMAT]`: Output format (markdown, json, html-dashboard) default: markdown
- `--export-metrics`: Export health metrics for monitoring systems
- `--create-report`: Generate comprehensive health report
- `--dashboard`: Launch interactive health dashboard

## Examples

### Basic Health Check
```bash
/framework:health
```

### Deep System Analysis
```bash
/framework:health --deep --benchmark --create-report
```

### MCP Server Diagnostics
```bash
/framework:health --mcp-servers --connectivity-test --fix-issues
```

### Persona Routing Validation
```bash
/framework:health --persona-routing --benchmark --output-format json
```

### Performance Benchmarking
```bash
/framework:health --benchmark --export-metrics --dashboard
```

## Health Check Components

### Core Framework Health
1. **Configuration Validation**: All configuration files and settings validation
2. **Dependency Check**: Python dependencies and version compatibility
3. **File System Health**: Directory structure and file permissions
4. **Environment Validation**: Environment variables and system requirements
5. **Framework Integration**: Integration with Claude Code and MCP systems

### Persona Routing System
1. **Router Connectivity**: Persona routing service availability
2. **Confidence Scoring**: Persona selection accuracy and confidence levels
3. **Domain Analysis**: Domain expertise mapping and coverage
4. **Fallback Mechanisms**: Graceful degradation and fallback system health
5. **Performance Metrics**: Routing latency and throughput analysis

### MCP Server Infrastructure
1. **Server Connectivity**: Connection status for all configured MCP servers
2. **Authentication Status**: Authentication and authorization validation
3. **API Response Times**: Performance benchmarks for MCP operations
4. **Error Rate Monitoring**: Error rates and failure pattern analysis
5. **Capability Validation**: Server capability and feature availability

### Context Optimization System
1. **Compression Engine**: Context compression functionality and accuracy
2. **Token Efficiency**: Token usage optimization and reduction metrics
3. **Information Preservation**: Critical information preservation validation
4. **Performance Impact**: Compression processing time and resource usage
5. **Cache Efficiency**: Context caching system performance

### Validation Framework
1. **Pattern Integrity**: Validation pattern completeness and accuracy
2. **Execution Performance**: Validation execution time and resource usage
3. **Coverage Analysis**: Validation coverage across different domains
4. **Error Handling**: Error detection and reporting mechanisms
5. **Quality Gates**: Quality gate configuration and execution validation

## Health Check Execution

### Quick Health Check
```bash
Framework Health Check - Quick Assessment
==========================================

✅ Core Configuration: HEALTHY
   - All config files valid and accessible
   - Dependencies satisfied
   - Environment properly configured

✅ Persona Routing: HEALTHY (confidence: 92%)
   - Router service: ACTIVE
   - All personas: AVAILABLE
   - Average routing time: 1.2s

⚠️  MCP Servers: WARNING
   - Context7: HEALTHY (1.1s response)
   - Sequential: HEALTHY (2.3s response)
   - Magic: TIMEOUT (retry recommended)

✅ Validation Framework: HEALTHY
   - All validation patterns: LOADED
   - Quality gates: CONFIGURED
   - Performance: OPTIMAL

Overall Status: HEALTHY with 1 warning
Recommendation: Check Magic MCP server configuration
```

### Deep Health Analysis
Comprehensive analysis including:
- **Performance Benchmarks**: Detailed performance metrics for all components
- **Stress Testing**: System behavior under high load conditions
- **Memory Usage Analysis**: Memory consumption patterns and optimization opportunities
- **Concurrency Testing**: Multi-threaded operation validation
- **Integration Testing**: End-to-end workflow validation

### Component-Specific Health Reports

#### Persona Routing Health
```json
{
  "persona_routing": {
    "status": "healthy",
    "metrics": {
      "average_confidence": 0.87,
      "routing_accuracy": 0.94,
      "average_latency": "1.2s",
      "fallback_rate": 0.03
    },
    "personas": {
      "architect": {"status": "active", "confidence_range": "0.85-0.95"},
      "security": {"status": "active", "confidence_range": "0.80-0.92"},
      "frontend": {"status": "active", "confidence_range": "0.88-0.96"},
      "backend": {"status": "active", "confidence_range": "0.82-0.94"}
    },
    "recommendations": [
      "Consider tuning security persona confidence threshold",
      "Backend persona could benefit from additional training data"
    ]
  }
}
```

#### MCP Server Health
```json
{
  "mcp_servers": {
    "overall_status": "healthy_with_warnings",
    "servers": {
      "context7": {
        "status": "healthy",
        "response_time": "1.1s",
        "error_rate": 0.02,
        "last_successful_request": "2025-01-18T14:30:00Z"
      },
      "sequential": {
        "status": "healthy",
        "response_time": "2.3s",
        "error_rate": 0.01,
        "last_successful_request": "2025-01-18T14:29:45Z"
      },
      "magic": {
        "status": "timeout",
        "response_time": "timeout_after_30s",
        "error_rate": 0.15,
        "last_successful_request": "2025-01-18T14:15:00Z",
        "recommendation": "Check server configuration and network connectivity"
      }
    }
  }
}
```

## Automated Issue Resolution

### Common Issues and Fixes

#### Configuration Issues
- **Missing Config Files**: Automatically regenerate default configurations
- **Permission Problems**: Fix file and directory permissions
- **Environment Variables**: Set missing environment variables with defaults
- **Dependency Issues**: Install missing dependencies or suggest updates

#### MCP Server Issues
- **Connection Timeouts**: Adjust timeout settings and retry logic
- **Authentication Failures**: Refresh authentication tokens and credentials
- **Server Unavailability**: Enable graceful degradation and fallback mechanisms
- **Performance Issues**: Optimize request patterns and implement caching

#### Persona Routing Issues
- **Low Confidence Scores**: Retrain persona models with additional data
- **Routing Failures**: Implement more robust fallback mechanisms
- **Performance Degradation**: Optimize routing algorithms and caching

### Auto-Fix Capabilities
```bash
/framework:health --fix-issues --component mcp-servers
```

This will automatically:
1. **Test All Connections**: Validate connectivity to all MCP servers
2. **Refresh Credentials**: Update authentication tokens if expired
3. **Optimize Configuration**: Adjust timeout and retry settings
4. **Enable Fallbacks**: Configure graceful degradation for failed services
5. **Update Documentation**: Update configuration documentation with fixes applied

## Monitoring Integration

### Metrics Export
The health check can export metrics to monitoring systems:

```bash
/framework:health --export-metrics --output-format json > framework_metrics.json
```

Exported metrics include:
- **Performance Metrics**: Response times, throughput, error rates
- **Resource Utilization**: Memory usage, CPU utilization, disk I/O
- **Quality Metrics**: Validation success rates, persona routing accuracy
- **Availability Metrics**: Service uptime, connection success rates

### Dashboard Integration
```bash
/framework:health --dashboard
```

Launches an interactive dashboard showing:
- **Real-Time Status**: Live system status and health indicators
- **Performance Graphs**: Historical performance trends and patterns
- **Alert Management**: Active alerts and issue tracking
- **System Configuration**: Current configuration and recent changes

## Success Criteria

A healthy PRP framework should achieve:

- ✅ **Core System**: 100% configuration validity, all dependencies satisfied
- ✅ **Persona Routing**: >85% average confidence, <2s routing latency
- ✅ **MCP Servers**: <3s response times, <5% error rates
- ✅ **Context Optimization**: >60% token reduction, <1s processing time
- ✅ **Validation Framework**: 100% pattern integrity, <5s validation time
- ✅ **Overall Performance**: <10s end-to-end PRP execution overhead

## Continuous Health Monitoring

### Scheduled Health Checks
```bash
# Daily health check with automatic fixes
/framework:health --quick --fix-issues --export-metrics

# Weekly comprehensive analysis
/framework:health --deep --benchmark --create-report
```

### Integration with CI/CD
```bash
# Pre-deployment health validation
/framework:health --full --fail-on-warnings

# Post-deployment health verification
/framework:health --connectivity-test --benchmark
```

### Alert Configuration
The health check system can be configured to send alerts when:
- **MCP Server Failures**: Any MCP server becomes unavailable
- **Performance Degradation**: Response times exceed thresholds
- **Configuration Issues**: Invalid or missing configuration detected
- **Persona Routing Problems**: Confidence scores drop below acceptable levels
