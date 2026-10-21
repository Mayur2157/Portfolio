import { Mail, MapPin, Phone } from "lucide-react";
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
      <span className="grid size-10 shrink-0 place-items-center rounded-md border border-line bg-surface text-primary">{icon}</span>
      <span className="min-w-0">
        <span className="block font-mono text-meta text-muted">{label}</span>
        <span className="block break-words">{value}</span>
      </span>
    </>
  );
  return (
    <li>
      {href ? (
        <a
          href={href}
          className="flex items-center gap-3 rounded-md py-1 hover:text-primary"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {body}
          {external && <span className="sr-only">(opens in a new tab)</span>}
        </a>
      ) : (
        <div className="flex items-center gap-3 py-1">{body}</div>
      )}
    </li>
  );
}

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something"
      intro="Hiring for GenAI, RAG or voice-AI work, or want to compare notes on agent architectures? I'd like to hear from you."
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
        <Reveal>
          <ul className="space-y-4">
            <Channel icon={<Mail className="size-5" aria-hidden="true" />} label="Email" value={profile.email} href={`mailto:${profile.email}`} />
            <Channel icon={<Phone className="size-5" aria-hidden="true" />} label="Phone" value={profile.phone.display} href={profile.phone.href} />
            <Channel icon={<LinkedInIcon />} label="LinkedIn" value={profile.name} href={profile.linkedin} external />
            <Channel icon={<GitHubIcon />} label="GitHub" value="Mayur2157" href={profile.github} external />
            <Channel icon={<MapPin className="size-5" aria-hidden="true" />} label="Location" value={profile.location} />
          </ul>
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>
  );
}
