import { impact } from "../../content/profile";
import { Reveal } from "../ui/Reveal";

export function Impact() {
  return (
    <section id="impact" aria-label="Impact" className="border-y border-line bg-surface">
      <dl className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        {impact.map((metric, index) => (
          // Reveal renders the single <div> grouping each dt/dd set, which <dl> allows.
          <Reveal key={metric.label} delay={index * 0.08} className="flex flex-col">
            <dt className="order-2 mt-1 font-medium">{metric.label}</dt>
            <dd className="order-1 font-mono text-title font-semibold text-primary">{metric.value}</dd>
            <dd className="order-3 mt-1 text-small text-muted">{metric.context}</dd>
          </Reveal>
        ))}
      </dl>
    </section>
  );
}
