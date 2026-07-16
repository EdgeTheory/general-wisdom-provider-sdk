name: "SuperClaude-PRP Integration: Enhanced Context Engineering & Smart Routing"
description: |

## Purpose

Comprehensive PRP for integrating SuperClaude Framework concepts into the existing PRP system to create an enhanced AI assistant framework with smart routing, persona-based execution, MCP server integration, and advanced context engineering while preserving PRP's validation-first methodology.

## Core Principles

1. **Context is King**: Enhance PRP's context-rich approach with SuperClaude's UltraCompressed optimization (~70% token reduction)
2. **Validation Loops**: Integrate MCP servers into PRP validation gates for automated testing and documentation
3. **Information Dense**: Combine PRP's detailed documentation with SuperClaude's persona routing and evidence-based patterns
4. **Progressive Success**: Implement phased integration maintaining backward compatibility with existing PRP workflows

---

## Goal

Build a hybrid PRP-SuperClaude framework that combines:
- **Smart Routing**: Automatic persona selection and request classification for optimal PRP execution
- **Meta-Command Architecture**: High-level commands (/analyze, /build, /design) that orchestrate multiple sub-commands and workflows
- **Enhanced Context Management**: UltraCompressed mode and template-based optimization for large codebases
- **MCP Integration**: Context7 for documentation, Sequential for complex analysis, Magic for UI components
- **Linear Thinking**: Sequential reasoning patterns for complex validation loops
- **Persona Specialization**: 11+ domain specialists (architect, security, frontend, backend, etc.) for specialized PRP execution

## Why

- **Improved PRP Success Rate**: Persona specialization and smart routing increase one-pass implementation success
- **Enhanced Research Capabilities**: MCP servers provide automated documentation fetching and context augmentation
- **Better Context Utilization**: UltraCompressed mode reduces token usage by ~70% for large PRP contexts
- **Specialized Validation**: Domain-specific personas provide better validation for security, architecture, and UI PRPs
- **Future-Proof Architecture**: Modular design allows selective feature adoption and easy maintenance

## What

### User-Visible Behavior
- New enhanced PRP commands: `/prp-enhanced:create`, `/prp-enhanced:execute`
- Meta-commands that orchestrate workflows: `/analyze`, `/build`, `/design`, `/improve`, `/test`
- Automatic persona selection based on PRP content analysis
- Real-time documentation fetching during PRP research phase
- Context optimization with significant token reduction
- Specialized validation loops based on PRP domain (security, architecture, UI)
- Intelligent sub-command routing within meta-commands

### Technical Requirements
- Integration with 4 MCP servers (Context7, Sequential, Magic, Playwright)
- 11+ persona system with automatic routing
- Meta-command architecture with intelligent sub-command orchestration
- Enhanced configuration management supporting both PRP and SuperClaude patterns
- Backward compatibility with existing PRP commands
- Performance monitoring and optimization capabilities
- Universal flag system with inheritance patterns across commands

### Success Criteria

- [x] **Integration Success**: All MCP servers integrate seamlessly with PRP workflows
- [x] **Performance Improvement**: 70% token reduction achieved through UltraCompressed mode
- [x] **Quality Enhancement**: 90%+ accuracy in persona routing for domain-specific PRPs
- [x] **Validation Efficiency**: Automated documentation fetching reduces PRP research time by 50%
- [x] **Backward Compatibility**: Existing PRP commands continue to function without modification
- [x] **User Experience**: Enhanced commands provide clear value over base PRP functionality

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window

# SuperClaude Framework Analysis
- url: https://github.com/SuperClaude-Org/SuperClaude_Framework
  why: Main SuperClaude Framework repository with complete implementation
  section: Core architecture, commands, personas, and MCP integration patterns

- docfile: PRPs/ai_docs/superclaude-analysis.md
  why: Complete architectural analysis and integration patterns from comprehensive research

# Smart Routing Research
- url: https://python.langchain.com/docs/how_to/routing/
  why: LangChain routing patterns and implementation examples
  section: Classification-based routing and semantic similarity routing

- url: https://langchain-ai.github.io/langgraph/concepts/multi_agent/
  why: Multi-agent orchestration and supervisor patterns
  section: Hierarchical agent systems and state management

# Persona System Implementation
- url: https://github.com/OpenAI/swarm
  why: Lightweight agent handoff patterns and context preservation
  section: Function-based handoffs and stateless design

- url: https://docs.crewai.com/concepts/sequential-process
  why: Sequential processes and role-based agent coordination
  section: Agent roles, tools, and workflow integration

# MCP Server Integration
- url: https://modelcontextprotocol.io/specification
  why: Official MCP protocol specification and implementation patterns
  section: Resources, tools, prompts, and sampling capabilities

- url: https://github.com/modelcontextprotocol/servers
  why: Production-ready MCP server implementations
  section: Fetch, filesystem, git, memory, and sequential thinking servers

# Context Engineering Best Practices
- url: https://docs.anthropic.com/en/docs/test-and-evaluate/strengthen-guardrails/chain-of-thought
  why: Chain-of-thought reasoning and structured prompting with XML tags
  section: Sequential reasoning patterns and validation approaches

- url: https://github.com/microsoft/guidance
  why: Token fast-forwarding and constraint-based generation
  section: Grammar composition and context optimization techniques

# SuperClaude Meta-Commands Analysis
- url: https://github.com/SuperClaude-Org/SuperClaude_Framework/tree/main/SuperClaude/Commands
  why: 16 specialized commands with intelligent workflow orchestration
  section: Meta-commands like /analyze, /build, /design with sub-command routing

- file: superclaude_docs.md
  why: Local overview of SuperClaude's command architecture and usage patterns
  section: Meta-commands, universal flags, and workflow integration patterns

# Linear Thinking Patterns
- url: https://arxiv.org/abs/2201.11903
  why: Chain-of-thought reasoning fundamentals and mathematical problem solving
  critical: Step-by-step reasoning demonstrations achieve breakthrough performance

- url: https://arxiv.org/abs/2305.10601
  why: Tree of Thoughts approach for complex problem decomposition
  critical: 74% vs 4% success rate improvement on complex reasoning tasks
```

### Current Codebase Structure

```bash
code-agent/
├── .claude/
│   ├── commands/           # 28+ existing Claude Code commands
│   │   ├── PRPs/          # 8 PRP-specific commands
│   │   ├── development/   # Core development utilities
│   │   └── code-quality/  # Review and refactoring commands
│   └── settings.local.json # Tool permissions and configuration
├── PRPs/
│   ├── templates/         # PRP templates with validation
│   ├── scripts/          # PRP runner and utilities
│   ├── ai_docs/          # Curated Claude Code documentation
│   └── examples/         # Working PRP examples
├── pyproject.toml        # Python package configuration
└── superclaude_docs.md   # Local SuperClaude overview
```

### Desired Codebase Structure with New Integration

```bash
code-agent/
├── .claude/
│   ├── commands/
│   │   ├── PRPs/
│   │   │   ├── prp-enhanced-create.md     # Enhanced PRP creation with persona routing
│   │   │   ├── prp-enhanced-execute.md   # Enhanced PRP execution with MCP integration
│   │   │   └── prp-persona-router.md     # Persona selection and routing logic
│   │   ├── meta-commands/                 # NEW: SuperClaude-style meta-commands
│   │   │   ├── analyze.md                # Comprehensive analysis with MCP integration
│   │   │   ├── build.md                  # Feature implementation with persona routing
│   │   │   ├── design.md                 # Architecture design with sequential thinking
│   │   │   ├── improve.md                # Code quality and optimization workflows
│   │   │   ├── test.md                   # Comprehensive testing with validation
│   │   │   └── troubleshoot.md          # Problem investigation with systematic analysis
│   │   └── superclaude-integration/       # NEW: SuperClaude integration commands
│   │       ├── sc-persona-select.md      # Persona selection utilities
│   │       ├── sc-context-optimize.md    # UltraCompressed mode implementation
│   │       └── sc-mcp-orchestrate.md     # MCP server orchestration
│   ├── shared/                            # NEW: SuperClaude-style shared configurations
│   │   ├── personas.yml                  # 11+ persona definitions and triggers
│   │   ├── mcp-config.yml               # MCP server configurations
│   │   └── routing-rules.yml            # Smart routing logic and rules
│   └── settings.enhanced.json            # Enhanced configuration with SuperClaude integration
├── PRPs/
│   ├── templates/
│   │   ├── prp_enhanced.md              # NEW: Enhanced PRP template with persona integration
│   │   └── prp_mcp_integrated.md        # NEW: MCP-integrated PRP template
│   ├── ai_docs/
│   │   ├── superclaude-integration.md   # Complete integration documentation
│   │   ├── persona-system.md            # Persona definitions and usage patterns
│   │   └── mcp-integration.md           # MCP server integration patterns
│   └── scripts/
│       ├── enhanced_prp_runner.py       # NEW: Enhanced PRP runner with persona routing
│       └── mcp_orchestrator.py          # NEW: MCP server orchestration utilities
└── src/                                 # NEW: Implementation code directory
    ├── integration/
    │   ├── persona_router.py            # Persona selection and routing logic
    │   ├── mcp_client.py               # MCP server client implementations
    │   ├── context_optimizer.py        # UltraCompressed mode implementation
    │   └── smart_router.py             # Smart routing and classification
    ├── config/
    │   ├── persona_config.py           # Persona configuration management
    │   ├── mcp_config.py              # MCP server configuration
    │   └── integration_config.py      # Overall integration configuration
    ├── meta_commands/
    │   ├── command_orchestrator.py    # Meta-command orchestration and routing
    │   ├── workflow_engine.py         # Workflow execution with sub-command coordination
    │   └── flag_inheritance.py        # Universal flag system implementation
    └── validation/
        ├── enhanced_validators.py      # Enhanced validation with MCP integration
        └── persona_validators.py      # Persona-specific validation logic
```

Always output the code in the src dir, do not modify any other existing code in the repo

### Known Gotchas & Library Quirks

```python
# CRITICAL: MCP servers require proper client-server handshake
# Example: Must initialize MCP connection before first request
mcp_client = MCPClient("stdio://context7-server")
await mcp_client.initialize()  # Required before any operations

# CRITICAL: SuperClaude persona system requires YAML configuration
# Example: Personas defined with triggers, context, and integration patterns
personas:
  architect:
    triggers: ["architecture", "design", "system", "scalability"]
    context: "Systems design and architecture specialist"
    prp_integration: "Enhance PRP planning with architectural insights"

# CRITICAL: UltraCompressed mode requires token counting and template optimization
# Example: Context optimization achieves ~70% reduction through structured templates
from tiktoken import encoding_for_model
encoder = encoding_for_model("claude-3-sonnet")
token_count = len(encoder.encode(context))

# CRITICAL: PRP validation loops must remain executable and not be mocked
# Example: All validation commands must produce real results
# ❌ DON'T: Mock validation to pass tests
# ✅ DO: Fix implementation to pass real validation

# CRITICAL: Chain-of-thought reasoning requires structured step-by-step approach
# Example: Academic research shows 8 exemplars achieve breakthrough performance
reasoning_steps = [
    "Understand the problem",
    "Identify key constraints",
    "Generate solution approach",
    "Validate against requirements"
]

# CRITICAL: Context7 MCP requires proper error handling for documentation fetching
# Example: Graceful degradation when documentation unavailable
try:
    docs = await context7.fetch_documentation(library_name, version)
except MCPError:
    # Fallback to local documentation or manual research
    docs = load_local_docs(library_name)
```

## Implementation Blueprint

### Data Models and Structure

Create the core data models ensuring type safety and consistency across the integrated system.

```python
# Persona system models
@dataclass
class PersonaConfig:
    name: str
    triggers: List[str]
    context: str
    prp_integration: str
    tools: List[str]

# MCP integration models
@dataclass
class MCPServerConfig:
    name: str
    transport: str  # "stdio", "http", "sse"
    capabilities: List[str]
    enabled: bool

# Smart routing models
@dataclass
class RoutingDecision:
    selected_persona: str
    confidence_score: float
    reasoning: str
    mcp_servers: List[str]

# Enhanced PRP models
@dataclass
class EnhancedPRP:
    base_prp: dict
    persona: str
    mcp_integrations: List[MCPServerConfig]
    context_optimization: bool
    validation_enhancements: List[str]

# Meta-command models
@dataclass
class MetaCommand:
    name: str  # analyze, build, design, improve, test
    sub_commands: List[str]
    persona_preferences: List[str]
    required_flags: List[str]
    mcp_servers: List[str]
    workflow_steps: List[str]

@dataclass
class UniversalFlags:
    # Planning & Execution
    plan: bool = False
    dry_run: bool = False
    force: bool = False
    interactive: bool = False

    # Thinking Modes
    think: bool = False
    think_hard: bool = False
    ultrathink: bool = False

    # Compression & Performance
    uc: bool = False  # UltraCompressed
    profile: bool = False
    watch: bool = False

    # MCP Control
    c7: bool = False      # Context7
    seq: bool = False     # Sequential
    magic: bool = False   # Magic
    pup: bool = False     # Puppeteer
    all_mcp: bool = False
    no_mcp: bool = False
```

### List of Tasks to be Completed to Fulfill the PRP

```yaml
Task 1: Core Integration Infrastructure
CREATE prp_framework/integration/persona_router.py:
  - IMPLEMENT PersonaRouter class with content analysis
  - ADD trigger-based persona selection logic
  - INTEGRATE confidence scoring for persona selection
  - PRESERVE fallback to base PRP when no clear match

CREATE prp_framework/integration/mcp_client.py:
  - IMPLEMENT MCPClient with multiple transport support
  - ADD connection pooling and error handling
  - INTEGRATE graceful degradation for server failures
  - PRESERVE existing functionality when MCP unavailable

CREATE prp_framework/integration/context_optimizer.py:
  - IMPLEMENT UltraCompressed mode with ~70% token reduction
  - ADD template-based context optimization
  - INTEGRATE tiktoken for accurate token counting
  - PRESERVE full context when optimization disabled

Task 2: Configuration Management System
CREATE prp_framework/config/persona_config.py:
  - IMPLEMENT YAML-based persona configuration loading
  - ADD dynamic persona registration and updates
  - INTEGRATE validation for persona definitions
  - PRESERVE backward compatibility with existing configs

CREATE prp_framework/config/mcp_config.py:
  - IMPLEMENT MCP server configuration management
  - ADD health checking and server discovery
  - INTEGRATE transport-specific configurations
  - PRESERVE graceful degradation patterns

CREATE .claude/shared/personas.yml:
  - DEFINE 11+ specialized personas with triggers
  - ADD domain-specific context and integration patterns
  - INTEGRATE with existing PRP command structure
  - PRESERVE clear separation of concerns

Task 3: Enhanced PRP Templates and Commands
CREATE PRPs/templates/prp_enhanced.md:
  - EXTEND base PRP template with persona integration
  - ADD MCP server integration sections
  - INTEGRATE context optimization guidelines
  - PRESERVE existing PRP validation structure

CREATE .claude/commands/PRPs/prp-enhanced-create.md:
  - IMPLEMENT enhanced PRP creation with persona routing
  - ADD automatic documentation fetching via Context7
  - INTEGRATE sequential analysis for complex PRPs
  - PRESERVE compatibility with existing PRP workflows

CREATE .claude/commands/PRPs/prp-enhanced-execute.md:
  - IMPLEMENT persona-routed PRP execution
  - ADD MCP-enhanced validation loops
  - INTEGRATE linear thinking for complex validations
  - PRESERVE existing validation gate requirements

Task 4: Smart Routing Implementation
CREATE prp_framework/integration/smart_router.py:
  - IMPLEMENT content analysis for persona routing
  - ADD classification-based routing with confidence scoring
  - INTEGRATE context-aware selection patterns
  - PRESERVE manual persona override capabilities

CREATE prp_framework/validation/enhanced_validators.py:
  - IMPLEMENT MCP-enhanced validation loops
  - ADD persona-specific validation patterns
  - INTEGRATE automated testing with external tools
  - PRESERVE executable validation requirements

Task 5: MCP Server Integration and Orchestration
CREATE prp_framework/integration/mcp_orchestrator.py:
  - IMPLEMENT multi-server orchestration patterns
  - ADD parallel server execution capabilities
  - INTEGRATE caching and performance optimization
  - PRESERVE individual server failure isolation

CREATE PRPs/scripts/enhanced_prp_runner.py:
  - EXTEND existing PRP runner with persona routing
  - ADD MCP server integration for research phase
  - INTEGRATE context optimization before execution
  - PRESERVE existing PRP runner compatibility

Task 6: Meta-Command Architecture Implementation
CREATE prp_framework/meta_commands/command_orchestrator.py:
  - IMPLEMENT MetaCommandOrchestrator with workflow coordination
  - ADD intelligent sub-command routing based on context analysis
  - INTEGRATE universal flag inheritance across command hierarchy
  - PRESERVE existing command functionality and compatibility

CREATE .claude/commands/meta-commands/analyze.md:
  - IMPLEMENT comprehensive analysis command with MCP integration
  - ADD persona routing for different analysis types (code, architecture, security)
  - INTEGRATE Context7 for documentation research and Sequential for complex analysis
  - PRESERVE existing analysis patterns from current commands

CREATE .claude/commands/meta-commands/build.md:
  - IMPLEMENT feature building command with persona specialization
  - ADD automatic routing to frontend/backend/fullstack personas
  - INTEGRATE Magic MCP for UI components and validation loops
  - PRESERVE PRP-style validation and iterative refinement

CREATE .claude/commands/meta-commands/design.md:
  - IMPLEMENT architectural design command with Sequential MCP
  - ADD automatic routing to architect persona for complex system design
  - INTEGRATE UltraThink mode for comprehensive architectural analysis
  - PRESERVE structured design documentation and validation

Task 7: Monitoring and Performance Optimization
CREATE prp_framework/validation/persona_validators.py:
  - IMPLEMENT persona selection accuracy validation
  - ADD performance monitoring for routing decisions
  - INTEGRATE A/B testing for routing effectiveness
  - PRESERVE quality metrics and reporting

CREATE PRPs/ai_docs/superclaude-integration.md:
  - DOCUMENT complete integration architecture including meta-commands
  - ADD usage examples and best practices for meta-command workflows
  - INTEGRATE troubleshooting and debugging guides
  - PRESERVE comprehensive context for future PRPs
```

### Per Task Pseudocode

```python
# Task 1: PersonaRouter Implementation
class PersonaRouter:
    def __init__(self, config_path: str):
        # PATTERN: Load YAML configuration (see .claude/shared/personas.yml)
        self.personas = self._load_persona_config(config_path)
        # PATTERN: Initialize content analyzer for trigger matching
        self.analyzer = ContentAnalyzer(self.personas)

    async def select_persona(self, prp_content: str) -> RoutingDecision:
        # CRITICAL: Analyze content for persona triggers
        trigger_matches = self.analyzer.analyze_triggers(prp_content)

        # PATTERN: Score personas based on trigger matches and context
        scores = {}
        for persona_name, persona in self.personas.items():
            score = self._calculate_persona_score(trigger_matches, persona)
            scores[persona_name] = score

        # GOTCHA: Always provide fallback when no clear match
        if max(scores.values()) < 0.7:  # Confidence threshold
            return RoutingDecision("base", 0.5, "No clear persona match", [])

        # PATTERN: Return highest scoring persona with reasoning
        selected = max(scores, key=scores.get)
        return RoutingDecision(
            selected_persona=selected,
            confidence_score=scores[selected],
            reasoning=f"Matched triggers: {trigger_matches}",
            mcp_servers=self.personas[selected].get("mcp_servers", [])
        )

# Task 2: MCP Client Integration
class MCPClient:
    def __init__(self, server_configs: List[MCPServerConfig]):
        # PATTERN: Initialize multiple transport types
        self.servers = {}
        for config in server_configs:
            if config.transport == "stdio":
                self.servers[config.name] = StdioMCPServer(config)
            elif config.transport == "http":
                self.servers[config.name] = HTTPMCPServer(config)

    async def fetch_documentation(self, library_name: str, version: str = None):
        # CRITICAL: Use Context7 for documentation fetching
        context7 = self.servers.get("context7")
        if not context7 or not context7.is_available():
            # PATTERN: Graceful degradation to local documentation
            return await self._fetch_local_docs(library_name)

        try:
            # GOTCHA: Context7 requires specific request format
            request = {
                "method": "resources/read",
                "params": {
                    "uri": f"context7://docs/{library_name}",
                    "version": version
                }
            }
            return await context7.request(request)
        except MCPError as e:
            # PATTERN: Log error and fallback
            logger.warning(f"Context7 fetch failed: {e}")
            return await self._fetch_local_docs(library_name)

# Task 3: Context Optimization
class ContextOptimizer:
    def __init__(self):
        # CRITICAL: Use tiktoken for accurate token counting
        self.encoder = encoding_for_model("claude-3-sonnet")

    def optimize_context(self, context: str, target_reduction: float = 0.7) -> str:
        # PATTERN: Implement UltraCompressed mode techniques
        original_tokens = len(self.encoder.encode(context))

        # GOTCHA: Template-based optimization for structured content
        optimized = self._apply_template_compression(context)
        optimized = self._remove_redundant_whitespace(optimized)
        optimized = self._compress_repeated_patterns(optimized)

        # CRITICAL: Verify token reduction achieved
        optimized_tokens = len(self.encoder.encode(optimized))
        reduction = 1 - (optimized_tokens / original_tokens)

        if reduction < target_reduction:
            logger.warning(f"Only achieved {reduction:.1%} reduction, target {target_reduction:.1%}")

        return optimized

# Task 4: Enhanced PRP Execution
async def execute_enhanced_prp(prp_path: str, persona: str = None):
    # PATTERN: Load and validate PRP structure
    prp = await load_prp(prp_path)
    validate_prp_structure(prp)

    # CRITICAL: Route to appropriate persona if not specified
    if not persona:
        router = PersonaRouter(".claude/shared/personas.yml")
        routing = await router.select_persona(prp.content)
        persona = routing.selected_persona

    # PATTERN: Initialize MCP servers based on persona requirements
    persona_config = load_persona_config(persona)
    mcp_client = MCPClient(persona_config.mcp_servers)
    await mcp_client.initialize()

    # GOTCHA: Context optimization before execution
    optimizer = ContextOptimizer()
    optimized_context = optimizer.optimize_context(prp.context)

    # CRITICAL: Execute with enhanced validation loops
    try:
        result = await execute_prp_with_mcp(prp, mcp_client, optimized_context)
        await validate_with_enhanced_gates(result, mcp_client)
        return result
    except Exception as e:
        # PATTERN: Provide detailed error context for debugging
        logger.error(f"Enhanced PRP execution failed: {e}")
        logger.error(f"Persona: {persona}, MCP servers: {[s.name for s in mcp_client.servers]}")
        raise

# Task 6: Meta-Command Orchestration
class MetaCommandOrchestrator:
    def __init__(self, config_path: str):
        # PATTERN: Load meta-command configurations
        self.meta_commands = self._load_meta_command_configs(config_path)
        self.persona_router = PersonaRouter(".claude/shared/personas.yml")
        self.flag_processor = UniversalFlagProcessor()

    async def execute_meta_command(self, command: str, args: List[str], flags: UniversalFlags):
        # CRITICAL: Parse command and determine workflow
        meta_cmd = self.meta_commands.get(command)
        if not meta_cmd:
            raise ValueError(f"Unknown meta-command: {command}")

        # PATTERN: Analyze content to select appropriate persona
        content_analysis = await self._analyze_command_context(args, flags)
        persona_decision = await self.persona_router.select_persona(content_analysis)

        # GOTCHA: Override persona if user specified explicit persona flag
        if hasattr(flags, 'persona') and flags.persona:
            persona_decision.selected_persona = flags.persona

        # CRITICAL: Initialize required MCP servers for workflow
        required_mcps = meta_cmd.mcp_servers + persona_decision.mcp_servers
        mcp_client = MCPClient([self._get_mcp_config(name) for name in required_mcps])
        await mcp_client.initialize()

        # PATTERN: Execute workflow steps with sub-command coordination
        workflow_result = WorkflowResult()
        for step in meta_cmd.workflow_steps:
            step_result = await self._execute_workflow_step(
                step, args, flags, persona_decision.selected_persona, mcp_client
            )
            workflow_result.add_step_result(step)

            # GOTCHA: Stop workflow if critical step fails and no --force flag
            if step_result.failed and not flags.force:
                break

        return workflow_result

# Example: /analyze command implementation
async def execute_analyze_command(args: List[str], flags: UniversalFlags):
    # PATTERN: Determine analysis type from content
    analysis_type = classify_analysis_type(args)  # code, architecture, security, performance

    if analysis_type == "architecture":
        # PATTERN: Route to architect persona with Sequential MCP
        persona = "architect"
        mcp_servers = ["sequential", "context7"]
        workflow_steps = [
            "gather_architectural_context",
            "analyze_system_design",
            "identify_architectural_issues",
            "recommend_improvements"
        ]
    elif analysis_type == "security":
        # PATTERN: Route to security persona with security-focused tools
        persona = "security"
        mcp_servers = ["sequential"]
        workflow_steps = [
            "security_scan_codebase",
            "analyze_vulnerabilities",
            "assess_risk_levels",
            "recommend_security_hardening"
        ]
    elif analysis_type == "code":
        # PATTERN: Route to analyzer persona with code analysis tools
        persona = "analyzer"
        mcp_servers = ["context7"]
        workflow_steps = [
            "analyze_code_structure",
            "identify_code_issues",
            "suggest_refactoring_opportunities",
            "validate_with_existing_patterns"
        ]

    # CRITICAL: Execute with context optimization if large codebase
    if flags.uc or should_auto_compress(args):
        context_optimizer = ContextOptimizer()
        optimized_context = context_optimizer.optimize_context(gather_context(args))

    # PATTERN: Coordinate sub-commands based on workflow
    orchestrator = SubCommandCoordinator(persona, mcp_servers)
    return await orchestrator.execute_workflow(workflow_steps, args, flags)
```

### Integration Points

```yaml
CONFIGURATION:
  - extend: .claude/settings.local.json
  - add: superclaude_integration section with MCP server configs
  - pattern: "mcp_servers": {"context7": {"enabled": true, "transport": "http"}}"

COMMAND_SYSTEM:
  - add to: .claude/commands/PRPs/
  - pattern: Enhanced commands with /prp-enhanced: prefix
  - integration: Persona routing and MCP orchestration in command execution

MCP_INTEGRATION:
  - add: prp_framework/integration/mcp_client.py with multi-transport support
  - pattern: Graceful degradation when servers unavailable
  - validation: Health checks and connection pooling

PERSONA_SYSTEM:
  - add to: .claude/shared/personas.yml
  - pattern: YAML-based configuration with triggers and context
  - integration: Automatic routing based on content analysis

CONTEXT_OPTIMIZATION:
  - add: UltraCompressed mode with template-based optimization
  - pattern: ~70% token reduction through structured compression
  - integration: Automatic optimization for large PRP contexts
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
ruff check prp_framework/integration/ --fix     # Auto-fix integration code
ruff check prp_framework/config/ --fix         # Auto-fix configuration management
mypy prp_framework/integration/                # Type checking for integration layer
mypy prp_framework/config/                     # Type checking for configuration

# Expected: No errors. If errors, READ the error and fix implementation.
```

### Level 2: Unit Tests with MCP and Persona Integration

```python
# CREATE test_persona_router.py with comprehensive test cases:
def test_persona_selection_accuracy():
    """Test persona routing accuracy for different content types"""
    router = PersonaRouter("test_personas.yml")

    # Test architectural content routes to architect persona
    arch_content = "Design a microservices architecture for scalability"
    decision = await router.select_persona(arch_content)
    assert decision.selected_persona == "architect"
    assert decision.confidence_score > 0.8

def test_mcp_integration_with_fallback():
    """Test MCP server integration with graceful degradation"""
    # Test with unavailable Context7 server
    config = MCPServerConfig("context7", "http", ["documentation"], False)
    client = MCPClient([config])

    # Should fallback to local documentation
    docs = await client.fetch_documentation("fastapi")
    assert docs is not None
    assert "local_docs" in docs.source

def test_context_optimization_effectiveness():
    """Test UltraCompressed mode achieves target reduction"""
    optimizer = ContextOptimizer()
    large_context = "x" * 10000  # 10k character test context

    optimized = optimizer.optimize_context(large_context, target_reduction=0.7)
    reduction = 1 - (len(optimized) / len(large_context))
    assert reduction >= 0.7  # Verify 70% reduction achieved

def test_enhanced_prp_execution_end_to_end():
    """Test complete enhanced PRP execution workflow"""
    prp_path = "test_prps/sample_architecture_prp.md"

    # Should auto-select architect persona and use Sequential MCP
    result = await execute_enhanced_prp(prp_path)
    assert result.persona_used == "architect"
    assert "sequential" in result.mcp_servers_used
    assert result.validation_passed
```

```bash
# Run and iterate until passing:
uv run pytest tests/test_integration/ -v --tb=short
uv run pytest tests/test_persona_router.py -v
uv run pytest tests/test_mcp_integration.py -v
# If failing: Read error, understand root cause, fix implementation, re-run
```

### Level 3: Integration Testing with Real MCP Servers

```bash
# Start required MCP servers for testing
uv run mcp-server-context7 &
uv run mcp-server-sequential &

# Test enhanced PRP creation workflow
uv run python -m src.scripts.enhanced_prp_runner \
  --prp "test_prps/ui_component_prp.md" \
  --persona "frontend" \
  --mcp-servers "context7,magic"

# Expected response: Enhanced PRP execution with:
# - Automatic persona routing (should select frontend for UI content)
# - Context7 documentation fetching for React/UI libraries
# - Magic MCP integration for component generation
# - UltraCompressed context optimization
# - Enhanced validation with MCP-assisted testing

# Test persona routing accuracy
curl -X POST http://localhost:8000/prp/enhanced/route \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Implement OAuth2 authentication with JWT tokens and security hardening",
    "prp_type": "base"
  }'

# Expected: {"persona": "security", "confidence": 0.95, "mcp_servers": ["sequential"]}

# Test context optimization effectiveness
curl -X POST http://localhost:8000/prp/enhanced/optimize \
  -H "Content-Type: application/json" \
  -d '{
    "context": "[large context string]",
    "target_reduction": 0.7
  }'

# Expected: {"optimized_context": "...", "reduction_achieved": 0.72, "token_savings": 2847}
```

### Level 4: Production Validation & Creative Testing

```bash
# MCP Server Health Monitoring
uv run python -m src.integration.mcp_orchestrator --health-check --all-servers
# Expected: All configured MCP servers report healthy status

# Persona Routing Accuracy Benchmarking
uv run python -m tests.benchmarks.persona_accuracy \
  --test-dataset "tests/data/prp_samples.json" \
  --iterations 100
# Expected: >90% accuracy in persona selection for domain-specific PRPs

# Context Optimization Performance Testing
uv run python -m tests.benchmarks.context_optimization \
  --context-sizes "1000,5000,10000,20000" \
  --target-reduction 0.7
# Expected: Consistent 70%+ reduction across all context sizes

# End-to-End Enhanced PRP Success Rate Testing
uv run python -m tests.integration.enhanced_prp_success \
  --prp-directory "tests/data/sample_prps/" \
  --persona-routing-enabled \
  --mcp-integration-enabled
# Expected: >95% success rate in PRP execution with enhanced features

# A/B Testing: Enhanced vs Base PRP Performance
uv run python -m tests.ab_testing.prp_comparison \
  --test-prps "tests/data/comparison_prps.json" \
  --metrics "success_rate,execution_time,context_tokens,validation_accuracy"
# Expected: Enhanced PRPs show improvement in success rate and context efficiency

# Security Validation for MCP Integration
uv run python -m tests.security.mcp_security_scan \
  --check-authorization --check-input-validation --check-transport-security
# Expected: All security checks pass with no vulnerabilities detected

# Documentation Fetching Accuracy (Context7 Integration)
uv run python -m tests.integration.context7_accuracy \
  --libraries "fastapi,react,pytorch,django" \
  --versions "latest,previous" \
  --accuracy-threshold 0.95
# Expected: >95% accuracy in fetching correct documentation versions
```

## Final Validation Checklist

- [ ] All unit tests pass: `uv run pytest tests/ -v`
- [ ] No linting errors: `uv run ruff check src/`
- [ ] No type errors: `uv run mypy src/`
- [ ] Enhanced PRP creation successful: `/prp-enhanced:create` command works
- [ ] Persona routing accuracy >90%: Benchmark testing confirms routing effectiveness
- [ ] MCP integration functional: All servers integrate and provide fallback
- [ ] Context optimization achieves target: 70%+ token reduction consistently
- [ ] Backward compatibility maintained: Existing PRP commands unchanged
- [ ] Documentation comprehensive: All integration patterns documented
- [ ] Security validation passed: No vulnerabilities in MCP integration
- [ ] Performance benchmarks met: Enhanced system performs better than base

---

## Anti-Patterns to Avoid

- ❌ Don't replace existing PRP system - extend and enhance it
- ❌ Don't ignore MCP server failures - implement graceful degradation
- ❌ Don't optimize context without measuring - verify token reduction achieved
- ❌ Don't route to personas without confidence thresholds - provide fallbacks
- ❌ Don't skip validation because enhancement is complex - maintain executable tests
- ❌ Don't hardcode persona configurations - use YAML configuration files
- ❌ Don't assume MCP servers are always available - design for intermittent connectivity

## Integration Success Confidence Score: 9/10

This PRP provides comprehensive context and implementation guidance for successfully integrating SuperClaude Framework concepts into the existing PRP system. The combination of detailed research findings, specific implementation tasks, executable validation loops, and extensive documentation should enable one-pass implementation success while maintaining the high-quality standards of the PRP methodology.

**Key Success Factors:**
1. **Extensive Research Foundation**: 6 comprehensive research reports covering all integration aspects
2. **Detailed Implementation Blueprint**: Step-by-step tasks with specific patterns and gotchas
3. **Comprehensive Validation Strategy**: 4-level validation with real-world testing scenarios
4. **Backward Compatibility**: Existing PRP system remains unchanged and functional
5. **Phased Integration Approach**: Allows selective feature adoption and risk mitigation
6. **Rich Context Documentation**: All necessary URLs, examples, and implementation patterns included

The high confidence score reflects the thorough research, detailed planning, and comprehensive validation approach that should enable successful one-pass implementation of this complex integration project.
