"""
Module: app.models.github
Purpose: Public repository stats returned to the frontend.
"""

from __future__ import annotations

from pydantic import BaseModel


class RepoStats(BaseModel):
    name: str
    url: str
    stars: int
    language: str | None = None


class ReposResponse(BaseModel):
    repos: list[RepoStats]
