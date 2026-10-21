import { Download, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { profile } from "../content/profile";
import { ThemeToggle } from "./ui/ThemeToggle";

const NAV_LINKS = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
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
    <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-md">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
        <a href="#home" className="mr-auto flex items-center gap-2 rounded-md py-2 font-semibold tracking-tight">
          <span aria-hidden="true" className="grid size-8 place-items-center rounded-md bg-primary font-mono text-meta text-on-primary">
            MG
          </span>
          {profile.name}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="btn btn-ghost px-3 font-medium">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <ThemeToggle />

        {__HAS_RESUME__ && (
          <a href="/resume.pdf" download="Mayur Gadekar Resume.pdf" className="btn btn-primary hidden sm:inline-flex">
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

      <div id="mobile-menu" hidden={!open} className="border-t border-line md:hidden">
        <ul className="mx-auto max-w-6xl px-4 py-2">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="flex min-h-11 items-center rounded-md px-2 font-medium" onClick={() => setOpen(false)}>
                {link.label}
              </a>
            </li>
          ))}
          {__HAS_RESUME__ && (
            <li>
              <a
                href="/resume.pdf"
                download="Mayur Gadekar Resume.pdf"
                className="flex min-h-11 items-center gap-2 rounded-md px-2 font-medium text-primary"
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
