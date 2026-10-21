import { Check, LoaderCircle, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { profile } from "../../content/profile";
import type { ReposState } from "../../hooks/useGithubRepos";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface TraceStep {
  id: string;
  op: string;
  detail: string;
  /** True while the step is waiting on live data. */
  waiting?: boolean;
}

const STEP_DELAY_MS = 650;

function buildSteps(repos: ReposState): TraceStep[] {
  const steps: TraceStep[] = [
    { id: "query", op: "query", detail: '"Who is Mayur?"' },
    { id: "retrieve", op: "retrieve", detail: "resume → experience · projects · skills · education" },
  ];
  // The tool call uses live data from the API; it is dropped when GitHub can't be reached.
  if (repos.status === "loading") {
    steps.push({ id: "tool", op: "tool", detail: "github.repos()", waiting: true });
  } else if (repos.status === "ready" && repos.repos.length > 0) {
    steps.push({ id: "tool", op: "tool", detail: `github.repos() → ${repos.repos.length} public repos` });
  }
  steps.push({ id: "answer", op: "answer", detail: "" });
  return steps;
}

export function AgentTrace({ repos }: { repos: ReposState }) {
  const reduceMotion = useReducedMotion();
  const steps = useMemo(() => buildSteps(repos), [repos]);
  const [revealed, setRevealed] = useState(0);
  const shown = reduceMotion ? steps.length : revealed;
  const done = shown >= steps.length;

  useEffect(() => {
    if (reduceMotion || revealed >= steps.length) return;
    const timer = setTimeout(() => setRevealed((count) => count + 1), revealed === 0 ? 300 : STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [reduceMotion, revealed, steps.length]);

  return (
    <figure className="card relative overflow-hidden font-mono text-meta">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5 text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
            <span className="size-2.5 rounded-full bg-line" />
          </span>
          agent.run(&quot;portfolio&quot;)
        </span>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setRevealed(0)}
            disabled={!done}
            className="-my-1 inline-flex min-h-9 items-center gap-1.5 rounded-md px-2 hover:text-ink disabled:invisible"
            aria-label="Replay agent trace"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            replay
          </button>
        )}
      </figcaption>

      {/* The animation is decorative; screen readers get the summary below instead. */}
      <ol aria-hidden="true" className="space-y-2.5 px-4 py-4">
        {steps.slice(0, shown).map((step, index) => {
          const isLast = index === shown - 1;
          const running = step.waiting || (isLast && !done);
          if (step.id === "answer") {
            return (
              <li key={step.id} className="mt-3 border-t border-line pt-3">
                <p className="text-accent">answer</p>
                <p className="mt-1 font-sans text-small text-ink">{profile.traceAnswer}</p>
              </li>
            );
          }
          return (
            <li key={step.id} className="flex items-start gap-3">
              {running ? (
                <LoaderCircle className="mt-0.5 size-4 shrink-0 animate-spin text-accent motion-reduce:animate-none" />
              ) : (
                <Check className="mt-0.5 size-4 shrink-0 text-primary" />
              )}
              <span className="w-16 shrink-0 text-muted">{step.op}</span>
              <span className="min-w-0 break-words text-ink">{step.detail}</span>
            </li>
          );
        })}
        {!done && (
          <li className="flex gap-3 text-muted">
            <span className="w-4" />
            <span className="inline-block h-4 w-2 animate-pulse bg-primary/70 motion-reduce:animate-none" />
          </li>
        )}
      </ol>
      <p className="sr-only">{profile.traceAnswer}</p>
    </figure>
  );
}
