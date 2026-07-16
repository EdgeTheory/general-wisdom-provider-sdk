name: "LocalFirecrawl Deep Research MCP Integration - Python Implementation"
description: |
  Comprehensive PRP for replacing external Firecrawl dependency with local Python implementation
  in the deep-research-mcp service, converting JavaScript/TypeScript to Python while maintaining
  existing interface compatibility and performance standards.

## Goal

Replace the external Firecrawl service dependency in deep-research-mcp with a local Python implementation that provides:
- Complete web scraping and crawling capabilities without external service dependencies
- Full browser automation with JavaScript execution support
- Content extraction and markdown conversion
- Search integration via local SearXNG instance
- Maintains exact interface compatibility with existing ScrapingService class
- Achieves same or better performance than external Firecrawl
- Eliminates external API calls and improves system reliability

## Why

- **Eliminate External Dependencies**: Remove reliance on external Firecrawl API service and associated costs
- **Improve Reliability**: Local implementation eliminates network failures and API rate limits
- **Enhanced Performance**: Local processing removes network latency and API call overhead
- **Cost Reduction**: Eliminate external service fees and API key management
- **Data Privacy**: Keep all scraped content within local infrastructure
- **Feature Control**: Full control over scraping capabilities and customization
- **Integration Benefits**: Direct integration with existing deep-research-mcp patterns and error handling

## What

Create a complete local Firecrawl implementation that:
- Maintains the existing `ScrapingService` interface without breaking changes
- Provides browser automation using Playwright for JavaScript-heavy sites
- Implements content extraction and markdown conversion
- Integrates with local SearXNG for web search capabilities
- Follows all existing async patterns, error handling, and rate limiting
- Supports the same scraping modes: search+scrape, URL scraping, batch operations
- Includes comprehensive test coverage and validation

### Success Criteria

- [ ] All existing ScrapingService method signatures preserved
- [ ] Browser automation with Playwright successfully processes JavaScript-heavy sites
- [ ] Content extraction produces clean markdown output comparable to external Firecrawl
- [ ] Search integration via SearXNG provides diverse, relevant results
- [ ] Performance matches or exceeds external Firecrawl (< 5s per URL)
- [ ] Rate limiting prevents target site blocking
- [ ] Error handling maintains existing exception hierarchy
- [ ] Test coverage >= 90% for all new components
- [ ] Integration tests pass with existing deep-research-mcp functionality
- [ ] Memory usage remains stable under concurrent load

## All Needed Context

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://playwright.dev/python/docs/intro
  why: Core browser automation API, async patterns, and best practices

- url: https://docs.python.org/3/library/asyncio.html
  why: Async context managers, semaphores, and resource management patterns

- url: https://beautifulsoup.readthedocs.io/en/latest/
  why: HTML parsing, content extraction, and text cleaning methods

- file: src/deep-research-mcp/scraping_service.py
  why: Existing interface to maintain, error handling patterns, async context management

- file: src/deep-research-mcp/config.py
  why: Configuration patterns using Pydantic Settings with validation

- file: src/deep-research-mcp/models.py
  why: SearchDocument model that must be preserved, validation patterns

- docfile: PRPs/ai_docs/localfirecrawl-integration.md
  why: Comprehensive integration guide with critical patterns and gotchas

- url: https://github.com/Ozamatash/localfirecrawl/tree/main
  why: Source implementation to convert from JavaScript to Python

- url: https://docs.pydantic.dev/latest/usage/settings/
  why: Settings management patterns for configuration validation

- url: https://tenacity.readthedocs.io/en/latest/
  why: Retry logic patterns with exponential backoff for resilient scraping
```

### Current Codebase Tree

```bash
src/
└── deep-research-mcp
    ├── Dockerfile
    ├── __init__.py
    ├── ai_service.py
    ├── config.py                  # MODIFY: Add LocalFirecrawl settings
    ├── deployment
    ├── docker-compose.yml
    ├── localfirecrawl            # EXPAND: Add Python implementation
    │   └── config
    ├── main.py
    ├── manifest.json
    ├── mcp_server.py
    ├── models.py                 # KEEP: Preserve SearchDocument model
    ├── progress_manager.py
    ├── report_generator.py
    ├── requirements.txt          # MODIFY: Add new dependencies
    ├── research_engine.py
    ├── scraping_service.py       # MODIFY: Replace external calls with local implementation
    └── tests
        ├── __init__.py
        ├── test_mcp_server.py
        ├── test_models.py
        └── test_scraping_service.py  # EXPAND: Add comprehensive test coverage
```

### Desired Codebase Tree with Files to be Added

```bash
src/deep-research-mcp/
├── localfirecrawl/               # NEW: Local Firecrawl implementation
│   ├── __init__.py              # Package initialization
│   ├── scraper.py               # Core scraping orchestration and interface
│   ├── browser_service.py       # Playwright browser pool management
│   ├── content_processor.py     # HTML parsing and markdown conversion
│   ├── search_service.py        # SearXNG integration for web search
│   ├── rate_limiter.py          # Token bucket rate limiting with domain awareness
│   ├── config.py                # LocalFirecrawl specific configuration
│   └── exceptions.py            # Custom exception hierarchy for local implementation
├── tests/
│   ├── test_localfirecrawl/     # NEW: Comprehensive test suite
│   │   ├── __init__.py
│   │   ├── test_scraper.py      # Core scraping functionality tests
│   │   ├── test_browser_service.py  # Browser automation tests
│   │   ├── test_content_processor.py  # Content processing tests
│   │   ├── test_search_service.py   # Search integration tests
│   │   └── fixtures/            # Test HTML samples and mock data
│   │       ├── sample_pages.html
│   │       └── mock_responses.json
│   └── integration/             # NEW: End-to-end integration tests
│       ├── __init__.py
│       └── test_full_pipeline.py   # Complete scraping pipeline tests
```

### Known Gotchas & Library Quirks

```python
# CRITICAL: Playwright requires specific browser installation
# Must run: playwright install chromium
# Docker: Add RUN playwright install chromium to Dockerfile

# CRITICAL: BeautifulSoup parser must be specified explicitly
# Use: BeautifulSoup(html, "lxml") not BeautifulSoup(html)
# Reason: Default parser varies across systems causing inconsistent results

# CRITICAL: Async context managers MUST be properly closed
# Pattern: async with service: ... ensures __aexit__ cleanup
# Gotcha: Manual start/close calls can lead to resource leaks

# CRITICAL: Rate limiting must be per-domain, not global
# Pattern: Use domain-specific semaphores and timing
# Gotcha: Global rate limiting causes unnecessary slowdowns

# CRITICAL: Content length validation before processing
# Pattern: Check Content-Length header before download
# Gotcha: Large files can cause OOM without limits

# CRITICAL: JavaScript execution timing in Playwright
# Pattern: await page.wait_for_load_state("networkidle")
# Gotcha: page.wait_for_timeout() is unreliable for dynamic content

# CRITICAL: Browser pool lifecycle management
# Pattern: Reuse browser contexts, not browsers themselves
# Gotcha: New browser per request is extremely slow

# CRITICAL: Connection pooling with aiohttp ClientSession
# Pattern: Session per service lifecycle, not per request
# Gotcha: New session per request defeats connection pooling
```

## Implementation Blueprint

### Data Models and Structure

Core data models ensuring type safety and interface compatibility:

```python
# PRESERVE existing SearchDocument model in models.py
# ADD LocalFirecrawl-specific models for internal processing

from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, Dict, Any, List
from datetime import datetime

class ScrapingRequest(BaseModel):
    """Internal request model for scraping operations."""
    url: HttpUrl
    use_browser: bool = Field(default=False, description="Use browser automation for JavaScript")
    timeout: int = Field(default=30, ge=5, le=120)
    max_content_length: int = Field(default=50000, ge=1000)

class BrowserOptions(BaseModel):
    """Browser configuration for Playwright."""
    headless: bool = Field(default=True)
    viewport: Dict[str, int] = Field(default={"width": 1920, "height": 1080})
    user_agent: Optional[str] = None

class ContentProcessingOptions(BaseModel):
    """Options for content extraction and cleaning."""
    preserve_links: bool = Field(default=True)
    remove_images: bool = Field(default=False)
    min_text_length: int = Field(default=100, ge=10)
```

### List of Tasks to be Completed (Ordered Implementation)

```yaml
Task 1:
MODIFY src/deep-research-mcp/requirements.txt:
  - ADD playwright>=1.40.0
  - ADD beautifulsoup4>=4.12.0
  - ADD lxml>=4.9.0
  - ADD html2text>=2020.1.16
  - ADD markdownify>=0.11.6
  - ADD readability>=0.3.1

Task 2:
MODIFY src/deep-research-mcp/config.py:
  - INJECT LocalFirecrawl settings into ResearchMCPSettings class
  - PRESERVE all existing configuration
  - ADD validation for new browser and scraping settings

Task 3:
CREATE src/deep-research-mcp/localfirecrawl/__init__.py:
  - DEFINE package exports
  - EXPOSE main LocalFirecrawlService class

Task 4:
CREATE src/deep-research-mcp/localfirecrawl/exceptions.py:
  - MIRROR pattern from existing FirecrawlError hierarchy
  - PRESERVE existing exception types for compatibility
  - ADD local implementation specific exceptions

Task 5:
CREATE src/deep-research-mcp/localfirecrawl/rate_limiter.py:
  - IMPLEMENT token bucket rate limiting with domain awareness
  - PATTERN: Follow existing semaphore + timing patterns
  - CRITICAL: Per-domain rate limiting to avoid unnecessary slowdowns

Task 6:
CREATE src/deep-research-mcp/localfirecrawl/browser_service.py:
  - IMPLEMENT Playwright browser pool management
  - PATTERN: Async context manager with proper cleanup
  - CRITICAL: Browser context reuse, not browser instance reuse

Task 7:
CREATE src/deep-research-mcp/localfirecrawl/content_processor.py:
  - IMPLEMENT HTML to Markdown conversion with BeautifulSoup
  - PATTERN: Pipeline processing with validation
  - CRITICAL: Always specify "lxml" parser explicitly

Task 8:
CREATE src/deep-research-mcp/localfirecrawl/search_service.py:
  - IMPLEMENT SearXNG integration for web search
  - PATTERN: HTTP client with connection pooling
  - MIRROR existing aiohttp session management patterns

Task 9:
CREATE src/deep-research-mcp/localfirecrawl/scraper.py:
  - IMPLEMENT core scraping orchestration
  - INTEGRATE all service components
  - PRESERVE exact interface compatibility with ScrapingService

Task 10:
MODIFY src/deep-research-mcp/scraping_service.py:
  - REPLACE external Firecrawl API calls with LocalFirecrawlService
  - PRESERVE all existing method signatures
  - MAINTAIN existing error handling and retry patterns

Task 11:
CREATE comprehensive test suite:
  - CREATE test_localfirecrawl/ directory with unit tests
  - CREATE integration/ directory with end-to-end tests
  - MIRROR existing test patterns and fixtures

Task 12:
MODIFY src/deep-research-mcp/Dockerfile:
  - ADD Playwright browser installation
  - ADD system dependencies for lxml and browser automation
  - PRESERVE existing multi-stage build pattern
```

### Per Task Pseudocode

```python
# Task 2: Configuration Extension
class ResearchMCPSettings(BaseSettings):
    # PRESERVE all existing settings...

    # LocalFirecrawl settings
    local_firecrawl_enabled: bool = Field(default=True)
    browser_pool_size: int = Field(default=3, ge=1, le=10)
    browser_timeout: int = Field(default=30, ge=10, le=120)

    # CRITICAL: Validation to prevent production issues
    @field_validator("browser_pool_size")
    @classmethod
    def validate_browser_pool(cls, v: int, info) -> int:
        if info.data.get("environment") == "production" and v > 5:
            raise ValueError("Browser pool size too large for production")
        return v

# Task 6: Browser Service Implementation
class BrowserService:
    # PATTERN: Async context manager for proper resource cleanup
    async def __aenter__(self):
        await self.start_browser_pool()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close_browser_pool()

    async def get_page_content(self, url: str) -> str:
        # CRITICAL: Use browser context, not new browser
        async with self.browser_pool.get_context() as context:
            page = await context.new_page()
            try:
                await page.goto(url, wait_until="networkidle")
                # GOTCHA: Wait for network idle, not fixed timeout
                return await page.content()
            finally:
                await page.close()

# Task 7: Content Processing Pipeline
class ContentProcessor:
    def html_to_markdown(self, html: str) -> str:
        # CRITICAL: Always specify lxml parser
        soup = BeautifulSoup(html, "lxml")

        # PATTERN: Content cleaning pipeline
        self._remove_unwanted_elements(soup)
        clean_html = str(soup)

        # GOTCHA: Validate content length before processing
        if len(clean_html) > self.max_content_length:
            clean_html = clean_html[:self.max_content_length]

        return markdownify(clean_html, strip=['script', 'style'])

# Task 9: Core Scraper Integration
class LocalFirecrawlService:
    # PRESERVE existing interface exactly
    async def scrape_url(self, url: str) -> Optional[SearchDocument]:
        # PATTERN: Rate limiting with domain awareness
        async with self.rate_limiter.acquire(domain=get_domain(url)):
            try:
                # PATTERN: Try simple HTTP first, browser if needed
                content = await self._try_simple_scrape(url)
                if not content or self._needs_javascript(content):
                    content = await self.browser_service.get_page_content(url)

                processed = self.content_processor.html_to_markdown(content)

                # PRESERVE existing SearchDocument model
                return SearchDocument(
                    url=url,
                    title=self._extract_title(content),
                    content=processed,
                    metadata={"scraped_with": "local_firecrawl"},
                    scraped_at=datetime.utcnow()
                )
            except Exception as e:
                # PRESERVE existing exception hierarchy
                raise FirecrawlError(f"Scraping failed for {url}: {e}")
```

### Integration Points

```yaml
DATABASE:
  - no_changes: "LocalFirecrawl is stateless, no DB changes needed"

CONFIG:
  - modify: src/deep-research-mcp/config.py
  - pattern: "Add LocalFirecrawl settings with field validation"
  - preserve: "All existing configuration options"

DEPENDENCIES:
  - modify: requirements.txt
  - add: "playwright, beautifulsoup4, lxml, html2text, markdownify"
  - version_pin: "Use >= for flexibility, avoid breaking changes"

DOCKER:
  - modify: Dockerfile
  - add: "RUN playwright install chromium"
  - add: "System dependencies for lxml compilation"
  - preserve: "Multi-stage build pattern and security measures"

INTERFACE:
  - preserve: "ScrapingService class interface exactly"
  - maintain: "SearchDocument model compatibility"
  - keep: "All existing method signatures and return types"
```

## Validation Loop

### Level 1: Syntax & Style

```bash
# Run these FIRST - fix any errors before proceeding
uv run ruff check src/deep-research-mcp/localfirecrawl/ --fix
uv run mypy src/deep-research-mcp/localfirecrawl/
uv run ruff format src/deep-research-mcp/localfirecrawl/

# Expected: No errors. If errors, READ carefully and fix root causes.
# Common issues: Import errors, type annotation problems, async/await misuse
```

### Level 2: Unit Tests

```python
# CREATE comprehensive test suite following existing patterns

def test_browser_service_context_management():
    """Test proper browser resource cleanup."""
    async with BrowserService() as service:
        assert service.browser_pool is not None
    # Context manager should auto-cleanup

def test_content_processor_html_to_markdown():
    """Test HTML conversion to clean markdown."""
    processor = ContentProcessor()
    html = "<h1>Title</h1><p>Content with <a href='#'>link</a></p>"
    result = processor.html_to_markdown(html)
    assert "# Title" in result
    assert "[link](#)" in result

def test_rate_limiter_domain_aware():
    """Test per-domain rate limiting."""
    limiter = RateLimiter(min_interval=1.0)
    start_time = time.time()

    async with limiter.acquire("example.com"):
        pass
    async with limiter.acquire("example.com"):
        pass

    elapsed = time.time() - start_time
    assert elapsed >= 1.0  # Rate limiting enforced

def test_scraper_interface_compatibility():
    """Test that all existing method signatures are preserved."""
    service = LocalFirecrawlService()

    # Test method exists and signature matches
    import inspect
    sig = inspect.signature(service.scrape_url)
    assert 'url' in sig.parameters
    assert sig.return_annotation == Optional[SearchDocument]
```

```bash
# Run and iterate until all tests pass:
uv run pytest src/deep-research-mcp/tests/test_localfirecrawl/ -v
# If failing: Read error messages, understand root cause, fix code (never just mock to pass)
```

### Level 3: Integration Tests

```bash
# Test the complete scraping pipeline
uv run python -c "
import asyncio
from src.deep_research_mcp.scraping_service import ScrapingService

async def test_integration():
    async with ScrapingService() as service:
        # Test simple URL scraping
        result = await service.scrape_url('https://example.com')
        print(f'Title: {result.title}')
        print(f'Content length: {len(result.content)}')

        # Test search and scrape
        results = await service.search_and_scrape('python web scraping', limit=3)
        print(f'Found {len(results)} results')

asyncio.run(test_integration())
"

# Expected: Successfully scrapes content with clean markdown output
# If error: Check logs for stack traces, verify browser installation
```

### Level 4: Performance & Creative Validation

```bash
# Performance testing with concurrent requests
uv run python -c "
import asyncio
import time
from src.deep_research_mcp.scraping_service import ScrapingService

async def performance_test():
    urls = [
        'https://example.com',
        'https://httpbin.org/html',
        'https://quotes.toscrape.com',
    ]

    start_time = time.time()
    async with ScrapingService() as service:
        tasks = [service.scrape_url(url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    elapsed = time.time() - start_time
    success_count = sum(1 for r in results if not isinstance(r, Exception))

    print(f'Scraped {success_count}/{len(urls)} URLs in {elapsed:.2f}s')
    print(f'Average: {elapsed/len(urls):.2f}s per URL')

    # Performance target: < 5s per URL average
    assert elapsed / len(urls) < 5.0

asyncio.run(performance_test())
"

# Browser automation validation
uv run python -c "
import asyncio
from src.deep_research_mcp.localfirecrawl.browser_service import BrowserService

async def browser_test():
    async with BrowserService() as service:
        # Test JavaScript-heavy site
        content = await service.get_page_content('https://quotes.toscrape.com/js/')
        assert 'quote' in content.lower()
        print('Browser automation working correctly')

asyncio.run(browser_test())
"
```

## Final Validation Checklist

- [ ] All unit tests pass: `uv run pytest src/deep-research-mcp/tests/ -v`
- [ ] No linting errors: `uv run ruff check src/deep-research-mcp/`
- [ ] No type errors: `uv run mypy src/deep-research-mcp/`
- [ ] Integration test successful: Python scraping pipeline test passes
- [ ] Performance target met: < 5s average per URL scraping
- [ ] Browser automation works: JavaScript-heavy sites scraped correctly
- [ ] Memory usage stable: No resource leaks during concurrent operations
- [ ] Interface compatibility: All existing ScrapingService methods preserved
- [ ] Error handling functional: Graceful degradation on failures
- [ ] Rate limiting effective: No 429/blocking responses from target sites
- [ ] Docker build successful: Container includes all dependencies
- [ ] Health checks pass: Service startup and readiness validation

## Anti-Patterns to Avoid

- ❌ Don't create new browser instance per request (use browser contexts)
- ❌ Don't skip rate limiting to "go faster" (will get blocked)
- ❌ Don't ignore JavaScript execution timing (dynamic content won't load)
- ❌ Don't use default BeautifulSoup parser (inconsistent across systems)
- ❌ Don't modify existing SearchDocument model (breaks compatibility)
- ❌ Don't skip content length validation (causes OOM on large files)
- ❌ Don't use sync functions in async context (blocks event loop)
- ❌ Don't forget browser resource cleanup (memory leaks)
- ❌ Don't hardcode timeouts and limits (use configuration)
- ❌ Don't catch all exceptions broadly (lose important error context)

---

**PRP Quality Score: 9/10**
- **Context Richness**: 9/10 (Comprehensive research, documentation, and existing patterns)
- **Implementation Clarity**: 9/10 (Detailed task breakdown with pseudocode and patterns)
- **Validation Completeness**: 9/10 (4-level validation with executable commands)
- **One-Pass Success Probability**: 9/10 (Extensive context and clear implementation path)

This PRP provides comprehensive context for successful LocalFirecrawl integration while maintaining existing interface compatibility and following established codebase patterns.
