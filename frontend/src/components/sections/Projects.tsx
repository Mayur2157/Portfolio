import { Cpu } from "lucide-react";
import { useRef, useState } from "react";

import { categories, projects } from "../../content/projects";
import type { Project, ProjectCategory } from "../../content/types";
import { findRepo, type ReposState } from "../../hooks/useGithubRepos";
import { Section } from "../ui/Section";
import { ProjectCard } from "./ProjectCard";
import { ProjectDialog } from "./ProjectDialog";

type Filter = ProjectCategory | "all";

export function Projects({ repos }: { repos: ReposState }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Project | null>(null);
  const opener = useRef<HTMLButtonElement | null>(null);

  const visible = filter === "all" ? projects : projects.filter((project) => project.category === filter);
  const countFor = (id: Filter) => (id === "all" ? projects.length : projects.filter((p) => p.category === id).length);

  const open = (project: Project, button: HTMLButtonElement) => {
    opener.current = button;
    setSelected(project);
  };

  const close = () => {
    setSelected(null);
    opener.current?.focus();
  };

  return (
    <Section
      id="projects"
      eyebrow="Neural Modules & Vault"
      title="Production Systems & Research"
      intro="Deployed GenAI architectures, multimodal vision-language models, voice pipelines, and open-source intelligence tools."
    >
      {/* Sci-Fi Filter Bar */}
      <div
        role="group"
        aria-label="Filter projects by area"
        className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface/60 p-2 backdrop-blur-md"
      >
        <span className="hidden px-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted lg:inline-flex items-center gap-1.5">
          <Cpu className="size-3.5 text-primary" aria-hidden="true" />
          FILTER //
        </span>
        {categories.map((category) => {
          const active = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(category.id)}
              className={`btn min-h-9 rounded-lg px-3 py-1.5 text-small transition-all ${
                active
                  ? "btn-primary font-semibold shadow-[0_0_15px_var(--glow-cyan)]"
                  : "border-line bg-surface text-muted hover:border-primary hover:text-ink"
              }`}
            >
              {category.label}
              <span
                className={`ml-1.5 font-mono text-meta rounded px-1.5 py-0.5 ${
                  active ? "bg-on-primary/20 text-on-primary" : "bg-surface-2 text-muted"
                }`}
              >
                {countFor(category.id)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-8 font-mono text-muted">No projects in this area yet. Try another filter.</p>
      ) : (
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {visible.map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} stats={findRepo(repos, project.repoUrl)} onOpen={open} />
            </li>
          ))}
        </ul>
      )}

      <ProjectDialog project={selected} stats={findRepo(repos, selected?.repoUrl)} onClose={close} />
    </Section>
  );
}
