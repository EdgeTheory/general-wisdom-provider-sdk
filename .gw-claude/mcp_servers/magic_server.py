#!/usr/bin/env python3
# /// script
# dependencies = [
#     "fastmcp>=2.11.0",
#     "pydantic>=2.0.0"
# ]
# ///

"""
Magic MCP Server for zero-install code-agent CLI.

Provides UI generation, component creation, and template
magic capabilities via MCP protocol.

Uses FastMCP 2.0+ framework with uv inline dependencies.
"""

import json
import logging
import sys
from typing import Any, Dict, Optional

# Configure logging to stderr to avoid corrupting JSON-RPC
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format="[%(asctime)s] %(name)s %(levelname)s: %(message)s",
)

logger = logging.getLogger("magic_server")

try:
    from fastmcp import FastMCP
    from pydantic import BaseModel
except ImportError as e:
    logger.error(f"Required dependencies not available: {e}")
    sys.exit(1)

# Initialize FastMCP server
mcp = FastMCP("magic")


class ComponentRequest(BaseModel):
    """Request model for component generation."""

    type: str
    name: str
    props: Dict[str, Any] = {}
    framework: str = "react"


@mcp.tool()
def generate_component(
    component_type: str,
    name: str,
    framework: str = "react",
    props: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """
    Generate a UI component based on specifications.

    Args:
        component_type: Type of component (button, form, modal, etc.)
        name: Component name
        framework: Target framework (react, vue, angular)
        props: Component properties

    Returns:
        Dictionary with generated component code
    """
    try:
        logger.info(f"Generating {framework} {component_type} component: {name}")

        if props is None:
            props = {}

        # Generate component based on type and framework
        if framework.lower() == "react":
            code = _generate_react_component(component_type, name, props)
        elif framework.lower() == "vue":
            code = _generate_vue_component(component_type, name, props)
        else:
            code = _generate_generic_component(component_type, name, props)

        return {
            "component_name": name,
            "component_type": component_type,
            "framework": framework,
            "code": code,
            "props": props,
            "success": True,
        }

    except Exception as e:
        logger.error(f"Component generation failed: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
def create_template(
    template_type: str, name: str, config: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Create a project template.

    Args:
        template_type: Type of template (webapp, api, mobile, etc.)
        name: Template name
        config: Template configuration

    Returns:
        Dictionary with template files
    """
    try:
        logger.info(f"Creating {template_type} template: {name}")

        if config is None:
            config = {}

        # Generate template files
        files = _generate_template_files(template_type, name, config)

        return {
            "template_name": name,
            "template_type": template_type,
            "files": files,
            "config": config,
            "success": True,
        }

    except Exception as e:
        logger.error(f"Template creation failed: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
def health_check() -> Dict[str, Any]:
    """Health check for Magic server."""
    try:
        return {
            "status": "healthy",
            "server": "magic",
            "version": "1.0.0",
            "capabilities": ["component_generation", "template_creation", "ui_magic"],
        }
    except Exception as e:
        return {"status": "unhealthy", "error": str(e)}


def _generate_react_component(comp_type: str, name: str, props: Dict) -> str:
    """Generate React component code."""
    if comp_type == "button":
        return f"""import React from 'react';

interface {name}Props {{
  onClick?: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}}

export const {name}: React.FC<{name}Props> = ({{
  onClick,
  children,
  variant = 'primary'
}}) => {{
  return (
    <button
      className={{`btn btn-${{variant}}`}}
      onClick={{onClick}}
    >
      {{children}}
    </button>
  );
}};"""

    return f"""import React from 'react';

export const {name} = () => {{
  return (
    <div className="{name.lower()}">
      <h2>{name}</h2>
    </div>
  );
}};"""


def _generate_vue_component(comp_type: str, name: str, props: Dict) -> str:
    """Generate Vue component code."""
    return f"""<template>
  <div class="{name.lower()}">
    <h2>{name}</h2>
  </div>
</template>

<script>
export default {{
  name: '{name}',
  props: {json.dumps(props, indent=2) if props else "{}"}
}};
</script>

<style scoped>
.{name.lower()} {{
  /* Component styles */
}}
</style>"""


def _generate_generic_component(comp_type: str, name: str, props: Dict) -> str:
    """Generate generic component template."""
    return f"""// {name} Component
// Type: {comp_type}
// Props: {json.dumps(props, indent=2) if props else "None"}

class {name} {{
  constructor(props) {{
    this.props = props || {{}};
  }}

  render() {{
    return `<div class="{name.lower()}">{name}</div>`;
  }}
}}"""


def _generate_template_files(
    template_type: str, name: str, config: Dict
) -> Dict[str, str]:
    """Generate template files."""
    files = {}

    if template_type == "webapp":
        files["package.json"] = _generate_package_json(name, config)
        files["src/App.js"] = _generate_app_component(name)
        files["public/index.html"] = _generate_index_html(name)
        files["README.md"] = _generate_readme(name, template_type)

    elif template_type == "api":
        files["main.py"] = _generate_api_main(name)
        files["requirements.txt"] = _generate_requirements()
        files["README.md"] = _generate_readme(name, template_type)

    else:
        files["README.md"] = _generate_readme(name, template_type)

    return files


def _generate_package_json(name: str, config: Dict) -> str:
    """Generate package.json for web app template."""
    return json.dumps(
        {
            "name": name.lower().replace(" ", "-"),
            "version": "1.0.0",
            "description": f"{name} web application",
            "main": "src/index.js",
            "scripts": {
                "start": "react-scripts start",
                "build": "react-scripts build",
                "test": "react-scripts test",
            },
            "dependencies": {
                "react": "^18.0.0",
                "react-dom": "^18.0.0",
                "react-scripts": "5.0.1",
            },
        },
        indent=2,
    )


def _generate_app_component(name: str) -> str:
    """Generate main App component."""
    return f"""import React from 'react';
import './App.css';

function App() {{
  return (
    <div className="App">
      <header className="App-header">
        <h1>{name}</h1>
        <p>Welcome to your new application!</p>
      </header>
    </div>
  );
}}

export default App;"""


def _generate_index_html(name: str) -> str:
    """Generate index.html template."""
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{name}</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>"""


def _generate_api_main(name: str) -> str:
    """Generate API main file."""
    return f'''"""
{name} API Server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="{name}", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {{"message": "Welcome to {name} API"}}

@app.get("/health")
async def health_check():
    return {{"status": "healthy"}}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
'''


def _generate_requirements() -> str:
    """Generate requirements.txt."""
    return """fastapi>=0.68.0
uvicorn[standard]>=0.15.0
pydantic>=1.8.0"""


def _generate_readme(name: str, template_type: str) -> str:
    """Generate README.md."""
    return f"""# {name}

A {template_type} project generated with code-agent magic.

## Getting Started

1. Install dependencies
2. Run the application
3. Start developing!

## Features

- Modern {template_type} architecture
- Ready-to-use components
- Development-friendly setup

## Generated with ✨ Magic

This project was created using code-agent's magic server.
"""


if __name__ == "__main__":
    logger.info("Starting Magic MCP Server...")
    mcp.run()
