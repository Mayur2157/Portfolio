from __future__ import annotations

from fastapi import APIRouter

from app.models.common import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    """Liveness check for the hosting platform."""
    return HealthResponse()
