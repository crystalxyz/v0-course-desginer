"use client"

import { useState, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  MessageSquare,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  Edit2,
  Check,
  X,
  AlertTriangle,
  GripVertical,
  Clock,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { CourseWeek, GapWarning, HoverState } from "@/lib/course-types"

interface WeekScheduleProps {
  weeks: CourseWeek[]
  gapWarnings?: GapWarning[]
  onUpdateWeek?: (weekNumber: number, updates: Partial<CourseWeek>) => void
  onWeekReorder?: (fromWeek: number, toWeek: number) => void
  onReadingMove?: (readingId: string, fromWeek: number, toWeek: number) => void
  onGapClick?: (warning: GapWarning) => void
  hoverState?: HoverState
  onHoverChange?: (state: HoverState) => void
  selectedWeek?: number
  onWeekSelect?: (week: number) => void
}

// Load indicator dots (1-5)
function LoadIndicator({ hours }: { hours: number }) {
  const dots = Math.min(Math.max(Math.ceil(hours / 1.5), 1), 5)
  return (
    <div className="flex items-center gap-0.5" title={`~${hours} hours`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Circle
          key={i}
          className={cn(
            "h-1.5 w-1.5",
            i < dots ? "fill-primary text-primary" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}

export function WeekSchedule({ 
  weeks, 
  gapWarnings = [], 
  onUpdateWeek,
  onWeekReorder,
  onReadingMove,
  onGapClick,
  hoverState,
  onHoverChange,
  selectedWeek,
  onWeekSelect,
}: WeekScheduleProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1)
  const [editingWeek, setEditingWeek] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<CourseWeek>>({})
  const [draggedReading, setDraggedReading] = useState<{ weekNum: number; index: number } | null>(null)
  const [dragOverWeek, setDragOverWeek] = useState<number | null>(null)

  const getGapWarningsForWeek = (weekNum: number) => {
    return gapWarnings.filter((g) => g.assumedInWeek === weekNum)
  }

  const startEditing = (week: CourseWeek) => {
    setEditingWeek(week.week)
    setEditValues({
      inClassFocus: week.inClassFocus,
      discussionQuestions: week.discussionQuestions,
      problemSet: week.problemSet,
    })
  }

  const cancelEditing = () => {
    setEditingWeek(null)
    setEditValues({})
  }

  const saveEditing = (weekNum: number) => {
    if (onUpdateWeek) {
      onUpdateWeek(weekNum, editValues)
    }
    setEditingWeek(null)
    setEditValues({})
  }

  const handleWeekClick = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum)
    onWeekSelect?.(weekNum)
  }

  const handleMouseEnter = (weekNum: number) => {
    onHoverChange?.({ type: "week", id: `week-${weekNum}`, weekNumber: weekNum })
  }

  const handleMouseLeave = () => {
    onHoverChange?.({ type: null, id: null })
  }

  // Drag and drop for readings
  const handleReadingDragStart = (e: React.DragEvent, weekNum: number, readingIndex: number) => {
    setDraggedReading({ weekNum, index: readingIndex })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleWeekDragOver = (e: React.DragEvent, weekNum: number) => {
    e.preventDefault()
    if (draggedReading && draggedReading.weekNum !== weekNum) {
      setDragOverWeek(weekNum)
    }
  }

  const handleWeekDragLeave = () => {
    setDragOverWeek(null)
  }

  const handleWeekDrop = (e: React.DragEvent, targetWeek: number) => {
    e.preventDefault()
    if (draggedReading && onReadingMove) {
      const week = weeks.find(w => w.week === draggedReading.weekNum)
      const reading = week?.readings[draggedReading.index]
      if (reading) {
        onReadingMove(reading.materialId, draggedReading.weekNum, targetWeek)
      }
    }
    setDraggedReading(null)
    setDragOverWeek(null)
  }

  // Check if this week should be highlighted based on hover state
  const isWeekHighlighted = (weekNum: number) => {
    if (!hoverState || hoverState.type === null) return false
    if (hoverState.type === "material") {
      // Check if this week has readings from the hovered material
      const week = weeks.find(w => w.week === weekNum)
      return week?.readings.some(r => r.materialId === hoverState.id) || false
    }
    if (hoverState.type === "concept") {
      // Check if this week introduces the hovered concept
      const week = weeks.find(w => w.week === weekNum)
      // Would need concept data to check properly
      return false
    }
    return false
  }

  return (
    <div className="space-y-3 overflow-y-auto h-full pr-2">
      {weeks.map((week) => {
        const weekGaps = getGapWarningsForWeek(week.week)
        const isExpanded = expandedWeek === week.week
        const isEditing = editingWeek === week.week
        const hasGaps = weekGaps.length > 0
        const isHighlighted = isWeekHighlighted(week.week)
        const isSelected = selectedWeek === week.week
        const isDragOver = dragOverWeek === week.week

        return (
          <Card
            key={week.week}
            className={cn(
              "border-border transition-all",
              hasGaps && "border-l-2 border-l-amber-500",
              isExpanded && "ring-1 ring-accent",
              isHighlighted && "ring-2 ring-primary/50 bg-primary/5",
              isSelected && "ring-2 ring-primary",
              isDragOver && "ring-2 ring-primary bg-primary/10"
            )}
            onMouseEnter={() => handleMouseEnter(week.week)}
            onMouseLeave={handleMouseLeave}
            onDragOver={(e) => handleWeekDragOver(e, week.week)}
            onDragLeave={handleWeekDragLeave}
            onDrop={(e) => handleWeekDrop(e, week.week)}
          >
            <CardHeader
              className="py-3 px-4 cursor-pointer"
              onClick={() => handleWeekClick(week.week)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {week.week}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm font-medium">Week {week.week}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {week.inClassFocus || "No focus set"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Load indicator */}
                  {week.estimatedHours && (
                    <LoadIndicator hours={week.estimatedHours} />
                  )}
                  
                  {/* Gap warning pill */}
                  {weekGaps.length > 0 && (
                    <Badge 
                      variant="outline" 
                      className="bg-amber-500/10 text-amber-600 border-amber-200 text-[10px] cursor-pointer hover:bg-amber-500/20"
                      onClick={(e) => {
                        e.stopPropagation()
                        onGapClick?.(weekGaps[0])
                      }}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {weekGaps.length} gap{weekGaps.length > 1 ? "s" : ""}
                    </Badge>
                  )}
                  
                  {/* Reading count */}
                  {week.readings.length > 0 && (
                    <Badge variant="secondary" className="text-[10px]">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {week.readings.length}
                    </Badge>
                  )}
                  
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Collapsed state: show concept chips */}
              {!isExpanded && week.conceptsIntroduced.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 ml-10">
                  {week.conceptsIntroduced.slice(0, 5).map((concept) => (
                    <Badge 
                      key={concept} 
                      variant="outline" 
                      className="text-[10px] bg-secondary/50"
                    >
                      {concept}
                    </Badge>
                  ))}
                  {week.conceptsIntroduced.length > 5 && (
                    <Badge variant="outline" className="text-[10px] bg-secondary/50">
                      +{week.conceptsIntroduced.length - 5}
                    </Badge>
                  )}
                </div>
              )}
            </CardHeader>

            {isExpanded && (
              <CardContent className="pt-0 pb-4 px-4 space-y-4">
                {/* Gap Warnings */}
                {weekGaps.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-200 rounded-lg p-3">
                    <p className="text-xs font-medium text-amber-700 mb-2">Prerequisite gaps detected:</p>
                    {weekGaps.map((gap, i) => (
                      <div 
                        key={i} 
                        className="text-xs text-amber-600 mb-2 last:mb-0 cursor-pointer hover:text-amber-700"
                        onClick={() => onGapClick?.(gap)}
                      >
                        <span className="font-medium">{gap.concept}</span> is assumed by {gap.assumedByMaterial}
                        {gap.introducedInWeek && (
                          <span className="text-[11px]"> (not introduced until Week {gap.introducedInWeek})</span>
                        )}
                        {gap.suggestion && (
                          <p className="text-[10px] text-amber-500 mt-0.5">{gap.suggestion}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Readings with drag handles */}
                {week.readings.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" /> Readings
                    </p>
                    <div className="space-y-1.5">
                      {week.readings.map((reading, i) => (
                        <div
                          key={i}
                          draggable
                          onDragStart={(e) => handleReadingDragStart(e, week.week, i)}
                          className="text-xs bg-secondary/50 rounded-md p-2 border border-border cursor-grab active:cursor-grabbing flex items-start gap-2 group"
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground">{reading.materialName}</p>
                            {reading.pageRange && (
                              <p className="text-muted-foreground">Pages {reading.pageRange}</p>
                            )}
                            {reading.sectionAnchors && reading.sectionAnchors.length > 0 && (
                              <p className="text-muted-foreground">
                                Sections: {reading.sectionAnchors.join(", ")}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Concepts */}
                {week.conceptsIntroduced.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Concepts introduced</p>
                    <div className="flex flex-wrap gap-1">
                      {week.conceptsIntroduced.map((concept) => (
                        <Badge key={concept} variant="outline" className="text-[10px]">
                          {concept}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* In-class Focus */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">In-class focus</p>
                  {isEditing ? (
                    <Textarea
                      value={editValues.inClassFocus || ""}
                      onChange={(e) =>
                        setEditValues({ ...editValues, inClassFocus: e.target.value })
                      }
                      className="text-xs min-h-[60px]"
                    />
                  ) : (
                    <p className="text-xs text-foreground">{week.inClassFocus || "Not specified"}</p>
                  )}
                </div>

                {/* Discussion Questions */}
                {(week.discussionQuestions?.length || isEditing) && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" /> Discussion questions
                    </p>
                    {isEditing ? (
                      <Textarea
                        value={editValues.discussionQuestions?.join("\n") || ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            discussionQuestions: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        placeholder="One question per line"
                        className="text-xs min-h-[80px]"
                      />
                    ) : (
                      <ul className="space-y-1">
                        {week.discussionQuestions?.map((q, i) => (
                          <li key={i} className="text-xs text-foreground pl-3 border-l-2 border-border">
                            {q}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Problem Set */}
                {(week.problemSet?.length || isEditing) && (
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" /> Problem set
                    </p>
                    {isEditing ? (
                      <Textarea
                        value={editValues.problemSet?.join("\n") || ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            problemSet: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        placeholder="One problem per line"
                        className="text-xs min-h-[80px]"
                      />
                    ) : (
                      <ul className="space-y-1">
                        {week.problemSet?.map((p, i) => (
                          <li key={i} className="text-xs text-foreground pl-3 border-l-2 border-border">
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {/* Estimated Hours */}
                {week.estimatedHours && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>~{week.estimatedHours} hours student time</span>
                  </div>
                )}

                {/* Edit Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  {isEditing ? (
                    <>
                      <Button variant="ghost" size="sm" onClick={cancelEditing}>
                        <X className="h-3 w-3 mr-1" />
                        Cancel
                      </Button>
                      <Button size="sm" onClick={() => saveEditing(week.week)}>
                        <Check className="h-3 w-3 mr-1" />
                        Save
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => startEditing(week)}>
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        )
      })}
    </div>
  )
}
