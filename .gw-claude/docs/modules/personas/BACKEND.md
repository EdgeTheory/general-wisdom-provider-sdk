# Backend Persona Guidelines

## Backend-Focused Development Patterns

When the system detects backend-related keywords or the backend persona is selected, follow these specialized backend patterns and practices.

## Core Backend Principles

### API Design Excellence
- Follow RESTful design principles
- Implement consistent error handling
- Use proper HTTP status codes
- Design for versioning and backwards compatibility

### Data Integrity and Consistency
- Implement proper database transactions
- Design for data validation and constraints
- Plan for data migration and schema evolution
- Consider data backup and recovery strategies

### Performance and Scalability
- Design for horizontal scaling
- Implement efficient database queries
- Use caching strategies appropriately
- Monitor and optimize resource usage

## Backend Architecture Patterns

### API Design Patterns
```python
# RESTful API design with FastAPI
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional

app = FastAPI(
    title="API Service",
    version="1.0.0",
    description="Well-documented API with proper error handling"
)

class UserModel(BaseModel):
    id: Optional[int] = None
    email: str
    name: str
    created_at: Optional[datetime] = None

@app.post("/users", response_model=UserModel, status_code=201)
async def create_user(user: UserModel, db: Session = Depends(get_db)):
    """Create a new user with proper validation and error handling."""
    try:
        # Validate business rules
        if await user_exists(user.email, db):
            raise HTTPException(
                status_code=409,
                detail="User with this email already exists"
            )

        # Create user with transaction
        db_user = await create_user_in_db(user, db)
        return UserModel.from_orm(db_user)

    except ValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"User creation failed: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
```

### Database Patterns
```python
# Repository pattern for data access
class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    async def create(self, user_data: dict) -> User:
        """Create user with proper transaction handling."""
        try:
            db_user = User(**user_data)
            self.db.add(db_user)
            await self.db.commit()
            await self.db.refresh(db_user)
            return db_user
        except Exception:
            await self.db.rollback()
            raise

    async def get_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID with efficient querying."""
        return await self.db.query(User).filter(User.id == user_id).first()

    async def list_users(
        self,
        skip: int = 0,
        limit: int = 100,
        filters: Optional[dict] = None
    ) -> List[User]:
        """List users with pagination and filtering."""
        query = self.db.query(User)

        if filters:
            for key, value in filters.items():
                if hasattr(User, key):
                    query = query.filter(getattr(User, key) == value)

        return await query.offset(skip).limit(limit).all()
```

### Service Layer Patterns
```python
# Business logic separation
class UserService:
    def __init__(self, user_repo: UserRepository, email_service: EmailService):
        self.user_repo = user_repo
        self.email_service = email_service

    async def create_user(self, user_data: dict) -> User:
        """Create user with business logic validation."""
        # Business rule validation
        await self._validate_user_data(user_data)

        # Create user
        user = await self.user_repo.create(user_data)

        # Send welcome email (async)
        await self.email_service.send_welcome_email(user.email)

        # Log user creation
        logger.info(f"User created: {user.id}")

        return user

    async def _validate_user_data(self, user_data: dict):
        """Validate business rules for user creation."""
        if not user_data.get('email'):
            raise ValueError("Email is required")

        if await self.user_repo.email_exists(user_data['email']):
            raise ValueError("Email already exists")
```

## Backend Validation Patterns

### Backend-Specific Validation Commands
```bash
# Python/FastAPI specific validation
python -m pytest tests/ -v              # Run all tests
python -m pytest tests/test_api.py -v   # API endpoint tests
python -m pytest tests/test_models.py -v # Model validation tests

# Database validation
python -m alembic check                  # Database migration validation
python -m alembic upgrade head           # Apply migrations
python -c "from app.database import engine; engine.execute('SELECT 1')" # DB connection test

# API validation
python -m pytest tests/test_integration.py -v # Integration tests
curl -X GET http://localhost:8000/health # Health check endpoint

# Performance validation
python -m locust -f locustfile.py --host=http://localhost:8000 # Load testing
```

### Backend Quality Checklist
- [ ] **API Documentation**: OpenAPI/Swagger documentation complete
- [ ] **Error Handling**: Consistent error responses and logging
- [ ] **Validation**: Input validation and business rule enforcement
- [ ] **Security**: Authentication, authorization, and input sanitization
- [ ] **Performance**: Database query optimization and caching
- [ ] **Testing**: Unit, integration, and load testing
- [ ] **Monitoring**: Health checks, metrics, and logging
- [ ] **Database**: Proper indexing, migrations, and backups

## Database Design Patterns

### Schema Design
```python
# SQLAlchemy model design
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="user")

    # Indexes for common queries
    __table_args__ = (
        Index('idx_user_email_created', 'email', 'created_at'),
    )

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Integer, nullable=False)  # Store as cents
    status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="orders")

    # Indexes for common queries
    __table_args__ = (
        Index('idx_order_user_status', 'user_id', 'status'),
        Index('idx_order_created', 'created_at'),
    )
```

### Migration Patterns
```python
# Alembic migration example
"""Add user profile fields

Revision ID: 001_add_profile_fields
Revises: base
Create Date: 2024-01-01 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers
revision = '001_add_profile_fields'
down_revision = 'base'
branch_labels = None
depends_on = None

def upgrade():
    # Add new columns with appropriate defaults
    op.add_column('users', sa.Column('phone', sa.String(20), nullable=True))
    op.add_column('users', sa.Column('bio', sa.Text, nullable=True))

    # Add index for new searchable field
    op.create_index('idx_user_phone', 'users', ['phone'])

def downgrade():
    # Remove in reverse order
    op.drop_index('idx_user_phone', table_name='users')
    op.drop_column('users', 'bio')
    op.drop_column('users', 'phone')
```

## Caching Strategies

### Redis Caching Patterns
```python
# Caching service implementation
import redis
import json
from typing import Optional, Any

class CacheService:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.default_ttl = 3600  # 1 hour

    async def get(self, key: str) -> Optional[Any]:
        """Get cached value with JSON deserialization."""
        try:
            value = await self.redis.get(key)
            return json.loads(value) if value else None
        except (json.JSONDecodeError, Exception):
            return None

    async def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set cached value with JSON serialization."""
        try:
            serialized_value = json.dumps(value)
            return await self.redis.setex(
                key,
                ttl or self.default_ttl,
                serialized_value
            )
        except Exception:
            return False

    async def invalidate_pattern(self, pattern: str):
        """Invalidate multiple keys matching pattern."""
        keys = await self.redis.keys(pattern)
        if keys:
            await self.redis.delete(*keys)
```

## Background Job Patterns

### Celery Task Patterns
```python
# Background job processing
from celery import Celery
from typing import Dict, Any

celery_app = Celery('tasks', broker='redis://localhost:6379')

@celery_app.task(bind=True, max_retries=3)
def send_email_task(self, user_id: int, email_type: str, context: Dict[str, Any]):
    """Send email with retry logic and error handling."""
    try:
        user = get_user_by_id(user_id)
        if not user:
            raise ValueError(f"User {user_id} not found")

        email_service = EmailService()
        email_service.send_email(user.email, email_type, context)

        logger.info(f"Email sent successfully to user {user_id}")

    except Exception as exc:
        logger.error(f"Email sending failed for user {user_id}: {exc}")

        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))

@celery_app.task
def cleanup_expired_sessions():
    """Periodic cleanup task."""
    try:
        count = Session.query.filter(
            Session.expires_at < datetime.utcnow()
        ).delete()

        logger.info(f"Cleaned up {count} expired sessions")

    except Exception as exc:
        logger.error(f"Session cleanup failed: {exc}")
        raise
```

## MCP Integration for Backend

### Context7 for Backend Research
Use Context7 MCP server for:
- Framework documentation (FastAPI, Django, Flask)
- Database best practices and optimization
- API design patterns and standards
- Performance optimization techniques

### Sequential for Complex Backend Logic
Use Sequential MCP server for:
- Multi-step data processing pipelines
- Complex business logic workflows
- Database migration planning
- Performance optimization analysis

## Monitoring and Observability

### Structured Logging
```python
# Structured logging implementation
import structlog
import logging

# Configure structured logging
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.stdlib.add_logger_name,
        structlog.stdlib.add_log_level,
        structlog.stdlib.PositionalArgumentsFormatter(),
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.UnicodeDecoder(),
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)

logger = structlog.get_logger()

# Usage in application code
async def create_user(user_data: dict):
    logger.info(
        "Creating user",
        email=user_data.get('email'),
        user_agent=request.headers.get('user-agent'),
        ip_address=request.client.host
    )

    try:
        user = await user_service.create(user_data)
        logger.info("User created successfully", user_id=user.id)
        return user

    except ValidationError as e:
        logger.warning("User creation validation failed", errors=e.errors())
        raise HTTPException(status_code=422, detail=e.errors())

    except Exception as e:
        logger.error("User creation failed", error=str(e), exc_info=True)
        raise HTTPException(status_code=500, detail="Internal server error")
```

### Health Check Patterns
```python
# Comprehensive health check endpoint
@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Comprehensive health check with dependency validation."""
    health_status = {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "checks": {}
    }

    # Database health check
    try:
        await db_health_check()
        health_status["checks"]["database"] = {"status": "healthy"}
    except Exception as e:
        health_status["checks"]["database"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"

    # Redis health check
    try:
        await redis_health_check()
        health_status["checks"]["redis"] = {"status": "healthy"}
    except Exception as e:
        health_status["checks"]["redis"] = {
            "status": "unhealthy",
            "error": str(e)
        }
        health_status["status"] = "unhealthy"

    # Return appropriate status code
    status_code = 200 if health_status["status"] == "healthy" else 503
    return Response(
        content=json.dumps(health_status),
        status_code=status_code,
        media_type="application/json"
    )
```

## Backend Anti-Patterns to Avoid

### API Design Anti-Patterns
- ❌ **Inconsistent Error Responses**: Standardize error response format
- ❌ **Missing Input Validation**: Always validate and sanitize inputs
- ❌ **Overfetching Data**: Return only necessary data in responses
- ❌ **Missing Rate Limiting**: Implement proper rate limiting
- ❌ **Synchronous External Calls**: Use async patterns for external services

### Database Anti-Patterns
- ❌ **N+1 Query Problem**: Use proper eager loading and joins
- ❌ **Missing Database Indexes**: Index frequently queried columns
- ❌ **Long-Running Transactions**: Keep transactions short and focused
- ❌ **Hardcoded Connection Strings**: Use environment configuration
- ❌ **Missing Migration Strategy**: Plan database schema evolution

### Performance Anti-Patterns
- ❌ **Blocking I/O Operations**: Use async/await for I/O operations
- ❌ **Memory Leaks**: Properly manage connections and resources
- ❌ **Inefficient Caching**: Cache at appropriate levels with proper invalidation
- ❌ **Missing Pagination**: Implement pagination for large datasets
- ❌ **Unoptimized Queries**: Use query analysis and optimization tools
