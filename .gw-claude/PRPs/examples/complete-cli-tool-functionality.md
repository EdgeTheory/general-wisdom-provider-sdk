# Complete CLI Tool Functionality

## Goal

Transform the code-agent CLI tool into a fully functional, production-ready interface that meets all the requirements laid out by the user, including:
- Complete command registration for all existing functionality
- Full PRP/meta command support with slash command parsing
- Command proxying to Claude Code with argument forwarding
- Complete start-claude-code.sh replacement with feature parity
- Comprehensive installation capabilities with profile-based setup
- VCS integration with GitHub/Bitbucket/GitLab providers
- Hook system integration with lifecycle events
- Multi-project workspace management
- Template system with Jinja2 processing

## Why

The current CLI tool has excellent backend infrastructure but is missing critical frontend command interfaces. Users cannot access 50%+ of the implemented functionality because commands are not registered in main.py. The tool fails to deliver on its core promise of being a "global command-line interface for all PRP framework capabilities" and cannot replace the start-claude-code.sh script as intended.

## Context

### Current State Analysis

**✅ What's Working:**
- Core infrastructure classes are fully implemented
- VCS providers (GitHub, Bitbucket, GitLab) are complete
- Models and data structures are comprehensive
- Individual command handlers are well-structured
- Installation, validation, and management logic exists
- MAKE SURE YOU DO A VERY THROUGH ANALYSIS OF WHTA EXISTS TODAY SO AS NOT TO DUPLICATE EXISTING FUNCTIONALITY

**❌ Critical Gaps:**
- **Missing Command Registration**: install, validate, hooks, workspace, templates commands exist but not registered
- **No PRP/Meta Command Support**: Zero slash command parsing or proxying despite being core requirement
- **No Command Proxying**: No way to proxy commands to Claude Code
- **Incomplete Claude Integration**: Missing 60%+ of start-claude-code.sh functionality
- **No Installation Command**: Installation system exists but not accessible via CLI

### Existing Patterns

**Command Registration Pattern (from main.py):**
```python
@main.command()
@click.argument("path", type=click.Path(exists=True, path_type=Path))
@click.option("--level", type=click.Choice(["minimal", "standard", "enhanced", "full"]))
@click.pass_context
def integrate(ctx: click.Context, path: Path, level: str) -> None:
    """Command docstring for help."""
    cli_ctx: CLIContext = ctx.obj

    try:
        from .commands.integrate import IntegrateCommand
        command = IntegrateCommand(cli_ctx)
        result = asyncio.run(command.execute(path, level))

        if result.success:
            cli_ctx.output_manager.success(result.message)
        else:
            cli_ctx.output_manager.error(result.message)
            ctx.exit(1)
    except Exception as e:
        handle_error(e, cli_ctx)
        ctx.exit(1)
```

**Command Class Pattern:**
```python
class CommandName:
    def __init__(self, cli_ctx):
        self.cli_ctx = cli_ctx
        self.output = cli_ctx.output_manager
        self.config = cli_ctx.config

    async def execute(self, *args) -> CommandResult:
        try:
            # Command logic here
            return CommandResult.success_result(
                CommandType.COMMAND_TYPE,
                "Success message",
                {"data": "result"}
            )
        except Exception as e:
            return CommandResult.error_result(
                CommandType.COMMAND_TYPE,
                f"Error: {e}",
                [str(e)]
            )
```

### Research Findings

**Command Proxying Best Practices:**
- Use `os.execvpe()` for full process replacement (already implemented in claude.py:64)
- Use `subprocess.run()` for captured output and continued execution
- Implement argument forwarding with Click's `ignore_unknown_options=True`
- Handle environment variable inheritance safely

**Slash Command Implementation:**
- Multiple parsing approaches: regex, argparse, Click custom groups
- File-based command definitions in `.claude/commands/`
- Integration with existing MetaCommandOrchestrator system
- Persona routing and MCP server integration

**Missing start-claude-code.sh Features:**
- Automatic dependency installation (uv, Node.js, AWS CLI, Claude Code)
- Interactive AWS configuration setup with prompts
- Environment file management (.env creation/updates)
- External validation script execution (bedrock_integration.py)
- Complete environment variable coverage

### External Resources

**Documentation:**
- Python subprocess: https://docs.python.org/3/library/subprocess.html
- Click framework: https://click.palletsprojects.com/en/8.1.x/
- Click advanced patterns: https://click.palletsprojects.com/en/8.1.x/advanced/
- Jinja2 templates: https://jinja.palletsprojects.com/en/3.1.x/

**Implementation Examples:**
- AWS CLI command routing: https://github.com/aws/aws-cli/blob/develop/awscli/clidriver.py
- Git command proxying: https://github.com/git/git/blob/master/git.c
- Flask CLI patterns: https://flask.palletsprojects.com/en/3.0.x/cli/

## Implementation Blueprint

### Phase 1: Register Missing Commands (Foundation)

**1.1 Add Command Groups to main.py**
```python
# Add these new command groups after existing ones

@main.group()
@click.pass_context
def install(ctx: click.Context) -> None:
    """Installation and setup commands."""
    pass

@main.group()
@click.pass_context
def templates(ctx: click.Context) -> None:
    """Template management commands."""
    pass

@main.group()
@click.pass_context
def hooks(ctx: click.Context) -> None:
    """Hook system management."""
    pass

@main.group()
@click.pass_context
def workspace(ctx: click.Context) -> None:
    """Workspace management commands."""
    pass

@main.group()
@click.pass_context
def validate(ctx: click.Context) -> None:
    """Multi-level validation system."""
    pass
```

**1.2 Register Install Commands**
```python
@install.command()
@click.option("--profile", type=click.Choice(["minimal", "developer", "enterprise"]), default="developer")
@click.option("--interactive", is_flag=True, help="Interactive installation setup")
@click.option("--dry-run", is_flag=True, help="Show what would be done without making changes")
@click.pass_context
def setup(ctx: click.Context, profile: str, interactive: bool, dry_run: bool) -> None:
    """Install Code-Agent with specified profile."""
    cli_ctx: CLIContext = ctx.obj

    try:
        from .commands.install import InstallCommand
        command = InstallCommand(cli_ctx)
        result = asyncio.run(command.execute(profile, interactive, dry_run=dry_run))

        if result.success:
            cli_ctx.output_manager.success(result.message)
        else:
            cli_ctx.output_manager.error(result.message)
            ctx.exit(1)
    except Exception as e:
        handle_error(e, cli_ctx)
        ctx.exit(1)
```

**1.3 Register Template Commands**
```python
@templates.command()
@click.option("--type", type=click.Choice(["prp", "project", "workflow"]))
@click.pass_context
def list(ctx: click.Context, type: Optional[str]) -> None:
    """List available templates."""
    # Follow existing pattern...

@templates.command()
@click.argument("template_id")
@click.argument("output_path")
@click.pass_context
def generate(ctx: click.Context, template_id: str, output_path: str) -> None:
    """Generate files from template."""
    # Follow existing pattern...
```

**1.4 Register Hook Commands**
```python
@hooks.command()
@click.pass_context
def list(ctx: click.Context) -> None:
    """List configured hooks."""
    # Follow existing pattern...

@hooks.command()
@click.argument("name")
@click.argument("event", type=click.Choice(["pre-tool-use", "post-tool-use"]))
@click.option("--command", help="Hook command to execute")
@click.pass_context
def configure(ctx: click.Context, name: str, event: str, command: str) -> None:
    """Configure a new hook."""
    # Follow existing pattern...
```

**1.5 Register Workspace Commands**
```python
@workspace.command()
@click.pass_context
def list(ctx: click.Context) -> None:
    """List all workspaces."""
    # Follow existing pattern...

@workspace.command()
@click.argument("name")
@click.pass_context
def create(ctx: click.Context, name: str) -> None:
    """Create a new workspace."""
    # Follow existing pattern...
```

**1.6 Register Validation Commands**
```python
@validate.command()
@click.option("--level", type=click.Choice(["1", "2", "3", "4"]), help="Validation level")
@click.pass_context
def run(ctx: click.Context, level: Optional[str]) -> None:
    """Run validation checks."""
    # Follow existing pattern...
```

### Phase 2: Implement Command Proxying Infrastructure

**2.1 Create Command Proxy System**
```python
# Add to src/code_agent/cli/core/command_proxy.py

class CommandProxy:
    """Proxy commands to Claude Code with argument forwarding."""

    def __init__(self, cli_ctx):
        self.cli_ctx = cli_ctx
        self.output = cli_ctx.output_manager

    async def proxy_to_claude(self, command_args: List[str]) -> None:
        """Proxy command to Claude Code with full argument forwarding."""
        # Find Claude Code command
        claude_cmd = await self._find_claude_command()

        # Prepare environment
        env = self._prepare_environment()

        # Build full command
        full_cmd = [claude_cmd] + command_args

        # Execute with process replacement
        self.output.info(f"Executing: {' '.join(full_cmd)}")
        os.execvpe(claude_cmd, full_cmd, env)

    async def _find_claude_command(self) -> str:
        """Find Claude Code executable."""
        commands = ["claude-code", "claude", "npx @anthropic-ai/claude-code"]
        for cmd in commands:
            if shutil.which(cmd):
                return cmd
        raise Exception("Claude Code not found")

    def _prepare_environment(self) -> Dict[str, str]:
        """Prepare environment variables for Claude Code."""
        env = os.environ.copy()

        # Add Bedrock configuration
        env.update({
            "CLAUDE_CODE_USE_BEDROCK": "1",
            "AWS_DEFAULT_REGION": self.cli_ctx.config.aws_region or "us-east-1",
            "DISABLE_PROMPT_CACHING": "0",
            "CLAUDE_CONFIG_PATH": str(self.cli_ctx.config.get_claude_config_file()),
        })

        return env
```

**2.2 Add Catch-All Command Handler**
```python
# Add to main.py after all other commands

@main.command(context_settings=dict(
    ignore_unknown_options=True,
    allow_extra_args=True,
    allow_interspersed_args=False
))
@click.argument('command_name')
@click.pass_context
def proxy(ctx: click.Context, command_name: str) -> None:
    """Proxy unknown commands to Claude Code."""
    cli_ctx: CLIContext = ctx.obj

    try:
        from .core.command_proxy import CommandProxy
        proxy = CommandProxy(cli_ctx)

        # Build command arguments
        command_args = [command_name] + ctx.args

        # Proxy to Claude Code
        asyncio.run(proxy.proxy_to_claude(command_args))

    except Exception as e:
        handle_error(e, cli_ctx)
        ctx.exit(1)
```

### Phase 3: Implement Slash Command System

**3.1 Create Slash Command Parser**
```python
# Add to src/code_agent/cli/core/slash_command_parser.py

import re
from dataclasses import dataclass
from typing import List, Dict, Any, Optional

@dataclass
class SlashCommand:
    category: str
    command: str
    arguments: List[str]
    options: Dict[str, Any]
    raw_text: str

class SlashCommandParser:
    """Parse slash commands like /prp:create, /meta:analyze."""

    def __init__(self):
        self.command_pattern = re.compile(r'^/([a-zA-Z_]+):([a-zA-Z_-]+)(?:\s+(.*))?$')
        self.option_pattern = re.compile(r'--([a-zA-Z_-]+)(?:=([^\s]+)|\s+([^\s-][^\s]*))?')

    def parse(self, command_text: str) -> Optional[SlashCommand]:
        """Parse slash command with options."""
        match = self.command_pattern.match(command_text.strip())
        if not match:
            return None

        category, command, args_text = match.groups()
        arguments = []
        options = {}

        if args_text:
            # Parse arguments and options
            parts = args_text.split()
            i = 0
            while i < len(parts):
                part = parts[i]
                if part.startswith('--'):
                    # Handle --option=value and --option value formats
                    if '=' in part:
                        opt_name, opt_value = part[2:].split('=', 1)
                        options[opt_name] = opt_value
                        i += 1
                    elif i + 1 < len(parts) and not parts[i + 1].startswith('--'):
                        opt_name = part[2:]
                        options[opt_name] = parts[i + 1]
                        i += 2
                    else:
                        # Flag option
                        options[part[2:]] = True
                        i += 1
                else:
                    # Regular argument
                    arguments.append(part)
                    i += 1

        return SlashCommand(category, command, arguments, options, command_text)

    def is_slash_command(self, text: str) -> bool:
        """Check if text is a slash command."""
        return text.strip().startswith('/') and ':' in text
```

**3.2 Create Slash Command Handler**
```python
# Add to src/code_agent/cli/core/slash_command_handler.py

from .slash_command_parser import SlashCommandParser, SlashCommand
from ..commands.claude import ClaudeCommand

class SlashCommandHandler:
    """Handle slash command execution."""

    def __init__(self, cli_ctx):
        self.cli_ctx = cli_ctx
        self.parser = SlashCommandParser()
        self.claude_command = ClaudeCommand(cli_ctx)

    async def handle_slash_command(self, command_text: str) -> CommandResult:
        """Handle slash command execution."""
        # Parse command
        slash_cmd = self.parser.parse(command_text)
        if not slash_cmd:
            return CommandResult.error_result(
                CommandType.VALIDATE,
                f"Invalid slash command format: {command_text}",
                ["Use format: /category:command [args] [--options]"]
            )

        # Route to appropriate handler
        if slash_cmd.category == 'prp':
            return await self._handle_prp_command(slash_cmd)
        elif slash_cmd.category == 'meta':
            return await self._handle_meta_command(slash_cmd)
        elif slash_cmd.category == 'system':
            return await self._handle_system_command(slash_cmd)
        else:
            return await self._proxy_to_claude(slash_cmd)

    async def _handle_prp_command(self, cmd: SlashCommand) -> CommandResult:
        """Handle PRP commands."""
        if cmd.command == 'create':
            return await self._handle_prp_create(cmd)
        elif cmd.command == 'execute':
            return await self._handle_prp_execute(cmd)
        else:
            return await self._proxy_to_claude(cmd)

    async def _handle_prp_create(self, cmd: SlashCommand) -> CommandResult:
        """Handle /prp:create command."""
        if not cmd.arguments:
            return CommandResult.error_result(
                CommandType.CREATE,
                "PRP name required",
                ["Usage: /prp:create <name> [--template base|enhanced]"]
            )

        prp_name = cmd.arguments[0]
        template = cmd.options.get('template', 'base')

        # Create PRP using template system
        from ..commands.templates import TemplatesCommand
        templates_cmd = TemplatesCommand(self.cli_ctx)

        return await templates_cmd.generate_from_template(
            template_id=f"prp_{template}",
            output_path=f"PRPs/{prp_name}.md",
            parameters={'name': prp_name, 'template': template}
        )

    async def _proxy_to_claude(self, cmd: SlashCommand) -> CommandResult:
        """Proxy slash command to Claude Code."""
        from .command_proxy import CommandProxy
        proxy = CommandProxy(self.cli_ctx)

        # Convert slash command back to Claude Code format
        claude_args = [f"/{cmd.category}:{cmd.command}"]
        claude_args.extend(cmd.arguments)

        # Add options
        for opt_name, opt_value in cmd.options.items():
            if opt_value is True:
                claude_args.append(f"--{opt_name}")
            else:
                claude_args.append(f"--{opt_name}={opt_value}")

        await proxy.proxy_to_claude(claude_args)
        return CommandResult.success_result(
            CommandType.VALIDATE,
            "Command proxied to Claude Code"
        )
```

**3.3 Add Slash Command CLI Interface**
```python
# Add to main.py

@main.command()
@click.argument('slash_command', nargs=-1, required=True)
@click.pass_context
def slash(ctx: click.Context, slash_command: tuple) -> None:
    """Execute slash commands like /prp:create or /meta:analyze."""
    cli_ctx: CLIContext = ctx.obj

    try:
        from .core.slash_command_handler import SlashCommandHandler
        handler = SlashCommandHandler(cli_ctx)

        # Join command parts
        command_text = ' '.join(slash_command)

        # Handle slash command
        result = asyncio.run(handler.handle_slash_command(command_text))

        if result.success:
            cli_ctx.output_manager.success(result.message)
        else:
            cli_ctx.output_manager.error(result.message)
            ctx.exit(1)

    except Exception as e:
        handle_error(e, cli_ctx)
        ctx.exit(1)
```

### Phase 4: Complete Claude Integration

**4.1 Add Missing Claude Start Functionality**
```python
# Enhance src/code_agent/cli/commands/claude.py

class ClaudeCommand:
    async def start(self, continue_mode: bool = False, aws_region: Optional[str] = None,
                   aws_profile: Optional[str] = None) -> CommandResult:
        """Start Claude Code with full start-claude-code.sh parity."""
        try:
            # 1. Install missing dependencies
            await self._install_dependencies()

            # 2. Setup AWS interactively if needed
            aws_config = await self._setup_aws_interactive(aws_region, aws_profile)

            # 3. Create/update environment file
            await self._create_env_file(aws_config)

            # 4. Validate Bedrock integration
            await self._validate_bedrock_integration()

            # 5. Start Claude Code (existing functionality)
            return await self._start_claude_code(continue_mode, aws_config)

        except Exception as e:
            return CommandResult.error_result(
                CommandType.CLAUDE_START,
                f"Failed to start Claude Code: {e}",
                [str(e)]
            )

    async def _install_dependencies(self) -> None:
        """Install missing dependencies automatically."""
        dependencies = [
            ("uv", "brew install uv"),
            ("node", "brew install node"),
            ("aws", "brew install awscli"),
        ]

        for dep, install_cmd in dependencies:
            if not shutil.which(dep):
                self.output.info(f"Installing {dep}...")
                result = subprocess.run(install_cmd.split(), capture_output=True, text=True)
                if result.returncode != 0:
                    raise Exception(f"Failed to install {dep}: {result.stderr}")

        # Install Claude Code if not present
        if not shutil.which("claude") and not shutil.which("claude-code"):
            self.output.info("Installing Claude Code...")
            result = subprocess.run(
                ["npm", "install", "-g", "@anthropic-ai/claude-code"],
                capture_output=True, text=True
            )
            if result.returncode != 0:
                raise Exception(f"Failed to install Claude Code: {result.stderr}")

    async def _setup_aws_interactive(self, aws_region: Optional[str],
                                   aws_profile: Optional[str]) -> Any:
        """Setup AWS configuration interactively."""
        # Test current AWS credentials
        try:
            result = subprocess.run(
                ["aws", "sts", "get-caller-identity"],
                capture_output=True, text=True, timeout=10
            )
            if result.returncode == 0:
                # AWS already configured
                return self.config_manager.load_aws_config()
        except:
            pass

        # Interactive AWS setup
        self.output.warning("AWS credentials not configured.")
        self.output.info("Please configure AWS credentials using:")
        self.output.info("  aws configure")
        self.output.info("or set environment variables:")
        self.output.info("  AWS_ACCESS_KEY_ID=your_access_key")
        self.output.info("  AWS_SECRET_ACCESS_KEY=your_secret_key")

        input("Press Enter after configuring AWS credentials...")

        # Re-validate
        result = subprocess.run(
            ["aws", "sts", "get-caller-identity"],
            capture_output=True, text=True, timeout=10
        )
        if result.returncode != 0:
            raise Exception("AWS credentials still not working")

        return self.config_manager.load_aws_config()

    async def _create_env_file(self, aws_config: Any) -> None:
        """Create/update .env file with Bedrock configuration."""
        env_content = f"""# Claude Code Amazon Bedrock Configuration
CLAUDE_CODE_USE_BEDROCK=1
AWS_DEFAULT_REGION={aws_config.region}
ANTHROPIC_MODEL=us.anthropic.claude-sonnet-4-20250514-v1:0
ANTHROPIC_SMALL_FAST_MODEL=us.anthropic.claude-sonnet-4-20250514-v1:0
CLAUDE_CODE_MAX_OUTPUT_TOKENS=8192
DISABLE_PROMPT_CACHING=0
ANTHROPIC_MAX_RETRIES=5
CLAUDE_CONFIG_PATH=./.claude/settings.json
"""

        env_file = Path(".env")
        if env_file.exists():
            # Update existing file
            current_content = env_file.read_text()
            lines = current_content.split('\n')

            # Update or add each variable
            for line in env_content.split('\n'):
                if '=' in line:
                    var_name = line.split('=')[0]
                    # Replace existing line or add new one
                    found = False
                    for i, existing_line in enumerate(lines):
                        if existing_line.startswith(f"{var_name}="):
                            lines[i] = line
                            found = True
                            break
                    if not found:
                        lines.append(line)

            env_file.write_text('\n'.join(lines))
        else:
            env_file.write_text(env_content)

        self.output.success("Environment file created/updated")

    async def _validate_bedrock_integration(self) -> None:
        """Validate Bedrock integration if script exists."""
        bedrock_script = Path("bedrock_integration.py")
        if bedrock_script.exists():
            self.output.info("Validating Bedrock configuration...")
            result = subprocess.run(
                ["python", str(bedrock_script)],
                capture_output=True, text=True, timeout=30
            )

            if "Configuration Valid: True" in result.stdout:
                self.output.success("Bedrock configuration is valid")
            else:
                self.output.warning("Bedrock configuration validation failed")
```

### Phase 5: Testing and Integration

**5.1 Add Command Tests**
```python
# Add to tests/test_cli_commands.py

import pytest
import asyncio
from click.testing import CliRunner
from src.code_agent.cli.main import main

class TestCLICommands:
    def test_install_command_registered(self):
        """Test that install command is registered."""
        runner = CliRunner()
        result = runner.invoke(main, ['install', '--help'])
        assert result.exit_code == 0
        assert 'Installation and setup commands' in result.output

    def test_templates_command_registered(self):
        """Test that templates command is registered."""
        runner = CliRunner()
        result = runner.invoke(main, ['templates', '--help'])
        assert result.exit_code == 0
        assert 'Template management commands' in result.output

    def test_slash_command_parsing(self):
        """Test slash command parsing."""
        from src.code_agent.cli.core.slash_command_parser import SlashCommandParser

        parser = SlashCommandParser()
        cmd = parser.parse('/prp:create my-feature --template enhanced')

        assert cmd.category == 'prp'
        assert cmd.command == 'create'
        assert cmd.arguments == ['my-feature']
        assert cmd.options == {'template': 'enhanced'}

    def test_command_proxy_integration(self):
        """Test command proxy functionality."""
        runner = CliRunner()
        # This would test the proxy command - implementation depends on test setup
        pass
```

## Validation Loop

### Level 1: Syntax & Style
```bash
# Code quality checks
ruff check src/code_agent/ --fix
mypy src/code_agent/
black --check src/code_agent/
isort --check-only src/code_agent/
```

### Level 2: Unit Tests
```bash
# Run unit tests with coverage
pytest tests/ -v --cov=src/code_agent --cov-report=html --cov-report=term
```

### Level 3: Integration Tests
```bash
# Test CLI command registration
python -m pytest tests/test_cli_commands.py -v

# Test command functionality
code-agent --help
code-agent install --help
code-agent templates list
code-agent hooks list
code-agent workspace list
code-agent validate run
```

### Level 4: End-to-End Tests
```bash
# Test complete workflow
code-agent install setup --profile developer --dry-run
code-agent claude start --aws-region us-east-1
code-agent slash /prp:create test-feature --template enhanced
code-agent proxy some-unknown-command --test-flag

# Test proxy functionality
code-agent unknown-command --should-proxy-to-claude

# Test slash commands
code-agent slash /meta:analyze src/ --focus performance
```

### Level 5: Integration with Existing PRP Framework
```bash
# Test PRP framework integration
cd /path/to/prp-framework
python -m pytest tests/ -v

# Test MCP server integration
python prp_framework/mcp/test_servers.py

# Test meta command orchestration
python -m pytest tests/test_meta_commands.py -v
```

## Success Criteria

- [ ] All missing commands are registered and accessible via CLI
- [ ] Slash command parsing works for `/prp:*`, `/meta:*`, `/system:*` commands
- [ ] Command proxying forwards unknown commands to Claude Code
- [ ] Full start-claude-code.sh functionality is implemented
- [ ] Installation command provides profile-based setup
- [ ] All existing command classes are accessible via CLI
- [ ] Environment variable management matches bash script
- [ ] Interactive AWS setup works correctly
- [ ] All validation levels pass
- [ ] Integration tests with existing PRP framework succeed
- [ ] Update the comprehensive readme and other neeed docs for usage and to reflect our new system

## Implementation Order

1. **Quick Wins (Phase 1)**: Register missing commands - immediate 50% functionality improvement
2. **Core Infrastructure (Phase 2)**: Add command proxying - enables unknown command handling
3. **Advanced Features (Phase 3)**: Implement slash commands - delivers PRP/meta functionality
4. **Complete Integration (Phase 4)**: Full Claude integration - achieves start-claude-code.sh parity
5. **Quality Assurance (Phase 5)**: Testing and validation - ensures production readiness

## Risk Mitigation

- **Command Conflicts**: Use proper Click command groups to avoid naming conflicts
- **Environment Variables**: Careful inheritance and overriding to avoid breaking existing setups
- **Dependency Installation**: Graceful fallback if automated installation fails
- **Proxy Security**: Validate commands before proxying to prevent injection attacks
- **Error Handling**: Comprehensive error handling with helpful user messages

**Confidence Level: 9/10** - The implementation leverages existing, well-tested infrastructure and follows established patterns. The main work is wiring up existing functionality rather than building from scratch.
