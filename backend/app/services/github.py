"""
Module: app.services.github
Purpose: Public repository stats from the GitHub REST API, cached in memory.
"""

from __future__ import annotations

import asyncio
import logging
import time

import httpx
from pydantic import ValidationError

from app.core.config import Settings
from app.models.github import RepoStats

logger = logging.getLogger(__name__)


class GitHubService:
    """Fetches repos at most once per cache period and serves the last good result on failure.

    Ceiling: the cache is per process. Fine for a single instance.
    """

    def __init__(self, client: httpx.AsyncClient, settings: Settings) -> None:
        self._client = client
        self._settings = settings
        self._repos: list[RepoStats] = []
        self._next_refresh = 0.0
        self._lock = asyncio.Lock()

    async def get_repos(self) -> list[RepoStats]:
        if time.monotonic() < self._next_refresh:
            return self._repos
        async with self._lock:
            # Another request may have refreshed the cache while this one waited.
            if time.monotonic() < self._next_refresh:
                return self._repos
            try:
                self._repos = await self._fetch()
                self._next_refresh = time.monotonic() + self._settings.github_cache_seconds
            except (httpx.HTTPError, ValueError, KeyError, TypeError, ValidationError):
                logger.warning("GitHub unavailable; serving %d cached repos", len(self._repos), exc_info=True)
                self._next_refresh = time.monotonic() + self._settings.github_retry_seconds
        return self._repos

    async def _fetch(self) -> list[RepoStats]:
        headers = {"Accept": "application/vnd.github+json"}
        if self._settings.github_token:
            headers["Authorization"] = f"Bearer {self._settings.github_token.get_secret_value()}"
        # 100 is GitHub's page-size maximum. Ceiling: more than 100 repos would need Link-header paging.
        response = await self._client.get(
            f"https://api.github.com/users/{self._settings.github_username}/repos",
            params={"per_page": 100, "type": "owner"},
            headers=headers,
        )
        response.raise_for_status()
        return [
            RepoStats(
                name=repo["name"],
                url=repo["html_url"],
                stars=repo["stargazers_count"],
                language=repo.get("language"),
            )
            for repo in response.json()
            if not repo.get("fork")
        ]
