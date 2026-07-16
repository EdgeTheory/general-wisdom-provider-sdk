# Conversation Transcript Parsing Patterns

## Key Research Sources
- JSONL Specification: https://jsonlines.org/
- Python JSON Module: https://docs.python.org/3/library/json.html
- spaCy NLP: https://spacy.io/
- Hugging Face Transformers: https://huggingface.co/docs/transformers/

## Critical Patterns for Implementation

### 1. Robust JSONL Stream Processing
```python
def parse_jsonl_stream(file_path: Path) -> Generator[Dict, None, None]:
    """Memory-efficient JSONL parsing with error recovery"""
    with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
        for line_num, line in enumerate(f, 1):
            line = line.strip()
            if not line:
                continue

            try:
                yield json.loads(line)
            except json.JSONDecodeError as e:
                # Log specific error details
                logger.warning(f"JSON parse error at line {line_num}: {e.msg} at position {e.pos}")

                # Try common recovery strategies
                recovered = attempt_json_recovery(line)
                if recovered:
                    yield recovered
                else:
                    logger.error(f"Failed to recover line {line_num}: {line[:100]}...")
                    continue

def attempt_json_recovery(line: str) -> Optional[Dict]:
    """Attempt to recover from common JSON formatting issues"""
    recovery_strategies = [
        lambda x: x.rstrip(','),  # Remove trailing comma
        lambda x: x.replace("'", '"'),  # Replace single quotes
        lambda x: x + '}' if x.count('{') > x.count('}') else x,  # Add missing brace
        lambda x: re.sub(r'([{,]\s*)(\w+):', r'\1"\2":', x),  # Quote unquoted keys
    ]

    for strategy in recovery_strategies:
        try:
            fixed = strategy(line.strip())
            return json.loads(fixed)
        except json.JSONDecodeError:
            continue

    return None
```

### 2. Multi-Format Message Extraction
```python
def extract_user_message(entry: Dict) -> Optional[str]:
    """Extract user message from various transcript formats"""

    # Basic validation
    if entry.get('type') != 'user' or 'message' not in entry:
        return None

    message = entry['message']
    if message.get('role') != 'user':
        return None

    # Skip meta messages
    if entry.get('isMeta', False):
        return None

    content = message.get('content', '')

    # Handle different content formats
    if isinstance(content, str):
        # String format - simple case
        text = content.strip()

    elif isinstance(content, list):
        # List format - extract text blocks
        text_parts = []
        for block in content:
            if isinstance(block, dict) and block.get('type') == 'text':
                text_parts.append(block.get('text', ''))
        text = ' '.join(text_parts).strip()

    else:
        return None

    # Filter out system content
    if any(marker in text for marker in ['<system-reminder>', '<command-name>', '<local-command-stdout>']):
        return None

    # Ensure minimum content length
    if len(text) < 10:
        return None

    return text
```

### 3. Intent Classification
```python
def classify_user_intent(text: str) -> Dict[str, Any]:
    """Classify user intent from message text"""

    # Define intent patterns
    intent_patterns = {
        'coding_request': [
            r'\b(?:write|create|implement|build|develop|code)\b',
            r'\b(?:function|class|method|script|program)\b',
            r'\b(?:fix|debug|error|bug)\b'
        ],
        'information_seeking': [
            r'\b(?:what|how|explain|tell me|show me)\b',
            r'\b(?:documentation|docs|info|information)\b',
            r'\b(?:help|assist|guide)\b'
        ],
        'architecture_discussion': [
            r'\b(?:design|architecture|pattern|structure)\b',
            r'\b(?:scalability|performance|optimization)\b',
            r'\b(?:system|framework|infrastructure)\b'
        ],
        'security_focus': [
            r'\b(?:security|secure|auth|authentication)\b',
            r'\b(?:encrypt|decrypt|ssl|tls|certificate)\b',
            r'\b(?:vulnerability|exploit|attack)\b'
        ]
    }

    # Score each intent
    intent_scores = {}
    text_lower = text.lower()

    for intent, patterns in intent_patterns.items():
        score = sum(1 for pattern in patterns if re.search(pattern, text_lower))
        if score > 0:
            intent_scores[intent] = score

    # Determine primary intent
    if intent_scores:
        primary_intent = max(intent_scores, key=intent_scores.get)
        confidence = intent_scores[primary_intent] / len(intent_patterns[primary_intent])
    else:
        primary_intent = 'general'
        confidence = 0.1

    return {
        'intent': primary_intent,
        'confidence': min(confidence, 1.0),
        'scores': intent_scores
    }
```

### 4. Session State Management
```python
class TranscriptSessionManager:
    def __init__(self, redis_client=None):
        self.redis_client = redis_client
        self.local_cache = {}

    def get_session_context(self, session_id: str, transcript_path: str) -> Dict:
        """Get or create session context from transcript"""

        # Check cache first
        cache_key = f"session:{session_id}"
        if cache_key in self.local_cache:
            return self.local_cache[cache_key]

        # Parse transcript for context
        context = self._build_context_from_transcript(transcript_path)
        context['session_id'] = session_id
        context['last_updated'] = datetime.now().isoformat()

        # Cache the context
        self.local_cache[cache_key] = context

        # Store in Redis if available
        if self.redis_client:
            self.redis_client.setex(
                cache_key,
                3600,  # 1 hour expiry
                json.dumps(context)
            )

        return context

    def _build_context_from_transcript(self, transcript_path: str) -> Dict:
        """Build session context from transcript analysis"""

        context = {
            'messages': [],
            'intents': [],
            'entities': [],
            'conversation_flow': []
        }

        # Parse recent messages (last 10)
        recent_messages = list(self._get_recent_messages(transcript_path, limit=10))

        for msg in recent_messages:
            user_text = extract_user_message(msg)
            if user_text:
                intent_info = classify_user_intent(user_text)
                context['messages'].append({
                    'text': user_text,
                    'intent': intent_info['intent'],
                    'confidence': intent_info['confidence']
                })
                context['intents'].append(intent_info['intent'])

        # Determine dominant intent
        if context['intents']:
            context['dominant_intent'] = max(set(context['intents']), key=context['intents'].count)
        else:
            context['dominant_intent'] = 'general'

        return context

    def _get_recent_messages(self, transcript_path: str, limit: int = 10) -> Generator[Dict, None, None]:
        """Get recent messages from transcript"""
        messages = []

        for entry in parse_jsonl_stream(Path(transcript_path)):
            if entry.get('type') == 'user':
                messages.append(entry)

        # Return most recent messages
        for msg in messages[-limit:]:
            yield msg
```

## Key Implementation Guidelines

1. **Use streaming parsing** - Handle large transcript files efficiently
2. **Implement error recovery** - Don't fail on malformed JSON
3. **Support multiple formats** - Handle string and list content types
4. **Filter system messages** - Focus on actual user content
5. **Cache session context** - Avoid re-parsing transcripts
6. **Classify intent intelligently** - Use patterns and scoring
7. **Handle edge cases** - Empty files, missing data, encoding issues
8. **Log parsing errors** - Essential for debugging transcript issues
