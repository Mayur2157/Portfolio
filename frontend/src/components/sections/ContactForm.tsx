import { LoaderCircle, Radio, Send, ShieldCheck } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";

import { profile } from "../../content/profile";
import { ApiError, apiRequest } from "../../lib/api";
import {
  EMPTY_CONTACT,
  FIELD_LIMITS,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactValues,
} from "../../lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent"; message: string }
  | { kind: "failed"; message: string };

const FIELDS: {
  name: ContactField;
  label: string;
  type: "text" | "email";
  autoComplete?: string;
  multiline?: boolean;
}[] = [
  { name: "name", label: "Name", type: "text", autoComplete: "name" },
  { name: "email", label: "Email", type: "email", autoComplete: "email" },
  { name: "subject", label: "Subject", type: "text" },
  { name: "message", label: "Message", type: "text", multiline: true },
];

const NETWORK_ERROR = `Couldn't reach the server. Check your connection and try again, or email ${profile.email}.`;

export function ContactForm() {
  const [values, setValues] = useState<ContactValues>(EMPTY_CONTACT);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const honeypot = useRef<HTMLInputElement>(null);
  const fieldRefs = useRef<Partial<Record<ContactField, HTMLInputElement | HTMLTextAreaElement | null>>>({});

  const showErrors = (next: ContactErrors) => {
    setErrors(next);
    const first = FIELDS.find((field) => next[field.name]);
    if (first) fieldRefs.current[first.name]?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === "sending") return;

    const clientErrors = validateContact(values);
    if (Object.keys(clientErrors).length > 0) {
      setStatus({ kind: "idle" });
      showErrors(clientErrors);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const body = await apiRequest<{ message: string }>("/api/v1/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot.current?.value ?? "" }),
      });
      setValues(EMPTY_CONTACT);
      setStatus({ kind: "sent", message: body.message });
    } catch (error) {
      if (error instanceof ApiError && error.body) {
        if (error.body.errors) showErrors(error.body.errors as ContactErrors);
        setStatus({ kind: "failed", message: error.body.message });
      } else {
        setStatus({ kind: "failed", message: NETWORK_ERROR });
      }
    }
  };

  const sending = status.kind === "sending";

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      aria-describedby="contact-privacy"
      className="hud-card relative space-y-5 p-5 sm:p-7"
    >
      {/* Sci-Fi Corner Crosshairs */}
      <span aria-hidden="true" className="hud-corner hud-corner-tl" />
      <span aria-hidden="true" className="hud-corner hud-corner-tr" />
      <span aria-hidden="true" className="hud-corner hud-corner-bl" />
      <span aria-hidden="true" className="hud-corner hud-corner-br" />

      {/* Terminal Telemetry Header */}
      <div className="flex items-center justify-between border-b border-line pb-3">
        <span className="flex items-center gap-2 font-mono text-meta font-bold uppercase tracking-wider text-primary">
          <Radio className="size-4" aria-hidden="true" />
          Send Transmission
        </span>
        <span className="flex items-center gap-1 font-mono text-[0.68rem] text-muted">
          <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
          TLS_ENCRYPTED
        </span>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const error = errors[field.name];
          const id = `contact-${field.name}`;
          const shared = {
            id,
            name: field.name,
            value: values[field.name],
            maxLength: FIELD_LIMITS[field.name],
            required: true,
            "aria-invalid": error ? true : undefined,
            "aria-describedby": error ? `${id}-error` : undefined,
            className:
              "mt-1.5 block w-full rounded-lg border border-field bg-surface-2/60 px-3.5 py-2.5 text-ink placeholder:text-muted focus-visible:border-primary focus-visible:shadow-[0_0_12px_var(--glow-cyan)] aria-invalid:border-accent transition-all",
          };
          const update = (value: string) => {
            setValues((current) => ({ ...current, [field.name]: value }));
            if (error) setErrors((current) => ({ ...current, [field.name]: undefined }));
          };
          return (
            <div key={field.name} className={field.multiline || field.name === "subject" ? "sm:col-span-2" : undefined}>
              <div className="flex items-center justify-between">
                <label htmlFor={id} className="text-small font-semibold text-ink">
                  {field.label}
                </label>
                <span className="font-mono text-[0.65rem] text-muted" aria-hidden="true">
                  REQ // 01
                </span>
              </div>
              {field.multiline ? (
                <textarea
                  {...shared}
                  ref={(element) => {
                    fieldRefs.current[field.name] = element;
                  }}
                  rows={5}
                  onChange={(event) => update(event.target.value)}
                />
              ) : (
                <input
                  {...shared}
                  ref={(element) => {
                    fieldRefs.current[field.name] = element;
                  }}
                  type={field.type}
                  autoComplete={field.autoComplete}
                  onChange={(event) => update(event.target.value)}
                />
              )}
              {error && (
                <p id={`${id}-error`} className="mt-1.5 font-mono text-small text-accent">
                  {error}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Spam trap: hidden from people and assistive tech, filled in by bots. */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input ref={honeypot} id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <p id="contact-privacy" className="text-meta text-muted border-t border-line/60 pt-4 leading-relaxed">
        <strong className="font-semibold text-ink">Privacy notice (v1, 21 Oct 2026):</strong> your name, email, subject and
        message are used only to reply to your enquiry. They are delivered to my email inbox and are not stored on this
        website or shared with anyone else. To have your message deleted, or for any privacy question, email{" "}
        <a href={`mailto:${profile.email}`} className="text-primary underline underline-offset-2 hover:text-ink">
          {profile.email}
        </a>
        .
      </p>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? (
            <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
          ) : (
            <Send className="size-4" aria-hidden="true" />
          )}
          {sending ? "Sending…" : "Send message"}
        </button>
        <p role="status" className="font-mono text-small text-primary font-medium">
          {status.kind === "sent" ? status.message : ""}
        </p>
      </div>
      <p role="alert" className="font-mono text-small text-accent empty:hidden">
        {status.kind === "failed" ? status.message : ""}
      </p>
    </form>
  );
}
