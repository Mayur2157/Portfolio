import { Cpu } from "lucide-react";

import { skillGroups } from "../../content/skills";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Capability Matrix"
      title="Neural Toolkit & Frameworks"
      intro="Core AI architectures, LLM orchestration frameworks, document intelligence tools, and production deployment stacks."
    >
      <div className="grid gap-6 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={(index % 2) * 0.06}>
            <div className="hud-card relative h-full p-5 sm:p-6">
              {/* Corner Crosshairs */}
              <span aria-hidden="true" className="hud-corner hud-corner-tl" />
              <span aria-hidden="true" className="hud-corner hud-corner-tr" />
              <span aria-hidden="true" className="hud-corner hud-corner-bl" />
              <span aria-hidden="true" className="hud-corner hud-corner-br" />

              <div className="mb-3 flex items-center justify-between border-b border-line pb-2.5">
                <h3 className="flex items-center gap-2 font-mono text-meta font-bold uppercase tracking-wider text-primary">
                  <Cpu className="size-3.5" aria-hidden="true" />
                  {group.title}
                </h3>
                <span className="font-mono text-[0.68rem] text-muted">MODULE // 0{index + 1}</span>
              </div>

              <ul className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li key={skill} className="chip text-ink hover:border-primary hover:shadow-[0_0_8px_var(--glow-cyan)]">
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
