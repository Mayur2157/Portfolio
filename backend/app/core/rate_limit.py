"""
Module: app.core.rate_limit
Purpose: Sliding-window rate limiter keyed by client IP.
"""

from __future__ import annotations

import threading
import time


class RateLimiter:
    """Allow `limit` hits per key within `window_seconds`.

    Ceiling: counts live in this process's memory, so they reset on restart and are not
    shared between worker processes. Upgrade path: a Redis-backed limiter.
    """

    _PRUNE_THRESHOLD = 1000

    def __init__(self, limit: int, window_seconds: float) -> None:
        self._limit = limit
        self._window = window_seconds
        self._hits: dict[str, list[float]] = {}
        self._lock = threading.Lock()

    def hit(self, key: str) -> bool:
        """Record an attempt for key; return True if it is over the limit (and not recorded)."""
        now = time.monotonic()
        with self._lock:
            if len(self._hits) > self._PRUNE_THRESHOLD:
                stale = [k for k, v in self._hits.items() if now - v[-1] > self._window]
                for k in stale:
                    del self._hits[k]
            recent = [t for t in self._hits.get(key, []) if now - t < self._window]
            limited = len(recent) >= self._limit
            if not limited:
                recent.append(now)
            self._hits[key] = recent
            return limited

    def reset(self) -> None:
        with self._lock:
            self._hits.clear()
