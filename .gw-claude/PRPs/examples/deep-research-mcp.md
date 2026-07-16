name: "Deep Research MCP - Local AI Research Agent v1"
description: |
  Create a comprehensive deep research MCP server that combines web scraping, search, and AI analysis
  capabilities while running entirely locally without external API dependencies (except AWS Bedrock for LLM).
  Based on deep-research-mcp and localfirecrawl projects with whisper-mcp architecture patterns.

## Purpose

Build a self-contained research agent that performs iterative, comprehensive research on any topic using:
- Local web scraping via embedded localfirecrawl
- AWS Bedrock for AI analysis and report generation
- HTTP streaming MCP protocol for real-time progress updates
- ECS deployment for scalable operation

## Core Principles

1. **Zero External Dependencies**: No external API keys required (Firecrawl, OpenAI, search APIs)
2. **Local-First Architecture**: All services containerized and self-hosted
3. **AWS Bedrock Integration**: Use existing codebase patterns for LLM integration
4. **Real-Time Streaming**: Progress updates via HTTP streaming MCP protocol
5. **Production Ready**: Follow existing ECS deployment and monitoring patterns

---

## Goal

Build a deep research MCP server that can:
- Accept research queries with configurable depth/breadth parameters
- Perform iterative web search and content extraction locally
- Generate comprehensive research reports with source reliability scoring
- Stream real-time progress updates to clients
- Deploy as a standalone ECS service with health monitoring

## Why

- **Privacy Compliance**: All research data stays within AWS infrastructure
- **Cost Control**: Eliminate external API usage costs (Firecrawl, search APIs)
- **Integration Ready**: Follows existing MCP server patterns for easy agent integration
- **Scalable Research**: Automated, systematic research with AI-powered analysis
- **Self-Contained**: No dependency on external services or API key management

## What

### Core Functionality
- **Deep Research Tool**: MCP tool accepting query, depth (1-5), breadth (1-5) parameters
- **Local Web Scraping**: Embedded localfirecrawl for content extraction
- **AI Analysis**: AWS Bedrock Claude for content analysis and report generation
- **Progress Streaming**: Real-time updates via HTTP streaming protocol
- **Source Reliability**: Automated scoring of sources with detailed reasoning
- **Report Generation**: Structured markdown reports with citations and metadata

### Success Criteria

- [ ] MCP server responds to deep-research tool calls with structured output
- [ ] Local web scraping works without external API dependencies
- [ ] AWS Bedrock integration follows existing agent patterns
- [ ] Real-time progress updates stream via HTTP protocol
- [ ] Source reliability scoring produces 0.0-1.0 scores with reasoning
- [ ] Generated reports include comprehensive findings with citations
- [ ] ECS deployment works with existing infrastructure patterns
- [ ] Health checks and monitoring integrate with existing systems

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Core Implementation References
- url: https://github.com/Ozamatash/deep-research-mcp
  why: Original TypeScript implementation patterns, research algorithms, progress tracking

- url: https://github.com/Ozamatash/localfirecrawl
  why: Local web scraping architecture, Docker compose setup, API patterns

- file: /Users/patrick.henry/dev/code-agent/examples/whisper-mcp/mcp_server.py
  why: FastMCP HTTP streaming implementation, route patterns, health checks

- file: /Users/patrick.henry/dev/code-agent/examples/agents/search-insights-agent/src/search_insights_agent/agent.py
  why: AWS Bedrock integration patterns, PydanticAI setup, tool registration

- file: /Users/patrick.henry/dev/code-agent/examples/agents/search-insights-agent/src/search_insights_agent/config.py
  why: Configuration management with Pydantic settings

- file: /Users/patrick.henry/dev/code-agent/PRPs/templates/prp_base.md
  why: PRP structure and validation patterns

- url: https://docs.pydantic.dev/latest/concepts/models/
  why: Pydantic v2 model patterns for data validation

- url: https://ai.pydantic.dev/agents/
  why: PydanticAI agent patterns and tool registration

- url: https://docs.anthropic.com/en/api/messages
  why: Claude API patterns for structured output

- docfile: PRPs/ai_docs/localfirecrawl-integration.md
  why: Integration patterns for embedding localfirecrawl services
```

### Desired Codebase Tree

```bash
src/deep-research-mcp/
├── __init__.py
├── main.py                              # CLI entry point
├── mcp_server.py                        # FastMCP HTTP streaming server
├── config.py                            # Pydantic configuration
├── models.py                            # Data models and schemas
├── research_engine.py                   # Core research algorithm
├── scraping_service.py                  # LocalFirecrawl integration
├── ai_service.py                        # AWS Bedrock integration
├── progress_manager.py                  # Real-time progress tracking
├── report_generator.py                  # Markdown report creation
├── manifest.json                        # Agent metadata
├── requirements.txt                     # Python dependencies
├── Dockerfile                           # Container definition
├── docker-compose.yml                   # Local development stack
├── deployment/                          # Terraform infrastructure
│   ├── main.tf                         # ECS service + networking
│   ├── variables.tf                    # Configuration variables
│   └── outputs.tf                      # Service endpoints
├── localfirecrawl/                     # Embedded scraping stack
│   ├── docker-compose.yml              # Firecrawl services
│   └── config/                         # Service configurations
└── tests/                              # Co-located tests
    ├── test_research_engine.py
    ├── test_scraping_service.py
    └── test_mcp_server.py
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: FastMCP requires specific route organization
# Pattern: Use route_maps to separate Resources (GET) from Tools (POST)
# Example: All research operations should be Tools, not Resources

# CRITICAL: LocalFirecrawl needs Docker Compose orchestration
# Pattern: Embed full stack (API, Playwright, SearXNG, Redis) in compose file
# Example: API service runs on port 3002, SearXNG on 8081

# CRITICAL: AWS Bedrock requires structured output for reliability scoring
# Pattern: Use Pydantic models with field constraints and descriptions
# Example: ReliabilityScore with score: float = Field(ge=0.0, le=1.0)

# CRITICAL: Progress streaming requires WebSocket or SSE patterns
# Pattern: Use FastMCP's streamable-http transport with callback system
# Example: Progress callbacks must be non-blocking and error-safe

# CRITICAL: PydanticAI tools must be async and properly typed
# Pattern: All tool functions need RunContext parameter
# Example: async def research_tool(ctx: RunContext[Config], query: str) -> ResearchResult
```

## Implementation Blueprint

### Data Models and Structure

```python
# Core research data models for type safety and validation
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum

class ResearchDepth(int, Enum):
    BASIC = 1
    MODERATE = 2
    DETAILED = 3
    COMPREHENSIVE = 4
    EXHAUSTIVE = 5

class SourceReliability(BaseModel):
    score: float = Field(ge=0.0, le=1.0, description="Reliability score 0-1")
    reasoning: str = Field(min_length=10, description="Detailed scoring rationale")

class SourceMetadata(BaseModel):
    url: HttpUrl
    title: str
    domain: str
    scraped_at: datetime
    content_length: int
    reliability: SourceReliability

class ResearchProgress(BaseModel):
    current_depth: int
    current_breadth: int
    completed_queries: int
    total_sources: int
    progress_percent: float = Field(ge=0.0, le=100.0)
    status: str

class ResearchResult(BaseModel):
    query: str
    findings: str
    sources: List[SourceMetadata]
    progress: ResearchProgress
    report_url: Optional[str] = None
    generated_at: datetime
```

### Task List (Implementation Order)

```yaml
Task 1 - Setup Project Structure:
CREATE src/deep-research-mcp/config.py:
  - MIRROR pattern from: examples/agents/search-insights-agent/src/search_insights_agent/config.py
  - ADD LocalFirecrawl service URLs and ports
  - INCLUDE AWS Bedrock model configuration
  - ADD research depth/breadth constraints

Task 2 - Create Data Models:
CREATE src/deep-research-mcp/models.py:
  - IMPLEMENT research data models with Pydantic v2
  - ADD validation constraints for scores and parameters
  - INCLUDE progress tracking models
  - FOLLOW existing agent model patterns

Task 3 - Embed LocalFirecrawl Services:
CREATE src/deep-research-mcp/docker-compose.yml:
  - COPY localfirecrawl Docker compose configuration
  - MODIFY service names to avoid conflicts
  - ADD health checks for all services
  - CONFIGURE internal networking

Task 4 - Build Scraping Service Integration:
CREATE src/deep-research-mcp/scraping_service.py:
  - IMPLEMENT LocalFirecrawl HTTP client
  - ADD search and scrape method wrappers
  - INCLUDE retry logic with exponential backoff
  - HANDLE rate limiting and concurrent requests

Task 5 - AWS Bedrock AI Service:
CREATE src/deep-research-mcp/ai_service.py:
  - MIRROR pattern from: examples/agents/search-insights-agent/src/search_insights_agent/agent.py
  - IMPLEMENT structured output for source reliability scoring
  - ADD report generation with Claude models
  - INCLUDE content analysis and query generation

Task 6 - Core Research Engine:
CREATE src/deep-research-mcp/research_engine.py:
  - IMPLEMENT iterative research algorithm
  - ADD depth-first and breadth-first search logic
  - INCLUDE progress tracking with callbacks
  - HANDLE URL deduplication and content limits

Task 7 - Progress Management System:
CREATE src/deep-research-mcp/progress_manager.py:
  - IMPLEMENT real-time progress tracking
  - ADD WebSocket/SSE streaming capabilities
  - INCLUDE error handling and recovery
  - FOLLOW FastMCP streaming patterns

Task 8 - Report Generation:
CREATE src/deep-research-mcp/report_generator.py:
  - IMPLEMENT structured markdown report creation
  - ADD source citations and reliability scores
  - INCLUDE executive summary generation
  - FOLLOW academic report formatting

Task 9 - MCP Server Implementation:
CREATE src/deep-research-mcp/mcp_server.py:
  - MIRROR pattern from: examples/whisper-mcp/mcp_server.py
  - IMPLEMENT deep-research tool with streaming
  - ADD health check endpoints
  - INCLUDE route organization and error handling

Task 10 - Container Configuration:
CREATE src/deep-research-mcp/Dockerfile:
  - IMPLEMENT multi-stage build for optimization
  - ADD LocalFirecrawl service dependencies
  - INCLUDE proper entrypoint and health checks
  - FOLLOW existing container patterns

Task 11 - ECS Deployment Configuration:
CREATE src/deep-research-mcp/deployment/main.tf:
  - MIRROR pattern from: agent-resources/deployment/modules/ecs/
  - ADD service definitions for research MCP
  - INCLUDE load balancer and networking
  - ADD CloudWatch logging and monitoring

Task 12 - Integration Testing:
CREATE comprehensive test suite:
  - TEST LocalFirecrawl service integration
  - VALIDATE AWS Bedrock AI processing
  - CHECK MCP protocol compliance
  - VERIFY progress streaming functionality
```

### Key Integration Points

```python
# Task 4 - Scraping Service Pseudocode
class ScrapingService:
    def __init__(self, base_url: str = "http://localhost:3002"):
        self.base_url = base_url
        self.session = aiohttp.ClientSession()

    async def search_and_scrape(self, query: str, limit: int = 5) -> List[Document]:
        # PATTERN: Use LocalFirecrawl /v1/search endpoint
        payload = {
            "query": query,
            "limit": limit,
            "scrapeOptions": {"formats": ["markdown"], "onlyMainContent": True}
        }
        # CRITICAL: Handle rate limiting and retries
        async with self.session.post(f"{self.base_url}/v1/search", json=payload) as resp:
            return await resp.json()

# Task 5 - AI Service Pseudocode
class AIService:
    def __init__(self, config: Config):
        # PATTERN: Follow existing Bedrock integration
        self.agent = Agent(
            get_model(config.model_name),
            system_prompt=RESEARCH_ANALYSIS_PROMPT
        )

    async def score_source_reliability(self, content: str, metadata: dict) -> SourceReliability:
        # CRITICAL: Use structured output with Pydantic models
        result = await self.agent.run(
            f"Score reliability of source: {metadata['domain']}",
            message_history=[{"content": content, "role": "user"}]
        )
        return SourceReliability.model_validate(result.data)

# Task 6 - Research Engine Pseudocode
class ResearchEngine:
    async def deep_research(self, query: str, depth: int, breadth: int,
                          progress_callback: Callable) -> ResearchResult:
        # PATTERN: Recursive depth-first with progress tracking
        for current_depth in range(1, depth + 1):
            queries = await self.ai_service.generate_queries(query, current_depth)

            for i, sub_query in enumerate(queries[:breadth]):
                # CRITICAL: Non-blocking progress updates
                await progress_callback(ResearchProgress(
                    current_depth=current_depth,
                    current_breadth=i + 1,
                    progress_percent=(current_depth * breadth + i) / (depth * breadth) * 100
                ))

                # PATTERN: Concurrent scraping with limits
                documents = await self.scraping_service.search_and_scrape(sub_query)
                # Process and analyze documents...
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run formatting and type checking
uv run ruff format src/deep-research-mcp/
uv run ruff check src/deep-research-mcp/ --fix
uv run mypy src/deep-research-mcp/

# Expected: No errors, clean formatting
```

### Level 2: Unit Tests

```bash
# Core functionality tests
uv run pytest src/deep-research-mcp/tests/test_research_engine.py -v
uv run pytest src/deep-research-mcp/tests/test_scraping_service.py -v
uv run pytest src/deep-research-mcp/tests/test_ai_service.py -v

# Expected: All tests pass with proper mocking of external services
```

### Level 3: Integration Tests

```bash
# Start LocalFirecrawl stack
cd src/deep-research-mcp && docker-compose up -d

# Wait for services to be ready
sleep 30

# Test MCP server
curl -X POST http://localhost:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/call", "params": {"name": "deep_research", "arguments": {"query": "AI research trends", "depth": 2, "breadth": 3}}}'

# Expected: Streaming response with research results and progress updates
# Check: LocalFirecrawl logs for scraping activity
# Verify: AWS Bedrock calls in CloudWatch logs
```

### Level 4: End-to-End Validation

```bash
# Deploy to ECS for production testing
cd src/deep-research-mcp/deployment
terraform init && terraform plan && terraform apply

# Test deployed service health
curl http://your-ecs-endpoint/health

# Run comprehensive research test
curl -X POST http://your-ecs-endpoint/mcp \
  -H "Content-Type: application/json" \
  -d '{"method": "tools/call", "params": {"name": "deep_research", "arguments": {"query": "quantum computing applications", "depth": 3, "breadth": 4}}}'

# Validate output quality and source reliability scores
# Check CloudWatch metrics for performance
# Verify cost optimization (no external API calls)
```

## Final Validation Checklist

- [ ] MCP server responds correctly to deep-research tool calls
- [ ] LocalFirecrawl services start and scrape content successfully
- [ ] AWS Bedrock integration generates reliable source scores (0.0-1.0)
- [ ] Progress streaming works with real-time updates
- [ ] Generated reports include proper citations and formatting
- [ ] No external API dependencies (only AWS Bedrock for AI)
- [ ] Docker compose stack runs all services locally
- [ ] ECS deployment succeeds with health checks passing
- [ ] All tests pass: `uv run pytest src/deep-research-mcp/tests/ -v`
- [ ] No linting errors: `uv run ruff check src/deep-research-mcp/`
- [ ] Type checking passes: `uv run mypy src/deep-research-mcp/`

## Anti-Patterns to Avoid

- ❌ Don't add external API dependencies (Serper, SearchAPI, OpenAI)
- ❌ Don't use synchronous functions for web scraping or AI calls
- ❌ Don't skip source reliability validation - always score sources
- ❌ Don't block progress callbacks - keep them async and error-safe
- ❌ Don't hardcode LocalFirecrawl URLs - use configuration
- ❌ Don't ignore rate limits - implement proper backoff strategies
- ❌ Don't create reports without proper source citations
- ❌ Don't deploy without health checks and monitoring integration

---

**PRP Confidence Score: 9/10**

This PRP provides comprehensive context for implementing a fully local deep research MCP server. The combination of detailed architecture analysis, existing codebase patterns, and specific implementation guidance should enable successful one-pass implementation with iterative refinement through the validation loops.
