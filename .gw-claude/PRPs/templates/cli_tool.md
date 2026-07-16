name: "CLI Tool PRP Template - Command-Line Applications with Cross-Platform Compatibility Standards"
description: |
  Comprehensive PRP template for command-line tools and applications.
  Supports both greenfield and brownfield scenarios with cross-platform compatibility, user experience optimization, and distribution strategies.

---

## Goal

**Feature Goal**: [Specific CLI functionality - data processing tool, automation script, development utility, etc.]

**Deliverable**: [Complete CLI application with argument parsing, configuration management, and distribution package]

**Success Definition**:
- Cross-platform compatibility (Windows, macOS, Linux) verified
- Clear help system and error messages provide actionable guidance
- Proper exit codes and error handling for shell integration
- Configuration management supports both files and environment variables
- Performance meets user expectations for interactive and batch operations
- [Additional success criteria specific to the CLI tool]

## User Persona

**Target User**: [Specific user type - developers, system administrators, data analysts, end users, etc.]

**Use Case**: [Primary scenarios when the CLI tool will be used]

**User Journey**: [Complete workflow from installation to accomplishing primary tasks]

**Pain Points Addressed**: [Specific command-line workflow frustrations this tool solves]

## Why

- [Productivity improvements and workflow automation benefits]
- [Integration with existing development or operational toolchains]
- [Problems this CLI tool solves and target user efficiency gains]
- [Cross-platform consistency and compatibility advantages]

## What

[CLI behavior, command structure, input/output formats, and technical requirements]

### Success Criteria

- [ ] Help system provides clear usage instructions and examples
- [ ] All commands work consistently across target platforms
- [ ] Error messages are user-friendly and suggest corrective actions
- [ ] Configuration can be managed through files and environment variables
- [ ] Input validation prevents crashes and provides meaningful feedback
- [ ] Output formatting supports both human-readable and machine-parseable formats
- [ ] Installation and distribution work through standard package managers
- [ ] [Additional project-specific criteria]

## All Needed Context

### Context Completeness Check

_Before implementing this CLI tool, validate: "If someone knew nothing about command-line development or this codebase, would they have everything needed to build a production-ready, cross-platform CLI tool successfully?"_

### Brownfield CLI Tool Considerations
- **Existing Command Structure**: [Current subcommands, argument patterns, naming conventions]
- **Current Configuration Format**: [YAML, JSON, TOML, INI file format and location]
- **Existing Plugin/Extension System**: [Plugin architecture, extension points, loading mechanism]
- **Current Distribution Method**: [npm, pip, brew, apt, manual installation approach]
- **Existing Testing and CI/CD**: [Test framework, automated testing, release pipeline]
- **Current Logging and Output**: [Logging format, verbosity levels, output formatting]
- **Existing User Documentation**: [Man pages, help system, user guides, examples]
- **Platform-Specific Implementations**: [OS-specific code, native integrations, dependencies]

### Documentation & References

```yaml
# CLI Design Best Practices
- url: https://clig.dev/
  why: Command line interface guidelines and best practices
  critical: User experience principles, error handling, output formatting

- url: https://12factor.net/config
  why: Configuration management best practices
  section: Environment variable usage and configuration hierarchy

# Framework-Specific Documentation
- url: [Click/Typer/Commander.js/Cobra docs URL with specific sections]
  why: [Argument parsing, subcommands, configuration, help generation]
  critical: [Cross-platform compatibility, error handling, plugin architecture]

# Cross-Platform Development
- file: src/utils/[platform_utils].py
  why: Established cross-platform compatibility patterns
  pattern: Path handling, process management, environment detection
  gotcha: Windows path separators, Unix permissions, shell differences

# Configuration Management
- file: config/[config_handler].py
  why: Current configuration file parsing and validation
  pattern: Config file loading, environment variable override, validation
  gotcha: Config file location conventions, user vs system configuration

# Distribution and Packaging
- file: setup.py or pyproject.toml or package.json
  why: Current packaging and distribution configuration
  pattern: Entry point definition, dependency management, platform-specific builds
  gotcha: Binary distribution, dependency conflicts, version compatibility
```

### Current Codebase Tree

```bash
# Run `tree -I '__pycache__|node_modules|*.pyc|build|dist' -L 3` to understand existing structure
```

### Desired CLI Tool Structure

```bash
src/
├── cli/                    # Command-line interface layer
│   ├── commands/          # Individual command implementations
│   │   ├── __init__.py    # Command registration and discovery
│   │   ├── [feature].py   # Feature-specific commands
│   │   └── config.py      # Configuration management commands
│   ├── parsers/           # Argument parsing and validation
│   ├── formatters/        # Output formatting (JSON, table, etc.)
│   └── main.py            # Main entry point and CLI setup
├── core/                   # Core functionality and business logic
│   ├── [domain]/          # Domain-specific logic modules
│   ├── services/          # External service integrations
│   └── models/            # Data structures and validation
├── utils/                  # Cross-platform utilities and helpers
│   ├── platform.py        # Platform detection and compatibility
│   ├── files.py           # File system operations
│   ├── process.py         # Process management and execution
│   └── validation.py      # Input validation and sanitization
├── config/                 # Configuration management
│   ├── settings.py        # Configuration schema and defaults
│   ├── loader.py          # Configuration file loading
│   └── validator.py       # Configuration validation
└── tests/                  # Comprehensive test suite
    ├── unit/              # Unit tests for individual components
    ├── integration/       # Integration tests with external systems
    ├── e2e/               # End-to-end command testing
    └── fixtures/          # Test data and mock configurations

distribution/
├── packaging/             # Platform-specific packaging
│   ├── pyproject.toml     # Python packaging configuration
│   ├── Dockerfile         # Container distribution
│   └── homebrew/          # macOS Homebrew formula
├── scripts/               # Installation and setup scripts
└── docs/                  # User documentation and examples

config/
├── templates/             # Configuration file templates
├── examples/              # Example configurations
└── schemas/               # Configuration validation schemas
```

### Known CLI Development Gotchas & Platform Quirks

```python
# CRITICAL: Path handling differs between Windows and Unix systems
# Use pathlib.Path() for cross-platform compatibility
# Windows uses backslashes, Unix uses forward slashes

# Terminal and Shell Differences
# PowerShell, Command Prompt, bash, zsh handle escaping differently
# Color output support varies across terminals and platforms
# Signal handling (SIGINT, SIGTERM) works differently on Windows

# Permission and Execution Context
# Unix systems require executable permissions (+x)
# Windows may require administrator privileges for certain operations
# File locking behavior differs between platforms

# Configuration File Locations
# Unix: ~/.config/app/, /etc/app/
# Windows: %APPDATA%\app\, %PROGRAMDATA%\app\
# macOS: ~/Library/Application Support/app/

# Environment Variables
# Windows uses %VAR% syntax, Unix uses $VAR
# Case sensitivity differs between platforms
# PATH separator is semicolon on Windows, colon on Unix
```

## Implementation Blueprint

### Command Structure and Argument Parsing

Create intuitive command structure with comprehensive help and validation.

```python
# Command Structure Pattern (Click/Typer example)
import click
from typing import Optional

@click.group()
@click.version_option()
@click.option('--config', '-c', help='Configuration file path')
@click.option('--verbose', '-v', is_flag=True, help='Enable verbose output')
@click.pass_context
def cli(ctx, config: Optional[str], verbose: bool):
    """
    Main CLI application for [tool description].

    Examples:
        tool command --option value
        tool subcommand --flag input.txt
    """
    ctx.ensure_object(dict)
    ctx.obj['config'] = config
    ctx.obj['verbose'] = verbose

@cli.command()
@click.argument('input_file', type=click.Path(exists=True))
@click.option('--output', '-o', type=click.Path(), help='Output file path')
@click.option('--format', type=click.Choice(['json', 'yaml', 'table']), default='table')
def process(input_file: str, output: Optional[str], format: str):
    """Process input file and generate output."""
    # VALIDATION: Input file validation and format checking
    # CROSS-PLATFORM: Use pathlib for path operations
    # ERROR HANDLING: User-friendly error messages with suggestions

# Configuration Management Pattern
from pathlib import Path
import os
from typing import Dict, Any

class ConfigManager:
    def __init__(self):
        self.config_paths = self._get_config_paths()
        self.config = self._load_config()

    def _get_config_paths(self) -> List[Path]:
        """Get platform-specific configuration file paths."""
        if os.name == 'nt':  # Windows
            return [
                Path(os.environ['APPDATA']) / 'app' / 'config.yaml',
                Path(os.environ['PROGRAMDATA']) / 'app' / 'config.yaml'
            ]
        else:  # Unix-like systems
            return [
                Path.home() / '.config' / 'app' / 'config.yaml',
                Path('/etc/app/config.yaml')
            ]
```

### Implementation Tasks (CLI Tool Specific)

```yaml
Task 1: CREATE src/cli/main.py
  - IMPLEMENT: Main CLI entry point with argument parsing
  - FOLLOW pattern: Existing CLI structure and command organization
  - FEATURES: Global options, help system, version information, error handling
  - CROSS-PLATFORM: Compatible argument parsing and environment detection
  - PLACEMENT: CLI package as main entry point

Task 2: CREATE src/cli/commands/[feature].py
  - IMPLEMENT: Individual command implementations with subcommands
  - FOLLOW pattern: Existing command structure and naming conventions
  - FEATURES: Command-specific arguments, options, validation, help text
  - USER EXPERIENCE: Clear help messages, examples, progress indicators
  - PLACEMENT: Commands directory for feature organization

Task 3: CREATE src/config/settings.py
  - IMPLEMENT: Configuration management with file and environment support
  - FOLLOW pattern: Existing configuration patterns and validation
  - FEATURES: Config file loading, environment variable override, validation
  - CROSS-PLATFORM: Platform-specific config file locations and formats
  - PLACEMENT: Configuration package for settings management

Task 4: CREATE src/utils/platform.py
  - IMPLEMENT: Cross-platform compatibility utilities
  - FOLLOW pattern: Existing platform abstraction patterns
  - FEATURES: Path handling, process management, environment detection
  - COMPATIBILITY: Windows, macOS, Linux support with graceful fallbacks
  - PLACEMENT: Utils package for shared platform-specific code

Task 5: CREATE src/cli/formatters/output.py
  - IMPLEMENT: Output formatting for different display formats
  - FOLLOW pattern: Existing output formatting and styling conventions
  - FEATURES: Table, JSON, YAML output with color support
  - ACCESSIBILITY: Screen reader compatible output, color disable option
  - PLACEMENT: Formatters package for output presentation logic

Task 6: CREATE distribution/pyproject.toml (or package.json)
  - IMPLEMENT: Package configuration for distribution
  - FOLLOW pattern: Existing packaging standards and entry point definition
  - FEATURES: Entry points, dependencies, metadata, platform-specific builds
  - DISTRIBUTION: Multiple distribution channels (pip, npm, brew, etc.)
  - PLACEMENT: Distribution directory for packaging configuration

Task 7: CREATE scripts/install.sh (and install.ps1 for Windows)
  - IMPLEMENT: Installation scripts for manual distribution
  - FOLLOW pattern: Existing installation procedures and user experience
  - FEATURES: Dependency checking, installation verification, uninstall option
  - CROSS-PLATFORM: Platform-specific installation procedures
  - PLACEMENT: Scripts directory for installation automation

Task 8: CREATE tests/e2e/test_[command]_flow.py
  - IMPLEMENT: End-to-end tests for complete command workflows
  - FOLLOW pattern: Existing test structure and assertion patterns
  - COVERAGE: All commands, error conditions, cross-platform scenarios
  - AUTOMATION: CI/CD integration with multiple platform testing
  - PLACEMENT: Tests directory with clear test type organization
```

### CLI Tool Implementation Patterns

```python
# Cross-Platform File Operations
from pathlib import Path
import shutil
import os

def safe_file_operation(source: Path, destination: Path) -> bool:
    """Perform file operations with proper error handling."""
    try:
        # CROSS-PLATFORM: Use pathlib for path operations
        destination.parent.mkdir(parents=True, exist_ok=True)

        # SAFETY: Check permissions and disk space
        if not os.access(destination.parent, os.W_OK):
            raise PermissionError(f"No write permission for {destination.parent}")

        shutil.copy2(source, destination)
        return True
    except Exception as e:
        # USER-FRIENDLY: Clear error messages with suggestions
        click.echo(f"Error: {e}", err=True)
        return False

# Progress Indication Pattern
import click
from typing import Iterator

def process_with_progress(items: list) -> Iterator:
    """Process items with progress indication."""
    with click.progressbar(items, label='Processing files') as bar:
        for item in bar:
            # PERFORMANCE: Yield results for streaming processing
            # USER EXPERIENCE: Show progress for long operations
            yield process_item(item)

# Error Handling and Exit Codes
import sys
from enum import IntEnum

class ExitCode(IntEnum):
    SUCCESS = 0
    GENERAL_ERROR = 1
    MISUSE_OF_SHELL_BUILTINS = 2
    PERMISSION_DENIED = 126
    COMMAND_NOT_FOUND = 127

def handle_command_error(error: Exception) -> None:
    """Handle command errors with appropriate exit codes."""
    if isinstance(error, PermissionError):
        click.echo(f"Permission denied: {error}", err=True)
        sys.exit(ExitCode.PERMISSION_DENIED)
    elif isinstance(error, FileNotFoundError):
        click.echo(f"File not found: {error}", err=True)
        sys.exit(ExitCode.COMMAND_NOT_FOUND)
    else:
        click.echo(f"Error: {error}", err=True)
        sys.exit(ExitCode.GENERAL_ERROR)
```

### Integration Points

```yaml
CONFIGURATION:
  - files: "YAML/JSON/TOML configuration with validation schema"
  - environment: "Environment variable override with prefix convention"
  - user_config: "User-specific configuration in platform-appropriate location"

EXTERNAL_TOOLS:
  - shell_integration: "Shell completion support (bash, zsh, fish, PowerShell)"
  - pipe_support: "Standard input/output for Unix pipeline integration"
  - editor_integration: "Integration with system editors and pagers"

DISTRIBUTION:
  - package_managers: "Distribution through pip, npm, brew, chocolatey, apt"
  - binary_releases: "Self-contained binaries for direct download"
  - container_images: "Docker images for containerized usage"

LOGGING_AND_OUTPUT:
  - structured_logging: "JSON logging for machine processing"
  - human_readable: "Color-coded output with progress indicators"
  - verbosity_levels: "Multiple verbosity levels for debugging and monitoring"

CROSS_PLATFORM:
  - path_handling: "Platform-appropriate path separators and conventions"
  - process_management: "Cross-platform process execution and signal handling"
  - permission_model: "Platform-specific permission and security handling"
```

## Validation Loop

### Level 1: CLI Development Validation

```bash
# Code quality and type checking
ruff check src/ --fix              # Python linting
mypy src/                          # Type checking
pytest src/ --cov=src --cov-fail-under=80  # Test coverage

# CLI basic functionality
python -m src.cli.main --help      # Help system verification
python -m src.cli.main --version   # Version information

# Cross-platform testing (run on each target platform)
python -m src.cli.main [command] --dry-run  # Safe command execution test

# Expected: No linting errors, help system working, commands discoverable
```

### Level 2: Command and Integration Testing

```bash
# Unit testing
pytest tests/unit/ -v              # Unit tests for individual components
pytest tests/cli/ -v               # CLI-specific functionality tests

# Command testing
pytest tests/e2e/ -v               # End-to-end command workflow tests
pytest tests/integration/ -v       # Integration with external tools/services

# Configuration testing
pytest tests/config/ -v            # Configuration loading and validation tests

# Cross-platform testing
pytest tests/platform/ -v          # Platform-specific functionality tests

# Expected: All tests pass, commands work correctly, configuration valid
```

### Level 3: User Experience and Compatibility Testing

```bash
# Help system validation
python -m src.cli.main --help | head -20  # Help output format check
python -m src.cli.main command --help     # Subcommand help verification

# Error handling testing
python -m src.cli.main invalid_command    # Invalid command handling
python -m src.cli.main command --invalid-option  # Invalid option handling

# Output format testing
python -m src.cli.main command --format json    # JSON output validation
python -m src.cli.main command --format table   # Table output validation

# Shell integration testing
# Test shell completion (if implemented)
source <(python -m src.cli.main completion bash)

# Performance testing
time python -m src.cli.main command [large_input]  # Performance benchmarking

# Expected: User-friendly help, clear error messages, good performance
```

### Level 4: Distribution and Production Validation

```bash
# Package building
pip install build
python -m build                    # Build distribution packages

# Installation testing
pip install dist/[package]-*.whl   # Test wheel installation
[package] --version                # Verify installed CLI works

# Binary distribution (if applicable)
pyinstaller --onefile src/cli/main.py  # Single binary creation
./dist/main --version              # Test standalone binary

# Container testing (if applicable)
docker build -t cli-tool .         # Container build
docker run --rm cli-tool --help    # Container execution test

# Cross-platform testing
# Test on Windows, macOS, Linux with different Python versions

# Package manager distribution testing
# Test installation through pip, npm, brew, etc.

# Expected: Clean installation, all dependencies resolved, cross-platform compatibility
```

## Final Validation Checklist

### Technical Validation (CLI-Specific)

- [ ] Cross-platform compatibility verified on all target platforms
- [ ] Help system provides comprehensive usage information
- [ ] Error messages are clear and suggest corrective actions
- [ ] Exit codes follow standard conventions
- [ ] Configuration management works with files and environment variables
- [ ] Input validation prevents crashes and provides meaningful feedback
- [ ] Output formatting supports both human and machine consumption

### User Experience Validation (CLI Tool)

- [ ] Command structure is intuitive and follows CLI conventions
- [ ] Progress indicators provided for long-running operations
- [ ] Color output enhances readability without breaking automation
- [ ] Shell completion works for improved productivity
- [ ] Documentation includes practical examples and use cases
- [ ] Installation process is straightforward on all platforms
- [ ] Uninstallation process is clean and complete

### Performance Validation (CLI Tool)

- [ ] Startup time is acceptable for interactive use (<1 second)
- [ ] Memory usage is reasonable for the functionality provided
- [ ] Large input processing is efficient and doesn't block unnecessarily
- [ ] Parallel processing utilized where appropriate
- [ ] Resource cleanup prevents memory leaks in long-running operations
- [ ] Performance scales reasonably with input size

### Distribution and Maintenance (CLI Tool)

- [ ] Package distribution works through standard channels
- [ ] Version management and update mechanisms implemented
- [ ] Dependency management prevents conflicts
- [ ] Binary distributions are self-contained and portable
- [ ] Build process is automated and reproducible
- [ ] Release process includes comprehensive testing
- [ ] User documentation is complete and accessible

---

## CLI Tool Anti-Patterns to Avoid

### User Experience Anti-Patterns
- ❌ Don't create confusing command hierarchies or inconsistent naming
- ❌ Don't skip help text or provide unhelpful error messages
- ❌ Don't ignore standard CLI conventions (--help, --version, exit codes)
- ❌ Don't break standard input/output for pipeline integration

### Cross-Platform Anti-Patterns
- ❌ Don't hardcode platform-specific paths or commands
- ❌ Don't ignore platform differences in file permissions
- ❌ Don't assume Unix-only tools or shell features
- ❌ Don't skip testing on all target platforms

### Performance Anti-Patterns
- ❌ Don't load unnecessary dependencies at startup
- ❌ Don't process entire files into memory for streaming operations
- ❌ Don't skip progress indicators for long-running operations
- ❌ Don't ignore signal handling for graceful interruption

### Configuration Anti-Patterns
- ❌ Don't create custom configuration formats when standards exist
- ❌ Don't ignore environment variable conventions
- ❌ Don't store configuration in non-standard locations
- ❌ Don't skip configuration validation and error reporting

### Distribution Anti-Patterns
- ❌ Don't create complex installation procedures
- ❌ Don't ignore dependency version conflicts
- ❌ Don't skip automated testing in packaging pipeline
- ❌ Don't forget to provide uninstallation instructions
