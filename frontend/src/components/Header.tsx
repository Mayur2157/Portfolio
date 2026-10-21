import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { profile } from "../content/profile";
import { ThemeToggle } from "./ui/ThemeToggle";

const NAV_LINKS = [
  { href: "#experience", label: "Experience", num: "01" },
  { href: "#projects", label: "Projects", num: "02" },
  { href: "#skills", label: "Skills", num: "03" },
  { href: "#contact", label: "Contact", num: "04" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 768px)");
    const onResize = () => desktop.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md transition-colors">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <a href="#home" className="mr-auto flex items-center gap-2.5 rounded-lg py-1.5 font-bold tracking-tight text-ink">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-lg bg-primary font-mono text-meta font-bold text-on-primary shadow-[0_0_12px_var(--glow-cyan)]">
            MG
          </span>
          <span className="flex items-center gap-2">
            <span>{profile.name}</span>
            <span className="hidden items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5 font-mono text-[0.65rem] text-primary sm:inline-flex">
              <span className="radar-dot !size-1.5" aria-hidden="true" />
              ONLINE
            </span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="btn btn-ghost px-3 text-small">
                <span className="font-mono text-[0.7rem] text-primary opacity-80">{link.num} //</span>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />

        {__HAS_RESUME__ && (
          <a href="/resume.pdf" download="Mayur Gadekar Resume.pdf" className="btn btn-primary hidden sm:inline-flex text-small">
            <Download className="size-4" aria-hidden="true" />
            Resume
          </a>
        )}

        <button
          ref={menuButton}
          type="button"
          className="btn btn-ghost px-3 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </nav>

      <div id="mobile-menu" hidden={!open} className="border-t border-line bg-surface/95 backdrop-blur-md md:hidden">
        <ul className="mx-auto max-w-6xl px-4 py-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="flex min-h-11 items-center gap-2 rounded-lg px-3 font-medium text-ink hover:bg-surface-2" onClick={() => setOpen(false)}>
                <span className="font-mono text-meta text-primary">{link.num} //</span>
                <span>{link.label}</span>
              </a>
            </li>
          ))}
          {__HAS_RESUME__ && (
            <li className="pt-2 border-t border-line/60">
              <a
                href="/resume.pdf"
                download="Mayur Gadekar Resume.pdf"
                className="flex min-h-11 items-center gap-2 rounded-lg px-3 font-semibold text-primary hover:bg-surface-2"
              >
                <Download className="size-4" aria-hidden="true" />
                Download resume
              </a>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
