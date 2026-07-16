#!/usr/bin/env -S uv run --script
"""Debug script to test imports in uv environment."""

# /// script
# requires-python = ">=3.10"
# dependencies = [
#   "click>=8.0.0",
#   "rich>=13.0.0",
#   "boto3>=1.26.0",
#   "pydantic>=2.0.0",
#   "pydantic-settings>=2.0.0",
#   "httpx>=0.24.0",
#   "aiohttp>=3.8.0",
#   "uvicorn>=0.20.0",
#   "jinja2>=3.0.0",
#   "pyyaml>=6.0",
#   "pathspec>=0.11.0",
#   "aiofiles>=23.1.0",
#   "psutil>=5.9.0",
#   "typer>=0.9.0",
#   "requests>=2.31.0",
#   "fastmcp>=0.1.0",
#   "gitpython>=3.1.0",
#   "toml>=0.10.2",
# ]
# ///

import sys
from pathlib import Path

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent.parent))

print("Testing imports...")

try:
    import aiohttp

    print("✓ aiohttp import successful")
except ImportError as e:
    print(f"✗ aiohttp import failed: {e}")

try:
    from code_agent.cli.composition.claude_md_composer import (
        CLAUDEMDComposer,
        CompositionConfig,
    )

    print("✓ Composer import successful")

    # Test instantiation
    composer = CLAUDEMDComposer(Path("docs/modules"))
    print("✓ Composer instantiation successful")

except ImportError as e:
    print(f"✗ Composer import failed: {e}")
except Exception as e:
    print(f"✗ Composer instantiation failed: {e}")

print("Debug complete.")
