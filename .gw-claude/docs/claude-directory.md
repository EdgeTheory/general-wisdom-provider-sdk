# Claude Directory Structure

Complete guide to the unified `.claude/` directory structure and its components.

## 🏗️ Directory Overview

The `.claude/` directory is the single source of truth for all Code-Agent CLI functionality:

```
.claude/
├── settings.json              # Claude Code configuration
├── CLAUDE.md                  # Dynamic context file
├── docs/                      # Embedded documentation
├── hooks/                     # Claude Code lifecycle hooks
├── mcp_servers/               # MCP server scripts
├── commands/                  # Custom commands
├── PRPs/                      # Product Requirement Prompts
├── config/                    # Additional configurations
├── workspace/                 # Workspace data
├── validation/                # Validation scripts
├── logs/                      # Execution logs (generated)
├── cache/                     # Cache files (generated)
└── .gitignore                 # Git ignore rules
```

## 📄 Core Files

### settings.json
The main Claude Code configuration file with relative paths:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": ["Bash(*)", "WebFetch(*)", "Write", "Edit", ...]
  },
  "hooks": {
    "SessionStart": [{
      "command": "uv run --script .claude/hooks/session_start_claude_md.py"
    }],
    "PreToolUse": [{
      "command": "uv run .claude/hooks/pre_tool_use.py"
    }]
  },
  "mcpServers": {
    "context7": {
      "command": "uv",
      "args": ["run", "--script", ".claude/mcp_servers/context7_server.py"]
    }
  }
}
```

**Key Features:**
- ✅ **Relative Paths**: All paths use `.claude/` prefix
- ✅ **Portable**: Works in any directory
- ✅ **Self-Contained**: No external dependencies

### CLAUDE.md
Dynamic context file generated based on project analysis:

```markdown
# CLAUDE.md - Dynamic Context

This file provides context-aware guidance to Claude Code.

## Core Module Access
- ORCHESTRATOR.md (context intelligence)
- PERSONAS.md (domain experts)
- PRINCIPLES.md (framework principles)
...
```

## 📂 Directory Components

### docs/
Embedded documentation that travels with your project:

```
docs/
├── README.md                  # Main documentation index
├── installation.md            # Installation guide
├── claude-directory.md        # This file
├── usage.md                   # Usage guide
├── integration.md             # Integration guide
├── mcp-setup.md               # MCP configuration
├── troubleshooting.md         # Common issues
└── modules/                   # Framework modules
    ├── core/                  # Core modules
    ├── personas/              # Domain experts
    ├── domains/               # Domain-specific guidance
    └── tech-stacks/           # Technology stack modules
```

### hooks/
Claude Code lifecycle hooks for enhanced integration:

```
hooks/
├── session_start_claude_md.py      # Dynamic CLAUDE.md generation
├── pre_tool_use.py                 # Pre-tool validation
├── post_tool_use.py                # Post-tool processing
├── user_prompt_submit.py           # Prompt processing
├── notification.py                 # System notifications
├── stop.py                         # Session cleanup
└── subagent_stop.py                # Subagent cleanup
```

**Features:**
- **Dynamic Context**: Generates context based on current project
- **Validation**: Pre and post-tool validation
- **Notifications**: System-wide notifications
- **Cleanup**: Proper session management

### mcp_servers/
Model Context Protocol servers for enhanced capabilities:

```
mcp_servers/
├── context7_server.py              # Context analysis and routing
├── sequential_server.py            # Sequential task processing
└── magic_server.py                 # Enhanced Claude Code tools
```

**Capabilities:**
- **Context Analysis**: Intelligent project understanding
- **Sequential Processing**: Multi-step task coordination
- **Enhanced Tools**: Extended Claude Code functionality

### commands/
Custom commands organized by category:

```
commands/
├── prp/                            # PRP-related commands
│   ├── create.md                   # Create new PRPs
│   ├── execute.md                  # Execute PRPs
│   └── list.md                     # List available PRPs
├── meta/                           # Meta commands
│   ├── analyze.md                  # Project analysis
│   └── build.md                    # Build orchestration
└── system_commands/                # System commands
    ├── health-check.md             # System health checks
    └── optimize.md                 # Performance optimization
```

### PRPs/
Product Requirement Prompts and templates:

```
PRPs/
├── templates/                      # PRP templates
│   ├── prp_base.md                # Base template
│   ├── prp_enhanced.md            # Enhanced template
│   ├── prp_planning.md            # Planning template
│   ├── prp_spec.md                # Specification template
│   └── prp_task.md                # Task template
├── examples/                       # Real-world examples
│   ├── api-design.md              # API design example
│   ├── ui-component.md            # UI component example
│   └── data-migration.md          # Data migration example
└── scripts/                       # PRP automation scripts
    ├── validate.py                # PRP validation
    └── generate.py                # PRP generation
```

### config/
Additional configuration files:

```
config/
├── personas.yml                    # Available personas
├── mcp-config.yml                  # MCP server configuration
├── workspace.json                  # Workspace settings
└── validation-rules.json          # Validation configuration
```

### workspace/
Workspace data and project management:

```
workspace/
├── projects.json                   # Registered projects
├── active-workspace.json          # Current workspace
└── metadata/                      # Project metadata
    ├── project-1-metadata.json
    └── project-2-metadata.json
```

### validation/
Validation scripts and configuration:

```
validation/
├── syntax-check.py                 # Syntax validation
├── unit-test.py                    # Unit test runner
├── integration-test.py             # Integration test runner
└── e2e-test.py                     # End-to-end test runner
```

## 🔄 Dynamic Generation

Many components are generated dynamically based on your project:

### Context-Aware CLAUDE.md
```bash
# Regenerate based on current project
code-agent slash /claude-md:generate
```

### Adaptive Settings
```bash
# Update settings based on project changes
code-agent install claude-setup --update
```

### Project-Specific Commands
Commands adapt based on detected frameworks and languages.

## 🎯 Path Management

### Relative Path Benefits

All paths in the system use relative references:

```json
// ✅ Good - Relative paths
"command": "uv run --script .claude/hooks/session_start.py"
"args": ["run", "--script", ".claude/mcp_servers/context7_server.py"]

// ❌ Bad - Absolute paths (old approach)
"command": "/Users/user/dev/code-agent/.claude/hooks/session_start.py"
```

**Benefits:**
- ✅ **Portable**: Works on any machine
- ✅ **Version Control**: Safe to commit
- ✅ **Deployment**: Easy to deploy to different environments
- ✅ **Collaborative**: Team members can use without path issues

### Directory Resolution

The system resolves paths in this order:
1. Current project `.claude/` directory
2. Parent directories (walking up)
3. Global Code-Agent CLI directory

## 🔧 Customization

### Adding Custom Components

**Custom Hooks:**
```bash
# Add your custom hook
echo '#!/usr/bin/env python3' > .claude/hooks/my_custom_hook.py
chmod +x .claude/hooks/my_custom_hook.py
```

**Custom Commands:**
```bash
# Add custom command category
mkdir -p .claude/commands/myteam
echo "# My Team Commands" > .claude/commands/myteam/deploy.md
```

**Custom MCP Servers:**
```bash
# Add custom MCP server
cp my_server.py .claude/mcp_servers/
# Update settings.json to include it
```

### Configuration Override

Create local overrides without modifying main files:

```bash
# Local settings override
echo '{"local": "settings"}' > .claude/config/local-settings.json

# Local persona definitions
cp .claude/config/personas.yml .claude/config/personas.local.yml
# Edit personas.local.yml
```

## 🚀 Best Practices

### Organization
- **Keep it clean**: Only add necessary customizations
- **Use subdirectories**: Organize custom content in subdirectories
- **Document changes**: Add README files for custom components

### Version Control
```gitignore
# .claude/.gitignore (automatically created)
logs/
cache/
*.tmp
*.temp
settings.local.json
```

### Maintenance
```bash
# Regular cleanup
code-agent install claude-setup --clean

# Validate structure
code-agent install validate-claude

# Update to latest structure
code-agent integrate --update
```

## 🎉 Summary

The unified `.claude/` directory provides:

- **Single Source of Truth**: Everything in one place
- **Relative Paths**: Portable across environments
- **Self-Contained**: Documentation and tools included
- **Extensible**: Easy to customize and extend
- **Maintainable**: Clear structure and organization

This approach eliminates the complexity of the previous dual-directory system while providing enhanced functionality and better user experience.

---

*The `.claude/` directory is designed to be your complete Code-Agent CLI workspace - everything you need in one organized location.*
