---
name: "PydanticAI Agent PRP Template"
description: "Template for generating comprehensive PRPs for PydanticAI agent development projects"
---

## Purpose

[Brief description of the PydanticAI agent to be built and its main purpose]

## Core Principles

1. **PydanticAI Best Practices**: Deep integration with PydanticAI patterns for agent creation, tools, and structured outputs
2. **Production Ready**: Include security, testing, and monitoring for production deployments
3. **Type Safety First**: Leverage PydanticAI's type-safe design and Pydantic validation throughout
4. **Context Engineering Integration**: Apply proven context engineering workflows to AI agent development
5. **Comprehensive Testing**: Use TestModel and FunctionModel for thorough agent validation

## ⚠️ Implementation Guidelines: Don't Over-Engineer

**IMPORTANT**: Keep your agent implementation focused and practical. Don't build unnecessary complexity.

### What NOT to do:
- ❌ **Don't create dozens of tools** - Build only the tools your agent actually needs
- ❌ **Don't over-complicate dependencies** - Keep dependency injection simple and focused
- ❌ **Don't add unnecessary abstractions** - Follow main_agent_reference patterns directly
- ❌ **Don't build complex workflows** unless specifically required
- ❌ **Don't add structured output** unless validation is specifically needed (default to string)
- ❌ **Don't build in the examples/ folder**

### What TO do:
- ✅ **Start simple** - Build the minimum viable agent that meets requirements
- ✅ **Add tools incrementally** - Implement only what the agent needs to function
- ✅ **Follow main_agent_reference** - Use proven patterns, don't reinvent
- ✅ **Use string output by default** - Only add result_type when validation is required
- ✅ **Test early and often** - Use TestModel to validate as you build

### Key Question:
**"Does this agent really need this feature to accomplish its core purpose?"**

If the answer is no, don't build it. Keep it simple, focused, and functional.

---

## Goal

[Detailed description of what the agent should accomplish]

## Why

[Explanation of why this agent is needed and what problem it solves]

## What

### Agent Type Classification
- [ ] **Chat Agent**: Conversational interface with memory and context
- [ ] **Tool-Enabled Agent**: Agent with external tool integration capabilities
- [ ] **Workflow Agent**: Multi-step task processing and orchestration
- [ ] **Structured Output Agent**: Complex data validation and formatting

### Model Provider Requirements
- [ ] **AWS Bedrock (Primary)**: Anthropic Claude Sonnet 4 (`us.anthropic.claude-4-sonnet-20250514-v1:0`)
- [ ] **Fallback Model**: Anthropic Claude 3.7 Sonnet (`us.anthropic.claude-3-7-sonnet-20250219-v1:0`)
- [ ] **ECS Credentials**: Use ECS task role credentials via `AWS_CONTAINER_CREDENTIALS_RELATIVE_URI`
- [ ] **Local Development**: Fallback to `AWS_ACCESS_KEY_ID`/`AWS_SECRET_ACCESS_KEY`/`AWS_SESSION_TOKEN`
- [ ] **Environment**: `AWS_REGION`, `MODEL_NAME` (primary), optional `FALLBACK_MODEL_NAME`

### External Integrations
- [ ] **Redis ElastiCache**: Distributed locking and queue management via pottery utils
- [ ] **MCP Server**: Whisper MCP server connection (`WHISPER_MCP_HOST`, `WHISPER_MCP_PORT`)
- [ ] **Secrets Manager**: Redis credentials from `/agency/redis/credentials`
- [ ] **ECS Runtime**: Container credentials and service discovery
- [ ] **Additional APIs**: Specify any other external service integrations needed

### Success Criteria
- [ ] Agent successfully handles specified use cases
- [ ] All tools work correctly with proper error handling
- [ ] Structured outputs validate according to Pydantic models
- [ ] Comprehensive test coverage with TestModel and FunctionModel
- [ ] Security measures implemented (credentials, input validation, rate limiting)
- [ ] Performance meets requirements (response time, throughput)

## All Needed Context

### PydanticAI Documentation & Research

```yaml
# Example Patterns
- path: examples/agents/
  query: "Existing Pydantic AI agent implementations with Bedrock, Redis, MCP patterns"
  why: Reference implementations showing Sonnet 4/3.7, ElastiCache, ECS credentials

# ESSENTIAL PYDANTIC AI DOCUMENTATION - Must be researched
- url: https://ai.pydantic.dev/
  why: Official PydanticAI documentation with getting started guide
  content: Agent creation, model providers, dependency injection patterns

- url: https://ai.pydantic.dev/agents/
  why: Comprehensive agent architecture and configuration patterns
  content: System prompts, output types, execution methods, agent composition

- url: https://ai.pydantic.dev/tools/
  why: Tool integration patterns and function registration
  content: @agent.tool decorators, RunContext usage, parameter validation

- url: https://ai.pydantic.dev/testing/
  why: Testing strategies specific to PydanticAI agents
  content: TestModel, FunctionModel, Agent.override(), pytest patterns

- url: https://ai.pydantic.dev/models/
  why: Model provider configuration and authentication
  content: AWS Bedrock Anthropic setup, credential management, fallback models

# Prebuilt examples
- path: examples/
  why: Reference implementations for Pydantic AI agents
  content: A bunch of already built simple Pydantic AI examples to reference including how to set up models and providers

- path: examples/cli.py
  why: Shows real-world interaction with Pydantic AI agents
  content: Conversational CLI with streaming, tool call visibility, and conversation handling - demonstrates how users actually interact with agents
```

### Agent Architecture Research

```yaml
# PydanticAI Architecture Patterns (follow main_agent_reference)
agent_structure:
  configuration:
    - settings.py: Environment-based configuration with pydantic-settings
    - providers.py: Model provider abstraction with get_llm_model()
    - Bedrock client config (region/profile) and model selection via environment variables
    - Never hardcode provider model strings (e.g., "openai:gpt-4o" or dated Anthropic IDs); use configuration

  agent_definition:
    - Default to string output (no result_type unless structured output needed)
    - Use get_llm_model() from providers.py for model configuration
    - System prompts as string constants or functions
    - Dataclass dependencies for external services

  tool_integration:
    - @agent.tool for context-aware tools with RunContext[DepsType]
    - Tool functions as pure functions that can be called independently
    - Proper error handling and logging in tool implementations
    - Dependency injection through RunContext.deps

  testing_strategy:
    - TestModel for rapid development validation
    - FunctionModel for custom behavior testing
    - Agent.override() for test isolation
    - Comprehensive tool testing with mocks
```

### Redis ElastiCache Integration (Pottery Utils)

```yaml
# ElastiCache Redis with pottery utils for distributed operations
redis_elasticache:
  credentials_source: "AWS Secrets Manager"
  secret_path: "/agency/redis/credentials"
  connection:
    ssl: true
    ssl_cert_reqs: "none"
    ssl_check_hostname: false
    decode_responses: false  # Required for pottery compatibility
  pottery_patterns:
    - RedisSimpleQueue: "Distributed task queues"
    - Redlock: "Distributed locking with TTL"
    - batch_processing: "get_queue_batch() for efficient processing"
  utils_module: "redis_utils/pottery_utils.py"  # Pre-existing utility functions
```

### Security and Production Considerations

```yaml
# Production Security Patterns (based on existing examples)
security_requirements:
  aws_credentials:
    ecs_runtime: "AWS_CONTAINER_CREDENTIALS_RELATIVE_URI" # Primary for ECS
    local_dev: ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_SESSION_TOKEN"]
    environment: ["AWS_REGION", "MODEL_NAME"]
  secrets_manager:
    redis_credentials: "/agency/redis/credentials"
    cognito_credentials: "/the_agency/{agent_name}/cognito_credentials"
  mcp_server:
    connection: ["WHISPER_MCP_HOST", "WHISPER_MCP_PORT"]
    agent_identification: ["AGENT_NAME"] # For session management

  input_validation:
    sanitization: "Validate all user inputs with Pydantic models"
    prompt_injection: "Implement prompt injection prevention strategies"
    rate_limiting: "Prevent abuse with proper throttling"

  output_security:
    data_filtering: "Ensure no sensitive data in agent responses"
    content_validation: "Validate output structure and content"
    logging_safety: "Safe logging without exposing secrets"
```

### Common PydanticAI Gotchas (research and document)

```yaml
# Agent-specific gotchas to research and address
implementation_gotchas:
  async_patterns:
    issue: "Mixing sync and async agent calls inconsistently"
    research: "PydanticAI async/await best practices"
    solution: "[To be documented based on research]"

  model_limits:
    issue: "Different models have different capabilities and token limits"
    research: "Model provider comparison and capabilities"
    solution: "[To be documented based on research]"

  dependency_complexity:
    issue: "Complex dependency graphs can be hard to debug"
    research: "Dependency injection best practices in PydanticAI"
    solution: "[To be documented based on research]"

  tool_error_handling:
    issue: "Tool failures can crash entire agent runs"
    research: "Error handling and retry patterns for tools"
    solution: "[To be documented based on research]"
```

## Implementation Blueprint

### Technology Research Phase

**RESEARCH REQUIRED - Complete before implementation:**

✅ **PydanticAI Framework Deep Dive:**
- [ ] Agent creation patterns and best practices
- [ ] Model provider configuration and fallback strategies
- [ ] Tool integration patterns (@agent.tool vs @agent.tool_plain)
- [ ] Dependency injection system and type safety
- [ ] Testing strategies with TestModel and FunctionModel

✅ **Agent Architecture Investigation:**
- [ ] Project structure conventions (agent.py, tools.py, models.py, dependencies.py)
- [ ] System prompt design (static vs dynamic)
- [ ] Structured output validation with Pydantic models
- [ ] Async/sync patterns and streaming support
- [ ] Error handling and retry mechanisms

✅ **Security and Production Patterns:**
- [ ] Credential management and secure configuration
- [ ] Input validation and prompt injection prevention
- [ ] Rate limiting and monitoring strategies
- [ ] Logging and observability patterns
- [ ] Deployment and scaling considerations

### Agent Implementation Plan

```yaml
Implementation Task 1 - Agent Architecture Setup (Based on examples/ patterns):
  CREATE agent project structure following established patterns:
    - agent.py: Main agent with Bedrock Sonnet 4/3.7, MCP server integration
    - agent_prompts.py: System prompts and dynamic context functions
    - agent_tools.py: Tools using @agent.tool with RunContext
    - models.py: Pydantic output models and structured data
    - redis_utils/: Pottery utils for ElastiCache operations (reuse existing)
    - deployment/: Terraform and Lambda deployment configurations

Implementation Task 2 - Bedrock Integration:
  IMPLEMENT get_model() function with ECS credential handling:
    - Primary: us.anthropic.claude-4-sonnet-20250514-v1:0
    - Fallback: us.anthropic.claude-3-7-sonnet-20250219-v1:0
    - ECS credentials via AWS_CONTAINER_CREDENTIALS_RELATIVE_URI
    - Local dev fallback to environment variables
    - Proper boto3 session and frozen credentials handling

Implementation Task 3 - Redis ElastiCache Integration:
  SETUP Redis connectivity using existing pottery utils:
    - Import redis_utils/pottery_utils.py patterns
    - Secrets Manager credential retrieval (/agency/redis/credentials)
    - SSL configuration for ElastiCache
    - RedisSimpleQueue and Redlock patterns
    - Batch processing with get_queue_batch()

Implementation Task 4 - MCP Server Integration:
  CONFIGURE Whisper MCP server connectivity:
    - create_whisper_server() function with agent identification
    - Session ID generation for consistent agent sessions
    - HTTP SSE connection with query parameters
    - Agent name and session ID for proper authentication

Implementation Task 5 - Deployment Infrastructure:
  CREATE deployment/ directory with Terraform and Lambda:
    - main.tf with ECS task definition and service
    - Lambda function for event processing
    - EventBridge rules for agent triggering
    - IAM roles and policies for AWS services
    - Environment variable configuration

Implementation Task 6 - Testing and Validation:
  IMPLEMENT comprehensive test suite:
    - TestModel for rapid development validation
    - Mock Redis and MCP connections for unit tests
    - ECS credential mocking for local testing
    - Integration tests with real Bedrock models
    - Deployment validation scripts
```

## Validation Loop

### Level 1: Agent Structure Validation

```bash
# Verify complete agent project structure
find agent_project -name "*.py" | sort
test -f agent_project/agent.py && echo "Agent definition present"
test -f agent_project/tools.py && echo "Tools module present"
test -f agent_project/models.py && echo "Models module present"
test -f agent_project/dependencies.py && echo "Dependencies module present"

# Verify proper PydanticAI imports
grep -q "from pydantic_ai import Agent" agent_project/agent.py
grep -q "@agent.tool" agent_project/tools.py
grep -q "from pydantic import BaseModel" agent_project/models.py

# Expected: All required files with proper PydanticAI patterns
# If missing: Generate missing components with correct patterns
```

### Level 2: Agent Functionality Validation

```bash
# Test agent can be imported and instantiated
python -c "
from agent_project.agent import agent
print('Agent created successfully')
print(f'Model: {agent.model}')
print(f'Tools: {len(agent.tools)}')
"

# Test with TestModel for validation
python -c "
from pydantic_ai.models.test import TestModel
from agent_project.agent import agent
test_model = TestModel()
with agent.override(model=test_model):
    result = agent.run_sync('Test message')
    print(f'Agent response: {result.output}')
"

# Expected: Agent instantiation works, tools registered, TestModel validation passes
# If failing: Debug agent configuration and tool registration
```

### Level 3: Comprehensive Testing Validation

```bash
# Run complete test suite
cd agent_project
python -m pytest tests/ -v

# Test specific agent behavior
python -m pytest tests/test_agent.py::test_agent_response -v
python -m pytest tests/test_tools.py::test_tool_validation -v
python -m pytest tests/test_models.py::test_output_validation -v

# Expected: All tests pass, comprehensive coverage achieved
# If failing: Fix implementation based on test failures
```

### Level 4: Production Readiness Validation

```bash
# Verify security patterns
grep -r "API_KEY\|ACCESS_KEY\|SECRET_KEY" agent_project/ | grep -v ".py:" # Should not expose keys
test -f agent_project/.env.example && echo "Environment template present"

# Verify Bedrock Sonnet 4/3.7 configuration
grep -R "us.anthropic.claude-4-sonnet" agent_project/ | wc -l  # Expect >0
grep -R "claude-3-7-sonnet" agent_project/ | wc -l  # Expect >0 for fallback

# Verify ElastiCache Redis and pottery utils integration
grep -R "redis_utils" agent_project/ | wc -l  # Expect >0
grep -R "pottery_utils" agent_project/ | wc -l  # Expect >0

# Check error handling
grep -r "try:" agent_project/ | wc -l  # Should have error handling
grep -r "except" agent_project/ | wc -l  # Should have exception handling

# Verify logging setup
grep -r "logging\|logger" agent_project/ | wc -l  # Should have logging

# Expected: Security measures in place, error handling comprehensive, logging configured
# If issues: Implement missing security and production patterns
```

## Final Validation Checklist

### Agent Implementation Completeness

- [ ] Complete agent project structure: `agent.py`, `agent_prompts.py`, `agent_tools.py`, `models.py`
- [ ] Bedrock integration with Sonnet 4 primary, 3.7 fallback
- [ ] ECS credential handling with local development fallback
- [ ] Redis ElastiCache connectivity using pottery utils
- [ ] MCP server integration with session management
- [ ] Deployment infrastructure with Terraform and Lambda
- [ ] Comprehensive test suite with TestModel and mocked services

### PydanticAI Best Practices

- [ ] Type safety throughout with proper type hints and validation
- [ ] Security patterns implemented (credentials, input validation, rate limiting)
- [ ] Error handling and retry mechanisms for robust operation
- [ ] Async/sync patterns consistent and appropriate
- [ ] Documentation and code comments for maintainability

### Production Readiness

- [ ] Environment configuration with .env files and validation
- [ ] Logging and monitoring setup for observability
- [ ] Performance optimization and resource management
- [ ] Deployment readiness with proper configuration management
- [ ] Maintenance and update strategies documented

---

## Anti-Patterns to Avoid

### PydanticAI Agent Development

- ❌ Don't skip TestModel validation - always test with TestModel during development
- ❌ Don't hardcode credentials - use environment variables or secret managers
- ❌ Don't ignore async patterns - PydanticAI has specific async/sync requirements
- ❌ Don't create complex tool chains - keep tools focused and composable
- ❌ Don't skip error handling - implement comprehensive retry and fallback mechanisms

### Agent Architecture

- ❌ Don't mix agent types - clearly separate chat, tool, workflow, and structured output patterns
- ❌ Don't ignore dependency injection - use proper type-safe dependency management
- ❌ Don't skip output validation - always use Pydantic models for structured responses
- ❌ Don't forget tool documentation - ensure all tools have proper descriptions and schemas

### Security and Production

- ❌ Don't expose sensitive data - validate all outputs and logs for security
- ❌ Don't skip input validation - sanitize and validate all user inputs
- ❌ Don't ignore rate limiting - implement proper throttling for external services
- ❌ Don't deploy without monitoring - include proper observability from the start

**RESEARCH STATUS: [TO BE COMPLETED]** - Complete comprehensive PydanticAI research before implementation begins.
