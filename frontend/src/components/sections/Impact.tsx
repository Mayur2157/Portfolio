import { Activity, BarChart3 } from "lucide-react";

import { impact } from "../../content/profile";
import { Reveal } from "../ui/Reveal";

export function Impact() {
  return (
    <section id="impact" aria-label="System Telemetry and Impact" className="border-y border-line bg-surface/50 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center justify-between border-b border-line pb-3">
          <div className="flex items-center gap-2 font-mono text-meta uppercase tracking-wider text-primary">
            <Activity className="size-4" aria-hidden="true" />
            <span>Telemetry & Performance Benchmarks</span>
          </div>
          <span className="hidden font-mono text-[0.7rem] text-muted sm:inline-block">
            STATUS // EMPIRICALLY_VALIDATED
          </span>
        </div>

        <dl className="grid gap-6 md:grid-cols-3">
          {impact.map((metric, index) => {
            // Calculate a visual meter percentage based on the value string
            const percent = metric.value.includes("90") ? 92 : metric.value.includes("85") ? 85 : 60;
            return (
              <Reveal key={metric.label} delay={index * 0.08}>
                <div className="hud-card relative h-full flex flex-col p-5">
                  <span aria-hidden="true" className="hud-corner hud-corner-tl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-tr" />
                  <span aria-hidden="true" className="hud-corner hud-corner-bl" />
                  <span aria-hidden="true" className="hud-corner hud-corner-br" />

                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-muted">
                      METRIC // 0{index + 1}
                    </span>
                    <BarChart3 className="size-4 text-primary opacity-70" aria-hidden="true" />
                  </div>

                  <dd className="font-mono text-title font-bold text-primary tracking-tight">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 font-semibold text-ink text-small">{metric.label}</dt>
                  <dd className="mt-2 text-small text-muted">{metric.context}</dd>

                  {/* High-Tech Telemetry Gauge Bar */}
                  <div className="mt-auto pt-4" aria-hidden="true">
                    <div className="flex justify-between font-mono text-[0.65rem] text-muted mb-1">
                      <span>EFFICIENCY LEVEL</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-1000 motion-reduce:transition-none"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </dl>
      </div>
    </section>
  );
}
