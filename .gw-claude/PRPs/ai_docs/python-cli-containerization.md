# Python CLI Containerization Best Practices

## Overview
Containerizing Python CLI tools requires different patterns than web services. This guide focuses on modern practices using uv package manager and multi-stage builds.

## Base Image Selection

### Option 1: Python Slim (Recommended for CLI tools)
```dockerfile
FROM python:3.12-slim as builder
# Pros: Smaller than full Python, includes common libraries
# Cons: Still larger than Alpine
# Best for: CLI tools with complex dependencies
```

### Option 2: Python Alpine (Size-optimized)
```dockerfile
FROM python:3.12-alpine as builder
# Pros: Smallest base image
# Cons: May have compatibility issues with some Python packages
# Best for: Simple CLI tools with pure Python dependencies
```

### Option 3: Distroless (Security-focused)
```dockerfile
FROM gcr.io/distroless/python3-debian12
# Pros: Minimal attack surface, no shell
# Cons: Harder to debug, limited tooling
# Best for: Production CLI tools requiring high security
```

## Multi-Stage Build Pattern for CLI Tools

```dockerfile
# Stage 1: Build dependencies
FROM python:3.12-slim as builder
WORKDIR /build

# Install uv for fast dependency management
RUN pip install uv

# Copy dependency files
COPY pyproject.toml uv.lock* ./

# Install dependencies into virtual environment
RUN uv venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN uv sync --extra prod

# Copy source code and build
COPY . .
RUN uv build

# Stage 2: Runtime image
FROM python:3.12-slim as runtime

# Create non-root user
RUN groupadd -r cliuser && useradd -r -g cliuser cliuser

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install built package
COPY --from=builder /build/dist/*.whl /tmp/
RUN pip install /tmp/*.whl && rm /tmp/*.whl

# Set up working directory with proper permissions
WORKDIR /workspace
RUN chown cliuser:cliuser /workspace

# Switch to non-root user
USER cliuser

# Set entrypoint to CLI command
ENTRYPOINT ["code-agent"]
```

## Entry Point Strategies

### Strategy 1: Direct CLI Entry Point
```dockerfile
ENTRYPOINT ["code-agent"]
CMD ["--help"]
```

### Strategy 2: Flexible Script Entry Point
```dockerfile
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
```

```bash
#!/bin/bash
# docker-entrypoint.sh
set -e

# If first arg starts with '-', assume CLI flags
if [ "${1#-}" != "$1" ]; then
    set -- code-agent "$@"
fi

# If first arg is not code-agent, prepend it
if [ "$1" != "code-agent" ]; then
    set -- code-agent "$@"
fi

exec "$@"
```

## Volume Mounting for File Access

CLI tools often need filesystem access:

```dockerfile
# Create mount points
VOLUME ["/workspace", "/input", "/output"]

# Set working directory as mountable
WORKDIR /workspace
```

Usage patterns:
```bash
# Mount current directory
docker run --rm -v $(pwd):/workspace cli-tool create project

# Separate input/output directories
docker run --rm -v ./input:/input -v ./output:/output cli-tool process
```

## Environment Variable Handling

```dockerfile
# AWS CLI tools
ENV AWS_DEFAULT_REGION=us-east-1
ENV AWS_CONFIG_FILE=/workspace/.aws/config
ENV AWS_SHARED_CREDENTIALS_FILE=/workspace/.aws/credentials

# CLI-specific configuration
ENV CLI_CONFIG_PATH=/workspace/.cli-config
ENV CLI_LOG_LEVEL=INFO
```

## Health Checks for CLI Containers

```dockerfile
# Version check as health indicator
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD code-agent --version || exit 1

# More comprehensive check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD code-agent validate --quick || exit 1
```

## Size Optimization Techniques

1. **Multi-stage builds** to exclude build dependencies
2. **uv for fast installs** with efficient caching
3. **Layer optimization** with proper COPY ordering
4. **Dependency pruning** using production-only installs

```dockerfile
# Optimize layers by combining related operations
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        git \
        curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY pyproject.toml uv.lock ./
RUN uv sync --extra prod

# Copy source after dependencies for better cache hits
COPY . .
```

## Security Hardening

```dockerfile
# Use non-root user
RUN groupadd -r cliuser && useradd -r -g cliuser cliuser
USER cliuser

# Set proper file permissions
COPY --chown=cliuser:cliuser . .

# Minimize attack surface
RUN rm -rf /tmp/* /var/tmp/*
```

## AWS Integration Patterns

For AWS CLI tools:

```dockerfile
# Install AWS CLI v2
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" && \
    unzip awscliv2.zip && \
    ./aws/install && \
    rm -rf awscliv2.zip aws/

# Set up AWS configuration directory
RUN mkdir -p /home/cliuser/.aws
VOLUME ["/home/cliuser/.aws"]
```

## Build Arguments and Version Management

```dockerfile
ARG CLI_VERSION
ARG BUILD_DATE
ARG VCS_REF

LABEL version=${CLI_VERSION}
LABEL build-date=${BUILD_DATE}
LABEL vcs-ref=${VCS_REF}

ENV CLI_VERSION=${CLI_VERSION}
```

## Testing in Containers

```dockerfile
# Multi-stage with test stage
FROM builder as test
RUN uv sync --extra test
RUN uv run pytest

FROM test as runtime
# Runtime stage starts from tested build
```

## Container Usage Patterns

```bash
# Direct command execution
docker run --rm cli-tool --version

# Interactive mode
docker run --rm -it cli-tool bash

# File processing with volume mounts
docker run --rm -v $(pwd):/workspace cli-tool process ./input.txt

# AWS credentials from host
docker run --rm -v ~/.aws:/root/.aws cli-tool deploy

# Environment variables
docker run --rm -e AWS_PROFILE=dev cli-tool status
```

## BuildKit Optimizations

```dockerfile
# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Enable BuildKit caching
RUN --mount=type=cache,target=/root/.cache/pip \
    pip install uv

# Cache uv dependencies
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync
```

## References
- [uv Documentation](https://docs.astral.sh/uv/)
- [Docker Multi-stage Builds](https://docs.docker.com/develop/dev-best-practices/dockerfile_best-practices/)
- [Python Docker Best Practices](https://pythonspeed.com/articles/dockerizing-python-is-hard/)
- [Distroless Images](https://github.com/GoogleContainerTools/distroless)
- [AWS CLI in Docker](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-docker.html)
