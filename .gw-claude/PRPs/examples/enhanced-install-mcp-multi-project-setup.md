name: "Enhanced Install Script with MCP Setup and Multi-Project Support"
description: |
  Enhance the existing install script to properly configure MCP servers in settings.json with zero user intervention,
  and extend it to support multi-project/multi-repo workflows with shared resources in ~/.claude and
  project-specific configurations in .claude directories.

## Purpose

Transform the current profile-based installation system into a comprehensive project initialization and management platform that:
- Automatically configures MCP servers with zero user intervention
- Supports multi-project and multi-repository workflows
- Manages shared resources and project-specific configurations
- Extends the existing bitbucket_integration pattern to support any VCS provider

## Core Principles

1. **Zero User Intervention**: MCP servers and all dependencies work immediately after installation
2. **Multi-Project Ready**: Support single projects to complex multi-service architectures
3. **Shared Resources**: Global templates, configurations, and resources in ~/.claude
4. **Project Isolation**: Project-specific settings and customizations in .claude
5. **VCS Agnostic**: Extend beyond bitbucket to support GitHub, GitLab, etc.

---

## Goal

Enhance the existing installation system to:
- Automatically configure the 3 framework MCP servers (context7, sequential, magic) with full functionality
- Replace stub implementations with working MCP servers that integrate with Claude Code
- Create a robust multi-project initialization system with template support
- Implement ~/.claude for global resources and .claude for project-specific settings
- Extend the bitbucket_integration pattern to support multiple VCS providers and project types

## Why

- **Reduced Friction**: Eliminate manual MCP configuration and setup steps
- **Consistency**: Standardized project structures and configurations across teams
- **Scalability**: Support everything from simple scripts to complex multi-service architectures
- **Reusability**: Shared templates and resources accelerate development
- **Flexibility**: Work with any VCS provider and project type

## What

### Core Enhancements

1. **MCP Auto-Configuration**: Replace stub implementations with working context7, sequential, and magic MCP servers
2. **Multi-Project Templates**: Template system for different project types (Python microservices, React apps, etc.)
3. **Directory Structure**: ~/.claude for global resources, .claude for project-specific settings
4. **VCS Integration**: Extend bitbucket_integration to support GitHub, GitLab, and other providers
5. **Project Initialization**: One-command project setup with intelligent template selection and working outside the code-agent repo

### Success Criteria

- [ ] Context7 MCP server replaces stub with working documentation and context management
- [ ] Sequential MCP server replaces stub with working complex analysis and reasoning
- [ ] Magic MCP server replaces stub with working UI component generation
- [ ] settings.json automatically populated with working MCP server configurations from mcp-config.yml
- [ ] ~/.claude directory structure created with templates and shared resources
- [ ] Project initialization works in any directory/repo, not just the code-agent repo
- [ ] Multi-VCS support working with GitHub, GitLab, and Bitbucket
- [ ] Template system supports Python, JavaScript, Terraform, and multi-service projects
- [ ] Existing bitbucket_integration patterns extended to new VCS providers

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Current Installation System
- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/installer.py
  why: Core profile-based installer with minimal/developer/enterprise profiles

- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/setup_wizard.py
  why: Interactive setup wizard patterns and user experience flows

- file: /Users/patrick.henry/dev/code-agent/start-claude-code.sh
  why: Main entry point script for Claude Code setup and configuration

- file: /Users/patrick.henry/dev/code-agent/docs/installation.md
  why: Comprehensive installation documentation and troubleshooting patterns

# MUST READ - MCP Server Requirements
- file: /Users/patrick.henry/dev/code-agent/.claude/shared/mcp-config.yml
  why: Complete MCP server configuration definitions for context7, sequential, and magic

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/context7.py
  why: Current stub implementation that needs to be replaced with working server

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/sequential.py
  why: Current stub implementation that needs to be replaced with working server

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/magic.py
  why: Current stub implementation that needs to be replaced with working server

# MUST READ - Current Bitbucket Integration
- file: /Users/patrick.henry/dev/code-agent/PRPs/scripts/bitbucket_integration.py
  why: Main integration class patterns for repository operations

- file: /Users/patrick.henry/dev/code-agent/PRPs/scripts/setup_bitbucket.py
  why: Configuration wizard and credential management patterns

- file: /Users/patrick.henry/dev/code-agent/PRPs/scripts/prp_runner_unified.py
  why: Unified PRP execution engine with framework integration

# MUST READ - Settings Configuration
- file: /Users/patrick.henry/dev/code-agent/.claude/settings.json
  why: Current settings structure and missing MCP server configurations

- file: /Users/patrick.henry/dev/code-agent/agent-resources/mcps/
  why: Available MCP server configurations and templates

# MUST READ - Template and Project Patterns
- url: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository
  why: GitHub template repository patterns and best practices

- url: https://cookiecutter.readthedocs.io/en/stable/
  why: Cookiecutter template system patterns and Jinja2 templating

- url: https://nx.dev/getting-started/intro
  why: Nx workspace patterns for multi-project management

- url: https://turborepo.org/docs
  why: Turborepo patterns for monorepo management and task orchestration

- url: https://docs.docker.com/compose/
  why: Docker Compose patterns for multi-service development environments

- docfile: PRPs/ai_docs/mcp-server-setup.md
  why: Detailed MCP server setup requirements and configuration patterns
```

### Current Codebase Tree

```bash
/Users/patrick.henry/dev/code-agent/
├── prp_framework/
│   ├── installation/
│   │   ├── installer.py              # Core profile-based installer
│   │   ├── setup_wizard.py           # Interactive setup wizard
│   │   └── components/               # Installation components
│   ├── mcp/                          # MCP framework stubs
│   │   ├── context7.py
│   │   ├── sequential.py
│   │   └── magic.py
├── examples/
│   ├── deep-research-mcp/            # Working Deep Research MCP
│   │   ├── docker-compose.yml
│   │   ├── src/mcp_server.py
│   │   └── requirements.txt
│   ├── whisper-mcp/                  # Working Whisper MCP
│   │   ├── mcp_server.py
│   │   ├── config.py
│   │   └── requirements.txt
├── PRPs/scripts/
│   ├── bitbucket_integration.py      # VCS integration patterns
│   ├── setup_bitbucket.py           # Configuration wizard
│   └── prp_runner_unified.py        # Unified execution engine
├── agent-resources/
│   ├── mcps/                        # MCP server configurations
│   └── deployment/scripts/          # Deployment utilities
├── .claude/
│   ├── settings.json                # Main settings (missing MCP config)
│   └── hooks/
├── start-claude-code.sh             # Main entry point
└── docs/installation.md             # Installation documentation
```

### Desired Codebase Tree

```bash
/Users/patrick.henry/dev/code-agent/
├── src/
│   ├── enhanced_installer/
│   │   ├── __init__.py
│   │   ├── core.py                  # Enhanced installer core
│   │   ├── mcp_configurator.py      # MCP server configuration
│   │   ├── template_manager.py      # Template system management
│   │   ├── project_initializer.py   # Project setup orchestration
│   │   └── vcs_integrator.py        # Multi-VCS support
│   ├── directory_manager/
│   │   ├── __init__.py
│   │   ├── global_resources.py      # ~/.claude management
│   │   ├── project_resources.py     # .claude management
│   │   └── template_system.py       # Template resolution and application
│   ├── multi_project/
│   │   ├── __init__.py
│   │   ├── workspace_manager.py     # Multi-project workspace management
│   │   ├── dependency_graph.py      # Project dependency tracking
│   │   └── orchestrator.py          # Task orchestration across projects
│   └── vcs_providers/
│       ├── __init__.py
│       ├── base_provider.py         # Base VCS integration class
│       ├── github_provider.py       # GitHub integration
│       ├── gitlab_provider.py       # GitLab integration
│       └── bitbucket_provider.py    # Enhanced Bitbucket integration
├── templates/
│   ├── global/                      # Global templates for ~/.claude
│   │   ├── project-types/
│   │   │   ├── python-microservice/
│   │   │   ├── react-app/
│   │   │   ├── terraform-module/
│   │   │   └── multi-service/
│   │   ├── claude-md/
│   │   └── dotfiles/
│   └── project/                     # Project-specific templates
│       ├── configurations/
│       ├── hooks/
│       └── workflows/
├── scripts/
│   ├── setup-code-agent.py         # Enhanced setup script
│   ├── init-project.py             # Project initialization script
│   └── configure-mcp.py            # MCP configuration utility
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Context7 MCP server (HTTP transport on port 8001)
# - Documentation fetching and context management
# - Research assistance and knowledge base integration
# - Currently stub implementation in prp_framework/mcp/context7.py

# CRITICAL: Sequential MCP server (stdio transport)
# - Complex analysis and step-by-step reasoning
# - Problem solving and structured thinking
# - Currently stub implementation in prp_framework/mcp/sequential.py

# CRITICAL: Magic MCP server (HTTP transport on port 8002)
# - UI component generation and template creation
# - Frontend assistance and code generation
# - Currently stub implementation but disabled in mcp-config.yml

# CRITICAL: Settings.json MCP configuration format
# Must translate mcp-config.yml to settings.json format:
# {
#   "mcpServers": {
#     "context7": {
#       "command": "python",
#       "args": ["-m", "prp_framework.mcp.context7"],
#       "env": {}
#     }
#   }
# }

# CRITICAL: Template system must support Jinja2 templating
# - Variable substitution in file contents
# - Conditional file inclusion
# - Directory structure generation
# - Hook execution for custom logic

# CRITICAL: VCS integration must handle authentication
# - Token-based authentication for APIs
# - SSH key management for git operations
# - URL encoding for special characters
# - Rate limiting for API operations
```

## Implementation Blueprint

### Data Models and Structure

```python
# Core data models for configuration and management
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Union
from enum import Enum

class MCPServerConfig(BaseModel):
    """MCP Server configuration"""
    command: str
    args: List[str]
    env: Dict[str, str] = Field(default_factory=dict)
    working_directory: Optional[str] = None
    timeout: int = 30

class ProjectType(str, Enum):
    """Supported project types"""
    PYTHON_MICROSERVICE = "python-microservice"
    REACT_APP = "react-app"
    TERRAFORM_MODULE = "terraform-module"
    MULTI_SERVICE = "multi-service"
    CUSTOM = "custom"

class VCSProvider(str, Enum):
    """Supported VCS providers"""
    GITHUB = "github"
    GITLAB = "gitlab"
    BITBUCKET = "bitbucket"
    AZURE_DEVOPS = "azure-devops"

class ProjectConfig(BaseModel):
    """Project-specific configuration"""
    name: str
    type: ProjectType
    vcs_provider: VCSProvider
    template_source: str
    customizations: Dict[str, Union[str, bool, int]] = Field(default_factory=dict)

class GlobalConfig(BaseModel):
    """Global code-agent configuration"""
    profile: str = "developer"
    template_sources: List[str] = Field(default_factory=list)
    mcp_servers: Dict[str, MCPServerConfig] = Field(default_factory=dict)
    vcs_configurations: Dict[str, Dict[str, str]] = Field(default_factory=dict)
```

### List of Tasks to Complete

```yaml
Task 1: Enhanced MCP Configuration System
CREATE src/enhanced_installer/mcp_configurator.py:
  - IMPLEMENT automatic MCP server detection from mcp-config.yml
  - ADD context7, sequential, and magic MCP server implementations
  - ADD settings.json MCP server section generation from mcp-config.yml
  - INCLUDE health checking and validation for all MCP servers
  - REPLACE stub implementations with working MCP server code

Task 2: Global Resource Management
CREATE src/directory_manager/global_resources.py:
  - IMPLEMENT ~/.claude directory structure creation
  - ADD template system with project-type templates
  - ADD shared configuration and resource management
  - INCLUDE cache management for performance optimization

Task 3: Project-Specific Resource Management
CREATE src/directory_manager/project_resources.py:
  - IMPLEMENT .claude directory structure creation
  - ADD project-specific configuration management
  - ADD template customization and override system
  - INCLUDE project-specific cache and resource management

Task 4: Template System Implementation
CREATE src/directory_manager/template_system.py:
  - IMPLEMENT Jinja2-based template processing
  - ADD template discovery and resolution
  - ADD variable substitution and conditional logic
  - INCLUDE template validation and error handling

Task 5: Enhanced Project Initializer
CREATE src/enhanced_installer/project_initializer.py:
  - IMPLEMENT project type detection and template selection
  - ADD interactive project customization wizard
  - ADD dependency management and validation
  - INCLUDE post-initialization validation and setup

Task 6: Multi-VCS Provider Support
CREATE src/vcs_providers/base_provider.py:
  - IMPLEMENT abstract base class for VCS operations
  - ADD common patterns for authentication and API operations
  - ADD error handling and retry logic
  - INCLUDE rate limiting and response validation

Task 7: GitHub Provider Implementation
CREATE src/vcs_providers/github_provider.py:
  - EXTEND base_provider patterns for GitHub API
  - ADD repository creation and management
  - ADD pull request and branch operations
  - INCLUDE GitHub Actions CI/CD integration

Task 8: GitLab Provider Implementation
CREATE src/vcs_providers/gitlab_provider.py:
  - EXTEND base_provider patterns for GitLab API
  - ADD repository creation and management
  - ADD merge request and branch operations
  - INCLUDE GitLab CI/CD integration

Task 9: Enhanced Bitbucket Provider
CREATE src/vcs_providers/bitbucket_provider.py:
  - REFACTOR existing bitbucket_integration.py into provider pattern
  - ADD enhanced error handling and validation
  - ADD workspace and project management
  - INCLUDE Bitbucket Pipelines integration

Task 10: Multi-Project Workspace Manager
CREATE src/multi_project/workspace_manager.py:
  - IMPLEMENT multi-project workspace configuration
  - ADD project dependency tracking and management
  - ADD shared resource coordination
  - INCLUDE workspace validation and health checking

Task 11: Task Orchestration System
CREATE src/multi_project/orchestrator.py:
  - IMPLEMENT task dependency resolution
  - ADD parallel execution with proper sequencing
  - ADD progress tracking and error handling
  - INCLUDE resource optimization and caching

Task 12: Enhanced Setup Script
CREATE scripts/setup-code-agent.py:
  - REFACTOR existing installation system into new architecture
  - ADD profile-based installation with MCP auto-configuration
  - ADD interactive setup wizard for project types
  - INCLUDE validation and health checking for all components

Task 13: Project Initialization Script
CREATE scripts/init-project.py:
  - IMPLEMENT one-command project initialization
  - ADD template selection and customization
  - ADD VCS integration setup
  - INCLUDE validation and post-setup verification

Task 14: Template Library Creation
CREATE templates/global/project-types/:
  - ADD Python microservice template with FastAPI patterns
  - ADD React app template with modern tooling
  - ADD Terraform module template with best practices
  - ADD multi-service template with orchestration
  - INCLUDE CLAUDE.md templates for each project type

Task 15: Integration Testing and Validation
CREATE comprehensive test suite:
  - ADD unit tests for all core components
  - ADD integration tests for MCP server setup
  - ADD end-to-end tests for project initialization
  - ADD performance tests for template processing
  - INCLUDE validation tests for all VCS providers
```

### Integration Points

```yaml
CLAUDE_SETTINGS:
  - modify: .claude/settings.json
  - add: mcpServers configuration section
  - pattern: "Context7, Sequential, and Magic MCP server configurations from mcp-config.yml"

MCP_CONFIG_TRANSLATION:
  - read: .claude/shared/mcp-config.yml
  - translate: YAML config to settings.json mcpServers format
  - pattern: "Automatic conversion of transport types and parameters"

WORKING_MCP_SERVERS:
  - replace: prp_framework/mcp/context7.py stub with HTTP server
  - replace: prp_framework/mcp/sequential.py stub with stdio server
  - replace: prp_framework/mcp/magic.py stub with HTTP server
  - pattern: "Fully functional MCP servers with proper transport implementations"

GLOBAL_DIRECTORIES:
  - create: ~/.claude/config/, ~/.claude/templates/
  - create: ~/.claude/cache/, ~/.claude/resources/
  - pattern: "Hierarchical configuration with inheritance"

PROJECT_DIRECTORIES:
  - create: .claude/config/, .claude/templates/
  - create: .claude/cache/, .claude/resources/
  - pattern: "Project-specific overrides and customizations"
```

## Validation Loop

### Level 1: MCP Server Configuration Validation

```bash
# Validate MCP server configurations
python -m src.enhanced_installer.mcp_configurator --validate-all

# Test Context7 MCP (HTTP on port 8001)
curl -X POST http://localhost:8001/context \
  -H "Content-Type: application/json" \
  -d '{"query": "test documentation", "type": "research"}'

# Test Sequential MCP (stdio transport)
python -m prp_framework.mcp.sequential --health-check

# Test Magic MCP (HTTP on port 8002)
curl -X POST http://localhost:8002/generate \
  -H "Content-Type: application/json" \
  -d '{"component": "button", "framework": "react"}'

# Expected: All MCP servers respond with healthy status
```

### Level 2: Template System Validation

```bash
# Test template processing
python -m src.directory_manager.template_system --test-templates

# Test project initialization
python scripts/init-project.py --project-type python-microservice --name test-service --dry-run

# Expected: Template processing completes without errors
```

### Level 3: VCS Integration Testing

```bash
# Test GitHub integration
python -m src.vcs_providers.github_provider --test-connection

# Test GitLab integration
python -m src.vcs_providers.gitlab_provider --test-connection

# Test Bitbucket integration
python -m src.vcs_providers.bitbucket_provider --test-connection

# Expected: All VCS providers authenticate and connect successfully
```

### Level 4: End-to-End Integration Testing

```bash
# Full project initialization test
python scripts/setup-code-agent.py --profile developer --auto-configure-mcp

# Initialize test project
python scripts/init-project.py --project-type python-microservice --name test-service --vcs github

# Validate project structure
ls -la test-service/.claude/
ls -la ~/.claude/templates/

# Expected: Complete project setup with working MCP servers and VCS integration
```

## Final Validation Checklist

- [ ] Context7 MCP server responds to context requests: `curl localhost:8001/context -d '{"query":"test"}'`
- [ ] Sequential MCP server processes complex analysis requests via stdio
- [ ] Magic MCP server generates UI components: `curl localhost:8002/generate -d '{"component":"button"}'`
- [ ] settings.json contains properly configured mcpServers section from mcp-config.yml
- [ ] ~/.claude directory structure created with templates and resources
- [ ] Project initialization works in any directory, not just code-agent repo
- [ ] GitHub provider creates repositories and pull requests successfully
- [ ] GitLab provider creates projects and merge requests successfully
- [ ] Bitbucket provider maintains existing functionality with enhanced patterns
- [ ] Template system processes Jinja2 templates correctly
- [ ] Multi-project workspace management tracks dependencies
- [ ] All tests pass: `uv run pytest tests/ -v`
- [ ] No linting errors: `uv run ruff check src/`
- [ ] No type errors: `uv run mypy src/`

---

## Anti-Patterns to Avoid

- ❌ Don't break existing bitbucket_integration functionality
- ❌ Don't require manual MCP server configuration
- ❌ Don't create project templates without proper validation
- ❌ Don't ignore VCS provider rate limits and authentication
- ❌ Don't hardcode AWS credentials or sensitive configuration
- ❌ Don't skip health checks for MCP servers and dependencies
- ❌ Don't create directory structures without proper permissions
- ❌ Don't ignore template processing errors or validation failures

## Confidence Score: 9/10

This PRP provides comprehensive context for implementing the enhanced installation system with:

✅ **Practical Implementation**: Clear task breakdown with specific file structures and responsibilities
✅ **Validation Gates**: Multiple levels of testing from unit tests to end-to-end integration
✅ **Error Prevention**: Detailed gotchas and anti-patterns to avoid common pitfalls
✅ **Performance Considerations**: Caching, resource management, and optimization strategies
✅ **Security Best Practices**: Credential management, input validation, and secure defaults

The implementation should achieve one-pass success with iterative refinement through the comprehensive validation loops.
