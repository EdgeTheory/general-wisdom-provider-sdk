# Security Domain Context

## When This Module Loads

**Trigger Keywords**: authentication, authorization, security, vulnerability, encryption, pentest, audit, compliance, threat, credential, token, password, certificate, ssl, tls

**Intent Patterns**: security_analysis, vulnerability assessment, secure implementation, compliance checking

**Tools Predicted**: security scanners, audit tools, compliance checks, penetration testing tools

## Security-First Principles

### Assume Breach Mentality
- **Design for Compromise**: Assume systems will be breached and design accordingly
- **Minimize Blast Radius**: Limit potential damage through segmentation and isolation
- **Detection over Prevention**: Implement comprehensive monitoring and detection
- **Rapid Response**: Plan and practice incident response procedures

### Defense in Depth Strategy
- **Multiple Security Layers**: Never rely on a single security control
- **Complementary Controls**: Use different types of security measures together
- **Redundant Protection**: Backup security measures for critical assets
- **Continuous Monitoring**: Real-time security event detection and analysis

### Security by Design
- **Security Requirements**: Define security requirements from project inception
- **Threat Modeling**: Identify and analyze potential threats early
- **Secure Architecture**: Design security into system architecture
- **Privacy by Design**: Incorporate privacy protection from the start

### Principle of Least Privilege
- **Minimal Access**: Grant only the minimum permissions necessary
- **Just-in-Time Access**: Temporary elevated permissions when needed
- **Regular Review**: Audit and review access permissions regularly
- **Automated Deprovisioning**: Remove access when no longer needed

## Security Implementation Patterns

### Authentication and Authorization
```python
# Multi-factor authentication implementation
def authenticate_user(username, password, mfa_token):
    # Strong password validation
    if not validate_strong_password(password):
        log_security_event("weak_password_attempt", username)
        raise AuthenticationError("Password requirements not met")

    # Rate limiting to prevent brute force
    if is_rate_limited(username):
        log_security_event("rate_limit_exceeded", username)
        raise AuthenticationError("Too many attempts")

    # Secure password verification
    if not verify_password_hash(username, password):
        log_failed_attempt(username)
        raise AuthenticationError("Invalid credentials")

    # MFA validation
    if not validate_mfa_token(username, mfa_token):
        log_security_event("mfa_failure", username)
        raise AuthenticationError("Invalid MFA token")

    # Generate secure session
    return create_secure_session(username)
```

### Input Validation and Sanitization
```python
# Comprehensive input validation
def validate_and_sanitize_input(user_input, input_type):
    # Input length validation
    if len(user_input) > MAX_INPUT_LENGTH:
        raise ValidationError("Input exceeds maximum length")

    # Type-specific validation
    if input_type == "email":
        if not is_valid_email(user_input):
            raise ValidationError("Invalid email format")
    elif input_type == "sql_query":
        if contains_sql_injection_patterns(user_input):
            log_security_event("sql_injection_attempt", user_input)
            raise SecurityError("Potentially malicious input detected")

    # XSS prevention
    sanitized_input = html_escape(user_input)

    # Log validation success
    log_security_event("input_validated", {"type": input_type, "length": len(user_input)})

    return sanitized_input
```

### Secure Data Handling
```python
# Secure data encryption and storage
def store_sensitive_data(data, context):
    # Encrypt sensitive data at rest
    encryption_key = get_encryption_key(context)
    encrypted_data = encrypt_aes_256(data, encryption_key)

    # Generate hash for integrity verification
    data_hash = generate_sha256_hash(data)

    # Store with metadata
    storage_record = {
        "encrypted_data": encrypted_data,
        "data_hash": data_hash,
        "encryption_algorithm": "AES-256-GCM",
        "created_at": datetime.utcnow(),
        "classification": classify_data_sensitivity(data)
    }

    # Audit trail
    log_security_event("sensitive_data_stored", {
        "classification": storage_record["classification"],
        "size": len(data)
    })

    return store_secure_record(storage_record)
```

## Security Validation Patterns

### OWASP Top 10 Validation Checklist
- ✅ **A01 - Broken Access Control**: Verify proper authorization at every endpoint
- ✅ **A02 - Cryptographic Failures**: Use strong encryption and secure key management
- ✅ **A03 - Injection**: Validate and sanitize all inputs, use parameterized queries
- ✅ **A04 - Insecure Design**: Apply threat modeling and secure design principles
- ✅ **A05 - Security Misconfiguration**: Secure default configurations, regular updates
- ✅ **A06 - Vulnerable Components**: Keep dependencies updated, scan for vulnerabilities
- ✅ **A07 - Authentication Failures**: Implement strong authentication and session management
- ✅ **A08 - Software Integrity**: Verify integrity of code and dependencies
- ✅ **A09 - Logging Failures**: Comprehensive security logging and monitoring
- ✅ **A10 - Server-Side Request Forgery**: Validate and restrict server-side requests

### Security Testing Commands
```bash
# Static Application Security Testing (SAST)
bandit -r . -f json -o security_report.json

# Dependency vulnerability scanning
safety check --json --output vulnerability_report.json

# Dynamic security testing
pytest tests/security/ -v --tb=short

# Container security scanning
docker scout cves --format json --output container_security.json

# Infrastructure security validation
terraform plan -var-file=security.tfvars
```

### Security Monitoring and Alerting
```python
# Security event monitoring
def monitor_security_events():
    security_events = [
        "failed_authentication_attempts",
        "privilege_escalation_attempts",
        "unusual_access_patterns",
        "data_exfiltration_indicators",
        "malicious_input_attempts"
    ]

    for event_type in security_events:
        recent_events = get_recent_events(event_type, hours=1)

        if len(recent_events) > SECURITY_THRESHOLD[event_type]:
            trigger_security_alert({
                "event_type": event_type,
                "count": len(recent_events),
                "severity": calculate_severity(event_type, recent_events),
                "recommended_actions": get_response_actions(event_type)
            })
```

## Compliance and Regulatory Considerations

### GDPR Compliance Patterns
- **Data Minimization**: Collect only necessary personal data
- **Purpose Limitation**: Use data only for stated purposes
- **Consent Management**: Clear consent mechanisms and withdrawal options
- **Right to Erasure**: Implement data deletion capabilities
- **Data Portability**: Enable data export in standard formats
- **Privacy by Design**: Build privacy protection into system design

### SOC 2 Control Implementation
- **Access Controls**: Implement and monitor user access management
- **Change Management**: Formal change control processes
- **System Monitoring**: Continuous monitoring of system availability and performance
- **Data Protection**: Encryption and secure data handling procedures
- **Incident Response**: Documented incident response procedures

### Security Documentation Requirements
- **Security Architecture Document**: System security design and controls
- **Threat Model**: Identified threats and mitigation strategies
- **Security Test Plan**: Comprehensive security testing procedures
- **Incident Response Plan**: Step-by-step incident handling procedures
- **Security Training Records**: Evidence of security awareness training

## Security Gotchas and Common Mistakes

### Authentication Pitfalls
- ❌ **Weak Password Policies**: Allowing common or easily guessable passwords
- ❌ **Session Fixation**: Not regenerating session IDs after authentication
- ❌ **Insecure Session Storage**: Storing sessions in insecure locations
- ❌ **Missing Rate Limiting**: Allowing unlimited authentication attempts

### Authorization Issues
- ❌ **Horizontal Privilege Escalation**: Users accessing other users' data
- ❌ **Vertical Privilege Escalation**: Users gaining administrative privileges
- ❌ **Missing Authorization Checks**: Unprotected sensitive endpoints
- ❌ **Client-Side Authorization**: Relying on client-side access controls

### Data Protection Failures
- ❌ **Plaintext Sensitive Data**: Storing passwords or secrets in plaintext
- ❌ **Weak Encryption**: Using outdated or weak encryption algorithms
- ❌ **Key Management Issues**: Poor cryptographic key handling
- ❌ **Insufficient Logging**: Missing security event logging

This security context ensures that all security-related implementations follow industry best practices, comply with regulatory requirements, and maintain the highest standards of protection against modern threats.
