"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Check,
  Clock,
  ListOrdered,
  ChevronDown,
  ChevronUp,
  Star,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LearningPath } from "@/lib/course-types"

interface PathPickerProps {
  paths: LearningPath[]
  selectedPathId: string
  onSelect: (pathId: string) => void
}

export function PathPicker({ paths, selectedPathId, onSelect }: PathPickerProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Pin the recommended (currently-selected) path to the top of the grid;
  // remaining paths keep their optimizer-emitted order.
  const orderedPaths = useMemo(() => {
    const selected = paths.find((p) => p.id === selectedPathId)
    if (!selected) return paths
    return [selected, ...paths.filter((p) => p.id !== selectedPathId)]
  }, [paths, selectedPathId])

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Candidate learning paths
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            The optimizer generated {paths.length} valid orderings of the knowledge
            components, each respecting prerequisite chains. The first card is
            pre-selected as best-fit for your cohort's time budget — pick another
            and the schedule rearranges automatically.
          </p>
        </div>
        <Badge variant="secondary" className="hidden md:inline-flex shrink-0 mt-1">
          {paths.length} paths
        </Badge>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {orderedPaths.map((path, i) => {
          const isSelected = path.id === selectedPathId
          const isRecommended = isSelected && i === 0
          const isExpanded = expandedId === path.id
          // Show the original path number, not the display order, so users can
          // cross-reference path_3 in the reasoning text with the badge.
          const originalIdx = paths.findIndex((p) => p.id === path.id)
          const pathNumber = originalIdx + 1
          const reasoningSentences = splitSentences(path.reasoning)
          const teaser = reasoningSentences.slice(0, 2).join(" ")
          const rest = reasoningSentences.slice(2).join(" ")
          const hasMore = rest.length > 0

          return (
            <Card
              key={path.id}
              className={cn(
                "border-border transition-all cursor-pointer hover:border-accent/50",
                isSelected && "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
              )}
              onClick={() => onSelect(path.id)}
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-full flex items-center justify-center text-xs font-semibold",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {isSelected ? <Check className="h-3.5 w-3.5" /> : pathNumber}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        Path {pathNumber}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        Iteration {path.iteration}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap justify-end">
                    {isRecommended && (
                      <Badge className="text-[10px] gap-1 px-1.5 bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/15">
                        <Star className="h-3 w-3 fill-current" />
                        Recommended
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-[10px] gap-1 px-1.5">
                      <Clock className="h-3 w-3" />~{path.estimatedHours} hrs
                    </Badge>
                    <Badge variant="outline" className="text-[10px] gap-1 px-1.5">
                      <ListOrdered className="h-3 w-3" />
                      {path.kcSequence.length} KCs
                    </Badge>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {teaser}
                  {isExpanded && rest && <span className="block mt-2">{rest}</span>}
                </p>

                {hasMore && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setExpandedId(isExpanded ? null : path.id)
                    }}
                    className="text-[11px] font-medium text-accent hover:underline inline-flex items-center gap-1"
                  >
                    {isExpanded ? (
                      <>
                        <ChevronUp className="h-3 w-3" />
                        Show less
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-3 w-3" />
                        Read full reasoning
                      </>
                    )}
                  </button>
                )}

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <p className="text-[11px] text-muted-foreground truncate flex-1">
                    Starts with{" "}
                    <span className="font-medium text-foreground">
                      {path.kcSequence[0]?.kcLabel}
                    </span>
                  </p>
                  {!isSelected && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs ml-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelect(path.id)
                      }}
                    >
                      Select
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

function splitSentences(s: string): string[] {
  // Cheap sentence split — good enough for trimming reasoning text into a teaser.
  return s
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((x) => x.trim())
    .filter(Boolean)
}
