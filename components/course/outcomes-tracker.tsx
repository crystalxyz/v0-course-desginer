"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, AlertCircle, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import type { OutcomeCoverage } from "@/lib/course-types"

interface OutcomesTrackerProps {
  outcomes: OutcomeCoverage[]
}

export function OutcomesTracker({ outcomes }: OutcomesTrackerProps) {
  const coveredCount = outcomes.filter((o) => o.isCovered).length
  const totalCount = outcomes.length
  const coveragePercent = totalCount > 0 ? Math.round((coveredCount / totalCount) * 100) : 0

  return (
    <div className="h-full flex flex-col">
      {/* Summary */}
      <Card className="border-border mb-4">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Outcomes Coverage
            </CardTitle>
            <Badge variant={coveragePercent === 100 ? "default" : "secondary"} className="text-xs">
              {coveredCount}/{totalCount}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-4">
          <Progress value={coveragePercent} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {coveragePercent === 100
              ? "All learning outcomes are covered by the course materials."
              : `${100 - coveragePercent}% of outcomes need additional coverage.`}
          </p>
        </CardContent>
      </Card>

      {/* Outcome List */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {outcomes.map((outcome, index) => (
          <Card
            key={index}
            className={cn(
              "border-border transition-all",
              outcome.isCovered
                ? "border-l-2 border-l-accent"
                : "border-l-2 border-l-destructive"
            )}
          >
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {outcome.isCovered ? (
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground font-medium">{outcome.outcome}</p>
                  
                  {outcome.isCovered ? (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-muted-foreground">Weeks:</span>
                        {outcome.coveredInWeeks.map((week) => (
                          <Badge key={week} variant="outline" className="text-[10px] px-1.5 py-0">
                            {week}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] text-muted-foreground">Materials:</span>
                        {outcome.coveredByReadings.slice(0, 3).map((reading) => (
                          <Badge key={reading} variant="secondary" className="text-[10px] px-1.5 py-0">
                            {reading}
                          </Badge>
                        ))}
                        {outcome.coveredByReadings.length > 3 && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            +{outcome.coveredByReadings.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-destructive mt-1">
                      This outcome is not covered by any uploaded materials.
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
