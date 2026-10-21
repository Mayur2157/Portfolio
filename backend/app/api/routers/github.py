from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.deps import get_github_service
from app.models.github import ReposResponse
from app.services.github import GitHubService

router = APIRouter(prefix="/github", tags=["github"])


@router.get("/repos", response_model=ReposResponse)
async def list_repos(service: GitHubService = Depends(get_github_service)) -> ReposResponse:
    """Public repository stars and languages; empty when GitHub is unavailable."""
    return ReposResponse(repos=await service.get_repos())
