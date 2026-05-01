"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  X, 
  Calendar, 
  BookOpen, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  AlertTriangle,
  Network
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { Concept, CourseWeek, OutcomeCoverage, CourseMaterial } from "@/lib/course-types"

interface ConceptDetailProps {
  concept: Concept
  weeks: CourseWeek[]
  outcomes: OutcomeCoverage[]
  materials: CourseMaterial[]
  allConcepts: Concept[]
  onClose: () => void
  onWeekClick?: (week: number) => void
  onMaterialClick?: (materialId: string) => void
}

export function ConceptDetail({
  concept,
  weeks,
  outcomes,
  materials,
  allConcepts,
  onClose,
  onWeekClick,
  onMaterialClick,
}: ConceptDetailProps) {
  // Find weeks that reference this concept
  const referencingWeeks = weeks.filter(
    (w) => w.conceptsIntroduced.includes(concept.name)
  )

  // Find materials that cover this concept
  const coveringMaterials = materials.filter(
    (m) => concept.coveredBy.includes(m.id)
  )

  // Find outcomes this concept serves
  const servedOutcomes = outcomes.filter((o) =>
    o.coveredByReadings.some((r) => concept.coveredBy.includes(r))
  )

  // Find dependencies (concepts this one depends on)
  const dependencies = allConcepts.filter((c) =>
    concept.dependencies.includes(c.id) || concept.dependencies.includes(c.name)
  )

  // Find dependents (concepts that depend on this one)
  const dependents = allConcepts.filter((c) =>
    c.dependencies.includes(concept.id) || c.dependencies.includes(concept.name)
  )

  // Check if this is a gap concept
  const isGap = concept.isGap || dependencies.some(
    (dep) => dep.weekIntroduced && concept.weekIntroduced && 
    dep.weekIntroduced > concept.weekIntroduced
  )

  return (
    <Card className="border-border h-full flex flex-col">
      <CardHeader className="py-3 px-4 border-b border-border flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-sm font-medium">Concept Detail</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1">
        <CardContent className="p-4 space-y-5">
          {/* Concept Name */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-base font-semibold text-foreground">{concept.name}</h3>
              {isGap && (
                <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Gap
                </Badge>
              )}
            </div>
            {concept.weekIntroduced && (
              <Badge variant="secondary" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Introduced in Week {concept.weekIntroduced}
              </Badge>
            )}
          </div>

          {/* Dependencies */}
          {dependencies.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" />
                Prerequisites ({dependencies.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dependencies.map((dep) => {
                  const isGapDep = dep.weekIntroduced && concept.weekIntroduced && 
                    dep.weekIntroduced > concept.weekIntroduced
                  return (
                    <Badge
                      key={dep.id}
                      variant="outline"
                      className={cn(
                        "text-xs cursor-pointer hover:bg-accent/50",
                        isGapDep && "bg-amber-500/10 text-amber-600 border-amber-200"
                      )}
                    >
                      {dep.name}
                      <span className="ml-1 text-[10px] opacity-60">W{dep.weekIntroduced}</span>
                      {isGapDep && <AlertTriangle className="h-2.5 w-2.5 ml-1" />}
                    </Badge>
                  )
                })}
              </div>
            </div>
          )}

          {/* Dependents */}
          {dependents.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <ArrowRight className="h-3 w-3" />
                Enables ({dependents.length})
              </p>
              <div className="flex flex-wrap gap-1.5">
                {dependents.map((dep) => (
                  <Badge key={dep.id} variant="outline" className="text-xs cursor-pointer hover:bg-accent/50">
                    {dep.name}
                    <span className="ml-1 text-[10px] opacity-60">W{dep.weekIntroduced}</span>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Weeks */}
          {referencingWeeks.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Weeks Referencing ({referencingWeeks.length})
              </p>
              <div className="space-y-1.5">
                {referencingWeeks.map((week) => (
                  <button
                    key={week.week}
                    onClick={() => onWeekClick?.(week.week)}
                    className="w-full text-left p-2 rounded-md bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-medium">
                        {week.week}
                      </div>
                      <span className="text-xs text-foreground line-clamp-1">
                        {week.inClassFocus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Materials */}
          {coveringMaterials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                Source Materials ({coveringMaterials.length})
              </p>
              <div className="space-y-1.5">
                {coveringMaterials.map((material) => (
                  <button
                    key={material.id}
                    onClick={() => onMaterialClick?.(material.id)}
                    className="w-full text-left p-2 rounded-md bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="text-xs text-foreground line-clamp-1">
                        {material.name}
                      </span>
                      <Badge variant="outline" className="text-[10px] ml-auto flex-shrink-0">
                        {material.tag}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Outcomes */}
          {servedOutcomes.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Target className="h-3 w-3" />
                Learning Outcomes Served ({servedOutcomes.length})
              </p>
              <div className="space-y-1.5">
                {servedOutcomes.map((outcome, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-md bg-accent/10 border border-accent/20"
                  >
                    <p className="text-xs text-foreground">{outcome.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </Card>
  )
}

// Edge tooltip component for explaining dependencies
interface EdgeTooltipProps {
  sourceConcept: Concept
  targetConcept: Concept
  materials: CourseMaterial[]
  onClose: () => void
}

export function EdgeTooltip({
  sourceConcept,
  targetConcept,
  materials,
  onClose,
}: EdgeTooltipProps) {
  const isGap = sourceConcept.weekIntroduced && targetConcept.weekIntroduced &&
    sourceConcept.weekIntroduced > targetConcept.weekIntroduced

  // Find material that surfaces this assumption
  const sourceMaterial = materials.find(m => sourceConcept.coveredBy.includes(m.id))
  const targetMaterial = materials.find(m => targetConcept.coveredBy.includes(m.id))

  return (
    <Card className="w-72 shadow-lg border-border">
      <CardHeader className="py-2 px-3 border-b border-border">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-medium">Dependency</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="h-5 w-5 p-0">
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="text-xs">
            {sourceConcept.name}
            <span className="ml-1 opacity-60">W{sourceConcept.weekIntroduced}</span>
          </Badge>
          <ArrowRight className="h-3 w-3 text-muted-foreground" />
          <Badge variant="secondary" className="text-xs">
            {targetConcept.name}
            <span className="ml-1 opacity-60">W{targetConcept.weekIntroduced}</span>
          </Badge>
        </div>

        {isGap && (
          <div className="p-2 rounded-md bg-amber-500/10 border border-amber-200">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-amber-700">Prerequisite Gap</p>
                <p className="text-[11px] text-amber-600 mt-0.5">
                  {targetConcept.name} assumes familiarity with {sourceConcept.name}, 
                  but {sourceConcept.name} isn&apos;t introduced until Week {sourceConcept.weekIntroduced}.
                </p>
              </div>
            </div>
          </div>
        )}

        {targetMaterial && (
          <p className="text-[11px] text-muted-foreground">
            See <span className="font-medium text-foreground">{targetMaterial.name}</span>
            {targetMaterial.pageRanges && `, ${targetMaterial.pageRanges}`}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
