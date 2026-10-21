import { ArrowUpRight, Cpu, X } from "lucide-react";
import { useEffect, useRef } from "react";

import type { Project } from "../../content/types";
import type { RepoStats } from "../../lib/api";
import { GitHubIcon } from "../ui/BrandIcons";
import { KIND_BADGE } from "./ProjectCard";

interface ProjectDialogProps {
  project: Project | null;
  stats?: RepoStats;
  onClose: () => void;
}

/** Native <dialog>: the browser handles the focus trap, Escape and the inert background. */
export function ProjectDialog({ project, stats, onClose }: ProjectDialogProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (project && !element.open) element.showModal();
    if (!project && element.open) element.close();
  }, [project]);

  const badge = project && project.kind !== "open-source" ? KIND_BADGE[project.kind] : null;

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      aria-labelledby="project-dialog-title"
      className="hud-card m-auto max-h-[85vh] w-[min(44rem,calc(100vw-2rem))] overflow-y-auto p-0 text-ink backdrop:bg-black/75 backdrop:backdrop-blur-md"
    >
      {/* Corner Crosshairs */}
      <span aria-hidden="true" className="hud-corner hud-corner-tl" />
      <span aria-hidden="true" className="hud-corner hud-corner-tr" />
      <span aria-hidden="true" className="hud-corner hud-corner-bl" />
      <span aria-hidden="true" className="hud-corner hud-corner-br" />

      {project && (
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="flex items-center gap-2 font-mono text-meta text-muted">
                <Cpu className="size-3.5 text-primary" aria-hidden="true" />
                {project.period}
                {badge && <span className="text-accent font-semibold">· {badge.label}</span>}
              </p>
              <h2 id="project-dialog-title" className="mt-1 text-lead font-bold tracking-tight text-ink">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              className="btn btn-ghost -mt-1 -mr-2 px-2"
              onClick={() => dialog.current?.close()}
              aria-label="Close details"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-4 text-body leading-relaxed">{project.summary}</p>

          <h3 className="mt-6 font-mono text-[0.75rem] font-bold tracking-wider text-primary uppercase">
            [ Key Deliverables & System Highlights ]
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-primary">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="text-small text-muted">
                <span className="text-ink">{highlight}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-6 font-mono text-[0.75rem] font-bold tracking-wider text-primary uppercase">
            [ Architecture Stack & Dependencies ]
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li key={tech} className="chip">
                {tech}
              </li>
            ))}
          </ul>

          {project.repoUrl && (
            <div className="mt-8 border-t border-line pt-4">
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                <GitHubIcon className="size-4" />
                View on GitHub{stats ? ` · ${stats.stars} ★` : ""}
                <ArrowUpRight className="size-4" aria-hidden="true" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </div>
          )}
        </div>
      )}
    </dialog>
  );
}
