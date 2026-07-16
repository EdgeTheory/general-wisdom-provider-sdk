# 🏭 Universal Project Factory - Global Orchestration System

**CRITICAL WORKFLOW TRIGGER**: When ANY user request involves creating, building, developing, troubleshooting, or modifying a software project:

## 🎯 Primary Directive

⚠️ **AUTOMATIC ACTIVATION**: Recognize these software project patterns:
- **New Project Creation**: "Build a [web app/API/CLI tool/mobile app/library]...", "Create a [system/service/application] that...", "Make me a [software solution] that..."
- **Existing Project Enhancement**: "Add to my existing...", "Extend current...", "Integrate with...", "Modify my..."
- **Bug Troubleshooting**: "Fix this bug...", "Debug my...", "Something's wrong with...", "Error in my..."
- **Feature Development**: "I need a [tool/dashboard/backend/frontend] for...", "Implement [feature] in..."
- **Technology Migration**: "Migrate from [tech] to [tech]...", "Upgrade my [system]...", "Modernize my..."

**MANDATORY WORKFLOW**:
1. **IMMEDIATELY** invoke `@universal-project-orchestrator`
2. **NEVER** jump directly to implementation
3. **ALWAYS** use shared planning/ directory for agent coordination
4. **MAINTAIN** TodoWrite tracking throughout workflow

## 🔄 Universal Factory Workflow

### Phase 0: Recognition & Classification
**Orchestrator**: `@universal-project-orchestrator` (use Task tool to invoke)
**Action**: Project type detection, context analysis, and user clarification
```
1. Detect project type: web_app | api_service | cli_tool | ai_agent | mobile_app | library
2. **DETECT PROJECT CONTEXT**:
   - **Greenfield**: "Build new...", "Create from scratch...", no existing codebase references
   - **Brownfield**: "Add to existing...", "Extend current...", references existing files/systems
3. **CODEBASE ANALYSIS** (if brownfield):
   - Use LS and Glob tools to analyze existing directory structure
   - Use Grep tool to identify technology stack and patterns
   - Document existing architecture in planning/EXISTING_ANALYSIS.md
4. Ask 2-3 clarifying questions (adapted to context):
   - Greenfield: Focus on tech stack preferences, scale, requirements
   - Brownfield: Focus on integration points, existing constraints, enhancement scope
5. WAIT for user responses (critical - do not proceed without clarification)
6. Create shared planning/[project_name]/ directory
7. Initialize TodoWrite workflow tracking
```

### Phase 1: Requirements Analysis
**Agent**: `@prd-writer`
**Input**: User request + clarifications + project classification + PROJECT_CONTEXT.md + EXISTING_ANALYSIS.md (if brownfield)
**Output**: `planning/REQUIREMENTS.md` using appropriate PRP template
**Template Selection**:
- Web apps → `.claude/PRPs/templates/web_application.md` (if exists, else base)
- API services → `.claude/PRPs/templates/api_service.md` (if exists, else base)
- CLI tools → `.claude/PRPs/templates/cli_tool.md` (if exists, else base)
- AI agents → `.claude/PRPs/templates/prp_pydantic_ai_base.md`
- Default → `.claude/PRPs/templates/prp_base.md`
**Brownfield Adaptations**: Requirements must consider existing architecture, dependencies, and integration constraints

### Phase 2: System Architecture
**Agent**: `@backend-architect`
**Input**: `planning/REQUIREMENTS.md` + PROJECT_CONTEXT.md + EXISTING_ANALYSIS.md (if brownfield)
**Output**: `planning/ARCHITECTURE.md` with system design
**Adaptations**:
- **Greenfield**: Clean architecture patterns optimized for project type and scale
- **Brownfield**: Integration architecture respecting existing patterns, dependencies, and constraints

### Phase 3: Implementation Planning
**Agent**: `@project-task-planner`
**Input**: `planning/REQUIREMENTS.md` + `planning/ARCHITECTURE.md` + EXISTING_ANALYSIS.md (if brownfield)
**Output**: `planning/TASKS.md` with ordered implementation steps
**Dependencies**:
- **Greenfield**: Task sequencing based on project complexity and optimal development order
- **Brownfield**: Task sequencing considers existing code structure, regression testing, and integration points

### Phase 4: Parallel Implementation
**Coordinator**: `@universal-project-orchestrator`
**Dynamic Agent Selection**:
```yaml
Python Projects: [@python-pro]
JavaScript/TypeScript: [@javascript-pro, @typescript-pro]
React Applications: [@react-specialist, @frontend-designer]
API Services: [@backend-architect, @database-optimizer]
Infrastructure: [@terraform-specialist, @kubernetes-expert, @devops-troubleshooter]
AI Agents: [existing pydantic-ai-* specialists]
```
**Integration**: `@universal-integration-specialist` (use Task tool to invoke) connects all components

### Phase 5: Quality Assurance
**Coordinator**: `@universal-qa-coordinator` (use Task tool to invoke)
**Validation Team**:
- `@security-auditor` - Security validation across all components
- `@performance-engineer` - Performance testing and optimization
- Technology-specific validation by implementation specialists
**Output**: Comprehensive quality reports and validation results
**Testing Adaptations**:
- **Greenfield**: Focus on new functionality validation and performance benchmarks
- **Brownfield**: Include regression testing, integration validation, and existing system compatibility

### Phase 6: Delivery & Documentation
**Coordinator**: `@universal-project-orchestrator` (use Task tool to invoke)
**Final Steps**:
- Documentation validation and completion
- Deployment readiness verification
- User handoff with maintenance instructions
- TodoWrite completion and project summary

## 🔄 Workflow Context Adaptations

### Greenfield Project Workflow
**Characteristics**: New projects built from scratch
**Detection Patterns**: "Build new...", "Create from scratch...", "Develop a...", no existing codebase references
**Workflow Adaptations**:
- Skip codebase analysis in Phase 0
- Focus on optimal architecture and technology selection
- Implement clean, modern patterns without legacy constraints
- Comprehensive testing for new functionality
- Full documentation creation from scratch

### Brownfield Project Workflow
**Characteristics**: Enhancements to existing codebases
**Detection Patterns**: "Add to existing...", "Extend current...", "Integrate with...", references to existing systems
**Workflow Adaptations**:
- **Phase 0**: Mandatory codebase analysis using LS, Glob, and Grep tools
- **Planning**: All agents receive EXISTING_ANALYSIS.md for context-aware decisions
- **Architecture**: Respect existing patterns, dependencies, and constraints
- **Implementation**: Follow established code conventions and integration points
- **Testing**: Include regression testing and compatibility validation
- **Documentation**: Update existing docs rather than creating from scratch

### Bug Troubleshooting Workflow
**Characteristics**: Debugging and fixing existing issues
**Detection Patterns**: "Fix this bug...", "Debug my...", "Something's wrong with...", "Error in my..."
**Workflow Adaptations**:
- **Phase 0**: Immediate codebase analysis and error investigation
- **Planning**: Focus on root cause analysis and minimal impact fixes
- **Architecture**: Minimal changes - preserve existing system integrity
- **Implementation**: Targeted fixes with comprehensive testing
- **Testing**: Extensive regression testing and edge case validation
- **Documentation**: Update troubleshooting guides and error handling docs

### Feature Development Workflow
**Characteristics**: Adding new features to existing systems
**Detection Patterns**: "Implement [feature] in...", "Add [functionality] to...", "I need [feature] for my..."
**Workflow Adaptations**:
- **Phase 0**: Analyze existing system for optimal integration points
- **Planning**: Design feature to work harmoniously with existing architecture
- **Architecture**: Extend current patterns while maintaining system coherence
- **Implementation**: Feature flagging and gradual rollout strategies
- **Testing**: Feature-specific tests plus full regression suite
- **Documentation**: Feature documentation and updated user guides

**Critical Success Factors for All Contexts**:
- Analyze existing codebase structure before making any changes
- Follow established naming conventions and architectural patterns
- Ensure backward compatibility and regression testing
- Integrate seamlessly with existing systems and workflows

## 📋 Agent Coordination Protocols

### Shared Context Management
**Directory Structure**:
```
projects/[project_name]/
├── planning/
│   ├── PROJECT_CONTEXT.md    # Project type and greenfield/brownfield status
│   ├── EXISTING_ANALYSIS.md  # Brownfield codebase analysis (if applicable)
│   ├── REQUIREMENTS.md       # From @prd-writer
│   ├── ARCHITECTURE.md       # From @backend-architect
│   ├── TASKS.md             # From @project-task-planner
│   ├── INTEGRATION.md       # From @universal-integration-specialist
│   ├── TEST_STRATEGY.md     # From @universal-qa-coordinator
│   └── QUALITY_REPORT.md    # Final validation results
├── src/                     # Implementation by specialists
├── tests/                   # Test suites by @universal-qa-coordinator
├── deployment/             # Infrastructure by deployment specialists
└── docs/                   # Documentation
```

### TodoWrite Integration
**Task Management**: Create comprehensive tasks after Phase 0:
- "Requirements Analysis" → `@prd-writer`
- "System Architecture" → `@backend-architect`
- "Implementation Planning" → `@project-task-planner`
- "Core Implementation" → Technology specialists
- "Service Integration" → `@universal-integration-specialist` (use Task tool to invoke)
- "Quality Assurance" → `@universal-qa-coordinator` (use Task tool to invoke) + validation specialists
- "Final Delivery" → `@universal-project-orchestrator` (use Task tool to invoke)

**Status Updates**:
- Mark "in_progress" when starting each phase
- Mark "completed" only after validation passes
- Add subtasks when specialists discover additional work

### Error Handling & Recovery
**Context Preservation**: All decisions documented in planning/ files
**Failure Recovery**: Shared planning/ directory enables workflow resumption
**Quality Gates**: No phase proceeds until previous validation passes

## 🎛️ Project Type Specializations

### Web Applications
**Recognition**: "dashboard", "website", "web app", "frontend", "React app"
**Specialists**: `@frontend-designer`, `@react-specialist`, `@backend-architect`
**Focus**: UI/UX, responsive design, performance, SEO

### API Services
**Recognition**: "REST API", "GraphQL", "microservice", "backend service"
**Specialists**: `@backend-architect`, `@database-optimizer`, `@security-auditor`
**Focus**: Endpoints, data modeling, authentication, performance

### CLI Tools
**Recognition**: "command line", "CLI", "script", "automation tool"
**Specialists**: `@python-pro`, `@coding-coach`, `@performance-engineer`
**Focus**: User experience, cross-platform compatibility, performance

### AI Agents
**Recognition**: "AI agent", "chatbot", "LLM", "AI assistant"
**Workflow**: Delegates to existing Pydantic AI factory system
**Specialists**: `pydantic-ai-*` agent family

### Mobile Applications
**Recognition**: "mobile app", "React Native", "Flutter", "iOS", "Android"
**Specialists**: `@react-specialist`, `@performance-engineer`, `@security-auditor`
**Focus**: Platform compatibility, performance, user experience

## 🚫 Anti-Patterns to Avoid

- ❌ Never skip Phase 0 clarification - user input is critical
- ❌ Never proceed without shared planning/ directory setup
- ❌ Never let specialists work in isolation - maintain shared context
- ❌ Never skip quality gates - validation prevents technical debt
- ❌ Never deliver without comprehensive documentation

## 🎯 Quality Assurance

**Validation Requirements**:
- All specialists must reference shared planning/ context
- Every phase must update TodoWrite status
- Quality gates must pass before proceeding to next phase
- Final delivery requires comprehensive validation report

**Success Metrics**:
- Shared context maintained throughout workflow
- All project requirements validated and implemented
- Quality gates prevent delivery of incomplete projects
- Documentation enables easy handoff and maintenance
