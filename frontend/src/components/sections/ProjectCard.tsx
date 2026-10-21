import { ArrowUpRight, FlaskConical, Lock, Star } from "lucide-react";

import type { Project } from "../../content/types";
import type { RepoStats } from "../../lib/api";
import { GitHubIcon } from "../ui/BrandIcons";

export const KIND_BADGE = {
  private: { label: "Private codebase", Icon: Lock },
  research: { label: "Research", Icon: FlaskConical },
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
    <article className="card flex h-full flex-col p-5 transition-colors hover:border-primary/60 sm:p-6">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-meta text-muted">
        <span>{project.period}</span>
        {badge && (
          <span className="inline-flex items-center gap-1 text-accent">
            <badge.Icon className="size-3.5" aria-hidden="true" />
            {badge.label}
          </span>
        )}
        {stats && (
          <span className="inline-flex items-center gap-1">
            <Star className="size-3.5" aria-hidden="true" />
            {stats.stars}
            <span className="sr-only">{stats.stars === 1 ? "star" : "stars"} on GitHub</span>
          </span>
        )}
      </div>

      <h3 className="mt-2 text-lead font-semibold tracking-tight">{project.title}</h3>
      <p className="mt-2 text-small text-muted">{project.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
        {project.stack.slice(0, MAX_CHIPS).map((tech) => (
          <li key={tech} className="chip">
            {tech}
          </li>
        ))}
        {extra > 0 && (
          <li className="chip">
            +{extra}
            <span className="sr-only"> more</span>
          </li>
        )}
      </ul>

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-5">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={(event) => onOpen(project, event.currentTarget)}
          aria-haspopup="dialog"
        >
          Read details<span className="sr-only">: {project.title}</span>
        </button>
        {project.repoUrl && (
          <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
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
