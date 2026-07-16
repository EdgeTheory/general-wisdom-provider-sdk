# Python Technology Stack

## Core Development Philosophy

### Fundamental Principles
- **KISS (Keep It Simple, Stupid)**: Choose straightforward solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Build only what's needed now, not future speculation
- **Single Responsibility**: Each function/class/module has one clear purpose
- **Fail Fast**: Check errors early, raise exceptions immediately
- **Dependency Inversion**: Depend on abstractions, not implementations

### Additional Design Principles
- **Open/Closed Principle**: Software entities should be open for extension but closed for modification
- **Interface Segregation**: Clients shouldn't be forced to depend on interfaces they don't use
- **Composition over Inheritance**: Favor object composition over class inheritance
- **DRY (Don't Repeat Yourself)**: Every piece of knowledge must have a single representation

## Code Structure & Modularity

### Code Limits
- **Files**: Max 500 lines - split into focused modules when approaching this limit
- **Functions**: Max 50 lines - if longer, extract helper functions
- **Classes**: Max 100 lines - if larger, consider splitting responsibilities
- **Line length**: Max 100 characters (enforced by ruff)
- **Cyclomatic complexity**: Max 10 per function
- **Nesting depth**: Max 4 levels

### Project Architecture
Follow vertical slice architecture with tests living next to the code they test:

```
src/project/
    __init__.py
    main.py                     # Entry point
    config.py                   # Configuration management
    tests/
        test_main.py
        test_config.py

    # Core functionality modules
    database/
        __init__.py
        connection.py           # Database connections
        models.py              # SQLAlchemy/Pydantic models
        repository.py          # Data access patterns
        tests/
            test_connection.py
            test_models.py
            test_repository.py

    # Feature slices (vertical organization)
    features/
        user_management/
            __init__.py
            handlers.py        # HTTP/API handlers
            service.py         # Business logic
            validators.py      # Input validation
            tests/
                test_handlers.py
                test_service.py
                test_validators.py

        payment_processing/
            __init__.py
            processor.py       # Payment logic
            gateway.py         # External integrations
            models.py          # Payment-specific models
            tests/
                test_processor.py
                test_gateway.py

    # Shared utilities
    utils/
        __init__.py
        logging.py             # Logging configuration
        decorators.py          # Common decorators
        exceptions.py          # Custom exceptions
        tests/
            test_decorators.py
```

## Development Environment

### UV Package Management
Fast Python package management. See [UV Docs](https://github.com/astral-sh/uv)

```bash
# Install UV
curl -LsSf https://astral.sh/uv/install.sh | sh

# Core commands
uv venv                    # Create virtual environment
uv sync                    # Sync dependencies
uv add requests           # Add package (NEVER edit pyproject.toml directly)
uv add --dev pytest       # Add dev dependency
uv run python script.py   # Run in environment
```

### Development Commands
```bash
uv run pytest                          # Run tests
uv run pytest --cov=src --cov-report=html  # With coverage
uv run ruff format .                   # Format code
uv run ruff check --fix .              # Lint and fix
uv run mypy src/                       # Type checking
```

## Style & Conventions

### Python Style Guide
- Follow [PEP 8](https://pep8.org/) with 100 character line limit
- Always use type hints - see [PEP 484](https://www.python.org/dev/peps/pep-0484/)
- Format with `ruff format` (faster than Black)
- Use [Pydantic v2](https://docs.pydantic.dev/) for data validation
- Prefer f-strings over `.format()` or `%` formatting
- Use `pathlib.Path` over `os.path` for file operations

### Naming Conventions
- **Variables/functions**: `snake_case` - descriptive names (e.g., `calculate_total_price`)
- **Classes**: `PascalCase` - noun phrases (e.g., `UserAccount`, `PaymentProcessor`)
- **Constants**: `UPPER_SNAKE_CASE` - module level (e.g., `MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Private methods**: `_leading_underscore` - internal use only
- **Type aliases**: `PascalCase` - treat like classes
- **Enum values**: `UPPER_SNAKE_CASE` - like constants

### Type Hints Best Practices
```python
from typing import Optional, Union, List, Dict, Any, Callable, TypeVar, Generic
from collections.abc import Sequence, Mapping
from decimal import Decimal
from datetime import datetime

# Use specific types over Any when possible
def process_items(items: List[Dict[str, Any]]) -> List[str]:  # Avoid
def process_items(items: List[Dict[str, Union[str, int, float]]]) -> List[str]:  # Better

# Use Optional for nullable values
def find_user(user_id: int) -> Optional[User]:
    """Return user if found, None otherwise."""

# Use TypeVar for generic functions
T = TypeVar('T')
def first_or_none(items: Sequence[T]) -> Optional[T]:
    """Return first item or None if empty."""
    return items[0] if items else None

# Use Protocol for duck typing
from typing import Protocol

class Comparable(Protocol):
    def __lt__(self, other: Any) -> bool: ...
    def __eq__(self, other: Any) -> bool: ...
```

### Docstrings
Use [Google style](https://google.github.io/styleguide/pyguide.html#38-comments-and-docstrings) for all public functions, classes, and modules:

```python
def calculate_discount(
    price: Decimal,
    discount_percent: float,
    min_price: Optional[Decimal] = None
) -> Decimal:
    """Calculate discounted price with optional minimum.

    Applies a percentage discount to the given price, ensuring
    the result doesn't go below the minimum price if specified.

    Args:
        price: Original price as Decimal for precision
        discount_percent: Discount percentage (0-100)
        min_price: Optional minimum price floor

    Returns:
        Final price after discount as Decimal

    Raises:
        ValueError: If discount_percent is not between 0 and 100
        ValueError: If price is negative

    Example:
        >>> calculate_discount(Decimal("100.00"), 20.0)
        Decimal('80.00')
        >>> calculate_discount(Decimal("100.00"), 90.0, Decimal("15.00"))
        Decimal('15.00')
    """
    if not 0 <= discount_percent <= 100:
        raise ValueError(f"Discount must be between 0 and 100, got {discount_percent}")
    if price < 0:
        raise ValueError(f"Price cannot be negative, got {price}")

    discounted = price * (Decimal(100 - discount_percent) / 100)

    if min_price is not None:
        return max(discounted, min_price)
    return discounted
```

## Web Frameworks

### FastAPI - Modern API Development
```python
from fastapi import FastAPI, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field, validator
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

app = FastAPI(title="Modern API Service", version="1.0.0")

class UserCreate(BaseModel):
    email: str = Field(..., regex=r'^[^@]+@[^@]+\.[^@]+$')
    name: str = Field(..., min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)

    @validator('email')
    def validate_email(cls, v):
        if not v or '@' not in v:
            raise ValueError('Invalid email format')
        return v.lower()

@app.post("/users/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """Create a new user with email validation."""
    # Check if user exists
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create user
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Send welcome email in background
    background_tasks.add_task(send_welcome_email, user.email)

    return db_user
```

### Django - Full-Stack Framework
```python
# models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_verified = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    class Meta:
        db_table = 'users'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['created_at']),
        ]

# serializers.py
from rest_framework import serializers
from django.contrib.auth import authenticate

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[MinLengthValidator(8)]
    )
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'first_name', 'last_name', 'password', 'password_confirm')

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = CustomUser.objects.create_user(**validated_data)
        return user
```

## Testing Strategy

### Test-Driven Development (TDD)
1. **Red**: Write a failing test first
2. **Green**: Write minimal code to pass
3. **Refactor**: Improve code while keeping tests green

### Testing Best Practices
```python
import pytest
from datetime import datetime, timedelta
from decimal import Decimal
from unittest.mock import Mock, patch

# Fixtures for common test data
@pytest.fixture
def sample_user():
    """Provide a sample user for testing."""
    return User(
        id=123,
        email="test@example.com",
        name="Test User",
        created_at=datetime.utcnow()
    )

@pytest.fixture
def mock_payment_gateway():
    """Mock payment gateway for testing."""
    gateway = Mock()
    gateway.charge.return_value = {"status": "success", "transaction_id": "tx_123"}
    return gateway

# Parametrized tests for multiple scenarios
@pytest.mark.parametrize("amount,expected", [
    (Decimal("10.00"), Decimal("10.00")),
    (Decimal("10.99"), Decimal("10.99")),
    (Decimal("10.999"), Decimal("11.00")),  # Rounding
])
def test_price_rounding(amount, expected):
    """Test that prices are rounded correctly."""
    result = round_price(amount)
    assert result == expected

# Testing async code
@pytest.mark.asyncio
async def test_async_user_fetch():
    """Test asynchronous user fetching."""
    user = await fetch_user(user_id=123)
    assert user.id == 123

# Testing exceptions
def test_invalid_email_raises_error(sample_user):
    """Test that invalid email formats are rejected."""
    with pytest.raises(ValidationError) as exc_info:
        sample_user.update_email("not-an-email")
    assert "Invalid email format" in str(exc_info.value)
```

## Error Handling

### Exception Hierarchy
```python
# Base exceptions for your application
class ApplicationError(Exception):
    """Base exception for application-specific errors."""
    pass

class ValidationError(ApplicationError):
    """Raised when input validation fails."""
    pass

class AuthenticationError(ApplicationError):
    """Raised when authentication fails."""
    pass

# Domain-specific exceptions
class PaymentError(ApplicationError):
    """Base exception for payment-related errors."""
    pass

class InsufficientFundsError(PaymentError):
    """Raised when account has insufficient funds."""
    def __init__(self, required: Decimal, available: Decimal):
        self.required = required
        self.available = available
        super().__init__(
            f"Insufficient funds: required {required}, available {available}"
        )
```

### Error Handling Patterns
```python
from contextlib import contextmanager
from functools import wraps
from time import sleep
import logging

logger = logging.getLogger(__name__)

# Context managers for resource management
@contextmanager
def database_transaction():
    """Provide a transactional scope for database operations."""
    conn = get_connection()
    trans = conn.begin_transaction()
    try:
        yield conn
        trans.commit()
    except Exception as e:
        logger.error(f"Transaction failed: {e}")
        trans.rollback()
        raise
    finally:
        conn.close()

# Retry decorator for transient failures
def retry(max_attempts=3, delay=1.0, backoff=2.0, exceptions=(Exception,)):
    """Retry decorator with exponential backoff."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 1
            current_delay = delay

            while attempt <= max_attempts:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        logger.error(f"Max retries ({max_attempts}) exceeded for {func.__name__}")
                        raise

                    logger.warning(
                        f"Attempt {attempt}/{max_attempts} failed for {func.__name__}: {e}. "
                        f"Retrying in {current_delay}s..."
                    )
                    sleep(current_delay)
                    current_delay *= backoff
                    attempt += 1

        return wrapper
    return decorator
```

## Configuration Management

### Environment-Based Configuration
```python
from pydantic_settings import BaseSettings
from pydantic import Field, validator
from functools import lru_cache
from typing import Optional, List
from enum import Enum

class Environment(str, Enum):
    """Application environments."""
    DEVELOPMENT = "development"
    STAGING = "staging"
    PRODUCTION = "production"
    TESTING = "testing"

class Settings(BaseSettings):
    """Application settings with validation and defaults."""

    # Application settings
    app_name: str = "MyApp"
    environment: Environment = Environment.DEVELOPMENT
    debug: bool = Field(default=False, description="Enable debug mode")

    # Database configuration
    database_url: str = Field(..., description="PostgreSQL connection string")
    database_pool_size: int = Field(default=10, ge=1, le=100)

    # API Keys and Secrets
    secret_key: str = Field(..., min_length=32, description="Application secret key")
    api_key: Optional[str] = Field(default=None, description="External API key")

    # Performance settings
    request_timeout: int = Field(default=30, ge=5, le=300)
    max_upload_size: int = Field(default=10 * 1024 * 1024)

    @validator("debug", pre=True)
    def validate_debug(cls, v, values):
        """Ensure debug is False in production."""
        if values.get("environment") == Environment.PRODUCTION and v is True:
            raise ValueError("Debug mode cannot be enabled in production")
        return v

    @validator("database_url")
    def validate_database_url(cls, v):
        """Ensure database URL is PostgreSQL."""
        if not v.startswith(("postgresql://", "postgres://")):
            raise ValueError("Only PostgreSQL is supported")
        return v

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()
```

## Async Programming

### AsyncIO Patterns
```python
import asyncio
import aiohttp
from typing import List, Dict
from contextlib import asynccontextmanager

async def fetch_multiple_urls(urls: List[str]) -> List[Dict]:
    """Fetch multiple URLs concurrently."""
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_url(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return [r for r in results if not isinstance(r, Exception)]

async def fetch_url(session: aiohttp.ClientSession, url: str) -> Dict:
    """Fetch a single URL with error handling."""
    try:
        async with session.get(url, timeout=30) as response:
            response.raise_for_status()
            return await response.json()
    except asyncio.TimeoutError:
        logger.error(f"Timeout fetching {url}")
        raise
    except aiohttp.ClientError as e:
        logger.error(f"Error fetching {url}: {e}")
        raise

@asynccontextmanager
async def async_database_session():
    """Async context manager for database sessions."""
    session = async_session_factory()
    try:
        yield session
        await session.commit()
    except Exception:
        await session.rollback()
        raise
    finally:
        await session.close()
```

## Database Naming Standards

### Entity-Specific Primary Keys
```sql
sessions.session_id UUID PRIMARY KEY
leads.lead_id UUID PRIMARY KEY
users.user_id UUID PRIMARY KEY
```

### Conventions
- Primary keys: `{entity}_id`
- Foreign keys: `{referenced_entity}_id`
- Timestamps: `{action}_at` (created_at, updated_at)
- Booleans: `is_{state}` (is_active, is_verified)
- Counts: `{entity}_count`

## Validation Commands

```bash
# Code quality and linting
uv run ruff format .                   # Format code
uv run ruff check --fix .              # Lint and fix
uv run mypy src/                       # Type checking

# Testing
uv run pytest                          # Run tests
uv run pytest --cov=src --cov-report=html  # With coverage

# Security scanning
bandit -r . -f json
safety check

# Performance profiling
python -m cProfile -o profile.stats main.py
py-spy top --pid <pid>
```

This Python stack configuration ensures robust, maintainable, and high-performance Python development following SOLID principles, comprehensive testing, and modern best practices.
