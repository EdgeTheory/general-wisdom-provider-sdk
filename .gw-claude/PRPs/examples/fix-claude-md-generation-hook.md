name: "Fix Claude.md Generation Hook System with CLI Tool Integration"
description: |
  Comprehensive PRP for fixing the claude.md generation hook system that's currently failing due to import errors, session management issues, and incomplete CLI command implementation. This PRP now includes full integration with the new CLI tool in src/code_agent/cli/ to ensure dynamic CLAUDE.md generation works across both the base project and the CLI tool functionality.

## Goal

Fix the claude.md generation hook system to enable dynamic context injection based on user prompts for both the base project and the new CLI tool. The system should automatically generate context-appropriate CLAUDE.md files by analyzing user input and selecting optimal modules from the docs/modules directory structure, with seamless integration across both project contexts.

## Why

- **User Experience**: Currently users get static fallback CLAUDE.md instead of dynamic, context-aware guidance
- **System Intelligence**: The sophisticated module system (9 core modules, 6 domains, 6 personas, 4 tech stacks) is underutilized
- **Hook System Value**: The PreToolUse hook infrastructure exists but fails to deliver its intended functionality
- **Command Completeness**: The `/claude-md:generate` command times out and doesn't work properly
- **CLI Tool Integration**: The new CLI tool in src/code_agent/cli/ needs seamless CLAUDE.md generation functionality
- **Dual Context Support**: Both base project and CLI tool contexts need dynamic generation capabilities

## What

**Current State**: Hook system triggers but fails to generate dynamic content due to:
- Missing `project_initializer.py` causing import errors in prp_framework
- Session management logic preventing re-processing when it should allow it
- User prompt detection failing in transcript parsing
- `/claude-md:generate` command timing out
- Fallback to static CLAUDE.md instead of dynamic generation
- CLI tool lacks dynamic CLAUDE.md generation capabilities
- No integration between base project and CLI tool contexts

**Desired State**: Fully functional dynamic claude.md generation with:
- Working PreToolUse hook that successfully injects context
- Proper `/claude-md:generate` CLI command for both contexts
- CLI tool integration with slash command routing
- Intelligent module selection based on user intent
- Robust error handling and fallback mechanisms
- Session management that allows appropriate re-processing
- Seamless context switching between base project and CLI tool

### Success Criteria

- [ ] PreToolUse hook successfully generates dynamic CLAUDE.md based on user prompts
- [ ] `/claude-md:generate` command works without timing out in both contexts
- [ ] Import errors in prp_framework are resolved
- [ ] Session management allows re-processing when CLAUDE.md is missing/empty
- [ ] User prompt detection works reliably for various conversation formats
- [ ] Fallback mechanisms work gracefully when dynamic generation fails
- [ ] All existing functionality continues to work without regression
- [ ] CLI tool slash command routing includes `/claude-md:*` commands
- [ ] ResourceManager integration supports dynamic CLAUDE.md deployment
- [ ] Project-specific context detection works for both base and CLI contexts
- [ ] Module selection intelligence adapts to project type and user intent

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://docs.python.org/3/library/json.html
  why: Robust JSONL parsing patterns for transcript analysis

- url: https://click.palletsprojects.com/en/8.1.x/
  why: CLI command implementation patterns and context management

- url: https://docs.python.org/3/library/asyncio.html
  why: Async session management and concurrent processing

- file: /Users/patrick.henry/dev/code-agent/.claude/hooks/pre_tool_dynamic_context.py
  why: Existing hook implementation that needs debugging and improvement

- file: /Users/patrick.henry/dev/code-agent/.claude/settings.json
  why: Hook configuration and timeout settings

- file: /Users/patrick.henry/dev/code-agent/prp_framework/composition/claude_md_composer.py
  why: Working composer for assembling CLAUDE.md from modules

- file: /Users/patrick.henry/dev/code-agent/prp_framework/commands/cli.py
  why: CLI command structure and patterns

- file: /Users/patrick.henry/dev/code-agent/docs/modules/
  why: Complete module structure (core, domains, personas, tech-stacks)

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/cli/core/slash_command_handler.py
  why: Slash command routing and proxy patterns

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/cli/core/resource_manager.py
  why: Current CLAUDE.md deployment and resource management patterns

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/cli/core/hook_manager.py
  why: Hook system architecture and event management

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/cli/commands/main.py
  why: CLI command structure and integration patterns

- file: /Users/patrick.henry/dev/code-agent/src/code_agent/models/project.py
  why: Project model with get_claude_md_path() method

- file: /Users/patrick.henry/dev/code-agent/src/test_final/docs/modules/
  why: Complete modular documentation structure for CLI integration

- docfile: PRPs/ai_docs/cli_hook_patterns.md
  why: Research findings on CLI hook system best practices

- docfile: PRPs/ai_docs/dynamic_docs_patterns.md
  why: Research findings on dynamic documentation generation

- docfile: PRPs/ai_docs/transcript_parsing_patterns.md
  why: Research findings on conversation transcript analysis
```

### Current Codebase Structure

```bash
/Users/patrick.henry/dev/code-agent/
├── .claude/
│   ├── hooks/
│   │   ├── pre_tool_dynamic_context.py  # Main hook (working but failing)
│   │   ├── pre_tool_use.py             # Security validation hook
│   │   └── post_tool_use.py            # Logging hook
│   ├── settings.json                   # Hook configuration
│   └── logs/                          # Hook execution logs
├── prp_framework/
│   ├── composition/
│   │   └── claude_md_composer.py      # Working composer
│   ├── commands/
│   │   ├── cli.py                     # CLI commands
│   │   └── enhanced_claude_md.py      # Enhanced commands (incomplete)
│   ├── installation/
│   │   └── core.py                    # Import error here - missing project_initializer
│   └── context/
│       └── dynamic_analyzer.py        # Context analysis
├── docs/modules/
│   ├── core/                          # 9 core modules
│   ├── domains/                       # 6 domain modules
│   ├── personas/                      # 6 persona modules
│   └── tech-stacks/                   # 4 tech stack modules
├── src/code_agent/cli/                # NEW CLI TOOL STRUCTURE
│   ├── __main__.py                    # CLI entry point
│   ├── core/
│   │   ├── resource_manager.py        # Handles CLAUDE.md deployment
│   │   ├── slash_command_handler.py   # Slash command routing
│   │   ├── hook_manager.py            # Hook system management
│   │   └── claude_code_proxy.py       # Claude Code integration
│   ├── commands/
│   │   ├── main.py                    # Main CLI commands
│   │   ├── projects.py                # Project management
│   │   └── claude.py                  # Claude command implementations
│   ├── models/
│   │   ├── project.py                 # Project model with claude_md_path
│   │   └── hook.py                    # Hook event models
│   └── utils/
│       └── project_utils.py           # Project utilities
├── src/test_final/docs/modules/       # CLI TOOL MODULE STRUCTURE
│   ├── core/                          # 9 core modules for CLI
│   ├── domains/                       # 6 domain modules for CLI
│   ├── personas/                      # 6 persona modules for CLI
│   ├── tech-stacks/                   # 4 tech stack modules for CLI
│   └── patterns/                      # Additional pattern modules
├── CLAUDE.md                          # Static fallback (currently used)
└── CLAUDE.md.static                   # Original static backup
```

### Missing Files and Issues

```python
# CRITICAL: Missing file causing import errors
prp_framework/installation/project_initializer.py  # Imported by core.py but doesn't exist

# CRITICAL: Session management too aggressive
# Hook logs show "Session already processed, skipping" preventing re-processing
# Logic in pre_tool_dynamic_context.py:should_skip_processing() is too restrictive

# CRITICAL: User prompt detection failing
# Hook logs show "No user prompt found, skipping context injection"
# Logic in get_latest_user_message() has parsing issues for different message formats

# CRITICAL: /claude-md:generate command timing out
# Command exists in CLI but hangs/times out instead of executing properly

# CRITICAL: CLI tool missing /claude-md:* slash commands
# src/code_agent/cli/core/slash_command_handler.py lacks claude-md category
# No routing for /claude-md:generate, /claude-md:sync, /claude-md:modules commands

# CRITICAL: ResourceManager lacks dynamic generation
# src/code_agent/cli/core/resource_manager.py only deploys static CLAUDE.md
# No integration with modular documentation system

# CRITICAL: No CLI tool hook integration
# src/code_agent/cli/core/hook_manager.py exists but no claude-md hooks
# No integration with base project hook system
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: UV script execution requires specific shebang
#!/usr/bin/env -S uv run --script
# This is required for hooks to work properly

# CRITICAL: JSONL parsing requires robust error handling
# Transcript files can have malformed JSON lines
# Must use streaming parsing for large files

# CRITICAL: Session ID truncation for privacy
session_id[:8]  # Always truncate session IDs in logs

# CRITICAL: Hook timeout enforcement
# Hooks have 10-second timeout in settings.json
# Must complete within this limit or be killed

# CRITICAL: Context injection must be idempotent
# Hook can be called multiple times per session
# Must handle re-processing logic correctly

# CRITICAL: Import path issues in prp_framework
# sys.path.insert(0, str(Path(__file__).parent.parent.parent))
# Required for hooks to import framework modules
```

## Implementation Blueprint

### Data Models and Structure

```python
# Missing data model for project initialization
@dataclass
class ProjectInitializer:
    """Handles project initialization and validation"""
    project_path: Path
    config: Dict[str, Any]
    modules_dir: Path

    def validate_project_structure(self) -> bool:
        """Validate that required directories exist"""
        pass

    def initialize_project_context(self) -> Dict[str, Any]:
        """Initialize context for project processing"""
        pass

# Enhanced session management model
@dataclass
class SessionContext:
    """Improved session context for better tracking"""
    session_id: str
    user_prompt: str
    intent: str
    confidence: float
    last_processed: datetime
    retry_count: int = 0
    max_retries: int = 3

    def should_process(self) -> bool:
        """Determine if session should be processed"""
        pass

    def can_retry(self) -> bool:
        """Check if retry is allowed"""
        pass
```

### List of Tasks to Complete

```yaml
Task 1: Fix Import Errors in PRP Framework
CREATE prp_framework/installation/project_initializer.py:
  - MIRROR pattern from: prp_framework/installation/minimal_project_integrator.py
  - IMPLEMENT required methods expected by core.py
  - KEEP consistent with existing integrator patterns

Task 2: Improve User Prompt Detection
MODIFY .claude/hooks/pre_tool_dynamic_context.py:
  - FIND function: get_latest_user_message()
  - ENHANCE parsing logic for different message formats
  - ADD better error handling for malformed JSONL
  - PRESERVE existing session management logic

Task 3: Fix Session Management Logic
MODIFY .claude/hooks/pre_tool_dynamic_context.py:
  - FIND function: should_skip_processing()
  - REDUCE aggressiveness of session caching
  - ALLOW re-processing when CLAUDE.md is missing/empty
  - PRESERVE privacy and performance optimizations

Task 4: Implement Proper /claude-md:generate Command
MODIFY src/code_agent/cli/core/slash_command_handler.py:
  - ADD proper routing for /claude-md:generate
  - CONNECT to existing CLAUDEMDComposer
  - IMPLEMENT timeout and error handling
  - PRESERVE existing command patterns

Task 5: Add Robust Error Handling
MODIFY .claude/hooks/pre_tool_dynamic_context.py:
  - ENHANCE exception handling in inject_dynamic_context()
  - ADD comprehensive logging for debugging
  - IMPLEMENT graceful fallback mechanisms
  - PRESERVE existing hook performance

Task 6: Create CLI Tool CLAUDE.md Command System
CREATE src/code_agent/cli/commands/claude_md.py:
  - IMPLEMENT /claude-md:generate command handler
  - ADD /claude-md:sync, /claude-md:modules commands
  - CONNECT to modular documentation system
  - MIRROR existing CLI command patterns

Task 7: Enhance ResourceManager for Dynamic Generation
MODIFY src/code_agent/cli/core/resource_manager.py:
  - EXTEND deploy_claude_md() for dynamic generation
  - ADD module selection and composition logic
  - INTEGRATE with src/test_final/docs/modules/ structure
  - PRESERVE existing resource deployment patterns

Task 8: Integrate CLI Tool Hook System
MODIFY src/code_agent/cli/core/hook_manager.py:
  - ADD claude-md generation hooks
  - INTEGRATE with base project hook system
  - IMPLEMENT project-specific context detection
  - PRESERVE existing hook architecture

Task 9: Add CLI Tool Slash Command Routing
MODIFY src/code_agent/cli/core/slash_command_handler.py:
  - ADD "claude-md" category to command routing
  - IMPLEMENT /claude-md:* command handlers
  - CONNECT to new claude_md.py command module
  - PRESERVE existing proxy patterns

Task 10: Create Comprehensive Validation System
CREATE tests/test_claude_md_generation.py:
  - IMPLEMENT unit tests for all components
  - ADD integration tests for hook system
  - CREATE validation helpers for testing
  - MIRROR existing test patterns from codebase
  - ADD CLI tool specific test cases
```

### Per Task Pseudocode

```python
# Task 1: Fix Import Errors
class ProjectInitializer:
    def __init__(self, project_path: Path):
        self.project_path = project_path
        self.docs_dir = project_path / 'docs' / 'modules'

    def validate_project_structure(self) -> bool:
        # PATTERN: Check for required directories
        required_dirs = ['docs/modules/core', 'docs/modules/domains']
        return all((self.project_path / dir).exists() for dir in required_dirs)

    def get_available_modules(self) -> List[str]:
        # PATTERN: Scan module directory like existing composers
        modules = []
        for category in ['core', 'domains', 'personas', 'tech-stacks']:
            category_path = self.docs_dir / category
            if category_path.exists():
                modules.extend(f"{category}/{f.name}" for f in category_path.glob("*.md"))
        return modules

# Task 2: Improve User Prompt Detection
def get_latest_user_message(self, transcript_path: str) -> str:
    # PATTERN: Stream processing for large files
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                entry = json.loads(line.strip())
                if self._is_user_message(entry):
                    content = self._extract_content(entry)
                    if content and len(content.strip()) > 10:
                        return content
            except json.JSONDecodeError as e:
                # CRITICAL: Log but continue processing
                self.debug_log(f"JSON parse error line: {e}")
                continue
    return ""

# Task 3: Fix Session Management
def should_skip_processing(self, session_id: str, transcript_path: str) -> bool:
    # PATTERN: Allow re-processing in more cases
    claude_md_path = Path('CLAUDE.md')

    # CRITICAL: Always process if CLAUDE.md is missing or empty
    if not claude_md_path.exists() or claude_md_path.stat().st_size < 100:
        return False

    # CRITICAL: Allow re-processing after shorter timeout (10 minutes instead of 30)
    return self._check_recent_processing(session_id, timeout_minutes=10)

# Task 4: Implement /claude-md:generate Command
async def handle_claude_md_generate(self, args: List[str]) -> str:
    # PATTERN: Use existing composer with timeout
    try:
        async with asyncio.timeout(30):  # 30 second timeout
            composer = CLAUDEMDComposer(
                docs_dir=Path('docs/modules'),
                config=CompositionConfig(token_optimization=True)
            )

            # PATTERN: Generate with intelligent module selection
            enhanced_claude_md = await composer.compose_claude_md()

            # CRITICAL: Write to CLAUDE.md and backup static version
            Path('CLAUDE.md').write_text(enhanced_claude_md)
            return "✅ CLAUDE.md generated successfully"

    except asyncio.TimeoutError:
        return "❌ Command timed out after 30 seconds"
    except Exception as e:
        return f"❌ Error generating CLAUDE.md: {e}"

# Task 6: Create CLI Tool CLAUDE.md Command System
class CLAUDEMDCommands:
    def __init__(self, resource_manager: ResourceManager):
        self.resource_manager = resource_manager
        self.modules_dir = Path('src/test_final/docs/modules')

    async def generate_claude_md(self, args: List[str]) -> str:
        # PATTERN: Use ResourceManager integration
        try:
            context = self._detect_project_context()
            modules = self._select_optimal_modules(context)

            claude_md = await self.resource_manager.deploy_dynamic_claude_md(
                modules=modules,
                context=context
            )

            return f"✅ Generated CLAUDE.md with {len(modules)} modules"

        except Exception as e:
            return f"❌ Generation failed: {e}"

    def _detect_project_context(self) -> Dict[str, Any]:
        # PATTERN: Analyze project structure for context
        return {
            'domains': self._detect_domains(),
            'tech_stack': self._detect_tech_stack(),
            'complexity': self._assess_complexity()
        }

# Task 7: Enhance ResourceManager for Dynamic Generation
class ResourceManager:
    async def deploy_dynamic_claude_md(self, modules: List[str], context: Dict[str, Any]) -> str:
        # PATTERN: Extend existing deploy_claude_md
        try:
            # CRITICAL: Check for both base and CLI module directories
            base_modules = Path('docs/modules')
            cli_modules = Path('src/test_final/docs/modules')

            modules_dir = cli_modules if cli_modules.exists() else base_modules

            composer = CLAUDEMDComposer(
                docs_dir=modules_dir,
                selected_modules=modules,
                context=context
            )

            dynamic_content = await composer.compose_claude_md()

            # CRITICAL: Write to project-specific location
            project = self._get_current_project()
            claude_md_path = project.get_claude_md_path()

            claude_md_path.write_text(dynamic_content)
            return dynamic_content

        except Exception as e:
            # CRITICAL: Fallback to static deployment
            return self.deploy_claude_md_static()

# Task 8: Integrate CLI Tool Hook System
class HookManager:
    def register_claude_md_hooks(self):
        # PATTERN: Integrate with existing hook architecture
        self.register_hook(
            event=HookEvent.PRE_TOOL_USE,
            handler=self._handle_pre_tool_claude_md_generation
        )

    async def _handle_pre_tool_claude_md_generation(self, event_data: Dict[str, Any]):
        # PATTERN: Mirror base project hook logic
        try:
            session_id = event_data.get('session_id')
            user_prompt = event_data.get('user_prompt')

            if self._should_generate_claude_md(session_id, user_prompt):
                context = self._analyze_user_intent(user_prompt)
                modules = self._select_modules_for_context(context)

                await self.resource_manager.deploy_dynamic_claude_md(
                    modules=modules,
                    context=context
                )

        except Exception as e:
            self.logger.error(f"Hook failed: {e}")
            # CRITICAL: Continue execution, don't break workflow

# Task 9: Add CLI Tool Slash Command Routing
class SlashCommandHandler:
    def _handle_claude_md_commands(self, command: str, args: List[str]) -> str:
        # PATTERN: Add to existing command routing
        claude_md_commands = CLAUDEMDCommands(self.resource_manager)

        if command == '/claude-md:generate':
            return asyncio.run(claude_md_commands.generate_claude_md(args))
        elif command == '/claude-md:sync':
            return asyncio.run(claude_md_commands.sync_claude_md(args))
        elif command == '/claude-md:modules':
            return claude_md_commands.list_available_modules()
        else:
            return f"Unknown claude-md command: {command}"

    def handle_slash_command(self, command: str, args: List[str]) -> str:
        # PATTERN: Add claude-md to existing routing
        if command.startswith('/claude-md:'):
            return self._handle_claude_md_commands(command, args)

        # PRESERVE: Existing routing logic
        return self._handle_existing_commands(command, args)
```

### Integration Points

```yaml
HOOK_SYSTEM:
  - modify: .claude/settings.json
  - pattern: "Increase timeout to 30 seconds for complex operations"
  - validation: "Test with timeout scenarios"

BASE_CLI_COMMANDS:
  - modify: src/code_agent/cli/core/slash_command_handler.py
  - pattern: "Add /claude-md:generate to routing table"
  - validation: "Test command execution and timeout handling"

CLI_TOOL_COMMANDS:
  - create: src/code_agent/cli/commands/claude_md.py
  - pattern: "Implement full claude-md command suite"
  - validation: "Test all claude-md commands work correctly"

RESOURCE_MANAGER:
  - modify: src/code_agent/cli/core/resource_manager.py
  - pattern: "Add deploy_dynamic_claude_md method"
  - validation: "Test dynamic deployment with module selection"

HOOK_MANAGER:
  - modify: src/code_agent/cli/core/hook_manager.py
  - pattern: "Add claude-md generation hooks"
  - validation: "Test hook registration and execution"

MODULE_INTEGRATION:
  - reference: src/test_final/docs/modules/
  - pattern: "Use CLI tool module structure for dynamic generation"
  - validation: "Test module loading from CLI context"

LOGGING:
  - enhance: .claude/logs/pretool_context_debug.log
  - pattern: "Add structured logging for debugging"
  - validation: "Verify log entries are informative"

IMPORTS:
  - fix: prp_framework/installation/__init__.py
  - pattern: "Update imports to include new ProjectInitializer"
  - validation: "Test import resolution"

PROJECT_MODELS:
  - integrate: src/code_agent/models/project.py
  - pattern: "Use get_claude_md_path() for project-specific paths"
  - validation: "Test project-specific CLAUDE.md generation"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
ruff check --fix prp_framework/installation/project_initializer.py
ruff check --fix .claude/hooks/pre_tool_dynamic_context.py
ruff check --fix src/code_agent/cli/commands/claude_md.py
ruff check --fix src/code_agent/cli/core/resource_manager.py
ruff check --fix src/code_agent/cli/core/hook_manager.py
mypy prp_framework/installation/project_initializer.py
mypy .claude/hooks/pre_tool_dynamic_context.py
mypy src/code_agent/cli/commands/claude_md.py
mypy src/code_agent/cli/core/resource_manager.py

# Expected: No errors. If errors, READ the error and fix.
```

### Level 2: Unit Tests

```python
# CREATE tests/test_claude_md_generation.py
def test_project_initializer():
    """Test ProjectInitializer validation"""
    initializer = ProjectInitializer(Path('.'))
    assert initializer.validate_project_structure() == True
    modules = initializer.get_available_modules()
    assert 'core/ORCHESTRATOR.md' in modules

def test_user_prompt_detection():
    """Test improved user prompt detection"""
    # Create test transcript with various message formats
    test_transcript = create_test_transcript()
    prompt = get_latest_user_message(test_transcript)
    assert prompt != ""
    assert len(prompt) > 10

def test_session_management():
    """Test improved session management logic"""
    session_id = "test-session-123"

    # Should allow processing when CLAUDE.md is missing
    Path('CLAUDE.md').unlink(missing_ok=True)
    assert should_skip_processing(session_id, '') == False

    # Should allow processing when CLAUDE.md is empty
    Path('CLAUDE.md').write_text("")
    assert should_skip_processing(session_id, '') == False

def test_claude_md_command():
    """Test /claude-md:generate command"""
    result = asyncio.run(handle_claude_md_generate([]))
    assert "✅" in result
    assert Path('CLAUDE.md').exists()
    assert Path('CLAUDE.md').stat().st_size > 100

def test_cli_tool_claude_md_commands():
    """Test CLI tool CLAUDE.md command system"""
    resource_manager = ResourceManager()
    claude_md_commands = CLAUDEMDCommands(resource_manager)

    # Test generate command
    result = asyncio.run(claude_md_commands.generate_claude_md([]))
    assert "✅" in result

    # Test module listing
    modules = claude_md_commands.list_available_modules()
    assert len(modules) > 0
    assert 'core/ORCHESTRATOR.md' in modules

def test_resource_manager_dynamic_deployment():
    """Test ResourceManager dynamic CLAUDE.md deployment"""
    resource_manager = ResourceManager()

    modules = ['core/ORCHESTRATOR.md', 'domains/ARCHITECTURE.md']
    context = {'domain': 'architecture', 'tech_stack': 'python'}

    result = asyncio.run(resource_manager.deploy_dynamic_claude_md(modules, context))
    assert len(result) > 1000  # Should be substantial content
    assert 'ORCHESTRATOR' in result
    assert 'ARCHITECTURE' in result

def test_slash_command_routing():
    """Test CLI tool slash command routing"""
    handler = SlashCommandHandler()

    # Test /claude-md:generate routing
    result = handler.handle_slash_command('/claude-md:generate', [])
    assert "✅" in result or "❌" in result  # Should return status

    # Test /claude-md:modules routing
    result = handler.handle_slash_command('/claude-md:modules', [])
    assert isinstance(result, str)
    assert len(result) > 0

def test_hook_manager_integration():
    """Test CLI tool hook manager integration"""
    hook_manager = HookManager()
    hook_manager.register_claude_md_hooks()

    # Test hook registration
    assert HookEvent.PRE_TOOL_USE in hook_manager.hooks

    # Test hook execution
    event_data = {
        'session_id': 'test-session',
        'user_prompt': 'Help me with architecture design'
    }

    asyncio.run(hook_manager._handle_pre_tool_claude_md_generation(event_data))
    # Should not raise exception
```

```bash
# Run and iterate until passing:
uv run pytest tests/test_claude_md_generation.py -v
# If failing: Read error, understand root cause, fix code, re-run
```

### Level 3: Integration Tests

```bash
# Test hook system end-to-end
echo '{"session_id": "test-session", "transcript_path": "test_transcript.jsonl", "tool_name": "TestTool"}' | uv run --script .claude/hooks/pre_tool_dynamic_context.py

# Expected: Hook runs without errors and generates dynamic CLAUDE.md
# Check: CLAUDE.md should be updated and not just static fallback

# Test CLI command
code-agent slash /claude-md:generate

# Expected: Command completes within 30 seconds with success message
# Check: CLAUDE.md should be generated with dynamic content

# Test CLI tool integration
cd src/code_agent/cli && python -m code_agent claude generate-claude-md

# Expected: CLI tool generates CLAUDE.md using its module system
# Check: CLAUDE.md should contain modules from src/test_final/docs/modules/

# Test CLI tool slash commands
code-agent slash /claude-md:modules
code-agent slash /claude-md:sync

# Expected: Commands return module listings and sync status
# Check: No errors or timeouts

# Test project-specific generation
code-agent projects set-active test-project
code-agent slash /claude-md:generate

# Expected: CLAUDE.md generated in project-specific location
# Check: Project model get_claude_md_path() used correctly
```

### Level 4: Creative Validation

```bash
# Test with different conversation patterns
# Create test transcripts with:
# - Various message formats (string vs list content)
# - Different user intents (coding, architecture, security)
# - Malformed JSON lines
# - Large transcript files

# Test session management edge cases
# - Missing transcript files
# - Empty transcript files
# - Transcript files with only system messages
# - Multiple rapid-fire requests

# Test module selection intelligence
# - Security-related prompts should load security modules
# - Architecture prompts should load architecture modules
# - Python prompts should load Python tech stack modules

# Performance testing
# - Large transcript files (>1MB)
# - Multiple concurrent hook executions
# - Hook timeout scenarios
```

## Final Validation Checklist

### Base Project Requirements
- [ ] All tests pass: `uv run pytest tests/test_claude_md_generation.py -v`
- [ ] No import errors: `python -c "from prp_framework.installation.project_initializer import ProjectInitializer"`
- [ ] Hook executes without errors: `echo '{"session_id": "test", "transcript_path": "test.jsonl", "tool_name": "Test"}' | uv run --script .claude/hooks/pre_tool_dynamic_context.py`
- [ ] CLI command works: `code-agent slash /claude-md:generate`
- [ ] Session management allows re-processing when appropriate
- [ ] User prompt detection works with various message formats
- [ ] Error handling gracefully falls back to static CLAUDE.md
- [ ] Logs are informative for debugging
- [ ] Dynamic CLAUDE.md is generated with appropriate modules
- [ ] Performance is acceptable (hook completes within 10 seconds)

### CLI Tool Integration Requirements
- [ ] CLI tool CLAUDE.md commands work: `code-agent slash /claude-md:modules`
- [ ] ResourceManager dynamic deployment works: Test `deploy_dynamic_claude_md()`
- [ ] Hook manager integration works: Test `register_claude_md_hooks()`
- [ ] Slash command routing includes claude-md: Test `/claude-md:*` commands
- [ ] Module loading from CLI context: Test `src/test_final/docs/modules/` access
- [ ] Project-specific CLAUDE.md generation: Test `get_claude_md_path()` usage
- [ ] CLI tool generates different content than base project
- [ ] Context detection works for both base and CLI scenarios
- [ ] Fallback mechanisms work in CLI tool context
- [ ] No regression in existing CLI tool functionality

---

## Anti-Patterns to Avoid

- ❌ Don't make session management too permissive (avoid infinite loops)
- ❌ Don't ignore JSON parsing errors (they contain debugging info)
- ❌ Don't remove existing fallback mechanisms (maintain backwards compatibility)
- ❌ Don't hardcode file paths (use Path objects and make configurable)
- ❌ Don't block hook execution with synchronous operations
- ❌ Don't skip error logging (essential for debugging)
- ❌ Don't modify existing hook signatures (maintain compatibility)
- ❌ Don't assume transcript format consistency (handle various formats)

## Quality Score: 9/10

**Confidence Level**: Very High - This PRP provides comprehensive context, detailed implementation guidance, and robust validation gates. The research-backed approach with specific code patterns and error handling strategies should enable successful one-pass implementation.

**Risk Mitigation**: Extensive fallback mechanisms, comprehensive error handling, and validation loops ensure system stability even during implementation iterations.
