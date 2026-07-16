# Meta Analysis Command

Comprehensive analysis of codebases, architectures, and systems using enhanced PRP framework with intelligent persona routing and MCP integration.

## Usage

```
/meta:analyze [TARGET] [OPTIONS]
```

## Arguments

- `TARGET`: What to analyze (codebase, architecture, performance, security, dependencies, etc.)

## Options

**Analysis Scope:**
- `--depth [LEVEL]`: Analysis depth (surface, deep, comprehensive, expert) default: deep
- `--focus [AREAS]`: Comma-separated focus areas (security, performance, architecture, code-quality)
- `--include-dependencies`: Include dependency analysis and vulnerability scanning
- `--historical-analysis`: Include git history and evolution patterns

**Subagent & Expertise Options:**
- `--lead-agent [AGENT]`: Force specific subagent (@backend-architect, @security-auditor, @performance-engineer, @frontend-designer)
- `--auto-routing`: Enable automatic subagent routing based on analysis target (default: true)
- `--multi-expert`: Enable multiple expert subagent perspectives on complex analyses

**MCP Integration Options:**
- `--enable-context7`: Enable Context7 for documentation research and best practices
- `--enable-sequential`: Enable Sequential for complex architectural analysis
- `--research-depth [LEVEL]`: Documentation research depth (basic, comprehensive) default: comprehensive

**Output & Reporting Options:**
- `--output-format [FORMAT]`: Output format (markdown, json, html-report, executive-summary) default: markdown
- `--create-prp`: Automatically create implementation PRPs based on findings
- `--generate-roadmap`: Create improvement roadmap with prioritized tasks
- `--actionable-insights`: Focus on actionable recommendations

**VCS Integration Options:**
- `--create-repository`: Create VCS repository for analysis results and implementation PRPs
- `--create-pr`: Create pull request with analysis results and improvement recommendations
- `--vcs-provider [PROVIDER]`: Specify VCS provider (bitbucket, github, gitlab) - uses active provider if not specified
- `--analysis-branch [BRANCH]`: Branch name for analysis results (defaults to analysis/[timestamp])
- `--include-implementation-tracking`: Create issues/tasks for each recommendation in VCS provider

**Advanced Analysis Options:**
- `--performance-profiling`: Include performance bottleneck analysis
- `--security-assessment`: Comprehensive security vulnerability assessment
- `--technical-debt`: Technical debt analysis and quantification
- `--scalability-review`: Scalability and growth constraint analysis

## Examples

### Comprehensive Codebase Analysis with Repository Creation
```bash
/meta:analyze codebase --depth comprehensive --auto-routing --multi-expert --create-prp --create-repository --create-pr
```

### Security-Focused Analysis with VCS Integration
```bash
/meta:analyze security --lead-agent @security-auditor --include-dependencies --actionable-insights --create-repository --vcs-provider github --include-implementation-tracking
```

### Architecture Review with Roadmap Repository
```bash
/meta:analyze architecture --lead-agent @backend-architect --multi-expert --generate-roadmap --create-repository --create-pr --analysis-branch architecture-review-2024
```

### Performance Analysis with Implementation Tracking
```bash
/meta:analyze performance --lead-agent @performance-engineer --performance-profiling --depth expert --create-prp --create-repository --include-implementation-tracking
```

### Legacy System Assessment with Full VCS Workflow
```bash
/meta:analyze codebase --historical-analysis --technical-debt --scalability-review --output-format html-report --create-repository --create-pr --vcs-provider bitbucket --generate-roadmap
```

## Implementation

The meta:analyze command orchestrates comprehensive analysis through the enhanced PRP framework:

### Phase 1: Analysis Planning
1. **Target Assessment**: Analyze the requested analysis target and scope
2. **Persona Selection**: Route to appropriate domain expert(s) based on analysis type
3. **MCP Initialization**: Initialize required MCP servers for research enhancement
4. **Analysis PRP Generation**: Create specialized analysis PRP based on target and options

### Phase 2: Enhanced Research
1. **Context7 Integration**: Fetch relevant documentation, best practices, and industry standards
2. **Sequential Analysis**: Perform complex multi-step analysis for architectural concerns
3. **Domain Research**: Gather domain-specific knowledge and expert patterns
4. **Comparative Analysis**: Compare against industry benchmarks and standards

### Phase 3: Deep Analysis Execution
1. **Automated Code Scanning**: Comprehensive code quality, security, and performance scanning
2. **Architecture Assessment**: System design analysis with scalability and maintainability review
3. **Dependency Analysis**: Full dependency tree analysis with vulnerability assessment
4. **Pattern Recognition**: Identify code patterns, anti-patterns, and improvement opportunities

### Phase 4: Expert Synthesis
1. **Multi-Perspective Integration**: Combine insights from multiple expert personas if applicable
2. **Priority Assessment**: Rank findings by impact, effort, and risk
3. **Actionable Recommendations**: Generate specific, implementable improvement suggestions
4. **Roadmap Generation**: Create prioritized improvement roadmap with timelines

## Analysis Capabilities by Curated Subagent

### @backend-architect
- **System Design Analysis**: API patterns, microservice boundaries, coupling analysis
- **Scalability Assessment**: Horizontal scaling patterns, connection pooling, performance architecture
- **Technology Stack Review**: Backend framework analysis and modernization opportunities
- **Integration Analysis**: Service communication, message queuing, data flow optimization

### @security-auditor
- **Vulnerability Assessment**: OWASP Top 10 analysis, security weaknesses, exploit vectors
- **Authentication/Authorization**: JWT, OAuth2, session management, access control patterns
- **Data Protection**: Encryption analysis, privacy compliance (GDPR, HIPAA), secure coding
- **Dependency Security**: Third-party library vulnerabilities, supply chain security

### @performance-engineer
- **Bottleneck Identification**: Performance constraints, optimization opportunities, profiling analysis
- **Resource Usage**: Memory, CPU, I/O efficiency analysis, resource allocation patterns
- **Scalability Limits**: Load testing analysis, capacity planning, performance under stress
- **Optimization Strategies**: Caching strategies, async patterns, database optimization

### @frontend-designer
- **User Experience**: UI/UX patterns, accessibility compliance (WCAG), interaction analysis
- **Performance Metrics**: Bundle size analysis, Core Web Vitals, loading performance
- **Modern Practices**: Component architecture, design system analysis, responsive design
- **Framework Analysis**: React patterns, state management, component lifecycle optimization

### @database-optimizer
- **Schema Analysis**: Database design patterns, normalization analysis, relationship optimization
- **Query Performance**: Slow query identification, index optimization, execution plan analysis
- **Scalability Design**: Sharding strategies, read replicas, connection pool optimization
- **Migration Analysis**: Schema evolution, data transformation strategies, zero-downtime updates

### @code-refactorer
- **Code Quality Analysis**: Technical debt identification, maintainability assessment
- **Pattern Recognition**: Design patterns, anti-patterns, refactoring opportunities
- **Structure Assessment**: Code organization, modularity, separation of concerns
- **Improvement Strategies**: Systematic refactoring approaches, complexity reduction

### @devops-troubleshooter
- **Infrastructure Analysis**: Deployment patterns, container analysis, orchestration review
- **Operational Excellence**: Monitoring setup, incident response patterns, MTTR analysis
- **CI/CD Assessment**: Pipeline efficiency, deployment strategies, testing integration
- **Scalability Infrastructure**: Load balancing, auto-scaling, resource management

## Output Formats

### Markdown Report (Default)
Comprehensive analysis with sections for findings, recommendations, and next steps.

### JSON Output
```json
{
  "analysis_id": "uuid",
  "target": "codebase",
  "persona": {"primary": "architect", "secondary": ["security"], "confidence": 0.92},
  "findings": {
    "critical": [{"type": "security", "description": "...", "impact": "high"}],
    "major": [{"type": "performance", "description": "...", "effort": "medium"}],
    "minor": [{"type": "code-quality", "description": "...", "priority": "low"}]
  },
  "recommendations": [
    {"title": "API Security Hardening", "priority": 1, "effort": "high", "impact": "critical"}
  ],
  "metrics": {
    "code_quality_score": 7.2,
    "security_score": 6.8,
    "performance_score": 8.1,
    "maintainability_score": 7.5
  }
}
```

### Executive Summary
High-level executive summary focusing on business impact and strategic recommendations.

### HTML Report
Rich interactive report with visualizations, code examples, and detailed recommendations.

## Automated PRP Generation

When `--create-prp` is enabled, the analysis automatically generates implementation PRPs:

- **Security Hardening PRP**: If security issues found
- **Performance Optimization PRP**: If performance bottlenecks identified
- **Architecture Refactoring PRP**: If architectural improvements needed
- **Code Quality PRP**: If code quality issues detected
- **Dependency Upgrade PRP**: If outdated dependencies found

## Integration with Development Workflow

The analysis integrates with existing development workflows:

### CI/CD Integration
```bash
/meta:analyze codebase --output-format json --actionable-insights --ci-mode
```

### Pull Request Analysis
```bash
/meta:analyze security --focus security,code-quality --include-dependencies
```

### Architecture Review Process
```bash
/meta:analyze architecture --multi-persona --generate-roadmap --output-format html-report
```

## Success Metrics

A successful analysis provides:

- ✅ **Comprehensive Coverage**: All requested analysis areas covered
- ✅ **Expert-Level Insights**: Domain-specific expertise applied appropriately
- ✅ **Actionable Recommendations**: Specific, implementable improvement suggestions
- ✅ **Prioritized Findings**: Issues ranked by impact, effort, and business value
- ✅ **Implementation Guidance**: Clear next steps and improvement roadmap
- ✅ **Quality Metrics**: Quantified assessment scores and benchmarks
