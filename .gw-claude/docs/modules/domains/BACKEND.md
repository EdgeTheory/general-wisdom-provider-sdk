# Backend Domain Context

## When This Module Loads

**Trigger Keywords**: api, server, database, endpoint, service, crud, rest, graphql, backend

**Intent Patterns**: backend_development, api_design, server_implementation

**Tools Predicted**: database tools, API frameworks, server deployment tools

## Backend Development Principles

### API Design Best Practices
- **RESTful Design**: Follow REST principles for resource-based APIs
- **Consistent Naming**: Use consistent URL patterns and naming conventions
- **Proper HTTP Methods**: Use appropriate HTTP verbs (GET, POST, PUT, DELETE)
- **Status Codes**: Return meaningful HTTP status codes
- **Documentation**: Provide comprehensive API documentation

### Database Integration
- **Connection Management**: Use connection pooling for efficient database access
- **Query Optimization**: Write efficient queries and use indexes appropriately
- **Transaction Management**: Handle database transactions properly
- **Migration Strategy**: Implement proper database migration workflows

### Performance and Scalability
- **Caching Strategy**: Implement appropriate caching at multiple levels
- **Async Processing**: Use asynchronous processing for long-running tasks
- **Load Balancing**: Design for horizontal scaling and load distribution
- **Monitoring**: Implement comprehensive logging and monitoring

## Implementation Patterns

### FastAPI Backend Example
```python
from fastapi import FastAPI, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserCreate, UserResponse

app = FastAPI()

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = User(**user.dict())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

### Database Schema Design
```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    posts = relationship("Post", back_populates="author")
```

## Validation Commands

```bash
# API testing
pytest tests/api/ -v

# Database migrations
alembic upgrade head

# Performance testing
locust -f tests/load_test.py --host=http://localhost:8000
```

This backend context ensures robust, scalable server-side implementations following industry best practices.
