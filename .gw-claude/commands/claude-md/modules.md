# List Documentation Modules

Display available documentation modules, their status, and metadata for the modular CLAUDE.md system.

## Usage

```
/claude-md:modules [OPTIONS]
```

## Options

**Display Options:**
- `--category [CATEGORY]`: Show modules from specific category (core, personas, mcps, tech-stacks, project-types)
- `--available`: Show only available modules (default)
- `--all`: Show all modules including missing ones
- `--recommended`: Show only recommended modules for current project

**Output Format:**
- `--format [FORMAT]`: Output format: table|list|json|yaml (default: table)
- `--detailed`: Show detailed module information
- `--compact`: Show compact summary
- `--stats`: Include module statistics

**Filtering:**
- `--search [TERM]`: Search modules by name or content
- `--tags [LIST]`: Filter by tags (if modules have tags)
- `--used`: Show modules currently included in CLAUDE.md

**Sorting:**
- `--sort [FIELD]`: Sort by: name|category|size|modified (default: category)
- `--reverse`: Reverse sort order

## Description

The modules command provides comprehensive information about available documentation modules in the modular CLAUDE.md system, helping you understand what content is available and make informed decisions about module selection.

### Module Categories

**Core Modules**: Essential framework documentation
- Always included in generated CLAUDE.md
- Contains fundamental PRP patterns and workflows

**Persona Modules**: Domain-specific expertise
- Selected based on project type and requirements
- Architecture, Security, Frontend, Backend specialists

**Tech Stack Modules**: Technology-specific guidance
- Auto-selected based on detected languages and frameworks
- Python, JavaScript, Docker, Terraform, etc.

**MCP Integration Modules**: Enhanced capabilities
- Included when MCP servers are available
- Context7, Sequential, Magic integration patterns

**Project Type Modules**: Project-specific patterns
- Selected based on project classification
- API, Frontend-app, CLI-tool, Microservice patterns

## Examples

### Basic Module List
```bash
/claude-md:modules
```
**Output**: Shows all available modules organized by category in table format.

### Show Only Recommended Modules
```bash
/claude-md:modules --recommended --detailed
```
**Output**: Displays modules recommended for the current project with detailed information.

### Search for Specific Content
```bash
/claude-md:modules --search "authentication" --format list
```
**Output**: Lists modules containing authentication-related content.

### Core Modules Only
```bash
/claude-md:modules --category core --stats
```
**Output**: Shows core modules with size and usage statistics.

### JSON Export for Automation
```bash
/claude-md:modules --format json --all
```
**Output**: Exports complete module information in JSON format.

### Show Currently Used Modules
```bash
/claude-md:modules --used --compact
```
**Output**: Lists modules currently included in existing CLAUDE.md.

## Output Formats

### Table Format (Default)
```
┌─────────────────────────────────────┬──────────┬────────┬─────────────┬────────────┐
│ Module                              │ Category │ Status │ Size        │ Modified   │
├─────────────────────────────────────┼──────────┼────────┼─────────────┼────────────┤
│ core/FRAMEWORK.md                   │ core     │ ✓      │ 2.1KB       │ 2024-01-15 │
│ core/COMMANDS.md                    │ core     │ ✓      │ 1.8KB       │ 2024-01-15 │
│ personas/ARCHITECT.md               │ personas │ ✓      │ 3.2KB       │ 2024-01-15 │
│ tech-stacks/PYTHON.md               │ tech     │ ✓      │ 4.1KB       │ 2024-01-15 │
│ mcps/CONTEXT7.md                    │ mcps     │ ✓      │ 2.8KB       │ 2024-01-15 │
└─────────────────────────────────────┴──────────┴────────┴─────────────┴────────────┘

📊 Summary: 19 modules available, 0 missing
🎯 Recommended for current project: 8 modules
📏 Total size: 45.2KB, Estimated tokens: ~12,800
```

### List Format
```
📁 Core Modules
  ✓ core/FRAMEWORK.md - PRP framework principles and philosophy
  ✓ core/COMMANDS.md - Available Claude commands and usage patterns
  ✓ core/VALIDATION.md - Validation patterns and quality gates
  ✓ core/WORKFLOWS.md - Development workflows and processes

👥 Persona Modules
  ✓ personas/ARCHITECT.md - Architecture and system design patterns
  ✓ personas/SECURITY.md - Security-focused development practices
  ✓ personas/BACKEND.md - Backend development and API patterns
  ✓ personas/FRONTEND.md - Frontend development and UI patterns

⚙️ Tech Stack Modules
  ✓ tech-stacks/PYTHON.md - Python-specific patterns and tools
  ✓ tech-stacks/JAVASCRIPT.md - JavaScript/Node.js patterns
  ✓ tech-stacks/DOCKER.md - Container and deployment patterns
  ✓ tech-stacks/TERRAFORM.md - Infrastructure as code patterns
```

### Detailed Format
```
📋 Module: core/FRAMEWORK.md
   Category: Core
   Status: Available ✓
   Path: /Users/.../code-agent/.claude/docs/core/FRAMEWORK.md
   Size: 2,145 bytes
   Lines: 87
   Estimated Tokens: 612
   Modified: 2024-01-15 14:23:45
   Description: PRP framework principles, architecture patterns, and core philosophy

   Content Preview:
   # PRP Framework Core Principles
   This is a **PRP (Product Requirement Prompt) Framework** repository...

   Tags: framework, core, principles, architecture
   Dependencies: None
   Used In: All generated CLAUDE.md files
```

### JSON Format
```json
{
  "modules": [
    {
      "name": "core/FRAMEWORK.md",
      "category": "core",
      "status": "available",
      "path": "/path/to/module",
      "size_bytes": 2145,
      "lines": 87,
      "estimated_tokens": 612,
      "modified": "2024-01-15T14:23:45Z",
      "description": "PRP framework principles...",
      "tags": ["framework", "core", "principles"],
      "dependencies": [],
      "recommended": true
    }
  ],
  "summary": {
    "total_modules": 19,
    "available_modules": 19,
    "missing_modules": 0,
    "recommended_modules": 8,
    "total_size_bytes": 46284,
    "estimated_total_tokens": 12800
  }
}
```

## Module Status Indicators

**Status Symbols:**
- ✓ Available and readable
- ❌ Missing or inaccessible
- ⚠️ Available but has issues
- 🔄 Currently being updated
- 📌 Pinned/locked version

**Recommendation Indicators:**
- 🎯 Recommended for current project
- ⭐ Highly recommended
- 💡 Suggested for consideration
- 🔍 Available but not recommended

## Module Information

### Basic Metadata
- **Name**: Module identifier and path
- **Category**: Module category (core, personas, tech-stacks, etc.)
- **Status**: Availability and health status
- **Size**: File size in bytes/KB
- **Modified**: Last modification timestamp

### Content Analysis
- **Lines**: Total line count
- **Estimated Tokens**: Approximate token count for LLM processing
- **Description**: Brief description of module content
- **Tags**: Searchable tags for categorization

### Usage Information
- **Dependencies**: Other modules this module depends on
- **Used In**: Which generated CLAUDE.md files include this module
- **Recommendation**: Whether recommended for current project

## Search and Filtering

### Search Capabilities
```bash
# Search by module name
/claude-md:modules --search "python"

# Search by content keywords
/claude-md:modules --search "authentication security"

# Search with regex patterns
/claude-md:modules --search "api|rest|fastapi"
```

### Category Filtering
```bash
# Show only persona modules
/claude-md:modules --category personas

# Show multiple categories
/claude-md:modules --category "core,personas"

# Exclude specific categories
/claude-md:modules --category "!mcps"
```

### Advanced Filtering
```bash
# Show large modules only
/claude-md:modules --filter "size>2000"

# Recently modified modules
/claude-md:modules --filter "modified>2024-01-10"

# Highly recommended modules
/claude-md:modules --recommended --sort size --reverse
```

## Module Management

### Checking Module Health
```bash
# Validate all modules
/claude-md:modules --validate

# Check for broken links
/claude-md:modules --check-links

# Verify module format
/claude-md:modules --check-format
```

### Module Statistics
```bash
# Show statistics
/claude-md:modules --stats

Output:
📊 Module Statistics:
   Total Modules: 19
   Available: 19 (100%)
   Missing: 0 (0%)

   By Category:
   - Core: 4 modules (21.1%)
   - Personas: 4 modules (21.1%)
   - Tech Stacks: 4 modules (21.1%)
   - MCPs: 3 modules (15.8%)
   - Project Types: 4 modules (21.1%)

   Size Distribution:
   - Total Size: 45.2KB
   - Average Size: 2.4KB
   - Largest: tech-stacks/PYTHON.md (4.1KB)
   - Smallest: mcps/MAGIC.md (1.2KB)

   Token Analysis:
   - Estimated Total: 12,800 tokens
   - Average per Module: 674 tokens
   - With Compression: ~8,500 tokens (34% reduction)
```

## Integration with Other Commands

### Use with Generate Command
```bash
# List recommended modules, then generate
/claude-md:modules --recommended --format list
/claude-md:generate --modules "core/FRAMEWORK.md,personas/BACKEND.md"
```

### Use with Preview
```bash
# See module details before generating
/claude-md:modules --category core --detailed
/claude-md:preview --modules "core/*"
```

### Export for Documentation
```bash
# Export module catalog
/claude-md:modules --format json > module-catalog.json
/claude-md:modules --format yaml > module-catalog.yaml
```

## Troubleshooting

### Common Issues

**Modules Not Found:**
```bash
/claude-md:modules --all --check-paths
```

**Outdated Module Information:**
```bash
/claude-md:modules --refresh-cache --detailed
```

**Search Not Finding Expected Results:**
```bash
/claude-md:modules --search "term" --verbose --all
```

**Performance Issues with Large Module Sets:**
```bash
/claude-md:modules --compact --cache-results
```

The modules command provides comprehensive visibility into your modular documentation system, enabling efficient module discovery, selection, and management for optimal CLAUDE.md generation.
