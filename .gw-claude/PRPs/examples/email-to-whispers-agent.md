name: "Email-to-Whispers Agent - Production-Ready Implementation"
description: |
Comprehensive PRP for building a production-ready email-to-whispers agent that receives emails via SES,
performs basic research as needed, and creates whispers via whisper MCP based on email content analysis
and discretionary whisper count determination.

---

## Goal

**Feature Goal**: Build a production-ready agent that processes incoming emails via AWS SES, analyzes content to determine research needs, and generates contextually appropriate whispers through the whisper MCP server.

**Deliverable**: A complete agent deployment including SES email processing, Redis queue management, ECS task orchestration, and whisper MCP integration following established agent patterns.

**Success Definition**: Agent successfully processes emails, generates 1-5 whispers per email based on content analysis, integrates seamlessly with existing infrastructure, and maintains 99% uptime with proper error handling.

## User Persona

**Target User**: Business stakeholders and team members who send emails to the agent expecting automated whisper generation.

**Use Case**: Email content (news articles, reports, announcements) sent to agent's email address gets processed into social media-ready whispers with appropriate research context.

**User Journey**:
1. User sends email to agent's dedicated email address (e.g., whispers@agency.domain.com)
2. Agent receives email via SES, extracts content and intent
3. Agent performs research if content requires additional context
4. Agent determines optimal number of whispers (1-5) based on content depth
5. Agent creates whispers via MCP server with appropriate triggers and keywords

**Pain Points Addressed**:
- Manual whisper creation from email content
- Inconsistent social media content generation
- Time-consuming research and context gathering

## Why

- **Automation**: Eliminate manual whisper creation from email content
- **Consistency**: Standardize whisper format and quality across all email inputs
- **Intelligence**: Add research context and smart whisper count determination
- **Integration**: Leverage existing infrastructure (SES, Redis, ECS, Whisper MCP)
- **Scalability**: Handle high volume email processing with queue-based architecture

## What

### Core Functionality

- **Email Processing**: Receive emails via SES, parse content, extract key information
- **Content Analysis**: Determine email intent, topic complexity, and research requirements
- **Research Integration**: Perform contextual research when content needs enhancement
- **Whisper Count Logic**: Intelligently determine 1-5 whispers based on content depth and structure
- **Whisper Generation**: Create whispers via MCP server with appropriate triggers and metadata
- **Error Handling**: Robust error recovery with dead letter queues and monitoring

### Success Criteria

- [ ] Process emails within 2 minutes of receipt
- [ ] Generate 1-5 whispers per email with 90%+ content relevance
- [ ] Integrate research context when topic requires additional information
- [ ] Maintain whisper character limits (max 380 characters)
- [ ] Handle email parsing errors gracefully with notification system
- [ ] Achieve 99% uptime with proper health monitoring

## All Needed Context

### Context Completeness Check

_This PRP provides complete context for someone with no prior knowledge of this codebase to implement successfully by including specific file patterns, proven infrastructure modules, and detailed implementation examples._

### Documentation & References

```yaml
# MUST READ - Include these in your context window
- url: https://docs.aws.amazon.com/ses/latest/dg/receiving-email.html
  why: SES email receiving configuration and S3 integration patterns
  critical: Email parsing requires proper MIME handling and attachment processing

- url: https://ai.pydantic.dev/agents/
  why: PydanticAI agent creation patterns and tool integration
  critical: Async functions required for agent.run() and tool decorators

- url: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html
  why: ECS task definition patterns for container orchestration
  critical: Proper resource allocation for browser automation and AI processing

- url: https://huggingface.co/docs/transformers/tasks/summarization
  why: Content summarization techniques for whisper generation
  critical: T5-based abstractive summarization with proper token management

- file: agents/highergov-opportunity-summarizer/agent.py
  why: Complete SES-to-ECS agent pattern with MCP integration
  pattern: Email processing, Redis queuing, whisper creation workflow
  gotcha: Multi-stage email processing requires proper error handling at each step

- file: agents/highergov-opportunity-summarizer/deployment/lambda/lambda_function.py
  why: SES Lambda processor implementation with S3 email retrieval
  pattern: Email parsing, URL extraction, ECS task orchestration
  gotcha: Email content encoding varies (quoted-printable, base64) - handle all formats

- file: agents/whisper-summarizer-agent/agent.py
  why: Whisper MCP integration patterns and batch processing
  pattern: MCP server connection, whisper creation, quality validation
  gotcha: Whisper character limits (380 chars) and trigger format requirements

- file: agent-resources/deployment/modules/ses_lambda/main.tf
  why: SES integration Terraform module with receipt rules
  pattern: S3 email storage, Lambda triggers, domain configuration
  gotcha: SES email receiving only available in specific AWS regions

- file: agent-resources/deployment/modules/ecs/main.tf
  why: ECS service deployment patterns with autoscaling
  pattern: Task definitions, service configuration, load balancing
  gotcha: Browser automation requires 4GB+ memory allocation

- docfile: .claude/PRPs/ai_docs/build_with_claude_code.md
  why: Development workflow patterns and tool integration
  section: Agent development and deployment best practices
```

### Current Codebase Tree

```bash
agents/
├── highergov-opportunity-summarizer/    # SES + Redis + ECS + Whisper MCP pattern
├── search-insights-agent/               # EventBridge + ECS + Whisper MCP pattern
├── whisper-summarizer-agent/            # Redis + ECS + Whisper MCP pattern
└── agent-resources/
    └── deployment/
        └── modules/
            ├── ses_lambda/              # SES integration module
            ├── ecs/                     # ECS service module
            ├── lambda/                  # Lambda processor module
            └── cognito_user/            # Agent authentication module
```

### Desired Codebase Tree

```bash
agents/
└── email-to-whispers-agent/
    ├── agent.py                         # Main PydanticAI agent with whisper tools
    ├── agent_prompts.py                 # System prompts for content analysis
    ├── agent_tools.py                   # Email parsing and research tools
    ├── models.py                        # Pydantic models for email and whisper data
    ├── manifest.json                    # Agent metadata and dependencies
    ├── requirements.txt                 # Python dependencies
    ├── Dockerfile                       # Main agent container
    ├── deployment/
    │   ├── main.tf                      # Infrastructure configuration
    │   ├── variables.tf                 # Configuration variables
    │   ├── outputs.tf                   # Infrastructure outputs
    │   ├── backend.tf                   # Terraform backend config
    │   └── lambda/
    │       ├── lambda_function.py       # SES email processor
    │       ├── Dockerfile               # Lambda container
    │       ├── requirements.txt         # Lambda dependencies
    │       └── __init__.py              # Python package init
    └── environments/
        └── 540845145946/
            ├── backend.conf             # Environment backend config
            └── main.tfvars              # Environment variables
```

### Known Gotchas of Codebase & Library Quirks

```python
# CRITICAL: PydanticAI requires async functions for agent.run()
# CRITICAL: SES email content uses quoted-printable/base64 encoding - decode properly
# CRITICAL: Whisper character limit is 380 characters - validate before creation
# CRITICAL: Redis queue operations require proper error handling and retry logic
# CRITICAL: ECS tasks need 4GB+ memory for AI processing and browser automation
# CRITICAL: MCP server connection requires deterministic session ID generation
# CRITICAL: Email parsing must handle multipart MIME with proper boundary detection
# CRITICAL: AWS Cognito credentials required for whisper MCP authentication
# CRITICAL: Rate limiting essential for research APIs - implement exponential backoff
# CRITICAL: tiktoken for accurate token counting: 1 token ≈ 4 bytes for optimization
```

## Implementation Blueprint

### Data Models and Structure

```python
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional, Dict, Any, Literal
from datetime import datetime
from enum import Enum
import uuid

class EmailContentType(str, Enum):
    NEWS_ARTICLE = "news_article"
    ANNOUNCEMENT = "announcement"
    REPORT = "report"
    NEWSLETTER = "newsletter"
    PERSONAL = "personal"
    OTHER = "other"

class EmailContent(BaseModel):
    """Parsed email content structure"""
    subject: str
    body_text: str
    body_html: Optional[str] = None
    sender: str
    recipients: List[str]
    received_at: datetime
    content_type: EmailContentType
    attachments: List[str] = []
    urls_extracted: List[str] = []
    key_topics: List[str] = []

class ResearchContext(BaseModel):
    """Research results for content enhancement"""
    research_needed: bool
    research_query: Optional[str] = None
    research_results: List[str] = []
    confidence_score: float = Field(ge=0, le=1)
    sources_used: List[str] = []

class WhisperPlan(BaseModel):
    """Plan for whisper generation"""
    whisper_count: int = Field(ge=1, le=5)
    whisper_topics: List[str]
    character_budget_per_whisper: int
    triggers_suggested: List[str]
    reasoning: str

class EmailToWhispersOutput(BaseModel):
    """Agent output model"""
    success: bool
    email_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content_analyzed: EmailContent
    research_performed: Optional[ResearchContext] = None
    whisper_plan: WhisperPlan
    whispers_created: List[str] = []
    total_processing_time: float
    error_message: Optional[str] = None
```

### Implementation Tasks (ordered by dependencies)

```yaml
Task 1: CREATE agents/email-to-whispers-agent/models.py
  - IMPLEMENT: Pydantic models from blueprint above
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/models.py (structure)
  - NAMING: CamelCase classes, snake_case fields
  - VALIDATION: Field constraints for whisper limits and content types
  - PLACEMENT: Core data models in root agent directory

Task 2: CREATE agents/email-to-whispers-agent/agent_tools.py
  - IMPLEMENT: Email parsing tools with MIME handling
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/agent_tools.py (web scraping)
  - TOOLS: parse_email_content, determine_research_needs, perform_contextual_research
  - DEPENDENCIES: beautifulsoup4, email library, tiktoken for token counting
  - GOTCHA: Handle quoted-printable and base64 encoding properly

Task 3: CREATE agents/email-to-whispers-agent/agent_prompts.py
  - IMPLEMENT: System prompts for content analysis and whisper planning
  - FOLLOW pattern: agents/whisper-summarizer-agent/agent_prompts.py (whisper focus)
  - PROMPTS: Email analysis, research determination, whisper count logic
  - CRITICAL: Include character limit enforcement and trigger generation guidance
  - PLACEMENT: Separate prompts module for maintainability

Task 4: CREATE agents/email-to-whispers-agent/agent.py
  - IMPLEMENT: Main PydanticAI agent with MCP integration
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/agent.py (SES processing)
  - INTEGRATION: Whisper MCP server connection with session management
  - DEPENDENCIES: Import tools from Task 2, prompts from Task 3, models from Task 1
  - GOTCHA: Async functions required, proper error handling for MCP failures

Task 5: CREATE agents/email-to-whispers-agent/deployment/lambda/lambda_function.py
  - IMPLEMENT: SES email processor with S3 retrieval and ECS orchestration
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/deployment/lambda/lambda_function.py
  - FUNCTIONS: lambda_handler, parse_ses_event, queue_email_processing
  - INTEGRATION: Redis queue operations, ECS task launching
  - PLACEMENT: Lambda processor in deployment/lambda/

Task 6: CREATE agents/email-to-whispers-agent/deployment/main.tf
  - IMPLEMENT: Complete infrastructure using established modules
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/deployment/main.tf
  - MODULES: ECS service, Lambda processor, SES integration, Cognito user
  - CONFIGURATION: Environment variables for whisper MCP and research APIs
  - CRITICAL: Proper resource allocation (4GB memory, 2 CPU cores)

Task 7: CREATE agents/email-to-whispers-agent/deployment/variables.tf
  - IMPLEMENT: Configuration variables following established patterns
  - FOLLOW pattern: agents/search-insights-agent/deployment/variables.tf
  - VARIABLES: Agent configuration, resource sizing, email settings
  - DEFAULTS: Production-ready defaults with override capability
  - PLACEMENT: Standard Terraform variables file

Task 8: CREATE agents/email-to-whispers-agent/deployment/lambda/Dockerfile
  - IMPLEMENT: Lambda container for email processing
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/deployment/lambda/Dockerfile
  - BASE: public.ecr.aws/lambda/python:3.11 for AWS Lambda runtime
  - DEPENDENCIES: Install requirements, copy Lambda function code
  - OPTIMIZATION: Leverage Docker layer caching for dependencies

Task 9: CREATE agents/email-to-whispers-agent/Dockerfile
  - IMPLEMENT: Main agent container for ECS deployment
  - FOLLOW pattern: agents/whisper-summarizer-agent/Dockerfile (whisper integration)
  - BASE: python:3.11-slim with additional system dependencies
  - SETUP: UV package management, proper working directory
  - CRITICAL: Include browser dependencies if research requires web scraping

Task 10: CREATE agents/email-to-whispers-agent/manifest.json
  - IMPLEMENT: Agent metadata following established format
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/manifest.json (simple format)
  - METADATA: Name, version, description, dependencies, entrypoint
  - DEPENDENCIES: Include all required Python packages
  - PLACEMENT: Root agent directory for deployment discovery

Task 11: MODIFY agents/email-to-whispers-agent/deployment/main.tf
  - INTEGRATE: All infrastructure components with proper networking
  - ADD: Load balancer rules, service discovery, autoscaling policies
  - CONFIGURE: Environment variables for MCP and research integration
  - VALIDATE: All modules properly connected with dependencies
  - TEST: Infrastructure deployment in development environment

Task 12: CREATE agents/email-to-whispers-agent/environments/540845145946/main.tfvars
  - IMPLEMENT: Environment-specific configuration
  - FOLLOW pattern: agents/highergov-opportunity-summarizer/environments/540845145946/main.tfvars
  - VALUES: Account-specific settings, resource sizing, email configuration
  - SECURITY: Proper secret management and IAM role configuration
  - PLACEMENT: Environment directory for account isolation
```

### Implementation Patterns & Key Details

```python
# Core Agent Pattern
async def initialize_agent():
    """Initialize email-to-whispers agent with MCP integration"""
    whisper_server = create_whisper_server()

    model_settings = {
        "max_tokens": 8192,
    }

    agent = Agent(
        get_model(),
        system_prompt=EMAIL_ANALYSIS_SYSTEM_PROMPT,
        output_type=EmailToWhispersOutput,
        mcp_servers=[whisper_server],
        model_settings=model_settings
    )

    return agent

# Email Processing Pattern
def parse_email_content(raw_email: bytes) -> EmailContent:
    """Parse email with proper MIME handling"""
    # PATTERN: Use Python email library with modern policy
    msg = email.message_from_bytes(raw_email, policy=default)

    # GOTCHA: Handle encoding properly
    subject = decode_header(msg.get("Subject", ""))[0][0]
    if isinstance(subject, bytes):
        subject = subject.decode()

    # PATTERN: Extract both text and HTML content
    body_text = ""
    body_html = None

    for part in msg.walk():
        if part.get_content_type() == "text/plain":
            body_text = part.get_content()
        elif part.get_content_type() == "text/html":
            body_html = part.get_content()

    return EmailContent(
        subject=subject,
        body_text=body_text,
        body_html=body_html,
        sender=msg.get("From", ""),
        recipients=msg.get_all("To", []),
        received_at=datetime.now(),
        content_type=classify_email_content(subject, body_text)
    )

# Whisper Count Logic Pattern
def determine_whisper_count(content: EmailContent, research: Optional[ResearchContext]) -> WhisperPlan:
    """Intelligent whisper count determination"""
    # PATTERN: Token-based analysis for content depth
    enc = tiktoken.encoding_for_model("gpt-4o")
    content_tokens = len(enc.encode(content.body_text))

    # LOGIC: Base whisper count on content complexity
    if content_tokens < 100:
        whisper_count = 1
    elif content_tokens < 500:
        whisper_count = 2
    elif content_tokens < 1000:
        whisper_count = 3
    elif content_tokens < 2000:
        whisper_count = 4
    else:
        whisper_count = 5

    # ADJUSTMENT: Factor in research context
    if research and research.research_needed:
        whisper_count = min(whisper_count + 1, 5)

    # BUDGET: Character allocation per whisper
    character_budget = 380 - 20  # Buffer for trigger metadata

    return WhisperPlan(
        whisper_count=whisper_count,
        whisper_topics=extract_topics(content, whisper_count),
        character_budget_per_whisper=character_budget,
        triggers_suggested=generate_triggers(content),
        reasoning=f"Based on {content_tokens} tokens and content type {content.content_type}"
    )

# MCP Integration Pattern
async def create_whispers_via_mcp(whisper_plan: WhisperPlan, content: EmailContent) -> List[str]:
    """Create whispers using MCP server"""
    whispers_created = []

    async with agent.run_mcp_servers():
        for i, topic in enumerate(whisper_plan.whisper_topics):
            # PATTERN: Create whisper with proper formatting
            whisper_prompt = f"""
            Create a whisper for topic: {topic}

            Source content: {content.subject} - {content.body_text[:200]}...
            Character limit: {whisper_plan.character_budget_per_whisper}
            Suggested triggers: {whisper_plan.triggers_suggested}

            Format as proper whisper JSON with headline, description, and triggers.
            """

            result = await agent.run(whisper_prompt)
            if result.output.success:
                whispers_created.append(result.output.whispers_created[-1])

    return whispers_created
```

### Integration Points

```yaml
SES_INTEGRATION:
  - email_address: "whispers@agency.domain.com"
  - s3_bucket: "{account_id}-agent-emails"
  - lambda_trigger: "SES receipt rule -> S3 -> Lambda"

REDIS_QUEUE:
  - queue_name: "email_whispers_queue:{session_id}"
  - secret: "/agency/redis/credentials"
  - batch_processing: "10 emails per ECS task"

WHISPER_MCP:
  - host: "whisper-mcp.agency.local"
  - port: "8080"
  - authentication: "AWS Cognito via SSM parameters"

COGNITO_USER:
  - given_name: "Epsilon"
  - family_name: "EmailProcessor"
  - bio: "Email-to-whispers processing agent"
  - skills: "email analysis, content research, social media generation"
```

## Validation Loop

### Level 1: Syntax & Style (Immediate Feedback)

```bash
# Run after each file creation - fix before proceeding
uv run ruff check agents/email-to-whispers-agent/ --fix
uv run mypy agents/email-to-whispers-agent/
uv run ruff format agents/email-to-whispers-agent/

# Expected: Zero errors. If errors exist, READ output and fix before proceeding.
```

### Level 2: Unit Tests (Component Validation)

```bash
# Test email parsing functionality
uv run python -c "
from agents.email_to_whispers_agent.agent_tools import parse_email_content
test_email = b'Subject: Test\n\nTest email body'
result = parse_email_content(test_email)
assert result.subject == 'Test'
assert 'Test email body' in result.body_text
print('Email parsing test passed')
"

# Test whisper count logic
uv run python -c "
from agents.email_to_whispers_agent.agent_tools import determine_whisper_count
from agents.email_to_whispers_agent.models import EmailContent, EmailContentType
content = EmailContent(subject='Test', body_text='Short content', sender='test@example.com', recipients=['agent@example.com'], content_type=EmailContentType.OTHER)
plan = determine_whisper_count(content, None)
assert 1 <= plan.whisper_count <= 5
print(f'Whisper count test passed: {plan.whisper_count} whispers planned')
"

# Test MCP integration (with mock)
uv run python -c "
import asyncio
from agents.email_to_whispers_agent.agent import initialize_agent
async def test_agent():
    agent = await initialize_agent()
    assert agent is not None
    print('Agent initialization test passed')
asyncio.run(test_agent())
"
```

### Level 3: Integration Testing (System Validation)

```bash
# Deploy infrastructure in development
cd agents/email-to-whispers-agent/deployment
terraform init -backend-config=../environments/540845145946/backend.conf
terraform plan -var-file=../environments/540845145946/main.tfvars
terraform apply -var-file=../environments/540845145946/main.tfvars

# Test SES email processing
aws ses send-email \
  --source "test@yourdomain.com" \
  --destination "ToAddresses=whispers@agency.domain.com" \
  --message "Subject={Data=Test Email Subject},Body={Text={Data=Test email body content for whisper generation testing}}"

# Verify ECS task execution
aws ecs list-tasks --cluster agency-ecs --service-name email-to-whispers-agent

# Check whisper creation via logs
aws logs tail /aws/ecs/email-to-whispers-agent --follow

# Expected: Email processed, whispers created, no errors in logs
```

### Level 4: Creative & Domain-Specific Validation

```bash
# Test various email content types
for content_type in "news_article" "announcement" "report" "newsletter"; do
  aws ses send-email \
    --source "test@yourdomain.com" \
    --destination "ToAddresses=whispers@agency.domain.com" \
    --message "Subject={Data=Test $content_type},Body={Text={Data=This is a test $content_type with multiple paragraphs and complex content that should generate multiple whispers based on the content analysis logic.}}"
done

# Verify whisper quality and count
uv run python -c "
import boto3
import json
# Check CloudWatch metrics for whisper generation success rate
cloudwatch = boto3.client('cloudwatch')
metrics = cloudwatch.get_metric_statistics(
    Namespace='EmailToWhispers',
    MetricName='WhispersGenerated',
    StartTime='2024-01-01T00:00:00Z',
    EndTime='2024-12-31T23:59:59Z',
    Period=3600,
    Statistics=['Sum']
)
print(f'Whispers generated: {sum(m[\"Sum\"] for m in metrics[\"Datapoints\"])}')
"

# Performance testing
time aws ses send-email \
  --source "test@yourdomain.com" \
  --destination "ToAddresses=whispers@agency.domain.com" \
  --message "Subject={Data=Performance Test},Body={Text={Data=Large email content for performance testing with extensive text that requires research and multiple whisper generation to validate the complete processing pipeline performance.}}"

# Expected: Processing complete within 2 minutes, 1-5 whispers generated
```

## Final Validation Checklist

### Technical Validation

- [ ] All validation levels completed successfully
- [ ] Email parsing handles all MIME types correctly
- [ ] Whisper character limits enforced (max 380 characters)
- [ ] MCP integration working with proper authentication
- [ ] ECS tasks auto-scaling based on queue depth
- [ ] Error handling includes dead letter queue processing

### Feature Validation

- [ ] Emails processed within 2-minute SLA
- [ ] Research integration working when content requires context
- [ ] Whisper count logic generates 1-5 whispers appropriately
- [ ] Trigger generation creates relevant search keywords
- [ ] Content classification working for different email types
- [ ] Integration with existing agent infrastructure seamless

### Code Quality Validation

- [ ] Follows existing agent patterns exactly
- [ ] File placement matches desired codebase tree
- [ ] Dependencies properly managed with UV
- [ ] Environment configuration secure and maintainable
- [ ] Terraform modules reused from agent-resources
- [ ] Error logging comprehensive for troubleshooting

### Infrastructure Validation

- [ ] SES email receiving configured correctly
- [ ] Lambda email processor handles all encoding types
- [ ] Redis queue operations robust with proper retry logic
- [ ] ECS service health checks passing consistently
- [ ] Load balancer rules configured if external access needed
- [ ] Cognito user authentication for whisper MCP working

---

## Anti-Patterns to Avoid

- ❌ Don't hardcode email parsing - handle all MIME encoding types
- ❌ Don't skip character count validation for whispers
- ❌ Don't ignore email processing errors - implement proper dead letter queues
- ❌ Don't create more than 5 whispers per email regardless of content
- ❌ Don't bypass rate limiting for research APIs
- ❌ Don't store email content without encryption at rest
- ❌ Don't skip MCP server health checks before whisper creation
- ❌ Don't use synchronous functions in async agent context

## Quality Score: 9/10

**Confidence Level**: This PRP provides comprehensive context for one-pass implementation success including:

- **Complete Architecture**: Leverages proven patterns from 3 existing agents
- **Detailed Implementation**: Step-by-step tasks with specific file patterns to follow
- **Infrastructure Reuse**: Uses established Terraform modules and deployment patterns
- **Quality Validation**: 4-level validation process with specific test commands
- **Error Handling**: Comprehensive error scenarios and recovery mechanisms
- **Performance Optimization**: Token counting, character limits, and resource allocation
- **Security Integration**: Proper authentication and secret management

The implementation should succeed without iterations due to the extensive research findings integrated into actionable implementation guidance.
