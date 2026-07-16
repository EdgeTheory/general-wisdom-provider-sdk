# RULES.md - SuperClaude Framework Actionable Rules

Comprehensive behavioral guidelines ensuring systematic, secure, and high-quality execution across all dynamic context scenarios and development domains.

---

## 🎯 Core Execution Rules

### **Task Management & Workflow**

**MANDATORY Context Loading:**
- Context confidence ≥70% → Load domain-specific modules + persona
- Context confidence 50-70% → Load general modules + validation prompts
- Context confidence <50% → Fallback mode with explicit user confirmation
- Complex tasks (3+ tools predicted) → Auto-activate enhanced orchestration

**Systematic Implementation Flow:**
1. **Analyze** → Parse requirements + assess domain + calculate confidence
2. **Route** → Select optimal persona + context stack + MCP servers
3. **Execute** → Apply domain patterns + validate incrementally + optimize continuously
4. **Validate** → Run quality gates + security checks + performance verification
5. **Document** → Record decisions + capture patterns + update knowledge base

### **File Operation Security**

**Before ANY file modifications:**
- Validate write permissions and backup existing files
- Confirm file paths are within project scope (no `../` traversal)
- Check file size limits to prevent resource exhaustion
- Scan for sensitive data patterns before writing

**Version Control Integration:**
- Stage changes systematically with descriptive commit messages
- Never commit credentials, API keys, or sensitive configuration
- Include security scan results in commit metadata when applicable

---

## 🔒 Security & Compliance Framework

### **Data Protection Rules**

**Credential Management:**
- **NEVER** log, display, or transmit credentials in any form
- **ALWAYS** use environment variables or secure key management systems
- **VALIDATE** all credential sources before usage
- **ROTATE** credentials according to security policies
- **AUDIT** all credential access with tamper-evident logging

**Input Validation MANDATORY for:**
- User-provided data entering any processing pipeline
- External API responses before integration
- File uploads and content parsing operations
- Database queries (parameterized queries required)
- System command executions (sanitization + allowlisting)

### **Security-First Implementation**

```yaml
security_gates:
  authentication:
    - multi_factor_required: true
    - session_management: secure_httponly_cookies
    - token_validation: jwt_with_refresh

  authorization:
    - principle_of_least_privilege: enforced
    - role_based_access_control: mandatory
    - resource_level_permissions: validated

  data_protection:
    - encryption_at_rest: aes_256
    - encryption_in_transit: tls_1_3
    - key_management: hsm_or_vault
```

---

## 🏗️ Framework Compliance Standards

### **Code Quality Enforcement**

**Non-negotiable Requirements:**
- **Test Coverage** ≥80% for all new code with edge case validation
- **Documentation** for all public interfaces and complex algorithms
- **Error Handling** with specific exception types and recovery strategies
- **Performance Testing** for operations processing >1K records
- **Security Scanning** with SAST/DAST for all external-facing components

**Architectural Consistency:**
- Follow established project patterns and naming conventions
- Maintain separation of concerns across all modules
- Implement proper dependency injection and interface abstractions
- Apply SOLID principles with measurable compliance metrics

### **Systematic Codebase Changes**

**Multi-file Operations Process:**
1. **Scan** entire codebase for affected components and dependencies
2. **Plan** change sequence with rollback checkpoints
3. **Implement** incrementally with validation gates between phases
4. **Test** integration points and regression scenarios thoroughly
5. **Deploy** with monitoring and automated rollback triggers

**Refactoring Protocol:**
- Preserve existing API contracts unless explicitly deprecated
- Maintain backward compatibility for minimum 2 release cycles
- Update all documentation, tests, and examples simultaneously
- Validate performance impact with before/after benchmarks

---

## ⚡ Performance & Efficiency Standards

### **Resource Management**

**Token Budget Optimization:**
- **Critical Information** must achieve ≥90% context retention
- **Compression Targets**: 30% reduction minimum, 70% maximum
- **Cache Hit Rates**: ≥75% for repeated context patterns
- **Memory Usage**: <50MB additional footprint per session

**Execution Efficiency Thresholds:**
- Context analysis completion: <2 seconds
- Module loading and composition: <3 seconds
- Validation gate execution: <5 seconds total
- End-to-end orchestration: <10 seconds maximum

---

## 📋 Quick Reference

### **✅ DO**
- Load domain-specific context when confidence >70%
- Apply persona-specific validation patterns consistently
- Cache frequently accessed context patterns for performance
- Monitor and log context selection effectiveness metrics
- Implement graceful degradation for component failures
- Use structured error responses with actionable guidance
- Validate all external inputs with appropriate sanitization
- Apply security-first principles from initial design phase

### **❌ DON'T**
- Skip context validation checks for "simple" operations
- Hard-code configuration values or sensitive information
- Ignore performance thresholds and resource constraints
- Mix domain-specific logic across unrelated contexts
- Disable security checks for development or testing
- Allow unhandled exceptions to propagate to users
- Cache sensitive data or credentials in any form
- Implement custom security mechanisms without expert review

### **🚨 Auto-Triggers**

**Immediate Security Escalation:**
- Any mention of credentials, passwords, keys, or tokens
- Database operations without parameterized queries
- File system access outside project boundaries
- Network requests to unvalidated external services

**Enhanced Orchestration Activation:**
- Complex tasks requiring 3+ different tool categories
- Cross-domain operations spanning multiple expertise areas
- High-stakes production deployments or data migrations
- Integration scenarios with external systems or APIs

**Performance Monitoring Required:**
- Operations processing >10K records or files
- Real-time or low-latency requirement scenarios
- Resource-intensive computations or transformations
- Multi-user concurrent access implementations

---

*These rules ensure consistent, secure, and high-performance execution while maintaining professional quality standards across all SuperClaude framework operations.*
