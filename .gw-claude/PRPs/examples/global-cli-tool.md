name: "Global CLI Tool for Code-Agent Framework v1.0"
description: |
  Build a comprehensive global CLI tool that provides worldwide access to the PRP framework capabilities, replaces the start-claude-code script with full feature parity, and enables project management and setup anywhere on the system.

---

## Goal

Build a professional global CLI tool `code-agent` that can be installed anywhere and provides comprehensive project management, Claude Code integration, and PRP framework capabilities. The tool should replace the existing start-claude-code script while adding significant new functionality for managing projects and integrating with Claude Code.

**End State:**
- Global CLI tool installable via `pip install code-agent`
- Commands like `code-agent integrate /path/to/project` work from anywhere
- Full replacement of start-claude-code.sh with feature parity
- Multi-project management capabilities
- Professional CLI experience with rich help, validation, and error handling

## Why

- **User Experience**: Eliminate the need to navigate to the code-agent repo and run complex Python commands
- **Accessibility**: Make PRP framework capabilities available globally on any system
- **Workflow Integration**: Seamlessly integrate with existing development workflows
- **Professional CLI**: Provide a polished, professional command-line interface
- **Feature Consolidation**: Combine existing installation, Claude Code management, and project setup into one tool

## What

A comprehensive CLI tool that provides:

### Core Commands
- `code-agent integrate <path>` - Integrate PRP framework into any project
- `code-agent create <type> <name>` - Create new projects with templates
- `code-agent claude start` - Start Claude Code with configuration
- `code-agent claude config` - Configure Claude Code settings
- `code-agent projects list` - List all integrated projects
- `code-agent projects active <name>` - Set active project
- `code-agent analyze <path>` - Analyze project for integration

### Success Criteria

- [ ] CLI tool installs globally via `pip install code-agent`
- [ ] All existing enhanced_installer.py functionality accessible via CLI
- [ ] Complete start-claude-code.sh feature parity in `code-agent claude` commands
- [ ] Multi-project management with workspace tracking
- [ ] Professional CLI with help, validation, and error handling
- [ ] Project templates and creation capabilities
- [ ] MCP server configuration and management
- [ ] AWS/Bedrock integration for Claude Code
- [ ] Comprehensive validation and testing framework

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://packaging.python.org/en/latest/tutorials/packaging-projects/
  why: Python packaging best practices, pyproject.toml, entry points, global installation

- url: https://click.palletsprojects.com/
  why: Click framework for professional CLI development, command groups, options, validation

- url: https://typer.tiangolo.com/
  why: Modern CLI framework with type hints, auto-completion, rich formatting

- file: prp_framework/installation/enhanced_installer.py
  why: Core functionality that needs to be exposed via CLI - project analysis, integration, templates

- file: start-claude-code.sh
  why: Feature parity requirements - AWS setup, Claude Code configuration, Bedrock integration

- file: prp_framework/__main__.py
  why: Existing CLI patterns and argparse structure to maintain consistency

- file: prp_framework/commands/cli.py
  why: Enhanced commands structure and sub-command organization

- file: prp_framework/installation/core.py
  why: Core installation engine with profiles, validation, and orchestration

- file: prp_framework/installation/multi_project/workspace_manager.py
  why: Multi-project management patterns and workspace tracking

- file: prp_framework/installation/template_manager.py
  why: Project template creation and management system

- file: prp_framework/installation/mcp_configurator.py
  why: MCP server configuration and management

- file: prp_framework/errors/error_handler.py
  why: Enhanced error handling patterns with user guidance and auto-resolution

- docfile: PRPs/ai_docs/cc_overview.md
  why: Claude Code installation, configuration, and management requirements

- docfile: PRPs/ai_docs/cc_troubleshoot.md
  why: Common issues and troubleshooting patterns for Claude Code integration
```

### Current Codebase Tree

```bash
/Users/patrick.henry/dev/code-agent
├── CLAUDE.md
├── prp_framework/
│   ├── __main__.py                    # Existing CLI entry point
│   ├── installation/
│   │   ├── enhanced_installer.py      # Core functionality to expose
│   │   ├── core.py                    # Installation engine
│   │   ├── template_manager.py        # Template system
│   │   ├── mcp_configurator.py        # MCP management
│   │   └── multi_project/
│   │       └── workspace_manager.py   # Project management
│   ├── commands/
│   │   └── cli.py                     # Enhanced commands
│   ├── errors/
│   │   └── error_handler.py           # Error handling patterns
│   └── analysis/
│       └── project_analyzer.py        # Project analysis
├── start-claude-code.sh               # Script to replace
├── examples/                          # Project templates
└── PRPs/ai_docs/                      # Documentation
```

Always output the code in the src dir, do not modify any other existing code in the repo

### Desired Codebase Tree

```bash
src/
├── code_agent/
│   ├── __init__.py
│   ├── __main__.py                    # CLI entry point
│   ├── cli/
│   │   ├── __init__.py
│   │   ├── main.py                    # Main CLI application
│   │   ├── commands/
│   │   │   ├── __init__.py
│   │   │   ├── integrate.py           # Integration commands
│   │   │   ├── create.py              # Project creation
│   │   │   ├── claude.py              # Claude Code management
│   │   │   ├── projects.py            # Project management
│   │   │   └── analyze.py             # Project analysis
│   │   ├── utils/
│   │   │   ├── __init__.py
│   │   │   ├── config.py              # Configuration management
│   │   │   ├── validation.py          # Input validation
│   │   │   ├── output.py              # Formatted output
│   │   │   └── aws_setup.py           # AWS/Bedrock setup
│   │   └── core/
│   │       ├── __init__.py
│   │       ├── installer.py           # Installation wrapper
│   │       ├── project_manager.py     # Project management
│   │       ├── claude_manager.py      # Claude Code integration
│   │       └── template_engine.py     # Template system
│   ├── models/
│   │   ├── __init__.py
│   │   ├── project.py                 # Project data models
│   │   ├── config.py                  # Configuration models
│   │   └── command.py                 # Command models
│   └── exceptions/
│       ├── __init__.py
│       └── cli_exceptions.py          # CLI-specific exceptions
├── tests/
│   ├── __init__.py
│   ├── test_cli.py                    # CLI integration tests
│   ├── test_commands.py               # Command tests
│   ├── test_integration.py            # Integration tests
│   └── fixtures/                      # Test fixtures
└── pyproject.toml                     # Package configuration
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Click requires careful handling of context passing
# Use @click.pass_context for accessing parent command context
# Example: @click.pass_context followed by def cmd(ctx, ...):

# CRITICAL: Async functions in CLI commands need asyncio.run()
# Click doesn't natively support async, need to wrap with asyncio.run()
# Example: asyncio.run(enhanced_installer.analyze_existing_project(path))

# CRITICAL: Path handling across platforms
# Use pathlib.Path for cross-platform compatibility
# Always resolve paths with Path(path).resolve()

# CRITICAL: Error handling in CLI must be user-friendly
# Transform technical errors into actionable user messages
# Use existing error_handler.py patterns for consistency

# CRITICAL: Configuration file locations
# Use click.get_app_dir() for cross-platform config directory
# Example: config_dir = click.get_app_dir('code-agent')

# CRITICAL: AWS credential detection
# Check for AWS CLI, environment variables, and IAM roles
# Use boto3.Session() for credential detection patterns

# CRITICAL: Global installation requires proper entry points
# Use pyproject.toml [project.scripts] for console scripts
# Example: code-agent = "code_agent.cli.main:main"

# CRITICAL: Rich formatting for professional output
# Use rich.console for colored output, progress bars, tables
# Maintain consistency with existing output patterns
```

## Implementation Blueprint

### Data Models and Structure

Create core data models for type safety and consistency:

```python
# src/code_agent/models/project.py
from dataclasses import dataclass
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime

@dataclass
class Project:
    name: str
    path: Path
    framework: Optional[str]
    languages: List[str]
    integration_level: str
    prp_framework_repo: Path
    created_at: datetime
    last_updated: datetime
    metadata: Dict[str, Any]

@dataclass
class ProjectRegistry:
    registered_projects: Dict[str, Project]
    active_project: Optional[str]

    def get_active(self) -> Optional[Project]:
        if self.active_project:
            return self.registered_projects.get(self.active_project)
        return None

# src/code_agent/models/config.py
@dataclass
class CLIConfig:
    framework_path: Path
    config_dir: Path
    aws_region: str
    claude_config_path: Path
    bedrock_enabled: bool
    installation_profiles: List[str]
```

### List of tasks to be completed to fulfill the PRP in order

```yaml
Task 1: Setup Package Structure and Configuration
CREATE src/code_agent/__init__.py:
  - VERSION constant and package metadata
  - Core imports and exports

CREATE pyproject.toml:
  - MIRROR pattern from: examples/agents/*/pyproject.toml
  - PROJECT metadata with entry points
  - DEPENDENCIES: click, rich, boto3, pydantic, httpx, uvicorn
  - CONSOLE_SCRIPTS: code-agent = "code_agent.cli.main:main"

Task 2: Core CLI Application Structure
CREATE src/code_agent/cli/main.py:
  - CLICK application with command groups
  - GLOBAL options and configuration
  - ERROR handling with rich formatting
  - MIRROR pattern from: prp_framework/__main__.py

CREATE src/code_agent/cli/__init__.py:
  - CLI module exports
  - Version information

Task 3: Configuration and Utilities
CREATE src/code_agent/utils/config.py:
  - CONFIGURATION loading and management
  - CROSS-PLATFORM config directory handling
  - MIRROR pattern from: prp_framework/config/config_loader.py

CREATE src/code_agent/utils/output.py:
  - RICH formatting utilities
  - COLORED output with emoji status indicators
  - MIRROR pattern from: start-claude-code.sh color codes

CREATE src/code_agent/utils/validation.py:
  - INPUT validation for paths, project names
  - DEPENDENCY validation (AWS CLI, Node.js, etc.)
  - MIRROR pattern from: prp_framework/validation/

Task 4: Project Integration Commands
CREATE src/code_agent/cli/commands/integrate.py:
  - ANALYZE command for project analysis
  - INTEGRATE command for project integration
  - MINIMAL-INTEGRATE command for clean integration
  - MIRROR pattern from: prp_framework/installation/enhanced_installer.py

CREATE src/code_agent/core/installer.py:
  - WRAPPER for enhanced_installer functionality
  - ASYNC to sync conversion for CLI usage
  - ERROR handling and user feedback

Task 5: Project Management Commands
CREATE src/code_agent/cli/commands/projects.py:
  - LIST command for registered projects
  - ACTIVE command for setting active project
  - REMOVE command for project removal
  - MIRROR pattern from: prp_framework/installation/multi_project/

CREATE src/code_agent/core/project_manager.py:
  - PROJECT registry management
  - WORKSPACE tracking and coordination
  - MIRROR pattern from: workspace_manager.py

Task 6: Project Creation Commands
CREATE src/code_agent/cli/commands/create.py:
  - CREATE command for new projects
  - TEMPLATE selection and customization
  - VCS integration options
  - MIRROR pattern from: prp_framework/installation/template_manager.py

CREATE src/code_agent/core/template_engine.py:
  - TEMPLATE processing and generation
  - JINJA2 template rendering
  - PROJECT type detection and setup

Task 7: Claude Code Management Commands
CREATE src/code_agent/cli/commands/claude.py:
  - START command (replace start-claude-code.sh)
  - CONFIG command for Claude Code configuration
  - VALIDATE command for setup validation
  - MIRROR pattern from: start-claude-code.sh

CREATE src/code_agent/core/claude_manager.py:
  - CLAUDE CODE installation and validation
  - AWS/BEDROCK configuration
  - MCP server setup and management
  - MIRROR pattern from: start-claude-code.sh logic

CREATE src/code_agent/utils/aws_setup.py:
  - AWS credential detection and setup
  - BEDROCK configuration
  - INTERACTIVE setup wizard
  - MIRROR pattern from: start-claude-code.sh AWS logic

Task 8: Analysis Commands
CREATE src/code_agent/cli/commands/analyze.py:
  - ANALYZE command for project analysis
  - FRAMEWORK detection and recommendations
  - INTEGRATION level suggestions
  - MIRROR pattern from: prp_framework/analysis/project_analyzer.py

Task 9: Error Handling and Exceptions
CREATE src/code_agent/exceptions/cli_exceptions.py:
  - CLI-SPECIFIC exception classes
  - USER-FRIENDLY error messages
  - MIRROR pattern from: prp_framework/errors/error_handler.py

Task 10: Main Entry Point
CREATE src/code_agent/__main__.py:
  - CLI entry point with error handling
  - SUPPORT for python -m code_agent
  - GRACEFUL error handling and logging

Task 11: Comprehensive Testing
CREATE tests/test_cli.py:
  - CLI integration tests
  - COMMAND execution validation
  - ERROR handling verification

CREATE tests/test_commands.py:
  - INDIVIDUAL command testing
  - PARAMETER validation
  - OUTPUT verification

CREATE tests/test_integration.py:
  - END-TO-END integration tests
  - PROJECT lifecycle testing
  - CLAUDE CODE integration testing
```

### Per-task Pseudocode

```python
# Task 1: Package Structure
# pyproject.toml structure with proper entry points
[project]
name = "code-agent"
version = "1.0.0"
dependencies = ["click>=8.0", "rich>=13.0", "boto3", "pydantic", "httpx", "uvicorn"]

[project.scripts]
code-agent = "code_agent.cli.main:main"

# Task 2: CLI Application
# PATTERN: Multi-level command structure like existing CLI
@click.group()
@click.version_option()
@click.pass_context
def main(ctx):
    """Code Agent CLI - Global project management and Claude Code integration"""
    ctx.ensure_object(dict)
    # Initialize configuration and context

@main.group()
def claude():
    """Claude Code management commands"""
    pass

@main.command()
@click.argument('path', type=click.Path(exists=True))
@click.option('--level', type=click.Choice(['minimal', 'standard', 'enhanced', 'full']))
def integrate(path, level):
    """Integrate PRP framework into project"""
    # CRITICAL: Wrap async calls with asyncio.run()
    path_obj = Path(path).resolve()
    result = asyncio.run(enhanced_installer.integrate_existing_project(path_obj, level))
    # PATTERN: Rich output with status indicators
    console.print(f"✅ Integration successful: {path_obj}")

# Task 7: Claude Code Management
@claude.command()
@click.option('--continue', 'continue_mode', is_flag=True, help='Enable continue mode')
def start(continue_mode):
    """Start Claude Code with configuration"""
    # PATTERN: Replicate start-claude-code.sh logic
    # 1. Validate dependencies (AWS CLI, Node.js, Claude Code)
    # 2. Configure AWS credentials and Bedrock
    # 3. Set environment variables
    # 4. Launch Claude Code with appropriate flags

    # CRITICAL: Dependency validation first
    validate_dependencies()

    # CRITICAL: AWS setup with interactive prompts
    setup_aws_credentials()

    # CRITICAL: Environment variable configuration
    setup_environment_variables()

    # CRITICAL: Claude Code launch with fallback commands
    launch_claude_code(continue_mode)

# Task 4: Project Integration
# PATTERN: Error handling with user guidance
try:
    analysis = asyncio.run(enhanced_installer.analyze_existing_project(project_path))
    if analysis.has_conflicts:
        console.print("⚠️  Conflicts detected:", style="yellow")
        for conflict in analysis.conflicts:
            console.print(f"  - {conflict}")
        confirm = click.confirm("Continue with integration?")
        if not confirm:
            raise click.Abort()
except Exception as e:
    # PATTERN: Transform technical errors to user-friendly messages
    error_handler = ErrorHandler()
    user_message = error_handler.handle_cli_error(e)
    console.print(f"❌ {user_message}", style="red")
    sys.exit(1)
```

### Integration Points

```yaml
PACKAGING:
  - file: pyproject.toml
  - pattern: "[project.scripts] code-agent = 'code_agent.cli.main:main'"
  - dependencies: "click>=8.0, rich>=13.0, boto3, pydantic, httpx, uvicorn"

FRAMEWORK_INTEGRATION:
  - import: "from prp_framework.installation.enhanced_installer import EnhancedInstaller"
  - pattern: "asyncio.run(installer.method())" for async calls
  - config: "Use existing prp_framework configuration patterns"

ERROR_HANDLING:
  - import: "from prp_framework.errors.error_handler import ErrorHandler"
  - pattern: "Transform technical errors to user-friendly CLI messages"
  - output: "Use rich.console for formatted error display"

CONFIGURATION:
  - directory: "~/.config/code-agent/" (cross-platform)
  - files: "config.json, projects.json, claude_config.json"
  - pattern: "Use click.get_app_dir() for platform-specific paths"

AWS_INTEGRATION:
  - credentials: "boto3.Session() for credential detection"
  - bedrock: "Environment variables for Bedrock configuration"
  - validation: "AWS CLI and credential validation before Claude Code start"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
ruff check src/ --fix                    # Auto-fix style issues
mypy src/                               # Type checking
black src/                              # Code formatting

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests

```python
# CREATE tests/test_cli.py with comprehensive CLI tests:
def test_cli_entry_point():
    """CLI entry point works correctly"""
    result = runner.invoke(main, ['--version'])
    assert result.exit_code == 0
    assert "code-agent" in result.output

def test_integrate_command():
    """Integration command works with valid project"""
    with temp_project() as project_path:
        result = runner.invoke(main, ['integrate', str(project_path)])
        assert result.exit_code == 0
        assert "✅ Integration successful" in result.output

def test_claude_start_command():
    """Claude start command validates dependencies"""
    with mock.patch('code_agent.utils.validation.validate_dependencies') as mock_validate:
        mock_validate.return_value = True
        result = runner.invoke(main, ['claude', 'start'])
        assert result.exit_code == 0

def test_projects_list_command():
    """Projects list command shows registered projects"""
    result = runner.invoke(main, ['projects', 'list'])
    assert result.exit_code == 0
    assert "Registered Projects" in result.output

def test_error_handling():
    """Invalid commands show helpful error messages"""
    result = runner.invoke(main, ['integrate', '/nonexistent/path'])
    assert result.exit_code == 1
    assert "❌" in result.output
    assert "Path does not exist" in result.output
```

```bash
# Run and iterate until passing:
uv run pytest tests/test_cli.py -v
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Tests

```bash
# Test global installation
pip install -e .

# Test CLI availability
code-agent --version

# Test project integration
mkdir test_project && cd test_project
echo "print('hello')" > main.py
code-agent integrate .
# Expected: ✅ Integration successful

# Test Claude Code integration
code-agent claude config
# Expected: Interactive AWS setup

# Test project management
code-agent projects list
# Expected: Shows integrated projects

# Test project creation
code-agent create python-microservice my-test-service
# Expected: New project created with template
```

### Level 4: Creative Validation

```bash
# End-to-end workflow validation
# 1. Install CLI globally
pip install -e .

# 2. Create and integrate multiple projects
for project_type in python-microservice react-app terraform-module; do
    code-agent create $project_type test-$project_type
    code-agent integrate test-$project_type
done

# 3. Test multi-project management
code-agent projects list
code-agent projects active test-python-microservice
code-agent projects list | grep "✅ test-python-microservice"

# 4. Test Claude Code full workflow
code-agent claude config  # Interactive setup
code-agent claude start   # Should launch Claude Code
code-agent claude start --continue  # Should support continue mode

# 5. Performance and error testing
# Test with large project
git clone https://github.com/fastapi/fastapi large-project
time code-agent analyze large-project
# Expected: <5 seconds analysis time

# Test error handling
code-agent integrate /nonexistent/path
# Expected: User-friendly error message with suggestions

# 6. Cross-platform testing
# Test on different platforms (Linux, macOS, Windows)
# Test with different shells (bash, zsh, fish)
# Test shell completion if implemented
```

## Final Validation Checklist

- [ ] Global installation works: `pip install -e .`
- [ ] CLI entry point works: `code-agent --version`
- [ ] All commands have help: `code-agent --help`, `code-agent claude --help`
- [ ] Project integration works: `code-agent integrate /path/to/project`
- [ ] Project creation works: `code-agent create python-microservice test-project`
- [ ] Multi-project management works: `code-agent projects list/active`
- [ ] Claude Code integration works: `code-agent claude start`
- [ ] AWS/Bedrock configuration works: `code-agent claude config`
- [ ] Error handling is user-friendly: Invalid commands show helpful messages
- [ ] All tests pass: `uv run pytest tests/ -v`
- [ ] No linting errors: `uv run ruff check src/`
- [ ] No type errors: `uv run mypy src/`
- [ ] Package builds correctly: `python -m build`
- [ ] Rich formatting works: Colored output, progress indicators
- [ ] Cross-platform compatibility: Works on Linux, macOS, Windows
- [ ] Professional CLI experience: Intuitive commands, helpful output

---

## Anti-Patterns to Avoid

- ❌ Don't reinvent CLI patterns - use Click's established conventions
- ❌ Don't make sync wrappers complex - use simple asyncio.run() calls
- ❌ Don't ignore error handling - transform technical errors to user messages
- ❌ Don't hardcode paths - use click.get_app_dir() for config directories
- ❌ Don't skip dependency validation - check AWS CLI, Node.js, Claude Code
- ❌ Don't make commands too verbose - provide concise, actionable output
- ❌ Don't break existing functionality - maintain backward compatibility
- ❌ Don't skip testing - comprehensive testing ensures reliability

## Quality Score: 9/10

**Confidence Level**: High for one-pass implementation success

**Rationale**:
- Comprehensive research of existing codebase patterns
- Detailed feature parity requirements from start-claude-code.sh
- Clear integration points with existing enhanced_installer functionality
- Professional CLI framework choice (Click) with rich formatting
- Extensive validation loops from syntax to end-to-end testing
- User-friendly error handling patterns established
- Cross-platform compatibility considerations
- Proper Python packaging for global installation
