"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  BookOpen, 
  FileText, 
  Calendar, 
  Tag, 
  AlertTriangle, 
  Plus, 
  X, 
  Target,
  CheckCircle2,
  Sparkles,
  Link as LinkIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { CourseMaterial, CourseWeek, HoverState, OutcomeCoverage } from "@/lib/course-types"

export interface SuggestedMaterial {
  id: string
  title: string
  summary: string
  reason: string
}

interface MaterialsPanelProps {
  materials: CourseMaterial[]
  weeks: CourseWeek[]
  outcomes?: OutcomeCoverage[]
  hoverState?: HoverState
  onHoverChange?: (state: HoverState) => void
  onMaterialClick?: (materialId: string) => void
  onMaterialDrop?: (materialId: string) => void
  onMaterialAdd?: (suggestion: SuggestedMaterial) => void
}

// Mock suggested materials for missing coverage
const suggestedMaterials = [
  {
    id: "suggested-1",
    title: "Efficient Large-Scale Language Model Training.pdf",
    summary: "Covers advanced training strategies not in current materials",
    reason: "Strengthens coverage of 'Design scalable ML training pipelines'",
  },
  {
    id: "suggested-2", 
    title: "Production ML Monitoring Best Practices.pdf",
    summary: "MLOps monitoring patterns and alerting strategies",
    reason: "Addresses gap in 'Apply MLOps best practices'",
  },
]

type FilterType = "all" | "mapped" | "low-relevance" | "suggested"

export function MaterialsPanel({
  materials,
  weeks,
  outcomes = [],
  hoverState,
  onHoverChange,
  onMaterialClick,
  onMaterialDrop,
  onMaterialAdd,
}: MaterialsPanelProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  // Get weeks that use each material
  const getMaterialWeeks = (materialId: string): number[] => {
    return weeks
      .filter(w => w.readings.some(r => r.materialId === materialId))
      .map(w => w.week)
  }

  // Get concepts extracted from each material
  const getMaterialConcepts = (material: CourseMaterial): string[] => {
    return material.extractedConcepts || []
  }

  // Compute material health stats
  const materialHealth = useMemo(() => {
    const mapped = materials.filter(m => getMaterialWeeks(m.id).length > 0)
    const unmapped = materials.filter(m => getMaterialWeeks(m.id).length === 0)
    
    // Low relevance = no concepts extracted and not used in any week
    const lowRelevance = materials.filter(m => {
      const concepts = getMaterialConcepts(m)
      const weeksUsed = getMaterialWeeks(m.id)
      return concepts.length === 0 && weeksUsed.length === 0
    })
    
    return {
      total: materials.length,
      mapped: mapped.length,
      lowRelevance: lowRelevance.length,
      suggested: suggestedMaterials.length,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials, weeks])

  // Filter materials based on active filter
  const filteredMaterials = useMemo(() => {
    switch (activeFilter) {
      case "mapped":
        return materials.filter(m => getMaterialWeeks(m.id).length > 0)
      case "low-relevance":
        return materials.filter(m => {
          const concepts = getMaterialConcepts(m)
          const weeksUsed = getMaterialWeeks(m.id)
          return concepts.length === 0 && weeksUsed.length === 0
        })
      case "suggested":
        return [] // Suggestions are shown separately
      default:
        return materials
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials, weeks, activeFilter])

  const isHighlighted = (materialId: string) => {
    if (!hoverState || hoverState.type === null) return false
    if (hoverState.type === "week") {
      const week = weeks.find(w => w.week === hoverState.weekNumber)
      return week?.readings.some(r => r.materialId === materialId) || false
    }
    if (hoverState.type === "concept") {
      const material = materials.find(m => m.id === materialId)
      return false
    }
    return hoverState.type === "material" && hoverState.id === materialId
  }

  const handleMouseEnter = (materialId: string) => {
    onHoverChange?.({ type: "material", id: materialId })
  }

  const handleMouseLeave = () => {
    onHoverChange?.({ type: null, id: null })
  }

  const tagColors: Record<string, string> = {
    core: "bg-primary/10 text-primary border-primary/20",
    supplementary: "bg-blue-500/10 text-blue-600 border-blue-200",
    reference: "bg-muted text-muted-foreground border-border",
  }

  const isLowRelevance = (material: CourseMaterial) => {
    const concepts = getMaterialConcepts(material)
    const weeksUsed = getMaterialWeeks(material.id)
    return concepts.length === 0 && weeksUsed.length === 0
  }

  const renderMaterial = (material: CourseMaterial) => {
    const usedInWeeks = getMaterialWeeks(material.id)
    const concepts = getMaterialConcepts(material)
    const highlighted = isHighlighted(material.id)
    const lowRelevance = isLowRelevance(material)

    return (
      <Card
        key={material.id}
        className={cn(
          "border-border transition-all cursor-pointer",
          highlighted && "ring-2 ring-primary/50 bg-primary/5",
          lowRelevance && "border-l-2 border-l-amber-500"
        )}
        onMouseEnter={() => handleMouseEnter(material.id)}
        onMouseLeave={handleMouseLeave}
        onClick={() => onMaterialClick?.(material.id)}
      >
        <CardContent className="py-3 px-4">
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground line-clamp-2 mb-1">
                {material.name}
              </p>
              
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                <Badge 
                  variant="outline" 
                  className={cn("text-[10px]", tagColors[material.tag])}
                >
                  {material.tag}
                </Badge>
                <span className="text-[10px] text-muted-foreground">{material.size}</span>
                
                {/* Low relevance warning */}
                {lowRelevance && (
                  <Badge 
                    variant="outline" 
                    className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200"
                  >
                    <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                    Low relevance
                  </Badge>
                )}
              </div>

              {/* Weeks used */}
              {usedInWeeks.length > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <div className="flex flex-wrap gap-0.5">
                    {usedInWeeks.map(week => (
                      <span 
                        key={week}
                        className="text-[10px] bg-secondary px-1 py-0.5 rounded"
                      >
                        W{week}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Concepts */}
              {concepts.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {concepts.slice(0, 4).map(concept => (
                    <Badge 
                      key={concept} 
                      variant="outline" 
                      className="text-[9px] px-1.5 py-0"
                    >
                      {concept}
                    </Badge>
                  ))}
                  {concepts.length > 4 && (
                    <Badge variant="outline" className="text-[9px] px-1.5 py-0">
                      +{concepts.length - 4}
                    </Badge>
                  )}
                </div>
              )}

              {/* Low relevance actions */}
              {lowRelevance && (
                <div className="flex gap-2 mt-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (onMaterialDrop) {
                        onMaterialDrop(material.id)
                      }
                      toast.success(`Removed "${material.name.replace(/\.pdf$/i, "")}"`, {
                        description: "Dropped from this course's reading list.",
                      })
                    }}
                  >
                    <X className="h-2.5 w-2.5 mr-1" />
                    Drop from course
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px]"
                    onClick={(e) => {
                      e.stopPropagation()
                      // Pick a deterministic outcome based on the material id hash
                      // — for the demo this is enough to make the toast believable.
                      const outcomeList =
                        outcomes.length > 0
                          ? outcomes.map((o) => o.outcome)
                          : ["Outcome 1", "Outcome 2", "Outcome 3"]
                      const idx =
                        Math.abs(
                          [...material.id].reduce((a, c) => a + c.charCodeAt(0), 0)
                        ) % outcomeList.length
                      const outcome = outcomeList[idx]
                      const truncated =
                        outcome.length > 60 ? outcome.slice(0, 60) + "…" : outcome
                      toast.success(`Mapped to outcome`, {
                        description: truncated,
                      })
                    }}
                  >
                    <LinkIcon className="h-2.5 w-2.5 mr-1" />
                    Map to outcome
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSuggestedMaterial = (suggestion: typeof suggestedMaterials[0]) => (
    <Card
      key={suggestion.id}
      className="border-border border-dashed bg-accent/5"
    >
      <CardContent className="py-3 px-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground line-clamp-1 mb-1">
              {suggestion.title}
            </p>
            <p className="text-xs text-muted-foreground mb-1">
              {suggestion.summary}
            </p>
            <p className="text-[10px] text-accent mb-2">
              {suggestion.reason}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px]"
              onClick={() => {
                if (onMaterialAdd) {
                  onMaterialAdd(suggestion)
                }
                toast.success(`Added "${suggestion.title.replace(/\.pdf$/i, "")}"`, {
                  description: "Now appears in your course materials.",
                })
              }}
            >
              <Plus className="h-2.5 w-2.5 mr-1" />
              Add to course
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="h-full flex flex-col">
      {/* Materials Health Summary */}
      <Card className="border-border mb-4 flex-shrink-0">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              Materials Health
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-4">
          <div className="flex flex-wrap gap-1.5">
            <Badge 
              variant={activeFilter === "all" ? "default" : "outline"}
              className="text-[10px] cursor-pointer hover:bg-primary/10"
              onClick={() => setActiveFilter("all")}
            >
              {materialHealth.total} materials
            </Badge>
            <Badge 
              variant={activeFilter === "mapped" ? "default" : "outline"}
              className={cn(
                "text-[10px] cursor-pointer hover:bg-accent/10",
                activeFilter !== "mapped" && "bg-accent/10 text-accent border-accent/20"
              )}
              onClick={() => setActiveFilter("mapped")}
            >
              <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
              {materialHealth.mapped} mapped
            </Badge>
            {materialHealth.lowRelevance > 0 && (
              <Badge 
                variant={activeFilter === "low-relevance" ? "default" : "outline"}
                className={cn(
                  "text-[10px] cursor-pointer hover:bg-amber-500/20",
                  activeFilter !== "low-relevance" && "bg-amber-500/10 text-amber-600 border-amber-200"
                )}
                onClick={() => setActiveFilter("low-relevance")}
              >
                <AlertTriangle className="h-2.5 w-2.5 mr-1" />
                {materialHealth.lowRelevance} low relevance
              </Badge>
            )}
            <Badge 
              variant={activeFilter === "suggested" ? "default" : "outline"}
              className={cn(
                "text-[10px] cursor-pointer hover:bg-primary/10",
                activeFilter !== "suggested" && "bg-primary/10 text-primary border-primary/20"
              )}
              onClick={() => setActiveFilter("suggested")}
            >
              <Sparkles className="h-2.5 w-2.5 mr-1" />
              {materialHealth.suggested} suggested
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 pr-2">
          {activeFilter === "suggested" ? (
            <>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Suggested Additions
              </p>
              {suggestedMaterials.map(renderSuggestedMaterial)}
            </>
          ) : (
            <>
              {filteredMaterials.length === 0 ? (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No materials match this filter
                </div>
              ) : (
                filteredMaterials.map(renderMaterial)
              )}
            </>
          )}

          {/* Show suggested additions at bottom when viewing all */}
          {activeFilter === "all" && suggestedMaterials.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Suggested Additions
              </p>
              {suggestedMaterials.map(renderSuggestedMaterial)}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
