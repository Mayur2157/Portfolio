"""
Module: app.models.contact
Purpose: Contact form request contract. The frontend mirrors these limits as maxlength attributes.
"""

from __future__ import annotations

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class ContactRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    name: str = Field(min_length=1, max_length=100)
    email: EmailStr  # email-validator also enforces the 254-character limit.
    subject: str = Field(min_length=1, max_length=150)
    message: str = Field(min_length=1, max_length=5000)
    # Spam trap: hidden from people, filled in by bots.
    website: str = Field(default="", max_length=200)

    @field_validator("subject")
    @classmethod
    def subject_is_single_line(cls, value: str) -> str:
        # The subject becomes an email header, where a line break would allow header injection.
        if "\r" in value or "\n" in value:
            raise ValueError("Please keep the subject on a single line.")
        return value
