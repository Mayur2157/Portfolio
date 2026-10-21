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
      eyebrow="Projects"
      title="Things I've built"
      intro="Production GenAI systems from my current work, research, and earlier open-source projects."
    >
      <div role="group" aria-label="Filter projects by area" className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = filter === category.id;
          return (
            <button
              key={category.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(category.id)}
              className={`btn min-h-10 rounded-full px-4 ${
                active ? "btn-primary" : "border-line bg-surface text-muted hover:border-primary hover:text-ink"
              }`}
            >
              {category.label}
              <span className={`font-mono text-meta ${active ? "" : "text-muted"}`}>{countFor(category.id)}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
      </p>

      {visible.length === 0 ? (
        <p className="mt-8 text-muted">No projects in this area yet. Try another filter.</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
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
