"use client"

import { useEffect, useState } from "react"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface OptimizerStage {
  label: string
  durationMs: number
  detail?: (elapsed: number) => string
}

interface OptimizerProgressProps {
  stages: OptimizerStage[]
  onComplete?: () => void
  title?: string
  subtitle?: string
}

export function OptimizerProgress({
  stages,
  onComplete,
  title = "Generating your course plan",
  subtitle = "Running the learning-path-optimizer pipeline on your materials.",
}: OptimizerProgressProps) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (activeIdx >= stages.length) {
      onComplete?.()
      return
    }
    const stage = stages[activeIdx]
    const start = Date.now()
    const interval = setInterval(() => setTick(Date.now() - start), 80)
    const timeout = setTimeout(() => {
      clearInterval(interval)
      setTick(0)
      setActiveIdx((i) => i + 1)
    }, stage.durationMs)
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [activeIdx, stages, onComplete])

  return (
    <div className="text-center max-w-xl mx-auto px-4">
      <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-accent/10 mb-5">
        <Loader2 className="h-7 w-7 text-accent animate-spin" />
      </div>
      <h2 className="text-xl font-semibold text-foreground mb-1">{title}</h2>
      <p className="text-sm text-muted-foreground mb-8">{subtitle}</p>

      <ol className="text-left space-y-4">
        {stages.map((stage, i) => {
          const isDone = i < activeIdx
          const isActive = i === activeIdx
          const elapsed = isActive ? tick : isDone ? stage.durationMs : 0
          const detail =
            (isDone || isActive) && stage.detail
              ? stage.detail(isDone ? stage.durationMs : elapsed)
              : null

          return (
            <li
              key={stage.label}
              className={cn(
                "flex items-start gap-3 transition-opacity",
                !isDone && !isActive && "opacity-40"
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                    <Check className="h-3 w-3 text-accent-foreground" />
                  </div>
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 text-accent animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    isDone || isActive ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {stage.label}
                </p>
                {detail && (
                  <p
                    className={cn(
                      "text-xs mt-0.5 tabular-nums",
                      isDone ? "text-muted-foreground" : "text-accent"
                    )}
                  >
                    {detail}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// Stage builders. The numbers come from the optimizer's actual run for the
// calculus textbook; for other templates we derive plausible synthetic counts.

export function buildOptimizerStages(opts: {
  template: "calculus" | "ml-systems"
  materialsCount: number
  kcCount: number
  dependencyChainCount: number
  candidatePathCount: number
  selectedPathHours: string
  weeks: number
}): OptimizerStage[] {
  const ramp = (target: number, total: number) => (elapsed: number) =>
    Math.min(target, Math.round((elapsed / total) * target))

  return [
    {
      label: "Extracting learning segments",
      durationMs: 700,
      detail: (e) =>
        e === 700
          ? `Parsed ${opts.materialsCount} source ${opts.materialsCount === 1 ? "file" : "files"} → ${opts.template === "calculus" ? 261 : opts.materialsCount * 14} segments`
          : `Reading ${opts.materialsCount} ${opts.materialsCount === 1 ? "file" : "files"}…`,
    },
    {
      label: "Identifying knowledge components",
      durationMs: 1100,
      detail: (e) => {
        const n = ramp(opts.kcCount, 1100)(e)
        return e === 1100
          ? `Identified ${opts.kcCount} knowledge components (${opts.template === "calculus" ? "85% consolidation" : "domain-coherent grouping"})`
          : `Clustering segments… ${n} KCs so far`
      },
    },
    {
      label: "Building prerequisite graph",
      durationMs: 1000,
      detail: (e) =>
        e === 1000
          ? `Found ${opts.dependencyChainCount} dependency chains across ${opts.kcCount} KCs`
          : `Inferring prerequisites…`,
    },
    {
      label: "Generating candidate learning paths",
      durationMs: 1100,
      detail: (e) => {
        const n = ramp(opts.candidatePathCount, 1100)(e)
        return e === 1100
          ? `Generated ${opts.candidatePathCount} candidate paths with reasoning`
          : `Path ${Math.max(n, 1)}/${opts.candidatePathCount} — searching for valid orderings…`
      },
    },
    {
      label: "Selecting best fit for your time budget",
      durationMs: 700,
      detail: (e) =>
        e === 700
          ? `Selected: ~${opts.selectedPathHours} hrs total, ${opts.weeks}-week schedule`
          : `Scoring paths…`,
    },
  ]
}
