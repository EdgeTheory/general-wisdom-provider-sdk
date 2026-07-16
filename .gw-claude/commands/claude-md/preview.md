# Preview CLAUDE.md Generation

Preview what would be generated for CLAUDE.md without actually creating the file, including module selection, content analysis, and optimization statistics.

## Usage

```
/claude-md:preview [OPTIONS]
```

## Options

**Preview Scope:**
- `--modules [LIST]`: Preview specific modules (comma-separated)
- `--analysis-only`: Preview only project analysis results
- `--content-only`: Preview only the generated content structure
- `--full`: Show complete preview including content samples

**Analysis Options:**
- `--project-path [PATH]`: Path to analyze (default: current directory)
- `--force-analysis`: Force re-analysis ignoring cached results
- `--show-confidence`: Show analysis confidence scores

**Content Options:**
- `--compression [LEVEL]`: Preview with compression level: none|light|moderate|aggressive
- `--sample-content`: Include content samples from each module
- `--show-tokens`: Show detailed token count analysis
- `--show-structure`: Display content structure and organization

**Comparison Options:**
- `--compare-current`: Compare with existing CLAUDE.md if present
- `--compare-compression`: Compare different compression levels
- `--benchmark`: Show performance benchmarks

**Output Format:**
- `--format [FORMAT]`: Output format: summary|detailed|json|markdown (default: summary)
- `--export [FILE]`: Export preview to file
- `--quiet`: Show minimal output

## Description

The preview command allows you to see exactly what would be generated before actually creating or updating your CLAUDE.md file. This helps you:

- **Validate Module Selection**: Ensure the right modules are being included
- **Check Token Optimization**: See the impact of different compression levels
- **Review Content Structure**: Preview the organization and flow of content
- **Compare Options**: Evaluate different configuration choices
- **Troubleshoot Issues**: Debug module selection and content generation

### Preview Components

1. **Project Analysis Summary**: Languages, frameworks, project type detection
2. **Module Selection**: Which modules would be included and why
3. **Content Structure**: How the final document would be organized
4. **Token Analysis**: Size estimates and optimization impact
5. **Comparison Data**: Differences from current state

## Examples

### Basic Preview
```bash
/claude-md:preview
```
**Output**: Shows project analysis, selected modules, and generation summary.

### Full Content Preview
```bash
/claude-md:preview --full --sample-content
```
**Output**: Detailed preview with content samples from each selected module.

### Compare Compression Levels
```bash
/claude-md:preview --compare-compression
```
**Output**: Shows token counts and content differences across compression levels.

### Preview Specific Modules
```bash
/claude-md:preview --modules "core/FRAMEWORK.md,personas/BACKEND.md" --show-tokens
```
**Output**: Previews only specified modules with detailed token analysis.

### Compare with Current CLAUDE.md
```bash
/claude-md:preview --compare-current --format detailed
```
**Output**: Shows differences between current CLAUDE.md and what would be generated.

### JSON Export for Automation
```bash
/claude-md:preview --format json --export preview-results.json
```
**Output**: Exports complete preview data in JSON format for processing.

## Preview Output Formats

### Summary Format (Default)
```
🔍 CLAUDE.md Generation Preview

📊 Project Analysis
   Languages: Python (85%), JavaScript (15%)
   Frameworks: FastAPI, React, Docker, pytest
   Project Type: api (confidence: 89%)
   Complexity: medium
   Available MCPs: Context7, Sequential

📁 Selected Modules (8 total)
   ✓ core/FRAMEWORK.md (612 tokens)
   ✓ core/COMMANDS.md (521 tokens)
   ✓ core/VALIDATION.md (445 tokens)
   ✓ personas/BACKEND.md (892 tokens)
   ✓ tech-stacks/PYTHON.md (1,234 tokens)
   ✓ tech-stacks/DOCKER.md (756 tokens)
   ✓ mcps/CONTEXT7.md (623 tokens)
   ✓ project-types/API.md (712 tokens)

📏 Size Analysis
   Total Tokens: 5,795 (estimated)
   With Compression: 3,362 tokens (42% reduction)
   File Size: ~23KB (estimated)

🎯 Recommendations
   ✓ Optimal module selection for API project
   ✓ Good balance of general and specific guidance
   ⚠ Consider adding SEQUENTIAL.md for complex workflows

⚡ Ready to generate with: /claude-md:generate
```

### Detailed Format
```
🔍 Detailed CLAUDE.md Generation Preview

═══════════════════════════════════════════════════════════

📊 PROJECT ANALYSIS DETAILS

Language Detection:
┌─────────────┬─────────────┬─────────────┬─────────────────┐
│ Language    │ Files       │ Percentage  │ Confidence      │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ Python      │ 42          │ 85.2%       │ High (95%)      │
│ JavaScript  │ 8           │ 14.8%       │ Medium (78%)    │
└─────────────┴─────────────┴─────────────┴─────────────────┘

Framework Detection:
┌─────────────┬─────────────────┬─────────────────────────────┐
│ Framework   │ Confidence      │ Detection Method            │
├─────────────┼─────────────────┼─────────────────────────────┤
│ FastAPI     │ High (94%)      │ Import analysis + deps      │
│ React       │ Medium (81%)    │ Package.json + file types  │
│ Docker      │ High (99%)      │ Dockerfile + compose files │
│ pytest      │ High (92%)      │ Dependencies + test files   │
└─────────────┴─────────────────┴─────────────────────────────┘

Project Classification:
- Primary Type: api (89% confidence)
- Secondary Type: full-stack (34% confidence)
- Complexity Level: medium
- Reasoning: REST API patterns + frontend components + containerization

═══════════════════════════════════════════════════════════

📁 MODULE SELECTION ANALYSIS

Core Modules (Always Included):
✓ core/FRAMEWORK.md
  Size: 2.1KB | Tokens: 612 | Reason: Always included
  Content: PRP framework principles, architecture patterns

✓ core/COMMANDS.md
  Size: 1.8KB | Tokens: 521 | Reason: Always included
  Content: Claude commands reference, usage patterns

Persona Modules (Project-Based):
✓ personas/BACKEND.md
  Size: 3.2KB | Tokens: 892 | Reason: API project type
  Content: Backend development, API patterns, database integration

❌ personas/FRONTEND.md
  Size: 2.9KB | Tokens: 801 | Reason: Not primary focus (15% JS)
  Note: Available but not auto-selected

Tech Stack Modules (Auto-Detected):
✓ tech-stacks/PYTHON.md
  Size: 4.1KB | Tokens: 1,234 | Reason: Primary language (85%)
  Content: Python patterns, FastAPI integration, testing

✓ tech-stacks/DOCKER.md
  Size: 2.8KB | Tokens: 756 | Reason: Docker detected (99% confidence)
  Content: Containerization patterns, multi-stage builds

═══════════════════════════════════════════════════════════

📏 TOKEN OPTIMIZATION ANALYSIS

Compression Level Comparison:
┌─────────────┬─────────────┬─────────────┬─────────────────┐
│ Level       │ Tokens      │ Reduction   │ Quality Impact  │
├─────────────┼─────────────┼─────────────┼─────────────────┤
│ None        │ 5,795       │ 0%          │ Full content    │
│ Light       │ 4,873       │ 16%         │ Minimal         │
│ Moderate    │ 3,362       │ 42%         │ Low             │
│ Aggressive  │ 2,488       │ 57%         │ Moderate        │
└─────────────┴─────────────┴─────────────┴─────────────────┘

Optimization Techniques Applied (Moderate):
- Remove excessive whitespace: -156 tokens
- Condense long code examples: -892 tokens
- Remove redundant explanations: -234 tokens
- Optimize list formatting: -151 tokens

═══════════════════════════════════════════════════════════

🏗️ CONTENT STRUCTURE PREVIEW

Generated CLAUDE.md Structure:
```
# CLAUDE.md

## Project Analysis
[Auto-generated analysis summary]

## PRP Framework Core Principles
[From: core/FRAMEWORK.md]

## PRP Framework Commands Reference
[From: core/COMMANDS.md]

## Backend Development Patterns
[From: personas/BACKEND.md]

## Python Technology Stack Guidelines
[From: tech-stacks/PYTHON.md]

## Docker Technology Stack Guidelines
[From: tech-stacks/DOCKER.md]

## API Development Project Patterns
[From: project-types/API.md]

## Generation Metadata
[Auto-generated footer]
```

Estimated Reading Time: 12-15 minutes
Estimated Context Window Usage: ~3,400 tokens (moderate compression)
```

### JSON Format
```json
{
  "preview_timestamp": "2024-01-15T14:30:45Z",
  "project_analysis": {
    "languages": {
      "python": {"percentage": 0.852, "confidence": 0.95},
      "javascript": {"percentage": 0.148, "confidence": 0.78}
    },
    "frameworks": ["fastapi", "react", "docker", "pytest"],
    "project_type": "api",
    "complexity": "medium",
    "confidence_score": 0.89,
    "available_mcps": ["context7", "sequential"]
  },
  "module_selection": {
    "selected_modules": [
      {
        "path": "core/FRAMEWORK.md",
        "category": "core",
        "size_bytes": 2145,
        "estimated_tokens": 612,
        "selection_reason": "always_included"
      }
    ],
    "excluded_modules": [
      {
        "path": "personas/FRONTEND.md",
        "exclusion_reason": "not_primary_focus",
        "could_include": true
      }
    ],
    "total_selected": 8
  },
  "token_analysis": {
    "uncompressed_tokens": 5795,
    "compression_levels": {
      "light": {"tokens": 4873, "reduction_pct": 16},
      "moderate": {"tokens": 3362, "reduction_pct": 42},
      "aggressive": {"tokens": 2488, "reduction_pct": 57}
    }
  },
  "recommendations": [
    "Optimal module selection for API project",
    "Consider adding SEQUENTIAL.md for complex workflows"
  ],
  "generation_ready": true
}
```

## Content Sampling

With `--sample-content`, preview includes actual content samples:

```
📝 Content Samples

core/FRAMEWORK.md (first 200 chars):
# PRP Framework Core Principles

This is a **PRP (Product Requirement Prompt) Framework** repository, not a traditional software project. The core concept: **"PRP = PRD + curated...

personas/BACKEND.md (relevant section):
### API Design Patterns
```python
# RESTful API design with FastAPI
from fastapi import FastAPI, HTTPException
app = FastAPI(
    title="Production API",
    version="1.0.0"
)
```

[Additional samples for each selected module...]
```

## Comparison Features

### Compare with Current CLAUDE.md
```bash
/claude-md:preview --compare-current

Output:
📊 Comparison with Current CLAUDE.md

Current File Analysis:
- Size: 216 lines, ~8,500 tokens
- Last Modified: 2024-01-10
- Structure: Monolithic
- Content: Mixed general/specific guidance

Proposed Changes:
+ Add project-specific analysis section
+ Include Docker deployment patterns
+ Add FastAPI-specific backend guidance
+ Remove unused framework sections
- Reduce general examples by 40%
- Optimize token usage by 42%

Impact Summary:
✓ More relevant content for your project
✓ Significant token reduction (42%)
✓ Better organization and structure
⚠ Some general examples will be condensed
```

### Benchmark Performance
```bash
/claude-md:preview --benchmark

Output:
⚡ Performance Benchmarks

Analysis Performance:
- Project scanning: 0.8s
- Language detection: 0.3s
- Framework analysis: 0.5s
- Module selection: 0.1s
- Total analysis time: 1.7s

Generation Performance (estimated):
- Module loading: 0.4s
- Content processing: 0.6s
- Compression: 0.2s
- File writing: 0.1s
- Total generation time: 1.3s

Memory Usage:
- Peak memory: 12.4MB
- Module cache: 2.1MB
- Processing buffer: 3.8MB
```

## Troubleshooting Preview Issues

### Common Problems

**Unexpected Module Selection:**
```bash
/claude-md:preview --show-confidence --force-analysis
```

**Token Counts Seem Wrong:**
```bash
/claude-md:preview --show-tokens --compression none
```

**Missing Expected Content:**
```bash
/claude-md:preview --modules "expected-module.md" --sample-content
```

**Preview Taking Too Long:**
```bash
/claude-md:preview --analysis-only --quiet
```

The preview command provides comprehensive insight into the generation process, enabling you to make informed decisions about your CLAUDE.md configuration before committing to file generation.
