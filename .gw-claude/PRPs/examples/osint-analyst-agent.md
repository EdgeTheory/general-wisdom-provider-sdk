name: "OSINT Analyst Agent - Context-Rich Implementation"
description: |
Comprehensive PRP for building a production-ready OSINT (Open Source Intelligence) analyst agent
that can perform deep research on entities (people, places, organizations), organize data,
and create insightful analyses and summarizations using pydantic-ai and established agent patterns.

## Goal

Build a production-ready OSINT analyst agent that:
- Takes an entity (person/place/organization/thing) as input with optional focus area
- Performs deep, multi-source research using ethical OSINT methodologies
- Organizes collected data into structured formats
- Performs entity extraction and relationship mapping
- Generates comprehensive analyses and summarizations
- Stores findings in a searchable format

**End State**: A Python agent that takes an entity name and optional focus, performs comprehensive OSINT research, and outputs organized intelligence reports with actionable insights.

## Why

- **Intelligence Gathering**: Enable automated research capabilities for legitimate purposes
- **Data Organization**: Transform unstructured OSINT data into actionable intelligence
- **Pattern Recognition**: Identify connections and relationships between entities
- **Efficiency**: Reduce manual research time from hours to minutes
- **Compliance**: Ensure ethical and legal data collection practices

## What

### Core Functionality

- **Entity Input Processing**: Parse entity names and focus areas into structured queries
- **Multi-Source Collection**: Gather data from various OSINT sources (search engines, social media, public records)
- **Data Normalization**: Convert diverse data formats into unified structures
- **Entity Extraction**: Identify and extract entities (people, organizations, locations, etc.)
- **Relationship Mapping**: Build network graphs of entity relationships
- **Analysis & Summarization**: Generate intelligence reports with key findings

### User Experience

```bash
# Command-line interface
uv run python -m osint_analyst "John Doe" --focus "professional background"

# Python API
from osint_analyst import OSINTAnalystAgent
agent = OSINTAnalystAgent()
report = await agent.analyze("Acme Corporation", focus="financial status")
```

### Success Criteria

- [ ] Successfully research and analyze entities from multiple sources
- [ ] Generate structured intelligence reports with confidence scores
- [ ] Maintain ethical data collection practices with rate limiting
- [ ] Support various entity types (people, organizations, locations)
- [ ] Create visualizations of entity relationships
- [ ] Store findings in searchable format

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://ai.pydantic.dev/
  why: Core PydanticAI framework documentation for agent creation

- url: https://github.com/smicallef/spiderfoot
  why: Reference implementation of modular OSINT framework patterns

- url: https://github.com/laramies/theHarvester
  why: Domain reconnaissance patterns and data source integration

- url: https://playwright.dev/python/
  why: Modern web scraping for JavaScript-rendered content

- url: https://beautiful-soup-4.readthedocs.io/
  why: HTML parsing and data extraction patterns

- url: https://spacy.io/
  why: Named entity recognition and NLP processing

- url: https://networkx.org/
  why: Graph analysis for relationship mapping

- file: /Users/patrick.henry/dev/code-agent/examples/agents/search-insights-agent/agent.py
  why: Existing agent architecture and pydantic-ai patterns

- file: /Users/patrick.henry/dev/code-agent/examples/agents/search-insights-agent/models.py
  why: Data model patterns for agent inputs/outputs

- file: /Users/patrick.henry/dev/code-agent/examples/agents/search-insights-agent/agent_prompts.py
  why: System prompt structure and agent behavior definition

- file: /Users/patrick.henry/dev/code-agent/CLAUDE.md
  why: Project conventions, architecture patterns, and development standards
```


always output your code in the src dir, do not modify any other existing code in the repo

### Desired Codebase Tree

```bash
src/
├── osint_analyst/
│   ├── __init__.py
│   ├── main.py                     # CLI entry point
│   ├── agent.py                    # Core PydanticAI agent
│   ├── models.py                   # Pydantic models for data structures
│   ├── agent_prompts.py            # System prompts and agent behavior
│   ├── agent_tools.py              # Tool functions for the agent
│   ├── manifest.json               # Agent metadata and configuration
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Container configuration
│   ├── tests/
│   │   ├── test_agent.py
│   │   ├── test_models.py
│   │   ├── test_collectors.py
│   │   └── conftest.py
│   ├── features/
│   │   ├── data_collection/
│   │   │   ├── __init__.py
│   │   │   ├── collectors.py      # Multi-source data collectors
│   │   │   ├── rate_limiter.py    # Ethical rate limiting
│   │   │   └── tests/
│   │   │       └── test_collectors.py
│   │   ├── entity_extraction/
│   │   │   ├── __init__.py
│   │   │   ├── extractor.py       # NLP entity extraction
│   │   │   ├── resolver.py        # Entity resolution/deduplication
│   │   │   └── tests/
│   │   │       └── test_extractor.py
│   │   ├── relationship_mapping/
│   │   │   ├── __init__.py
│   │   │   ├── graph_builder.py   # NetworkX relationship graphs
│   │   │   ├── visualizer.py      # Graph visualization
│   │   │   └── tests/
│   │   │       └── test_graph_builder.py
│   │   └── report_generation/
│   │       ├── __init__.py
│   │       ├── analyzer.py        # Data analysis and insights
│   │       ├── summarizer.py      # Report generation
│   │       └── tests/
│   │           └── test_analyzer.py
│   └── utils/
│       ├── __init__.py
│       ├── data_storage.py        # Data persistence layer
│       ├── validators.py          # Input validation
│       └── constants.py           # Configuration constants
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: PydanticAI requires async functions for agent.run()
# CRITICAL: Playwright requires 'playwright install' after pip install
# CRITICAL: Rate limiting is ESSENTIAL for ethical OSINT
# CRITICAL: BeautifulSoup needs lxml parser for speed: BeautifulSoup(html, 'lxml')
# CRITICAL: spaCy models need download: python -m spacy download en_core_web_sm
# CRITICAL: NetworkX graphs can get memory intensive - use streaming for large datasets
# CRITICAL: httpx has different timeout syntax than requests
# CRITICAL: Always check robots.txt before scraping
# CRITICAL: Use UV for all package management
# CRITICAL: Follow existing agent patterns from examples/agents/
# CRITICAL: Max 50 lines per function, 500 lines per file (per CLAUDE.md)
# CRITICAL: Tests must be co-located with code
# CRITICAL: Entity names in data may contain PII - handle carefully
```

## Implementation Blueprint

### Data Models and Structure

```python
# Core Pydantic models for type safety
from pydantic import BaseModel, Field, HttpUrl, validator
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum
import uuid

class EntityType(str, Enum):
    PERSON = "person"
    ORGANIZATION = "organization"
    LOCATION = "location"
    DOMAIN = "domain"
    EMAIL = "email"
    PHONE = "phone"
    USERNAME = "username"

class DataSource(str, Enum):
    SEARCH_ENGINE = "search_engine"
    SOCIAL_MEDIA = "social_media"
    PUBLIC_RECORDS = "public_records"
    DNS = "dns"
    CERTIFICATE = "certificate"

class OSINTEntity(BaseModel):
    """Core entity model for OSINT data"""
    entity_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    entity_type: EntityType
    value: str
    aliases: List[str] = []
    source: DataSource
    confidence: float = Field(ge=0, le=1)
    collected_at: datetime = Field(default_factory=datetime.now)
    metadata: Dict[str, Any] = {}
    relationships: List[str] = []  # Entity IDs of related entities

class OSINTRequest(BaseModel):
    """Input model for OSINT analysis requests"""
    entity: str = Field(..., min_length=1, max_length=500)
    entity_type: Optional[EntityType] = None
    focus: Optional[str] = Field(None, max_length=200)
    depth: Literal["shallow", "medium", "deep"] = "medium"
    sources: Optional[List[DataSource]] = None

class OSINTReport(BaseModel):
    """Output model for OSINT analysis results"""
    request_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    entity: str
    focus: Optional[str]
    summary: str = Field(..., min_length=100, max_length=2000)
    key_findings: List[str]
    entities_found: List[OSINTEntity]
    relationships: List[Dict[str, Any]]  # Graph data
    confidence_score: float = Field(ge=0, le=1)
    sources_used: List[DataSource]
    collection_time: float  # Seconds
    created_at: datetime = Field(default_factory=datetime.now)
```

### List of tasks to be completed to fulfill the PRP

```yaml
Task 1:
CREATE src/osint_analyst/__init__.py:
  - Standard Python package initialization
  - Export main classes and functions

CREATE src/osint_analyst/models.py:
  - COPY data models from Implementation Blueprint above
  - ADD validation methods for entity types
  - IMPLEMENT serialization methods for storage

Task 2:
CREATE src/osint_analyst/agent_prompts.py:
  - MIRROR pattern from: examples/agents/search-insights-agent/agent_prompts.py
  - MODIFY for OSINT analysis context
  - INCLUDE ethical guidelines and rate limiting reminders

Task 3:
CREATE src/osint_analyst/agent.py:
  - MIRROR pattern from: examples/agents/search-insights-agent/agent.py
  - IMPLEMENT get_model() using Bedrock provider
  - CREATE OSINTAnalystAgent class with pydantic-ai
  - ADD tools for data collection, analysis, and reporting

Task 4:
CREATE src/osint_analyst/features/data_collection/collectors.py:
  - IMPLEMENT base Collector abstract class
  - CREATE SearchEngineCollector using httpx
  - CREATE WebScraperCollector using BeautifulSoup
  - CREATE SocialMediaCollector with rate limiting
  - ENSURE all collectors respect robots.txt

Task 5:
CREATE src/osint_analyst/features/data_collection/rate_limiter.py:
  - IMPLEMENT token bucket algorithm
  - USE pyrate-limiter for complex scenarios
  - ADD per-domain rate limiting
  - INCLUDE exponential backoff for failures

Task 6:
CREATE src/osint_analyst/features/entity_extraction/extractor.py:
  - USE spaCy for named entity recognition
  - IMPLEMENT custom entity patterns for OSINT
  - ADD confidence scoring for extracted entities
  - HANDLE multiple languages if needed

Task 7:
CREATE src/osint_analyst/features/entity_extraction/resolver.py:
  - IMPLEMENT entity deduplication logic
  - USE fuzzy matching for name variations
  - CREATE entity merging strategies
  - MAINTAIN audit trail of resolutions

Task 8:
CREATE src/osint_analyst/features/relationship_mapping/graph_builder.py:
  - USE NetworkX for graph construction
  - IMPLEMENT entity relationship detection
  - ADD graph analysis algorithms
  - CALCULATE centrality measures

Task 9:
CREATE src/osint_analyst/features/relationship_mapping/visualizer.py:
  - USE plotly for interactive visualizations
  - CREATE network diagrams
  - ADD timeline visualizations
  - EXPORT to various formats

Task 10:
CREATE src/osint_analyst/features/report_generation/analyzer.py:
  - IMPLEMENT pattern detection algorithms
  - ADD anomaly detection
  - CREATE insight generation logic
  - CALCULATE confidence scores

Task 11:
CREATE src/osint_analyst/features/report_generation/summarizer.py:
  - USE LLM for natural language summaries
  - IMPLEMENT report templates
  - ADD export formats (JSON, PDF, HTML)
  - INCLUDE visualizations in reports

Task 12:
CREATE src/osint_analyst/utils/data_storage.py:
  - IMPLEMENT data persistence layer
  - USE JSON for simple storage
  - ADD search functionality
  - INCLUDE data retention policies

Task 13:
CREATE src/osint_analyst/agent_tools.py:
  - IMPLEMENT tool functions for pydantic-ai
  - ADD data collection tools
  - CREATE analysis tools
  - INCLUDE report generation tools

Task 14:
CREATE src/osint_analyst/main.py:
  - IMPLEMENT CLI using argparse
  - ADD async main function
  - INCLUDE error handling
  - CREATE user-friendly output

Task 15:
CREATE tests for all modules:
  - FOLLOW existing test patterns
  - USE pytest and pytest-asyncio
  - MOCK external API calls
  - ACHIEVE 80%+ coverage
```

### Per task pseudocode

```python
# Task 3: Core Agent Implementation
async def initialize_agent():
    """Initialize the OSINT analyst agent with tools"""
    model_settings = {
        "max_tokens": 8192,
    }

    agent = Agent(
        get_model(),  # Bedrock Claude model
        system_prompt=OSINT_SYSTEM_PROMPT,
        output_type=OSINTReport,
        model_settings=model_settings
    )

    # Register tools
    agent.tool(collect_data)
    agent.tool(extract_entities)
    agent.tool(analyze_relationships)
    agent.tool(generate_report)

    return agent

# Task 4: Data Collection
class SearchEngineCollector(BaseCollector):
    async def collect(self, query: str) -> List[Dict]:
        # PATTERN: Rate limit all requests
        await self.rate_limiter.acquire()

        # PATTERN: Use httpx for async requests
        async with httpx.AsyncClient() as client:
            # GOTCHA: Always set user agent
            headers = {"User-Agent": "OSINT-Analyst/1.0"}

            # PATTERN: Handle timeouts gracefully
            try:
                response = await client.get(
                    self.search_url,
                    params={"q": query},
                    headers=headers,
                    timeout=30
                )
            except httpx.TimeoutException:
                return []

        # PATTERN: Parse and normalize results
        return self.parse_results(response.text)

# Task 6: Entity Extraction
async def extract_entities(text: str) -> List[OSINTEntity]:
    # PATTERN: Load spaCy model (cached)
    nlp = get_spacy_model()

    # GOTCHA: Process in batches for large texts
    doc = nlp(text)

    entities = []
    for ent in doc.ents:
        # PATTERN: Map spaCy labels to our entity types
        entity_type = map_spacy_to_entity_type(ent.label_)

        if entity_type:
            entity = OSINTEntity(
                entity_type=entity_type,
                value=ent.text,
                confidence=calculate_confidence(ent),
                source=DataSource.SEARCH_ENGINE
            )
            entities.append(entity)

    return entities

# Task 8: Relationship Mapping
def build_entity_graph(entities: List[OSINTEntity]) -> nx.Graph:
    # PATTERN: Use NetworkX for graph operations
    G = nx.Graph()

    # Add nodes with attributes
    for entity in entities:
        G.add_node(
            entity.entity_id,
            type=entity.entity_type,
            value=entity.value,
            confidence=entity.confidence
        )

    # PATTERN: Detect relationships based on co-occurrence
    for i, e1 in enumerate(entities):
        for e2 in entities[i+1:]:
            if should_link(e1, e2):
                G.add_edge(
                    e1.entity_id,
                    e2.entity_id,
                    weight=calculate_relationship_strength(e1, e2)
                )

    return G
```

### Integration Points

```yaml
DEPENDENCIES:
  - add to: requirements.txt
  - packages: |
      pydantic-ai>=0.3.1
      httpx>=0.27.0
      beautifulsoup4>=4.12.0
      lxml>=5.1.0
      playwright>=1.40.0
      spacy>=3.7.0
      networkx>=3.2
      plotly>=5.18.0
      pandas>=2.1.0
      numpy>=1.26.0
      pyrate-limiter>=3.1.0
      tenacity>=8.2.0
      python-dotenv>=1.0.0
      boto3>=1.38.0
      redis>=5.2.0

CONFIGURATION:
  - create: .env.example
  - variables: |
      MODEL_NAME=us.anthropic.claude-3-7-sonnet-20250219-v1:0
      AWS_REGION=us-east-1
      RATE_LIMIT_REQUESTS=10
      RATE_LIMIT_PERIOD=60
      MAX_DEPTH=3
      STORAGE_PATH=./data/osint_reports

DOCKER:
  - create: Dockerfile
  - base_image: python:3.11-slim
  - install: system dependencies for playwright
  - run: playwright install
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
uv run ruff check src/osint_analyst/ --fix
uv run mypy src/osint_analyst/

# Expected: No errors. If errors, READ and fix.
```

### Level 2: Unit Tests

```python
# Test entity extraction
def test_entity_extraction():
    """Test that entities are correctly extracted"""
    text = "John Doe works at Acme Corp in New York"
    entities = extract_entities(text)

    assert len(entities) == 3
    assert any(e.value == "John Doe" and e.entity_type == EntityType.PERSON for e in entities)
    assert any(e.value == "Acme Corp" and e.entity_type == EntityType.ORGANIZATION for e in entities)
    assert any(e.value == "New York" and e.entity_type == EntityType.LOCATION for e in entities)

# Test rate limiting
async def test_rate_limiter():
    """Test rate limiting prevents excessive requests"""
    limiter = RateLimiter(calls=2, period=1)

    start = time.time()
    await limiter.acquire()  # First call - immediate
    await limiter.acquire()  # Second call - immediate
    await limiter.acquire()  # Third call - should wait
    elapsed = time.time() - start

    assert elapsed >= 1.0  # Should have waited

# Test data collection with mocking
@pytest.mark.asyncio
async def test_search_collector():
    """Test search engine data collection"""
    collector = SearchEngineCollector()

    with mock.patch('httpx.AsyncClient.get') as mock_get:
        mock_get.return_value.text = '<html>Test results</html>'
        results = await collector.collect("test query")

        assert len(results) > 0
        assert mock_get.called
```

```bash
# Run and iterate until passing:
uv run pytest src/osint_analyst/ -v
# If failing: Read error, fix code, re-run
```

### Level 3: Integration Test

```bash
# Test the CLI
uv run python -m osint_analyst "Tim Cook" --focus "Apple CEO"

# Expected output:
# Analyzing entity: Tim Cook (focus: Apple CEO)
# Collecting data from 5 sources...
# Extracted 47 entities
# Built relationship graph with 23 connections
# Generated report: ./data/osint_reports/report_[id].json

# Test the API
python -c "
import asyncio
from osint_analyst import OSINTAnalystAgent

async def test():
    agent = OSINTAnalystAgent()
    report = await agent.analyze('Microsoft Corporation', focus='recent acquisitions')
    print(f'Found {len(report.entities_found)} entities')
    print(f'Summary: {report.summary[:100]}...')

asyncio.run(test())
"
```

### Level 4: Validation & Compliance

```bash
# Test rate limiting compliance
uv run python -m osint_analyst "test" --sources search_engine --test-rate-limit

# Test data privacy compliance
uv run python scripts/validate_privacy.py ./data/osint_reports/

# Test visualization generation
uv run python -m osint_analyst "OpenAI" --visualize --output-format html

# Performance test
time uv run python -m osint_analyst "Google" --depth shallow

# Expected: < 30 seconds for shallow search
```

## Final Validation Checklist

- [ ] All tests pass: `uv run pytest src/osint_analyst/ -v`
- [ ] No linting errors: `uv run ruff check src/osint_analyst/`
- [ ] No type errors: `uv run mypy src/osint_analyst/`
- [ ] Rate limiting works correctly
- [ ] Robots.txt compliance verified
- [ ] Entity extraction accuracy > 80%
- [ ] Relationship detection working
- [ ] Reports generated successfully
- [ ] Visualizations render correctly
- [ ] Data stored securely
- [ ] No PII exposed in logs
- [ ] Performance within targets

## Anti-Patterns to Avoid

- ❌ Don't skip rate limiting "for testing"
- ❌ Don't store credentials in code
- ❌ Don't ignore robots.txt
- ❌ Don't collect unnecessary personal data
- ❌ Don't use synchronous requests in async context
- ❌ Don't create graphs with > 10k nodes without pagination
- ❌ Don't trust all data sources equally
- ❌ Don't skip entity deduplication
- ❌ Don't expose raw OSINT data to end users

---

## Quality Score

**Confidence Level: 9/10**

This PRP provides comprehensive context for implementing an OSINT analyst agent with:
- Clear architecture following existing patterns
- Detailed implementation steps with pseudocode
- Extensive library documentation and gotchas
- Multiple validation levels
- Ethical considerations built-in
- Production-ready error handling
