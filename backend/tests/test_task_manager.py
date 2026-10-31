"""
Unit Tests for Task Manager & Idempotency Protection
"""

import pytest
from backend.services.youcam.authentication import YouCamAuthManager
from backend.services.youcam.task_manager import TaskManager, TASK_CACHE

@pytest.mark.asyncio
async def test_mock_task_creation_and_polling():
    auth = YouCamAuthManager(api_key="")  # Unconfigured = Mock Mode
    tm = TaskManager(auth)

    res = await tm.create_task(
        service_slug="skin-analysis",
        file_id="file_abc123",
        options={"concerns": ["pores"]}
    )

    assert res.status == "success"
    assert res.is_mock is True
    assert "mock-task-skin-analysis" in res.task_id

    # Test polling
    poll = await tm.poll_task("skin-analysis", res.task_id)
    assert poll.status == "success"
    assert poll.is_mock is True

@pytest.mark.asyncio
async def test_idempotency_duplicate_prevention():
    auth = YouCamAuthManager(api_key="")
    tm = TaskManager(auth)

    # First request
    res1 = await tm.create_task(
        service_slug="hair-transfer",
        file_id="file_portrait_99",
        options={"style_id": "bob"},
        unit_cost=2
    )
    assert res1.is_cached is False

    # Second identical request (duplicate submission)
    res2 = await tm.create_task(
        service_slug="hair-transfer",
        file_id="file_portrait_99",
        options={"style_id": "bob"},
        unit_cost=2
    )
    # Must hit cache
    assert res2.is_cached is True
    assert res2.task_id == res1.task_id
