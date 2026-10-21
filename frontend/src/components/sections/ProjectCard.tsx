import { ArrowUpRight, Cpu, FlaskConical, Lock, Star } from "lucide-react";

import type { Project } from "../../content/types";
import type { RepoStats } from "../../lib/api";
import { GitHubIcon } from "../ui/BrandIcons";

export const KIND_BADGE = {
  private: { label: "Private codebase", tag: "PROD_SYSTEM", Icon: Lock },
  research: { label: "Research", tag: "RESEARCH_PAPER", Icon: FlaskConical },
} as const;

const MAX_CHIPS = 5;

interface ProjectCardProps {
  project: Project;
  stats?: RepoStats;
  onOpen: (project: Project, opener: HTMLButtonElement) => void;
}

export function ProjectCard({ project, stats, onOpen }: ProjectCardProps) {
  const badge = project.kind === "open-source" ? null : KIND_BADGE[project.kind];
  const extra = project.stack.length - MAX_CHIPS;

  return (
    <article className="hud-card relative flex h-full flex-col p-5 sm:p-6 transition-all duration-200 hover:-translate-y-1">
      {/* Sci-Fi Corner Crosshairs */}
      <span aria-hidden="true" className="hud-corner hud-corner-tl" />
      <span aria-hidden="true" className="hud-corner hud-corner-tr" />
      <span aria-hidden="true" className="hud-corner hud-corner-bl" />
      <span aria-hidden="true" className="hud-corner hud-corner-br" />

      {/* Card Header Telemetry */}
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-meta text-muted">
        <span className="flex items-center gap-1.5">
          <Cpu className="size-3.5 text-primary opacity-80" aria-hidden="true" />
          {project.period}
        </span>
        <div className="flex items-center gap-2">
          {badge ? (
            <span className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-accent">
              <badge.Icon className="size-3.5" aria-hidden="true" />
              {badge.label}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-primary">
              <GitHubIcon className="size-3.5" />
              OSS
            </span>
          )}
          {stats && (
            <span className="inline-flex items-center gap-1 text-ink">
              <Star className="size-3.5 text-accent fill-accent" aria-hidden="true" />
              {stats.stars}
              <span className="sr-only">{stats.stars === 1 ? "star" : "stars"} on GitHub</span>
            </span>
          )}
        </div>
      </div>

      <h3 className="mt-3 text-lead font-semibold tracking-tight text-ink">{project.title}</h3>
      <p className="mt-2 text-small leading-relaxed text-muted">{project.summary}</p>

      {/* Tech Stack Parameter Chips */}
      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.stack.slice(0, MAX_CHIPS).map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
        {extra > 0 && (
          <li className="chip text-primary">
            +{extra}
            <span className="sr-only"> more</span>
          </li>
        )}
      </ul>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-wrap items-center gap-2 pt-6 border-t border-line/60">
        <button
          type="button"
          className="btn btn-secondary text-small"
          onClick={(event) => onOpen(project, event.currentTarget)}
          aria-haspopup="dialog"
        >
          Read details<span className="sr-only">: {project.title}</span>
        </button>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost text-small">
            <GitHubIcon className="size-4" />
            Code
            <ArrowUpRight className="size-4" aria-hidden="true" />
            <span className="sr-only">: {project.title} on GitHub (opens in a new tab)</span>
          </a>
        )}
      </div>
    </article>
  );
}
