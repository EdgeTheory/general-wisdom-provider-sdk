# CLI Hook System Best Practices

## Key Research Sources
- Git Hooks: https://git-scm.com/docs/githooks
- Click Framework: https://click.palletsprojects.com/en/8.1.x/
- Typer Framework: https://typer.tiangolo.com/
- Pre-commit hooks: https://github.com/pre-commit/pre-commit

## Critical Patterns for Implementation

### 1. Context Manager Pattern for Hook Execution
```python
@contextmanager
def hook_timeout(timeout_seconds=30):
    """Context manager for hook execution with timeout"""
    try:
        with asyncio.timeout(timeout_seconds):
            yield
    except asyncio.TimeoutError:
        logger.warning(f"Hook execution timed out after {timeout_seconds}s")
        raise HookTimeoutError()
```

### 2. Graceful Error Handling
```python
def execute_hook_with_fallback(hook, context):
    """Execute hook with comprehensive error handling"""
    try:
        result = hook.run(context, timeout=30)
        if result.exit_code != 0:
            raise HookFailureError(f"Hook failed: {result.stderr}")
        return result.context
    except TimeoutError:
        logger.warning(f"Hook {hook.name} timed out, using fallback")
        return context  # Return original context
    except Exception as e:
        if hook.critical:
            raise  # Critical hooks abort operation
        else:
            logger.error(f"Hook {hook.name} failed: {e}")
            return context  # Non-critical hooks continue
```

### 3. Session-Based Processing
```python
class HookSession:
    def __init__(self, session_id):
        self.session_id = session_id
        self.context = {}
        self.processed_at = None

    def should_process(self, force=False):
        """Determine if processing should occur"""
        if force:
            return True

        # Check if context file exists and is recent
        if not self.context_file_exists():
            return True

        # Allow re-processing after timeout
        if self.processed_at and (time.time() - self.processed_at) > 600:  # 10 minutes
            return True

        return False
```

### 4. Robust Input Validation
```python
def validate_hook_input(hook_data):
    """Validate hook input data"""
    required_fields = ['session_id', 'transcript_path', 'tool_name']

    for field in required_fields:
        if field not in hook_data:
            raise ValueError(f"Missing required field: {field}")

    # Validate paths exist
    if hook_data['transcript_path'] and not Path(hook_data['transcript_path']).exists():
        logger.warning(f"Transcript file not found: {hook_data['transcript_path']}")

    return hook_data
```

## Key Implementation Guidelines

1. **Always use timeouts** - Hooks should never hang the system
2. **Implement fallback mechanisms** - System should work even if hooks fail
3. **Log everything** - Essential for debugging hook issues
4. **Use context managers** - Ensure proper cleanup
5. **Make hooks idempotent** - Safe to run multiple times
6. **Validate inputs** - Prevent malformed data from crashing hooks
7. **Handle edge cases** - Empty files, missing data, network issues
