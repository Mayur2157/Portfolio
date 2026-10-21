import { Lock, Mail, MapPin, Phone, Radio } from "lucide-react";
import type { ReactNode } from "react";

import { profile } from "../../content/profile";
import { GitHubIcon, LinkedInIcon } from "../ui/BrandIcons";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";
import { ContactForm } from "./ContactForm";

interface ChannelProps {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}

function Channel({ icon, label, value, href, external }: ChannelProps) {
  const body = (
    <>
      <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-primary">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block font-mono text-[0.7rem] uppercase tracking-wider text-muted">{label}</span>
        <span className="block break-words font-medium text-ink">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="flex items-center gap-3 rounded-lg p-2 transition-all hover:bg-surface hover:text-primary"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {body}
          {external && <span className="sr-only">(opens in a new tab)</span>}
        </a>
      ) : (
        <div className="flex items-center gap-3 p-2">{body}</div>
      )}
    </li>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Transmission Terminal"
      title="Establish Neural Uplink"
      intro="Hiring for GenAI, LangGraph RAG or voice-AI engineering, or want to discuss agent architectures? Send a transmission."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <div className="hud-card relative p-5 sm:p-6 h-full">
            {/* Corner Crosshairs */}
            <span aria-hidden="true" className="hud-corner hud-corner-tl" />
            <span aria-hidden="true" className="hud-corner hud-corner-tr" />
            <span aria-hidden="true" className="hud-corner hud-corner-bl" />
            <span aria-hidden="true" className="hud-corner hud-corner-br" />

            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <span className="flex items-center gap-2 font-mono text-meta font-bold uppercase tracking-wider text-primary">
                <Radio className="size-4" aria-hidden="true" />
                Direct Channels
              </span>
              <span className="flex items-center gap-1 font-mono text-[0.65rem] text-muted">
                <Lock className="size-3 text-primary" aria-hidden="true" />
                END_TO_END
              </span>
            </div>

            <ul className="space-y-3">
              <Channel
                icon={<Mail className="size-4" aria-hidden="true" />}
                label="Primary Email"
                value={profile.email}
                href={`mailto:${profile.email}`}
              />
              <Channel
                icon={<Phone className="size-4" aria-hidden="true" />}
                label="Direct Line"
                value={profile.phone.display}
                href={profile.phone.href}
              />
              <Channel
                icon={<LinkedInIcon className="size-4" />}
                label="LinkedIn Profile"
                value="Mayur Gadekar"
                href={profile.linkedin}
                external
              />
              <Channel
                icon={<GitHubIcon className="size-4" />}
                label="GitHub Vault"
                value="Mayur2157"
                href={profile.github}
                external
              />
              <Channel
                icon={<MapPin className="size-4" aria-hidden="true" />}
                label="Base Location"
                value={profile.location}
              />
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
