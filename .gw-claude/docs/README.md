# Code-Agent CLI Documentation

Welcome to the Code-Agent CLI documentation! This documentation is embedded in your `.claude/` directory and deployed with your project for easy access.

## 📚 Documentation Structure

This documentation covers the unified `.claude/` directory approach and modern Claude Code integration.

### Core Guides
- **[Installation Guide](installation.md)** - Complete installation and setup
- **[Integration Guide](integration.md)** - Integrating with existing projects
- **[Claude Directory Structure](claude-directory.md)** - Understanding the .claude directory
- **[Usage Guide](usage.md)** - Common workflows and commands

### Advanced Topics
- **[MCP Setup](mcp-setup.md)** - Model Context Protocol server configuration
- **[VCS Integration](vcs-integration.md)** - Version control system integration
- **[PRP Creation](prp-creation.md)** - Creating and managing Product Requirement Prompts
- **[Troubleshooting](troubleshooting.md)** - Common issues and solutions

### Reference
- **[CLI Reference](cli-reference.md)** - Complete command reference
- **[Configuration](configuration.md)** - Configuration file formats and options

## 🚀 Quick Start

### New Users
1. **Install**: `pipx install code-agent`
2. **Setup**: `code-agent integrate` (in your project directory)
3. **Start**: `code-agent claude start`

### Existing Projects
The `.claude/` directory contains everything you need:
- **Hooks**: Lifecycle event integration
- **MCP Servers**: Context-aware tools
- **Commands**: Project-specific commands
- **PRPs**: Product Requirement Prompts and templates
- **Docs**: This documentation

## 🔧 Unified .claude Directory

All Code-Agent CLI functionality is now centralized in the `.claude/` directory:

```
.claude/
├── docs/          # This documentation
├── hooks/         # Claude Code hooks
├── mcp_servers/   # MCP server scripts
├── commands/      # Custom commands
├── PRPs/          # Product Requirement Prompts
│   ├── templates/ # PRP templates
│   └── examples/  # PRP examples
├── config/        # Configuration files
├── workspace/     # Workspace data
├── validation/    # Validation scripts
└── settings.json  # Claude Code settings
```

This unified approach eliminates the complexity of the previous `.code-agent/` system while providing all the same functionality with better organization.

## 🤝 Getting Help

- **CLI Help**: `code-agent --help`
- **Slash Commands**: `code-agent slash-help`
- **Validation**: `code-agent validate all`
- **System Status**: `code-agent slash /system:status`

---

*This documentation is deployed with your Code-Agent CLI installation and stays with your project.*
