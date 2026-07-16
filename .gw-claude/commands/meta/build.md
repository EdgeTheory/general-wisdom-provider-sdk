# Meta Build Command

Intelligent feature development and implementation using enhanced PRP framework with automated PRP generation, persona routing, and quality assurance.

## Usage

```
/meta:build [FEATURE] [OPTIONS]
```

## Arguments

- `FEATURE`: Feature or component to build (required)

## Options

**Build Strategy Options:**
- `--type [TYPE]`: Build type (feature, component, api, service, integration) default: auto-detect
- `--approach [APPROACH]`: Development approach (iterative, waterfall, agile, prototype) default: iterative
- `--complexity [LEVEL]`: Complexity handling (simple, moderate, complex, enterprise) default: auto-assess

**Subagent & Expertise Options:**
- `--lead-agent [AGENT]`: Force specific lead subagent (@backend-architect, @frontend-designer, @python-pro, @react-specialist)
- `--auto-routing`: Enable automatic subagent routing based on feature analysis (default: true)
- `--expert-team`: Enable multi-subagent collaboration for complex features
- `--specialist-agents [AGENTS]`: Include specific specialist subagents (@security-auditor, @performance-engineer, @database-optimizer)

**PRP Generation & Management:**
- `--auto-prp`: Automatically generate PRPs for all components (default: true)
- `--prp-template [TEMPLATE]`: PRP template to use (enhanced, planning, task-based) default: enhanced
- `--decompose-complex`: Automatically decompose complex features into sub-PRPs
- `--parallel-prps`: Generate multiple PRPs for parallel development

**Quality & Validation Options:**
- `--testing-strategy [STRATEGY]`: Testing approach (tdd, bdd, integration-first, end-to-end)
- `--validation-gates [GATES]`: Quality gates (syntax, unit-tests, integration, security, performance)
- `--code-standards [STANDARDS]`: Code quality standards (strict, standard, relaxed) default: standard
- `--security-focus`: Enable security-first development approach

**Integration & Deployment Options:**
- `--integration-strategy [STRATEGY]`: Integration approach (continuous, staged, big-bang)
- `--deployment-ready`: Ensure build includes deployment configuration
- `--monitoring-setup`: Include monitoring and observability setup
- `--rollback-strategy`: Include rollback and recovery mechanisms

**VCS Integration Options:**
- `--create-repository`: Automatically create VCS repository after successful build
- `--create-pr`: Create pull request after implementation completion
- `--vcs-provider [PROVIDER]`: Specify VCS provider (bitbucket, github, gitlab) - uses active provider if not specified
- `--repo-name [NAME]`: Repository name (defaults to feature name)
- `--pr-description [TEXT]`: Custom pull request description

## Examples

### Full-Stack Feature Development
```bash
/meta:build user-dashboard --type feature --expert-team --specialist-agents @security-auditor,@performance-engineer --testing-strategy tdd
```

### API Service Build with VCS Integration
```bash
/meta:build payment-api --type api --lead-agent @backend-architect --specialist-agents @security-auditor,@database-optimizer --security-focus --deployment-ready --create-repository --create-pr
```

### Complex System Integration with PR Creation
```bash
/meta:build legacy-migration --complexity enterprise --expert-team --specialist-agents @security-auditor,@performance-engineer,@database-optimizer --decompose-complex --parallel-prps --create-pr --pr-description "Legacy system migration implementation"
```

### Frontend Component Library with Repository Setup
```bash
/meta:build design-system --type component --lead-agent @frontend-designer --specialist-agents @react-specialist,@performance-engineer --code-standards strict --create-repository --vcs-provider github
```

### Prototype Development with Automatic PR
```bash
/meta:build mvp-prototype --approach prototype --validation-gates syntax,integration --create-pr --repo-name mvp-prototype-v1
```

### Enterprise Feature with Full VCS Workflow
```bash
/meta:build enterprise-feature --complexity enterprise --create-repository --create-pr --vcs-provider bitbucket --pr-description "Enterprise feature implementation with comprehensive testing"
```

## Implementation Workflow

The meta:build command orchestrates comprehensive feature development:

### Phase 1: Feature Analysis & Planning
1. **Feature Assessment**: Analyze feature requirements, complexity, and scope
2. **Technology Stack Analysis**: Determine optimal technologies and frameworks
3. **Persona Routing**: Select appropriate lead persona and supporting experts
4. **Architecture Planning**: Design system architecture and integration points
5. **Decomposition Strategy**: Break complex features into manageable components

### Phase 2: PRP Generation & Orchestration
1. **Master PRP Creation**: Generate comprehensive master PRP for the feature
2. **Component PRP Generation**: Create sub-PRPs for individual components
3. **Dependency Mapping**: Map dependencies between PRPs and components
4. **Execution Planning**: Plan parallel and sequential execution strategies
5. **Quality Gate Integration**: Build quality gates into each PRP

### Phase 3: Intelligent Development Execution
1. **Parallel PRP Execution**: Execute independent components in parallel
2. **Progressive Integration**: Integrate components as they complete
3. **Continuous Validation**: Run quality gates at each integration point
4. **Automated Testing**: Execute comprehensive testing strategies
5. **Performance Optimization**: Optimize performance throughout development

### Phase 4: Quality Assurance & Deployment
1. **Comprehensive Testing**: Run full test suite including edge cases
2. **Security Validation**: Complete security assessment and hardening
3. **Performance Benchmarking**: Validate performance against requirements
4. **Integration Testing**: Test complete feature integration
5. **Deployment Preparation**: Prepare deployment configuration and monitoring

### Phase 5: VCS Integration & PR Creation (Optional)
1. **Repository Setup**: Create VCS repository if `--create-repository` specified
2. **Intelligent Branch Management**: Detect existing repos vs. new repo creation workflow
3. **Code Commit & Push**: Stage, commit, and push implementation to feature branch
4. **Pull Request Creation**: Create PR with generated title, description, and metadata if `--create-pr` specified
5. **VCS Provider Integration**: Use configured VCS provider or detect from existing repository

## Build Strategies by Complexity

### Simple Features
- **Single PRP Approach**: One comprehensive PRP with integrated validation
- **Direct Implementation**: Straightforward implementation with basic quality gates
- **Standard Testing**: Unit tests and basic integration testing
- **Quick Deployment**: Simplified deployment with basic monitoring

### Moderate Features
- **Multi-Component PRPs**: Separate PRPs for logical components
- **Iterative Development**: Build and validate in iterations
- **Comprehensive Testing**: Unit, integration, and end-to-end testing
- **Staged Deployment**: Phased deployment with rollback capabilities

### Complex Features
- **Hierarchical PRP Structure**: Master PRP with multiple sub-PRPs
- **Multi-Persona Collaboration**: Different experts for different components
- **Advanced Testing Strategies**: Property-based testing, chaos engineering
- **Blue-Green Deployment**: Zero-downtime deployment with full rollback

### Enterprise Features
- **Program-Level Orchestration**: Multiple related features and systems
- **Cross-Team Coordination**: Multiple personas and specialized experts
- **Enterprise Testing**: Compliance testing, security audits, performance testing
- **Enterprise Deployment**: Multi-environment, compliance-aware deployment

## Subagent-Specific Build Approaches

### @backend-architect Led Builds
- **System Design First**: API design, microservice boundaries, database schemas before implementation
- **Integration Focus**: Service communication patterns, message queuing, data flow optimization
- **Scalability Planning**: Horizontal scaling, connection pooling, performance architecture
- **Documentation Heavy**: Architecture diagrams, API specifications, deployment guides

### @frontend-designer Led Builds
- **User Experience First**: Component architecture, design system creation before backend
- **Accessibility Focus**: WCAG compliance, responsive design, interaction patterns built-in
- **Design System Driven**: Atomic design principles, reusable component libraries
- **Performance Optimization**: Core Web Vitals, bundle optimization, lazy loading strategies

### @security-auditor Led Builds
- **Security by Design**: OWASP compliance, vulnerability assessment in every component
- **Threat Modeling**: Comprehensive security architecture, authentication flows, risk analysis
- **Compliance Focus**: GDPR, HIPAA, SOX regulatory compliance and audit requirements
- **Penetration Testing**: Security validation and hardening throughout development

### @database-optimizer Led Builds
- **Data Model First**: Schema design patterns, query optimization, index strategies before application
- **Performance Focus**: Database performance optimization, connection pooling, caching strategies
- **Scalability Design**: Sharding strategies, read replicas, distributed database architecture
- **Migration Planning**: Zero-downtime deployments, data transformation strategies

### @performance-engineer Led Builds
- **Performance First**: Load testing, bottleneck identification, optimization strategies from start
- **Scalability Analysis**: Capacity planning, performance modeling, resource optimization
- **Monitoring Integration**: APM setup, performance KPIs, alerting strategies built-in
- **Optimization Patterns**: Caching layers, async processing, resource management

### @python-pro/@javascript-pro/@typescript-pro Led Builds
- **Language Excellence**: Advanced language patterns, framework best practices, performance optimization
- **Testing Strategy**: 90%+ test coverage, TDD/BDD approaches, comprehensive edge case testing
- **Code Quality**: Static analysis, type safety, maintainable architecture patterns
- **Performance Focus**: Language-specific optimization, async patterns, memory management

## Generated PRP Structure

The command generates comprehensive PRPs with:

### Master Feature PRP
```markdown
# [FEATURE] Implementation Master PRP

## Architecture Overview
- System design and component relationships
- Integration points and data flow
- Technology stack and framework choices
- Scalability and performance considerations

## Component Breakdown
- [Component A PRP] - Frontend dashboard interface
- [Component B PRP] - Backend API services
- [Component C PRP] - Database schema and data layer
- [Component D PRP] - Authentication and security

## Quality Gates
- Code quality standards and validation
- Testing strategies and coverage requirements
- Security validation and compliance checks
- Performance benchmarks and optimization

## Deployment Strategy
- Environment configuration and setup
- Deployment pipeline and automation
- Monitoring and observability setup
- Rollback and recovery procedures
```

### Component Sub-PRPs
Each component gets a detailed PRP with:
- Specific implementation requirements
- Technology and framework choices
- Integration interfaces and contracts
- Validation and testing strategies
- Domain-specific quality standards

## Integration with Development Pipeline

### CI/CD Integration
```bash
# In CI pipeline
/meta:build feature-branch --auto-prp --validation-gates all --deployment-ready
```

### Development Team Workflow
```bash
# Team lead initiates build with expert subagents
/meta:build new-feature --expert-team --specialist-agents @security-auditor,@performance-engineer --decompose-complex

# Individual developers execute component PRPs with specific subagents
/prp:execute component-a-frontend   # Uses @frontend-designer, @react-specialist
/prp:execute component-b-api        # Uses @backend-architect, @python-pro
/prp:execute component-c-database   # Uses @database-optimizer
/prp:execute component-d-security   # Uses @security-auditor
```

### Quality Assurance Workflow
```bash
# QA validation
/meta:build feature-validation --validation-gates all --testing-strategy end-to-end
```

## Success Metrics

A successful meta:build execution delivers:

- ✅ **Complete Feature Implementation**: All components implemented and integrated
- ✅ **Quality Standards Met**: All quality gates passed and code standards enforced
- ✅ **Comprehensive Testing**: Full test coverage with all testing strategies executed
- ✅ **Security Validation**: Security assessment passed with no critical vulnerabilities
- ✅ **Performance Requirements**: Performance benchmarks met or exceeded
- ✅ **Deployment Ready**: Complete deployment configuration and monitoring setup
- ✅ **Documentation Complete**: Comprehensive documentation for maintenance and operations

## Advanced Features

### Intelligent Decomposition
Automatically breaks down complex features into:
- **Independent Components**: Can be developed in parallel
- **Dependent Components**: Proper dependency ordering
- **Integration Components**: Handles component integration
- **Testing Components**: Comprehensive testing strategies

### Multi-Subagent Orchestration
Coordinates multiple expert subagents:
- **Lead Subagent**: Overall feature responsibility (@backend-architect, @frontend-designer)
- **Specialist Subagents**: Domain expertise (@security-auditor, @performance-engineer, @database-optimizer)
- **Language Subagents**: Implementation expertise (@python-pro, @javascript-pro, @typescript-pro, @react-specialist)
- **Quality Subagents**: Code quality and refactoring (@code-refactorer, @devops-troubleshooter)
- **Documentation Subagents**: Content and planning (@content-writer, @project-task-planner)

### Adaptive Quality Gates
Adjusts quality requirements based on:
- **Feature Complexity**: More gates for complex features
- **Risk Assessment**: Additional security/performance gates for high-risk features
- **Team Experience**: Adjusted standards based on team expertise
- **Business Criticality**: Enhanced validation for business-critical features
