import { ArrowDown, Download, Mail } from "lucide-react";

import { profile } from "../../content/profile";
import type { ReposState } from "../../hooks/useGithubRepos";
import { GitHubIcon, LinkedInIcon } from "../ui/BrandIcons";
import { Reveal } from "../ui/Reveal";
import { AgentTrace } from "./AgentTrace";

export function Hero({ repos }: { repos: ReposState }) {
  return (
    <section id="home" aria-labelledby="home-title" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 -z-10 size-[36rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 md:pt-24 lg:grid-cols-[1.1fr_1fr]">
        <Reveal>
          <p className="eyebrow">
            {profile.title} · {profile.city}
          </p>
          <h1 id="home-title" className="mt-3 text-display font-semibold tracking-tight">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-xl text-lead text-muted">{profile.tagline}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">
              View projects
              <ArrowDown className="size-4" aria-hidden="true" />
            </a>
            {__HAS_RESUME__ && (
              <a href="/resume.pdf" download="Mayur Gadekar Resume.pdf" className="btn btn-secondary">
                <Download className="size-4" aria-hidden="true" />
                Download resume
              </a>
            )}
            <a href="#contact" className="btn btn-secondary">
              <Mail className="size-4" aria-hidden="true" />
              Get in touch
            </a>
          </div>

          <ul className="mt-8 flex gap-2" aria-label="Profiles">
            <li>
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-3" aria-label="GitHub (opens in a new tab)">
                <GitHubIcon />
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="btn btn-ghost px-3" aria-label="LinkedIn (opens in a new tab)">
                <LinkedInIcon />
              </a>
            </li>
            <li>
              <a href={`mailto:${profile.email}`} className="btn btn-ghost px-3" aria-label={`Email ${profile.email}`}>
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
