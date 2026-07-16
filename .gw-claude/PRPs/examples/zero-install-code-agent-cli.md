# Zero-Install Code-Agent CLI PRP

## Goal

Transform the code-agent CLI into a truly zero-installation tool that bundles all dependencies, configurations, and MCP servers directly within the application, eliminating the need for any separate installation steps while maintaining full functionality parity with the current system.
The code-agent directory is at the root, and this new functionality should be integrated into the existing code-agent cli, not in a seperate dir or new project

## Why

- **Eliminate User Friction**: Users can download and immediately use the CLI without complex setup procedures
- **Bundle Everything**: All MCP servers, .claude configurations, and dependencies packaged within the CLI
- **Seamless Experience**: create/integrate commands handle everything that install previously managed
- **Production Ready**: Enterprise-grade tool that works out-of-the-box on any system
- **Zero Dependencies**: No external requirements like Node.js, npm, AWS CLI, or manual configuration
- **Self-Healing**: Automatic detection, configuration, and restart of bundled services

## What

Create a self-contained Python CLI that:
- **Bundles MCP Servers**: Embed stdio-based MCP servers directly within the CLI package
- **Auto-generates .claude Configuration**: Template-based configuration generation with environment detection
- **Embeds Claude Code Functionality**: Bundle Claude Code capabilities or provide equivalent functionality
- **Eliminates Installation Commands**: All functionality absorbed into create/integrate commands
- **Self-configures on First Run**: Automatic detection and setup without user intervention
- **Manages Background Processes**: Built-in lifecycle management for MCP servers and services

### Success Criteria

- [ ] CLI works immediately after download with zero setup steps required
- [ ] All MCP servers (context7, sequential, magic) bundled and auto-started
- [ ] Complete .claude configuration generated automatically on first run
- [ ] create/integrate commands handle all former install command functionality
- [ ] No external dependencies (Node.js, npm, AWS CLI) required
- [ ] Cross-platform compatibility (Linux, macOS, Windows)
- [ ] Background service management with health monitoring and auto-restart
- [ ] PyInstaller single-executable distribution capability
- [ ] 100% feature parity with current installation-based system

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

# Core Framework Understanding
- file: /Users/patrick.henry/dev/code-agent/docs/modules/core/ORCHESTRATOR.md
  why: Context intelligence system for dynamic module loading and persona routing

- file: /Users/patrick.henry/dev/code-agent/docs/modules/core/RULES.md
  why: Framework behavioral guidelines and systematic execution patterns

- file: /Users/patrick.henry/dev/code-agent/docs/modules/core/PRINCIPLES.md
  why: Evidence-based principles and efficiency-first design patterns

# Current Implementation Analysis
- file: /Users/patrick.henry/dev/code-agent/code_agent/cli/commands/create.py
  why: Current create command implementation to enhance with bundled functionality

- file: /Users/patrick.henry/dev/code-agent/code_agent/cli/commands/integrate.py
  why: Current integrate command to absorb install functionality

- file: /Users/patrick.henry/dev/code-agent/code_agent/cli/commands/install.py
  why: Target functionality to distribute between create/integrate commands

- file: /Users/patrick.henry/dev/code-agent/code_agent/cli/core/installer.py
  why: Core installer logic patterns to bundle within CLI

# Configuration and MCP Analysis
- file: /Users/patrick.henry/dev/code-agent/.claude/settings.json
  why: Complete Claude Code configuration structure for bundling

- file: /Users/patrick.henry/dev/code-agent/.claude/hooks.json
  why: Hook system configuration and execution patterns

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/context7.py
  why: MCP server implementation patterns for embedded integration

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/sequential.py
  why: Sequential analysis MCP server for stdio transport bundling

- file: /Users/patrick.henry/dev/code-agent/prp_framework/mcp/magic.py
  why: UI component generation server for embedded deployment

# Python Bundling and Distribution
- url: https://pyinstaller.org/en/stable/
  why: Single executable creation patterns and dependency bundling techniques

- url: https://docs.astral.sh/uv/guides/scripts/
  why: UV inline dependency patterns for self-contained script execution

- url: https://modelcontextprotocol.io/specification
  why: MCP protocol specification for embedded server implementation

- url: https://github.com/modelcontextprotocol/python-sdk
  why: MCP Python SDK for stdio transport and server lifecycle management

# CLI Auto-configuration Patterns
- url: https://platformdirs.readthedocs.io/
  why: Cross-platform configuration directory detection and creation

- url: https://typer.tiangolo.com/
  why: Rich CLI framework with auto-completion and progress display patterns

# Process Management
- url: https://docs.python.org/3/library/multiprocessing.html
  why: Background process management and daemon creation patterns

- url: https://docs.python.org/3/library/subprocess.html
  why: Subprocess lifecycle management for stdio MCP server integration
```

### Current Codebase Tree

```bash
code_agent/
├── cli/
│   ├── commands/
│   │   ├── create.py           # Project creation (enhance with bundled setup)
│   │   ├── integrate.py        # Project integration (absorb install functionality)
│   │   ├── install.py          # Target for elimination/absorption
│   │   ├── claude.py           # Claude Code management (enhance with bundled servers)
│   │   ├── analyze.py          # Project analysis
│   │   └── projects.py         # Project management
│   ├── core/
│   │   ├── installer.py        # Core installation logic (bundle within CLI)
│   │   └── project_manager.py  # Project management
│   ├── utils/
│   │   ├── config.py           # Configuration management (enhance with bundling)
│   │   ├── output.py           # Output formatting
│   │   └── validation.py       # Validation utilities
│   └── main.py                 # Main CLI entry point (enhance with auto-setup)
├── exceptions/
├── models/
└── __main__.py

# Supporting Infrastructure to Bundle
.claude/
├── settings.json               # Claude Code configuration template
├── hooks.json                  # Hook system configuration template
└── hooks/                      # Hook implementations to bundle
    ├── pre_tool_dynamic_context.py
    ├── post_tool_use.py
    └── notification.py

prp_framework/mcp/
├── context7.py                 # Documentation MCP server to embed
├── sequential.py               # Sequential analysis server to embed
└── magic.py                    # UI generation server to embed
```


### Known Gotchas of our Codebase & Library Quirks

```python
# CRITICAL: UV inline dependency system for bundled MCP servers
# Use PEP 723 inline script metadata for self-contained MCP servers
# Example header required for each bundled server:
#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["mcp", "pydantic>=2.0"]
# requires-python = ">=3.8"
# ///

# CRITICAL: MCP stdio transport requirements
# Never write to stdout in MCP servers - corrupts JSON-RPC communication
# Use stderr for logging or dedicated logging files
# Example: logging.basicConfig(stream=sys.stderr, level=logging.INFO)

# CRITICAL: Process management for embedded servers
# Use subprocess.Popen with stdin/stdout pipes for MCP communication
# Enable line buffering for real-time JSON-RPC: bufsize=1, text=True
# Example: Popen(cmd, stdin=PIPE, stdout=PIPE, text=True, bufsize=1)

# CRITICAL: Resource bundling with importlib.resources
# Bundle template files and configurations within package
# Use importlib.resources for Python 3.9+ or importlib_resources for <3.9
# Example: files('code_agent.bundled.claude_templates').joinpath('settings.json.j2')

# CRITICAL: Cross-platform configuration directory detection
# Use platformdirs for proper config directory detection
# user_config_dir() for user-specific, site_config_dir() for global
# Example: config_dir = user_config_dir("code-agent", "anthropic")

# CRITICAL: First-run detection without persistent state
# Check for existence of expected configuration files/directories
# Use marker files to indicate completion of setup steps
# Example: setup_complete = config_dir / ".setup_complete"

# CRITICAL: PyInstaller bundling considerations
# All bundled resources must be accessible via importlib.resources
# Cannot use __file__ or direct file system paths in bundled executables
# Use get_path() context manager for temporary file extraction

# CRITICAL: Async/await integration with CLI
# Main CLI functions are synchronous, core operations are async
# Use asyncio.run() wrapper for async operations in CLI commands
# Example: result = asyncio.run(embedded_setup.configure_all())

# CRITICAL: Signal handling for graceful shutdown
# Implement proper signal handlers for SIGTERM/SIGINT
# Ensure all background processes are cleaned up on exit
# Example: signal.signal(signal.SIGTERM, cleanup_handler)

# CRITICAL: Error handling for bundled operations
# Provide detailed error messages for debugging bundled functionality
# Include recovery suggestions for common failure scenarios
# Log to user-accessible locations (not just stderr)
```

## Implementation Blueprint

### Data Models and Structure

Create comprehensive models for bundled resource management:

```python
# Bundled resource management models
@dataclass
class BundledResource:
    name: str
    resource_type: str  # 'mcp_server', 'template', 'config'
    source_path: str
    target_path: Optional[str] = None
    executable: bool = False
    template_vars: Dict[str, Any] = field(default_factory=dict)

# MCP server lifecycle management
@dataclass
class EmbeddedMCPServer:
    name: str
    script_path: str
    process: Optional[subprocess.Popen] = None
    health_check_url: Optional[str] = None
    restart_count: int = 0
    max_restarts: int = 3
    last_restart: Optional[float] = None

# Auto-setup configuration
@dataclass
class SetupConfig:
    user_config_dir: Path
    claude_config_dir: Path
    first_run: bool
    platform: str
    environment_vars: Dict[str, str] = field(default_factory=dict)
    bundled_servers: List[EmbeddedMCPServer] = field(default_factory=list)
```

### List of Tasks to be Completed

```yaml
Task 1: Create Bundled Resource System
CREATE src/code_agent/bundled/__init__.py:
CREATE src/code_agent/bundled/resources.py:
  - IMPLEMENT importlib.resources-based resource management
  - ADD template extraction and processing capabilities
  - INCLUDE cross-platform path handling
  - INTEGRATE with PyInstaller bundling requirements

Task 2: Bundle Claude Configuration Templates
CREATE src/code_agent/bundled/claude_templates/:
  - COPY .claude/settings.json as Jinja2 template
  - COPY .claude/hooks.json as template with variable substitution
  - BUNDLE all hook scripts with inline dependencies
  - ADD environment-specific template variations

Task 3: Embed MCP Server Implementations
CREATE src/code_agent/bundled/mcp_servers/:
  - CONVERT prp_framework/mcp/context7.py to self-contained UV script
  - CONVERT prp_framework/mcp/sequential.py with inline dependencies
  - CONVERT prp_framework/mcp/magic.py for embedded execution
  - ADD health check and restart capabilities to each server

Task 4: Implement Auto-Setup System
CREATE src/code_agent/cli/core/auto_setup.py:
  - IMPLEMENT first-run detection using marker files
  - ADD automatic .claude directory generation from templates
  - INTEGRATE environment variable detection and configuration
  - INCLUDE platform-specific configuration adjustments

Task 5: Create MCP Server Lifecycle Manager
CREATE src/code_agent/cli/core/mcp_lifecycle.py:
  - IMPLEMENT subprocess management for embedded MCP servers
  - ADD JSON-RPC communication over stdio transport
  - INTEGRATE health monitoring with automatic restart
  - INCLUDE graceful shutdown and cleanup procedures

Task 6: Implement Process Management System
CREATE src/code_agent/cli/core/process_manager.py:
  - IMPLEMENT background daemon management
  - ADD signal handling for graceful shutdown (SIGTERM, SIGINT)
  - INTEGRATE process health monitoring and restart policies
  - INCLUDE cross-platform service management

Task 7: Create First-Run Detection System
CREATE src/code_agent/cli/utils/first_run.py:
  - IMPLEMENT setup completion detection using marker files
  - ADD configuration validation and repair capabilities
  - INTEGRATE with existing validation systems
  - INCLUDE migration from existing installations

Task 8: Enhance Create Command for Zero-Install
MODIFY src/code_agent/cli/commands/create.py:
  - ADD automatic setup detection and execution
  - INTEGRATE bundled template deployment
  - INCLUDE MCP server auto-configuration
  - ADD comprehensive validation and error handling

Task 9: Enhance Integrate Command to Absorb Install
MODIFY src/code_agent/cli/commands/integrate.py:
  - ABSORB all install command functionality
  - ADD automatic dependency detection and bundling
  - INTEGRATE with auto-setup system for missing components
  - INCLUDE migration from existing install-based setups

Task 10: Create Embedded Setup Service
CREATE src/code_agent/services/embedded_setup.py:
  - IMPLEMENT orchestration of all auto-setup components
  - ADD validation and verification of bundled deployments
  - INTEGRATE with existing installer patterns and workflows
  - INCLUDE comprehensive error reporting and recovery

Task 11: Implement Health Monitoring Service
CREATE src/code_agent/services/health_monitor.py:
  - IMPLEMENT continuous monitoring of bundled MCP servers
  - ADD automatic restart policies and failure detection
  - INTEGRATE with user notification system
  - INCLUDE performance metrics and diagnostic reporting

Task 12: Create Distribution and Bundling System
CREATE src/code_agent/cli/utils/bundling.py:
  - IMPLEMENT PyInstaller configuration for single executable
  - ADD resource verification and integrity checking
  - INTEGRATE with CI/CD pipeline for automated builds
  - INCLUDE cross-platform distribution packaging
```

### Per Task Pseudocode

```python
# Task 1: Bundled Resource System
class BundledResourceManager:
    def __init__(self):
        # PATTERN: Use importlib.resources for bundled access
        self.resources = importlib.resources.files('code_agent.bundled')

    def extract_template(self, template_name: str, target_path: Path, **vars):
        # CRITICAL: Use context manager for PyInstaller compatibility
        template_files = self.resources / 'claude_templates'
        with as_file(template_files / f"{template_name}.j2") as template_path:
            # PATTERN: Jinja2 template processing
            template = Template(template_path.read_text())
            content = template.render(**vars)
            target_path.write_text(content)

# Task 3: Embedded MCP Server
#!/usr/bin/env -S uv run --script
# /// script
# dependencies = ["mcp>=1.0.0", "pydantic>=2.0"]
# requires-python = ">=3.8"
# ///
import asyncio
import sys
from mcp.server.fastmcp import FastMCP

# CRITICAL: Never write to stdout - use stderr for logging
import logging
logging.basicConfig(stream=sys.stderr, level=logging.INFO)

mcp = FastMCP("embedded-context7")

@mcp.tool()
async def analyze_context(query: str) -> str:
    """Analyze context and provide insights."""
    # PATTERN: Embedded analysis logic
    return f"Analysis: {query}"

if __name__ == "__main__":
    # CRITICAL: Use stdio transport for embedded execution
    mcp.run(transport='stdio')

# Task 4: Auto-Setup System
async def auto_setup_on_first_run():
    """Comprehensive first-run auto-setup."""
    # PATTERN: Detect first run using marker files
    setup_marker = user_config_dir("code-agent") / ".setup_complete"

    if setup_marker.exists():
        return  # Already setup

    try:
        # CRITICAL: Atomic setup with rollback capability
        async with TransactionManager() as tx:
            await tx.create_checkpoint("pre_setup")

            # PATTERN: Deploy bundled configurations
            await deploy_claude_configuration()
            await setup_embedded_mcp_servers()
            await configure_environment_variables()
            await validate_deployment()

            # CRITICAL: Mark setup complete only after validation
            setup_marker.touch()
            await tx.commit()

    except Exception as e:
        # PATTERN: Automatic rollback on failure
        await tx.rollback_to_checkpoint("pre_setup")
        raise SetupError(f"Auto-setup failed: {e}")

# Task 5: MCP Server Lifecycle Management
class EmbeddedMCPManager:
    async def start_server(self, server_config: EmbeddedMCPServer):
        """Start embedded MCP server with health monitoring."""
        # PATTERN: Extract bundled server script
        server_script = await self.extract_server_script(server_config.name)

        # CRITICAL: Use UV for dependency management
        cmd = ["uv", "run", "--script", str(server_script)]

        # PATTERN: Subprocess with stdio pipes
        server_config.process = subprocess.Popen(
            cmd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            bufsize=1  # Line buffered for JSON-RPC
        )

        # PATTERN: Initialize MCP protocol handshake
        await self.initialize_mcp_protocol(server_config)

        # PATTERN: Start health monitoring
        asyncio.create_task(self.monitor_server_health(server_config))

    async def monitor_server_health(self, server: EmbeddedMCPServer):
        """Continuous health monitoring with auto-restart."""
        while server.process and server.process.poll() is None:
            try:
                # PATTERN: JSON-RPC ping for health check
                health_response = await self.ping_server(server)
                if not health_response.get('success'):
                    raise HealthCheckError("Server not responding")

            except Exception as e:
                logging.error(f"Server {server.name} health check failed: {e}")
                if server.restart_count < server.max_restarts:
                    await self.restart_server(server)

            await asyncio.sleep(30)  # Health check interval
```

### Integration Points

```yaml
BUNDLED_RESOURCES:
  - claude_templates: src/code_agent/bundled/claude_templates/
  - mcp_servers: src/code_agent/bundled/mcp_servers/
  - static_configs: src/code_agent/bundled/configs/
  - hook_scripts: src/code_agent/bundled/hooks/

CONFIGURATION_DEPLOYMENT:
  - user_claude_dir: ~/.claude/
  - user_config_dir: ~/.config/code-agent/ (Linux) | ~/Library/Application Support/code-agent/ (macOS)
  - project_config: .claude/metadata.json
  - setup_marker: ~/.config/code-agent/.setup_complete

PROCESS_MANAGEMENT:
  - mcp_processes: Background subprocess management
  - health_monitoring: Continuous process health checks
  - signal_handling: SIGTERM/SIGINT graceful shutdown
  - restart_policies: Exponential backoff with max attempts

PYINSTALLER_INTEGRATION:
  - spec_file: code-agent.spec for build configuration
  - resource_bundling: Automatic inclusion of bundled/ directory
  - executable_output: Single file executable with all dependencies
  - cross_platform: Platform-specific build targets
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
ruff check src/code_agent/ --fix
mypy src/code_agent/ --strict
black src/code_agent/
isort src/code_agent/

# Bundled resource validation
ruff check src/code_agent/bundled/ --fix
mypy src/code_agent/bundled/ --strict

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests

```python
# CREATE comprehensive test suite for bundled functionality

def test_bundled_resource_extraction():
    """Test bundled resource extraction and template processing."""
    manager = BundledResourceManager()
    temp_dir = Path(tempfile.mkdtemp())

    # Test template extraction
    manager.extract_template(
        'settings.json',
        temp_dir / 'settings.json',
        user_name="test_user",
        project_path="/test/path"
    )

    assert (temp_dir / 'settings.json').exists()
    content = (temp_dir / 'settings.json').read_text()
    assert "test_user" in content
    assert "/test/path" in content

def test_embedded_mcp_server_lifecycle():
    """Test MCP server startup, health monitoring, and shutdown."""
    manager = EmbeddedMCPManager()
    server_config = EmbeddedMCPServer(
        name="test_server",
        script_path="bundled/mcp_servers/context7_server.py"
    )

    # Test server startup
    await manager.start_server(server_config)
    assert server_config.process is not None
    assert server_config.process.poll() is None  # Still running

    # Test health check
    health = await manager.ping_server(server_config)
    assert health['success'] == True

    # Test graceful shutdown
    await manager.stop_server(server_config)
    assert server_config.process.poll() is not None  # Terminated

def test_first_run_detection():
    """Test first-run detection and auto-setup triggering."""
    with tempfile.TemporaryDirectory() as temp_dir:
        config_dir = Path(temp_dir) / "code-agent"
        setup_marker = config_dir / ".setup_complete"

        # First run - should trigger setup
        assert is_first_run(config_dir) == True

        # After setup marker created
        setup_marker.parent.mkdir(parents=True)
        setup_marker.touch()
        assert is_first_run(config_dir) == False

def test_auto_setup_integration():
    """Test complete auto-setup workflow."""
    with tempfile.TemporaryDirectory() as temp_dir:
        config_dir = Path(temp_dir) / "code-agent"
        claude_dir = Path(temp_dir) / ".claude"

        setup_config = SetupConfig(
            user_config_dir=config_dir,
            claude_config_dir=claude_dir,
            first_run=True,
            platform="linux"
        )

        # Test complete setup
        result = await embedded_setup.configure_all(setup_config)
        assert result.success == True

        # Validate deployment
        assert claude_dir.exists()
        assert (claude_dir / "settings.json").exists()
        assert (claude_dir / "hooks.json").exists()
        assert (config_dir / ".setup_complete").exists()

def test_create_command_with_bundled_setup():
    """Test enhanced create command with automatic setup."""
    runner = CliRunner()
    with runner.isolated_filesystem():
        # Test create with auto-setup
        result = runner.invoke(create_command, [
            'python-microservice',
            'test-service',
            '--auto-setup'
        ])

        assert result.exit_code == 0
        assert "Auto-setup completed" in result.output
        assert Path(".claude").exists()
        # All functionality now unified in .claude directory

def test_integrate_command_absorbing_install():
    """Test integrate command with absorbed install functionality."""
    runner = CliRunner()
    with runner.isolated_filesystem():
        # Create a mock project
        Path("package.json").write_text('{"name": "test-project"}')

        result = runner.invoke(integrate_command, [
            '--level', 'enhanced',
            '--auto-install'
        ])

        assert result.exit_code == 0
        assert "Integration completed" in result.output
        assert "MCP servers configured" in result.output
```

```bash
# Run and iterate until passing:
uv run pytest tests/ -v --asyncio-mode=auto
uv run pytest tests/test_bundled/ -v --cov=src/code_agent --cov-report=html
# Target: 95%+ test coverage for bundled functionality
```

### Level 3: Integration Tests

```bash
# Test zero-install workflow from scratch
# 1. Clean environment simulation
rm -rf ~/.claude ~/.config/code-agent

# 2. Install CLI and test immediate functionality
pip install -e .
code-agent --version

# 3. Test create command with auto-setup
code-agent create python-microservice test-service
# Expected: Complete project creation with .claude configuration

# 4. Verify bundled MCP servers are running
code-agent claude validate
# Expected: All MCP servers healthy and responding

# 5. Test integrate on existing project
cd /path/to/existing/project
code-agent integrate --level enhanced
# Expected: Full integration without any manual setup

# 6. Test MCP server health and restart
pkill -f "context7_server"  # Kill one server
sleep 5
code-agent claude validate
# Expected: Server automatically restarted and healthy

# 7. Test cross-platform configuration
# Run on Linux/macOS/Windows to verify platform detection
code-agent validate --all
# Expected: Platform-specific configurations deployed correctly
```

### Level 4: Distribution and Deployment Validation

```bash
# Test PyInstaller bundling
# 1. Create single executable
pip install pyinstaller
pyinstaller code-agent.spec
# Expected: Single executable in dist/

# 2. Test bundled executable on clean system
./dist/code-agent --version
./dist/code-agent create react-app test-app
# Expected: Complete functionality without Python environment

# 3. Test resource bundling integrity
./dist/code-agent validate --bundled-resources
# Expected: All bundled resources accessible and valid

# 4. Performance validation
time ./dist/code-agent create python-microservice perf-test
# Expected: Reasonable startup and execution time

# 5. Cross-platform distribution test
# Build and test on Linux, macOS, Windows
# Expected: Consistent behavior across all platforms

# 6. Memory and resource usage test
ps aux | grep code-agent  # Monitor resource usage during operation
# Expected: Reasonable memory footprint for bundled processes
```

## Final Validation Checklist

- [ ] All tests pass: `uv run pytest tests/ -v --asyncio-mode=auto`
- [ ] 95%+ test coverage: `uv run pytest tests/ --cov=src/code_agent --cov-report=html`
- [ ] No linting errors: `uv run ruff check src/code_agent/`
- [ ] No type errors: `uv run mypy src/code_agent/ --strict`
- [ ] Zero-install functionality: CLI works immediately after download
- [ ] Bundled MCP servers: All servers start automatically and respond to health checks
- [ ] Auto-setup system: First-run detection and configuration works seamlessly
- [ ] Enhanced create command: Handles all setup automatically without user intervention
- [ ] Enhanced integrate command: Absorbs install functionality completely
- [ ] Cross-platform compatibility: Works on Linux, macOS, Windows without modification
- [ ] PyInstaller bundling: Single executable includes all dependencies and resources
- [ ] Process management: Background processes managed properly with health monitoring
- [ ] Signal handling: Graceful shutdown cleans up all spawned processes
- [ ] Error handling: Clear error messages with recovery suggestions for all failure modes
- [ ] Resource integrity: All bundled templates and configurations deploy correctly
- [ ] Performance: Reasonable startup time and memory usage for bundled functionality
- [ ] Security: No credentials or sensitive data in bundled resources
- [ ] Documentation: All commands have comprehensive help and examples
- [ ] Migration: Seamless upgrade from existing installation-based setups

---

## Anti-Patterns to Avoid

- ❌ Don't hardcode file paths - use importlib.resources for bundled content
- ❌ Don't write to stdout in MCP servers - corrupts JSON-RPC communication
- ❌ Don't skip health monitoring - implement proper process lifecycle management
- ❌ Don't ignore platform differences - use platformdirs for configuration paths
- ❌ Don't skip signal handling - implement graceful shutdown for background processes
- ❌ Don't bundle credentials or sensitive data - use environment variable templates
- ❌ Don't mix sync/async without proper wrappers - use asyncio.run() for CLI integration
- ❌ Don't skip resource validation - verify bundled content integrity on deployment
- ❌ Don't ignore PyInstaller requirements - test bundled executable thoroughly
- ❌ Don't create circular dependencies - maintain clean module structure for bundling

## Success Confidence Score: 9/10

This PRP provides comprehensive context for eliminating installation requirements while maintaining full functionality. The extensive research covers all necessary patterns for Python CLI bundling, MCP server embedding, configuration templating, and cross-platform deployment. The main complexity lies in the process management and PyInstaller integration, but these are well-documented with clear implementation patterns. The validation framework ensures robustness and the anti-patterns section prevents common pitfalls in CLI bundling and distribution.
