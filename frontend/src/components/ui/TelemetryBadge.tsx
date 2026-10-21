import type { ReactNode } from "react";

interface TelemetryBadgeProps {
  children: ReactNode;
  variant?: "primary" | "accent" | "muted";
  withDot?: boolean;
  className?: string;
}

export function TelemetryBadge({
  children,
  variant = "primary",
  withDot = true,
  className = "",
}: TelemetryBadgeProps) {
  const dotColor =
    variant === "accent" ? "bg-accent" : variant === "muted" ? "bg-muted" : "bg-primary";

  return (
    <span
      className={`telemetry-chip inline-flex items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-wider ${className}`}
    >
      {withDot && (
        <span className="relative flex size-2 items-center justify-center" aria-hidden="true">
          <span className={`size-1.5 rounded-full ${dotColor}`} />
          {variant === "primary" && (
            <span className="absolute inset-0 size-2 animate-ping rounded-full bg-primary opacity-60 motion-reduce:animate-none" />
          )}
        </span>
      )}
      <span>{children}</span>
    </span>
  );
}
