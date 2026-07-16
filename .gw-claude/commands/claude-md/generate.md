# Generate Modular CLAUDE.md

Generate a customized CLAUDE.md file using the modular documentation system with smart project detection and context optimization.

## Usage

```
/claude-md:generate [OPTIONS]
```

## Options

**Analysis Options:**
- `--project-path [PATH]`: Path to analyze (default: current working directory)
- `--force-analysis`: Force re-analysis even if cached results exist
- `--analysis-only`: Only perform analysis without generating CLAUDE.md

**Module Selection Options:**
- `--modules [LIST]`: Comma-separated list of specific modules to include
- `--exclude-modules [LIST]`: Comma-separated list of modules to exclude
- `--include-all`: Include all available modules (overrides smart selection)
- `--minimal`: Include only core modules for minimal setup

**Generation Options:**
- `--output [PATH]`: Output file path (default: ./.claude/CLAUDE.md)
- `--backup-existing`: Create backup of existing CLAUDE.md before overwriting
- `--no-overwrite`: Fail if output file already exists

**Optimization Options:**
- `--compression [LEVEL]`: Token compression level: none|light|moderate|aggressive (default: moderate)
- `--no-optimization`: Disable token optimization
- `--target-tokens [NUMBER]`: Target maximum token count

**Content Options:**
- `--include-metadata`: Include generation metadata in output (default: true)
- `--include-module-sources`: Include module source comments
- `--custom-header [TEXT]`: Custom header text
- `--custom-footer [TEXT]`: Custom footer text

**Preview Options:**
- `--preview`: Show preview of what would be generated without creating file
- `--preview-modules`: Show which modules would be selected
- `--preview-stats`: Show token count and size estimates

## Description

The modular CLAUDE.md generation system analyzes your project structure to intelligently select and compose relevant documentation modules, creating a customized CLAUDE.md file optimized for your specific project.

### Smart Project Analysis

The system performs comprehensive analysis of:

1. **Language Detection**: Identifies programming languages and their usage percentages
2. **Framework Detection**: Discovers frameworks, libraries, and tools in use
3. **Project Type Classification**: Categorizes project (API, frontend-app, CLI-tool, microservice, etc.)
4. **MCP Server Detection**: Identifies available MCP servers for enhanced capabilities
5. **Complexity Assessment**: Evaluates project complexity (low, medium, high)

### Intelligent Module Selection

Based on the analysis, the system automatically selects relevant modules:

- **Core Modules**: Always included (Framework, Commands, Validation, Workflows)
- **Persona Modules**: Selected based on project type and complexity
- **Tech Stack Modules**: Included for detected languages and frameworks
- **MCP Modules**: Added for available MCP servers
- **Project Type Modules**: Specific to detected project type

### Token Optimization

The system provides multiple levels of content optimization:

- **None**: Full content with no compression
- **Light**: Remove excessive whitespace and formatting
- **Moderate**: Condense examples and remove redundant sections (default)
- **Aggressive**: Significant compression with condensed examples and lists

## Examples

### Basic Generation
```bash
/claude-md:generate
```
**Result**: Analyzes current directory and generates optimized CLAUDE.md with smart module selection.

### Generate with Specific Modules
```bash
/claude-md:generate --modules "core/FRAMEWORK.md,personas/BACKEND.md,tech-stacks/PYTHON.md"
```
**Result**: Generates CLAUDE.md with only the specified modules.

### Preview Mode
```bash
/claude-md:generate --preview
```
**Result**: Shows what would be generated without creating the file.

### Minimal Setup
```bash
/claude-md:generate --minimal --compression none
```
**Result**: Generates minimal CLAUDE.md with only core modules and no compression.

### Custom Output with Backup
```bash
/claude-md:generate --output ./docs/CLAUDE.md --backup-existing
```
**Result**: Generates to custom location with backup of existing file.

### Maximum Optimization
```bash
/claude-md:generate --compression aggressive --target-tokens 5000
```
**Result**: Heavily optimized CLAUDE.md targeting ~5000 tokens.

### Analysis Only
```bash
/claude-md:generate --analysis-only --preview-stats
```
**Result**: Performs project analysis and shows statistics without generating file.

## Generated Content Structure

The generated CLAUDE.md follows this structure:

```markdown
# CLAUDE.md

This file provides guidance to Claude Code...
Generated automatically on [timestamp]

## Project Analysis
- Detected Languages: Python (80%), JavaScript (20%)
- Frameworks: FastAPI, React, Docker
- Available MCPs: Context7, Sequential
- Project Type: api
- Complexity Level: medium
- Analysis Confidence: 85%

[Selected module content organized by priority]

---

## Generation Metadata
- Generated: [timestamp]
- Modules Included: 8
- Token Optimization: Enabled (moderate)
- Analysis Confidence: 85%

*This CLAUDE.md was automatically generated...*
```

## Module Categories

### Core Modules (Always Included)
- `core/FRAMEWORK.md`: PRP framework principles and philosophy
- `core/COMMANDS.md`: Available Claude commands and usage
- `core/VALIDATION.md`: Validation patterns and quality gates
- `core/WORKFLOWS.md`: Development workflows and processes

### Persona Modules (Project-Based Selection)
- `personas/ARCHITECT.md`: Architecture and system design patterns
- `personas/SECURITY.md`: Security-focused development practices
- `personas/BACKEND.md`: Backend development and API patterns
- `personas/FRONTEND.md`: Frontend development and UI patterns

### Tech Stack Modules (Auto-Detected)
- `tech-stacks/PYTHON.md`: Python-specific patterns and tools
- `tech-stacks/JAVASCRIPT.md`: JavaScript/Node.js patterns
- `tech-stacks/DOCKER.md`: Container and deployment patterns
- `tech-stacks/TERRAFORM.md`: Infrastructure as code patterns

### MCP Integration Modules (Availability-Based)
- `mcps/CONTEXT7.md`: Context7 server integration patterns
- `mcps/SEQUENTIAL.md`: Sequential analysis workflows
- `mcps/MAGIC.md`: Magic UI generation patterns

### Project Type Modules (Classification-Based)
- `project-types/API.md`: REST API development patterns
- `project-types/FRONTEND-APP.md`: Frontend application patterns
- `project-types/CLI-TOOL.md`: Command-line tool patterns
- `project-types/MICROSERVICE.md`: Microservice architecture patterns

## Token Optimization Benefits

Compared to the original monolithic CLAUDE.md:

- **40-60% Token Reduction**: Only includes relevant content
- **Improved Relevance**: Project-specific guidance and examples
- **Better Performance**: Reduced context size improves AI response quality
- **Easier Maintenance**: Update individual modules without affecting others

## Integration with Existing Workflows

The generated CLAUDE.md is fully compatible with:

- All existing PRP commands (`/prp:create`, `/prp:execute`, etc.)
- Meta-commands (`/meta:analyze`, `/meta:build`, etc.)
- Development workflows and validation processes
- CI/CD pipelines and automation

## Error Handling

The command handles various error scenarios gracefully:

- **Missing Modules**: Warns about missing modules and continues with available ones
- **File Permission Issues**: Provides clear error messages for file access problems
- **Analysis Failures**: Falls back to default module selection if analysis fails
- **Invalid Configurations**: Validates inputs and provides helpful error messages

## Performance Considerations

- **Analysis Speed**: Project analysis typically completes in 1-3 seconds
- **Generation Speed**: Module composition and optimization in <2 seconds
- **Memory Usage**: Efficient streaming processing for large projects
- **Caching**: Analysis results cached for repeated operations

## Troubleshooting

### Common Issues

**Analysis Not Detecting Expected Technologies:**
```bash
/claude-md:generate --force-analysis --preview-modules
```

**Generated File Too Large:**
```bash
/claude-md:generate --compression aggressive --target-tokens 8000
```

**Missing Expected Modules:**
```bash
/claude-md:generate --modules "core/FRAMEWORK.md,missing-module.md" --preview
```

**File Permission Errors:**
```bash
/claude-md:generate --output ./temp/CLAUDE.md
```

The modular CLAUDE.md generation system provides intelligent, optimized documentation that adapts to your specific project needs while maintaining full compatibility with existing PRP workflows.
