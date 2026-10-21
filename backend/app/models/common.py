"""
Module: app.models.common
Purpose: Response shapes shared across routers.
"""

from __future__ import annotations

from typing import Literal

from pydantic import BaseModel


class MessageResponse(BaseModel):
    message: str


class ErrorResponse(BaseModel):
    message: str
    errors: dict[str, str] | None = None


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
