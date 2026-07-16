---
name: "Universal Project Factory - BASE PRP System"
description: "Comprehensive PRP for creating a generalized, reusable project factory system that can handle any type of software development project through specialized subagents and structured workflows"
---

## Goal

**Feature Goal**: Create a universal, domain-agnostic project factory system that transforms high-level project requirements into complete, production-ready software implementations using specialized subagents and structured workflows.

**Deliverable**: Complete Universal Project Factory system with:
- Generic subagent architecture (planner, architect, implementation-specialist, etc.)
- Universal PRP template system supporting any project type
- Orchestration workflow engine with BMAD method integration
- Context preservation and file-based management system
- Extension framework for domain-specific expansion packs

**Success Definition**:
- System successfully handles diverse project types (web apps, APIs, CLI tools, AI agents, libraries, etc.)
- Subagents work cohesively across different technology stacks
- Context is preserved throughout development lifecycle
- One-pass implementation success rate >80% for standard projects
- Easily extensible for new domains and technologies

## User Persona

**Target User**: Software developers, technical leads, and development teams who need to rapidly prototype, build, or scale software projects

**Use Cases**:

*New Projects (Greenfield)*:
- "Build me a REST API with authentication from scratch"
- "Create a new React dashboard with data visualization"
- "Develop a Python CLI tool for data processing"
- "Build an AI agent for customer support"

*Existing Projects (Brownfield)*:
- "Add authentication to my existing API"
- "Extend my React app with a new dashboard section"
- "Refactor my Python script into a proper CLI tool"
- "Integrate an AI agent into my existing customer support system"
- "Add a new microservice to my existing architecture"

**User Journey**:
1. User describes project in natural language
2. System asks clarifying questions about requirements, tech stack, scale
3. User provides answers and preferences
4. System automatically creates comprehensive project plan
5. Specialized subagents collaborate to implement solution
6. System delivers complete, tested, documented project
7. User receives deployment-ready code with validation reports

**Pain Points Addressed**:
- Eliminates "blank page syndrome" when starting new projects
- Reduces context switching between different types of development
- Prevents common architectural mistakes through proven patterns
- Accelerates time-to-production through automated best practices
- Maintains consistency across team and organizational development

## Why

- **Universal Application**: Current specialized systems (like Pydantic AI factory) are domain-specific and don't scale across project types
- **Context Loss Prevention**: Most development workflows lose critical context between planning and implementation phases
- **Consistency at Scale**: Organizations need standardized approaches that work across different technologies and teams
- **Rapid Prototyping**: Market demands faster iteration cycles without sacrificing quality
- **Knowledge Preservation**: Captures and reuses proven patterns across projects and domains
- **Developer Productivity**: Eliminates repetitive setup and boilerplate, allowing focus on business logic
- **Quality Assurance**: Built-in validation and testing ensures production-ready output

## What

A comprehensive Universal Project Factory system that combines the best elements of:

1. **BMAD Method Patterns**: Two-phase agentic planning with context-engineered development
2. **Specialized Subagent Architecture**: Domain-agnostic agents with clear responsibilities
3. **PRP Template System**: Universal templates that adapt to any project type
4. **Context Preservation Engine**: File-based context management throughout lifecycle
5. **Validation Framework**: Multi-level testing and quality assurance
6. **Extension Framework**: Domain-specific expansion packs for specialized needs

### Success Criteria

- [ ] Universal subagents successfully handle 5+ different project types (web, API, CLI, AI, mobile)
- [ ] PRP templates generate actionable requirements for any technology stack
- [ ] Context is preserved and accessible throughout entire development lifecycle
- [ ] System integrates with existing development tools and workflows
- [ ] Extension framework allows rapid addition of new domain specializations
- [ ] Validation framework catches 90%+ of common implementation issues
- [ ] Documentation is auto-generated and maintains accuracy throughout development
- [ ] One-pass implementation success rate >80% across diverse project types

## All Needed Context

### Context Completeness Check

_"If someone knew nothing about this codebase or development methodologies, would they have everything needed to implement a universal project factory successfully?"_

### Documentation & References

```yaml
# BMAD Method Research - Core methodology patterns
- url: https://github.com/bmad-code-org/BMAD-METHOD
  why: Two-phase agentic planning approach and agent specialization patterns
  critical: Context preservation through file-based management, Human-in-the-loop collaboration
  section: Core methodology, workflow patterns, agent architecture

# Existing Pydantic AI Factory - Reference implementation
- file: .claude/docs/modules/tech-stacks/PYDANTIC_AI.md
  why: Proven workflow patterns, subagent orchestration, TodoWrite integration
  pattern: 6-phase workflow (clarification → planning → implementation → validation)
  gotcha: Domain-specific hardcoding limits reusability

# PRP Template System - Foundation patterns
- file: .claude/PRPs/templates/prp_base.md
  why: Structured approach to context preservation and implementation guidance
  pattern: Goal/Why/What/Context/Implementation/Validation structure
  critical: Information density standards and validation gates

# Existing Subagents - Specialization patterns
- file: .claude/agents/pydantic-ai-planner.md
  why: Requirements analysis and PRP generation patterns
  pattern: Autonomous operation, template-based output, context analysis

- file: .claude/agents/pydantic-ai-dependency-manager.md
  why: Configuration and environment management patterns
  pattern: Technology-specific setup, credential handling, service integration

- file: .claude/agents/pydantic-ai-deployment-manager.md
  why: Infrastructure and deployment automation patterns
  pattern: Terraform, containerization, cloud platform integration

# Context Engineering Principles
- docfile: PRPs/ai_docs/superclaude-integration.md
  why: Context injection and dynamic documentation patterns
  section: Module-based context loading and domain-specific activation

# Claude Code Integration Patterns
- docfile: PRPs/ai_docs/build_with_claude_code.md
  why: Tool integration, subagent invocation, and workflow orchestration
  section: Task tool usage, parallel execution, and error handling
```

### Current Codebase Analysis

```bash
# Existing Project Structure
.claude/
├── agents/                    # Specialized subagents (pydantic-ai-* pattern)
├── docs/modules/             # Domain-specific orchestration (tech-stacks/)
├── PRPs/
│   ├── templates/           # PRP templates (domain-specific)
│   ├── examples/           # Implementation examples
│   └── ai_docs/           # Context documentation
└── CLAUDE.md              # Dynamic context injection system

# Key Patterns to Extract:
# 1. Subagent specialization with clear responsibilities
# 2. Template-based requirement generation
# 3. TodoWrite integration for task management
# 4. Multi-phase workflows with validation gates
# 5. Context preservation through file structures
```

### Desired Universal System Structure (Following Claude Code Patterns)

```bash
.claude/
├── agents/                   # Universal agents (following existing pattern)
│   ├── universal-project-orchestrator.md     # Main workflow coordinator
│   ├── universal-integration-specialist.md   # Service/API integration
│   ├── universal-qa-coordinator.md          # Quality assurance coordination
│   # Leverage existing agents:
│   ├── prd-writer.md        # Requirements analysis (existing - Analyst role)
│   ├── backend-architect.md  # System design (existing - Architect role)
│   ├── project-task-planner.md # Implementation planning (existing - Planner)
│   ├── python-pro.md        # Python implementation (existing)
│   ├── javascript-pro.md    # JS/TS implementation (existing)
│   ├── react-specialist.md  # React frontend (existing)
│   ├── security-auditor.md  # Security validation (existing)
│   ├── performance-engineer.md # Performance testing (existing)
│   └── terraform-specialist.md # Infrastructure (existing)
├── PRPs/templates/          # Universal PRP templates (existing location)
│   ├── prp_base.md         # Generic project template (existing)
│   ├── web_application.md   # Web app specialization (to be created)
│   ├── api_service.md      # API service template (to be created)
│   ├── cli_tool.md         # CLI tool template (to be created)
│   └── prp_pydantic_ai_base.md # AI agent template (existing)
└── CLAUDE.md               # Universal orchestration instructions (following PYDANTIC_AI.md pattern)
    # Contains:
    # - Universal Project Factory workflow (like PYDANTIC_AI.md)
    # - Agent coordination patterns
    # - Shared planning/ directory usage
    # - TodoWrite integration throughout
    # - Project type specializations
```

### Known Gotchas & System Constraints

```python
# CRITICAL: Subagent Context Passing
# Each subagent needs project type context to adapt behavior
# Example: planner.md must know if building web app vs CLI tool vs AI agent

# CRITICAL: Technology Stack Detection
# System must identify technology preferences early to route to correct specialists
# Example: Python vs Node.js vs Go affects deployment and dependency patterns

# CRITICAL: Template Selection Logic
# Universal templates must dynamically adapt based on project classification
# Example: web_application.md template vs api_service.md template selection

# GOTCHA: Context Window Limitations
# Large projects may exceed context limits - need chunking strategy
# PATTERN: Use story files for context preservation (BMAD method)

# GOTCHA: Subagent Coordination
# Multiple specialists must maintain consistency in technology choices
# PATTERN: Shared context files prevent conflicts

# GOTCHA: Validation Complexity
# Different project types need different validation approaches
# PATTERN: Pluggable validation framework based on project classification

# CRITICAL: New vs Existing Codebase Handling
# System must detect whether working with greenfield or brownfield projects
# Example: "Build a new API" vs "Add authentication to my existing API"
# PATTERN: Phase 0 determines project context and adapts workflow accordingly

# GOTCHA: Existing Codebase Integration
# Must work within existing project structure and conventions
# Example: Existing package.json vs creating new one, existing directory structure
# PATTERN: Analyze existing structure before making changes, follow existing patterns
```

## Implementation Blueprint

### Implementation Order Overview

**CRITICAL**: Follow this exact sequence to ensure proper integration with existing Claude Code patterns.

```yaml
STEP 1: Create Universal Agents (3 files)
  - .claude/agents/universal-project-orchestrator.md (with greenfield/brownfield detection)
  - .claude/agents/universal-integration-specialist.md (technology-agnostic integration)
  - .claude/agents/universal-qa-coordinator.md (comprehensive validation orchestration)

STEP 2: Create Specialized PRP Templates (3 files)
  - .claude/PRPs/templates/web_application.md (with brownfield considerations)
  - .claude/PRPs/templates/api_service.md (with existing API integration patterns)
  - .claude/PRPs/templates/cli_tool.md (with existing tool enhancement patterns)

STEP 3: Integrate with CLAUDE.md (1 modification)
  - Add Universal Project Factory orchestration section
  - Include greenfield/brownfield detection in Phase 0
  - Preserve existing Pydantic AI factory coexistence

STEP 4: Validate Both Scenarios (comprehensive testing)
  - Test greenfield project creation workflows
  - Test brownfield project extension workflows
  - Verify agent coordination and context preservation
```

### Phase 1: Minimal Universal Agents (Leverage Existing Agents)

Create only the essential universal coordination agents, reusing existing Claude Code agents.

```yaml
Task 1: CREATE .claude/agents/universal-project-orchestrator.md
  - ROLE: Main workflow coordinator (BMAD Scrum Master role)
  - CAPABILITIES: Project classification, agent selection, workflow coordination, new vs existing project detection
  - INPUTS: User request, clarifications, existing codebase context (if applicable)
  - OUTPUTS: Agent invocation instructions, TodoWrite tasks, progress tracking
  - INTEGRATION: Coordinates existing agents (@prd-writer, @backend-architect, etc.)
  - ADAPTATION: Detects greenfield vs brownfield scenarios and adapts workflow accordingly

  REQUIRED CONTENT STRUCTURE:
  ```markdown
  # Universal Project Orchestrator

  ## Primary Objective
  Orchestrate multi-agent workflows for universal project development...

  ## Core Responsibilities
  ### 1. Project Context Detection
  **Greenfield Detection Patterns**:
  - "Build a new...", "Create from scratch...", "Develop a..."
  - No existing directory structure or codebase references

  **Brownfield Detection Patterns**:
  - "Add to my existing...", "Extend current...", "Integrate with..."
  - References to existing files, codebases, or systems

  ### 2. Phase 0: Recognition & Classification
  [Specific workflow steps for both contexts]

  ### 3. Agent Coordination Protocol
  [How to invoke and coordinate other agents]

  ## Integration with Existing Agents
  [Specific @agent invocation patterns]
  ```

Task 2: CREATE .claude/agents/universal-integration-specialist.md
  - ROLE: Service and API integration across all project types
  - CAPABILITIES: Component connection, data flow, authentication integration
  - INPUTS: Implementation outputs from technology specialists
  - OUTPUTS: Integration code, service connections, configuration management
  - COORDINATION: Works after implementation specialists complete core components

  REQUIRED CONTENT STRUCTURE:
  ```markdown
  # Universal Integration Specialist

  ## Primary Objective
  Create seamless integrations between components, services, and external systems...

  ## Core Responsibilities
  ### 1. Integration Analysis & Planning
  **Input Analysis**:
  - Read planning/REQUIREMENTS.md for integration requirements
  - Read planning/ARCHITECTURE.md for component relationships
  - Analyze implementation code from specialists for integration points

  ### 2. Technology Stack Adaptations
  **Web Application Integration**: Frontend ↔ Backend API communication
  **API Service Integration**: Database connection and ORM setup
  **CLI Tool Integration**: Configuration file and environment variable handling
  **AI Agent Integration**: LLM provider connections, tool integrations

  ## Integration Implementation Workflow
  [Specific steps for creating integration files]
  ```

Task 3: CREATE .claude/agents/universal-qa-coordinator.md
  - ROLE: Quality assurance orchestration (BMAD QA role)
  - CAPABILITIES: Test strategy, specialist coordination, quality gate validation
  - INPUTS: Complete project implementation and integration
  - OUTPUTS: Test plans, validation reports, quality metrics
  - COORDINATION: Manages @security-auditor, @performance-engineer, tech specialists

  REQUIRED CONTENT STRUCTURE:
  ```markdown
  # Universal QA Coordinator

  ## Primary Objective
  Orchestrate comprehensive quality assurance for software projects...

  ## Core Responsibilities
  ### 1. Quality Assessment Strategy
  **Project Analysis**:
  - Read planning/REQUIREMENTS.md for quality requirements
  - Read planning/ARCHITECTURE.md to understand system complexity
  - Determine appropriate validation approaches based on project type

  ### 2. Technology-Specific Testing Strategies
  **Web Application QA**: Cross-browser compatibility, performance testing
  **API Service QA**: Contract testing, load testing, security testing
  **CLI Tool QA**: Cross-platform testing, input validation testing
  **AI Agent QA**: Model integration testing, conversation flow testing

  ### 3. Quality Coordination Workflow
  [Specific steps for orchestrating validation specialists]
  ```

# LEVERAGE EXISTING AGENTS (No Changes Needed):
# - @prd-writer: Requirements analysis (BMAD Analyst role)
# - @backend-architect: System design (BMAD Architect role)
# - @project-task-planner: Implementation planning (Planner role)
# - @python-pro, @javascript-pro, @react-specialist: Technology implementation
# - @security-auditor, @performance-engineer: Validation specialists
# - @terraform-specialist, @kubernetes-expert: Infrastructure deployment
```

### Phase 2: Universal PRP Template System (Existing Location)

Add project-type specific PRP templates to existing template system.

```yaml
Task 4: CREATE .claude/PRPs/templates/web_application.md
  - PURPOSE: Web application specific template (React, Vue, Angular, etc.)
  - INHERITANCE: Based on prp_base.md with web-specific patterns
  - FEATURES: Frontend/backend patterns, responsive design, user authentication
  - VALIDATION: Browser compatibility, performance, accessibility

  REQUIRED TEMPLATE ADAPTATIONS:
  ```markdown
  ## Goal (Web App Specific)
  **Feature Goal**: [Web application with specified UI/UX requirements]
  **Success Definition**:
  - Responsive design works across all device sizes
  - Core Web Vitals meet performance benchmarks
  - Accessibility compliance (WCAG 2.1 AA minimum)

  ## Context Completeness Check (Web App)
  ### Brownfield Web App Considerations
  - Existing frontend framework and version
  - Current build system and bundling approach
  - Existing component library and design system
  - Current state management approach
  - Existing authentication/routing implementation

  ### Implementation Blueprint (Web App)
  **Data Models**: Frontend state management, API data models
  **Component Architecture**: Reusable UI components, page layouts
  **Integration Points**: API connections, authentication flow
  **Performance Optimization**: Bundle splitting, lazy loading
  ```

Task 5: CREATE .claude/PRPs/templates/api_service.md
  - PURPOSE: REST/GraphQL API service template
  - INHERITANCE: Based on prp_base.md with API-specific patterns
  - FEATURES: Endpoint design, data modeling, authentication, documentation
  - VALIDATION: API testing, performance benchmarks, security scanning

  REQUIRED TEMPLATE ADAPTATIONS:
  ```markdown
  ## Goal (API Service Specific)
  **Feature Goal**: [API service with specified endpoints and functionality]
  **Success Definition**:
  - API endpoints respond within specified SLA times
  - Comprehensive API documentation available
  - Security validation passes (authentication, authorization, input validation)

  ## Context Completeness Check (API Service)
  ### Brownfield API Considerations
  - Existing API framework and version
  - Current database schema and ORM
  - Existing authentication/authorization system
  - Current API versioning strategy
  - Existing deployment and monitoring setup

  ### Implementation Blueprint (API Service)
  **Data Models**: Database models, API schemas, validation rules
  **Endpoint Design**: RESTful routes, GraphQL resolvers
  **Integration Points**: Database connections, external service APIs
  **Security Implementation**: Authentication middleware, rate limiting
  ```

Task 6: CREATE .claude/PRPs/templates/cli_tool.md
  - PURPOSE: Command-line application template
  - INHERITANCE: Based on prp_base.md with CLI-specific patterns
  - FEATURES: Argument parsing, configuration, user interaction, distribution
  - VALIDATION: Command testing, cross-platform compatibility, usability

  REQUIRED TEMPLATE ADAPTATIONS:
  ```markdown
  ## Goal (CLI Tool Specific)
  **Feature Goal**: [Command-line tool with specified functionality]
  **Success Definition**:
  - Cross-platform compatibility (Windows, macOS, Linux)
  - Clear help system and error messages
  - Proper exit codes and error handling

  ## Context Completeness Check (CLI Tool)
  ### Brownfield CLI Considerations
  - Existing command structure and conventions
  - Current configuration file format
  - Existing plugin/extension system
  - Current distribution method (npm, pip, etc.)
  - Existing testing and CI/CD setup

  ### Implementation Blueprint (CLI Tool)
  **Command Structure**: Argument parsing, subcommands, help system
  **Configuration**: Config file handling, environment variables
  **Integration Points**: External APIs, file system operations
  **Distribution**: Packaging, installation, updates
  ```

# NOTE: AI agent template already exists as prp_pydantic_ai_base.md
# NOTE: Base template already exists as prp_base.md
```

### Phase 3: Orchestration Integration (Add to CLAUDE.md)

Add universal project factory orchestration to existing CLAUDE.md file, following PYDANTIC_AI.md pattern.

```yaml
Task 7: MODIFY CLAUDE.md
  - ADD: Universal Project Factory section (following PYDANTIC_AI.md pattern)
  - CONTENT:
    - Project type recognition patterns (web/API/CLI/AI/mobile)
    - New vs existing project detection (greenfield vs brownfield)
    - 6-phase universal workflow adapting to project context
    - Agent coordination protocols using shared planning/ directories
    - TodoWrite integration throughout workflow
    - Dynamic agent selection based on project type and existing structure
    - Existing codebase analysis and integration patterns
  - INTEGRATION: Works alongside existing module system and Pydantic AI factory
  - PLACEMENT: After existing module instructions, before fallback context

  SPECIFIC IMPLEMENTATION STEPS:
  1. INSERT after line containing "Dynamic Module Integration Instructions"
  2. ADD new section header: "# 🏭 Universal Project Factory - Global Orchestration System"
  3. INCLUDE activation trigger patterns for project creation requests
  4. SPECIFY exact Phase 0 enhancement with greenfield/brownfield detection:

  ```markdown
  ### Phase 0: Recognition & Classification
  **Orchestrator**: `@universal-project-orchestrator`
  **Action**: Project type detection and context analysis
  ```
  1. Detect project type: web_app | api_service | cli_tool | ai_agent | mobile_app | library
  2. **DETECT PROJECT CONTEXT**:
     - **Greenfield**: "Build new...", "Create from scratch...", no existing codebase references
     - **Brownfield**: "Add to existing...", "Extend current...", references existing files/systems
  3. **CODEBASE ANALYSIS** (if brownfield):
     - Use LS and Glob tools to analyze existing directory structure
     - Use Grep tool to identify technology stack and patterns
     - Document existing architecture in planning/EXISTING_ANALYSIS.md
  4. Ask 2-3 clarifying questions (adapted to context)
  5. Create shared planning/[project_name]/ directory
  6. Initialize TodoWrite workflow tracking
  ```

  4. UPDATE all subsequent phases with brownfield adaptations
  5. MAINTAIN exact same TodoWrite integration patterns as existing PYDANTIC_AI.md
  6. PRESERVE existing Dynamic Module Integration system

Task 8: ENSURE consistency with existing patterns
  - Follow exact same structure as PYDANTIC_AI.md orchestration
  - Use existing agent invocation patterns (@agent-name)
  - Maintain shared planning/ directory approach
  - Keep TodoWrite integration consistent with established patterns
  - VERIFY: No conflicts with existing Pydantic AI factory workflow
  - TEST: Both workflows can coexist and complement each other
```

### Phase 4: Shared Context System (Following Pydantic AI Pattern)

Use established shared planning/ directory system for agent coordination.

```yaml
Task 9: DOCUMENT shared planning/ directory usage
  - STRUCTURE: projects/[project_name]/planning/ (like agents/[agent_name]/planning/)
  - COORDINATION: All agents read/write to shared planning/ files
  - CONTEXT FILES:
    - planning/REQUIREMENTS.md (from @prd-writer)
    - planning/ARCHITECTURE.md (from @backend-architect)
    - planning/TASKS.md (from @project-task-planner)
    - planning/INTEGRATION.md (from @universal-integration-specialist)
    - planning/QUALITY_REPORT.md (from @universal-qa-coordinator)
    - planning/EXISTING_ANALYSIS.md (from @universal-project-orchestrator, brownfield only)
  - PERSISTENCE: Planning files enable workflow recovery and agent coordination
  - BROWNFIELD ADAPTATIONS: EXISTING_ANALYSIS.md contains current codebase structure, technology stack, patterns, and integration points

Task 10: NO separate context system needed
  - Reuse existing planning/ directory pattern from Pydantic AI system
  - TodoWrite provides workflow state management
  - Agent outputs provide "story file" equivalent through planning/ files
```

### Key Coordination Patterns

**Agent Context Sharing**:
- Each agent reads from shared `planning/` directory before starting work
- Project type and tech stack context preserved in planning/REQUIREMENTS.md
- Agent outputs reference shared context to maintain consistency

**Dynamic Agent Selection**:
- @universal-project-orchestrator determines appropriate specialists based on project type
- Uses existing Claude Code agents rather than creating new implementations
- Technology routing: Python → @python-pro, React → @react-specialist, etc.

**Workflow State Management**:
- TodoWrite tracks progress across all phases and agents
- Planning files serve as "story files" for context preservation (BMAD pattern)
- Recovery possible through shared planning/ directory if workflow interrupted

**Template Inheritance**:
- Project-specific templates (web_application.md, api_service.md) inherit from prp_base.md
- @prd-writer selects appropriate template based on project classification
- Templates adapt to technology stack while maintaining consistent structure

### Integration Points

```yaml
SUBAGENT_COORDINATION:
  - context_sharing: "Shared project context files enable consistency"
  - workflow_management: "Scrum Master coordinates subagent interactions"
  - progress_tracking: "TodoWrite integration throughout workflow"

TEMPLATE_SYSTEM:
  - inheritance: "Specialized templates inherit from base_project.md"
  - adaptation: "Templates modify based on technology stack selection"
  - validation: "Each template includes type-specific validation gates"

WORKFLOW_ENGINE:
  - recognition: "Automatic project type classification from user input"
  - orchestration: "Dynamic subagent selection and coordination"
  - adaptation: "Workflow complexity scales with project requirements"

EXTENSION_FRAMEWORK:
  - pluggability: "New domains added without modifying core system"
  - standardization: "Consistent interface across all specializations"
  - documentation: "Clear templates for adding new capabilities"
```

## Validation Loop

### Level 1: System Architecture Validation

```bash
# Verify Claude Code structure is preserved
test -d .claude/agents && echo "Agent directory exists"
test -d .claude/PRPs/templates && echo "Template system exists"
test -f CLAUDE.md && echo "Orchestration file exists"

# Verify universal agents created
test -f .claude/agents/universal-project-orchestrator.md && echo "Orchestrator created"
test -f .claude/agents/universal-integration-specialist.md && echo "Integration specialist created"
test -f .claude/agents/universal-qa-coordinator.md && echo "QA coordinator created"

# Verify existing agents still available
ls .claude/agents/ | grep -E "(prd-writer|backend-architect|project-task-planner)" | wc -l

# Verify template system expanded
ls .claude/PRPs/templates/ | wc -l  # Should include base + specialized templates

# Expected: Universal system integrates with existing Claude Code structure
```

### Level 2: Workflow Integration Validation

```bash
# Test universal workflow coordination in CLAUDE.md
grep -q "TodoWrite" CLAUDE.md
grep -q "Universal Project Factory" CLAUDE.md
grep -q "Phase 0\|Phase 1\|Phase 2" CLAUDE.md

# Test agent coordination patterns
grep -q "shared planning" .claude/agents/universal-project-orchestrator.md
grep -q "planning/" .claude/agents/universal-integration-specialist.md

# Test existing agent availability
test -f .claude/agents/prd-writer.md && echo "Requirements agent available"
test -f .claude/agents/backend-architect.md && echo "Architecture agent available"

# Test template inheritance (when created)
test -f .claude/PRPs/templates/prp_base.md && echo "Base template exists"

# Expected: All coordination patterns work with existing Claude Code structure
```

### Level 3: Cross-Domain Functionality Testing

```bash
# Test project type recognition in CLAUDE.md
grep -q "web_application\|api_service\|cli_tool" CLAUDE.md
grep -q "project classification" CLAUDE.md

# Test agent specialization routing
grep -q "@python-pro\|@javascript-pro\|@react-specialist" CLAUDE.md
grep -q "Dynamic Agent Selection" CLAUDE.md

# Test shared planning directory concept
echo "Shared planning/ directories enable context preservation across agents"
echo "TodoWrite provides workflow state management throughout phases"

# Test template system availability
test -f .claude/PRPs/templates/prp_base.md && echo "Base template ready"
echo "Specialized templates would extend base template when created"

# Expected: System ready to handle diverse project types through agent coordination
```

### Level 3.5: Greenfield vs Brownfield Scenario Testing

```bash
# Test greenfield scenario detection patterns in CLAUDE.md
grep -q "Build new\|Create from scratch\|Develop a" CLAUDE.md
grep -q "Greenfield" CLAUDE.md

# Test brownfield scenario detection patterns in CLAUDE.md
grep -q "Add to existing\|Extend current\|existing codebase" CLAUDE.md
grep -q "Brownfield" CLAUDE.md

# Test codebase analysis capability in CLAUDE.md
grep -q "LS and Glob tools\|existing directory structure" CLAUDE.md
grep -q "EXISTING_ANALYSIS.md" CLAUDE.md

# MANUAL TEST: Greenfield Workflow
echo "=== MANUAL TEST 1: Greenfield React App ==="
echo "User Input: 'Build me a new React dashboard from scratch'"
echo "Expected Behavior:"
echo "1. @universal-project-orchestrator detects 'new' + 'React' = web_app + greenfield"
echo "2. Phase 0 skips codebase analysis"
echo "3. Template selection uses web_application.md"
echo "4. @react-specialist + @frontend-designer selected for implementation"
echo "5. Creates fresh project structure"

# MANUAL TEST: Brownfield Workflow
echo "=== MANUAL TEST 2: Brownfield React Extension ==="
echo "User Input: 'Add authentication to my existing React dashboard'"
echo "Expected Behavior:"
echo "1. @universal-project-orchestrator detects 'existing' + 'React' = web_app + brownfield"
echo "2. Phase 0 runs LS/Glob analysis of existing codebase"
echo "3. Creates planning/EXISTING_ANALYSIS.md with current structure"
echo "4. Template adaptation considers existing architecture"
echo "5. Implementation respects existing patterns and conventions"
echo "6. Integration testing includes regression validation"

# VALIDATION CHECKPOINTS
echo "=== VALIDATION CHECKPOINTS ==="
echo "✅ Greenfield: Creates new project structure without existing constraints"
echo "✅ Brownfield: Analyzes and integrates with existing codebase"
echo "✅ Both: Use shared planning/ directory for context preservation"
echo "✅ Both: TodoWrite tracks progress across all phases"
echo "✅ Both: Quality gates prevent delivery of incomplete solutions"

# Expected: System handles both greenfield and brownfield scenarios correctly
```

### Level 4: Extension Framework Validation

```bash
# Test extension capability through Claude Code patterns
echo "Extension framework built on Claude Code patterns:"
echo "- Add new project templates to .claude/PRPs/templates/"
echo "- Add new specialist agents to .claude/agents/"
echo "- Update orchestration routing in CLAUDE.md"

# Test extensibility foundations
test -d .claude/agents && echo "Agent extension point available"
test -d .claude/PRPs/templates && echo "Template extension point available"
test -f CLAUDE.md && echo "Orchestration extension point available"

# Verify no proprietary structures needed
echo "No separate expansion pack system required"
echo "Extensions follow existing Claude Code conventions"

# Expected: Extension framework uses established Claude Code patterns
```

## Final Validation Checklist

### Technical Validation

- [ ] 3 new universal agents created (.claude/agents/universal-*.md)
- [ ] Existing Claude Code agents properly leveraged (@prd-writer, @backend-architect, etc.)
- [ ] CLAUDE.md updated with Universal Project Factory orchestration section
- [ ] Shared planning/ directory patterns documented for agent coordination
- [ ] Project type classification system integrated in CLAUDE.md
- [ ] TodoWrite integration specified throughout workflow phases
- [ ] Extension framework uses existing Claude Code patterns

### Functional Validation

- [ ] System successfully classifies project types (web/API/CLI/AI/mobile)
- [ ] System detects new vs existing project contexts (greenfield vs brownfield)
- [ ] Workflow adapts appropriately for new project creation
- [ ] Workflow adapts appropriately for existing project modification
- [ ] Context is preserved and accessible across all workflow phases
- [ ] Agents coordinate effectively using shared planning/ directories
- [ ] Templates generate actionable, technology-appropriate requirements
- [ ] Existing codebase structure is respected and properly analyzed
- [ ] Validation gates catch implementation issues early

### Integration Validation

- [ ] BMAD method patterns successfully integrated (two-phase approach)
- [ ] Existing Claude Code tool integration patterns maintained
- [ ] PRP template system works across all project types
- [ ] File-based context management enables collaboration
- [ ] Extension framework allows rapid domain addition
- [ ] System scales from simple scripts to complex architectures

### Quality Validation

- [ ] Documentation is comprehensive and maintainable
- [ ] System follows established patterns from existing agents
- [ ] Anti-patterns are avoided throughout implementation
- [ ] Error handling is robust across all components
- [ ] Performance is acceptable for interactive workflows
- [ ] Security considerations addressed for all project types

---

## Anti-Patterns to Avoid

### System Design Anti-Patterns
- ❌ Don't hardcode project types - use dynamic classification
- ❌ Don't create monolithic subagents - maintain clear specialization
- ❌ Don't ignore context preservation - implement BMAD-style story files
- ❌ Don't skip workflow coordination - Scrum Master role is critical
- ❌ Don't make templates inflexible - ensure adaptation capabilities

### Implementation Anti-Patterns
- ❌ Don't duplicate existing patterns - reuse proven approaches
- ❌ Don't skip validation gates - multi-level validation is essential
- ❌ Don't ignore technology constraints - respect stack limitations
- ❌ Don't create tight coupling - maintain subagent independence
- ❌ Don't forget extension hooks - enable future domain additions

### Workflow Anti-Patterns
- ❌ Don't skip user clarification - Phase 0 is critical for success
- ❌ Don't lose context between phases - maintain state throughout
- ❌ Don't ignore user feedback - enable human-in-the-loop refinement
- ❌ Don't rush to implementation - proper planning prevents failures
- ❌ Don't neglect progress tracking - TodoWrite integration essential

### Existing Codebase Anti-Patterns
- ❌ Don't assume greenfield project structure - analyze existing codebase first
- ❌ Don't override existing conventions - follow established patterns
- ❌ Don't ignore existing dependencies - work within current technology stack
- ❌ Don't create parallel structures - integrate with existing architecture
- ❌ Don't skip existing codebase analysis - understand before modifying

---

## Implementation Success Criteria

### What You'll Have When Complete

✅ **Universal Project Factory System**: A Claude Code-native orchestration system that handles any software project type

✅ **Dual-Context Capability**: Seamlessly works with both greenfield (new) and brownfield (existing) projects

✅ **Agent Ecosystem**: 3 new universal coordination agents + full integration with 15+ existing Claude Code specialists

✅ **Template System**: Project-type specific PRP templates that adapt to existing codebases

✅ **Workflow Intelligence**: Phase 0 that detects context and routes to appropriate workflow patterns

### Expected User Experience

```
User: "Add authentication to my existing React dashboard"

System Behavior:
1. 🎯 @universal-project-orchestrator detects: web_app + brownfield
2. 🔍 Analyzes existing codebase structure and patterns
3. 📋 @prd-writer creates requirements that respect existing architecture
4. 🏗️ @backend-architect designs integration (not replacement)
5. ⚡ @react-specialist implements within existing conventions
6. 🔗 @universal-integration-specialist connects auth to current system
7. ✅ @universal-qa-coordinator validates with regression testing
8. 🎉 User receives working authentication integrated seamlessly

Total Time: 15-30 minutes for complete, tested, integrated solution
```

### Implementation Verification

**Quick Test**: After implementation, these commands should work:

```bash
# System structure verification
test -f .claude/agents/universal-project-orchestrator.md && echo "✅ Orchestrator ready"
test -f .claude/PRPs/templates/web_application.md && echo "✅ Templates ready"
grep -q "greenfield\|brownfield" CLAUDE.md && echo "✅ Context detection ready"

# Workflow verification
echo "User request: 'Build new React app'" | # Should trigger greenfield workflow
echo "User request: 'Add feature to existing app'" | # Should trigger brownfield workflow
```

**Success Metric**: System correctly handles 80%+ of project requests on first attempt with appropriate greenfield/brownfield workflow selection.

---

**RESEARCH INTEGRATION**: This PRP combines insights from BMAD methodology (two-phase agentic planning, context preservation, agent specialization) with proven patterns from the Pydantic AI factory system (workflow orchestration, specialized subagents, template systems) to create a universal, extensible project factory that maintains the benefits of both approaches while eliminating domain-specific limitations.
