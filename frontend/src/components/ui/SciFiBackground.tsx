export function SciFiBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Sci-Fi Neural Grid */}
      <svg
        className="absolute inset-0 size-full stroke-[var(--grid-line)] opacity-70 [mask-image:radial-gradient(100%_100%_at_top_center,white,transparent)]"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="neural-cyber-grid"
            width="48"
            height="48"
            x="50%"
            y="-1"
            patternUnits="userSpaceOnUse"
          >
            <path d="M.5 48V.5H48" fill="none" />
            <circle cx="0.5" cy="0.5" r="1.5" className="fill-[var(--primary)] opacity-40" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth="0" fill="url(#neural-cyber-grid)" />
      </svg>

      {/* Cyber Ambient Glowing Orbs */}
      <div className="absolute -top-40 left-1/2 -z-10 h-[38rem] w-[50rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,var(--glow-cyan),transparent_70%)] blur-3xl opacity-80" />
      <div className="absolute top-[35%] -right-40 -z-10 size-[32rem] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-cyan),transparent_70%)] blur-3xl opacity-40" />
      <div className="absolute top-[70%] -left-40 -z-10 size-[32rem] rounded-full bg-[radial-gradient(circle_at_center,var(--glow-cyan),transparent_70%)] blur-3xl opacity-30" />
    </div>
  );
}
