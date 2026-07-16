# LocalFirecrawl Integration Guide for AI Implementation

## Overview

This document provides comprehensive guidance for integrating LocalFirecrawl functionality into the existing deep-research-mcp service, converting from JavaScript/TypeScript to Python while maintaining the existing interface and architecture patterns.

## Core Architecture Integration

### **Current Deep Research MCP Structure**
The existing service follows a well-established pattern that must be preserved:

```
src/deep-research-mcp/
├── scraping_service.py     # MODIFY: Replace external firecrawl with local implementation
├── config.py              # MODIFY: Add local firecrawl configuration
├── models.py              # KEEP: Maintain existing SearchDocument model
├── research_engine.py     # KEEP: No changes needed
└── mcp_server.py          # KEEP: No changes needed
```

### **Critical Interface Preservation**
The `ScrapingService` class interface MUST remain unchanged:

```python
class ScrapingService:
    async def search_and_scrape(self, query: str, limit: int = 10, scrape_results: bool = True) -> List[SearchDocument]
    async def scrape_url(self, url: str) -> Optional[SearchDocument]
    async def batch_scrape(self, urls: List[str]) -> List[SearchDocument]
    async def health_check(self) -> bool
```

## LocalFirecrawl Python Architecture

### **Service Components to Implement**

1. **Core Scraping Engine** (`local_firecrawl/scraper.py`)
   - **Purpose**: Main orchestration of scraping operations
   - **Key Dependencies**: playwright, beautifulsoup4, httpx
   - **Pattern**: Async context manager with connection pooling

2. **Browser Service** (`local_firecrawl/browser_service.py`)
   - **Purpose**: Playwright browser automation and pooling
   - **Key Features**: Headless browser pool, JavaScript execution, anti-detection
   - **Pattern**: Browser pool management with lifecycle control

3. **Content Processor** (`local_firecrawl/content_processor.py`)
   - **Purpose**: HTML-to-Markdown conversion and content cleaning
   - **Key Features**: BeautifulSoup parsing, markdown conversion, content validation
   - **Pattern**: Pipeline processing with validation

4. **Search Integration** (`local_firecrawl/search_service.py`)
   - **Purpose**: SearXNG integration for web search
   - **Key Features**: Query processing, result aggregation, source diversity
   - **Pattern**: HTTP client with rate limiting and error handling

## Critical Implementation Patterns

### **1. Async Context Management**
MUST follow the existing pattern from `scraping_service.py`:

```python
class LocalFirecrawlService:
    async def __aenter__(self):
        await self.start()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        await self.close()

    async def start(self):
        # Initialize browser pool, HTTP sessions, etc.
        pass

    async def close(self):
        # Clean up resources
        pass
```

### **2. HTTP Client Configuration**
MUST use the same aiohttp patterns with connection pooling:

```python
connector = aiohttp.TCPConnector(
    limit=self.config.max_concurrent_requests * 2,
    limit_per_host=self.config.max_concurrent_requests,
    ttl_dns_cache=300,
    use_dns_cache=True,
)
self.session = ClientSession(
    connector=connector,
    timeout=self.timeout,
    headers={"User-Agent": "DeepResearchMCP/1.0"},
)
```

### **3. Rate Limiting Pattern**
MUST implement the semaphore + time-based rate limiting:

```python
async def _rate_limit(self):
    """Implement rate limiting with token bucket algorithm."""
    current_time = time.time()
    if current_time - self.last_request_time < self.min_request_interval:
        await asyncio.sleep(self.min_request_interval - (current_time - self.last_request_time))
    self.last_request_time = time.time()

async def scrape_with_rate_limit(self, url: str):
    async with self.semaphore:
        await self._rate_limit()
        return await self._scrape_url_internal(url)
```

### **4. Error Handling and Retry Logic**
MUST maintain the existing exception hierarchy and retry patterns:

```python
# Keep existing exceptions
class FirecrawlError(Exception): pass
class FirecrawlTimeoutError(FirecrawlError): pass
class FirecrawlServiceUnavailableError(FirecrawlError): pass

# Use same retry decorator pattern
@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=1, max=10),
    retry=retry_if_exception_type((ClientError, FirecrawlServiceUnavailableError)),
)
async def scrape_url(self, url: str) -> Optional[SearchDocument]:
    # Implementation
```

## Key Dependencies and Conversions

### **JavaScript to Python Library Mapping**

| JavaScript/TypeScript | Python Equivalent | Purpose |
|----------------------|-------------------|---------|
| Playwright (JS) | playwright | Browser automation |
| Cheerio | BeautifulSoup4 + lxml | HTML parsing |
| Express.js | FastAPI | HTTP server (internal use) |
| Puppeteer | playwright | Browser automation alternative |
| Axios | httpx / aiohttp | HTTP client |
| Node.js streams | asyncio + aiofiles | Async I/O operations |

### **Python Dependencies to Add**
```python
# Core scraping
playwright>=1.40.0
beautifulsoup4>=4.12.0
lxml>=4.9.0
html2text>=2020.1.16

# HTTP and async
httpx>=0.25.0
aiohttp>=3.9.0
aiofiles>=23.0.0

# Content processing
markdownify>=0.11.6
readability>=0.3.1
```

## Configuration Integration

### **Extend Existing Settings**
MODIFY `config.py` to add LocalFirecrawl configuration:

```python
class ResearchMCPSettings(BaseSettings):
    # Existing settings preserved...

    # LocalFirecrawl settings
    local_firecrawl_enabled: bool = Field(default=True)
    browser_pool_size: int = Field(default=3, ge=1, le=10)
    browser_timeout: int = Field(default=30, ge=10, le=120)
    content_max_length: int = Field(default=50000, ge=1000)

    # Search integration
    searxng_base_url: str = Field(default="http://localhost:8080")
    search_timeout: int = Field(default=10, ge=5, le=30)

    # Rate limiting
    max_concurrent_browsers: int = Field(default=3, ge=1, le=5)
    min_request_interval: float = Field(default=1.0, ge=0.1, le=5.0)
```

## Critical Gotchas and Library Quirks

### **1. Playwright Browser Management**
- **GOTCHA**: Browsers must be properly closed to avoid memory leaks
- **SOLUTION**: Use context managers and proper cleanup in `__aexit__`
- **PATTERN**: Browser pool with lifecycle management

### **2. BeautifulSoup Parser Selection**
- **GOTCHA**: Default parser is inconsistent across systems
- **SOLUTION**: Always specify `lxml` parser explicitly
- **CODE**: `BeautifulSoup(html, "lxml")`

### **3. Content Length Validation**
- **GOTCHA**: Very large pages can cause memory issues
- **SOLUTION**: Implement content length limits and streaming
- **PATTERN**: Check content-length header before downloading

### **4. JavaScript Execution Timing**
- **GOTCHA**: Dynamic content may not be fully loaded
- **SOLUTION**: Wait for specific elements or network idle
- **CODE**: `await page.wait_for_load_state("networkidle")`

### **5. Anti-Detection Measures**
- **GOTCHA**: Some sites block headless browsers
- **SOLUTION**: Randomize user agents, add delays, use stealth mode
- **PATTERN**: Rotate browser fingerprints and request patterns

## Performance Optimization

### **1. Browser Pool Management**
- Keep warm browser instances for faster page loads
- Implement browser recycling after N requests
- Use browser contexts for isolation without full browser restart

### **2. Content Caching**
- Cache parsed content with TTL
- Implement content deduplication
- Use Redis for distributed caching

### **3. Connection Management**
- Reuse HTTP connections with session pooling
- Implement connection keep-alive
- Use appropriate connection limits per host

## Testing Strategy

### **1. Unit Tests**
- Mock browser interactions with `playwright-mock`
- Test content processing with fixed HTML samples
- Validate rate limiting with timing assertions

### **2. Integration Tests**
- Test against local SearXNG instance
- Validate full scraping pipeline
- Test error handling and retry logic

### **3. Performance Tests**
- Concurrent scraping load testing
- Memory usage monitoring
- Browser pool efficiency testing

## Security Considerations

### **1. Content Validation**
- Sanitize all scraped content
- Validate URLs before processing
- Implement content-type checking

### **2. Resource Limits**
- Enforce request timeouts
- Limit concurrent operations
- Monitor resource usage

### **3. Privacy and Legal**
- Respect robots.txt files
- Implement proper rate limiting
- Add user-agent identification

## Common Pitfalls to Avoid

1. **❌ NOT using browser pools** - Each request would create new browser instance
2. **❌ NOT implementing proper cleanup** - Memory leaks from unclosed browsers
3. **❌ NOT handling JavaScript timeouts** - Pages may not fully load
4. **❌ NOT validating content length** - Large pages can cause OOM errors
5. **❌ NOT implementing rate limiting** - Getting blocked by target sites
6. **❌ NOT using async context managers** - Resource leaks and improper cleanup
7. **❌ NOT maintaining interface compatibility** - Breaking existing integrations

## Success Metrics

- **Performance**: Same or better scraping speed as external firecrawl
- **Reliability**: 99%+ success rate for accessible URLs
- **Resource Usage**: Efficient memory and CPU utilization
- **Interface Compatibility**: Zero breaking changes to existing API
- **Test Coverage**: 90%+ code coverage with comprehensive test suite

This integration guide provides the comprehensive context needed for successful LocalFirecrawl implementation while maintaining the existing deep-research-mcp architecture and patterns.
