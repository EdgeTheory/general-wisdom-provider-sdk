# Modular CLAUDE.md System with Smart Detection

**Template Version:** 2.1
**Compatible with:** PRP Framework with Meta-Command Integration
**Features:** Modular documentation, smart detection, dynamic inclusion, project-specific customization

---

## Goal

**Primary Objective:** Create a modular CLAUDE.md system that automatically combines multiple focused documentation files based on project detection and user needs, inspired by SuperClaude Framework's Core structure.

**Enhanced Goal Elements:**
- **Modular Architecture**: Replace monolithic CLAUDE.md with focused, single-purpose documentation files
- **Smart Detection**: Automatically detect project type, tech stack, and framework usage to include relevant docs
- **Dynamic Composition**: Intelligently combine documentation modules based on context
- **Maintenance Efficiency**: Enable independent updates to specific aspects without touching the entire CLAUDE.md

## Why

**Business Value:**
- Reduces documentation maintenance burden through modular approach
- Improves AI assistant accuracy by providing only relevant context
- Enables project-specific customization without manual editing
- Scales better for complex multi-framework projects

**Technical Motivation:**
- Current monolithic CLAUDE.md becomes unwieldy as framework grows
- Manual updates are error-prone and time-consuming
- Different projects need different subsets of framework capabilities
- Token efficiency through context relevance improves AI performance

**Enhanced Integration Benefits:**
- **Persona Specialization**: Different documentation modules for different domain experts
- **MCP Integration**: Dynamic documentation fetching based on available MCP servers
- **Context Optimization**: Only include relevant documentation to reduce token usage

## What

### User-Visible Behavior

**New Command Structure:**
```bash
/claude-md:generate          # Generate CLAUDE.md from detected modules
/claude-md:sync             # Sync CLAUDE.md with current project state
/claude-md:modules          # List available documentation modules
/claude-md:preview          # Preview what would be included
/claude-md:customize        # Interactive customization of included modules
```

**Smart Detection Features:**
- Automatic detection of programming languages, frameworks, and tools
- MCP server availability detection
- Project complexity analysis
- Custom module inclusion based on .claude/config

**Enhanced User Experience:**
- Project-specific CLAUDE.md that only includes relevant information
- Automatic updates when project structure changes
- Clear module boundaries for easier understanding and maintenance

### Technical Requirements

**Core Architecture:**
- Modular documentation system with single-purpose files
- Smart detection engine analyzing project structure
- Dynamic composition engine combining relevant modules
- Configuration system for manual overrides

**Module Structure:**
```
.claude/docs/
├── core/
│   ├── FRAMEWORK.md        # Core PRP framework principles
│   ├── COMMANDS.md         # Available commands reference
│   ├── VALIDATION.md       # Validation patterns and gates
│   └── WORKFLOWS.md        # Standard workflows and patterns
├── personas/
│   ├── ARCHITECT.md        # Architecture-focused guidance
│   ├── SECURITY.md         # Security-focused patterns
│   ├── FRONTEND.md         # Frontend development patterns
│   └── BACKEND.md          # Backend development patterns
├── mcps/
│   ├── CONTEXT7.md         # Context7 MCP server usage
│   ├── SEQUENTIAL.md       # Sequential analysis patterns
│   └── MAGIC.md           # Magic UI component generation
├── tech-stacks/
│   ├── PYTHON.md          # Python-specific patterns
│   ├── JAVASCRIPT.md      # JavaScript/Node.js patterns
│   ├── DOCKER.md          # Docker and containerization
│   └── TERRAFORM.md       # Infrastructure as code
└── project-types/
    ├── API.md             # API development patterns
    ├── FRONTEND-APP.md    # Frontend application development
    ├── CLI-TOOL.md        # Command-line tool development
    └── MICROSERVICE.md    # Microservice development patterns
```

### Success Criteria

**Base Success Criteria:**
- [ ] Modular documentation system with 15+ focused modules
- [ ] Smart detection correctly identifies 90%+ of project characteristics
- [ ] Dynamic composition generates relevant CLAUDE.md in <5 seconds
- [ ] Backward compatibility with existing CLAUDE.md workflows

**Enhanced Success Criteria:**
- [ ] **Token Efficiency**: Generated CLAUDE.md uses 40-60% fewer tokens while maintaining completeness
- [ ] **Accuracy Improvement**: AI performance improves due to more relevant context
- [ ] **Maintenance Reduction**: Individual module updates don't require full CLAUDE.md review
- [ ] **Customization Success**: Users can easily customize included modules per project

## All Needed Context

### Core Documentation & References

```yaml
# ESSENTIAL CONTEXT - SuperClaude Framework Analysis
required_reading:
  - url: https://github.com/SuperClaude-Org/SuperClaude_Framework/tree/master/SuperClaude/Core
    why: Reference implementation of modular documentation architecture
    section: File organization, naming conventions, separation of concerns

# SMART DETECTION RESEARCH
persona_context:
  - persona: "architect"
    additional_context:
      - url: https://docs.python.org/3/library/ast.html
        why: AST parsing for code analysis and project structure detection
      - url: https://github.com/github/linguist
        why: Language detection algorithms and file type identification

# MCP-ENHANCED CONTEXT
mcp_enhanced_context:
  - server: context7
    research_queries:
      - "project structure analysis tools"
      - "documentation generation best practices"
  - server: sequential
    analysis_requirements:
      - "multi-step project analysis workflow"
      - "conditional documentation inclusion logic"
```

### Current Codebase Structure

```bash
# Current structure that needs modularization
code-agent/
├── CLAUDE.md                    # Current monolithic file (216 lines)
├── .claude/
│   ├── commands/               # Command definitions that need docs
│   └── settings.local.json     # Configuration for MCP servers
├── PRPs/
│   ├── templates/              # PRP templates needing documentation
│   └── scripts/               # Execution scripts needing explanation
└── prp_framework/             # Framework components needing docs
```

### Enhanced Integration Points

```yaml
# Integration with existing PRP framework
integration_requirements:
  persona_triggers:
    - "documentation": "Generate persona-specific doc modules"
    - "architecture": "Include architecture decision records"
    - "security": "Include security-focused documentation"
  mcp_capabilities_needed:
    - documentation: "Fetch best practices for detected tech stacks"
    - analysis: "Analyze project complexity and recommend modules"
    - generation: "Generate project-specific documentation"
  context_compression_safe: true
```

### Smart Detection Patterns

```python
# DETECTION ALGORITHMS - Core patterns for project analysis

# Language Detection
def detect_languages(project_path: Path) -> Dict[str, float]:
    """Detect programming languages and their usage percentages."""
    language_patterns = {
        "python": [".py", "requirements.txt", "pyproject.toml", "setup.py"],
        "javascript": [".js", ".jsx", ".ts", ".tsx", "package.json"],
        "terraform": [".tf", ".tfvars", "terraform.tfstate"],
        "docker": ["Dockerfile", "docker-compose.yml", ".dockerignore"]
    }
    # Implementation details...

# Framework Detection
def detect_frameworks(project_path: Path) -> List[str]:
    """Detect frameworks and tools in use."""
    framework_indicators = {
        "fastapi": ["from fastapi", "FastAPI()", "uvicorn"],
        "react": ["react", "jsx", "create-react-app"],
        "terraform": [".tf files", "terraform init"],
        "docker": ["Dockerfile", "docker-compose"]
    }
    # Implementation details...

# MCP Server Detection
def detect_available_mcps() -> List[str]:
    """Detect which MCP servers are configured and available."""
    config_path = Path(".claude/settings.local.json")
    if config_path.exists():
        # Parse configuration and check server availability
        pass
    return []

# Project Type Classification
def classify_project_type(project_path: Path) -> str:
    """Classify the type of project for template selection."""
    type_indicators = {
        "api": ["routes/", "endpoints/", "swagger", "openapi"],
        "frontend-app": ["src/components/", "public/", "index.html"],
        "cli-tool": ["click", "argparse", "typer", "__main__.py"],
        "microservice": ["docker-compose", "kubernetes/", "helm/"]
    }
    # Implementation details...
```

## Implementation Blueprint

### Enhanced Implementation Strategy

**Phase 1: Module Structure Creation**
1. **Documentation Audit**: Analyze current CLAUDE.md and identify distinct sections
2. **Module Definition**: Create focused documentation modules based on SuperClaude pattern
3. **Template Creation**: Build templates for each module type

**Phase 2: Smart Detection Engine**
```python
# SMART DETECTION IMPLEMENTATION
class ProjectAnalyzer:
    """Analyze project structure and recommend documentation modules."""

    def __init__(self, project_path: Path):
        self.project_path = project_path
        self.detected_languages = {}
        self.detected_frameworks = []
        self.detected_mcps = []
        self.project_type = ""

    async def analyze_project(self) -> ProjectAnalysis:
        """Perform comprehensive project analysis."""
        # Step 1: Language detection
        self.detected_languages = await self.detect_languages()

        # Step 2: Framework detection
        self.detected_frameworks = await self.detect_frameworks()

        # Step 3: MCP server availability
        self.detected_mcps = await self.detect_available_mcps()

        # Step 4: Project type classification
        self.project_type = await self.classify_project_type()

        return ProjectAnalysis(
            languages=self.detected_languages,
            frameworks=self.detected_frameworks,
            mcps=self.detected_mcps,
            project_type=self.project_type
        )

    def recommend_modules(self, analysis: ProjectAnalysis) -> List[str]:
        """Recommend documentation modules based on analysis."""
        modules = ["FRAMEWORK.md", "COMMANDS.md"]  # Always include core

        # Add language-specific modules
        for lang in analysis.languages:
            if lang.upper() + ".md" in available_modules:
                modules.append(f"tech-stacks/{lang.upper()}.md")

        # Add framework-specific modules
        for framework in analysis.frameworks:
            if framework.upper() + ".md" in available_modules:
                modules.append(f"tech-stacks/{framework.upper()}.md")

        # Add MCP-specific modules
        for mcp in analysis.mcps:
            modules.append(f"mcps/{mcp.upper()}.md")

        # Add project-type specific module
        modules.append(f"project-types/{analysis.project_type.upper()}.md")

        return modules
```

**Phase 3: Dynamic Composition Engine**
```python
# COMPOSITION ENGINE IMPLEMENTATION
class CLAUDEMDComposer:
    """Compose CLAUDE.md from selected modules."""

    def __init__(self, modules_dir: Path):
        self.modules_dir = modules_dir
        self.template_engine = Jinja2Environment()

    async def compose_claude_md(self, selected_modules: List[str]) -> str:
        """Compose CLAUDE.md from selected modules."""
        composed_content = []

        # Add header
        composed_content.append(self.generate_header())

        # Add each selected module
        for module_path in selected_modules:
            module_content = await self.load_module(module_path)
            composed_content.append(module_content)

        # Add footer with generation metadata
        composed_content.append(self.generate_footer(selected_modules))

        return "\n\n".join(composed_content)

    def generate_header(self) -> str:
        """Generate dynamic header with project info."""
        return f"""# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.
Generated automatically on {datetime.now().isoformat()}

## Project Analysis
- Detected Languages: {', '.join(self.detected_languages.keys())}
- Frameworks: {', '.join(self.detected_frameworks)}
- Available MCPs: {', '.join(self.detected_mcps)}
- Project Type: {self.project_type}
"""
```

### Task Breakdown with Module Integration

**Task 1: Module System Architecture - Persona: Architect**
```yaml
implementation_approach:
  - Create .claude/docs/ directory structure
  - Design module loading system
  - Implement template engine for dynamic composition
  - Create configuration system for manual overrides

mcp_integration:
  - Use Context7 to research documentation best practices
  - Use Sequential to analyze optimal module organization
  - Use Magic to generate template structures

validation_pattern:
  - Module validation: Ensure each module follows standard format
  - Composition validation: Verify combined CLAUDE.md is syntactically correct
  - Integration validation: Test with existing PRP commands
```

**Task 2: Smart Detection Implementation - Persona: Backend**
```yaml
implementation_approach:
  - Implement language detection using file extensions and content analysis
  - Create framework detection using dependency analysis
  - Build MCP server availability checking
  - Develop project type classification algorithms

mcp_integration:
  - Use Context7 for framework detection patterns
  - Use Sequential for multi-step analysis workflow
  - Research existing tools like GitHub Linguist for reference

validation_pattern:
  - Detection accuracy: Test against known project types
  - Performance validation: Ensure detection completes in <5 seconds
  - Edge case testing: Handle unusual project structures
```

**Task 3: Command Implementation - Persona: Backend**
```yaml
implementation_approach:
  - Implement /claude-md:generate command
  - Create /claude-md:sync with file watching
  - Build /claude-md:modules listing command
  - Add /claude-md:customize interactive interface

mcp_integration:
  - Use Sequential for command workflow logic
  - Use Context7 for command documentation patterns

validation_pattern:
  - Command validation: Ensure all commands work with existing framework
  - User experience testing: Validate interactive flows
  - Error handling: Test edge cases and provide helpful messages
```

## Enhanced Validation Loop

### Level 1: Module Structure Validation
```bash
# Validate module structure and format
python -m prp_framework.validation.validate_modules .claude/docs/

# Check module linking and references
python -m prp_framework.validation.check_module_links .claude/docs/

# Validate template syntax
python -m prp_framework.validation.validate_templates .claude/docs/
```

### Level 2: Smart Detection Testing
```python
# DETECTION ACCURACY TESTING
class TestSmartDetection:
    async def test_language_detection_accuracy(self):
        """Test language detection against known projects."""
        test_projects = [
            ("python-fastapi", {"python": 0.8, "dockerfile": 0.2}),
            ("react-typescript", {"typescript": 0.7, "javascript": 0.3}),
            ("terraform-aws", {"terraform": 0.9, "yaml": 0.1})
        ]

        for project_name, expected_languages in test_projects:
            detected = await detect_languages(f"test_projects/{project_name}")
            assert_similar_distributions(detected, expected_languages, tolerance=0.1)

    async def test_framework_detection_accuracy(self):
        """Test framework detection accuracy."""
        test_cases = [
            ("fastapi-project", ["fastapi", "uvicorn", "pydantic"]),
            ("react-app", ["react", "typescript", "webpack"]),
            ("terraform-infrastructure", ["terraform", "aws"])
        ]

        for project_path, expected_frameworks in test_cases:
            detected = await detect_frameworks(project_path)
            assert all(framework in detected for framework in expected_frameworks)
```

### Level 3: Composition Integration Testing
```bash
# Test full composition workflow
echo "Testing complete modular CLAUDE.md generation..."
python -m prp_framework.commands.claude_md generate --project-path . --output test_claude.md

# Validate generated CLAUDE.md
python -m prp_framework.validation.validate_claude_md test_claude.md

# Test with existing PRP commands
/prp:create test-feature --claude-md test_claude.md
```

### Level 4: Production Validation
```bash
# Test with real projects of different types
for project_type in python-api react-app terraform-infra cli-tool; do
    echo "Testing with $project_type project..."
    cd "test_projects/$project_type"
    python -m prp_framework.commands.claude_md generate
    /prp:execute sample-prp.md --validate
    cd ../../
done

# Performance benchmarking
python -m prp_framework.benchmarks.claude_md_performance

# Token usage comparison
python -m prp_framework.analysis.token_usage_comparison
```

## Enhanced Validation Checklist

### Base Implementation Validation
- [ ] Module system creates focused, single-purpose documentation files
- [ ] Smart detection accurately identifies project characteristics (>90% accuracy)
- [ ] Dynamic composition generates valid CLAUDE.md files
- [ ] Commands integrate with existing PRP framework

### Enhanced Features Validation
- [ ] **Token Efficiency**: Generated CLAUDE.md uses 40-60% fewer tokens
- [ ] **Accuracy Improvement**: AI performance metrics improve with relevant context
- [ ] **Maintenance Efficiency**: Individual modules can be updated independently
- [ ] **Customization Success**: Users can easily override automatic detection
- [ ] **Performance**: Complete analysis and generation in <5 seconds
- [ ] **Backward Compatibility**: Existing workflows continue to function

### Integration Quality Validation
- [ ] **MCP Integration**: Context7 and Sequential servers enhance detection and composition
- [ ] **Persona Routing**: Different personas get appropriate documentation modules
- [ ] **Command Integration**: New commands work seamlessly with existing command structure
- [ ] **Configuration Management**: User preferences persist across generations
- [ ] **Error Handling**: Graceful degradation when modules are missing or invalid

---

## Anti-Patterns to Avoid

### Module Design Anti-Patterns
- ❌ **Don't create overlapping modules** - Each module should have a clear, distinct purpose
- ❌ **Don't make modules too granular** - Balance modularity with usability
- ❌ **Don't hardcode detection logic** - Use configurable patterns for flexibility
- ❌ **Don't ignore user customization** - Always allow manual overrides of automatic detection

### Implementation Anti-Patterns
- ❌ **Don't break backward compatibility** - Ensure existing CLAUDE.md workflows continue working
- ❌ **Don't create performance bottlenecks** - Keep detection and composition fast (<5 seconds)
- ❌ **Don't assume perfect detection** - Provide fallbacks and manual override options
- ❌ **Don't ignore token optimization** - Ensure modular approach actually reduces token usage

### Integration Success Factors
1. **Comprehensive Testing**: Test with diverse project types and structures
2. **User Experience Focus**: Make commands intuitive and helpful
3. **Performance Optimization**: Ensure system is fast and responsive
4. **Documentation Quality**: Each module should be complete and self-contained
5. **Maintenance Simplicity**: System should be easy to extend and modify
6. **Error Recovery**: Graceful handling of edge cases and failures

---

**Enhanced PRP Integration Confidence Score: 9/10**

This modular CLAUDE.md system will significantly improve documentation maintenance, context relevance, and user experience while maintaining full compatibility with the existing PRP framework. The combination of smart detection, dynamic composition, and modular architecture should deliver measurable improvements in AI performance and developer productivity.
