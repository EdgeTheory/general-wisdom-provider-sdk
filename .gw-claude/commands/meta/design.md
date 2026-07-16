# Meta Design Command

Comprehensive system architecture and design using enhanced PRP framework with intelligent persona routing, design pattern analysis, and architectural best practices.

## Usage

```
/meta:design [SYSTEM] [OPTIONS]
```

## Arguments

- `SYSTEM`: System, architecture, or design challenge to address (required)

## Options

**Design Scope & Focus:**
- `--type [TYPE]`: Design type (architecture, system, api, database, ui, service) default: architecture
- `--scale [SCALE]`: Target scale (small, medium, large, enterprise, global) default: medium
- `--complexity [LEVEL]`: Design complexity (simple, moderate, complex, distributed) default: auto-assess
- `--domain [DOMAIN]`: Domain focus (web, mobile, embedded, distributed, ai/ml)

**Architecture & Patterns:**
- `--architecture [STYLE]`: Architecture style (monolith, microservices, serverless, event-driven)
- `--patterns [PATTERNS]`: Design patterns to consider (mvc, cqrs, event-sourcing, hexagonal)
- `--constraints [CONSTRAINTS]`: Design constraints (performance, security, compliance, budget)
- `--integration-style [STYLE]`: Integration approach (rest, graphql, grpc, event-driven)

**Subagent & Expertise Options:**
- `--lead-agent [AGENT]`: Lead design subagent (@backend-architect, @system-architect, @frontend-designer)
- `--auto-routing`: Enable automatic subagent routing based on design type (default: true)
- `--specialist-agents`: Include specialist subagents (@security-auditor, @performance-engineer, @database-optimizer)
- `--review-board`: Enable architecture review board with multiple expert subagents

**Quality & Standards Options:**
- `--design-standards [STANDARDS]`: Design quality standards (enterprise, standard, startup)
- `--compliance [REQUIREMENTS]`: Compliance requirements (gdpr, hipaa, sox, pci-dss)
- `--performance-targets [TARGETS]`: Performance requirements and SLAs
- `--security-level [LEVEL]`: Security requirements (basic, enhanced, enterprise, zero-trust)

**Documentation & Output Options:**
- `--output-format [FORMAT]`: Output format (markdown, c4-model, uml, architectural-decision-records)
- `--include-diagrams`: Generate architectural diagrams and visualizations
- `--create-adrs`: Create Architectural Decision Records for major decisions
- `--implementation-prps`: Generate implementation PRPs from design

**VCS Integration Options:**
- `--create-repository`: Create VCS repository for design documentation and implementation
- `--create-pr`: Create pull request after design completion and implementation PRP generation
- `--vcs-provider [PROVIDER]`: Specify VCS provider (bitbucket, github, gitlab) - uses active provider if not specified
- `--repo-name [NAME]`: Repository name (defaults to system name)
- `--design-branch [BRANCH]`: Branch name for design documentation (defaults to design/[system-name])

## Examples

### Enterprise System Architecture with Repository
```bash
/meta:design payment-platform --scale enterprise --architecture microservices --compliance pci-dss --create-adrs --create-repository --create-pr
```

### API Design with Implementation PRPs and VCS
```bash
/meta:design user-api --type api --integration-style rest --performance-targets high --implementation-prps --create-repository --vcs-provider github
```

### Database Architecture with Documentation Repository
```bash
/meta:design analytics-db --type database --scale large --patterns cqrs,event-sourcing --performance-targets high --create-repository --design-branch design/analytics-architecture
```

### UI/UX System Design with Design Repository
```bash
/meta:design design-system --type ui --consultant-personas --design-standards enterprise --include-diagrams --create-repository --create-pr --repo-name ui-design-system
```

### Distributed System Design with Full VCS Integration
```bash
/meta:design iot-platform --complexity distributed --scale global --security-level zero-trust --review-board --create-repository --create-pr --vcs-provider bitbucket --implementation-prps
```

## Implementation Workflow

The meta:design command orchestrates comprehensive design processes:

### Phase 1: Design Analysis & Requirements
1. **Requirements Analysis**: Analyze system requirements, constraints, and objectives
2. **Stakeholder Analysis**: Identify stakeholders and their design concerns
3. **Constraint Identification**: Technical, business, and regulatory constraints
4. **Quality Attribute Analysis**: Performance, security, scalability, maintainability requirements
5. **Domain Analysis**: Deep understanding of business domain and use cases

### Phase 2: Persona Routing & Expert Assembly
1. **Lead Architect Selection**: Choose primary design persona based on system type
2. **Specialist Consultation**: Identify required specialist personas (security, performance, etc.)
3. **Review Board Assembly**: Set up architecture review board if requested
4. **Domain Expert Integration**: Include domain-specific expertise where needed
5. **Stakeholder Representation**: Ensure all stakeholder perspectives are considered

### Phase 3: Design Process Execution
1. **Architecture Options Analysis**: Generate and evaluate multiple architectural approaches
2. **Design Pattern Application**: Apply appropriate design patterns and architectural styles
3. **Trade-off Analysis**: Comprehensive analysis of design trade-offs and decisions
4. **Risk Assessment**: Identify and mitigate architectural risks
5. **Iterative Refinement**: Refine design based on feedback and analysis

### Phase 4: Design Validation & Documentation
1. **Architecture Review**: Comprehensive review of design decisions and trade-offs
2. **Quality Attribute Validation**: Verify design meets quality requirements
3. **Compliance Validation**: Ensure design meets regulatory and compliance requirements
4. **Documentation Generation**: Create comprehensive architectural documentation
5. **Implementation Planning**: Generate implementation PRPs and roadmaps

## Design Approaches by Curated Subagent

### @backend-architect
- **API & Service Design**: RESTful APIs, microservice boundaries, database schemas
- **Scalability Planning**: Horizontal scaling, connection pooling, performance optimization
- **System Integration**: Service communication patterns, message queuing, event sourcing
- **Technology Stack**: Backend framework selection and architecture decisions

### @security-auditor
- **Security by Design**: OWASP compliance, vulnerability assessment, threat modeling
- **Authentication Architecture**: JWT, OAuth2, session management, access controls
- **Compliance Integration**: GDPR, HIPAA, SOX regulatory requirements
- **Risk Assessment**: Security risk analysis and mitigation strategies

### @database-optimizer
- **Data Architecture**: Schema design patterns, normalization, partitioning strategies
- **Performance Optimization**: Query optimization, indexing, connection pool tuning
- **Scalability Design**: Read replicas, sharding, distributed database architecture
- **Migration Planning**: Zero-downtime deployments, data transformation strategies

### @frontend-designer
- **Component Architecture**: Atomic design principles, design system creation
- **User Experience**: Accessibility-first design, responsive layouts, interaction patterns
- **Technology Integration**: Framework-specific implementations, state management
- **Performance Design**: Core Web Vitals, lazy loading, bundle optimization

### @devops-troubleshooter
- **Infrastructure Design**: Container orchestration, deployment strategies, monitoring
- **Operational Excellence**: Incident response planning, MTTR optimization, observability
- **Scalability Infrastructure**: Load balancing, auto-scaling, resource management
- **CI/CD Architecture**: Deployment pipelines, testing strategies, rollback procedures

### @performance-engineer
- **Performance Architecture**: End-to-end optimization, bottleneck identification
- **Scalability Analysis**: Load testing strategies, capacity planning, performance modeling
- **Resource Optimization**: Memory management, CPU utilization, network optimization
- **Monitoring Design**: APM integration, performance KPIs, alerting strategies

## Generated Design Artifacts

### Architecture Documentation
```markdown
# [SYSTEM] Architecture Design

## Executive Summary
- Business context and objectives
- Key architectural decisions and rationale
- Quality attributes and constraints
- Implementation roadmap and timeline

## System Architecture
- High-level system overview
- Component architecture and responsibilities
- Integration patterns and data flow
- Technology stack and infrastructure

## Design Decisions
- Major architectural decisions with rationale
- Trade-off analysis and alternatives considered
- Risk assessment and mitigation strategies
- Future evolution and scalability considerations

## Implementation Strategy
- Implementation phases and priorities
- Team structure and skill requirements
- Technology adoption and migration strategies
- Quality assurance and validation approach
```

### Architectural Decision Records (ADRs)
```markdown
# ADR-001: Database Architecture Selection

## Status
Accepted

## Context
Need to select database architecture for high-throughput analytics platform
with requirements for real-time queries and batch processing.

## Decision
Implement CQRS pattern with separate read/write databases:
- Write side: PostgreSQL for transactional consistency
- Read side: ClickHouse for analytical queries

## Consequences
**Positive:**
- Optimized performance for both transactional and analytical workloads
- Independent scaling of read and write workloads
- Clear separation of concerns

**Negative:**
- Increased complexity in data synchronization
- Additional operational overhead
- Eventual consistency considerations
```

### C4 Model Diagrams
When `--include-diagrams` is enabled:
- **Context Diagram**: System in its environment
- **Container Diagram**: High-level system containers
- **Component Diagram**: Components within containers
- **Code Diagram**: Key classes and relationships

## Design Quality Gates

### Architecture Review Gates
- **Requirements Compliance**: Design meets all stated requirements
- **Quality Attributes**: Performance, security, scalability requirements met
- **Design Consistency**: Consistent application of patterns and principles
- **Technology Alignment**: Technology choices support architectural goals

### Security Review Gates
- **Threat Model Validation**: Comprehensive threat analysis completed
- **Security Architecture**: Security controls integrated throughout design
- **Compliance Validation**: Regulatory requirements addressed
- **Risk Assessment**: Security risks identified and mitigated

### Performance Review Gates
- **Performance Modeling**: Performance characteristics analyzed and validated
- **Scalability Analysis**: Scaling approaches defined and validated
- **Resource Planning**: Resource requirements estimated and planned
- **Bottleneck Identification**: Potential bottlenecks identified and addressed

## Integration with Development Process

### Design-to-Implementation Pipeline
```bash
# Design phase with specific subagents
/meta:design payment-service --lead-agent @backend-architect --specialist-agents --implementation-prps --create-adrs

# Generated PRPs automatically created for implementation using curated subagents
/prp:execute payment-service-core     # Uses @backend-architect, @database-optimizer
/prp:execute payment-service-api      # Uses @backend-architect, @security-auditor
/prp:execute payment-security         # Uses @security-auditor
/prp:execute payment-frontend         # Uses @frontend-designer, @react-specialist
/prp:execute payment-infrastructure   # Uses @devops-troubleshooter, @kubernetes-expert
```

### Architecture Evolution Management
```bash
# Evolve existing architecture
/meta:design existing-system --type evolution --constraints backward-compatibility
```

### Design Review Process
```bash
# Architecture review board
/meta:design proposal --review-board --consultant-personas --create-adrs
```

## Success Metrics

A successful meta:design execution delivers:

- ✅ **Comprehensive Architecture**: Complete system design addressing all requirements
- ✅ **Quality Attribute Satisfaction**: All quality requirements (performance, security, etc.) addressed
- ✅ **Design Rationale**: Clear rationale for all major design decisions
- ✅ **Implementation Readiness**: Design ready for implementation with clear guidance
- ✅ **Risk Mitigation**: All significant risks identified and mitigation strategies defined
- ✅ **Stakeholder Alignment**: Design meets all stakeholder requirements and constraints
- ✅ **Documentation Quality**: Comprehensive, maintainable architectural documentation

## Advanced Design Features

### Multi-Perspective Analysis
Analyzes design from multiple viewpoints:
- **Functional View**: System functionality and behavior
- **Information View**: Data architecture and information flow
- **Concurrency View**: Process and thread architecture
- **Development View**: Code organization and development structure
- **Deployment View**: Physical deployment and infrastructure
- **Operational View**: System operation and administration

### Design Pattern Recommendation
Intelligent recommendation of:
- **Architectural Patterns**: Based on system requirements and constraints
- **Design Patterns**: For specific implementation challenges
- **Integration Patterns**: For system integration requirements
- **Anti-Pattern Avoidance**: Identification and avoidance of common anti-patterns

### Technology Stack Optimization
- **Technology Assessment**: Evaluation of technology options against requirements
- **Stack Integration**: Analysis of technology stack integration and compatibility
- **Future Evolution**: Technology evolution and migration planning
- **Vendor Risk Assessment**: Analysis of vendor lock-in and technology risks
