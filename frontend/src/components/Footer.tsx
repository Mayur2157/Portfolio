import { Cpu } from "lucide-react";

import { profile } from "../content/profile";

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-small text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center gap-2">
          <span className="radar-dot !size-1.5" aria-hidden="true" />
          <span>
            © {new Date().getFullYear()} {profile.name} · All rights reserved.
          </span>
        </div>
        <p className="flex items-center gap-1.5 font-mono text-meta">
          <Cpu className="size-3.5 text-primary" aria-hidden="true" />
          <span>REACT 19 · FASTAPI · TAILWIND V4 · DOCKER</span>
        </p>
      </div>
    </footer>
  );
}
