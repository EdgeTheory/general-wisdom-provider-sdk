# Security Tools & Technologies

## Static Application Security Testing (SAST)

### Code Analysis Tools
- **Bandit**: Python security linter for common security issues
- **SonarQube**: Multi-language code quality and security analysis
- **ESLint Security**: JavaScript/TypeScript security rule sets
- **Brakeman**: Ruby on Rails security scanner
- **CodeQL**: GitHub's semantic code analysis engine

### Usage Patterns
```bash
# Python security scanning
bandit -r . -f json -o security_report.json

# JavaScript security linting
eslint --ext .js,.ts --config security-config.js src/

# Multi-language analysis
sonar-scanner -Dsonar.projectKey=myproject -Dsonar.sources=.
```

## Dynamic Application Security Testing (DAST)

### Web Application Scanners
- **OWASP ZAP**: Open-source web application security scanner
- **Burp Suite**: Professional web security testing platform
- **Nikto**: Web server vulnerability scanner
- **Nessus**: Comprehensive vulnerability assessment tool

### API Security Testing
```bash
# OWASP ZAP baseline scan
zap-baseline.py -t http://localhost:8000 -J zap_report.json

# SSL/TLS configuration testing
testssl.sh --jsonfile ssl_report.json https://api.example.com
```

## Dependency Security Management

### Vulnerability Scanning
- **Safety**: Python dependency vulnerability checker
- **npm audit**: Node.js dependency security auditing
- **Snyk**: Multi-language dependency vulnerability management
- **OWASP Dependency-Check**: Universal dependency vulnerability scanner

### Implementation
```bash
# Python dependency scanning
safety check --json --output safety_report.json

# Node.js dependency auditing
npm audit --json > npm_audit_report.json

# Universal dependency checking
dependency-check --project myproject --scan . --format JSON
```

## Secrets Management

### Secret Detection
- **TruffleHog**: Search for high-entropy strings and secrets
- **GitLeaks**: Detect hardcoded secrets in git repositories
- **detect-secrets**: IBM's secret detection tool

### Secure Storage
- **HashiCorp Vault**: Centralized secrets management
- **AWS Secrets Manager**: Cloud-based secrets storage
- **Azure Key Vault**: Microsoft's key and secret management
- **Kubernetes Secrets**: Container orchestration secret management

## Container Security

### Image Scanning
- **Docker Scout**: Docker's built-in security scanning
- **Trivy**: Comprehensive container vulnerability scanner
- **Clair**: Open-source container vulnerability analysis
- **Anchore**: Deep container inspection and compliance

### Runtime Security
```bash
# Container vulnerability scanning
docker scout cves --format json --output container_report.json

# Trivy comprehensive scanning
trivy image --format json --output trivy_report.json myimage:latest
```

## Infrastructure Security

### Infrastructure as Code Security
- **Terraform**: Infrastructure provisioning with security controls
- **Checkov**: Static analysis for Terraform, CloudFormation, Kubernetes
- **Terrascan**: Infrastructure as Code security scanner
- **kube-score**: Kubernetes object security analysis

### Network Security
- **Nmap**: Network discovery and security auditing
- **Wireshark**: Network protocol analyzer
- **OpenVAS**: Comprehensive vulnerability assessment

## Authentication & Authorization

### Identity Management
- **OAuth 2.0 / OpenID Connect**: Modern authentication protocols
- **SAML**: Security Assertion Markup Language for SSO
- **LDAP/Active Directory**: Enterprise directory services
- **JWT**: JSON Web Tokens for stateless authentication

### Implementation Libraries
```python
# JWT implementation with proper validation
import jwt
from datetime import datetime, timedelta

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)

    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

## Monitoring & Incident Response

### Security Monitoring
- **Splunk**: Security information and event management (SIEM)
- **ELK Stack**: Elasticsearch, Logstash, Kibana for log analysis
- **Prometheus + Grafana**: Metrics collection and visualization
- **OSSEC**: Host-based intrusion detection system

### Incident Response Tools
- **TheHive**: Security incident response platform
- **MISP**: Malware information sharing platform
- **GRR**: Google Rapid Response for incident response
- **Volatility**: Memory forensics framework

This comprehensive security toolset ensures thorough protection across all layers of application and infrastructure security.
