"""
Module: app.services.contact
Purpose: Contact-form policy: spam trap, rate limit, then delivery.
"""

from __future__ import annotations

import logging

from app.core.errors import RateLimitedError
from app.core.rate_limit import RateLimiter
from app.models.contact import ContactRequest
from app.services.email import EmailService

logger = logging.getLogger(__name__)


class ContactService:
    def __init__(self, email: EmailService, limiter: RateLimiter) -> None:
        self._email = email
        self._limiter = limiter

    async def submit(self, contact: ContactRequest, client_ip: str) -> None:
        if contact.website:
            # Bots get the normal success reply so they don't learn to skip the field.
            logger.info("Contact form spam trap triggered; message discarded")
            return
        if self._limiter.hit(client_ip):
            raise RateLimitedError
        await self._email.send_contact(contact)
