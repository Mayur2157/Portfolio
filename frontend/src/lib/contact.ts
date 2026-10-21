// Mirrors backend/app/models/contact.py. The server is the enforcement point; this only saves a round trip.

export type ContactField = "name" | "email" | "subject" | "message";
export type ContactValues = Record<ContactField, string>;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const FIELD_LIMITS: Record<ContactField, number> = {
  name: 100,
  email: 254,
  subject: 150,
  message: 5000,
};

export const EMPTY_CONTACT: ContactValues = { name: "", email: "", subject: "", message: "" };

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Same messages the API returns, so client and server errors read identically. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(FIELD_LIMITS) as ContactField[]) {
    const value = values[field].trim();
    if (!value) {
      errors[field] = `Please enter your ${field}.`;
    } else if (value.length > FIELD_LIMITS[field]) {
      errors[field] = `Please keep your ${field} under ${FIELD_LIMITS[field]} characters.`;
    }
  }
  if (!errors.email && !EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address, like name@example.com.";
  }
  return errors;
}
