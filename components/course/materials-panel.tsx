"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, FileText, Calendar, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseMaterial, CourseWeek, HoverState } from "@/lib/course-types"

interface MaterialsPanelProps {
  materials: CourseMaterial[]
  weeks: CourseWeek[]
  hoverState?: HoverState
  onHoverChange?: (state: HoverState) => void
  onMaterialClick?: (materialId: string) => void
}

export function MaterialsPanel({
  materials,
  weeks,
  hoverState,
  onHoverChange,
  onMaterialClick,
}: MaterialsPanelProps) {
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

  const isHighlighted = (materialId: string) => {
    if (!hoverState || hoverState.type === null) return false
    if (hoverState.type === "week") {
      const week = weeks.find(w => w.week === hoverState.weekNumber)
      return week?.readings.some(r => r.materialId === materialId) || false
    }
    if (hoverState.type === "concept") {
      const material = materials.find(m => m.id === materialId)
      // Would need to check if this material covers the hovered concept
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

  // Group materials by tag
  const coreMaterials = materials.filter(m => m.tag === "core")
  const supplementaryMaterials = materials.filter(m => m.tag === "supplementary")
  const referenceMaterials = materials.filter(m => m.tag === "reference")

  const renderMaterial = (material: CourseMaterial) => {
    const usedInWeeks = getMaterialWeeks(material.id)
    const concepts = getMaterialConcepts(material)
    const highlighted = isHighlighted(material.id)

    return (
      <Card
        key={material.id}
        className={cn(
          "border-border transition-all cursor-pointer",
          highlighted && "ring-2 ring-primary/50 bg-primary/5"
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
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Summary */}
      <Card className="border-border mb-4 flex-shrink-0">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-accent" />
              Course Materials
            </CardTitle>
            <Badge variant="secondary" className="text-xs">
              {materials.length} files
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-4">
          <div className="flex gap-2">
            <Badge variant="outline" className={cn("text-[10px]", tagColors.core)}>
              {coreMaterials.length} core
            </Badge>
            <Badge variant="outline" className={cn("text-[10px]", tagColors.supplementary)}>
              {supplementaryMaterials.length} supplementary
            </Badge>
            <Badge variant="outline" className={cn("text-[10px]", tagColors.reference)}>
              {referenceMaterials.length} reference
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Materials List */}
      <ScrollArea className="flex-1">
        <div className="space-y-4 pr-2">
          {/* Core */}
          {coreMaterials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Core Materials
              </p>
              <div className="space-y-2">
                {coreMaterials.map(renderMaterial)}
              </div>
            </div>
          )}

          {/* Supplementary */}
          {supplementaryMaterials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Supplementary
              </p>
              <div className="space-y-2">
                {supplementaryMaterials.map(renderMaterial)}
              </div>
            </div>
          )}

          {/* Reference */}
          {referenceMaterials.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Tag className="h-3 w-3" /> Reference
              </p>
              <div className="space-y-2">
                {referenceMaterials.map(renderMaterial)}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
