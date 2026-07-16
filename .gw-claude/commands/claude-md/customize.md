# Customize CLAUDE.md Generation

Interactive customization interface for configuring modular CLAUDE.md generation settings, module selection, and optimization preferences.

## Usage

```
/claude-md:customize [OPTIONS]
```

## Options

**Customization Mode:**
- `--interactive`: Launch full interactive customization wizard (default)
- `--quick`: Quick customization with common options only
- `--expert`: Advanced customization with all available options
- `--batch`: Non-interactive mode using provided parameters

**Configuration Scope:**
- `--project`: Save settings for current project only
- `--global`: Save as global default settings
- `--temporary`: Use settings for this session only
- `--profile [NAME]`: Use or create named configuration profile

**Import/Export:**
- `--import [FILE]`: Import configuration from file
- `--export [FILE]`: Export current configuration to file
- `--reset`: Reset to default configuration
- `--show-config`: Display current configuration

**Quick Options:**
- `--set-compression [LEVEL]`: Set compression level directly
- `--add-modules [LIST]`: Add specific modules to selection
- `--remove-modules [LIST]`: Remove specific modules from selection
- `--set-persona [PERSONA]`: Force specific persona selection

## Description

The customize command provides a comprehensive interface for tailoring the modular CLAUDE.md generation system to your specific needs and preferences. You can configure:

- **Module Selection Rules**: Which modules to include or exclude
- **Token Optimization**: Compression levels and optimization strategies
- **Content Customization**: Headers, footers, and formatting preferences
- **Analysis Behavior**: How project analysis is performed
- **Generation Preferences**: Output format and organization

### Customization Categories

1. **Project Analysis**: Configure how your project is analyzed
2. **Module Selection**: Control which modules are included
3. **Content Optimization**: Adjust token compression and formatting
4. **Output Preferences**: Customize headers, footers, and structure
5. **Performance Tuning**: Optimize for speed vs. accuracy trade-offs

## Examples

### Interactive Customization
```bash
/claude-md:customize
```
**Result**: Launches interactive wizard for full customization.

### Quick Compression Setup
```bash
/claude-md:customize --quick --set-compression aggressive
```
**Result**: Sets compression to aggressive mode with minimal prompts.

### Expert Configuration
```bash
/claude-md:customize --expert --profile "api-development"
```
**Result**: Advanced customization saved to named profile.

### Show Current Settings
```bash
/claude-md:customize --show-config --format table
```
**Result**: Displays current configuration in table format.

### Reset to Defaults
```bash
/claude-md:customize --reset --project
```
**Result**: Resets project-specific settings to defaults.

### Export Configuration
```bash
/claude-md:customize --export my-config.json
```
**Result**: Exports current settings to JSON file.

## Interactive Customization Wizard

### Welcome Screen
```
🎛️  CLAUDE.md Customization Wizard

Welcome to the modular CLAUDE.md customization interface!
This wizard will help you configure the generation system to match your preferences.

Current Project: /Users/dev/my-project
Project Type: api (detected)
Estimated Generation Time: 2.3s

Choose customization level:
  1) Quick Setup (2-3 questions)
  2) Standard Setup (5-8 questions)
  3) Expert Setup (15+ questions)
  4) Show Current Settings
  5) Reset to Defaults

Your choice [2]:
```

### Project Analysis Configuration
```
🔍 Project Analysis Configuration

How should the system analyze your project?

Analysis Sensitivity:
  1) Conservative - Only detect obvious patterns
  2) Balanced - Standard detection (recommended)
  3) Aggressive - Detect subtle patterns

Current: Balanced [2]:

Custom Analysis Rules:
  • Force include specific frameworks? [y/N]: n
  • Override project type detection? [y/N]: n
  • Custom complexity assessment? [y/N]: n

✓ Analysis configuration saved
```

### Module Selection Rules
```
📁 Module Selection Configuration

Configure which modules to include in your CLAUDE.md:

Core Modules (always included):
  ✓ core/FRAMEWORK.md
  ✓ core/COMMANDS.md
  ✓ core/VALIDATION.md
  ✓ core/WORKFLOWS.md

Persona Modules:
  ✓ personas/BACKEND.md (auto-selected for API project)
  ? Include personas/FRONTEND.md? [y/N]: y
  ? Include personas/ARCHITECT.md? [Y/n]: y
  ? Include personas/SECURITY.md? [Y/n]: y

Tech Stack Modules:
  ✓ tech-stacks/PYTHON.md (auto-detected)
  ✓ tech-stacks/DOCKER.md (auto-detected)
  ? Force include tech-stacks/JAVASCRIPT.md? [y/N]: n

Project Type Modules:
  ✓ project-types/API.md (matches project type)
  ? Override with different project type? [y/N]: n

Custom Module Rules:
  • Always include specific modules? [y/N]:
  • Always exclude specific modules? [y/N]:
  • Module selection priority? [auto/manual]: auto

✓ Module selection configured (12 modules selected)
```

### Content Optimization
```
⚡ Content Optimization Configuration

Configure how content is optimized for token efficiency:

Compression Level:
  1) None - Full content, no compression
  2) Light - Remove whitespace, minimal changes (15-20% reduction)
  3) Moderate - Condense examples, optimize format (35-45% reduction)
  4) Aggressive - Heavy optimization, significant condensing (50-60% reduction)
  5) Custom - Define your own rules

Current: Moderate [3]: 4

Aggressive Compression Settings:
  • Remove verbose examples? [Y/n]: y
  • Condense code blocks over 30 lines? [Y/n]: y
  • Limit list items to 8 per section? [Y/n]: n
  • Remove redundant explanations? [Y/n]: y

Token Target:
  • Set maximum token count? [y/N]: y
  • Target token count [5000]: 4000

Content Filtering:
  • Project-specific filtering? [Y/n]: y
  • Remove irrelevant framework sections? [Y/n]: y

✓ Optimization configured (estimated 58% token reduction)
```

### Output Customization
```
📝 Output Customization

Customize the generated CLAUDE.md format and content:

Header Configuration:
  • Include project analysis summary? [Y/n]: y
  • Custom header text? [y/N]: y

  Custom Header:
  > # CLAUDE.md - MyProject API Documentation
  > Custom guidance for the MyProject API development team.

Footer Configuration:
  • Include generation metadata? [Y/n]: y
  • Include module source comments? [y/N]: n
  • Custom footer text? [y/N]: n

Content Organization:
  • Module order: priority|alphabetical|custom [priority]:
  • Section separators: standard|minimal|custom [standard]:
  • Table of contents? [y/N]: n

File Handling:
  • Backup existing CLAUDE.md? [Y/n]: y
  • Output filename [.claude/CLAUDE.md]:
  • Create in subdirectory? [y/N]: n

✓ Output customization configured
```

### Performance and Advanced Options
```
🚀 Performance and Advanced Configuration

Fine-tune performance and advanced features:

Performance Settings:
  • Enable caching? [Y/n]: y
  • Cache duration (hours) [24]: 12
  • Parallel processing? [Y/n]: y
  • Memory optimization? [Y/n]: y

Advanced Features:
  • Watch mode sensitivity: low|medium|high [medium]:
  • Auto-sync on project changes? [Y/n]: n
  • Integration with git hooks? [y/N]: n

Validation Settings:
  • Validate modules before generation? [Y/n]: y
  • Check for broken links? [Y/n]: y
  • Validate token estimates? [y/N]: n

Debugging Options:
  • Verbose logging? [y/N]: n
  • Save analysis data? [y/N]: n
  • Performance benchmarking? [y/N]: n

✓ Advanced configuration complete
```

### Configuration Summary
```
📋 Configuration Summary

Your CLAUDE.md generation has been customized:

✅ Project Analysis
   • Sensitivity: Balanced
   • Custom rules: None
   • Override detection: No

✅ Module Selection (12 modules)
   • Core: 4 modules (always included)
   • Personas: 4 modules (backend, frontend, architect, security)
   • Tech Stacks: 2 modules (python, docker)
   • Project Types: 1 module (api)
   • MCPs: 1 module (context7)

✅ Content Optimization
   • Compression: Aggressive (58% reduction)
   • Target tokens: 4,000 max
   • Project filtering: Enabled

✅ Output Format
   • Custom header: Enabled
   • Generation metadata: Enabled
   • Backup existing: Enabled

✅ Advanced Settings
   • Caching: 12 hours
   • Parallel processing: Enabled
   • Validation: Enabled

Estimated Results:
   📏 Size: ~4,000 tokens (down from 9,500)
   ⚡ Generation time: ~1.8s
   📊 Relevance score: 94%

Save Configuration:
  1) Save for this project only
  2) Save as global defaults
  3) Save as named profile
  4) Use temporarily (don't save)

Your choice [1]: 1

✅ Configuration saved successfully!

Generate CLAUDE.md now? [Y/n]: y
🚀 Generating customized CLAUDE.md...
```

## Configuration Profiles

### Named Profiles
```bash
# Create and use profiles for different project types
/claude-md:customize --profile "api-backend" --expert
/claude-md:customize --profile "frontend-app" --quick
/claude-md:customize --profile "microservice" --import config.json

# List available profiles
/claude-md:customize --list-profiles

# Switch between profiles
/claude-md:customize --profile "api-backend" --apply
```

### Profile Structure
```json
{
  "profile_name": "api-backend",
  "created": "2024-01-15T14:30:45Z",
  "description": "Configuration for backend API projects",
  "settings": {
    "analysis": {
      "sensitivity": "balanced",
      "override_project_type": null,
      "custom_frameworks": []
    },
    "modules": {
      "always_include": ["personas/BACKEND.md", "personas/SECURITY.md"],
      "always_exclude": ["personas/FRONTEND.md"],
      "selection_mode": "auto"
    },
    "optimization": {
      "compression_level": "moderate",
      "target_tokens": null,
      "project_filtering": true
    },
    "output": {
      "include_metadata": true,
      "custom_header": null,
      "backup_existing": true
    }
  }
}
```

## Quick Configuration Options

### Compression Presets
```bash
# Development mode - full content
/claude-md:customize --set-compression none --temporary

# Production mode - optimized
/claude-md:customize --set-compression aggressive --project

# Balanced mode (default)
/claude-md:customize --set-compression moderate --global
```

### Module Presets
```bash
# Minimal setup
/claude-md:customize --preset minimal

# Full-stack setup
/claude-md:customize --preset fullstack

# API-focused setup
/claude-md:customize --preset api

# Security-focused setup
/claude-md:customize --preset security
```

## Configuration File Format

### Project Configuration (.claude/claude-md-config.json)
```json
{
  "version": "1.0",
  "project_path": "/path/to/project",
  "analysis": {
    "sensitivity": "balanced",
    "force_frameworks": [],
    "override_project_type": null,
    "complexity_override": null
  },
  "modules": {
    "selection_mode": "auto",
    "always_include": [],
    "always_exclude": [],
    "category_preferences": {
      "personas": "auto",
      "tech_stacks": "auto",
      "mcps": "auto",
      "project_types": "auto"
    }
  },
  "optimization": {
    "compression_level": "moderate",
    "target_tokens": null,
    "project_specific_filtering": true,
    "remove_examples": false,
    "condense_lists": true
  },
  "output": {
    "filename": ".claude/CLAUDE.md",
    "include_metadata": true,
    "include_module_sources": false,
    "custom_header": null,
    "custom_footer": null,
    "backup_existing": true
  },
  "performance": {
    "enable_caching": true,
    "cache_duration_hours": 24,
    "parallel_processing": true,
    "memory_optimization": true
  },
  "validation": {
    "validate_modules": true,
    "check_links": true,
    "validate_tokens": false
  }
}
```

## Troubleshooting Customization

### Common Issues

**Configuration Not Persisting:**
```bash
/claude-md:customize --show-config --verbose
```

**Unexpected Module Selection:**
```bash
/claude-md:customize --reset --project
/claude-md:customize --interactive
```

**Performance Issues:**
```bash
/claude-md:customize --set performance.parallel_processing=false
```

**Invalid Configuration:**
```bash
/claude-md:customize --validate-config --fix-issues
```

### Reset and Recovery
```bash
# Reset all settings
/claude-md:customize --reset --global --project

# Backup current config
/claude-md:customize --export backup-config.json

# Restore from backup
/claude-md:customize --import backup-config.json --apply
```

The customize command provides comprehensive control over every aspect of CLAUDE.md generation, enabling you to tailor the system to your exact requirements and preferences.
