# VALIDATION.md - gw-sdk Validation Agent Instructions

**Repository**: gw-sdk (Marketplace Provider SDK)
**Purpose**: Objective validation of SDK implementations by validation agents
**Scope**: Beyond unit tests - validate SDK behavior in real integration scenarios

---

## Pre-Validation Checks (MANDATORY)

Before starting any validation work, the validation agent MUST check for the `needs-human` label:

### Check for needs-human Label

```bash
# Check if issue has needs-human label
ISSUE_LABELS=$(curl -s -H "Authorization: Bearer $JIRA_TOKEN" \
  "https://ghostdogbase.atlassian.net/rest/api/2/issue/${JIRA_ISSUE_KEY}" | \
  jq -r '.fields.labels[]' 2>/dev/null)

if echo "$ISSUE_LABELS" | grep -q "needs-human"; then
    echo "⚠️ Issue ${JIRA_ISSUE_KEY} has 'needs-human' label - skipping validation"
    echo "This issue requires human review before automated validation can proceed."
    exit 0  # Exit cleanly, no error
fi
```

**If the issue has `needs-human` label:**
- **STOP** - Do not proceed with validation
- **EXIT** cleanly (exit code 0)
- **DO NOT** report an error
- The issue requires human intervention before automated validation can continue

### Failed Validation Handling

**After validation fails twice:**
1. Add the `needs-human` label to the Jira issue
2. Leave the issue in VALIDATION status (do not transition)
3. Add a comment explaining the blocking issues
4. Automated validation will skip the issue until a human removes the label

```bash
# Example: Adding needs-human label after second failure
if [ "$VALIDATION_FAILURE_COUNT" -ge 2 ]; then
    # Add needs-human label via Jira API or MCP
    echo "🚨 Marking issue as needs-human after 2 failed validations"
    # Keep issue in VALIDATION status - do not transition
fi
```

---

## Overview

This document provides instructions for validation agents to objectively verify work completed by implementation agents. Validation goes beyond "run the tests" to include:

- SDK build verification and type checking
- Example application testing with real JWT tokens
- Integration testing with gw-jwt-demo
- Bundle size and performance validation
- CodeArtifact publish dry-run validation
- Evidence collection for Jira tickets

---

## Prerequisites

### Required Tools

```bash
# Node.js 20+
node --version  # Should be v20.x or higher

# npm
npm --version

# AWS CLI (for CodeArtifact validation)
aws --version
```

### Test Credentials

Use gw-test-data MCP to retrieve test credentials:

```typescript
// Get test user for JWT generation
const credentials = await mcp__gw-test-data__get_credentials({
  role: "org_member",
  env: "ghostdog-dev"
});
```

---

## Validation Workflow

### Step 1: Environment Setup

```bash
cd /Users/josef.salyer/projects/gw/gw-sdk

# Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Generate test keys if not present
npm run generate-keys
```

### Step 2: Build Validation

Verify the SDK builds successfully with type checking:

```bash
# Full build with TypeScript compilation
npm run build

# Verify build outputs exist
ls -la dist/
# Expected outputs:
# - marketplace-sdk.es.js (ES module)
# - marketplace-sdk.umd.js (UMD bundle)
# - index.d.ts (TypeScript declarations)
```

**Validation Criteria:**
- [ ] Build completes without errors
- [ ] All three distribution files exist
- [ ] No TypeScript compilation warnings
- [ ] Bundle sizes are reasonable (< 50KB minified)

### Step 3: Lint and Type Checking

```bash
# Run ESLint
npm run lint

# TypeScript type checking (already part of build)
npx tsc --noEmit
```

**Validation Criteria:**
- [ ] No ESLint errors
- [ ] No TypeScript type errors
- [ ] Code follows project style guidelines

### Step 4: Unit Test Validation

```bash
# Run unit tests
npm run test

# Run with coverage
npm run test:coverage
```

**Validation Criteria:**
- [ ] All unit tests pass
- [ ] Coverage meets threshold (>80%)
- [ ] No skipped or pending tests

### Step 5: Integration Test Validation

```bash
# Run integration tests
npm run test:integration
```

**Validation Criteria:**
- [ ] Integration tests pass
- [ ] JWT validation scenarios work correctly
- [ ] Session lifecycle management validated

### Step 6: Example Application Testing

Test the SDK with the built-in test server:

```bash
# Terminal 1: Start the test server
npm run test-server

# Terminal 2: Generate a test JWT
npm run generate-jwt -- 60  # 60-minute session

# Output will show a URL like:
# http://localhost:3000?gwSession=eyJhbGciOiJSUzI1NiIs...
```

**Manual Validation Steps:**

1. **Open the test URL in browser**
2. **Verify SDK initialization:**
   - Session info displayed correctly
   - Timer countdown working
   - No console errors

3. **Test session lifecycle:**
   - Session expiration warning appears
   - Heartbeat pings sent (check network tab)
   - Refresh token handling works

**Validation Criteria:**
- [ ] SDK initializes without errors
- [ ] Session information extracted correctly
- [ ] Timer displays accurate countdown
- [ ] Lifecycle events fire appropriately

### Step 7: JWT Validation Testing

Test various JWT scenarios:

```bash
# Generate JWT with different durations
npm run generate-jwt -- 1    # 1-minute session (for expiration testing)
npm run generate-jwt -- 60   # Standard session
npm run generate-jwt -- 480  # Full day session
```

**Test Scenarios:**

| Scenario | Expected Behavior |
|----------|-------------------|
| Valid JWT | Session initialized, timer starts |
| Expired JWT | Error displayed, session not started |
| Malformed JWT | Error displayed with clear message |
| Missing JWT | Prompt or error for missing token |
| Invalid signature | Signature validation fails (server-side) |

### Step 8: Cross-Browser Validation

If visual testing is required, use Chrome DevTools MCP:

```typescript
// Navigate to test server
await mcp__chrome-devtools__navigate_page({
  url: "http://localhost:3000?gwSession=<generated-jwt>"
});

// Take snapshot of SDK state
const snapshot = await mcp__chrome-devtools__take_snapshot({});

// Check for console errors
const consoleMessages = await mcp__chrome-devtools__list_console_messages({
  types: ["error", "warn"]
});

// Screenshot for evidence
await mcp__chrome-devtools__take_screenshot({
  filePath: "validation-evidence/sdk-session-active.png"
});
```

### Step 9: Bundle Analysis

Verify bundle size and dependencies:

```bash
# Check bundle sizes
ls -lh dist/*.js

# Analyze bundle contents (if needed)
npx vite-bundle-visualizer
```

**Validation Criteria:**
- [ ] ES module bundle < 50KB
- [ ] UMD bundle < 60KB
- [ ] No unnecessary dependencies bundled
- [ ] Tree-shaking works correctly

### Step 10: CodeArtifact Publish Dry-Run

Validate the package can be published:

```bash
# Login to CodeArtifact (if credentials available)
make ca-login

# Dry-run publish
npm publish --dry-run

# Verify package.json exports
node -e "console.log(require('./package.json').exports)"
```

**Validation Criteria:**
- [ ] Package name is correct (@marketplace/provider-sdk)
- [ ] Version is updated appropriately
- [ ] All required files included in package
- [ ] Exports configuration is valid

### Step 11: Documentation Validation

Verify documentation matches implementation:

```bash
# Check README examples work
# Extract code examples from README.md and verify they compile
```

**Documentation Checklist:**
- [ ] README.md installation instructions work
- [ ] Quick start example runs successfully
- [ ] API documentation matches exports
- [ ] TypeScript types documented

### Step 12: Collect Evidence

Create validation evidence directory:

```bash
mkdir -p validation-evidence
```

**Evidence Files to Generate:**

```typescript
// report.json - Machine-readable results
{
  "validation_id": "gw-sdk-val-<timestamp>",
  "repository": "gw-sdk",
  "pr_number": "<PR_NUMBER>",
  "timestamp": "<ISO_TIMESTAMP>",
  "results": {
    "build": { "status": "pass|fail", "duration_ms": 1234 },
    "lint": { "status": "pass|fail", "errors": 0, "warnings": 0 },
    "unit_tests": { "status": "pass|fail", "passed": 45, "failed": 0, "coverage": 85.5 },
    "integration_tests": { "status": "pass|fail", "passed": 12, "failed": 0 },
    "bundle_size": { "es_module_kb": 42, "umd_kb": 48 },
    "example_app": { "status": "pass|fail", "scenarios_tested": 5 }
  },
  "overall_status": "PASS|FAIL",
  "evidence_files": [
    "test-output.txt",
    "coverage-report.html",
    "bundle-analysis.html"
  ]
}

// report.md - Human-readable summary
```

**Generate Evidence:**

```bash
# Capture test output
npm run test 2>&1 | tee validation-evidence/test-output.txt

# Generate coverage report
npm run test:coverage
cp -r coverage/ validation-evidence/

# Bundle size report
ls -lh dist/*.js > validation-evidence/bundle-sizes.txt

# Build output
npm run build 2>&1 | tee validation-evidence/build-output.txt
```

---

## Jira Integration

### Update Jira Ticket

```typescript
// Add validation comment
await mcp__jira-mcp__add_comment({
  issue_key: "GW-<ISSUE_NUMBER>",
  body: `
## SDK Validation Complete

**Status**: PASS/FAIL
**Validator**: Validation Agent
**Timestamp**: ${new Date().toISOString()}

### Results Summary

| Check | Status | Details |
|-------|--------|---------|
| Build | PASS | All dist files generated |
| Lint | PASS | 0 errors, 0 warnings |
| Unit Tests | PASS | 45/45 passed, 85.5% coverage |
| Integration Tests | PASS | 12/12 passed |
| Example App | PASS | All scenarios work |
| Bundle Size | PASS | ES: 42KB, UMD: 48KB |

### Evidence Attached
- test-output.txt
- coverage-report.html
- bundle-sizes.txt
  `
});

// Transition issue based on result
if (validationPassed) {
  await mcp__jira-mcp__transition_issue({
    issue_key: "GW-<ISSUE_NUMBER>",
    transition_id: "<DONE_TRANSITION_ID>"
  });
} else {
  await mcp__jira-mcp__transition_issue({
    issue_key: "GW-<ISSUE_NUMBER>",
    transition_id: "<TODO_TRANSITION_ID>"
  });
}
```

### Bitbucket PR Management

```typescript
// If validation passes, merge PR
if (validationPassed) {
  await mcp__bitbucket-mcp__merge_pull_request({
    repo_slug: "gw-sdk",
    pull_request_id: <PR_NUMBER>,
    message: "Validated by validation agent - all checks pass",
    strategy: "squash"
  });
}
// If validation fails, leave PR open with comment
```

---

## Cleanup

After validation, clean up generated artifacts:

```bash
make cleanup-validation
```

Or manually:

```bash
./scripts/cleanup-validation.sh
```

---

## Validation Checklist Summary

### Must Pass (Blocking)

- [ ] npm install succeeds
- [ ] npm run build completes without errors
- [ ] npm run lint passes
- [ ] npm run test passes (all unit tests)
- [ ] npm run test:integration passes
- [ ] TypeScript compilation clean
- [ ] Bundle files exist and are valid

### Should Pass (Warning)

- [ ] Test coverage > 80%
- [ ] Bundle size within limits
- [ ] Example app functions correctly
- [ ] Documentation up to date

### Evidence Required

- [ ] test-output.txt
- [ ] build-output.txt
- [ ] bundle-sizes.txt
- [ ] coverage report
- [ ] report.json
- [ ] report.md

---

## Troubleshooting

### Common Issues

**Issue: Build fails with TypeScript errors**
```bash
# Check TypeScript version
npx tsc --version

# Clear TypeScript cache
rm -rf node_modules/.cache
npm run build
```

**Issue: Test keys not found**
```bash
# Regenerate test keys
npm run generate-keys
```

**Issue: Integration tests fail**
```bash
# Check if test server is running
curl http://localhost:3000/health

# Start test server first
npm run test-server &
npm run test:integration
```

**Issue: CodeArtifact login fails**
```bash
# Check AWS credentials
aws sts get-caller-identity

# Re-authenticate
aws sso login --profile <your-profile>
make ca-login
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2024-12-04 | Initial validation framework |
