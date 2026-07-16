# System Health Check Command

Comprehensive system diagnostics for PRP Framework installation, MCP servers, integrations, and performance.

## Usage
```
/system:health-check [OPTIONS]
```

## Options
- `--component [COMPONENT]`: Check specific component (mcp, commands, templates, validation)
- `--fix-issues`: Automatically fix detected issues
- `--detailed`: Provide detailed diagnostic information
- `--export [FILE]`: Export health report to file

## Health Checks
1. **Installation Integrity**: Verify all components properly installed
2. **MCP Server Status**: Check connectivity and performance of all MCP servers
3. **Command Functionality**: Validate all commands are accessible and functional
4. **Template Validation**: Ensure all templates are valid and complete
5. **Integration Tests**: Test external integrations (Git, APIs, etc.)
6. **Performance Metrics**: Check system performance and resource usage
7. **Configuration Validation**: Verify all configuration files are valid

## Auto-Fix Capabilities
- Restart failed MCP servers
- Repair corrupted configuration files
- Update outdated templates
- Fix permission issues
- Clear corrupted caches

## Examples
```bash
/system:health-check
/system:health-check --component mcp --fix-issues
/system:health-check --detailed --export health-report.json
```
