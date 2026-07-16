# Architecture Domain Context

## When This Module Loads

**Trigger Keywords**: architecture, design, scalable, distributed, microservice, system, structure, pattern

**Intent Patterns**: architecture_design, system_design, scalability_planning

**Tools Predicted**: system design tools, architecture documentation, performance testing

## System Architecture Principles

### Distributed System Design
- **Scalability First**: Design for horizontal scaling from initial architecture
- **Fault Tolerance**: Build resilient systems with graceful failure handling
- **Data Consistency**: Plan for eventual consistency in distributed scenarios
- **Service Boundaries**: Define clear domain boundaries and service responsibilities
- **API Design**: Create consistent, versioned APIs with proper documentation

### Architectural Patterns
- **Microservices Architecture**: Domain-driven service decomposition
- **Event-Driven Architecture**: Loose coupling through asynchronous messaging
- **CQRS**: Command Query Responsibility Segregation for performance
- **Hexagonal Architecture**: Ports and adapters for testability
- **Layered Architecture**: Clear separation of concerns and dependencies

### Performance Engineering
- **Caching Strategy**: Multi-layer caching (application, database, CDN)
- **Database Optimization**: Query optimization, indexing, and partitioning
- **Load Balancing**: Traffic distribution and failover strategies
- **Resource Management**: Memory, CPU, and I/O optimization
- **Monitoring**: Comprehensive observability and alerting

## Implementation Patterns

### Microservices Design
```yaml
# Service architecture specification
services:
  user_service:
    domain: user_management
    responsibilities:
      - user_authentication
      - profile_management
      - preferences
    apis:
      - GET /users/{id}
      - PUT /users/{id}
      - POST /users
    database: postgresql
    cache: redis
    events:
      publishes: [user_created, user_updated]
      subscribes: [account_verified]

  order_service:
    domain: order_management
    responsibilities:
      - order_creation
      - order_processing
      - order_fulfillment
    apis:
      - POST /orders
      - GET /orders/{id}
      - PUT /orders/{id}/status
    database: postgresql
    message_queue: rabbitmq
    events:
      publishes: [order_created, order_completed]
      subscribes: [payment_confirmed, inventory_reserved]
```

### Event-Driven Architecture
```python
from abc import ABC, abstractmethod
from typing import Dict, Any, List
import asyncio
from dataclasses import dataclass
from datetime import datetime

@dataclass
class DomainEvent:
    event_id: str
    event_type: str
    aggregate_id: str
    data: Dict[str, Any]
    timestamp: datetime
    version: int

class EventStore(ABC):
    @abstractmethod
    async def save_events(self, stream_id: str, events: List[DomainEvent]) -> None:
        pass

    @abstractmethod
    async def get_events(self, stream_id: str, from_version: int = 0) -> List[DomainEvent]:
        pass

class EventBus(ABC):
    @abstractmethod
    async def publish(self, event: DomainEvent) -> None:
        pass

    @abstractmethod
    async def subscribe(self, event_type: str, handler: callable) -> None:
        pass

class AggregateRoot:
    def __init__(self, aggregate_id: str):
        self.aggregate_id = aggregate_id
        self.version = 0
        self.uncommitted_events: List[DomainEvent] = []

    def raise_event(self, event_type: str, data: Dict[str, Any]) -> None:
        event = DomainEvent(
            event_id=generate_uuid(),
            event_type=event_type,
            aggregate_id=self.aggregate_id,
            data=data,
            timestamp=datetime.utcnow(),
            version=self.version + 1
        )
        self.uncommitted_events.append(event)
        self.apply_event(event)

    def apply_event(self, event: DomainEvent) -> None:
        method_name = f"_apply_{event.event_type.lower()}"
        if hasattr(self, method_name):
            getattr(self, method_name)(event.data)
        self.version = event.version
```

### Database Architecture
```sql
-- Scalable database design with partitioning
CREATE TABLE events (
    id BIGSERIAL,
    stream_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    version INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions for event store
CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- Optimized indexes
CREATE UNIQUE INDEX idx_events_stream_version ON events(stream_id, version);
CREATE INDEX idx_events_type_created ON events(event_type, created_at);
CREATE INDEX idx_events_data_gin ON events USING GIN(event_data);

-- Read model projections
CREATE MATERIALIZED VIEW user_statistics AS
SELECT
    user_id,
    COUNT(*) as total_orders,
    SUM(order_amount) as total_spent,
    MAX(created_at) as last_order_date,
    AVG(order_amount) as average_order_value
FROM orders
WHERE status = 'completed'
GROUP BY user_id;

-- Refresh strategy for materialized views
CREATE OR REPLACE FUNCTION refresh_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY user_statistics;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

## Scalability Patterns

### Horizontal Scaling Strategy
```yaml
# Load balancer configuration
load_balancer:
  algorithm: round_robin
  health_checks:
    interval: 30s
    timeout: 5s
    unhealthy_threshold: 3
  sticky_sessions: false

  upstream_servers:
    - server: app-1.internal:8000
      weight: 1
      max_fails: 3
    - server: app-2.internal:8000
      weight: 1
      max_fails: 3
    - server: app-3.internal:8000
      weight: 1
      max_fails: 3

# Auto-scaling configuration
auto_scaling:
  min_instances: 2
  max_instances: 10
  target_cpu: 70%
  target_memory: 80%
  scale_up_cooldown: 300s
  scale_down_cooldown: 600s
```

### Caching Architecture
```python
from typing import Optional, Any
import redis
import json
from functools import wraps

class CacheManager:
    def __init__(self, redis_client: redis.Redis):
        self.redis = redis_client
        self.default_ttl = 3600  # 1 hour

    async def get(self, key: str) -> Optional[Any]:
        try:
            value = await self.redis.get(key)
            return json.loads(value) if value else None
        except (json.JSONDecodeError, redis.RedisError):
            return None

    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        try:
            ttl = ttl or self.default_ttl
            serialized = json.dumps(value, default=str)
            return await self.redis.setex(key, ttl, serialized)
        except (json.JSONError, redis.RedisError):
            return False

    async def invalidate_pattern(self, pattern: str) -> int:
        keys = await self.redis.keys(pattern)
        if keys:
            return await self.redis.delete(*keys)
        return 0

def cache_result(ttl: int = 3600, key_prefix: str = ""):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            # Generate cache key from function name and arguments
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(kwargs))}"

            # Try to get from cache
            cached_result = await cache_manager.get(cache_key)
            if cached_result is not None:
                return cached_result

            # Execute function and cache result
            result = await func(*args, **kwargs)
            await cache_manager.set(cache_key, result, ttl)
            return result
        return wrapper
    return decorator
```

## Monitoring and Observability

### System Metrics Collection
```python
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import time
import logging

# Metrics definitions
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_DURATION = Histogram('http_request_duration_seconds', 'HTTP request duration')
ACTIVE_CONNECTIONS = Gauge('active_connections', 'Active database connections')
QUEUE_SIZE = Gauge('message_queue_size', 'Message queue size', ['queue_name'])

class MetricsMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope['type'] != 'http':
            return await self.app(scope, receive, send)

        start_time = time.time()
        method = scope['method']
        path = scope['path']

        # Track request
        REQUEST_COUNT.labels(method=method, endpoint=path, status='processing').inc()

        try:
            await self.app(scope, receive, send)
            status = 'success'
        except Exception as e:
            status = 'error'
            logging.error(f"Request failed: {e}")
            raise
        finally:
            # Record metrics
            duration = time.time() - start_time
            REQUEST_DURATION.observe(duration)
            REQUEST_COUNT.labels(method=method, endpoint=path, status=status).inc()
```

## Validation Commands

### Architecture Testing
```bash
# Performance testing
k6 run --vus 100 --duration 5m load-test.js

# Stress testing
artillery run --target http://api.example.com stress-test.yml

# Database performance
pgbench -c 10 -j 2 -t 10000 database_name

# Infrastructure validation
terraform plan -var-file=production.tfvars
checkov --framework terraform --directory ./infrastructure
```

### System Health Monitoring
```bash
# Application metrics
curl http://localhost:8000/metrics

# Database monitoring
pg_stat_activity analysis
redis-cli info stats

# System resource monitoring
htop
iotop
netstat -tulpn
```

This architecture domain ensures robust, scalable system design with comprehensive patterns for distributed systems, performance optimization, and operational excellence.
