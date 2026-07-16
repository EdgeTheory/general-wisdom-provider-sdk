# API Design Patterns

## RESTful API Design Principles

### Resource-Based URLs
- Use nouns, not verbs: `/users/123` not `/getUser/123`
- Use plural nouns for collections: `/users` not `/user`
- Nest resources logically: `/users/123/posts`
- Use query parameters for filtering: `/users?status=active`

### HTTP Methods Usage
- **GET**: Retrieve resources (idempotent, safe)
- **POST**: Create new resources
- **PUT**: Update entire resource (idempotent)
- **PATCH**: Partial resource updates
- **DELETE**: Remove resources (idempotent)

### Status Code Standards
- **200**: OK - Successful GET, PUT, PATCH
- **201**: Created - Successful POST
- **204**: No Content - Successful DELETE
- **400**: Bad Request - Invalid request syntax
- **401**: Unauthorized - Authentication required
- **403**: Forbidden - Authentication insufficient
- **404**: Not Found - Resource doesn't exist
- **422**: Unprocessable Entity - Validation errors
- **500**: Internal Server Error - Server fault

## API Versioning Strategies

### URL Versioning
```
GET /api/v1/users
GET /api/v2/users
```

### Header Versioning
```
GET /api/users
Accept: application/vnd.api.v1+json
```

### Query Parameter Versioning
```
GET /api/users?version=1
```

## Error Handling Patterns

### Consistent Error Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "timestamp": "2023-01-01T10:00:00Z",
    "path": "/api/users"
  }
}
```

## Pagination Patterns

### Cursor-Based Pagination
```json
{
  "data": [...],
  "pagination": {
    "next_cursor": "eyJpZCI6MTIzfQ==",
    "has_more": true,
    "total_count": 1000
  }
}
```

### Offset-Based Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total_pages": 50,
    "total_count": 1000
  }
}
```

## Authentication Patterns

### JWT Token Authentication
```python
from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer
import jwt

security = HTTPBearer()

def authenticate_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=["HS256"])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

This ensures consistent, professional API design following industry standards.
