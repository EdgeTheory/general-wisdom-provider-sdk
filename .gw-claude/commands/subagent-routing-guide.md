# Subagent Routing Guide

This guide helps you choose the right curated subagent for specific tasks in PRPs and meta commands.

## Quick Reference

### Architecture & System Design
- `@backend-architect` - API design, microservices, system architecture, database schemas
- `@frontend-designer` - UI/UX design, component architecture, design systems
- `@database-optimizer` - Data modeling, query optimization, database architecture

### Language & Framework Specialists
- `@python-pro` - Advanced Python, async patterns, testing strategies, performance
- `@javascript-pro` - Modern JS/Node.js, async handling, browser compatibility
- `@typescript-pro` - Type-safe development, enterprise TypeScript patterns
- `@react-specialist` - React components, hooks, state management, performance

### Quality & Security
- `@security-auditor` - OWASP compliance, vulnerability assessment, authentication flows
- `@code-refactorer` - Code quality improvement, refactoring without breaking functionality
- `@performance-engineer` - Application optimization, load testing, scalability analysis

### Infrastructure & Operations
- `@devops-troubleshooter` - Infrastructure debugging, incident response, deployment issues
- `@terraform-specialist` - Infrastructure as code, cloud provisioning, resource management
- `@kubernetes-expert` - Container orchestration, service mesh, production deployments

### Content & Documentation
- `@content-writer` - Technical documentation, research synthesis, user guides
- `@prd-writer` - Product requirements, business analysis, stakeholder alignment
- `@project-task-planner` - Project breakdown, implementation planning, task orchestration
- `@coding-coach` - Collaborative development, vision-to-code translation

## Task-to-Subagent Mapping

### For PRP Creation Tasks

#### Codebase Analysis
```markdown
**Architecture Review:**
- System design patterns → `@backend-architect`
- Frontend patterns → `@frontend-designer`
- Data layer analysis → `@database-optimizer`

**Code Quality Analysis:**
- Python codebase → `@python-pro`
- JavaScript/Node.js → `@javascript-pro`
- TypeScript projects → `@typescript-pro`
- React applications → `@react-specialist`

**Security & Performance:**
- Security patterns → `@security-auditor`
- Code quality issues → `@code-refactorer`
- Performance bottlenecks → `@performance-engineer`

**Infrastructure Analysis:**
- Deployment patterns → `@devops-troubleshooter`
- Infrastructure code → `@terraform-specialist`
- Container setups → `@kubernetes-expert`
```

#### External Research
```markdown
**Documentation Research:**
- Technical writing → `@content-writer`
- Requirements gathering → `@prd-writer`

**Implementation Planning:**
- Task breakdown → `@project-task-planner`
- Collaborative development → `@coding-coach`
```

### For Meta Design Commands

#### Lead Agent Selection
```markdown
**By Design Type:**
- API/Backend systems → `@backend-architect`
- Frontend/UI systems → `@frontend-designer`
- Data-heavy systems → `@database-optimizer`

**By Complexity:**
- Distributed systems → `@backend-architect` + `@devops-troubleshooter`
- High-performance systems → `@performance-engineer` + specialists
- Security-critical → `@security-auditor` + domain experts
```

#### Specialist Consultation
```markdown
**Always Include:**
- Security review → `@security-auditor`
- Performance analysis → `@performance-engineer`

**Technology-Specific:**
- Python services → `@python-pro`
- JavaScript/Node.js → `@javascript-pro`
- React frontends → `@react-specialist`
- Infrastructure → `@devops-troubleshooter`
- Containers → `@kubernetes-expert`
- Cloud resources → `@terraform-specialist`
```

## Common Patterns

### Full-Stack Feature Development
```bash
# Architecture design
@backend-architect    # API design and data flow
@frontend-designer    # UI/UX component design
@database-optimizer   # Data model optimization

# Implementation planning
@project-task-planner # Break down into implementable tasks
@security-auditor     # Security review and requirements

# Technology-specific implementation
@python-pro          # Backend service implementation
@react-specialist    # Frontend component implementation
@devops-troubleshooter # Deployment and infrastructure
```

### System Migration/Modernization
```bash
# Analysis phase
@code-refactorer     # Analyze existing code quality
@security-auditor    # Security gap analysis
@performance-engineer # Performance bottleneck identification

# Architecture redesign
@backend-architect   # Modern architecture patterns
@database-optimizer  # Data layer modernization
@devops-troubleshooter # Infrastructure modernization

# Implementation
@project-task-planner # Migration task planning
@coding-coach        # Collaborative implementation support
```

### Security Enhancement
```bash
# Primary analysis
@security-auditor    # Comprehensive security audit

# Supporting analysis
@backend-architect   # Secure architecture patterns
@database-optimizer  # Data security and access patterns
@devops-troubleshooter # Infrastructure security

# Implementation support
@python-pro          # Secure Python implementation
@javascript-pro      # Frontend security patterns
```

## Best Practices

### Subagent Invocation
- **Use `@agent-name` syntax** for explicit invocation
- **Match expertise to task complexity** - don't over-engineer simple tasks
- **Combine specialists** for complex multi-domain problems
- **Sequential consultation** - architecture first, then implementation details

### Task Delegation Strategy
1. **Start with architecture** - `@backend-architect`, `@frontend-designer`, `@database-optimizer`
2. **Add quality gates** - `@security-auditor`, `@performance-engineer`
3. **Technology-specific analysis** - language and framework specialists
4. **Implementation planning** - `@project-task-planner`, `@coding-coach`
5. **Operations planning** - `@devops-troubleshooter`, infrastructure specialists

### Quality Assurance Flow
```markdown
**Pre-Implementation:**
@security-auditor     → Security requirements
@performance-engineer → Performance requirements
@code-refactorer     → Code quality standards

**During Implementation:**
@{language}-pro      → Language-specific best practices
@{framework}-specialist → Framework-specific patterns

**Post-Implementation:**
@security-auditor     → Security validation
@performance-engineer → Performance validation
@devops-troubleshooter → Deployment validation
```

## Integration Examples

### In PRP Commands
```markdown
## Research Process

**Architecture Analysis:**
Invoke `@backend-architect` to analyze existing API patterns and microservice boundaries.
Invoke `@database-optimizer` to review data access patterns and schema design.

**Security Review:**
Invoke `@security-auditor` to identify authentication flows and security patterns.
Review OWASP compliance and vulnerability assessment approaches.

**Implementation Planning:**
Invoke `@project-task-planner` to break down feature into implementable tasks.
Invoke `@python-pro` for Python-specific implementation patterns and testing approaches.
```

### In Meta Commands
```bash
# Design command with explicit routing
/meta:design user-service \
  --lead-agent @backend-architect \
  --specialist-agents @security-auditor,@performance-engineer,@database-optimizer \
  --review-board

# Generates design with input from:
# - @backend-architect (lead): Overall system design
# - @security-auditor: Security architecture and threat modeling
# - @performance-engineer: Performance requirements and optimization
# - @database-optimizer: Data architecture and optimization strategies
```

---

**Remember**: Our curated subagents are experts in their domains. Use them strategically to get the best results for your specific tasks and challenges.
