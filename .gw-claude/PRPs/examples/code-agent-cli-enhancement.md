# Code-Agent CLI Tool Enhancement PRP

## Goal

Transform the existing code-agent CLI tool in `src/` directory to achieve complete feature parity with the prp-framework/installation module, creating a globally installable CLI tool that can manage Claude Code installation and framework integration from anywhere on the system.

## Why

- **Unified Management**: Single CLI tool for all Claude Code and PRP framework operations
- **Global Accessibility**: Install once, use anywhere without path dependencies
- **Feature Completeness**: Full integration levels, backup/rollback, MCP configuration, VCS integration
- **Production Ready**: Enterprise-grade reliability with comprehensive validation and error handling
- **Developer Experience**: Intuitive commands with rich formatting and auto-completion

## What

Create a comprehensive CLI tool that supports:
- **Installation Management**: Global Claude Code installation with profile-based configurations
- **Project Integration**: Four integration levels (minimal, standard, enhanced, full)
- **Multi-Project Support**: Workspace management and project orchestration
- **VCS Integration**: GitHub, GitLab, Bitbucket repository management
- **MCP Server Configuration**: Automatic server setup and health monitoring
- **Backup/Rollback System**: Transaction-based atomic operations with recovery
- **Hook Integration**: Claude Code hooks configuration and management
- **Template System**: Project templates with Jinja2 processing
- **Advanced Project Analysis**: Framework detection and integration recommendations

### Success Criteria

- [ ] Global CLI installation with `pip install -e .` works across all systems
- [ ] All four integration levels (minimal, standard, enhanced, full) implemented
- [ ] Backup/rollback system with transaction support and automatic recovery
- [ ] MCP server auto-configuration with health monitoring
- [ ] VCS integration for GitHub, GitLab, Bitbucket with authentication
- [ ] Hook system integration with Claude Code lifecycle events
- [ ] Template system with Jinja2 processing and validation
- [ ] Comprehensive validation system with 4-level testing
- [ ] Rich CLI interface with progress bars, colored output, and auto-completion
- [ ] 100% test coverage with unit, integration, and end-to-end tests

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://click.palletsprojects.com/en/8.1.x/
  why: Professional CLI patterns, command structure, decorator-based design

- url: https://typer.tiangolo.com/
  why: Type-driven CLI development, rich formatting, auto-completion

- url: https://github.com/pydantic/pydantic
  why: Data validation patterns, configuration management, model-based validation

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/cli/main.py
  why: Current CLI architecture and command structure to build upon

- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/enhanced_installer.py
  why: Target feature set and installation patterns to replicate

- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/existing_project_integrator.py
  why: Integration levels implementation and backup/rollback patterns

- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/mcp_configurator.py
  why: MCP server configuration and auto-setup patterns

- file: /Users/patrick.henry/dev/code-agent/prp_framework/installation/vcs_integrator.py
  why: VCS integration patterns and provider management

- file: /Users/patrick.henry/dev/code-agent/PRPs/ai_docs/cc_hooks.md
  why: Claude Code hooks system and integration patterns

- docfile: /Users/patrick.henry/dev/code-agent/PRPs/ai_docs/cc_overview.md
  why: Claude Code overview and architecture understanding

- docfile: /Users/patrick.henry/dev/code-agent/PRPs/ai_docs/cc_settings.md
  why: Settings and configuration management patterns
```

### Current Codebase Tree

```bash
src/
├── README.md
├── code_agent/
│   ├── __init__.py
│   ├── __main__.py
│   ├── cli/
│   │   ├── __init__.py
│   │   ├── commands/
│   │   │   ├── __init__.py
│   │   │   ├── analyze.py
│   │   │   ├── claude.py
│   │   │   ├── create.py
│   │   │   ├── integrate.py
│   │   │   └── projects.py
│   │   ├── core/
│   │   │   ├── __init__.py
│   │   │   ├── installer.py
│   │   │   └── project_manager.py
│   │   ├── main.py
│   │   └── utils/
│   │       ├── __init__.py
│   │       ├── config.py
│   │       ├── output.py
│   │       └── validation.py
│   ├── exceptions/
│   │   ├── __init__.py
│   │   └── cli_exceptions.py
│   └── models/
│       ├── __init__.py
│       ├── command.py
│       ├── config.py
│       └── project.py
├── pyproject.toml
├── tests/
└── uv.lock
```

Always output the code in the src dir, do not modify any other existing code in the repo

### Desired Codebase Tree with Files to be Added and Responsibility

```bash
src/
├── code_agent/
│   ├── cli/
│   │   ├── commands/
│   │   │   ├── install.py          # Global installation management
│   │   │   ├── workspace.py        # Multi-project workspace management
│   │   │   ├── templates.py        # Template system management
│   │   │   ├── mcp.py              # MCP server configuration
│   │   │   ├── hooks.py            # Hook system integration
│   │   │   ├── backup.py           # Backup/rollback management
│   │   │   └── validate.py         # Multi-level validation system
│   │   ├── core/
│   │   │   ├── backup_manager.py   # Transaction-based backup/rollback
│   │   │   ├── mcp_manager.py      # MCP server lifecycle management
│   │   │   ├── template_engine.py  # Jinja2 template processing
│   │   │   ├── vcs_manager.py      # VCS provider management
│   │   │   ├── hook_manager.py     # Hook configuration and execution
│   │   │   └── workspace_manager.py # Multi-project coordination
│   │   └── providers/
│   │       ├── __init__.py
│   │       ├── github.py           # GitHub integration
│   │       ├── gitlab.py           # GitLab integration
│   │       └── bitbucket.py        # Bitbucket integration
│   ├── models/
│   │   ├── integration.py          # Integration level models
│   │   ├── backup.py               # Backup/rollback models
│   │   ├── mcp.py                  # MCP server models
│   │   ├── template.py             # Template system models
│   │   ├── vcs.py                  # VCS provider models
│   │   ├── hook.py                 # Hook system models
│   │   └── workspace.py            # Workspace models
│   ├── services/
│   │   ├── __init__.py
│   │   ├── installation.py         # Installation orchestration
│   │   ├── integration.py          # Project integration service
│   │   ├── validation.py           # Multi-level validation service
│   │   └── analysis.py             # Project analysis service
│   └── utils/
│       ├── transaction.py          # Transaction management utilities
│       ├── rich_output.py          # Rich formatting and progress
│       ├── async_utils.py          # Async/await utilities
│       └── security.py             # Security validation utilities
```

### Known Gotchas of our Codebase & Library Quirks

```python
# CRITICAL: Click vs Typer decision - current codebase uses Click
# Stay consistent with existing Click patterns, don't introduce Typer

# CRITICAL: Async/await patterns throughout the codebase
# Use asyncio.run() wrapper for CLI compatibility with async core functions
# Example: asyncio.run(installer.integrate_project(...))

# CRITICAL: Pydantic v2 is used throughout
# Use Field() for validation and default values
# Example: backup_enabled: bool = Field(default=True)

# CRITICAL: Cross-platform Path handling
# Always use pathlib.Path, never string concatenation
# Example: config_dir = Path.home() / ".claude"

# CRITICAL: Environment variable handling
# Use os.getenv() with defaults and validation
# Example: GITHUB_TOKEN = os.getenv("GITHUB_TOKEN", "")

# CRITICAL: Error handling patterns
# Use custom exceptions from exceptions/ directory
# Always provide actionable error messages

# CRITICAL: Configuration management
# Use click.get_app_dir('code-agent') for cross-platform config
# Store config in JSON files with Pydantic models

# CRITICAL: Rich output formatting
# Use existing output.py patterns for consistent formatting
# Don't mix print() with rich console output

# CRITICAL: Testing patterns
# Use pytest with async support: pytest-asyncio
# Mock external services (GitHub API, file operations)
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive data models for type safety and validation:

```python
# Integration models for all four levels
@dataclass
class IntegrationConfig:
    level: IntegrationLevel
    enable_mcp: bool = True
    enable_vcs: bool = True
    enable_templates: bool = True
    enable_hooks: bool = True
    backup_enabled: bool = True

# Backup/rollback models for transaction management
@dataclass
class TransactionState:
    transaction_id: str
    start_time: float
    operations: List[Operation]
    checkpoints: List[Checkpoint]
    status: TransactionStatus

# MCP server models for lifecycle management
@dataclass
class MCPServerConfig:
    name: str
    type: str  # stdio, http
    command: List[str]
    enabled: bool = True
    health_check_interval: int = 300
    auto_restart: bool = True

# VCS provider models
@dataclass
class VCSConfig:
    provider: str  # github, gitlab, bitbucket
    token: str
    username: str
    email: str
    base_url: Optional[str] = None
```

### List of Tasks to be Completed

```yaml
Task 1: Enhanced Installation Command
CREATE src/code_agent/cli/commands/install.py:
  - IMPLEMENT global installation with profile selection
  - ADD backup/rollback for installation process
  - INTEGRATE MCP server auto-configuration
  - INCLUDE comprehensive validation system

Task 2: Advanced Integration Levels
MODIFY src/code_agent/cli/commands/integrate.py:
  - EXTEND existing integration with all four levels
  - ADD transaction-based backup/rollback
  - IMPLEMENT project analysis and recommendations
  - INTEGRATE with workspace management

Task 3: Backup/Rollback System
CREATE src/code_agent/core/backup_manager.py:
  - IMPLEMENT transaction-based atomic operations
  - ADD checkpoint system for recovery
  - INTEGRATE with all CLI commands
  - INCLUDE automatic rollback on failure

Task 4: MCP Server Management
CREATE src/code_agent/cli/commands/mcp.py:
CREATE src/code_agent/core/mcp_manager.py:
  - IMPLEMENT auto-configuration from YAML
  - ADD health monitoring and restart
  - INTEGRATE with installation profiles
  - INCLUDE settings.json integration

Task 5: VCS Integration
CREATE src/code_agent/cli/commands/vcs.py:
CREATE src/code_agent/core/vcs_manager.py:
CREATE src/code_agent/providers/github.py:
CREATE src/code_agent/providers/gitlab.py:
CREATE src/code_agent/providers/bitbucket.py:
  - IMPLEMENT provider pattern for VCS
  - ADD authentication handling
  - INTEGRATE with project creation
  - INCLUDE repository management

Task 6: Hook System Integration
CREATE src/code_agent/cli/commands/hooks.py:
CREATE src/code_agent/core/hook_manager.py:
  - IMPLEMENT hook configuration management
  - ADD UserPromptSubmit and PreToolUse support
  - INTEGRATE with Claude Code lifecycle
  - INCLUDE validation and testing

Task 7: Template System
CREATE src/code_agent/cli/commands/templates.py:
CREATE src/code_agent/core/template_engine.py:
  - IMPLEMENT Jinja2 template processing
  - ADD template validation and testing
  - INTEGRATE with project creation
  - INCLUDE custom template support

Task 8: Workspace Management
CREATE src/code_agent/cli/commands/workspace.py:
CREATE src/code_agent/core/workspace_manager.py:
  - IMPLEMENT multi-project coordination
  - ADD project registry and status tracking
  - INTEGRATE with all CLI commands
  - INCLUDE workspace configuration

Task 9: Validation System
CREATE src/code_agent/cli/commands/validate.py:
CREATE src/code_agent/services/validation.py:
  - IMPLEMENT 4-level validation system
  - ADD MCP server health checks
  - INTEGRATE with installation and integration
  - INCLUDE comprehensive reporting

Task 10: Rich Output and UX
MODIFY src/code_agent/utils/output.py:
CREATE src/code_agent/utils/rich_output.py:
  - ENHANCE with progress bars and spinners
  - ADD colored output and formatting
  - INTEGRATE with all CLI commands
  - INCLUDE auto-completion support

Task 11: Testing and Documentation
CREATE comprehensive test suite:
  - IMPLEMENT unit tests for all components
  - ADD integration tests for workflows
  - CREATE end-to-end tests for CLI commands
  - INCLUDE performance and security tests
```

### Per Task Pseudocode

```python
# Task 1: Enhanced Installation Command
async def install_command(profile: str, interactive: bool = False):
    # PATTERN: Use existing validation patterns
    config = validate_installation_config(profile)

    # PATTERN: Transaction-based operations
    async with TransactionManager() as tx:
        # CRITICAL: Backup before any changes
        await tx.create_checkpoint("pre_install")

        # GOTCHA: Profile-based component selection
        components = get_profile_components(profile)

        # PATTERN: Async orchestration
        await install_claude_code(components.claude_code)
        await setup_mcp_servers(components.mcp_servers)
        await configure_vcs_integration(components.vcs)

        # CRITICAL: Validation before commit
        await validate_installation(config)

        await tx.commit()

# Task 3: Backup/Rollback System
class TransactionManager:
    async def __aenter__(self):
        self.transaction_id = generate_transaction_id()
        self.checkpoints = []
        self.operations = []
        return self

    async def create_checkpoint(self, name: str):
        # PATTERN: Capture filesystem and config state
        state = await capture_system_state()
        checkpoint = Checkpoint(name, state, time.time())
        self.checkpoints.append(checkpoint)

    async def rollback_to_checkpoint(self, checkpoint_name: str):
        # CRITICAL: Atomic rollback operations
        checkpoint = find_checkpoint(checkpoint_name)
        await restore_system_state(checkpoint.state)

# Task 4: MCP Server Management
class MCPManager:
    async def auto_configure_servers(self, profile: str):
        # PATTERN: Load configuration from YAML
        config = load_mcp_config()
        servers = get_profile_servers(profile)

        for server in servers:
            # GOTCHA: Generate working server implementations
            await self.generate_server_code(server)
            await self.validate_server_health(server)
            await self.integrate_with_settings(server)

    async def monitor_server_health(self, server: MCPServerConfig):
        # PATTERN: Continuous health monitoring
        while server.enabled:
            is_healthy = await self.check_server_health(server)
            if not is_healthy and server.auto_restart:
                await self.restart_server(server)
            await asyncio.sleep(server.health_check_interval)
```

### Integration Points

```yaml
CONFIGURATION:
  - global_config: ~/.claude/config.json
  - project_config: .claude/metadata.json
  - workspace_config: ~/.claude/workspace.json

CLAUDE_CODE:
  - settings: ~/.claude/settings.json
  - hooks: .claude/hooks/
  - mcp_servers: .claude/mcp-config.yml

VCS_INTEGRATION:
  - providers: GitHub, GitLab, Bitbucket
  - authentication: Environment variables and config files
  - repository_management: Creation, cloning, PR management

BACKUP_SYSTEM:
  - transaction_log: ~/.claude/transactions/
  - checkpoints: ~/.claude/backups/
  - recovery_scripts: ~/.claude/recovery/

TEMPLATE_SYSTEM:
  - global_templates: ~/.claude/templates/
  - project_templates: .claude/templates/
  - template_cache: ~/.claude/cache/templates/
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
ruff check src/code_agent/ --fix
mypy src/code_agent/
black src/code_agent/
isort src/code_agent/

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests

```python
# CREATE comprehensive test suite
# Test each component individually with mocks

# Test installation command
def test_install_minimal_profile():
    """Test minimal profile installation"""
    result = runner.invoke(install_command, ['--profile', 'minimal'])
    assert result.exit_code == 0
    assert "Installation completed" in result.output

# Test integration levels
def test_integration_levels():
    """Test all four integration levels"""
    for level in ['minimal', 'standard', 'enhanced', 'full']:
        result = runner.invoke(integrate_command, ['--level', level])
        assert result.exit_code == 0

# Test backup/rollback system
def test_backup_rollback():
    """Test transaction-based backup and rollback"""
    with TransactionManager() as tx:
        tx.create_checkpoint("test")
        # Simulate failure
        with pytest.raises(Exception):
            raise Exception("Simulated failure")
        # Should automatically rollback

# Test MCP server management
def test_mcp_server_configuration():
    """Test MCP server auto-configuration"""
    manager = MCPManager()
    result = await manager.auto_configure_servers("developer")
    assert result.success
    assert len(result.configured_servers) > 0

# Test VCS integration
def test_vcs_providers():
    """Test VCS provider integration"""
    for provider in ['github', 'gitlab', 'bitbucket']:
        vcs = VCSManager(provider)
        result = await vcs.create_repository("test-repo")
        assert result.success
```

```bash
# Run and iterate until passing:
uv run pytest tests/ -v --asyncio-mode=auto
uv run pytest tests/ --cov=src/code_agent --cov-report=html
# Target: 100% test coverage
```

### Level 3: Integration Tests

```bash
# Test complete installation workflow
code-agent install --profile developer --interactive

# Test project integration
code-agent integrate --level enhanced --backup

# Test workspace management
code-agent workspace create test-workspace
code-agent workspace add-project /path/to/project

# Test MCP server management
code-agent mcp configure --profile developer
code-agent mcp health-check --all

# Test VCS integration
code-agent vcs setup --provider github
code-agent create python-microservice my-service --vcs github

# Test backup/rollback
code-agent backup create pre-integration
code-agent integrate --level full
code-agent backup rollback pre-integration

# Expected: All commands complete successfully with informative output
```

### Level 4: End-to-End Validation

```bash
# Complete workflow testing
# 1. Fresh installation
pip install -e .
code-agent install --profile enterprise

# 2. Project creation with full integration
code-agent create react-app my-dashboard --vcs github --level enhanced

# 3. Multi-project workspace
code-agent workspace create my-workspace
code-agent workspace add-project ./my-dashboard

# 4. MCP server validation
code-agent mcp validate --all

# 5. Hook system validation
code-agent hooks validate --all

# 6. Template system validation
code-agent templates validate --all

# 7. Comprehensive system validation
code-agent validate --level all --report validation-report.json

# Expected: Complete system working with all features integrated
```

## Final Validation Checklist

- [ ] All tests pass: `uv run pytest tests/ -v --asyncio-mode=auto`
- [ ] 100% test coverage: `uv run pytest tests/ --cov=src/code_agent --cov-report=html`
- [ ] No linting errors: `uv run ruff check src/code_agent/`
- [ ] No type errors: `uv run mypy src/code_agent/`
- [ ] Global installation works: `pip install -e . && code-agent --version`
- [ ] All four integration levels working: `code-agent integrate --level [minimal|standard|enhanced|full]`
- [ ] Backup/rollback system functional: `code-agent backup create && code-agent backup rollback`
- [ ] MCP server auto-configuration: `code-agent mcp configure --profile developer`
- [ ] VCS integration working: `code-agent vcs setup --provider github`
- [ ] Hook system integration: `code-agent hooks configure`
- [ ] Template system functional: `code-agent templates list`
- [ ] Workspace management: `code-agent workspace create test`
- [ ] Rich output and UX: Commands show progress bars and colored output
- [ ] Auto-completion working: Tab completion for commands and options
- [ ] Error handling graceful: Informative error messages with recovery suggestions
- [ ] Documentation complete: All commands have help text and examples
- [ ] Security validation: No secrets in logs or config files
- [ ] Performance acceptable: Commands complete within reasonable time
- [ ] Cross-platform compatibility: Works on Linux, macOS, Windows

---

## Anti-Patterns to Avoid

- ❌ Don't create new CLI patterns when existing Click patterns work
- ❌ Don't skip backup/rollback for any destructive operations
- ❌ Don't ignore MCP server health - implement proper monitoring
- ❌ Don't hardcode file paths - use cross-platform Path handling
- ❌ Don't mix sync and async without proper wrappers
- ❌ Don't use print() - use rich console output consistently
- ❌ Don't skip validation - implement comprehensive testing
- ❌ Don't expose secrets in logs or error messages
- ❌ Don't create circular imports - maintain clean module structure
- ❌ Don't skip error handling - every operation needs proper error management

## Success Confidence Score: 9/10

This PRP provides comprehensive context, detailed implementation guidance, and extensive validation frameworks. The existing codebase provides a solid foundation, and the research has identified all necessary patterns and integrations. The main risk areas are the complexity of the backup/rollback system and VCS integration, but these are mitigated by the extensive validation loops and the existing working examples in the PRP framework.
