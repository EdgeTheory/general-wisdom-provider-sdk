#!/usr/bin/env python3
# /// script
# dependencies = [
#     "fastmcp>=2.11.0",
#     "pydantic>=2.0.0"
# ]
# ///

"""
Context7 MCP Server for zero-install code-agent CLI.

Provides document analysis, context extraction, and intelligent
code understanding capabilities via MCP protocol.

Uses FastMCP 2.0+ framework with uv inline dependencies.
"""

import logging
import re
import sys
from typing import Any, Dict, List, Optional

# Configure logging to stderr to avoid corrupting JSON-RPC
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format="[%(asctime)s] %(name)s %(levelname)s: %(message)s",
)

logger = logging.getLogger("context7_server")

try:
    from fastmcp import FastMCP
    from pydantic import BaseModel
except ImportError as e:
    logger.error(f"Required dependencies not available: {e}")
    logger.error("Install with: uv add fastmcp>=2.11.0 pydantic>=2.0.0")
    sys.exit(1)

# Initialize FastMCP server
mcp = FastMCP("context7")


class AnalysisRequest(BaseModel):
    """Request model for document analysis."""

    content: str
    analysis_type: str = "general"
    focus_areas: List[str] = []


class ContextExtractionRequest(BaseModel):
    """Request model for context extraction."""

    documents: List[str]
    extraction_type: str = "summary"
    max_length: int = 1000


def _extract_technical_terms(content: str) -> List[str]:
    """Extract technical terms from content."""
    tech_patterns = [
        r"\b(class|function|method|variable|parameter|return|import|from)\b",
        r"\b(async|await|try|except|finally|with|yield)\b",
        r"\b(int|str|float|bool|list|dict|tuple|set)\b",
        r"\b[A-Z][a-zA-Z]*\b",  # CamelCase
        r"\b[a-z_]+\(\)",  # function calls
    ]

    terms = set()
    for pattern in tech_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        terms.update(matches)

    return sorted(list(terms))[:20]


def _calculate_complexity_score(content: str) -> float:
    """Calculate a simple complexity score."""
    lines = content.split("\n")
    total_lines = len(lines)

    if total_lines == 0:
        return 0.0

    # Count nested structures
    nesting_score = 0

    for line in lines:
        if line.strip():
            indent = len(line) - len(line.lstrip())
            nesting_score += indent / 4  # Assume 4-space indentation

    # Normalize by total lines
    complexity = min(nesting_score / total_lines, 10.0)
    return round(complexity, 2)


def _calculate_readability_score(content: str) -> float:
    """Calculate readability score."""
    words = content.split()
    sentences = re.split(r"[.!?]+", content)

    if not sentences or not words:
        return 0.0

    avg_words_per_sentence = len(words) / len([s for s in sentences if s.strip()])

    # Simple readability metric
    score = max(0, 10 - (avg_words_per_sentence - 15) / 5)
    return round(min(score, 10.0), 2)


def _calculate_general_score(content: str) -> float:
    """Calculate general content score."""
    word_count = len(content.split())
    unique_words = len(set(content.lower().split()))

    if word_count == 0:
        return 0.0

    diversity_ratio = unique_words / word_count
    score = diversity_ratio * 10

    return round(min(score, 10.0), 2)


def _extract_business_terms(content: str) -> List[str]:
    """Extract business-related terms."""
    business_patterns = [
        r"\b(revenue|profit|cost|budget|market|customer|client|sale|product|service)\b",
        r"\b(strategy|goal|objective|requirement|stakeholder|deliverable)\b",
        r"\b(timeline|deadline|milestone|resource|allocation|ROI|KPI)\b",
    ]

    terms = set()
    for pattern in business_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE)
        terms.update(matches)

    return sorted(list(terms))[:15]


def _extract_general_terms(content: str) -> List[str]:
    """Extract general key terms using word frequency."""
    words = re.findall(r"\w+", content.lower())
    word_freq = {}

    for word in words:
        if len(word) > 3:  # Skip short words
            word_freq[word] = word_freq.get(word, 0) + 1

    # Return top 15 most frequent words
    return sorted(word_freq.keys(), key=word_freq.get, reverse=True)[:15]


def _generate_summary(content: str, max_length: int = 200) -> str:
    """Generate a simple summary."""
    sentences = re.split(r"[.!?]+", content)
    sentences = [s.strip() for s in sentences if s.strip()]

    if not sentences:
        return "No content to summarize."

    # Take first few sentences that fit within max_length
    summary = ""
    for sentence in sentences[:5]:  # Max 5 sentences
        if len(summary + sentence) <= max_length:
            summary += sentence + ". "
        else:
            break

    return summary.strip() or sentences[0][:max_length] + "..."


def _generate_recommendations(content: str, analysis_type: str) -> List[str]:
    """Generate contextual recommendations."""
    recommendations = []

    if "TODO" in content.upper():
        recommendations.append("Complete TODO items found in the content")

    if len(content.split("\n")) > 100:
        recommendations.append("Consider breaking down into smaller sections")

    if analysis_type == "technical":
        if "import" in content and "def " not in content:
            recommendations.append("Consider adding function implementations")
        if "class" in content.lower() and "def __init__" not in content:
            recommendations.append("Add constructor methods to classes")
        if "def " in content and '"""' not in content:
            recommendations.append(
                "Add docstrings to functions for better documentation"
            )
    elif analysis_type == "business":
        if any(term in content.lower() for term in ["goal", "objective"]):
            recommendations.append("Define measurable success criteria")
        if "requirement" in content.lower():
            recommendations.append("Prioritize requirements by business value")

    return recommendations


@mcp.tool()
def analyze_document(
    content: str,
    analysis_type: str = "general",
    focus_areas: Optional[List[str]] = None,
) -> Dict[str, Any]:
    """
    Analyze a document and extract key insights.

    Args:
        content: Document content to analyze
        analysis_type: Type of analysis (general, technical, business)
        focus_areas: Specific areas to focus on during analysis

    Returns:
        Dictionary with analysis results
    """
    try:
        logger.info(
            f"Analyzing document: {len(content)} characters, type: {analysis_type}"
        )

        if focus_areas is None:
            focus_areas = []

        # Basic document analysis
        word_count = len(content.split())
        line_count = len(content.splitlines())

        # Extract key information based on analysis type
        if analysis_type == "technical":
            key_terms = _extract_technical_terms(content)
            complexity_score = _calculate_complexity_score(content)
        elif analysis_type == "business":
            key_terms = _extract_business_terms(content)
            complexity_score = _calculate_readability_score(content)
        else:
            key_terms = _extract_general_terms(content)
            complexity_score = _calculate_general_score(content)

        # Generate summary
        summary = _generate_summary(content, max_length=200)

        result = {
            "analysis_type": analysis_type,
            "statistics": {
                "word_count": word_count,
                "line_count": line_count,
                "character_count": len(content),
            },
            "key_terms": key_terms,
            "complexity_score": complexity_score,
            "summary": summary,
            "focus_areas": focus_areas,
            "recommendations": _generate_recommendations(content, analysis_type),
        }

        logger.info("Document analysis completed successfully")
        return result

    except Exception as e:
        logger.error(f"Document analysis failed: {e}")
        return {"error": str(e), "analysis_type": analysis_type, "success": False}


@mcp.tool()
def extract_context(
    documents: List[str], extraction_type: str = "summary", max_length: int = 1000
) -> Dict[str, Any]:
    """
    Extract context from multiple documents.

    Args:
        documents: List of document contents
        extraction_type: Type of extraction (summary, keywords, themes)
        max_length: Maximum length of extracted context

    Returns:
        Dictionary with extracted context
    """
    try:
        logger.info(
            f"Extracting context from {len(documents)} documents, type: {extraction_type}"
        )

        if not documents:
            return {
                "error": "No documents provided",
                "extraction_type": extraction_type,
                "success": False,
            }

        # Combine all documents
        combined_content = "\n\n".join(documents)

        if extraction_type == "summary":
            extracted = _generate_summary(combined_content, max_length)
        elif extraction_type == "keywords":
            all_terms = []
            for doc in documents:
                terms = _extract_general_terms(doc)
                all_terms.extend(terms)

            # Count frequency across all documents
            term_freq = {}
            for term in all_terms:
                term_freq[term] = term_freq.get(term, 0) + 1

            top_terms = sorted(term_freq.items(), key=lambda x: x[1], reverse=True)[:20]
            extracted = ", ".join([term for term, _ in top_terms])
        elif extraction_type == "themes":
            # Simple theme extraction based on repeated patterns
            themes = []
            for doc in documents:
                if "problem" in doc.lower() or "issue" in doc.lower():
                    themes.append("Problem solving")
                if "solution" in doc.lower() or "approach" in doc.lower():
                    themes.append("Solutions")
                if "process" in doc.lower() or "workflow" in doc.lower():
                    themes.append("Process improvement")
                if "data" in doc.lower() or "analysis" in doc.lower():
                    themes.append("Data analysis")

            extracted = ", ".join(list(set(themes)))
        else:
            # Default: truncated combined content
            extracted = (
                combined_content[:max_length] + "..."
                if len(combined_content) > max_length
                else combined_content
            )

        result = {
            "extraction_type": extraction_type,
            "document_count": len(documents),
            "total_length": len(combined_content),
            "extracted_length": len(extracted),
            "max_length": max_length,
            "context": extracted,
            "success": True,
        }

        logger.info(
            f"Context extraction completed: {len(extracted)} characters extracted"
        )
        return result

    except Exception as e:
        logger.error(f"Context extraction failed: {e}")
        return {"error": str(e), "extraction_type": extraction_type, "success": False}


@mcp.tool()
def search_patterns(
    content: str, pattern: str, case_sensitive: bool = False, context_lines: int = 0
) -> Dict[str, Any]:
    """
    Search for patterns in content with optional context.

    Args:
        content: Content to search
        pattern: Regular expression pattern to search for
        case_sensitive: Whether the search should be case sensitive
        context_lines: Number of context lines to include around matches

    Returns:
        Dictionary with search results
    """
    try:
        logger.info(
            f"Searching for pattern: {pattern}, case_sensitive: {case_sensitive}"
        )

        flags = 0 if case_sensitive else re.IGNORECASE
        lines = content.split("\n")
        matches = []

        for i, line in enumerate(lines):
            found = re.search(pattern, line, flags)
            if found:
                # Gather context lines
                start_line = max(0, i - context_lines)
                end_line = min(len(lines), i + context_lines + 1)

                context = []
                for j in range(start_line, end_line):
                    prefix = ">>> " if j == i else "    "
                    context.append(f"{prefix}{lines[j]}")

                matches.append(
                    {
                        "line_number": i + 1,
                        "line_content": line,
                        "match_position": found.start(),
                        "matched_text": found.group(),
                        "context": context if context_lines > 0 else None,
                    }
                )

                # Limit to 50 matches to prevent overwhelming output
                if len(matches) >= 50:
                    break

        result = {
            "pattern": pattern,
            "case_sensitive": case_sensitive,
            "context_lines": context_lines,
            "total_matches": len(matches),
            "matches": matches,
            "truncated": len(matches) >= 50,
            "success": True,
        }

        logger.info(f"Pattern search completed: {len(matches)} matches found")
        return result

    except re.error as e:
        logger.error(f"Invalid regular expression: {e}")
        return {
            "error": f"Invalid regular expression: {str(e)}",
            "pattern": pattern,
            "success": False,
        }
    except Exception as e:
        logger.error(f"Pattern search failed: {e}")
        return {"error": str(e), "pattern": pattern, "success": False}


if __name__ == "__main__":
    logger.info("Starting Context7 MCP server")
    mcp.run()
