# Installation Guide

Complete guide for installing and setting up Code-Agent CLI with the unified `.claude/` directory approach.

## 🚀 Quick Installation

### Recommended: Using pipx (Stable, Isolated)

```bash
# 1. Install pipx
brew install pipx
pipx ensurepath

# 2. Configure AWS CodeArtifact authentication
aws codeartifact login --tool pip --domain dev-code-agent-domain --repository dev-code-agent-repo --region us-east-1

# 3. Install code-agent
pipx install code-agent

# 4. Verify installation
code-agent --version
code-agent --help
```

### Alternative: Using uv (Fastest)

```bash
# 1. Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh

# 2. Configure keyring for AWS CodeArtifact
uv tool install keyring --with keyrings.codeartifact
export UV_KEYRING_PROVIDER=subprocess

# 3. Install code-agent
uv tool install code-agent --index-url https://dev-code-agent-domain-540845145946.d.codeartifact.us-east-1.amazonaws.com/pypi/dev-code-agent-repo/simple/

# 4. Verify installation
code-agent --version
```

## 🔧 Project Integration

### New Projects

Create a new project with integrated Code-Agent CLI:

```bash
# Create with built-in integration
code-agent create python-microservice my-api
code-agent create react-app my-dashboard
code-agent create terraform-module vpc-module
```

### Existing Projects

Integrate Code-Agent CLI into your existing project:

```bash
# Navigate to your project
cd /path/to/your/project

# Integrate with unified .claude directory
code-agent integrate

# Or specify integration level
code-agent integrate --level enhanced
```

## 📁 Unified .claude Directory

The new unified approach places everything in a single `.claude/` directory:

### What Gets Created

```
.claude/
├── settings.json              # Claude Code configuration
├── docs/                      # Embedded documentation (this!)
│   ├── README.md
│   ├── installation.md
│   └── ...
├── hooks/                     # Claude Code lifecycle hooks
│   ├── session_start_claude_md.py
│   ├── pre_tool_use.py
│   └── post_tool_use.py
├── mcp_servers/              # MCP server scripts
│   ├── context7_server.py
│   ├── sequential_server.py
│   └── magic_server.py
├── commands/                 # Custom commands
│   └── prp/
├── PRPs/                     # Product Requirement Prompts
│   ├── templates/
│   └── examples/
├── config/                   # Additional configurations
├── workspace/                # Workspace data
└── validation/               # Validation scripts
```

### Key Benefits

✅ **Single Directory**: Everything in one place
✅ **Relative Paths**: No absolute path dependencies
✅ **Portable**: Easily shared and deployed
✅ **Self-Contained**: Documentation travels with the setup
✅ **Git-Friendly**: Clean version control integration

## 🎛️ Configuration

### Claude Code Settings

The `.claude/settings.json` file is automatically configured with:

```json
{
  "permissions": {
    "defaultMode": "bypassPermissions",
    "allow": ["Bash(*)", "WebFetch(*)", "Write", "Edit", ...]
  },
  "hooks": {
    "SessionStart": [
      {
        "command": "uv run --script .claude/hooks/session_start_claude_md.py"
      }
    ]
  },
  "mcpServers": {
    "context7": {
      "command": "uv",
      "args": ["run", "--script", ".claude/mcp_servers/context7_server.py"]
    }
  }
}
```

All paths are **relative** to ensure portability across environments.

### Environment Variables

Optional environment variables for customization:

```bash
# Claude Code integration
export CLAUDE_CODE_USE_BEDROCK=1
export AWS_DEFAULT_REGION=us-east-1

# Code-Agent CLI
export CODE_AGENT_PROFILE=developer
```

## ✅ Validation

After installation, validate your setup:

```bash
# Complete validation
code-agent validate all

# Check Claude directory
code-agent install validate-claude

# Test specific components
code-agent slash /system:health-check
```

## 🔄 Migration from .code-agent

If you have an existing `.code-agent/` directory, it will be automatically migrated:

```bash
# Migration happens automatically during integration
code-agent integrate

# Manual migration if needed
code-agent migrate --from .code-agent --to .claude
```

The old `.code-agent/` directory approach is deprecated in favor of the unified `.claude/` approach.

## 🛠️ Troubleshooting

### Common Issues

**PEP 668 "externally-managed-environment" Error**
```bash
# Use pipx instead of pip
pipx install code-agent
```

**AWS CodeArtifact Authentication**
```bash
# Refresh token (expires after 12 hours)
aws codeartifact login --tool pip --domain dev-code-agent-domain --repository dev-code-agent-repo --region us-east-1
```

**Command not found after installation**
```bash
# Ensure PATH is updated
pipx ensurepath
source ~/.zshrc  # or ~/.bash_profile
```

### Getting Help

```bash
# System status
code-agent slash /system:status

# Detailed diagnostics
code-agent validate all --verbose

# Configuration check
code-agent install validate-claude
```

## 🎉 Next Steps

After successful installation:

1. **Start Claude Code**: `code-agent claude start`
2. **Create your first PRP**: `code-agent slash /prp:create my-feature`
3. **Explore commands**: `code-agent slash-help`
4. **Read the usage guide**: [usage.md](usage.md)

---

*This installation creates a modern, unified setup that's portable, maintainable, and easy to understand.*
