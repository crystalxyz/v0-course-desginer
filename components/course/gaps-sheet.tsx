"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  MoveRight, 
  Plus,
  Calendar,
  BookOpen,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { GapWarning, CoursePlan } from "@/lib/course-types"

interface GapsSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  gapWarnings: GapWarning[]
  onApplyFix?: (gapIndex: number, fixType: "primary" | "alternative") => void
  onScrollToWeek?: (week: number) => void
}

export function GapsSheet({
  open,
  onOpenChange,
  gapWarnings,
  onApplyFix,
  onScrollToWeek,
}: GapsSheetProps) {
  const hasGaps = gapWarnings.length > 0

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <div className="flex items-center gap-2">
            {hasGaps ? (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-amber-500/10">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              </div>
            ) : (
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/10">
                <CheckCircle2 className="h-4 w-4 text-accent" />
              </div>
            )}
            <div>
              <SheetTitle>
                {hasGaps ? `${gapWarnings.length} Prerequisite Gap${gapWarnings.length > 1 ? "s" : ""}` : "All Prerequisites Satisfied"}
              </SheetTitle>
              <SheetDescription>
                {hasGaps 
                  ? "Review and fix ordering issues in your course schedule"
                  : "Your course schedule is properly ordered"
                }
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-160px)] mt-6">
          {hasGaps ? (
            <div className="space-y-4 pr-4">
              {gapWarnings.map((gap, index) => (
                <GapCard 
                  key={index} 
                  gap={gap} 
                  index={index}
                  onApplyFix={onApplyFix}
                  onScrollToWeek={onScrollToWeek}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-4">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Looking good!</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                All concepts are introduced before they are assumed by dependent materials. 
                Your course schedule follows a proper learning progression.
              </p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

interface GapCardProps {
  gap: GapWarning
  index: number
  onApplyFix?: (gapIndex: number, fixType: "primary" | "alternative") => void
  onScrollToWeek?: (week: number) => void
}

function GapCard({ gap, index, onApplyFix, onScrollToWeek }: GapCardProps) {
  return (
    <Card className="border-border border-l-2 border-l-amber-500">
      <CardContent className="p-4 space-y-4">
        {/* Gap Description */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-200 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Week {gap.assumedInWeek}
            </Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <Badge variant="outline" className="text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Week {gap.introducedInWeek || "?"}
            </Badge>
          </div>
          
          <p className="text-sm text-foreground">
            <span className="font-semibold">{gap.dependentConcept || gap.assumedByMaterial}</span> in Week {gap.assumedInWeek} assumes familiarity with{" "}
            <span className="font-semibold text-amber-600">{gap.concept}</span>
            {gap.introducedInWeek && (
              <span className="text-muted-foreground">
                , which isn&apos;t introduced until Week {gap.introducedInWeek}
              </span>
            )}
          </p>

          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3" />
            <span>Found in: {gap.assumedByMaterial}</span>
          </div>
        </div>

        {/* Suggested Fixes */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Suggested fixes:</p>
          
          {/* Primary Fix */}
          {gap.suggestedFix && (
            <button
              onClick={() => onApplyFix?.(index, "primary")}
              className="w-full text-left p-3 rounded-lg border border-accent/30 bg-accent/5 hover:bg-accent/10 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-accent/20 group-hover:bg-accent/30 flex-shrink-0">
                  <MoveRight className="h-3 w-3 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {gap.suggestedFix.type === "move-reading" 
                      ? `Move reading to Week ${gap.suggestedFix.toWeek}`
                      : gap.suggestedFix.description
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gap.suggestedFix.type === "move-reading"
                      ? `Relocate the material from Week ${gap.suggestedFix.fromWeek} to Week ${gap.suggestedFix.toWeek}`
                      : "This will reorder the material schedule"
                    }
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Alternative Fix */}
          {gap.alternativeFix && (
            <button
              onClick={() => onApplyFix?.(index, "alternative")}
              className="w-full text-left p-3 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-secondary group-hover:bg-secondary flex-shrink-0">
                  <Plus className="h-3 w-3 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {gap.alternativeFix.type === "add-primer"
                      ? `Add a primer on ${gap.alternativeFix.concept} to Week ${gap.alternativeFix.week}`
                      : gap.alternativeFix.description
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {gap.alternativeFix.description || "This will add new content to bridge the gap"}
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>

        {/* Jump to Week */}
        <div className="pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7"
            onClick={() => onScrollToWeek?.(gap.assumedInWeek)}
          >
            <Calendar className="h-3 w-3 mr-1" />
            Jump to Week {gap.assumedInWeek}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Compact gap indicator for the header
interface GapIndicatorProps {
  gapCount: number
  onClick: () => void
}

export function GapIndicator({ gapCount, onClick }: GapIndicatorProps) {
  if (gapCount === 0) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium hover:bg-accent/20 transition-colors"
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        All prerequisites satisfied
      </button>
    )
  }

  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-500/10 text-amber-600 text-xs font-medium hover:bg-amber-500/20 transition-colors"
    >
      <AlertTriangle className="h-3.5 w-3.5" />
      {gapCount} gap warning{gapCount > 1 ? "s" : ""}
    </button>
  )
}
