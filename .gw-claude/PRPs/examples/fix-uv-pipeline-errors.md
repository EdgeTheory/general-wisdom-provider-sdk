# PRP: Fix uv Command Not Found Errors in Bitbucket Pipeline

## Context

```yaml
context:
  docs:
    - url: https://docs.astral.sh/uv/guides/integration/docker/
      focus: uv installation in containers
    - url: https://support.atlassian.com/bitbucket-cloud/docs/variables-and-secrets/
      focus: environment variables in pipelines

  patterns:
    - file: bitbucket-pipelines.yml
      copy: existing uv installation pattern to analyze

  gotchas:
    - issue: "PATH export doesn't persist between script lines"
      fix: "Use source $HOME/.cargo/env instead"
    - issue: "Missing import os in Python scripts"
      fix: "Always import required modules explicitly"
    - issue: "uv binary location varies by installation method"
      fix: "Use the env file created by installer"
```

## Task Structure

### SETUP TASKS

**ANALYZE bitbucket-pipelines.yml:**
  - OPERATION: Read pipeline configuration to identify all uv usage locations
  - VALIDATE: Count total steps using uv commands
  - IF_FAIL: Check file exists and has proper permissions
  - ROLLBACK: N/A (read-only operation)

**RESEARCH patterns/existing-solutions:**
  - OPERATION: Search for similar uv installation patterns in other projects
  - VALIDATE: Confirm best practices for Bitbucket Pipelines + uv
  - IF_FAIL: Use official uv documentation as fallback
  - ROLLBACK: N/A (research only)

### CORE CHANGES

**FIX security-scan step (line ~16):**
  - OPERATION: Replace `export PATH="$HOME/.cargo/bin:$PATH"` with `source $HOME/.cargo/env`
  - VALIDATE: uv run --with bandit --help (dry run)
  - IF_FAIL: Check if .cargo/env exists after curl install
  - ROLLBACK: Revert to original PATH export

**FIX test step (line ~30):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: uv sync --dry-run command
  - IF_FAIL: Verify uv installation completed successfully
  - ROLLBACK: Revert to original PATH export

**FIX build-package step (line ~46):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: uv build --help command
  - IF_FAIL: Check build requirements in pyproject.toml
  - ROLLBACK: Revert to original PATH export

**FIX publish-codeartifact step (line ~57):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: Check AWS CLI and twine still work after change
  - IF_FAIL: Verify all required tools available in PATH
  - ROLLBACK: Revert to original PATH export

**FIX publish-self-hosted step (line ~83):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: uv run --with boto3 --help command
  - IF_FAIL: Check boto3 package availability
  - ROLLBACK: Revert to original PATH export

**FIX develop-branch step (line ~150):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: uv run python --version command
  - IF_FAIL: Check Python script syntax
  - ROLLBACK: Revert to original PATH export

**FIX develop-branch-python-script (line ~155):**
  - OPERATION: Add missing `import os` to Python inline script
  - VALIDATE: Python syntax check with `python -m py_compile`
  - IF_FAIL: Check environment variable access patterns
  - ROLLBACK: Remove import os line

**FIX release-tag step (line ~192):**
  - OPERATION: Replace PATH export with source .cargo/env
  - VALIDATE: uv run python --version command
  - IF_FAIL: Check version extraction logic
  - ROLLBACK: Revert to original PATH export

### VALIDATION TASKS

**VALIDATE yaml-syntax:**
  - OPERATION: Run `uv run --with pyyaml python -c "import yaml; yaml.safe_load(open('bitbucket-pipelines.yml'))"`
  - VALIDATE: No YAML parsing errors
  - IF_FAIL: Fix YAML indentation/syntax issues
  - ROLLBACK: Revert to last known good YAML

**VALIDATE pipeline-structure:**
  - OPERATION: Check all step references (*security-scan, *test, etc.) still valid
  - VALIDATE: All anchors and references properly defined
  - IF_FAIL: Review YAML anchor/reference syntax
  - ROLLBACK: Restore original step definitions

**VALIDATE python-scripts:**
  - OPERATION: Extract and syntax-check all inline Python scripts
  - VALIDATE: `uv run python -c "compiled_code"` for each script
  - IF_FAIL: Debug Python syntax errors individually
  - ROLLBACK: Revert to original Python code blocks

### INTEGRATION TASKS

**TEST pipeline-compatibility:**
  - OPERATION: Review all uv commands used in pipeline for compatibility
  - VALIDATE: Check against current uv version documentation
  - IF_FAIL: Update uv commands to current syntax
  - ROLLBACK: Use previous uv command syntax

**VERIFY environment-persistence:**
  - OPERATION: Ensure sourced environment persists across script lines
  - VALIDATE: Add `which uv` check after source command
  - IF_FAIL: Add explicit PATH modifications as backup
  - ROLLBACK: Revert to export PATH method

**CHECK dependency-conflicts:**
  - OPERATION: Verify uv doesn't conflict with pip/awscli installations
  - VALIDATE: All required tools (uv, pip, aws, twine) accessible
  - IF_FAIL: Adjust installation order or methods
  - ROLLBACK: Separate tool installations

### CLEANUP TASKS

**REMOVE debug-commands:**
  - OPERATION: Remove any temporary debug/validation commands added during fixes
  - VALIDATE: Pipeline only contains production-ready commands
  - IF_FAIL: Review each command for necessity
  - ROLLBACK: N/A (cleanup only)

**OPTIMIZE installation-caching:**
  - OPERATION: Review if uv installation can be cached between steps
  - VALIDATE: Check Bitbucket pipeline caching capabilities
  - IF_FAIL: Keep per-step installation approach
  - ROLLBACK: Remove caching configuration

## Validation Strategy

- **Unit test**: Each step change validated with dry-run commands
- **Integration test**: Full YAML syntax and structure validation
- **Performance check**: Ensure no significant pipeline time increase
- **Security scan**: Verify no credentials exposed in environment setup

## Risk Assessment

**High Risk Areas:**
- Python inline scripts with environment variable access
- AWS credential configuration in publish steps
- Version manipulation in develop/release branches

**Mitigation Strategies:**
- Test each change incrementally with rollback prepared
- Validate Python scripts independently before pipeline integration
- Maintain backward compatibility with existing environment variables

## Success Criteria

- [ ] All pipeline steps execute without "uv command not found" errors
- [ ] Existing functionality (tests, builds, deployments) unchanged
- [ ] YAML syntax remains valid and well-formed
- [ ] No security regressions in credential handling
- [ ] Pipeline execution time not significantly increased

## Debug Patterns

If uv still not found after fixes:
1. Add `ls -la $HOME/.cargo/` to verify installation location
2. Add `echo $PATH` after source command to verify PATH contents
3. Add `which uv` to confirm uv binary accessibility
4. Check if shell profile affects environment sourcing

## Rollback Strategy

Each change includes specific rollback instructions. In case of complete failure:
1. Revert entire bitbucket-pipelines.yml to original version
2. Investigate root cause with isolated test pipeline
3. Apply fixes incrementally with validation at each step
