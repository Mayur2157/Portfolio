import { Briefcase, Building2, Calendar } from "lucide-react";

import { experience } from "../../content/experience";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Mission Log & Timeline"
      title="Engineering Roles & Deployments"
      intro="From prompt engineering and NLP research to owning production GenAI systems end to end."
    >
      <div className="relative border-l-2 border-line/70 pl-6 md:pl-10">
        <ol className="space-y-10">
          {experience.map((role, index) => (
            <li key={`${role.company}-${role.title}`} className="relative">
              {/* Sci-Fi Tracing Node Indicator */}
              <div
                aria-hidden="true"
                className={`absolute top-4 -left-[2.05rem] md:-left-[3.05rem] flex size-6 items-center justify-center rounded-full border-2 ${
                  role.current
                    ? "border-primary bg-surface shadow-[0_0_12px_var(--glow-cyan)]"
                    : "border-line bg-surface"
                }`}
              >
                {role.current ? (
                  <span className="size-2 rounded-full bg-primary animate-ping motion-reduce:animate-none" />
                ) : (
                  <span className="size-1.5 rounded-full bg-muted" />
                )}
              </div>

              <Reveal delay={index * 0.08}>
                <div className="hud-card relative p-5 sm:p-7">
                  {/* Corner Crosshairs */}
                  <span aria-hidden="true" className="hud-corner hud-corner-tl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-tr" />
                  <span aria-hidden="true" className="hud-corner hud-corner-bl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-br" />

                  {/* Role Header Telemetry */}
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-3">
                    <span className="flex items-center gap-2 font-mono text-meta text-muted">
                      <Calendar className="size-3.5 text-primary" aria-hidden="true" />
                      {role.period}
                      {role.current && (
                        <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-2 py-0.5 text-[0.7rem] font-bold text-primary">
                          <span className="radar-dot !size-1.5" aria-hidden="true" />
                          CURRENT_DEPLOYMENT
                        </span>
                      )}
                    </span>
                    <span className="flex items-center gap-1.5 font-mono text-meta text-muted">
                      <Building2 className="size-3.5 text-accent" aria-hidden="true" />
                      {role.company}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lead font-bold text-ink flex items-center gap-2">
                    <Briefcase className="size-4 text-primary shrink-0" aria-hidden="true" />
                    {role.title}
                  </h3>

                  <ul className="mt-4 list-disc space-y-2 pl-5 text-small text-muted marker:text-primary">
                    {role.highlights.map((highlight) => (
                      <li key={highlight} className="leading-relaxed">
                        <span className="text-ink">{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <ul className="mt-5 flex flex-wrap gap-1.5 pt-3 border-t border-line/60" aria-label="Technologies">
                    {role.stack.map((tech) => (
                      <li key={tech} className="chip">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
