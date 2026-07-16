# Create BASE PRP

## Feature: $ARGUMENTS

Generate a complete PRP for feature implementation with deep and thorough research. Ensure rich context is passed to the AI through the PRP to enable one pass implementation success through self-validation and iterative refinement.

READ ALL CORE AND OPTIONAL MODULES PASSED TO YOU VIA THE .claude/CLAUDE.md FILE BEFORE STARTING THE PRP CREATION.

The AI agent only gets the context you are appending to the PRP and its own training data. Assume the AI agent has access to the codebase and the same knowledge cutoff as you, so its important that your research findings are included or referenced in the PRP. The Agent has Websearch capabilities, so pass urls to documentation and examples.
Start by reading and understanding the prp concepts .claude/PRPs/README.md

## Research Process

> During the research process, leverage our curated subagents by invoking them with `@agent-name` to get specialized expertise. Match tasks to the right expert for maximum effectiveness.
Assign tasks to experts in parallel where ever possible to optimize for efficiency as long as it doesnt compromise on quality.
Some are listed below as examples, but do not constrain yourself to these if another registered agent is a better fit for a task.

### 1. **Codebase Analysis with Expert Subagents**

**Architecture & Design Analysis:**
- `@backend-architect` - For API design, microservices, database schemas, system architecture
- `@frontend-designer` - For UI/UX components, design system integration
- `@database-optimizer` - For data layer analysis, query patterns, schema design

**Code Pattern Analysis:**
- `@python-pro` - For Python-specific patterns, testing approaches, performance optimization
- `@javascript-pro` - For JavaScript/Node.js patterns, async handling, browser compatibility
- `@typescript-pro` - For TypeScript patterns, type safety, enterprise development
- `@react-specialist` - For React components, hooks, state management patterns

**Quality & Security Review:**
- `@security-auditor` - For security patterns, authentication flows, vulnerability assessment
- `@code-refactorer` - For existing code quality analysis, refactoring opportunities
- `@performance-engineer` - For performance patterns, optimization strategies

**Infrastructure & DevOps:**
- `@devops-troubleshooter` - For deployment patterns, infrastructure analysis
- `@terraform-specialist` - For infrastructure as code patterns
- `@kubernetes-expert` - For containerization and orchestration patterns

### 2. **External Research with Specialized Agents**

**Research & Documentation:**
- `@content-writer` - For researching and synthesizing documentation, best practices articles
- Use WebFetch capabilities to gather current documentation and examples
- For critical documentation, create `.md` files in `PRPs/ai_docs/` with agent research results

**Planning & Task Breakdown:**
- `@project-task-planner` - For breaking down feature implementation into detailed tasks
- `@prd-writer` - For requirements analysis and specification clarification

3. **User Clarification**
   - Ask for clarification if you need it

## PRP Generation
Use .claude/PRPs/examples as examples of full fleshed out PRPs

### Critical Context at minimum to Include and pass to the AI agent as part of the PRP

- **Documentation**: URLs with specific sections
- **Code Examples**: Real snippets from codebase, always check the examples dir for examples of working code
- **Gotchas**: Library quirks, version issues
- **Patterns**: Existing approaches to follow
- **Best Practices**: Common pitfalls found during research

## PRP Generation Process

### Step 1: Choose Template

Use .claude/PRPs/templates/prp_base.md as your template structure - it contains all necessary sections and formatting.
Use .claude/PRPs/examples as examples of full fleshed out PRPs

### Step 2: Context Completeness Validation

Before writing, apply the **"No Prior Knowledge" test** from the template:
_"If someone knew nothing about this codebase, would they have everything needed to implement this successfully?"_

### Step 3: Research Integration

Transform your research findings into the template sections:

**Goal Section**: Use research to define specific, measurable Feature Goal and concrete Deliverable
**Context Section**: Populate YAML structure with your research findings - specific URLs, file patterns, gotchas
**Implementation Tasks**: Create dependency-ordered tasks using information-dense keywords from codebase analysis
**Validation Gates**: Use project-specific validation commands that you've verified work in this codebase

### Step 4: Information Density Standards

Ensure every reference is **specific and actionable**:

- URLs include section anchors, not just domain names
- File references include specific patterns to follow, not generic mentions
- Task specifications include exact naming conventions and placement
- Validation commands are project-specific and executable

### Step 5: ULTRATHINK Before Writing

After research completion, create comprehensive PRP writing plan using TodoWrite tool:

- Plan how to structure each template section with your research findings
- Identify gaps that need additional research
- Create systematic approach to filling template with actionable context


## Output

Save as: `.claude/PRPs/{feature-name}.md`

## PRP Quality Gates

### Context Completeness Check

- [ ] Passes "No Prior Knowledge" test from template
- [ ] All YAML references are specific and accessible
- [ ] Implementation tasks include exact naming and placement guidance
- [ ] Validation commands are project-specific and verified working

### Template Structure Compliance

- [ ] All required template sections completed
- [ ] Goal section has specific Feature Goal, Deliverable, Success Definition
- [ ] Implementation Tasks follow dependency ordering
- [ ] Final Validation Checklist is comprehensive

### Information Density Standards

- [ ] No generic references - all are specific and actionable
- [ ] File patterns point at specific examples to follow
- [ ] URLs include section anchors for exact guidance
- [ ] Task specifications use information-dense keywords from codebase

## Success Metrics

**Confidence Score**: Rate 1-10 for one-pass implementation success likelihood

**Validation**: The completed PRP should enable an AI agent unfamiliar with the codebase to implement the feature successfully using only the PRP content and codebase access.
