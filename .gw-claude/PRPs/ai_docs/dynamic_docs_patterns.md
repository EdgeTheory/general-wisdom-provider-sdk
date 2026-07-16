# Dynamic Documentation Generation Patterns

## Key Research Sources
- Docusaurus: https://github.com/facebook/docusaurus
- GitBook: https://github.com/GitbookIO/gitbook
- Sphinx: https://www.sphinx-doc.org/
- VitePress: https://vitepress.dev/
- Storybook: https://storybook.js.org/

## Critical Patterns for Implementation

### 1. Module-Based Composition
```python
class DocumentationComposer:
    def __init__(self, modules_dir: Path):
        self.modules_dir = modules_dir
        self.cache = {}

    def compose_document(self, selected_modules: List[str]) -> str:
        """Compose document from selected modules"""
        sections = []

        # Always include core modules first
        core_modules = self._get_core_modules()
        sections.extend(self._load_modules(core_modules))

        # Add context-specific modules
        context_modules = self._filter_modules(selected_modules)
        sections.extend(self._load_modules(context_modules))

        return self._combine_sections(sections)

    def _load_modules(self, modules: List[str]) -> List[str]:
        """Load modules with caching"""
        loaded = []
        for module_path in modules:
            if module_path in self.cache:
                loaded.append(self.cache[module_path])
            else:
                content = self._load_module_content(module_path)
                self.cache[module_path] = content
                loaded.append(content)
        return loaded
```

### 2. Context-Aware Module Selection
```python
def select_modules_by_context(user_prompt: str, available_modules: List[str]) -> List[str]:
    """Select optimal modules based on user context"""
    selected = []

    # Always include core modules
    selected.extend(['core/ORCHESTRATOR.md', 'core/RULES.md', 'core/PRINCIPLES.md'])

    # Domain-specific selection
    if any(keyword in user_prompt.lower() for keyword in ['security', 'auth', 'encrypt']):
        selected.extend(['domains/SECURITY.md', 'personas/SECURITY.md'])

    if any(keyword in user_prompt.lower() for keyword in ['api', 'backend', 'server']):
        selected.extend(['domains/BACKEND.md', 'personas/BACKEND.md'])

    if any(keyword in user_prompt.lower() for keyword in ['ui', 'frontend', 'react']):
        selected.extend(['domains/FRONTEND.md', 'personas/FRONTEND.md'])

    # Tech stack selection
    if any(keyword in user_prompt.lower() for keyword in ['python', 'fastapi', 'django']):
        selected.append('tech-stacks/PYTHON.md')

    if any(keyword in user_prompt.lower() for keyword in ['docker', 'container']):
        selected.append('tech-stacks/DOCKER.md')

    return list(set(selected))  # Remove duplicates
```

### 3. Token Optimization
```python
def optimize_content_for_tokens(content: str, max_tokens: int = 8000) -> str:
    """Optimize content to fit within token limits"""

    # Estimate tokens (rough: 1 token ≈ 4 characters)
    estimated_tokens = len(content) // 4

    if estimated_tokens <= max_tokens:
        return content

    # Compression strategies
    compressed = content

    # Remove excessive whitespace
    compressed = re.sub(r'\n\s*\n\s*\n', '\n\n', compressed)

    # Convert detailed sections to references
    compressed = re.sub(
        r'(\*For complete documentation, see )([^*]+)(\*)',
        r'\1@\2\3',
        compressed
    )

    # Truncate if still too long
    if len(compressed) // 4 > max_tokens:
        truncate_at = max_tokens * 4 - 100  # Leave room for truncation message
        compressed = compressed[:truncate_at] + "\n\n*[Content truncated for token optimization]*"

    return compressed
```

### 4. Dynamic Header Generation
```python
def generate_dynamic_header(context_profile: Dict) -> str:
    """Generate dynamic header based on context analysis"""

    header = f"""# CLAUDE.md - Dynamic Context ({context_profile['domain'].title()})

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Context**: {context_profile['intent']} ({context_profile['confidence']:.1%} confidence)
**Modules**: {len(context_profile['modules'])} selected
**Optimization**: Token-optimized for {context_profile['complexity']} complexity

---

# Context Profile

- **Domain**: {context_profile['domain']}
- **Intent**: {context_profile['intent']}
- **Complexity**: {context_profile['complexity']}
- **Tech Stack**: {', '.join(context_profile.get('tech_stacks', []))}
- **Reasoning**: {context_profile['reasoning']}

---
"""

    return header
```

## Key Implementation Guidelines

1. **Always prioritize core modules** - These provide foundational context
2. **Use intelligent caching** - Avoid re-reading modules repeatedly
3. **Implement token optimization** - Respect LLM context limits
4. **Make selection deterministic** - Same input should produce same output
5. **Include generation metadata** - Help debugging and understanding
6. **Support incremental updates** - Allow partial regeneration
7. **Handle missing modules gracefully** - System should work with incomplete module sets
