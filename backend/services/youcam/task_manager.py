"""
Asynchronous Task Lifecycle & Polling Manager with Idempotency Protection
"""

import asyncio
import hashlib
import json
import logging
import time
from typing import Dict, Any, Optional
import httpx

from backend.services.youcam.authentication import YouCamAuthManager
from backend.services.youcam.exceptions import YouCamTaskError, YouCamTimeoutError, YouCamBaseException, YouCamValidationError
from backend.services.youcam.schemas import TaskCreationResponse, TaskPollResponse

logger = logging.getLogger("skinmate.youcam.task_manager")

# In-memory idempotency cache: { idempotency_key: { "task_id": str, "timestamp": float, "result": Any } }
TASK_CACHE: Dict[str, Dict[str, Any]] = {}
CACHE_TTL_SECONDS = 7200  # 2 hours


class TaskManager:
    """
    Orchestrates YouCam task creation, status polling, and duplicate prevention.
    """
    def __init__(self, auth: YouCamAuthManager):
        self.auth = auth

    @staticmethod
    def generate_idempotency_key(service_slug: str, file_id: str, options: Optional[Dict[str, Any]] = None) -> str:
        """Computes deterministic hash for service call deduplication."""
        opts_str = json.dumps(options or {}, sort_keys=True)
        raw = f"{service_slug}:{file_id}:{opts_str}"
        return hashlib.sha256(raw.encode()).hexdigest()

    async def create_task(
        self,
        service_slug: str,
        file_id: str,
        options: Optional[Dict[str, Any]] = None,
        unit_cost: int = 1,
        enforce_idempotency: bool = True
    ) -> TaskCreationResponse:
        """
        Creates an asynchronous YouCam task with duplicate submission protection.
        """
        options = options or {}
        idempotency_key = self.generate_idempotency_key(service_slug, file_id, options)

        # 1. Check idempotency cache
        if enforce_idempotency and idempotency_key in TASK_CACHE:
            cached_entry = TASK_CACHE[idempotency_key]
            if time.time() - cached_entry["timestamp"] < CACHE_TTL_SECONDS:
                cached_task_id = cached_entry["task_id"]
                logger.info(
                    "Idempotency hit for %s on %s. Returning cached task_id: %s (Units saved: %d)",
                    service_slug, file_id, cached_task_id, unit_cost
                )
                return TaskCreationResponse(
                    status="success",
                    task_id=cached_task_id,
                    service_slug=service_slug,
                    estimated_wait_time_sec=1,
                    is_cached=True,
                    is_mock=not self.auth.is_configured
                )

        # 2. Check Mock Mode
        if not self.auth.is_configured:
            mock_task_id = f"mock-task-{service_slug}-{idempotency_key[:10]}"
            TASK_CACHE[idempotency_key] = {
                "task_id": mock_task_id,
                "timestamp": time.time(),
                "service_slug": service_slug,
                "file_id": file_id,
                "options": options
            }
            logger.info("Mock task registered: %s for %s", mock_task_id, service_slug)
            return TaskCreationResponse(
                status="success",
                task_id=mock_task_id,
                service_slug=service_slug,
                estimated_wait_time_sec=2,
                is_cached=False,
                is_mock=True
            )

        # 3. Payload preparation: Resolve src_file_url or src_file_id
        payload = {**(options or {})}

        # Extract candidate URL from options (src_file_url or image_url)
        candidate_url = payload.pop("image_url", None) or payload.get("src_file_url")
        if candidate_url and isinstance(candidate_url, str) and candidate_url.startswith(("http://", "https://")):
            payload["src_file_url"] = candidate_url

        if "src_file_url" not in payload:
            if file_id and (file_id.startswith("http://") or file_id.startswith("https://")):
                payload["src_file_url"] = file_id
            elif file_id and not file_id.startswith("mock-") and not file_id.startswith("file_mock"):
                payload["src_file_id"] = file_id
                payload["file_id"] = file_id

        # If neither is present, fail fast before making network calls or deducting units
        if not payload.get("src_file_id") and not payload.get("src_file_url") and not payload.get("src_file_urls") and not payload.get("src_file_ids"):
            raise YouCamValidationError(
                "A valid uploaded portrait or accessible public image URL is required for live YouCam analysis."
            )

        # Service specific schemas: hair-type-detection requires 3 views (triplicate single portrait)
        if service_slug == "hair-type-detection":
            if "src_file_url" in payload:
                payload["src_file_urls"] = [payload.pop("src_file_url")] * 3
            elif "src_file_id" in payload:
                payload["src_file_ids"] = [payload.pop("src_file_id")] * 3
                payload.pop("file_id", None)

        # 4. Live Execution: Deduct units safely before calling provider
        self.auth.deduct_units(count=unit_cost, service_slug=service_slug)

        headers = {
            **self.auth.get_auth_headers(),
            "Content-Type": "application/json"
        }

        async with httpx.AsyncClient(timeout=30.0) as client:
            try:
                res = await client.post(
                    f"{self.auth.base_url}/s2s/v2.0/task/{service_slug}",
                    json=payload,
                    headers=headers
                )
                res.raise_for_status()
                data = res.json()
            except httpx.HTTPStatusError as e:
                err_text = e.response.text
                try:
                    err_json = e.response.json()
                    err_msg = err_json.get("error_message") or err_json.get("error") or err_text
                except Exception:
                    err_msg = err_text
                raise YouCamTaskError(
                    f"YouCam task creation failed ({e.response.status_code}): {err_msg}",
                    details={"service_slug": service_slug, "payload": payload}
                )
            except Exception as e:
                raise YouCamBaseException(f"YouCam API task connection error: {str(e)}", status_code=502)

        task_data = data.get("data", data)
        task_id = task_data.get("task_id") or data.get("task_id")
        if not task_id:
            raise YouCamTaskError(f"YouCam did not return a valid task_id: {data}")

        # Cache task mapping
        TASK_CACHE[idempotency_key] = {
            "task_id": task_id,
            "timestamp": time.time(),
            "service_slug": service_slug,
            "file_id": file_id,
            "options": options
        }

        return TaskCreationResponse(
            status="success",
            task_id=task_id,
            service_slug=service_slug,
            estimated_wait_time_sec=task_data.get("estimated_wait_time_sec", data.get("estimated_wait_time_sec", 3)),
            is_cached=False,
            is_mock=False
        )

    async def poll_task(
        self,
        service_slug: str,
        task_id: str,
        max_attempts: int = 20,
        interval_sec: float = 1.5
    ) -> TaskPollResponse:
        """
        Polls YouCam status until task completion or timeout.
        """
        # If task is a mock task, delegate to immediate mock response
        if task_id.startswith("mock-task") or not self.auth.is_configured:
            await asyncio.sleep(0.8)  # Natural processing feel
            return TaskPollResponse(
                status="success",
                task_id=task_id,
                service_slug=service_slug,
                progress_pct=100,
                is_mock=True
            )

        headers = self.auth.get_auth_headers()
        url = f"{self.auth.base_url}/s2s/v2.0/task/{service_slug}/{task_id}"

        async with httpx.AsyncClient(timeout=15.0) as client:
            for attempt in range(1, max_attempts + 1):
                try:
                    res = await client.get(url, headers=headers)
                    res.raise_for_status()
                    data = res.json()
                except Exception as e:
                    logger.warning("Polling attempt %d/%d encountered transient error: %s", attempt, max_attempts, str(e))
                    if attempt == max_attempts:
                        raise YouCamBaseException(f"Failed to poll YouCam task status: {str(e)}", status_code=502)
                    await asyncio.sleep(interval_sec)
                    continue

                task_data = data.get("data", data)
                status = task_data.get("task_status") or task_data.get("status") or data.get("status")
                logger.debug("Task %s status at attempt %d: %s", task_id, attempt, status)

                if status in ("success", "completed", "done", 200):
                    return TaskPollResponse(
                        status="success",
                        task_id=task_id,
                        service_slug=service_slug,
                        progress_pct=100,
                        result=task_data.get("result") or task_data.get("results") or task_data,
                        is_mock=False
                    )
                elif status in ("error", "failed"):
                    err_msg = task_data.get("error_message") or task_data.get("error") or data.get("error_message") or data.get("error", "Task processing failed at YouCam provider.")
                    raise YouCamTaskError(err_msg, task_id=task_id, details=data)

                # Still running or pending
                progress = data.get("progress_pct") or min(95, int((attempt / max_attempts) * 100))
                await asyncio.sleep(interval_sec)

        raise YouCamTimeoutError(f"Task {task_id} timed out after {max_attempts * interval_sec:.1f} seconds.", task_id=task_id)
