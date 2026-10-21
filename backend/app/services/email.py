"""
Module: app.services.email
Purpose: Deliver contact-form messages to the site owner over SMTP.
"""

from __future__ import annotations

import asyncio
import logging
import smtplib
import ssl
from email.message import EmailMessage

from app.core.config import Settings
from app.core.errors import UpstreamUnavailableError
from app.models.contact import ContactRequest

logger = logging.getLogger(__name__)

SMTP_TIMEOUT_SECONDS = 15


class EmailService:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    async def send_contact(self, contact: ContactRequest) -> None:
        """Email the message to the owner, with the visitor as Reply-To."""
        settings = self._settings
        if not settings.smtp_username:
            logger.warning("SMTP is not configured; contact message not sent")
            raise UpstreamUnavailableError

        message = EmailMessage()
        message["Subject"] = f"Portfolio Contact: {contact.subject}"
        message["From"] = settings.smtp_sender or settings.smtp_username
        message["To"] = settings.contact_email
        message["Reply-To"] = contact.email
        message.set_content(
            "New contact form submission:\n\n"
            f"Name: {contact.name}\n"
            f"Email: {contact.email}\n"
            f"Subject: {contact.subject}\n\n"
            f"Message:\n{contact.message}\n\n"
            "---\nSent from the portfolio website"
        )

        try:
            await asyncio.to_thread(self._send, message)
        except (smtplib.SMTPException, OSError) as exc:
            # The traceback names only SMTP-level details, never the visitor's fields.
            logger.error("Contact email could not be sent", exc_info=True)
            raise UpstreamUnavailableError from exc

    def _send(self, message: EmailMessage) -> None:
        settings = self._settings
        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=SMTP_TIMEOUT_SECONDS) as smtp:
            smtp.starttls(context=ssl.create_default_context())
            smtp.login(settings.smtp_username, settings.smtp_password.get_secret_value())
            smtp.send_message(message)
