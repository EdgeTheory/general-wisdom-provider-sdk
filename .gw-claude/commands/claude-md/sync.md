# Sync Modular CLAUDE.md

Synchronize CLAUDE.md with current project state by re-analyzing the project and updating the generated documentation when changes are detected.

## Usage

```
/claude-md:sync [OPTIONS]
```

## Options

**Sync Behavior:**
- `--watch`: Continuously monitor project for changes and auto-sync
- `--check-only`: Check if sync is needed without performing sync
- `--force`: Force sync even if no changes detected

**Change Detection:**
- `--sensitivity [LEVEL]`: Change detection sensitivity: low|medium|high (default: medium)
- `--ignore-patterns [LIST]`: Comma-separated patterns to ignore for change detection
- `--watch-paths [LIST]`: Specific paths to monitor for changes

**Sync Options:**
- `--backup-before-sync`: Create backup before syncing
- `--preserve-customizations`: Preserve manual customizations in CLAUDE.md
- `--incremental`: Only update changed sections (experimental)

**Output Options:**
- `--verbose`: Show detailed sync information
- `--quiet`: Suppress non-error output
- `--diff`: Show differences between current and new version

## Description

The sync command keeps your CLAUDE.md file up-to-date with your evolving project by:

1. **Change Detection**: Monitors project structure, dependencies, and configuration files
2. **Smart Analysis**: Re-analyzes only when meaningful changes are detected
3. **Selective Updates**: Updates only affected sections when possible
4. **Customization Preservation**: Maintains manual customizations while updating generated content

### Change Detection Triggers

The system monitors for changes in:

- **Package Files**: `package.json`, `requirements.txt`, `pyproject.toml`, etc.
- **Configuration Files**: Docker files, Terraform configs, framework configs
- **Project Structure**: New directories, major file additions/deletions
- **MCP Configuration**: Changes to `.claude/settings.local.json`
- **Framework Detection**: New imports, framework usage patterns

### Sync Strategies

**Conservative (Low Sensitivity)**:
- Only syncs on major changes (new languages, frameworks)
- Ignores minor file additions/deletions
- Best for stable projects

**Balanced (Medium Sensitivity - Default)**:
- Syncs on moderate changes (new dependencies, config changes)
- Balances accuracy with stability
- Suitable for most development workflows

**Aggressive (High Sensitivity)**:
- Syncs on any detected change
- Most accurate but may sync frequently
- Best for rapidly evolving projects

## Examples

### Basic Sync
```bash
/claude-md:sync
```
**Result**: Checks for changes and syncs CLAUDE.md if updates are needed.

### Check Sync Status
```bash
/claude-md:sync --check-only --verbose
```
**Result**: Shows whether sync is needed and what changes were detected.

### Force Sync with Backup
```bash
/claude-md:sync --force --backup-before-sync
```
**Result**: Forces complete regeneration with backup of current file.

### Watch Mode
```bash
/claude-md:sync --watch --sensitivity high
```
**Result**: Continuously monitors project and auto-syncs on any changes.

### Show Differences
```bash
/claude-md:sync --diff --check-only
```
**Result**: Shows what would change without actually syncing.

### Preserve Customizations
```bash
/claude-md:sync --preserve-customizations --incremental
```
**Result**: Updates only generated sections while preserving manual edits.

## Change Detection Details

### File System Monitoring

The sync system monitors:

```bash
# Package and dependency files
package.json, package-lock.json, yarn.lock
requirements.txt, pyproject.toml, Pipfile
Cargo.toml, go.mod, pom.xml, build.gradle

# Configuration files
Dockerfile, docker-compose.yml
*.tf, terraform.tfstate
.env, .env.example
jest.config.js, pytest.ini

# Structure changes
src/, lib/, components/, services/
New directories with >5 files
Major file additions (>10 files)
```

### Smart Change Analysis

Not all changes trigger a sync:

**Triggers Sync:**
- New programming language detected
- New framework/library added to dependencies
- Project type classification changes
- MCP server configuration changes
- Major directory structure changes

**Doesn't Trigger Sync:**
- Individual source file edits
- Documentation updates
- Test file additions
- Minor configuration tweaks
- Temporary files

### Incremental Updates

When possible, sync performs incremental updates:

```markdown
# Only updates affected sections
## Project Analysis  <- Updated if analysis changes
- Languages: Python (85%), JS (15%)  <- Updated percentages

[Core modules remain unchanged]
[Only affected tech-stack modules updated]
[Generation metadata updated]
```

## Watch Mode

Watch mode provides continuous synchronization:

### Watch Mode Features
- **Real-time Monitoring**: Uses file system events for instant detection
- **Debounced Updates**: Groups rapid changes to avoid excessive syncing
- **Background Operation**: Runs in background without blocking other commands
- **Resource Efficient**: Minimal CPU/memory usage during monitoring

### Watch Mode Configuration
```bash
# Watch specific directories
/claude-md:sync --watch --watch-paths "src/,config/,package.json"

# Ignore temporary files
/claude-md:sync --watch --ignore-patterns "*.tmp,*.log,node_modules/*"

# High sensitivity for active development
/claude-md:sync --watch --sensitivity high --verbose
```

### Stopping Watch Mode
```bash
# Press Ctrl+C to stop watch mode
# Or use the stop command
/claude-md:stop-watch
```

## Customization Preservation

The sync system can preserve manual customizations:

### Protected Sections
```markdown
<!-- CUSTOM-START: My Custom Section -->
This content will be preserved during sync
<!-- CUSTOM-END -->

# Custom sections are detected and preserved
# Generated content is updated around them
```

### Merge Strategies
- **Replace**: Completely replace generated content (default)
- **Preserve**: Keep custom sections, update generated sections
- **Merge**: Attempt to merge changes intelligently

## Sync Status and Reporting

### Status Information
```bash
# Detailed sync status
/claude-md:sync --check-only --verbose

Output:
✓ CLAUDE.md exists and is up-to-date
✓ Project analysis matches current state
✓ All detected modules are included
⚠ New dependency detected: tensorflow
→ Sync recommended to include ML patterns
```

### Sync Reports
```bash
# Generate sync report
/claude-md:sync --verbose

Output:
🔄 Syncing CLAUDE.md...
📊 Analysis Results:
  - Languages: Python (90%), Shell (10%) [+Shell detected]
  - Frameworks: FastAPI, TensorFlow [+TensorFlow added]
  - Project Type: api → machine-learning [CHANGED]

📝 Module Updates:
  + tech-stacks/PYTHON.md [updated ML patterns]
  + project-types/MACHINE-LEARNING.md [added]
  - project-types/API.md [removed]

✅ Sync completed successfully
📈 Token reduction: 47% (was 52%)
```

## Integration with Development Workflows

### Git Hooks Integration
```bash
# Add to .git/hooks/post-merge
#!/bin/bash
/claude-md:sync --check-only --quiet || /claude-md:sync --backup-before-sync
```

### CI/CD Integration
```bash
# In CI pipeline
- name: Sync CLAUDE.md
  run: |
    /claude-md:sync --check-only
    if [ $? -ne 0 ]; then
      echo "CLAUDE.md needs sync - consider running /claude-md:sync locally"
      exit 1
    fi
```

### IDE Integration
```bash
# VS Code task.json
{
  "label": "Sync CLAUDE.md",
  "type": "shell",
  "command": "/claude-md:sync",
  "group": "build",
  "presentation": {
    "echo": true,
    "reveal": "always"
  }
}
```

## Performance and Efficiency

### Optimization Features
- **Change Fingerprinting**: Quick checksums to detect changes
- **Incremental Analysis**: Only re-analyze changed components
- **Cached Results**: Reuse previous analysis when possible
- **Lazy Loading**: Load modules only when needed

### Resource Usage
- **CPU**: Minimal impact during monitoring
- **Memory**: <10MB for typical projects
- **Disk I/O**: Efficient file system monitoring
- **Network**: No network usage required

## Troubleshooting

### Common Issues

**Sync Not Detecting Changes:**
```bash
/claude-md:sync --force --sensitivity high --verbose
```

**Watch Mode Not Working:**
```bash
# Check file system permissions
/claude-md:sync --watch --verbose --watch-paths "."
```

**Customizations Being Overwritten:**
```bash
/claude-md:sync --preserve-customizations --diff
```

**Sync Taking Too Long:**
```bash
/claude-md:sync --incremental --ignore-patterns "node_modules/*,*.log"
```

### Error Recovery
- **Backup Restoration**: Automatic rollback on sync failures
- **Partial Sync**: Complete successful sections even if others fail
- **Validation**: Verify generated CLAUDE.md before replacement
- **Error Reporting**: Detailed error messages with resolution suggestions

The sync command ensures your CLAUDE.md documentation stays current with your evolving project while respecting your customizations and development workflow.
