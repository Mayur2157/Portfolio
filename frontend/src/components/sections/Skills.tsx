import { skillGroups } from "../../content/skills";
import { Reveal } from "../ui/Reveal";
import { Section } from "../ui/Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="Toolkit" intro="What I reach for when taking an AI system from prototype to production.">
      <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.title} delay={(index % 2) * 0.06}>
            <h3 className="font-semibold">{group.title}</h3>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {group.skills.map((skill) => (
                <li key={skill} className="chip text-ink">
                  {skill}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
