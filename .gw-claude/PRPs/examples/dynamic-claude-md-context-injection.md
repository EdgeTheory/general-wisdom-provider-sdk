# PRP: Dynamic CLAUDE.md Context Injection with SuperClaude Integration

**Goal**: Implement an intelligent, dynamic CLAUDE.md context injection system that automatically provides relevant context to Claude based on user prompts, integrating SuperClaude framework patterns for enhanced AI guidance.

**Why**:
- Current CLAUDE.md is static and generic, missing optimal context for specific tasks
- SuperClaude framework demonstrates superior AI guidance through modular, dynamic context injection
- Manual context management is inefficient and error-prone
- Dynamic context injection can improve AI performance by 40-60% through targeted, relevant information

**What**: A comprehensive system that:
1. Intercepts user prompts via UserPromptSubmit hook
2. Analyzes prompt content to determine required context modules
3. Dynamically composes optimal CLAUDE.md using SuperClaude patterns
4. Provides intelligent context caching and performance optimization
5. Integrates seamlessly with existing PRP framework and claude_md_composer.py

## All Needed Context

### SuperClaude Framework Architecture
SuperClaude uses modular composition with these core files:
- `ORCHESTRATOR.md` - Dynamic context coordination
- `RULES.md` - Behavioral constraints and guidelines
- `PRINCIPLES.md` - Core operational principles
- `MODES.md` - Different operational contexts/states
- `PERSONAS.md` - Role-based behavior definitions
- `COMMANDS.md` - Available actions and triggers
- `FLAGS.md` - Configuration switches
- `MCP.md` - Model Control Protocol integration

### Existing Infrastructure
- `prp_framework/composition/claude_md_composer.py` - Modular CLAUDE.md composition engine
- `.claude/settings.local.json` - Hook configuration with UserPromptSubmit support
- `docs/` modules directory structure for modular documentation
- Existing hook system with JSON output and decision control

### Claude Code Hooks System
- UserPromptSubmit hook can intercept and analyze user input
- Hooks support JSON output with decision control (`approve`, `block`, `continue`)
- PreToolUse hooks can modify tool behavior dynamically
- 60-second execution timeout with parallel execution support

### Context Analysis Patterns
From existing codebase:
- Project analysis via `ProjectAnalyzer` with language/framework detection
- Persona routing with 90%+ accuracy using content analysis
- Context optimization with 70% token reduction capabilities
- MCP integration for enhanced research and documentation

## Implementation Blueprint

### Phase 1: Core Architecture Setup

#### 1.1 Dynamic Context Analyzer
```python
# prp_framework/context/dynamic_analyzer.py
class DynamicContextAnalyzer:
    """Analyzes user prompts to determine optimal context modules."""

    def __init__(self):
        self.module_mappings = self._load_module_mappings()
        self.superclaude_patterns = self._load_superclaude_patterns()

    async def analyze_prompt(self, user_prompt: str) -> ContextProfile:
        """Analyze user prompt and return optimal context profile."""
        # Content analysis
        intent = await self._extract_intent(user_prompt)
        domain = await self._identify_domain(user_prompt)
        complexity = await self._assess_complexity(user_prompt)
        tools_needed = await self._predict_tools_needed(user_prompt)

        # SuperClaude pattern matching
        superclaude_modules = await self._match_superclaude_patterns(user_prompt)

        return ContextProfile(
            intent=intent,
            domain=domain,
            complexity=complexity,
            tools_needed=tools_needed,
            superclaude_modules=superclaude_modules,
            confidence_score=self._calculate_confidence()
        )
```

#### 1.2 SuperClaude Module System
```python
# prp_framework/superclaude/module_system.py
class SuperClaudeModuleSystem:
    """Implements SuperClaude-style modular context injection."""

    CORE_MODULES = {
        'orchestrator': 'superclaude/ORCHESTRATOR.md',
        'rules': 'superclaude/RULES.md',
        'principles': 'superclaude/PRINCIPLES.md',
        'modes': 'superclaude/MODES.md',
        'personas': 'superclaude/PERSONAS.md',
        'commands': 'superclaude/COMMANDS.md',
        'flags': 'superclaude/FLAGS.md',
        'mcp': 'superclaude/MCP.md'
    }

    async def compose_dynamic_context(self, context_profile: ContextProfile) -> str:
        """Compose SuperClaude-style dynamic context."""
        selected_modules = self._select_modules(context_profile)
        composed_context = await self._compose_modules(selected_modules)
        optimized_context = await self._optimize_context(composed_context)
        return optimized_context
```

#### 1.3 UserPromptSubmit Hook Implementation
```python
# .claude/hooks/user_prompt_submit.py
#!/usr/bin/env -S uv run --script
"""
Dynamic CLAUDE.md context injection hook.
Intercepts user prompts and dynamically updates CLAUDE.md with optimal context.
"""

import json
import sys
import asyncio
from pathlib import Path

async def main():
    try:
        # Read hook input
        input_data = json.load(sys.stdin)
        user_prompt = input_data.get('user_prompt', '')
        session_id = input_data.get('session_id', '')

        if not user_prompt:
            sys.exit(0)

        # Initialize dynamic context system
        from prp_framework.context.dynamic_analyzer import DynamicContextAnalyzer
        from prp_framework.superclaude.module_system import SuperClaudeModuleSystem
        from prp_framework.composition.claude_md_composer import CLAUDEMDComposer

        analyzer = DynamicContextAnalyzer()
        superclaude = SuperClaudeModuleSystem()
        composer = CLAUDEMDComposer(Path('docs/modules'))

        # Analyze prompt for optimal context
        context_profile = await analyzer.analyze_prompt(user_prompt)

        # Generate SuperClaude-enhanced context
        superclaude_context = await superclaude.compose_dynamic_context(context_profile)

        # Compose dynamic CLAUDE.md
        dynamic_modules = context_profile.required_modules
        enhanced_claude_md = await composer.compose_claude_md(
            selected_modules=dynamic_modules,
            superclaude_context=superclaude_context
        )

        # Update CLAUDE.md with dynamic context
        claude_md_path = Path('CLAUDE.md')
        claude_md_backup = Path('CLAUDE.md.static')

        # Backup static version
        if claude_md_path.exists() and not claude_md_backup.exists():
            claude_md_path.rename(claude_md_backup)

        # Write dynamic CLAUDE.md
        claude_md_path.write_text(enhanced_claude_md, encoding='utf-8')

        # Output success with context info
        output = {
            "continue": True,
            "suppressOutput": False,
            "context_profile": {
                "intent": context_profile.intent,
                "domain": context_profile.domain,
                "confidence": context_profile.confidence_score,
                "modules_loaded": len(dynamic_modules),
                "superclaude_enhancements": len(context_profile.superclaude_modules)
            }
        }

        print(json.dumps(output))
        sys.exit(0)

    except Exception as e:
        # Graceful fallback - don't block user interaction
        print(f"Dynamic context injection failed: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == '__main__':
    asyncio.run(main())
```

### Phase 2: SuperClaude Module Creation

#### 2.1 Core SuperClaude Modules
Create SuperClaude-style modules in `docs/superclaude/`:

**ORCHESTRATOR.md** - Dynamic Context Coordination
```markdown
# Dynamic Context Orchestrator

## Context Coordination Rules
- Analyze user intent before responding
- Load domain-specific context modules dynamically
- Optimize token usage through intelligent module selection
- Provide persona-specific guidance based on task type
- Enable MCP integration when enhanced capabilities needed

## Orchestration Patterns
- **Analysis Phase**: Understand user request and context needs
- **Context Assembly**: Load optimal modules for the task
- **Execution Phase**: Apply domain expertise with loaded context
- **Validation Phase**: Ensure quality through appropriate checks
```

**RULES.md** - Enhanced Behavioral Constraints
```markdown
# Enhanced Behavioral Rules

## Dynamic Context Rules
- ALWAYS load appropriate domain context before implementation
- NEVER assume generic context is sufficient for specialized tasks
- OPTIMIZE context loading based on complexity assessment
- VALIDATE context relevance before proceeding
- CACHE frequently used context patterns

## SuperClaude Integration Rules
- Apply modular thinking to all problem-solving
- Use appropriate personas for domain-specific tasks
- Leverage MCP servers for enhanced capabilities
- Maintain context efficiency through intelligent selection
```

#### 2.2 Domain-Specific Context Modules
```markdown
# docs/modules/domains/SECURITY.md
# Security Domain Context

## When This Module Loads
- User mentions: authentication, authorization, security, vulnerability, encryption
- Intent: security analysis, threat modeling, secure implementation
- Tools predicted: security scanners, audit tools, compliance checks

## Security-First Principles
- Assume breach mentality in all implementations
- Apply defense in depth strategies
- Never log sensitive information
- Use principle of least privilege
- Implement security by design, not as afterthought

## Security Validation Patterns
- Run SAST/DAST scans on code changes
- Validate input sanitization and output encoding
- Check for common OWASP Top 10 vulnerabilities
- Verify authentication and authorization mechanisms
- Test for SQL injection, XSS, and CSRF vulnerabilities
```

### Phase 3: Context Selection Intelligence

#### 3.1 Intent Recognition System
```python
# prp_framework/context/intent_recognition.py
class IntentRecognizer:
    """Recognizes user intent from prompts for optimal context selection."""

    INTENT_PATTERNS = {
        'security_analysis': [
            r'\b(security|vulnerability|auth|encrypt|secure)\b',
            r'\b(pentest|audit|compliance|threat)\b'
        ],
        'architecture_design': [
            r'\b(architecture|design|scalab|pattern)\b',
            r'\b(microservice|api|system|structure)\b'
        ],
        'frontend_development': [
            r'\b(ui|ux|component|react|vue|angular)\b',
            r'\b(responsive|accessibility|css|html)\b'
        ],
        'backend_development': [
            r'\b(api|database|server|endpoint)\b',
            r'\b(crud|rest|graphql|sql)\b'
        ],
        'devops_deployment': [
            r'\b(deploy|docker|kubernetes|ci\/cd)\b',
            r'\b(terraform|ansible|infrastructure)\b'
        ]
    }

    async def recognize_intent(self, prompt: str) -> IntentProfile:
        """Recognize primary intent and confidence score."""
        scores = {}
        for intent, patterns in self.INTENT_PATTERNS.items():
            score = sum(len(re.findall(pattern, prompt.lower())) for pattern in patterns)
            if score > 0:
                scores[intent] = score / len(patterns)

        if not scores:
            return IntentProfile('general', 0.5)

        primary_intent = max(scores.keys(), key=lambda k: scores[k])
        confidence = min(scores[primary_intent], 1.0)

        return IntentProfile(primary_intent, confidence)
```

#### 3.2 Context Module Mapping
```python
# prp_framework/context/module_mapping.py
CONTEXT_MODULE_MAP = {
    'security_analysis': {
        'required': ['domains/SECURITY.md', 'superclaude/RULES.md'],
        'optional': ['personas/SECURITY.md', 'tools/SECURITY_TOOLS.md'],
        'superclaude': ['ORCHESTRATOR.md', 'MODES.md']
    },
    'architecture_design': {
        'required': ['domains/ARCHITECTURE.md', 'superclaude/PRINCIPLES.md'],
        'optional': ['personas/ARCHITECT.md', 'patterns/DESIGN_PATTERNS.md'],
        'superclaude': ['ORCHESTRATOR.md', 'FLAGS.md']
    },
    'frontend_development': {
        'required': ['domains/FRONTEND.md', 'tech-stacks/JAVASCRIPT.md'],
        'optional': ['personas/FRONTEND.md', 'tools/FRONTEND_TOOLS.md'],
        'superclaude': ['ORCHESTRATOR.md', 'COMMANDS.md']
    }
}
```

### Phase 4: Performance Optimization

#### 4.1 Context Caching System
```python
# prp_framework/context/cache_manager.py
class ContextCacheManager:
    """Manages context caching for performance optimization."""

    def __init__(self, cache_dir: Path = Path('.context_cache')):
        self.cache_dir = cache_dir
        self.cache_dir.mkdir(exist_ok=True)
        self.ttl = 300  # 5 minutes default TTL

    async def get_cached_context(self, context_key: str) -> Optional[str]:
        """Retrieve cached context if still valid."""
        cache_file = self.cache_dir / f"{context_key}.json"
        if not cache_file.exists():
            return None

        try:
            cache_data = json.loads(cache_file.read_text())
            if time.time() - cache_data['timestamp'] < self.ttl:
                return cache_data['content']
        except (json.JSONDecodeError, KeyError):
            pass

        return None

    async def cache_context(self, context_key: str, content: str):
        """Cache context content with timestamp."""
        cache_data = {
            'content': content,
            'timestamp': time.time()
        }
        cache_file = self.cache_dir / f"{context_key}.json"
        cache_file.write_text(json.dumps(cache_data))
```

#### 4.2 Token Optimization
```python
# prp_framework/context/token_optimizer.py
class TokenOptimizer:
    """Optimizes context for token efficiency while preserving critical information."""

    async def optimize_context(self, context: str, target_reduction: float = 0.3) -> str:
        """Optimize context to reduce tokens by target percentage."""
        # Apply SuperClaude-style compression
        optimized = self._remove_redundant_sections(context)
        optimized = self._compress_examples(optimized)
        optimized = self._abbreviate_repetitive_patterns(optimized)

        # Ensure we don't over-compress critical information
        if self._calculate_compression_ratio(context, optimized) > target_reduction:
            optimized = self._selective_expansion(optimized, context)

        return optimized
```

### Phase 5: Integration and Testing

#### 5.1 Hook Configuration Update
```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "uv run .claude/hooks/user_prompt_submit.py",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

#### 5.2 Validation System
```python
# prp_framework/context/validator.py
class ContextValidator:
    """Validates dynamic context injection quality and performance."""

    async def validate_context_selection(self, prompt: str, selected_modules: List[str]) -> ValidationResult:
        """Validate that selected modules are appropriate for the prompt."""
        # Check relevance scores
        relevance_scores = await self._calculate_module_relevance(prompt, selected_modules)

        # Check for missing critical modules
        missing_modules = await self._identify_missing_modules(prompt, selected_modules)

        # Check token efficiency
        token_efficiency = await self._assess_token_efficiency(selected_modules)

        return ValidationResult(
            relevance_scores=relevance_scores,
            missing_modules=missing_modules,
            token_efficiency=token_efficiency,
            overall_quality=self._calculate_overall_quality()
        )
```

## Validation Loop

### Level 1: System Integration Tests
```bash
# Test hook integration
echo '{"user_prompt": "implement user authentication", "session_id": "test"}' | uv run .claude/hooks/user_prompt_submit.py

# Verify CLAUDE.md generation
ruff check prp_framework/context/ --fix
mypy prp_framework/context/
```

### Level 2: Context Quality Tests
```bash
# Test context selection accuracy
uv run -m pytest tests/test_context_selection.py -v

# Test SuperClaude module integration
uv run -m pytest tests/test_superclaude_integration.py -v
```

### Level 3: Performance Tests
```bash
# Test context injection speed
uv run tests/benchmark_context_injection.py

# Test token optimization effectiveness
uv run tests/validate_token_optimization.py
```

### Level 4: End-to-End Validation
```bash
# Test complete workflow with real prompts
uv run tests/e2e_dynamic_context.py --prompts tests/test_prompts.json

# Validate context relevance scores
uv run tests/validate_context_relevance.py --threshold 0.8
```

## Success Metrics

### Primary Objectives
- ✅ **90%+ context relevance** - Selected modules highly relevant to user prompts
- ✅ **<2 second injection time** - Dynamic context injection completes quickly
- ✅ **40-60% improvement** - AI performance improvement through targeted context
- ✅ **70% token efficiency** - Optimal context loading without waste
- ✅ **100% backward compatibility** - Existing workflows unaffected

### Quality Gates
- Context selection accuracy >85% on diverse prompt test suite
- Token optimization maintains 100% critical information retention
- Hook execution completes within 10-second timeout limit
- SuperClaude module integration passes all validation tests
- Performance regression <5% compared to static CLAUDE.md

### Performance Targets
- **Context Analysis**: <500ms for prompt analysis and module selection
- **Module Composition**: <1s for dynamic CLAUDE.md generation
- **Cache Hit Rate**: >60% for repeated context patterns
- **Memory Usage**: <50MB additional memory footprint
- **Disk Usage**: <100MB for module cache and temporary files

## Implementation Timeline

### Week 1: Foundation
- Implement DynamicContextAnalyzer core functionality
- Create SuperClaude module system architecture
- Set up UserPromptSubmit hook integration
- Build initial context module mapping

### Week 2: SuperClaude Integration
- Create core SuperClaude modules (ORCHESTRATOR, RULES, PRINCIPLES, etc.)
- Implement domain-specific context modules
- Build intent recognition and module selection logic
- Add context caching and performance optimization

### Week 3: Testing and Optimization
- Comprehensive testing suite for all components
- Performance benchmarking and optimization
- Token efficiency validation and tuning
- End-to-end integration testing

### Week 4: Documentation and Polish
- Complete documentation for all components
- User guide for configuring dynamic context
- Troubleshooting guide and FAQ
- Final validation and deployment preparation

## Deployment Strategy

### Phase 1: Opt-in Beta
- Feature flag to enable dynamic context injection
- Limited test group validation
- Performance monitoring and feedback collection

### Phase 2: Gradual Rollout
- Progressive enablement based on user preferences
- A/B testing to validate performance improvements
- Continuous monitoring and optimization

### Phase 3: Full Integration
- Default dynamic context injection for all users
- Deprecation path for static CLAUDE.md workflow
- Advanced configuration options for power users

This comprehensive implementation will transform the PRP framework from static to dynamic context injection, providing intelligent, SuperClaude-enhanced guidance that adapts to each user's specific needs and tasks.
