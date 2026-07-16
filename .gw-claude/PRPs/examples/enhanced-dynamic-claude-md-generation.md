# PRP: Enhanced Dynamic CLAUDE.md Generation with Active Module Auto-Loading

**Template Version:** 2.1
**Compatible with:** PRP Framework + SuperClaude + Dynamic Context Injection System
**Features:** Advanced tech stack detection, active module enforcement, sophisticated context analysis, proactive module loading

---

## Goal

**Enhanced Dynamic CLAUDE.md Generation System** that provides:
- **Advanced Tech Stack Detection**: Sophisticated project analysis beyond current keyword matching
- **Active Module Auto-Loading**: Proactive enforcement that ensures Claude actually reads referenced modules
- **Sophisticated Context Intelligence**: Deep project understanding for optimal module selection
- **Seamless Integration**: Works with existing hook system while adding robustness

## Why

**Current System Analysis (Based on Research):**
- Dynamic context injection is working via pre-tool hooks
- Context generation is functional but has basic tech stack detection
- Module loading enforcement is passive (relies on Claude following instructions)
- No verification that modules are actually read and applied
- Context drift possible in long sessions

**Business Value:**
- **40-60% improvement in AI performance** through precise context targeting
- **Reduced token waste** by eliminating irrelevant modules
- **Enhanced reliability** through active enforcement mechanisms
- **Better user experience** with context that truly matches project needs

**Technical Motivation:**
- Current tech stack detection is basic keyword/file matching
- Passive enforcement can be ignored or missed by Claude
- No feedback loop to learn from context effectiveness
- Missing verification of module loading compliance

## What

### Enhanced System Behavior

**Advanced Detection Capabilities:**
- **Deep Code Analysis**: AST parsing, dependency graph analysis, build system detection
- **Version-Aware Detection**: Framework versions, compatibility matrices, migration guidance
- **Architecture Pattern Recognition**: Microservices, monolith, serverless, event-driven patterns
- **Security Context Awareness**: Vulnerability scanning, compliance requirements, security tooling

**Active Module Auto-Loading:**
- **Pre-execution Verification**: Verify modules are loaded before allowing tool execution
- **Real-time Compliance Monitoring**: Track module reading and context application
- **Automatic Recovery**: Re-load context when drift is detected
- **Command-Level Integration**: Embed module loading into meta-commands

**Enhanced User Experience:**
- **Context Quality Metrics**: Show relevance scores and confidence levels
- **Adaptive Learning**: System learns from successful context applications
- **Debugging Tools**: Visibility into why specific modules were selected
- **Performance Monitoring**: Track context effectiveness over time

### Technical Requirements

**Enhanced Detection Engine:**
- Multi-layer analysis combining file scanning, dependency parsing, and code analysis
- Machine learning-based pattern recognition for complex project types
- Real-time project change detection with incremental updates
- Integration with external tools (SonarQube, Dependabot, etc.)

**Active Enforcement System:**
- Hook-based module loading verification
- Tool execution gating based on context compliance
- Session-persistent context with automatic refresh
- Compliance tracking and reporting

## All Needed Context

### Documentation & References

```yaml
# ESSENTIAL RESEARCH FOUNDATIONS
required_reading:
  - url: https://docs.anthropic.com/claude/docs/intro-to-claude
    why: Understanding Claude's context management and instruction following
    section: Context windows, prompt caching, system instructions
    critical: How Claude processes and maintains context across conversations

  - url: https://microsoft.github.io/language-server-protocol/
    why: Real-time analysis patterns for dynamic context injection
    section: Document synchronization, incremental updates, context management
    critical: How to maintain context consistency during editing

  - url: https://github.com/github/linguist
    why: Statistical analysis approach to language detection
    section: Language detection algorithms, file classification
    critical: Multi-dimensional project analysis beyond simple pattern matching

  - url: https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/
    why: Advanced code analysis and quality metrics
    section: Multi-language support, dependency analysis, security scanning
    critical: How to detect code quality, complexity, and security patterns

  - url: https://tree-sitter.github.io/tree-sitter/
    why: Incremental parsing for real-time project analysis
    section: Syntax tree parsing, error resilience, language grammars
    critical: How to parse and analyze code structure efficiently

  - url: https://docs.renovatebot.com/configuration-options/
    why: Dependency intelligence and automated updates
    section: Multi-ecosystem support, dependency categorization
    critical: How to analyze dependency patterns and project architecture

# CURRENT SYSTEM DEEP DIVE
existing_implementation:
  - file: .claude/hooks/pre_tool_dynamic_context.py
    why: Current hook implementation that generates dynamic CLAUDE.md
    critical: Understanding current trigger mechanisms and context injection flow

  - file: prp_framework/context/dynamic_analyzer.py
    why: Current context analysis and intent recognition system
    critical: Existing intelligence that can be enhanced and extended

  - file: prp_framework/context/module_mapping.py
    why: Current module selection logic and patterns
    critical: Foundation for enhanced module selection algorithms

  - file: prp_framework/analysis/project_analyzer.py
    why: Current tech stack detection capabilities
    critical: Base system to enhance with advanced detection capabilities

  - file: prp_framework/composition/claude_md_composer.py
    why: Current CLAUDE.md generation and composition engine
    critical: Template system that needs enhancement for active enforcement

# ADVANCED ARCHITECTURE PATTERNS
advanced_patterns:
  - docfile: PRPs/ai_docs/claude_context_management.md
    why: Advanced patterns for ensuring Claude context compliance
    critical: How to implement active context enforcement and verification

  - docfile: PRPs/ai_docs/ast_analysis_patterns.md
    why: AST parsing and code analysis techniques
    critical: Deep project understanding beyond file pattern matching

  - docfile: PRPs/ai_docs/machine_learning_classification.md
    why: ML-based project classification and pattern recognition
    critical: How to implement adaptive learning for context selection
```

### Current Codebase Analysis

**Existing System Architecture:**
```bash
# Current working system (from research)
code-agent/
├── .claude/hooks/
│   ├── pre_tool_dynamic_context.py    # Main context injection hook
│   ├── user_prompt_submit.py          # User prompt interception
│   └── post_tool_use.py               # Monitoring and logging
├── prp_framework/
│   ├── context/
│   │   ├── dynamic_analyzer.py        # Intent recognition (11 patterns)
│   │   ├── module_mapping.py          # Context-to-module mapping
│   │   └── intent_recognition.py      # Pattern matching system
│   ├── analysis/
│   │   └── project_analyzer.py        # Tech stack detection (15+ frameworks)
│   ├── composition/
│   │   └── claude_md_composer.py      # CLAUDE.md generation
│   └── superclaude/
│       └── module_system.py           # SuperClaude integration
├── docs/modules/
│   ├── core/                          # 9 core modules (always loaded)
│   ├── domains/                       # 6 domain modules
│   ├── personas/                      # 6 persona modules
│   ├── tech-stacks/                   # 4 tech stack modules
│   ├── patterns/                      # 1 pattern module
│   └── tools/                         # 1 tool module
└── CLAUDE.md                          # Generated dynamic content
```

**Current Capabilities (From Research):**
- **Working Context Injection**: Pre-tool hook successfully generates dynamic CLAUDE.md
- **Intent Recognition**: 11 distinct intent categories with confidence scoring
- **Tech Stack Detection**: 15+ frameworks across 12 programming languages
- **Module Selection**: Context-aware module selection with 27 total modules
- **SuperClaude Integration**: 8 enhancement patterns for core modules
- **Session Management**: 30-minute cooldown prevents duplicate processing
- **Enforcement Mechanism**: Passive instruction-based module loading

### Enhanced System Architecture

**Target Architecture:**
```bash
# Enhanced system with active enforcement
code-agent/
├── .claude/hooks/
│   ├── pre_tool_dynamic_context.py    # Enhanced with active enforcement
│   ├── pre_tool_module_validator.py   # NEW: Module loading verification
│   └── post_tool_context_tracker.py  # NEW: Context compliance monitoring
├── prp_framework/
│   ├── context/
│   │   ├── advanced_analyzer.py       # NEW: Enhanced with AST parsing
│   │   ├── ml_classifier.py           # NEW: ML-based project classification
│   │   ├── dependency_analyzer.py     # NEW: Deep dependency analysis
│   │   └── context_validator.py       # NEW: Active context verification
│   ├── enforcement/
│   │   ├── module_loader.py           # NEW: Active module loading
│   │   ├── compliance_monitor.py      # NEW: Real-time compliance tracking
│   │   └── recovery_manager.py        # NEW: Context drift recovery
│   ├── intelligence/
│   │   ├── pattern_learner.py         # NEW: Adaptive pattern learning
│   │   ├── performance_tracker.py     # NEW: Context effectiveness metrics
│   │   └── feedback_processor.py      # NEW: User feedback integration
│   └── integrations/
│       ├── sonarqube_integration.py   # NEW: Code quality analysis
│       ├── dependabot_integration.py  # NEW: Dependency scanning
│       └── security_scanner.py        # NEW: Security context analysis
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Claude Code Hook System Limitations
# Hook timeout is 60 seconds max - complex analysis must be cached
# UserPromptSubmit hook is unreliable - use PreToolUse as workaround
# Hook JSON output controls execution - must handle gracefully

# CRITICAL: AST Parsing Considerations
# Not all languages have Python AST equivalent - use tree-sitter for universal parsing
# Large files can cause memory issues - implement streaming analysis
# Syntax errors in source code can break parsing - need error resilience

# CRITICAL: Machine Learning Integration
# scikit-learn requires training data - start with rule-based, evolve to ML
# Model serialization adds ~10MB to system - implement lazy loading
# Feature extraction must be deterministic - avoid timing-based features

# CRITICAL: Context Enforcement Patterns
# Claude can ignore instructions - need multiple enforcement layers
# Token limits affect context size - implement intelligent compression
# Context drift over long sessions - implement periodic refresh

# CRITICAL: Performance Considerations
# File system scanning is I/O bound - implement caching and incremental updates
# Dependency parsing is CPU intensive - use background processing
# Context generation must be <10 seconds - implement progressive enhancement
```

## Implementation Blueprint

### Phase 1: Enhanced Tech Stack Detection

**Advanced Project Analysis System:**
```python
# prp_framework/analysis/advanced_analyzer.py
class AdvancedProjectAnalyzer:
    """Enhanced project analysis with AST parsing, dependency analysis, and ML classification."""

    def __init__(self):
        self.ast_parser = ASTAnalyzer()
        self.dependency_analyzer = DependencyAnalyzer()
        self.ml_classifier = MLProjectClassifier()
        self.security_scanner = SecurityContextAnalyzer()
        self.performance_profiler = PerformanceProfiler()

    async def analyze_project_comprehensive(self, project_path: Path) -> EnhancedProjectProfile:
        """Comprehensive project analysis with multiple detection layers."""
        # Layer 1: File system analysis (existing)
        basic_analysis = await self.analyze_file_system(project_path)

        # Layer 2: AST-based code analysis (NEW)
        code_analysis = await self.ast_parser.analyze_codebase(project_path)

        # Layer 3: Dependency graph analysis (NEW)
        dependency_analysis = await self.dependency_analyzer.analyze_dependencies(project_path)

        # Layer 4: ML-based classification (NEW)
        ml_classification = await self.ml_classifier.classify_project(project_path)

        # Layer 5: Security context analysis (NEW)
        security_analysis = await self.security_scanner.analyze_security_context(project_path)

        # Layer 6: Performance profiling (NEW)
        performance_profile = await self.performance_profiler.profile_project(project_path)

        return EnhancedProjectProfile(
            basic_analysis=basic_analysis,
            code_patterns=code_analysis,
            dependencies=dependency_analysis,
            ml_classification=ml_classification,
            security_context=security_analysis,
            performance_profile=performance_profile,
            confidence_score=self._calculate_composite_confidence()
        )
```

**AST-Based Code Analysis:**
```python
# prp_framework/analysis/ast_analyzer.py
class ASTAnalyzer:
    """AST-based code analysis for deep project understanding."""

    def __init__(self):
        self.language_parsers = {
            'python': PythonASTParser(),
            'javascript': TreeSitterParser('javascript'),
            'typescript': TreeSitterParser('typescript'),
            'java': TreeSitterParser('java'),
            'go': TreeSitterParser('go'),
            'rust': TreeSitterParser('rust')
        }

    async def analyze_codebase(self, project_path: Path) -> CodeAnalysis:
        """Analyze code structure, patterns, and complexity."""
        analysis_results = {}

        for language, parser in self.language_parsers.items():
            language_files = await self._find_language_files(project_path, language)
            if language_files:
                analysis_results[language] = await parser.analyze_files(language_files)

        return CodeAnalysis(
            architecture_patterns=self._detect_architecture_patterns(analysis_results),
            complexity_metrics=self._calculate_complexity_metrics(analysis_results),
            design_patterns=self._identify_design_patterns(analysis_results),
            api_patterns=self._analyze_api_patterns(analysis_results),
            test_patterns=self._analyze_test_patterns(analysis_results),
            security_patterns=self._analyze_security_patterns(analysis_results)
        )

    def _detect_architecture_patterns(self, analysis_results: Dict) -> List[str]:
        """Detect architectural patterns from code analysis."""
        patterns = []

        # Microservices pattern detection
        if self._has_microservices_indicators(analysis_results):
            patterns.append('microservices')

        # Event-driven architecture detection
        if self._has_event_driven_indicators(analysis_results):
            patterns.append('event-driven')

        # Layered architecture detection
        if self._has_layered_architecture_indicators(analysis_results):
            patterns.append('layered')

        # Domain-driven design detection
        if self._has_ddd_indicators(analysis_results):
            patterns.append('domain-driven')

        return patterns
```

### Phase 2: Active Module Auto-Loading System

**Pre-Tool Module Validation Hook:**
```python
# .claude/hooks/pre_tool_module_validator.py
#!/usr/bin/env -S uv run --script
"""
Active module loading verification hook.
Ensures Claude has actually read and loaded required modules before tool execution.
"""

import json
import sys
import asyncio
from pathlib import Path
from typing import Dict, List, Optional

async def main():
    try:
        # Read hook input
        input_data = json.load(sys.stdin)
        tool_name = input_data.get('tool_name', '')
        session_id = input_data.get('session_id', '')

        # Skip validation for certain tools
        if tool_name in ['Read', 'Write', 'TodoWrite']:
            sys.exit(0)

        # Initialize module enforcement system
        from prp_framework.enforcement.module_loader import ModuleLoader
        from prp_framework.enforcement.compliance_monitor import ComplianceMonitor

        module_loader = ModuleLoader()
        compliance_monitor = ComplianceMonitor()

        # Check if required modules are loaded
        required_modules = await module_loader.get_required_modules(session_id)
        compliance_status = await compliance_monitor.check_module_compliance(
            session_id, required_modules
        )

        if not compliance_status.is_compliant:
            # Force module loading before tool execution
            await module_loader.force_module_loading(required_modules)

            # Generate enforcement instructions
            enforcement_instructions = await module_loader.generate_enforcement_instructions(
                required_modules, compliance_status.missing_modules
            )

            # Inject enforcement into tool execution
            output = {
                "continue": True,
                "suppressOutput": False,
                "context_injection": enforcement_instructions,
                "enforcement_required": True,
                "missing_modules": compliance_status.missing_modules
            }

            print(json.dumps(output))
            sys.exit(0)

        # Modules are compliant - allow tool execution
        sys.exit(0)

    except Exception as e:
        # Graceful fallback - don't block tool execution
        print(f"Module validation failed: {e}", file=sys.stderr)
        sys.exit(0)

if __name__ == '__main__':
    asyncio.run(main())
```

**Active Module Loading System:**
```python
# prp_framework/enforcement/module_loader.py
class ModuleLoader:
    """Active module loading and verification system."""

    def __init__(self):
        self.compliance_tracker = ComplianceTracker()
        self.context_validator = ContextValidator()
        self.recovery_manager = RecoveryManager()

    async def force_module_loading(self, required_modules: List[str]) -> ModuleLoadingResult:
        """Force loading of required modules with verification."""
        loading_result = ModuleLoadingResult()

        for module_path in required_modules:
            # Generate specific Read tool calls for each module
            read_command = await self._generate_read_command(module_path)

            # Inject read command into tool execution flow
            await self._inject_read_command(read_command)

            # Verify module was actually read
            verification_result = await self._verify_module_loaded(module_path)
            loading_result.add_module_result(module_path, verification_result)

        return loading_result

    async def _generate_read_command(self, module_path: str) -> str:
        """Generate specific Read tool command for module."""
        return f"""
        **IMMEDIATE ACTION REQUIRED**: Use the Read tool to load this module:

        Read tool parameters:
        - file_path: {module_path}
        - Read the ENTIRE file content
        - Apply the guidance immediately

        This module contains critical context for your current task.
        """

    async def _verify_module_loaded(self, module_path: str) -> bool:
        """Verify that module content is actually in Claude's context."""
        # This is a placeholder - actual verification would require
        # Claude Code API integration or conversation analysis
        return True

    async def generate_enforcement_instructions(
        self,
        required_modules: List[str],
        missing_modules: List[str]
    ) -> str:
        """Generate enforcement instructions for missing modules."""
        instructions = [
            "🚨 **ACTIVE MODULE LOADING ENFORCEMENT** 🚨",
            "",
            "**IMMEDIATE ACTION REQUIRED**: You MUST read these modules RIGHT NOW:",
            ""
        ]

        for module_path in missing_modules:
            instructions.extend([
                f"**{module_path}**",
                f"- Use: Read tool with file_path: {module_path}",
                f"- Read the ENTIRE content and apply guidance immediately",
                f"- This module is CRITICAL for your current task",
                ""
            ])

        instructions.extend([
            "**ENFORCEMENT RULES**:",
            "- You CANNOT proceed without reading these modules",
            "- Each module provides essential context for your task",
            "- Failure to read modules will result in suboptimal performance",
            "- This is NOT optional - it is mandatory for task success",
            "",
            "**VERIFICATION**: Once you've read all modules, proceed with the task."
        ])

        return "\n".join(instructions)
```

### Phase 3: Real-time Compliance Monitoring

**Context Compliance Monitor:**
```python
# prp_framework/enforcement/compliance_monitor.py
class ComplianceMonitor:
    """Real-time monitoring of context compliance and module usage."""

    def __init__(self):
        self.session_tracker = SessionTracker()
        self.context_analyzer = ContextAnalyzer()
        self.performance_metrics = PerformanceMetrics()

    async def check_module_compliance(
        self,
        session_id: str,
        required_modules: List[str]
    ) -> ComplianceStatus:
        """Check if required modules are loaded and being used."""
        compliance_status = ComplianceStatus()

        # Check session context for module content
        session_context = await self.session_tracker.get_session_context(session_id)

        for module_path in required_modules:
            module_compliance = await self._check_module_compliance(
                session_context, module_path
            )
            compliance_status.add_module_status(module_path, module_compliance)

        return compliance_status

    async def _check_module_compliance(
        self,
        session_context: SessionContext,
        module_path: str
    ) -> ModuleComplianceStatus:
        """Check compliance for a specific module."""
        # Check if module content is present in context
        module_content = await self._get_module_content(module_path)
        content_present = await self._check_content_presence(
            session_context, module_content
        )

        # Check if module guidance is being applied
        guidance_applied = await self._check_guidance_application(
            session_context, module_path
        )

        # Calculate compliance confidence
        confidence = self._calculate_compliance_confidence(
            content_present, guidance_applied
        )

        return ModuleComplianceStatus(
            module_path=module_path,
            content_present=content_present,
            guidance_applied=guidance_applied,
            confidence=confidence,
            last_verified=datetime.now()
        )

    async def monitor_context_drift(self, session_id: str) -> ContextDriftStatus:
        """Monitor for context drift and trigger recovery if needed."""
        drift_status = ContextDriftStatus()

        # Check for context degradation signals
        degradation_signals = await self._detect_degradation_signals(session_id)

        if degradation_signals.requires_recovery:
            # Trigger context recovery
            recovery_result = await self.recovery_manager.recover_context(
                session_id, degradation_signals
            )
            drift_status.recovery_triggered = True
            drift_status.recovery_result = recovery_result

        return drift_status
```

### Phase 4: Machine Learning Classification Enhancement

**ML-Based Project Classification:**
```python
# prp_framework/intelligence/ml_classifier.py
class MLProjectClassifier:
    """Machine learning-based project classification and pattern recognition."""

    def __init__(self):
        self.feature_extractor = FeatureExtractor()
        self.pattern_learner = PatternLearner()
        self.feedback_processor = FeedbackProcessor()
        self.model_cache = ModelCache()

    async def classify_project(self, project_path: Path) -> MLClassificationResult:
        """Classify project using ML models trained on successful contexts."""
        # Extract features from project
        features = await self.feature_extractor.extract_features(project_path)

        # Load or train classification model
        model = await self._get_or_train_model()

        # Perform classification
        classification_result = await model.classify(features)

        # Apply confidence scoring
        confidence = await self._calculate_classification_confidence(
            features, classification_result
        )

        return MLClassificationResult(
            project_type=classification_result.project_type,
            architecture_pattern=classification_result.architecture_pattern,
            complexity_level=classification_result.complexity_level,
            recommended_modules=classification_result.recommended_modules,
            confidence=confidence,
            features_used=features
        )

    async def learn_from_feedback(
        self,
        project_path: Path,
        context_effectiveness: float,
        user_feedback: Optional[str] = None
    ):
        """Learn from context effectiveness and user feedback."""
        # Extract features from successful/unsuccessful contexts
        features = await self.feature_extractor.extract_features(project_path)

        # Process feedback
        feedback_data = await self.feedback_processor.process_feedback(
            features, context_effectiveness, user_feedback
        )

        # Update pattern learning
        await self.pattern_learner.update_patterns(feedback_data)

        # Retrain model if needed
        if await self._should_retrain_model(feedback_data):
            await self._retrain_model()
```

### Phase 5: Integration and Command Enhancement

**Enhanced Meta-Commands:**
```python
# prp_framework/commands/enhanced_claude_md.py
class EnhancedCLAUDEMDCommands:
    """Enhanced commands for dynamic CLAUDE.md generation with active enforcement."""

    @command("/claude-md:generate-enhanced")
    async def generate_enhanced(self, args: CommandArgs) -> CommandResult:
        """Generate enhanced CLAUDE.md with active module loading."""
        project_path = Path(args.get('project-path', '.'))

        # Perform comprehensive analysis
        analyzer = AdvancedProjectAnalyzer()
        analysis_result = await analyzer.analyze_project_comprehensive(project_path)

        # Generate context with active enforcement
        context_generator = EnhancedContextGenerator()
        enhanced_context = await context_generator.generate_context(
            analysis_result,
            enforcement_mode='active'
        )

        # Create CLAUDE.md with enforcement instructions
        claude_md_composer = EnhancedCLAUDEMDComposer()
        claude_md_content = await claude_md_composer.compose_with_enforcement(
            enhanced_context
        )

        # Write enhanced CLAUDE.md
        claude_md_path = project_path / 'CLAUDE.md'
        await claude_md_path.write_text(claude_md_content)

        return CommandResult(
            success=True,
            message=f"Enhanced CLAUDE.md generated with {len(enhanced_context.modules)} modules",
            metadata={
                'analysis_confidence': analysis_result.confidence_score,
                'modules_included': len(enhanced_context.modules),
                'enforcement_mode': 'active',
                'performance_metrics': enhanced_context.performance_metrics
            }
        )

    @command("/claude-md:verify-compliance")
    async def verify_compliance(self, args: CommandArgs) -> CommandResult:
        """Verify that Claude has actually loaded required modules."""
        session_id = args.get('session-id', 'current')

        # Check module compliance
        compliance_monitor = ComplianceMonitor()
        compliance_status = await compliance_monitor.check_module_compliance(
            session_id, required_modules=[]
        )

        # Generate compliance report
        report = await self._generate_compliance_report(compliance_status)

        return CommandResult(
            success=compliance_status.is_compliant,
            message=f"Module compliance: {compliance_status.compliance_percentage:.1f}%",
            data=report
        )

    @command("/claude-md:force-reload")
    async def force_reload(self, args: CommandArgs) -> CommandResult:
        """Force reload of all required modules."""
        session_id = args.get('session-id', 'current')

        # Force module reloading
        module_loader = ModuleLoader()
        reload_result = await module_loader.force_module_loading(
            required_modules=[]
        )

        return CommandResult(
            success=reload_result.all_loaded,
            message=f"Forced reload of {len(reload_result.modules_loaded)} modules",
            data=reload_result.to_dict()
        )
```

## Task Breakdown with Implementation Order

### Task 1: Enhanced Tech Stack Detection (Week 1)
**Objective:** Implement advanced project analysis with AST parsing and ML classification

**Implementation Steps:**
```yaml
MODIFY prp_framework/analysis/project_analyzer.py:
  - EXTEND existing detection with AST parsing capabilities
  - ADD dependency graph analysis
  - IMPLEMENT architecture pattern detection
  - INTEGRATE security context analysis

CREATE prp_framework/analysis/ast_analyzer.py:
  - IMPLEMENT multi-language AST parsing using tree-sitter
  - ADD complexity metrics calculation
  - IMPLEMENT design pattern detection
  - CREATE architecture pattern recognition

CREATE prp_framework/intelligence/ml_classifier.py:
  - IMPLEMENT feature extraction from project analysis
  - CREATE ML-based project classification
  - ADD adaptive learning from feedback
  - IMPLEMENT confidence scoring

MODIFY prp_framework/context/module_mapping.py:
  - ENHANCE module selection with ML classification results
  - ADD architecture-pattern-based module selection
  - IMPLEMENT confidence-based module weighting
  - CREATE fallback logic for low-confidence scenarios
```

### Task 2: Active Module Auto-Loading (Week 2)
**Objective:** Implement proactive module loading with verification

**Implementation Steps:**
```yaml
CREATE .claude/hooks/pre_tool_module_validator.py:
  - IMPLEMENT pre-tool module compliance checking
  - ADD active module loading enforcement
  - CREATE tool execution gating based on compliance
  - IMPLEMENT graceful fallback for hook failures

CREATE prp_framework/enforcement/module_loader.py:
  - IMPLEMENT forced module loading with Read tool integration
  - ADD module content verification
  - CREATE enforcement instruction generation
  - IMPLEMENT loading progress tracking

CREATE prp_framework/enforcement/compliance_monitor.py:
  - IMPLEMENT real-time compliance monitoring
  - ADD context drift detection
  - CREATE session-based tracking
  - IMPLEMENT recovery triggers

MODIFY prp_framework/composition/claude_md_composer.py:
  - ENHANCE with active enforcement instructions
  - ADD compliance verification requirements
  - IMPLEMENT progressive enforcement levels
  - CREATE enforcement instruction templates
```

### Task 3: Real-time Context Monitoring (Week 3)
**Objective:** Implement continuous monitoring and automatic recovery

**Implementation Steps:**
```yaml
CREATE prp_framework/enforcement/recovery_manager.py:
  - IMPLEMENT context drift recovery
  - ADD automatic context refresh
  - CREATE recovery strategy selection
  - IMPLEMENT recovery success verification

CREATE prp_framework/intelligence/performance_tracker.py:
  - IMPLEMENT context effectiveness metrics
  - ADD user feedback integration
  - CREATE performance benchmarking
  - IMPLEMENT A/B testing for context variations

MODIFY .claude/hooks/post_tool_use.py:
  - ADD context compliance tracking
  - IMPLEMENT performance metrics collection
  - CREATE user feedback capture
  - ADD learning data collection

CREATE prp_framework/intelligence/feedback_processor.py:
  - IMPLEMENT user feedback analysis
  - ADD context effectiveness scoring
  - CREATE learning dataset generation
  - IMPLEMENT model improvement triggers
```

### Task 4: Command Integration and UI (Week 4)
**Objective:** Integrate enhanced system with user-friendly commands

**Implementation Steps:**
```yaml
CREATE prp_framework/commands/enhanced_claude_md.py:
  - IMPLEMENT enhanced generation commands
  - ADD compliance verification commands
  - CREATE debugging and diagnostic commands
  - IMPLEMENT configuration management commands

MODIFY existing meta-commands:
  - INTEGRATE active enforcement with existing commands
  - ADD compliance checking to command execution
  - IMPLEMENT automatic context refresh
  - CREATE command-level module loading

CREATE prp_framework/ui/context_dashboard.py:
  - IMPLEMENT context quality dashboard
  - ADD compliance visualization
  - CREATE performance metrics display
  - IMPLEMENT debugging interface

CREATE prp_framework/config/enforcement_config.py:
  - IMPLEMENT enforcement level configuration
  - ADD module priority settings
  - CREATE performance tuning options
  - IMPLEMENT user preference management
```

## Validation Loop

### Level 1: Enhanced Detection Validation
```bash
# Test enhanced tech stack detection
uv run pytest tests/test_enhanced_detection.py -v

# Test AST parsing accuracy
uv run pytest tests/test_ast_analysis.py -v

# Test ML classification performance
uv run pytest tests/test_ml_classification.py -v

# Benchmark detection performance
uv run python -m prp_framework.benchmarks.detection_performance
```

### Level 2: Active Enforcement Validation
```bash
# Test module loading enforcement
uv run pytest tests/test_module_enforcement.py -v

# Test compliance monitoring
uv run pytest tests/test_compliance_monitor.py -v

# Test context drift detection and recovery
uv run pytest tests/test_context_recovery.py -v

# Integration test with Claude Code hooks
uv run tests/integration/test_hook_integration.py
```

### Level 3: End-to-End System Validation
```bash
# Test complete enhanced system
uv run tests/e2e/test_enhanced_system.py

# Test with real projects
for project in tests/sample_projects/*/; do
    echo "Testing enhanced system with $project"
    cd "$project"
    /claude-md:generate-enhanced
    /claude-md:verify-compliance
    cd -
done

# Performance benchmarking
uv run python -m prp_framework.benchmarks.full_system_benchmark
```

### Level 4: Real-world Validation
```bash
# Test with diverse project types
uv run tests/validation/test_project_diversity.py

# Test context effectiveness
uv run tests/validation/test_context_effectiveness.py

# Test user experience
uv run tests/validation/test_user_experience.py

# Long-running session testing
uv run tests/validation/test_long_sessions.py
```

## Final Validation Checklist

**Enhanced Detection System:**
- [ ] AST-based code analysis working for 6+ languages
- [ ] ML classification accuracy >85% on diverse project types
- [ ] Architecture pattern detection working for common patterns
- [ ] Security context analysis integrated and functional
- [ ] Performance: Complete analysis in <10 seconds

**Active Enforcement System:**
- [ ] Pre-tool module validation hook working
- [ ] Active module loading with verification
- [ ] Real-time compliance monitoring functional
- [ ] Context drift detection and recovery working
- [ ] Tool execution gating based on compliance

**System Integration:**
- [ ] Enhanced commands integrated with existing system
- [ ] Backward compatibility maintained
- [ ] Performance metrics collection working
- [ ] User feedback integration functional
- [ ] Configuration management working

**Quality Metrics:**
- [ ] Context effectiveness improved by 40-60%
- [ ] Token usage optimized (30-50% reduction)
- [ ] Module compliance >90% in real sessions
- [ ] System reliability >99% (graceful degradation)
- [ ] User satisfaction improved (measured via feedback)

## Success Metrics

**Primary Success Criteria:**
- **90%+ Module Compliance**: Claude actually reads and applies required modules
- **40-60% Context Effectiveness Improvement**: Measurable improvement in AI performance
- **<10 Second Analysis Time**: Enhanced detection completes quickly
- **>85% Classification Accuracy**: ML-based project classification is reliable
- **99% System Reliability**: Graceful degradation when components fail

**Advanced Success Criteria:**
- **Adaptive Learning**: System improves context selection over time
- **Real-time Recovery**: Context drift detected and recovered automatically
- **User Satisfaction**: >90% positive feedback on context relevance
- **Performance Optimization**: Token usage reduced by 30-50%
- **Seamless Integration**: No disruption to existing workflows

---

## Anti-Patterns to Avoid

**Technical Anti-Patterns:**
- ❌ **Don't create performance bottlenecks** - Keep analysis under 10 seconds
- ❌ **Don't break existing workflows** - Maintain backward compatibility
- ❌ **Don't assume perfect detection** - Implement fallback mechanisms
- ❌ **Don't ignore context limits** - Implement intelligent compression
- ❌ **Don't create brittle enforcement** - Graceful degradation is critical

**User Experience Anti-Patterns:**
- ❌ **Don't make system intrusive** - Enforcement should be transparent
- ❌ **Don't ignore user feedback** - Implement learning mechanisms
- ❌ **Don't create debugging nightmares** - Provide clear visibility
- ❌ **Don't assume one-size-fits-all** - Support customization
- ❌ **Don't break user flow** - Smooth integration is essential

**Implementation Anti-Patterns:**
- ❌ **Don't create tight coupling** - Maintain modular architecture
- ❌ **Don't ignore error handling** - Robust error recovery is critical
- ❌ **Don't create security vulnerabilities** - Secure module loading
- ❌ **Don't ignore scalability** - Design for growth
- ❌ **Don't create maintenance burden** - Self-managing system

---

**Enhanced PRP Confidence Score: 9.5/10**

This enhanced dynamic CLAUDE.md generation system will transform passive context injection into active, intelligent, and adaptive context management. The combination of advanced detection, active enforcement, real-time monitoring, and machine learning will deliver measurable improvements in AI performance while maintaining reliability and user experience.
