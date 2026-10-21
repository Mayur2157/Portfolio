import { BookOpen, GraduationCap } from "lucide-react";

import { courses, education } from "../../content/skills";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title="Foundations">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <ul className="grid gap-5">
          {education.map((degree) => (
            <li key={degree.degree}>
              <Reveal className="card flex gap-4 p-5 sm:p-6">
                <GraduationCap className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-mono text-meta text-muted">{degree.period}</p>
                  <h3 className="mt-1 font-semibold">{degree.degree}</h3>
                  <p className="text-muted">
                    {degree.institution} · {degree.location}
                  </p>
                  {degree.note && <p className="mt-1 text-small text-primary">{degree.note}</p>}
                </div>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="card p-5 sm:p-6" delay={0.1}>
          <h3 className="flex items-center gap-2 font-semibold">
            <BookOpen className="size-5 text-primary" aria-hidden="true" />
            Courses
          </h3>
          <ul className="mt-3 space-y-2 text-small">
            {courses.map((course) => (
              <li key={course} className="border-l-2 border-line pl-3">
                {course}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}
