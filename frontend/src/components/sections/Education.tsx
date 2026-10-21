import { Award, BookOpen, GraduationCap } from "lucide-react";

import { courses, education } from "../../content/skills";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Education() {
  return (
    <Section
      id="education"
      eyebrow="Academic Foundations"
      title="Credentials & Specializations"
      intro="Advanced post-graduate research in Applied AI, reinforcement learning, and multimodal intelligence."
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-5">
          {education.map((degree) => (
            <li key={degree.degree}>
              <Reveal>
                <div className="hud-card relative p-5 sm:p-6">
                  {/* Corner Crosshairs */}
                  <span aria-hidden="true" className="hud-corner hud-corner-tl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-tr" />
                  <span aria-hidden="true" className="hud-corner hud-corner-bl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-br" />

                  <div className="flex items-start gap-4">
                    <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-primary">
                      <GraduationCap className="size-5" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 font-mono text-meta text-muted">
                        <span>{degree.period}</span>
                        {degree.note && (
                          <span className="inline-flex items-center gap-1 rounded bg-accent/15 px-2 py-0.5 text-[0.7rem] font-bold text-accent">
                            <Award className="size-3" aria-hidden="true" />
                            RESEARCH_SPECIALIZATION
                          </span>
                        )}
                      </div>
                      <h3 className="mt-1 text-lead font-bold text-ink">{degree.degree}</h3>
                      <p className="mt-1 text-muted">
                        {degree.institution} · {degree.location}
                      </p>
                      {degree.note && <p className="mt-2 text-small text-primary font-medium">{degree.note}</p>}
                    </div>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <div className="hud-card relative h-full p-5 sm:p-6">
            {/* Corner Crosshairs */}
            <span aria-hidden="true" className="hud-corner hud-corner-tl" />
            <span aria-hidden="true" className="hud-corner hud-corner-tr" />
            <span aria-hidden="true" className="hud-corner hud-corner-bl" />
            <span aria-hidden="true" className="hud-corner hud-corner-br" />

            <h3 className="flex items-center gap-2 font-mono text-meta font-bold uppercase tracking-wider text-primary border-b border-line pb-2.5">
              <BookOpen className="size-4" aria-hidden="true" />
              Advanced Coursework
            </h3>
            <ul className="mt-3 space-y-2 text-small">
              {courses.map((course) => (
                <li key={course} className="border-l-2 border-line hover:border-primary pl-3 py-0.5 text-muted hover:text-ink transition-colors">
                  {course}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
