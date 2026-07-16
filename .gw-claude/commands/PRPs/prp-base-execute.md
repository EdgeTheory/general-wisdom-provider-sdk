# Execute BASE PRP

## PRP File: $ARGUMENTS

## Mission: One-Pass Implementation Success

PRPs enable working code on the first attempt through:

- **Context Completeness**: Everything needed, nothing guessed
- **Progressive Validation**: 4-level gates catch errors early
- **Pattern Consistency**: Follow existing codebase approaches
- Read PRPs/README.md to understand PRP concepts

**Your Goal**: Transform the PRP into working code that passes all validation gates.

## Execution Process

1. **Load PRP**
   - Read the specified PRP file completely, stored under .claude/PRPs/ and passed in as an arg to this command
   - Absorb all context, patterns, requirements and gather codebase intelligence
   - Use the provided documentation references and file patterns, consume the right documentation before the appropriate todo/task
   - Trust the PRP's context and guidance - it's designed for one-pass success
   - If needed do additional codebase exploration and research as needed

2. **ULTRATHINK & Plan with Expert Subagents**
   - Create comprehensive implementation plan following the PRP's task order
   - Break down into clear todos using TodoWrite tool
   - **Route tasks to expert subagents** based on implementation domain:
   Chop through the tasks in parallel where possible to maximize efficiency, while ensuring not to compromise on quality
   Some are listed below as examples, but do not constrain yourself to these if another registered agent is a better fit for a task.
     - **Architecture**: `@backend-architect`, `@frontend-designer`, `@database-optimizer`
     - **Languages**: `@python-pro`, `@javascript-pro`, `@typescript-pro`, `@react-specialist`
     - **Quality**: `@security-auditor`, `@code-refactorer`, `@performance-engineer`
     - **Infrastructure**: `@devops-troubleshooter`, `@terraform-specialist`, `@kubernetes-expert`
     - **Documentation**: `@content-writer`, `@prd-writer`
   - Follow the patterns referenced in the PRP with expert guidance
   - Use specific file paths, class names, and method signatures from PRP context
   - Never guess - always verify codebase patterns with appropriate specialist subagents

3. **Execute Implementation with Expert Subagents**
   - Follow the PRP's Implementation Tasks sequence with expert guidance
   - **Use specialized subagents for implementation**:
     - **Backend code**: `@python-pro`, `@javascript-pro`, `@typescript-pro` for language-specific implementation
     - **Frontend code**: `@react-specialist`, `@frontend-designer` for UI components and interactions
     - **Database code**: `@database-optimizer` for schema, queries, and data access patterns
     - **Infrastructure**: `@terraform-specialist`, `@kubernetes-expert` for deployment and scaling
     - **Security**: `@security-auditor` for authentication, authorization, and secure coding
   - Create files in locations specified by codebase tree with expert validation
   - Apply naming conventions with specialist guidance from relevant subagents

4. **Progressive Validation with Expert Review**

   **Execute the level validation system from the PRP with subagent expertise:**
   - **Level 1**: Syntax & style validation using language specialists (`@python-pro`, `@javascript-pro`, `@typescript-pro`)
   - **Level 2**: Unit test validation with testing expertise from relevant language specialists
   - **Level 3**: Integration testing with `@performance-engineer` for performance validation
   - **Level 4**: Security and quality validation using `@security-auditor` and `@code-refactorer`

   **Expert validation at each level:**
   - Use `@security-auditor` for security validation at every level
   - Use `@performance-engineer` for performance impact assessment
   - Use appropriate language specialists for code quality verification
   - **Each level must pass expert review before proceeding to the next.**

5. **Completion Verification**
   - Work through the Final Validation Checklist in the PRP
   - Verify all Success Criteria from the "What" section are met
   - Confirm all Anti-Patterns were avoided
   - Implementation is ready and working

**Failure Protocol**: When validation fails, use the patterns and gotchas from the PRP to fix issues, then re-run validation until passing.

6. **VCS Integration & PR Creation (Automatic)**
   - **ENHANCED VCS WORKFLOW**: Intelligent detection and integration with existing repositories
   - **Multi-Provider Support**: GitHub, GitLab, and Bitbucket integration
   - **Smart Branch Management**: Feature branches and PR creation
   - **🚀 AUTOMATIC BEHAVIOR**: VCS integration now runs automatically after successful PRP execution

   **Automatic VCS Integration**:
   After successful PRP implementation, **CLAUDE SHOULD AUTOMATICALLY ATTEMPT**:

   1. **Check VCS Configuration**: Run `code-agent vcs validate` to check if providers are configured
   2. **If VCS Configured**: Automatically run `code-agent vcs push-and-pr . [PRP-NAME] --create-pr --description "Implementation of [PRP-NAME]: [brief-description]"`
   3. **If Not Configured**: Prompt user to run `code-agent vcs setup` for future PRPs
   4. **Safety Checks**: Always use appropriate flags (--force-new-repo if in framework repository)
   5. **Error Handling**: If automatic VCS integration fails, provide manual commands to user

   **The system automatically**:
   - Detects if VCS providers are configured
   - Creates repository if needed or detects existing repository
   - Creates feature branch with PRP name
   - Commits implementation with descriptive message
   - Creates pull request with PRP details and requirements

   **Manual VCS Integration** (if automatic fails or not configured):
   ```bash
   # Using the new VCS commands (recommended)
   code-agent vcs push-and-pr . [feature-name] --create-pr --description "Implementation of [PRP-NAME]"

   # Setup VCS integration first if not configured
   code-agent vcs setup
   ```

   **Intelligent Workflow Detection**:
   - 🔍 **Existing repo detected**: Creates `feature/[feature-name]` branch, commits changes, creates PR in existing repo
   - 🆕 **No repo detected**: Creates new repository, sets up feature branch, creates PR in new repo
   - 🛡️ **Safety check**: Prevents interference with main code-agent framework repository
   - 🔄 **Multi-provider**: Detects repository provider and uses appropriate API

   **VCS Configuration Options**:
   ```bash
   # Interactive setup (recommended)
   code-agent vcs setup

   # Manual provider configuration
   code-agent vcs configure bitbucket --workspace myworkspace --project-key PROJ --token $BITBUCKET_TOKEN --username myuser --email my@email.com

   # Validate configuration
   code-agent vcs validate
   ```

   **Advanced PR Creation**:
   ```bash
   # Create PR with custom options
   code-agent vcs create-pr myrepo/myproject "Feature: Implementation" --source-branch feature/my-feature --description "Detailed PR description"

   # Push code and create PR in one step
   code-agent vcs push-and-pr ./src my-feature --pr-title "Feature: My Feature" --description "Implementation details"
   ```

7. **Reference the PRP**
   - You can always reference the PRP again if needed

Note: If validation fails, use error patterns in PRP to fix and retry.
