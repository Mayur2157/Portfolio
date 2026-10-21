import { experience } from "../../content/experience";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title="Where I've shipped"
      intro="From prompt engineering and NLP research to owning production GenAI systems end to end."
    >
      <ol className="relative space-y-10 border-l border-line pl-6 md:pl-8">
        {experience.map((role) => (
          <li key={`${role.company}-${role.title}`} className="relative">
            <span
              aria-hidden="true"
              className={`absolute top-2 -left-[1.91rem] size-3 rounded-full border-2 md:-left-[2.41rem] ${
                role.current ? "border-primary bg-primary" : "border-line bg-bg"
              }`}
            />
            <Reveal>
              <p className="font-mono text-meta text-muted">
                {role.period}
                {role.current && <span className="ml-2 text-primary">· current</span>}
              </p>
              <h3 className="mt-1 text-lead font-semibold">
                {role.title} <span className="font-normal text-muted">· {role.company}</span>
              </h3>
              <ul className="mt-3 max-w-3xl list-disc space-y-1.5 pl-5 marker:text-line">
                {role.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
              <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Technologies">
                {role.stack.map((tech) => (
                  <li key={tech} className="chip">
                    {tech}
                  </li>
                ))}
              </ul>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  );
}
