import type { HTMLAttributes, ReactNode } from "react";

interface HudPanelProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  telemetryTag?: string;
  withCorners?: boolean;
}

export function HudPanel({
  children,
  className = "",
  telemetryTag,
  withCorners = true,
  ...props
}: HudPanelProps) {
  return (
    <div className={`hud-card relative p-5 sm:p-6 ${className}`} {...props}>
      {withCorners && (
        <>
          <span aria-hidden="true" className="hud-corner hud-corner-tl" />
          <span aria-hidden="true" className="hud-corner hud-corner-tr" />
          <span aria-hidden="true" className="hud-corner hud-corner-bl" />
          <span aria-hidden="true" className="hud-corner hud-corner-br" />
        </>
      )}
      {telemetryTag && (
        <div className="mb-3 flex items-center justify-between border-b border-line pb-2 font-mono text-[0.7rem] uppercase tracking-wider text-muted">
          <span className="flex items-center gap-1.5">
            <span className="radar-dot" aria-hidden="true" />
            {telemetryTag}
          </span>
          <span className="text-[0.65rem] opacity-60">HUD // SYS_OK</span>
        </div>
      )}
      {children}
    </div>
  );
}
