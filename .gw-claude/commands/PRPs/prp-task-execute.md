# Execute TASK PRP

Run through a task list from an existing TASK PRP.
READ ALL CORE AND OPTIONAL MODULES PASSED TO YOU VIA THE CLAUDE.md FILE BEFORE STARTING THE PRP CREATION.

## PRP File: $ARGUMENTS

## Execution Process

1. **Load Tasks with Context Analysis**
   - Read task list and understand requirements
   - Use `@project-task-planner` to analyze task dependencies and execution order
   - Identify which specialized subagents are needed for implementation

2. **Execute Each Task with Expert Subagents**
   - **For Architecture Tasks**: Use `@backend-architect`, `@frontend-designer`, `@database-optimizer`
   - **For Language-Specific Tasks**: Use `@python-pro`, `@javascript-pro`, `@typescript-pro`, `@react-specialist`
   - **For Quality Tasks**: Use `@security-auditor`, `@code-refactorer`, `@performance-engineer`
   - **For Infrastructure Tasks**: Use `@devops-troubleshooter`, `@terraform-specialist`, `@kubernetes-expert`
   - **For Documentation Tasks**: Use `@content-writer`, `@prd-writer`

3. **Validation with Quality Gates**
   - Run VALIDATE steps using appropriate expert subagents
   - Use `@security-auditor` for security validation
   - Use `@performance-engineer` for performance validation
   - Use language specialists for code quality validation
   - Fix IF_FAIL issues with the same expert subagents

4. **Complete Checklist with Expert Review**
   - Verify all tasks completed using `@project-task-planner`
   - Final quality review with relevant specialist subagents
   - Ensure all deliverables meet expert standards
   - Run final validation
   - Check no regressions

Work through tasks sequentially, validating each.
