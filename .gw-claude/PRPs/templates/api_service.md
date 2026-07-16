name: "API Service PRP Template - REST/GraphQL with Performance and Security Standards"
description: |
  Comprehensive PRP template for API services including REST APIs, GraphQL APIs, and microservices.
  Supports both greenfield and brownfield scenarios with authentication, performance optimization, and security validation.

---

## Goal

**Feature Goal**: [Specific API functionality - user management API, data processing service, integration layer, etc.]

**Deliverable**: [Complete API service with endpoints, authentication, data persistence, and deployment configuration]

**Success Definition**:
- API endpoints respond within specified SLA times (target: <200ms for simple queries, <2s for complex operations)
- Comprehensive API documentation available and accurate
- Security validation passes (authentication, authorization, input validation)
- Database operations optimized for performance and scalability
- Error handling provides clear, actionable responses
- [Additional success criteria specific to the API service]

## User Persona

**Target User**: [API consumers - frontend developers, mobile developers, third-party integrations, etc.]

**Use Case**: [Primary scenarios when the API will be consumed]

**Integration Journey**: [How developers will discover, authenticate, and integrate with the API]

**Pain Points Addressed**: [Specific integration challenges this API service solves]

## Why

- [Business value and system integration benefits]
- [Performance improvements and scalability advantages]
- [Security enhancements and compliance requirements]
- [Developer experience improvements and ecosystem expansion]

## What

[API behavior, endpoint specifications, data models, and technical requirements]

### Success Criteria

- [ ] All endpoints respond with proper HTTP status codes and error messages
- [ ] Authentication and authorization work securely across all endpoints
- [ ] Database queries optimized for performance at expected scale
- [ ] Input validation prevents injection attacks and data corruption
- [ ] API documentation complete and automatically updated
- [ ] Rate limiting and throttling implemented appropriately
- [ ] Monitoring and logging provide operational visibility
- [ ] [Additional project-specific criteria]

## All Needed Context

### Context Completeness Check

_Before implementing this API service, validate: "If someone knew nothing about API development or this codebase, would they have everything needed to build a production-ready, secure, and performant API service successfully?"_

### Brownfield API Service Considerations
- **Existing API Framework**: [FastAPI, Express.js, Django REST, Spring Boot version and configuration]
- **Current Database Schema**: [PostgreSQL, MongoDB, MySQL schema and ORM/ODM setup]
- **Existing Authentication System**: [JWT, OAuth, session-based auth implementation]
- **Current API Versioning Strategy**: [URL versioning, header versioning, or other approach]
- **Existing Deployment and Monitoring**: [Docker, Kubernetes, logging, metrics setup]
- **Current Rate Limiting**: [Redis-based, in-memory, or cloud provider rate limiting]
- **Existing Documentation**: [OpenAPI/Swagger, API Blueprint, or other documentation system]
- **Database Migration Strategy**: [Existing migration tools and versioning approach]

### Documentation & References

```yaml
# API Design Standards
- url: https://restfulapi.net/
  why: RESTful API design principles and best practices
  critical: Resource naming, HTTP method usage, status code standards

- url: https://owasp.org/www-project-api-security/
  why: API security best practices and vulnerability prevention
  section: Top 10 API Security Risks and mitigation strategies

# Framework-Specific Documentation
- url: [FastAPI/Express/Django docs URL with specific sections]
  why: [Request/response handling, middleware, dependency injection]
  critical: [Authentication middleware, error handling, performance optimization]

# Database Integration Patterns
- file: src/models/[existing_model].py
  why: Established ORM patterns and database connection handling
  pattern: Model definition, relationship mapping, query optimization
  gotcha: Connection pooling, transaction management, migration patterns

# Authentication and Authorization
- file: src/auth/[auth_middleware].py
  why: Current authentication flow and token validation
  pattern: JWT handling, role-based access control, session management
  gotcha: Token refresh, rate limiting, security headers

# API Documentation Patterns
- file: docs/api/[existing_spec].yaml
  why: OpenAPI specification format and documentation standards
  pattern: Endpoint documentation, schema definitions, example requests
  gotcha: Versioning strategy, deprecation notices, client SDK generation
```

### Current Codebase Tree

```bash
# Run `tree -I '__pycache__|node_modules|*.pyc' -L 3` to understand existing structure
```

### Desired API Service Structure

```bash
src/
├── api/                    # API layer (routes, controllers)
│   ├── v1/                # API version 1 endpoints
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management endpoints
│   │   └── [feature]/     # Feature-specific endpoints
│   ├── middleware/        # Request/response middleware
│   └── dependencies/      # Dependency injection and shared logic
├── models/                # Data models and database schemas
│   ├── [entity].py        # Database models with relationships
│   └── schemas.py         # Pydantic/validation schemas
├── services/              # Business logic layer
│   ├── [entity]_service.py # Core business operations
│   └── external/          # External service integrations
├── database/              # Database configuration and migrations
│   ├── migrations/        # Database schema migrations
│   ├── connection.py      # Database connection and session management
│   └── base.py            # Base model classes and configurations
├── auth/                  # Authentication and authorization
│   ├── jwt.py            # JWT token handling
│   ├── permissions.py     # Role-based access control
│   └── middleware.py      # Authentication middleware
├── utils/                 # Helper functions and utilities
│   ├── validation.py      # Input validation helpers
│   ├── encryption.py      # Security utilities
│   └── logging.py         # Structured logging setup
└── tests/                 # Comprehensive test suite
    ├── unit/              # Unit tests for individual components
    ├── integration/       # API integration tests
    └── fixtures/          # Test data and fixtures

config/
├── settings.py            # Environment-specific configuration
├── database.py            # Database configuration
└── security.py           # Security configuration and secrets

deployment/
├── docker/                # Container configuration
├── kubernetes/            # K8s deployment manifests
└── monitoring/            # Logging and metrics configuration
```

### Known API Development Gotchas & Framework Quirks

```python
# CRITICAL: FastAPI requires async/await for optimal performance with databases
# CRITICAL: Express.js middleware order affects request processing
# CRITICAL: Django REST requires proper serializer validation for security

# Database Performance Gotchas
# N+1 query problem - use select_related() or include relationships
# Connection pooling required for production - configure max connections
# Database migrations need rollback strategies for production deployments

# Authentication Security
# JWT secrets must be cryptographically secure and rotated
# Rate limiting must be implemented at both application and infrastructure levels
# Input validation must happen before business logic processing

# API Versioning Considerations
# Breaking changes require new API version with deprecation strategy
# Schema evolution needs backward compatibility for existing clients
# Documentation must be versioned alongside API changes
```

## Implementation Blueprint

### Data Models and API Schema Structure

Create robust data models with proper validation and database optimization.

```python
# Database Models (SQLAlchemy example)
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships with proper lazy loading
    profile = relationship("UserProfile", back_populates="user", lazy="select")

# API Schemas (Pydantic example)
class UserCreateRequest(BaseModel):
    email: EmailStr
    password: SecretStr

    @validator('password')
    def validate_password_strength(cls, v):
        # Password complexity validation
        return v

class UserResponse(BaseModel):
    id: UUID
    email: str
    created_at: datetime

    class Config:
        orm_mode = True  # Enable ORM object serialization

# GraphQL Schema (if using GraphQL)
type User {
  id: ID!
  email: String!
  createdAt: DateTime!
  profile: UserProfile
}
```

### Implementation Tasks (API Service Specific)

```yaml
Task 1: CREATE src/models/[entity]_models.py
  - IMPLEMENT: Database models with proper relationships and constraints
  - FOLLOW pattern: Existing model definitions and naming conventions
  - FEATURES: Primary keys, foreign keys, indexes, validation constraints
  - OPTIMIZATION: Database indexes for query performance
  - PLACEMENT: Models directory with clear entity separation

Task 2: CREATE src/api/v1/[entity]/routes.py
  - IMPLEMENT: RESTful endpoints with proper HTTP methods and status codes
  - FOLLOW pattern: Existing route structure and response formatting
  - FEATURES: CRUD operations, filtering, pagination, sorting
  - VALIDATION: Input validation using Pydantic or equivalent
  - PLACEMENT: API version directory with resource-based organization

Task 3: CREATE src/services/[entity]_service.py
  - IMPLEMENT: Business logic layer with database operations
  - FOLLOW pattern: Existing service patterns and error handling
  - FEATURES: Create, read, update, delete operations with business rules
  - OPTIMIZATION: Efficient database queries and transaction management
  - PLACEMENT: Services directory for business logic isolation

Task 4: CREATE src/auth/authentication.py
  - IMPLEMENT: Authentication middleware and token validation
  - FOLLOW pattern: Existing authentication patterns and security practices
  - FEATURES: JWT token validation, role-based access control, rate limiting
  - SECURITY: Secure token storage, refresh token handling, session management
  - PLACEMENT: Authentication directory for security-related code

Task 5: CREATE src/database/migrations/[timestamp]_[description].py
  - IMPLEMENT: Database schema migrations with rollback capability
  - FOLLOW pattern: Existing migration patterns and naming conventions
  - FEATURES: Schema changes, index creation, data migrations
  - SAFETY: Rollback procedures, backup requirements, zero-downtime migrations
  - PLACEMENT: Database migrations directory with chronological ordering

Task 6: CREATE docs/api/openapi.yaml
  - IMPLEMENT: Comprehensive API documentation with examples
  - FOLLOW pattern: Existing documentation standards and formatting
  - FEATURES: Endpoint documentation, schema definitions, authentication flows
  - ACCURACY: Synchronized with actual API implementation
  - PLACEMENT: Documentation directory for developer reference

Task 7: CREATE src/middleware/[security|logging|cors].py
  - IMPLEMENT: Request/response middleware for cross-cutting concerns
  - FOLLOW pattern: Existing middleware patterns and configuration
  - FEATURES: Security headers, request logging, CORS handling, rate limiting
  - PERFORMANCE: Efficient processing without adding significant latency
  - PLACEMENT: Middleware directory for shared request processing

Task 8: CREATE tests/integration/test_[entity]_api.py
  - IMPLEMENT: Integration tests for all API endpoints
  - FOLLOW pattern: Existing test structure and assertion patterns
  - COVERAGE: Happy path, error cases, edge conditions, security scenarios
  - AUTOMATION: Automated test execution in CI/CD pipeline
  - PLACEMENT: Tests directory with clear test type organization
```

### API Service Implementation Patterns

```python
# RESTful Endpoint Pattern
@router.post("/users", response_model=UserResponse, status_code=201)
async def create_user(
    user_data: UserCreateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # SECURITY: Input validation and authorization
    # PATTERN: Service layer delegation for business logic
    # ERROR HANDLING: Consistent error response format

    try:
        user = await user_service.create_user(db, user_data)
        return UserResponse.from_orm(user)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Service Layer Pattern
class UserService:
    async def create_user(self, db: Session, user_data: UserCreateRequest) -> User:
        # VALIDATION: Business rule validation
        # OPTIMIZATION: Efficient database operations
        # TRANSACTION: Proper transaction handling

        async with db.begin():
            user = User(**user_data.dict(exclude={'password'}))
            user.password_hash = hash_password(user_data.password)
            db.add(user)
            await db.commit()
            return user

# Authentication Middleware Pattern
async def verify_jwt_token(request: Request):
    # SECURITY: Token validation and expiry checking
    # PERFORMANCE: Efficient token verification
    # ERROR HANDLING: Clear authentication error responses

    token = request.headers.get("Authorization")
    if not token or not token.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid token")

    try:
        payload = jwt.decode(token[7:], SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
```

### Integration Points

```yaml
DATABASE:
  - connection: "PostgreSQL/MongoDB connection with pooling configuration"
  - migrations: "Automated schema migrations with rollback capability"
  - optimization: "Query optimization and index management"

AUTHENTICATION:
  - jwt: "JSON Web Token implementation with refresh token support"
  - oauth: "OAuth2 integration for third-party authentication"
  - rbac: "Role-based access control with permission management"

EXTERNAL_SERVICES:
  - apis: "Third-party API integrations with circuit breaker patterns"
  - cache: "Redis caching for performance optimization"
  - queue: "Message queue integration for asynchronous processing"

MONITORING:
  - logging: "Structured logging with correlation IDs"
  - metrics: "Performance metrics and health check endpoints"
  - tracing: "Distributed tracing for microservice architectures"

DOCUMENTATION:
  - openapi: "OpenAPI specification with interactive documentation"
  - sdk: "Client SDK generation for multiple programming languages"
  - examples: "Comprehensive usage examples and tutorials"
```

## Validation Loop

### Level 1: API Development Validation

```bash
# Code quality and type checking
ruff check src/ --fix              # Python linting
mypy src/                          # Type checking
pytest src/ --cov=src --cov-fail-under=80  # Test coverage

# API validation
uvicorn main:app --reload          # Development server
curl http://localhost:8000/health  # Health check endpoint

# Database validation
alembic upgrade head               # Run migrations
psql $DATABASE_URL -c "SELECT 1;" # Database connection test

# Expected: No linting errors, type safety verified, tests passing, server responding
```

### Level 2: API Integration Testing

```bash
# Unit and integration tests
pytest tests/unit/ -v              # Unit tests
pytest tests/integration/ -v       # Integration tests
pytest tests/security/ -v          # Security tests

# API contract testing
newman run api_tests.postman_collection.json  # Postman/Newman API tests
# or
pytest tests/contract/ -v          # Contract testing with pact

# Performance testing
locust -f tests/performance/locustfile.py  # Load testing

# Expected: All tests pass, API contracts validated, performance benchmarks met
```

### Level 3: Security and Compliance Validation

```bash
# Security scanning
bandit -r src/                     # Security vulnerability scanning
safety check                      # Dependency vulnerability check

# API security testing
zap-baseline.py -t http://localhost:8000  # OWASP ZAP security testing
sqlmap -u "http://localhost:8000/api/users?id=1"  # SQL injection testing

# Authentication testing
pytest tests/auth/ -v              # Authentication and authorization tests

# Input validation testing
pytest tests/validation/ -v        # Input sanitization and validation tests

# Expected: No security vulnerabilities, authentication working, input validation effective
```

### Level 4: Production Readiness Validation

```bash
# Documentation validation
swagger-codegen validate -i docs/api/openapi.yaml  # OpenAPI spec validation
redoc-cli build docs/api/openapi.yaml  # Documentation generation

# Performance benchmarking
ab -n 1000 -c 10 http://localhost:8000/api/users  # Apache Bench load testing
wrk -t12 -c400 -d30s http://localhost:8000/api/users  # Modern HTTP benchmarking

# Database performance
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';  # Query analysis

# Monitoring validation
curl http://localhost:8000/metrics  # Prometheus metrics endpoint
curl http://localhost:8000/health   # Health check with database connectivity

# Container validation
docker build -t api-service .      # Container build
docker run --rm api-service pytest  # Tests in containerized environment

# Expected: Production-ready performance, monitoring configured, containerization working
```

## Final Validation Checklist

### Technical Validation (API-Specific)

- [ ] All endpoints respond with appropriate HTTP status codes
- [ ] Input validation prevents malformed or malicious requests
- [ ] Database queries optimized and indexed appropriately
- [ ] Authentication and authorization working across all endpoints
- [ ] Rate limiting implemented and tested
- [ ] Error handling provides clear, actionable error messages
- [ ] API documentation complete and synchronized with implementation

### Performance Validation (API Service)

- [ ] Response times meet SLA requirements under expected load
- [ ] Database connection pooling configured for concurrent users
- [ ] Caching implemented for frequently accessed data
- [ ] Pagination implemented for large result sets
- [ ] Query optimization verified with EXPLAIN ANALYZE
- [ ] Memory usage and garbage collection optimized
- [ ] Horizontal scaling capability verified

### Security Validation (API Service)

- [ ] All inputs validated and sanitized
- [ ] SQL injection and NoSQL injection prevention verified
- [ ] Cross-Site Scripting (XSS) protection implemented
- [ ] Cross-Origin Resource Sharing (CORS) configured appropriately
- [ ] Security headers implemented (HSTS, CSP, etc.)
- [ ] Sensitive data encrypted in transit and at rest
- [ ] Authentication tokens secured and rotated appropriately

### Operational Readiness (API Service)

- [ ] Comprehensive logging with correlation IDs
- [ ] Monitoring and alerting configured for key metrics
- [ ] Health check endpoints implemented for load balancers
- [ ] Database migration procedures tested and documented
- [ ] Backup and recovery procedures verified
- [ ] Deployment automation tested in staging environment
- [ ] Rollback procedures documented and tested

---

## API Service Anti-Patterns to Avoid

### Design Anti-Patterns
- ❌ Don't expose internal database structure directly in API responses
- ❌ Don't use GET requests for operations that modify data
- ❌ Don't ignore HTTP status code semantics
- ❌ Don't create overly chatty APIs requiring multiple requests

### Security Anti-Patterns
- ❌ Don't store passwords in plain text or weak encryption
- ❌ Don't skip input validation on server side
- ❌ Don't expose stack traces or internal errors to API consumers
- ❌ Don't implement custom cryptography - use proven libraries

### Performance Anti-Patterns
- ❌ Don't ignore database query optimization
- ❌ Don't implement synchronous processing for long-running operations
- ❌ Don't skip connection pooling in production
- ❌ Don't return unlimited result sets without pagination

### Operational Anti-Patterns
- ❌ Don't deploy without proper monitoring and logging
- ❌ Don't skip database migration testing
- ❌ Don't ignore API versioning for breaking changes
- ❌ Don't skip automated testing in CI/CD pipelines
