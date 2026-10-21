import { ArrowDown, Cpu, Download, Mail, Sparkles } from "lucide-react";

import { profile } from "../../content/profile";
import type { ReposState } from "../../hooks/useGithubRepos";
import { GitHubIcon, LinkedInIcon } from "../ui/BrandIcons";
import { Reveal } from "../ui/Reveal";
import { TelemetryBadge } from "../ui/TelemetryBadge";
import { AgentTrace } from "./AgentTrace";

export function Hero({ repos }: { repos: ReposState }) {
  return (
    <section id="home" aria-labelledby="home-title" className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-12 pb-20 sm:px-6 md:pt-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          {/* Top Sci-Fi Telemetry Status Bar */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <TelemetryBadge variant="primary">SYSTEM: ONLINE</TelemetryBadge>
            <TelemetryBadge variant="accent">
              <span className="flex items-center gap-1">
                <Cpu className="size-3" aria-hidden="true" />
                NEURAL_CORE: ACTIVE
              </span>
            </TelemetryBadge>
            <span className="hidden font-mono text-meta text-muted sm:inline-block">
              // {profile.city}
            </span>
          </div>

          <p className="eyebrow">
            <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
            {profile.title} · Applied AI Architect
          </p>

          <h1 id="home-title" className="glow-title mt-3 text-display font-bold tracking-tight">
            {profile.name}
          </h1>

          <p className="mt-5 max-w-xl text-lead leading-relaxed text-muted">
            {profile.tagline}
          </p>

          {/* Quick Technical Architecture Spec Badges */}
          <div className="mt-5 flex flex-wrap gap-2 text-meta">
            <span className="chip text-ink">LangGraph RAG</span>
            <span className="chip text-ink">Multimodal VLMs</span>
            <span className="chip text-ink">Voice AI & WebSockets</span>
            <span className="chip text-ink">M.Tech Applied AI (VNIT)</span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              View projects
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            {__HAS_RESUME__ && (
              <a
                href="/resume.pdf"
                download="Mayur Gadekar Resume.pdf"
                className="btn btn-secondary"
              >
                <Download className="size-4" aria-hidden="true" />
                Download resume
              </a>
            )}
            <a href="#contact" className="btn btn-secondary">
              <Mail className="size-4" aria-hidden="true" />
              Get in touch
            </a>
          </div>

          <ul className="mt-8 flex items-center gap-2" aria-label="Profiles">
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost px-3"
                aria-label="GitHub (opens in a new tab)"
              >
                <GitHubIcon />
              </a>
            </li>
            <li>
              <a
                href={profile.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost px-3"
                aria-label="LinkedIn (opens in a new tab)"
              >
                <LinkedInIcon />
              </a>
            </li>
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="btn btn-ghost px-3"
                aria-label={`Email ${profile.email}`}
              >
                <Mail className="size-5" aria-hidden="true" />
              </a>
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.15}>
          <AgentTrace repos={repos} />
        </Reveal>
      </div>
    </section>
  );
}
