name: "Code-Agent CLI ECR Containerization - Docker Build and ECR Deployment Integration"
description: |
  Add containerization support to the code-agent CLI tool with automated ECR deployment
  integration into the existing Bitbucket Pipelines workflow. This enables the CLI to be
  distributed both as a Python package (via CodeArtifact) and as a Docker container (via ECR).

---

## Goal

**Feature Goal**: Add Docker containerization and ECR deployment to the code-agent CLI tool

**Deliverable**:
- Multi-stage Dockerfile optimized for Python CLI tools using uv package manager
- ECR deployment script adapted for CLI containerization patterns
- Bitbucket pipeline integration with ECR build and push steps
- Container supports both direct CLI execution and volume-mounted file operations

**Success Definition**:
- Container builds successfully in CI/CD pipeline
- Container images pushed to ECR repository: `540845145946.dkr.ecr.us-east-1.amazonaws.com/code-agent`
- CLI functionality works identically in container and native installations
- Pipeline maintains existing CodeArtifact publishing while adding ECR deployment

## User Persona

**Target User**: DevOps engineers and developers needing containerized CLI tools

**Use Case**:
- Running code-agent CLI in containerized environments (Kubernetes, ECS, local Docker)
- Consistent CLI tool deployment across different environments
- Isolated execution environments for CI/CD pipelines
- Serverless execution via AWS Lambda containers

**User Journey**:
1. Pull container from ECR: `docker pull 540845145946.dkr.ecr.us-east-1.amazonaws.com/code-agent:latest`
2. Run CLI commands: `docker run --rm -v $(pwd):/workspace code-agent create python-microservice my-service`
3. Access file operations: `docker run --rm -v $(pwd):/workspace -v ~/.aws:/root/.aws code-agent integrate .`

**Pain Points Addressed**:
- No containerized distribution of code-agent CLI currently available
- Need for isolated execution environments in CI/CD pipelines
- Consistent deployment across different infrastructure platforms

## Why

- **Container Adoption**: Enables code-agent usage in Kubernetes, ECS, and containerized CI/CD pipelines
- **Environment Isolation**: Provides consistent execution environment across different platforms
- **Deployment Flexibility**: Adds another distribution method alongside existing pipx/CodeArtifact installation
- **AWS Integration**: Leverages existing ECR infrastructure and AWS authentication patterns
- **Developer Experience**: Maintains CLI functionality while adding container convenience

## What

Container deployment integration that:
- Builds optimized multi-stage Docker images using uv package manager
- Pushes images to ECR repository with version-based tagging
- Integrates seamlessly with existing Bitbucket pipeline workflow
- Supports file system operations through volume mounting
- Maintains AWS credentials and configuration handling
- Provides health checks and security hardening

### Success Criteria

- [ ] Docker container builds successfully with multi-stage optimization
- [ ] Container images pushed to ECR with proper versioning (latest, version tags)
- [ ] CLI commands work identically in container and native installations
- [ ] File operations work through volume mounting patterns
- [ ] AWS credentials passed through properly for cloud operations
- [ ] Pipeline integration doesn't disrupt existing CodeArtifact publishing
- [ ] Container size optimized (< 500MB final image)
- [ ] Security hardening with non-root user execution

## All Needed Context

### Context Completeness Check

_This PRP provides comprehensive implementation context including existing pipeline patterns, ECR deployment scripts, Docker best practices, and codebase analysis for successful one-pass implementation._

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- file: PRPs/ai_docs/python-cli-containerization.md
  why: Complete Docker containerization patterns for Python CLI tools
  pattern: Multi-stage builds, uv integration, security hardening
  gotcha: CLI-specific entry points and volume mounting requirements

- file: bitbucket-pipelines.yml
  why: Existing CI/CD pipeline structure and AWS integration patterns
  pattern: OIDC authentication, SSM parameter usage, build artifact management
  gotcha: Version management with build numbers, conditional publishing

- file: scripts/deploy_to_ecr.sh
  why: ECR deployment patterns and AWS authentication workflow
  pattern: Repository creation, login process, multi-platform builds
  gotcha: ECS service updates not needed for CLI tools

- file: pyproject.toml
  why: Project dependencies, entry points, and build configuration
  pattern: uv compatibility, CLI entry points, dependency management
  gotcha: Build system uses hatchling, not setuptools

- file: code_agent/cli/main.py
  why: CLI application structure and entry point patterns
  pattern: Click-based CLI with command groups, async command execution
  gotcha: Rich output formatting, AWS integration requirements

- url: https://docs.astral.sh/uv/guides/docker/
  why: uv package manager Docker integration best practices
  critical: Virtual environment handling and caching strategies

- url: https://docs.aws.amazon.com/AmazonECR/latest/userguide/docker-push-ecr-image.html
  why: ECR push authentication and repository management
  critical: OIDC integration patterns for Bitbucket Pipelines
```

### Current Codebase Tree (relevant structure only)

```bash
/Users/patrick.henry/dev/code-agent/
├── pyproject.toml                 # Dependencies and build config
├── bitbucket-pipelines.yml        # Existing CI/CD pipeline
├── scripts/
│   └── deploy_to_ecr.sh           # ECR deployment pattern example
├── code_agent/
│   ├── __init__.py
│   ├── cli/
│   │   ├── main.py                # Click CLI entry point
│   │   ├── commands/              # CLI command implementations
│   │   ├── core/                  # Core functionality (AWS, LLM, etc.)
│   │   └── utils/                 # Utilities (config, output, validation)
│   ├── models/                    # Pydantic models
│   └── exceptions/                # Exception handling
├── .claude/                       # Framework configuration files
├── docs/                          # Documentation and modules
└── examples/                      # Usage examples and agents
```

### Desired Codebase Tree with Files to be Added

```bash
/Users/patrick.henry/dev/code-agent/
├── Dockerfile                     # Multi-stage Docker build for CLI
├── docker-entrypoint.sh          # Container entry point script
├── .dockerignore                  # Docker build context optimization
├── scripts/
│   └── deploy_cli_to_ecr.sh      # CLI-optimized ECR deployment script
└── [bitbucket-pipelines.yml]     # Updated with ECR deployment steps
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: uv requires specific virtual environment handling in containers
# Example: uv venv must be activated properly in multi-stage builds
ENV PATH="/opt/venv/bin:$PATH"

# CRITICAL: Click CLI requires proper PYTHONPATH and entry point configuration
# Example: Install package rather than copy source for proper CLI registration

# CRITICAL: AWS CLI integration requires proper credential file paths
# Example: Volume mount ~/.aws to container's expected location

# CRITICAL: Rich output formatting may not work in non-TTY containers
# Example: Add environment variable handling for container contexts

# CRITICAL: File operations require proper working directory and permissions
# Example: Non-root user must have write access to mounted volumes
```

## Implementation Blueprint

### Data Models and Structure

No new data models required - leveraging existing CLI models and configuration structures.

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE Dockerfile
  - IMPLEMENT: Multi-stage Docker build with builder and runtime stages
  - FOLLOW pattern: PRPs/ai_docs/python-cli-containerization.md (multi-stage optimization)
  - NAMING: Standard Dockerfile naming convention
  - PLACEMENT: Project root directory
  - DEPENDENCIES: pyproject.toml, existing source code structure

Task 2: CREATE docker-entrypoint.sh
  - IMPLEMENT: Flexible entry point script for CLI command handling
  - FOLLOW pattern: Docker best practices for CLI tool entry points
  - NAMING: docker-entrypoint.sh (standard Docker convention)
  - DEPENDENCIES: Understanding of CLI command structure from main.py
  - PLACEMENT: Project root directory

Task 3: CREATE .dockerignore
  - IMPLEMENT: Build context optimization excluding unnecessary files
  - FOLLOW pattern: Python project Docker ignore patterns
  - NAMING: .dockerignore (Docker standard)
  - DEPENDENCIES: Understanding of build requirements vs. runtime needs
  - PLACEMENT: Project root directory

Task 4: CREATE scripts/deploy_cli_to_ecr.sh
  - IMPLEMENT: CLI-optimized ECR deployment script based on existing pattern
  - FOLLOW pattern: scripts/deploy_to_ecr.sh (ECR authentication and push)
  - NAMING: deploy_cli_to_ecr.sh (descriptive naming)
  - DEPENDENCIES: Existing deploy_to_ecr.sh pattern, AWS configuration
  - PLACEMENT: scripts/ directory

Task 5: MODIFY bitbucket-pipelines.yml
  - INTEGRATE: Add ECR build and deployment steps to existing pipeline
  - FIND pattern: Existing publish-codeartifact step structure
  - ADD: New step definition for ECR container deployment
  - PRESERVE: Existing CodeArtifact publishing and all current functionality
  - DEPENDENCIES: All previous tasks completed

Task 6: CREATE integration tests for container functionality
  - IMPLEMENT: Test container build, CLI functionality, volume mounting
  - FOLLOW pattern: tests/integration/test_cli_commands.py (CLI testing approach)
  - NAMING: test_container_integration.py
  - COVERAGE: Container build, CLI execution, file operations, AWS integration
  - PLACEMENT: tests/integration/
```

### Implementation Patterns & Key Details

```dockerfile
# Multi-stage build pattern optimized for CLI tools
FROM python:3.12-slim as builder
WORKDIR /build

# Install uv for fast dependency management
RUN pip install uv

# Copy dependency files first for better caching
COPY pyproject.toml uv.lock* ./

# Create and activate virtual environment
RUN uv venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install dependencies
RUN uv sync --extra prod

# Copy source code and build wheel
COPY . .
RUN uv build

# Runtime stage - minimal image
FROM python:3.12-slim as runtime

# Create non-root user for security
RUN groupadd -r cliuser && useradd -r -g cliuser cliuser

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install built wheel package
COPY --from=builder /build/dist/*.whl /tmp/
RUN pip install /tmp/*.whl && rm /tmp/*.whl

# Set up working directory with proper ownership
WORKDIR /workspace
RUN chown cliuser:cliuser /workspace

# Copy and set up entry point
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Switch to non-root user
USER cliuser

# Health check using CLI version command
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD code-agent --version || exit 1

ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]
```

```bash
# ECR deployment script pattern for CLI tools
#!/bin/bash
set -e

# Configuration
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-"540845145946"}
AWS_REGION=${AWS_REGION:-"us-east-1"}
ECR_REPOSITORY="code-agent"
CLI_VERSION=$(python -c "import tomllib; print(tomllib.load(open('pyproject.toml', 'rb'))['project']['version'])")
TAG=${TAG:-"latest"}

# ECR authentication
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

# Build with multiple tags
DOCKER_BUILDKIT=1 docker build \
    --platform=linux/amd64 \
    --build-arg CLI_VERSION=${CLI_VERSION} \
    --cache-from ${ECR_REPOSITORY_URI}:latest \
    -t ${ECR_REPOSITORY_URI}:latest \
    -t ${ECR_REPOSITORY_URI}:${CLI_VERSION} \
    -t ${ECR_REPOSITORY_URI}:${TAG} \
    .

# Push all tags
docker push ${ECR_REPOSITORY_URI}:latest
docker push ${ECR_REPOSITORY_URI}:${CLI_VERSION}
if [ "${TAG}" != "latest" ] && [ "${TAG}" != "${CLI_VERSION}" ]; then
    docker push ${ECR_REPOSITORY_URI}:${TAG}
fi
```

### Integration Points

```yaml
PIPELINE:
  - add step: "build-and-push-ecr" to main, develop, and tag pipelines
  - pattern: "Similar to publish-codeartifact step with Docker operations"
  - after: "Successful package publishing to maintain existing workflow"

AWS_CONFIG:
  - ECR repository: "code-agent" (auto-created if not exists)
  - authentication: "Leverage existing OIDC integration from CodeArtifact steps"
  - region: "us-east-1" (consistent with existing infrastructure)

CONTAINER_USAGE:
  - direct execution: "docker run --rm code-agent --version"
  - file operations: "docker run --rm -v $(pwd):/workspace code-agent create project"
  - AWS integration: "docker run --rm -v ~/.aws:/root/.aws code-agent deploy"
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Validate Dockerfile syntax
docker build --dry-run -t code-agent-test .

# Validate shell script syntax
bash -n scripts/deploy_cli_to_ecr.sh
bash -n docker-entrypoint.sh

# Validate pipeline YAML syntax
python -c "import yaml; yaml.safe_load(open('bitbucket-pipelines.yml', 'r'))"

# Expected: No syntax errors in any file
```

### Level 2: Container Build Validation

```bash
# Build container locally
docker build -t code-agent:test .

# Test CLI functionality in container
docker run --rm code-agent:test --version
docker run --rm code-agent:test --help

# Test with volume mounting
mkdir -p /tmp/test-workspace
docker run --rm -v /tmp/test-workspace:/workspace code-agent:test analyze /workspace

# Expected: All CLI commands work identically to native installation
```

### Level 3: ECR Integration Testing

```bash
# Set up test environment variables (use test AWS account)
export AWS_ACCOUNT_ID="540845145946"
export AWS_REGION="us-east-1"
export TAG="test-$(date +%s)"

# Test ECR script execution
bash scripts/deploy_cli_to_ecr.sh

# Verify image pushed to ECR
aws ecr describe-images --repository-name code-agent --region us-east-1

# Pull and test pushed image
docker pull 540845145946.dkr.ecr.us-east-1.amazonaws.com/code-agent:${TAG}
docker run --rm 540845145946.dkr.ecr.us-east-1.amazonaws.com/code-agent:${TAG} --version

# Expected: Image successfully pushed and functional when pulled
```

### Level 4: Pipeline Integration Validation

```bash
# Validate pipeline configuration
# This would be tested in actual pipeline run, but can validate locally:

# Check OIDC authentication setup
aws sts get-caller-identity

# Validate SSM parameter access (if using for ECR config)
aws ssm get-parameter --name "/code-agent/ecr/repository" --region us-east-1 || echo "Manual config OK"

# Test full pipeline simulation locally
uv sync --extra dev
uv run pytest tests/ -v
uv build
docker build -t code-agent:pipeline-test .

# Expected: All pipeline steps complete successfully
```

## Final Validation Checklist

### Technical Validation

- [ ] Container builds successfully with multi-stage optimization
- [ ] Final image size is reasonable (< 500MB)
- [ ] CLI commands work identically in container and native installations
- [ ] File operations work through volume mounting
- [ ] AWS credentials and configuration handled properly
- [ ] Non-root user security implemented
- [ ] Health check validates CLI functionality

### Feature Validation

- [ ] Images pushed to ECR with proper versioning (latest, version, build tags)
- [ ] Existing CodeArtifact publishing workflow unaffected
- [ ] Pipeline integration successful for main, develop, and release branches
- [ ] Container supports common usage patterns (direct execution, volume mounting)
- [ ] ECR repository auto-creation works correctly
- [ ] Authentication via existing OIDC integration successful

### Code Quality Validation

- [ ] Dockerfile follows best practices from research documentation
- [ ] ECR deployment script properly adapted from existing pattern
- [ ] Pipeline integration maintains existing patterns and conventions
- [ ] Container entry point handles various CLI usage scenarios
- [ ] Build context optimized with appropriate .dockerignore

### Documentation & Deployment

- [ ] Container usage examples documented for users
- [ ] ECR repository configuration documented
- [ ] Pipeline changes maintain backward compatibility
- [ ] Security considerations (non-root user) properly implemented

---

## Anti-Patterns to Avoid

- ❌ Don't copy source files directly - use wheel installation for proper CLI registration
- ❌ Don't run as root user - implement proper security hardening
- ❌ Don't skip health checks - CLI tools need validation too
- ❌ Don't break existing CodeArtifact workflow - add ECR as additional deployment
- ❌ Don't hardcode AWS account/region - use existing environment variable patterns
- ❌ Don't create oversized images - use multi-stage builds for optimization
- ❌ Don't ignore file permissions - container must handle volume-mounted operations
