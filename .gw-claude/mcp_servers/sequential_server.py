#!/usr/bin/env python3
# /// script
# dependencies = [
#     "fastmcp>=2.11.0",
#     "pydantic>=2.0.0",
# ]
# ///

"""
Sequential MCP Server for zero-install code-agent CLI.

Provides multi-step workflow analysis, task orchestration, and
sequential processing capabilities via MCP protocol.

Uses FastMCP 2.0+ framework with uv inline dependencies.
"""

import asyncio
import logging
import random
import sys
import time
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

# Configure logging to stderr to avoid corrupting JSON-RPC
logging.basicConfig(
    stream=sys.stderr,
    level=logging.INFO,
    format="[%(asctime)s] %(name)s %(levelname)s: %(message)s",
)

logger = logging.getLogger("sequential_server")

try:
    from fastmcp import FastMCP
    from pydantic import BaseModel
except ImportError as e:
    logger.error(f"Required dependencies not available: {e}")
    sys.exit(1)

# Initialize FastMCP server
mcp = FastMCP("sequential")


class WorkflowStep(BaseModel):
    """Model for a workflow step."""

    id: str
    name: str
    description: str
    dependencies: List[str] = []
    estimated_duration: int = 0  # in minutes
    status: str = "pending"  # pending, running, completed, failed
    result: Optional[Dict[str, Any]] = None
    started_at: Optional[str] = None
    completed_at: Optional[str] = None


class WorkflowRequest(BaseModel):
    """Request model for workflow creation."""

    name: str
    description: str
    steps: List[WorkflowStep]


class TaskSequence(BaseModel):
    """Model for a task sequence."""

    tasks: List[str]
    parallel: bool = False
    timeout: int = 300  # 5 minutes default


@mcp.tool()
async def create_workflow(
    name: str, description: str, steps: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Create a new sequential workflow.

    Args:
        name: Workflow name
        description: Workflow description
        steps: List of workflow steps with id, name, description, dependencies

    Returns:
        Dictionary with workflow details
    """
    try:
        logger.info(f"Creating workflow: {name}")

        # Validate and create workflow steps
        workflow_steps = []
        for step_data in steps:
            step = WorkflowStep(
                id=step_data.get("id", f"step_{len(workflow_steps) + 1}"),
                name=step_data.get("name", ""),
                description=step_data.get("description", ""),
                dependencies=step_data.get("dependencies", []),
                estimated_duration=step_data.get("estimated_duration", 5),
            )
            workflow_steps.append(step)

        # Validate dependencies
        step_ids = {step.id for step in workflow_steps}
        for step in workflow_steps:
            for dep in step.dependencies:
                if dep not in step_ids:
                    return {
                        "error": f"Invalid dependency '{dep}' in step '{step.id}'",
                        "success": False,
                    }

        # Check for circular dependencies
        if _has_circular_dependencies(workflow_steps):
            return {
                "error": "Circular dependencies detected in workflow",
                "success": False,
            }

        # Calculate execution order
        execution_order = _calculate_execution_order(workflow_steps)

        workflow = {
            "id": f"workflow_{int(time.time())}",
            "name": name,
            "description": description,
            "steps": [step.model_dump() for step in workflow_steps],
            "execution_order": execution_order,
            "total_steps": len(workflow_steps),
            "estimated_duration": sum(
                step.estimated_duration for step in workflow_steps
            ),
            "created_at": datetime.now().isoformat(),
            "status": "created",
        }

        logger.info(f"Workflow created: {workflow['id']}")
        return {"workflow": workflow, "success": True}

    except Exception as e:
        logger.error(f"Failed to create workflow: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
async def analyze_workflow(workflow_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a workflow for optimization opportunities.

    Args:
        workflow_data: Workflow dictionary to analyze

    Returns:
        Dictionary with analysis results
    """
    try:
        logger.info("Analyzing workflow for optimization")

        steps = workflow_data.get("steps", [])
        if not steps:
            return {"error": "No steps found in workflow", "success": False}

        analysis = {
            "total_steps": len(steps),
            "sequential_duration": sum(
                step.get("estimated_duration", 0) for step in steps
            ),
            "parallelization_opportunities": [],
            "bottlenecks": [],
            "optimization_suggestions": [],
            "complexity_score": _calculate_complexity_score(steps),
            "risk_assessment": _assess_workflow_risks(steps),
        }

        # Find parallelization opportunities
        parallel_groups = _find_parallel_opportunities(steps)
        analysis["parallelization_opportunities"] = parallel_groups

        # Calculate optimized duration if parallelized
        if parallel_groups:
            optimized_duration = _calculate_optimized_duration(steps, parallel_groups)
            analysis["optimized_duration"] = optimized_duration
            analysis["time_savings"] = (
                analysis["sequential_duration"] - optimized_duration
            )

        # Identify bottlenecks
        bottlenecks = _identify_bottlenecks(steps)
        analysis["bottlenecks"] = bottlenecks

        # Generate optimization suggestions
        suggestions = _generate_optimization_suggestions(analysis)
        analysis["optimization_suggestions"] = suggestions

        logger.info("Workflow analysis completed")
        return {"analysis": analysis, "success": True}

    except Exception as e:
        logger.error(f"Workflow analysis failed: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
async def execute_sequence(
    tasks: List[str], parallel: bool = False, timeout: int = 300
) -> Dict[str, Any]:
    """
    Execute a sequence of tasks.

    Args:
        tasks: List of task descriptions
        parallel: Whether to execute tasks in parallel
        timeout: Timeout in seconds

    Returns:
        Dictionary with execution results
    """
    try:
        logger.info(f"Executing sequence of {len(tasks)} tasks, parallel={parallel}")

        start_time = time.time()
        results = []

        if parallel:
            # Simulate parallel execution
            logger.info("Executing tasks in parallel")
            for i, task in enumerate(tasks):
                result = await _simulate_task_execution(task, f"task_{i + 1}")
                results.append(result)
        else:
            # Sequential execution
            logger.info("Executing tasks sequentially")
            for i, task in enumerate(tasks):
                result = await _simulate_task_execution(task, f"task_{i + 1}")
                results.append(result)

                # Check if task failed and should stop sequence
                if not result.get("success", False):
                    logger.warning(f"Task {i + 1} failed, stopping sequence")
                    break

        execution_time = time.time() - start_time
        successful_tasks = sum(1 for result in results if result.get("success", False))

        return {
            "execution_id": f"seq_{int(start_time)}",
            "total_tasks": len(tasks),
            "completed_tasks": len(results),
            "successful_tasks": successful_tasks,
            "failed_tasks": len(results) - successful_tasks,
            "execution_time": execution_time,
            "parallel_execution": parallel,
            "results": results,
            "success": successful_tasks > 0,
        }

    except Exception as e:
        logger.error(f"Sequence execution failed: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
async def optimize_workflow(workflow_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Optimize a workflow for better performance.

    Args:
        workflow_data: Workflow to optimize

    Returns:
        Dictionary with optimized workflow
    """
    try:
        logger.info("Optimizing workflow")

        original_steps = workflow_data.get("steps", [])
        if not original_steps:
            return {"error": "No steps found in workflow", "success": False}

        # Create optimized version
        optimized_workflow = workflow_data.copy()

        # Find parallel opportunities
        parallel_groups = _find_parallel_opportunities(original_steps)

        # Restructure steps for parallelization
        if parallel_groups:
            optimized_steps = _restructure_for_parallelization(
                original_steps, parallel_groups
            )
            optimized_workflow["steps"] = optimized_steps

            # Recalculate execution order
            execution_order = _calculate_execution_order_with_parallel(optimized_steps)
            optimized_workflow["execution_order"] = execution_order

        # Update duration estimates
        original_duration = sum(
            step.get("estimated_duration", 0) for step in original_steps
        )
        optimized_duration = _calculate_optimized_duration(
            optimized_workflow["steps"], parallel_groups if parallel_groups else []
        )

        optimized_workflow["estimated_duration"] = optimized_duration
        optimized_workflow["optimization_applied"] = True
        optimized_workflow["original_duration"] = original_duration
        optimized_workflow["time_savings"] = original_duration - optimized_duration
        optimized_workflow["optimized_at"] = datetime.now().isoformat()

        logger.info(
            f"Workflow optimized: {original_duration}min -> {optimized_duration}min"
        )

        return {
            "optimized_workflow": optimized_workflow,
            "improvements": {
                "time_savings": original_duration - optimized_duration,
                "parallelization_applied": len(parallel_groups) > 0,
                "optimization_ratio": (original_duration - optimized_duration)
                / original_duration
                if original_duration > 0
                else 0,
            },
            "success": True,
        }

    except Exception as e:
        logger.error(f"Workflow optimization failed: {e}")
        return {"error": str(e), "success": False}


@mcp.tool()
async def health_check() -> Dict[str, Any]:
    """
    Perform health check on the Sequential server.

    Returns:
        Dictionary with health status
    """
    try:
        return {
            "status": "healthy",
            "server": "sequential",
            "version": "2.0.0",
            "capabilities": [
                "workflow_creation",
                "workflow_analysis",
                "sequence_execution",
                "workflow_optimization",
                "parallel_processing",
            ],
            "timestamp": str(time.time()),
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return {"status": "unhealthy", "error": str(e)}


# Helper functions
def _has_circular_dependencies(steps: List[WorkflowStep]) -> bool:
    """Check for circular dependencies in workflow steps."""
    # Simple DFS-based cycle detection
    visited = set()
    rec_stack = set()

    def dfs(step_id: str, step_deps: Dict[str, List[str]]) -> bool:
        visited.add(step_id)
        rec_stack.add(step_id)

        for dep in step_deps.get(step_id, []):
            if dep not in visited:
                if dfs(dep, step_deps):
                    return True
            elif dep in rec_stack:
                return True

        rec_stack.remove(step_id)
        return False

    # Build dependency mapping
    step_deps = {step.id: step.dependencies for step in steps}

    for step in steps:
        if step.id not in visited:
            if dfs(step.id, step_deps):
                return True

    return False


def _calculate_execution_order(steps: List[WorkflowStep]) -> List[str]:
    """Calculate execution order using topological sort."""
    # Build dependency graph
    in_degree = {step.id: 0 for step in steps}
    graph = {step.id: [] for step in steps}

    for step in steps:
        for dep in step.dependencies:
            graph[dep].append(step.id)
            in_degree[step.id] += 1

    # Topological sort using Kahn's algorithm
    queue = [step_id for step_id, degree in in_degree.items() if degree == 0]
    execution_order = []

    while queue:
        current = queue.pop(0)
        execution_order.append(current)

        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    return execution_order


def _find_parallel_opportunities(steps: List[Dict[str, Any]]) -> List[List[str]]:
    """Find steps that can be executed in parallel."""
    parallel_groups = []

    # Group steps by their dependencies
    dependency_groups = {}
    for step in steps:
        deps_key = tuple(sorted(step.get("dependencies", [])))
        if deps_key not in dependency_groups:
            dependency_groups[deps_key] = []
        dependency_groups[deps_key].append(step["id"])

    # Groups with same dependencies can run in parallel
    for deps, step_ids in dependency_groups.items():
        if len(step_ids) > 1:
            parallel_groups.append(step_ids)

    return parallel_groups


def _calculate_complexity_score(steps: List[Dict[str, Any]]) -> float:
    """Calculate workflow complexity score."""
    num_steps = len(steps)
    total_deps = sum(len(step.get("dependencies", [])) for step in steps)

    # Simple complexity heuristic
    base_complexity = min(num_steps / 10.0, 1.0)  # Max 1.0 for 10+ steps
    dep_complexity = min(total_deps / (num_steps * 2), 1.0)  # Dependency density

    return (base_complexity + dep_complexity) / 2.0


def _assess_workflow_risks(steps: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Assess risks in the workflow."""
    risks = {
        "high_dependency_steps": [],
        "long_duration_steps": [],
        "single_points_of_failure": [],
        "overall_risk": "low",
    }

    for step in steps:
        step_id = step["id"]
        dependencies = step.get("dependencies", [])
        duration = step.get("estimated_duration", 0)

        # High dependency risk
        if len(dependencies) > 3:
            risks["high_dependency_steps"].append(step_id)

        # Long duration risk
        if duration > 60:  # More than 1 hour
            risks["long_duration_steps"].append(step_id)

    # Determine overall risk
    total_risks = sum(
        len(risk_list) for risk_list in risks.values() if isinstance(risk_list, list)
    )
    if total_risks > len(steps) * 0.3:  # More than 30% of steps have risks
        risks["overall_risk"] = "high"
    elif total_risks > len(steps) * 0.1:  # More than 10% of steps have risks
        risks["overall_risk"] = "medium"

    return risks


def _identify_bottlenecks(steps: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Identify bottleneck steps in the workflow."""
    bottlenecks = []

    # Build dependency graph
    dependents = {step["id"]: [] for step in steps}
    for step in steps:
        for dep in step.get("dependencies", []):
            if dep in dependents:
                dependents[dep].append(step["id"])

    for step in steps:
        step_id = step["id"]
        duration = step.get("estimated_duration", 0)
        num_dependents = len(dependents[step_id])

        # A step is a bottleneck if it has high duration and many dependents
        if duration > 30 and num_dependents > 1:
            bottlenecks.append(
                {
                    "step_id": step_id,
                    "duration": duration,
                    "dependents": num_dependents,
                    "impact": duration * num_dependents,
                }
            )

    # Sort by impact
    bottlenecks.sort(key=lambda x: x["impact"], reverse=True)
    return bottlenecks


def _calculate_optimized_duration(
    steps: List[Dict[str, Any]], parallel_groups: List[List[str]]
) -> int:
    """Calculate optimized duration with parallelization."""
    if not parallel_groups:
        return sum(step.get("estimated_duration", 0) for step in steps)

    # Simple heuristic: parallel groups take time of longest step in group
    step_durations = {step["id"]: step.get("estimated_duration", 0) for step in steps}

    total_duration = 0
    processed_steps = set()

    for group in parallel_groups:
        if any(step_id in processed_steps for step_id in group):
            continue

        # Parallel group takes time of longest step
        group_duration = max(step_durations.get(step_id, 0) for step_id in group)
        total_duration += group_duration
        processed_steps.update(group)

    # Add remaining sequential steps
    for step in steps:
        if step["id"] not in processed_steps:
            total_duration += step_durations[step["id"]]

    return total_duration


def _generate_optimization_suggestions(analysis: Dict[str, Any]) -> List[str]:
    """Generate optimization suggestions based on analysis."""
    suggestions = []

    # Parallelization suggestions
    parallel_ops = analysis.get("parallelization_opportunities", [])
    if parallel_ops:
        suggestions.append(
            f"Consider parallelizing {len(parallel_ops)} groups of steps to save time"
        )

    # Bottleneck suggestions
    bottlenecks = analysis.get("bottlenecks", [])
    if bottlenecks:
        suggestions.append(
            f"Address {len(bottlenecks)} bottleneck steps to improve flow"
        )

    # Complexity suggestions
    complexity = analysis.get("complexity_score", 0)
    if complexity > 0.7:
        suggestions.append("Consider breaking down complex steps into smaller tasks")

    # Duration suggestions
    sequential_duration = analysis.get("sequential_duration", 0)
    if sequential_duration > 240:  # More than 4 hours
        suggestions.append(
            "Workflow is quite long - consider adding checkpoints or splitting"
        )

    return suggestions


def _restructure_for_parallelization(
    steps: List[Dict[str, Any]], parallel_groups: List[List[str]]
) -> List[Dict[str, Any]]:
    """Restructure workflow steps to indicate parallelization."""
    restructured = []

    # Mark parallel groups
    parallel_step_ids = set()
    for group in parallel_groups:
        parallel_step_ids.update(group)

    for step in steps:
        updated_step = step.copy()
        if step["id"] in parallel_step_ids:
            # Find which parallel group this step belongs to
            for i, group in enumerate(parallel_groups):
                if step["id"] in group:
                    updated_step["parallel_group"] = f"group_{i + 1}"
                    break
        restructured.append(updated_step)

    return restructured


def _calculate_execution_order_with_parallel(
    steps: List[Dict[str, Any]],
) -> List[Union[str, List[str]]]:
    """Calculate execution order considering parallel groups."""
    # Group parallel steps
    parallel_groups = {}
    sequential_steps = []

    for step in steps:
        if "parallel_group" in step:
            group_id = step["parallel_group"]
            if group_id not in parallel_groups:
                parallel_groups[group_id] = []
            parallel_groups[group_id].append(step["id"])
        else:
            sequential_steps.append(step["id"])

    # Simple ordering: parallel groups as sublists, sequential as individual items
    execution_order = []
    processed_groups = set()

    for step in steps:
        if "parallel_group" in step:
            group_id = step["parallel_group"]
            if group_id not in processed_groups:
                execution_order.append(parallel_groups[group_id])
                processed_groups.add(group_id)
        else:
            execution_order.append(step["id"])

    return execution_order


async def _simulate_task_execution(
    task_description: str, task_id: str
) -> Dict[str, Any]:
    """Simulate execution of a task."""
    start_time = time.time()

    # Simulate some processing time (0.1-0.5 seconds)
    processing_time = random.uniform(0.1, 0.5)
    await asyncio.sleep(processing_time)

    # Simulate 90% success rate
    success = random.random() > 0.1

    result = {
        "task_id": task_id,
        "description": task_description,
        "success": success,
        "execution_time": time.time() - start_time,
        "result": {
            "status": "completed" if success else "failed",
            "message": f"Task '{task_description}' executed successfully"
            if success
            else f"Task '{task_description}' failed",
            "processed_items": random.randint(1, 100) if success else 0,
        },
    }

    return result


def main():
    """Main entry point for the Sequential MCP server."""
    logger.info("Starting Sequential MCP Server...")

    try:
        # Use FastMCP 2.0+ simple run method
        mcp.run()
    except KeyboardInterrupt:
        logger.info("Sequential server stopped by user")
    except Exception as e:
        logger.error(f"Sequential server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
