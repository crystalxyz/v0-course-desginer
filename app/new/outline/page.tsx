"use client"

import { useState, useCallback, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  GripVertical,
  MoreVertical,
  Plus,
  RefreshCw,
  Split,
  Merge,
  Trash2,
  Sparkles,
  FileText,
  Target,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { CourseSettings, CourseMaterial, OutlineWeek, CourseOutline } from "@/lib/course-types"
import { sampleOutline, sampleOutlineWeeks, generateOutline } from "@/lib/mock-course-data"

// Agent panel actions for outline
const outlineAgentActions = [
  { id: "rename", label: "Rename topic", icon: "edit" },
  { id: "reorder", label: "Reorder weeks", icon: "move" },
  { id: "merge", label: "Merge weeks", icon: "merge" },
  { id: "split", label: "Split week", icon: "split" },
  { id: "regenerate", label: "Regenerate outline", icon: "refresh" },
]

export default function OutlinePage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(true)
  const [isRegenerating, setIsRegenerating] = useState(false)
  const [courseSettings, setCourseSettings] = useState<CourseSettings | null>(null)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [outline, setOutline] = useState<CourseOutline | null>(null)
  const [editingWeek, setEditingWeek] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<{ topic: string; description: string }>({ topic: "", description: "" })
  const [regeneratePrompt, setRegeneratePrompt] = useState("")
  const [draggedWeek, setDraggedWeek] = useState<number | null>(null)
  const [dragOverWeek, setDragOverWeek] = useState<number | null>(null)

  // Compute outcomes coverage from outline topics
  const outcomeCoverage = useMemo(() => {
    if (!courseSettings?.learningOutcomes || !outline) return []
    const outcomes = courseSettings.learningOutcomes.split("\n").filter(Boolean)
    return outcomes.map(outcome => {
      // Mock coverage - in production this would be computed by LLM
      const covered = outline.weeks.some(w => 
        w.topic.toLowerCase().includes(outcome.toLowerCase().slice(0, 10)) ||
        w.description.toLowerCase().includes(outcome.toLowerCase().slice(0, 10))
      )
      return { outcome, covered }
    })
  }, [courseSettings, outline])

  const coveredCount = outcomeCoverage.filter(o => o.covered).length

  useEffect(() => {
    const storedSettings = localStorage.getItem("currentCourseSettings")
    const storedMaterials = localStorage.getItem("currentCourseMaterials")

    if (storedSettings) {
      setCourseSettings(JSON.parse(storedSettings))
    }
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials))
    }

    // Generate outline
    const generate = async () => {
      setIsGenerating(true)
      await new Promise((resolve) => setTimeout(resolve, 1500))
      
      // Use sample outline or generate based on settings
      const settings = storedSettings ? JSON.parse(storedSettings) : null
      const generatedOutline: CourseOutline = {
        weeks: sampleOutlineWeeks.slice(0, settings?.weeks || 14),
        generatedAt: new Date(),
      }
      
      setOutline(generatedOutline)
      setIsGenerating(false)
    }

    generate()
  }, [])

  const handleEditStart = useCallback((week: OutlineWeek) => {
    setEditingWeek(week.week)
    setEditValues({ topic: week.topic, description: week.description })
  }, [])

  const handleEditSave = useCallback(() => {
    if (!outline || editingWeek === null) return
    
    const updatedWeeks = outline.weeks.map(w => 
      w.week === editingWeek 
        ? { ...w, topic: editValues.topic, description: editValues.description }
        : w
    )
    setOutline({ ...outline, weeks: updatedWeeks })
    setEditingWeek(null)
    setEditValues({ topic: "", description: "" })
  }, [outline, editingWeek, editValues])

  const handleEditCancel = useCallback(() => {
    setEditingWeek(null)
    setEditValues({ topic: "", description: "" })
  }, [])

  // ---------- Outline Assistant ----------
  type RenameSuggestion = { week: number; from: string; to: string }
  type OutcomeMapping = { outcome: string; weeks: number[] }
  type OverloadFlag = { week: number; topic: string; reason: string }
  type MergeSuggestion = { week: number; nextWeek: number; topic: string; nextTopic: string; reason: string }
  type AssistantResult =
    | { kind: "rename"; suggestions: RenameSuggestion[] }
    | { kind: "outcomes"; mappings: OutcomeMapping[]; uncovered: string[] }
    | { kind: "overload"; flags: OverloadFlag[] }
    | { kind: "merges"; suggestions: MergeSuggestion[] }

  const [assistantBusy, setAssistantBusy] = useState<string | null>(null)
  const [assistantResult, setAssistantResult] = useState<AssistantResult | null>(null)

  const dismissAssistant = useCallback(() => setAssistantResult(null), [])

  const runAssistant = useCallback(
    async (action: AssistantResult["kind"]) => {
      if (!outline) return
      setAssistantBusy(action)
      setAssistantResult(null)
      // Realistic "thinking" delay
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 500))

      if (action === "rename") {
        const suggestions: RenameSuggestion[] = outline.weeks
          .filter((w) => w.topic && w.description && w.pinnedMaterialIds.length > 0)
          .slice(0, 5)
          .map((w) => {
            const firstPhrase = w.description
              .split(/[,.;]/)[0]
              .trim()
              .replace(/^[A-Z]/, (c) => c.toLowerCase())
            const enriched = firstPhrase && firstPhrase.length > 8 && firstPhrase.length < 60
              ? `${w.topic}: ${firstPhrase}`
              : `${w.topic} & Applications`
            return { week: w.week, from: w.topic, to: enriched }
          })
        setAssistantResult({ kind: "rename", suggestions })
      } else if (action === "outcomes") {
        const outcomes = (courseSettings?.learningOutcomes ?? "")
          .split("\n")
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean)
        const mappings: OutcomeMapping[] = outcomes.map((outcome) => {
          const tokens = outcome.toLowerCase().split(/[\s,]+/).filter((t) => t.length > 4)
          const weeks = outline.weeks
            .filter((w) => {
              const hay = `${w.topic} ${w.description}`.toLowerCase()
              return tokens.some((t) => hay.includes(t))
            })
            .map((w) => w.week)
          return { outcome, weeks }
        })
        const uncovered = mappings.filter((m) => m.weeks.length === 0).map((m) => m.outcome)
        setAssistantResult({ kind: "outcomes", mappings, uncovered })
      } else if (action === "overload") {
        const flags: OverloadFlag[] = outline.weeks
          .map((w) => {
            const matCount = w.pinnedMaterialIds.length
            const descLen = w.description.length
            if (matCount >= 3) {
              return { week: w.week, topic: w.topic, reason: `${matCount} pinned materials — risk of cognitive overload` }
            }
            if (matCount >= 2 && descLen > 80) {
              return { week: w.week, topic: w.topic, reason: `Dense scope (${matCount} materials + broad description) — consider splitting` }
            }
            return null
          })
          .filter((f): f is OverloadFlag => f !== null)
          .slice(0, 4)

        // If nothing flagged, fall back to highlighting the busiest weeks anyway.
        if (flags.length === 0) {
          const sorted = [...outline.weeks].sort(
            (a, b) => b.pinnedMaterialIds.length - a.pinnedMaterialIds.length
          )
          if (sorted[0]?.pinnedMaterialIds.length > 0) {
            flags.push({
              week: sorted[0].week,
              topic: sorted[0].topic,
              reason: `Heaviest week (${sorted[0].pinnedMaterialIds.length} materials) — manageable but watch student feedback`,
            })
          }
        }
        setAssistantResult({ kind: "overload", flags })
      } else if (action === "merges") {
        const suggestions: MergeSuggestion[] = []
        for (let i = 0; i < outline.weeks.length - 1; i++) {
          const a = outline.weeks[i]
          const b = outline.weeks[i + 1]
          const lightA = a.pinnedMaterialIds.length === 0
          const lightB = b.pinnedMaterialIds.length === 0
          if (lightA && lightB) {
            suggestions.push({
              week: a.week,
              nextWeek: b.week,
              topic: a.topic,
              nextTopic: b.topic,
              reason: "Both weeks have no pinned readings — merging frees up a teaching slot",
            })
          } else if ((lightA || lightB) && (a.topic.toLowerCase().includes("project") || b.topic.toLowerCase().includes("project"))) {
            suggestions.push({
              week: a.week,
              nextWeek: b.week,
              topic: a.topic,
              nextTopic: b.topic,
              reason: "Project work + light week — consolidate into a single project sprint",
            })
          }
        }
        setAssistantResult({ kind: "merges", suggestions: suggestions.slice(0, 3) })
      }
      setAssistantBusy(null)
    },
    [outline, courseSettings]
  )

  // Apply rename suggestions to the outline.
  const applyRenames = useCallback(
    (suggestions: RenameSuggestion[]) => {
      if (!outline) return
      const map = new Map(suggestions.map((s) => [s.week, s.to]))
      const newWeeks = outline.weeks.map((w) =>
        map.has(w.week) ? { ...w, topic: map.get(w.week)! } : w
      )
      setOutline({ ...outline, weeks: newWeeks })
      setAssistantResult(null)
    },
    [outline]
  )

  const handleSplitWeek = useCallback((weekNum: number) => {
    if (!outline) return
    
    const weekIndex = outline.weeks.findIndex(w => w.week === weekNum)
    if (weekIndex === -1) return
    
    const originalWeek = outline.weeks[weekIndex]
    const newWeeks = [...outline.weeks]
    
    // Insert a new week after the current one
    newWeeks.splice(weekIndex + 1, 0, {
      week: weekNum + 1,
      topic: `${originalWeek.topic} (Part 2)`,
      description: "Continuation of previous week's topics",
      pinnedMaterialIds: [],
    })
    
    // Renumber subsequent weeks
    for (let i = weekIndex + 2; i < newWeeks.length; i++) {
      newWeeks[i] = { ...newWeeks[i], week: newWeeks[i].week + 1 }
    }
    
    setOutline({ ...outline, weeks: newWeeks })
  }, [outline])

  const handleMergeWithNext = useCallback((weekNum: number) => {
    if (!outline) return
    
    const weekIndex = outline.weeks.findIndex(w => w.week === weekNum)
    if (weekIndex === -1 || weekIndex >= outline.weeks.length - 1) return
    
    const currentWeek = outline.weeks[weekIndex]
    const nextWeek = outline.weeks[weekIndex + 1]
    
    const newWeeks = outline.weeks.filter((_, i) => i !== weekIndex + 1)
    newWeeks[weekIndex] = {
      ...currentWeek,
      topic: `${currentWeek.topic} + ${nextWeek.topic}`,
      description: `${currentWeek.description}. ${nextWeek.description}`,
      pinnedMaterialIds: [...currentWeek.pinnedMaterialIds, ...nextWeek.pinnedMaterialIds],
    }
    
    // Renumber subsequent weeks
    for (let i = weekIndex + 1; i < newWeeks.length; i++) {
      newWeeks[i] = { ...newWeeks[i], week: newWeeks[i].week - 1 }
    }
    
    setOutline({ ...outline, weeks: newWeeks })
  }, [outline])

  const handleDeleteWeek = useCallback((weekNum: number) => {
    if (!outline) return
    
    const newWeeks = outline.weeks.filter(w => w.week !== weekNum)
    
    // Renumber subsequent weeks
    newWeeks.forEach((w, i) => {
      w.week = i + 1
    })
    
    setOutline({ ...outline, weeks: newWeeks })
  }, [outline])

  const handleAddWeek = useCallback(() => {
    if (!outline) return
    
    const newWeek: OutlineWeek = {
      week: outline.weeks.length + 1,
      topic: "New Week",
      description: "Enter topic description",
      pinnedMaterialIds: [],
    }
    
    setOutline({ ...outline, weeks: [...outline.weeks, newWeek] })
  }, [outline])

  const handleRegenerate = useCallback(async () => {
    if (!outline) return
    
    setIsRegenerating(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Mock regeneration - in production this would call LLM with the prompt
    setOutline({
      ...outline,
      generatedAt: new Date(),
    })
    setIsRegenerating(false)
    setRegeneratePrompt("")
  }, [outline])

  // Drag and drop handlers
  const handleDragStart = useCallback((weekNum: number) => {
    setDraggedWeek(weekNum)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent, weekNum: number) => {
    e.preventDefault()
    if (draggedWeek !== null && draggedWeek !== weekNum) {
      setDragOverWeek(weekNum)
    }
  }, [draggedWeek])

  const handleDragLeave = useCallback(() => {
    setDragOverWeek(null)
  }, [])

  const handleDrop = useCallback((targetWeekNum: number) => {
    if (!outline || draggedWeek === null || draggedWeek === targetWeekNum) return
    
    const weeks = [...outline.weeks]
    const draggedIndex = weeks.findIndex(w => w.week === draggedWeek)
    const targetIndex = weeks.findIndex(w => w.week === targetWeekNum)
    
    if (draggedIndex === -1 || targetIndex === -1) return
    
    // Remove dragged week and insert at target position
    const [removed] = weeks.splice(draggedIndex, 1)
    weeks.splice(targetIndex, 0, removed)
    
    // Renumber all weeks
    weeks.forEach((w, i) => {
      w.week = i + 1
    })
    
    setOutline({ ...outline, weeks })
    setDraggedWeek(null)
    setDragOverWeek(null)
  }, [outline, draggedWeek])

  const handleContinue = useCallback(() => {
    if (!outline) return
    localStorage.setItem("currentCourseOutline", JSON.stringify(outline))
    router.push("/new/plan")
  }, [outline, router])

  const getMaterialName = useCallback((id: string) => {
    const material = materials.find(m => m.id === id)
    return material?.name.replace(".pdf", "") || id
  }, [materials])

  if (isGenerating) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <GraduationCap className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-lg">Course Designer</span>
            </Link>
          </div>
        </header>

        {/* Loading State */}
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-6">
              <Loader2 className="h-8 w-8 text-accent animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Generating course outline</h2>
            <p className="text-muted-foreground max-w-md">
              Analyzing materials and creating week-by-week topic sequence...
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Course Designer</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/new/materials">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Setup</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Materials</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Outline</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                4
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Outline */}
            <div className="lg:col-span-8">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Course Outline</h1>
                <p className="text-muted-foreground">
                  Review and adjust the week-level topic sequence before generating the detailed plan.
                </p>
              </div>

              {/* Outcomes Coverage Indicator */}
              {outcomeCoverage.length > 0 && (
                <div className="mb-4 flex items-center gap-3">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Outcomes coverage:</span>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        coveredCount === outcomeCoverage.length 
                          ? "bg-accent/10 text-accent border-accent/20" 
                          : "bg-amber-500/10 text-amber-600 border-amber-200"
                      )}
                    >
                      {coveredCount === outcomeCoverage.length ? (
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                      ) : (
                        <AlertCircle className="h-3 w-3 mr-1" />
                      )}
                      {coveredCount}/{outcomeCoverage.length} covered
                    </Badge>
                  </div>
                </div>
              )}

              {/* Week Cards */}
              <div className="space-y-3 mb-6">
                {outline?.weeks.map((week) => {
                  const isEditing = editingWeek === week.week
                  const isDragOver = dragOverWeek === week.week
                  
                  return (
                    <Card
                      key={week.week}
                      className={cn(
                        "border-border transition-all",
                        isDragOver && "ring-2 ring-primary bg-primary/5",
                        draggedWeek === week.week && "opacity-50"
                      )}
                      draggable={!isEditing}
                      onDragStart={() => handleDragStart(week.week)}
                      onDragOver={(e) => handleDragOver(e, week.week)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(week.week)}
                    >
                      <CardContent className="py-3 px-4">
                        <div className="flex items-start gap-3">
                          {/* Drag handle */}
                          <div className="flex-shrink-0 cursor-grab active:cursor-grabbing pt-1">
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 hover:text-muted-foreground" />
                          </div>
                          
                          {/* Week number */}
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                            {week.week}
                          </div>
                          
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {isEditing ? (
                              <div className="space-y-3">
                                <Input
                                  value={editValues.topic}
                                  onChange={(e) => setEditValues({ ...editValues, topic: e.target.value })}
                                  placeholder="Week topic"
                                  className="text-sm font-medium"
                                />
                                <Input
                                  value={editValues.description}
                                  onChange={(e) => setEditValues({ ...editValues, description: e.target.value })}
                                  placeholder="Brief description"
                                  className="text-sm"
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" onClick={handleEditSave}>
                                    <Check className="h-3 w-3 mr-1" />
                                    Save
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={handleEditCancel}>
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p 
                                  className="text-sm font-medium text-foreground cursor-pointer hover:text-primary"
                                  onClick={() => handleEditStart(week)}
                                >
                                  {week.topic}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {week.description}
                                </p>
                                {week.pinnedMaterialIds.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {week.pinnedMaterialIds.map(id => (
                                      <Badge key={id} variant="secondary" className="text-[10px]">
                                        <FileText className="h-2.5 w-2.5 mr-1" />
                                        {getMaterialName(id).slice(0, 20)}...
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Actions */}
                          {!isEditing && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSplitWeek(week.week)}>
                                  <Split className="h-4 w-4 mr-2" />
                                  Split week
                                </DropdownMenuItem>
                                {week.week < (outline?.weeks.length || 0) && (
                                  <DropdownMenuItem onClick={() => handleMergeWithNext(week.week)}>
                                    <Merge className="h-4 w-4 mr-2" />
                                    Merge with next
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleEditStart(week)}>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Regenerate
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteWeek(week.week)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {/* Add Week */}
              <Button variant="outline" onClick={handleAddWeek} className="w-full mb-6">
                <Plus className="h-4 w-4 mr-2" />
                Add week
              </Button>

              {/* Regenerate Section */}
              <Card className="border-border mb-6">
                <CardContent className="py-4 px-4">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-2">Regenerate full outline</p>
                      <Textarea
                        value={regeneratePrompt}
                        onChange={(e) => setRegeneratePrompt(e.target.value)}
                        placeholder="Optional: Describe how you'd like to change the outline..."
                        className="text-sm min-h-[60px] mb-3"
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleRegenerate}
                        disabled={isRegenerating}
                      >
                        {isRegenerating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4 mr-2" />
                        )}
                        Regenerate outline
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/new/materials">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <Button
                  size="lg"
                  onClick={handleContinue}
                  disabled={!outline || outline.weeks.length === 0}
                  className="min-w-[200px]"
                >
                  Generate detailed plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Right: Agent Panel (scoped to outline actions) */}
            <div className="lg:col-span-4">
              <Card className="border-border sticky top-24">
                <CardContent className="py-4 px-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Outline Assistant</span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-4">
                    Ask me to help with the outline. I can rename topics, reorder weeks, merge or split content.
                  </p>

                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => runAssistant("rename")}
                      disabled={!!assistantBusy}
                    >
                      {assistantBusy === "rename" ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <RefreshCw className="h-3 w-3 mr-2" />
                      )}
                      Suggest better topic names
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => runAssistant("outcomes")}
                      disabled={!!assistantBusy}
                    >
                      {assistantBusy === "outcomes" ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Target className="h-3 w-3 mr-2" />
                      )}
                      Map outcomes to weeks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => runAssistant("overload")}
                      disabled={!!assistantBusy}
                    >
                      {assistantBusy === "overload" ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Split className="h-3 w-3 mr-2" />
                      )}
                      Identify overloaded weeks
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs h-8"
                      onClick={() => runAssistant("merges")}
                      disabled={!!assistantBusy}
                    >
                      {assistantBusy === "merges" ? (
                        <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      ) : (
                        <Merge className="h-3 w-3 mr-2" />
                      )}
                      Suggest merges
                    </Button>
                  </div>

                  {/* Assistant result panel */}
                  {(assistantBusy || assistantResult) && (
                    <div className="mt-4 pt-4 border-t border-border">
                      {assistantBusy && !assistantResult ? (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span>Analyzing outline…</span>
                        </div>
                      ) : assistantResult ? (
                        <div className="rounded-md bg-accent/5 border border-accent/20 p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-medium text-foreground">
                              {assistantResult.kind === "rename" && "Suggested topic names"}
                              {assistantResult.kind === "outcomes" && "Outcome → week mapping"}
                              {assistantResult.kind === "overload" && "Potentially overloaded weeks"}
                              {assistantResult.kind === "merges" && "Merge candidates"}
                            </p>
                            <button
                              onClick={dismissAssistant}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Dismiss"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>

                          {assistantResult.kind === "rename" && (
                            <div className="space-y-2">
                              {assistantResult.suggestions.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground">
                                  Topic names already look concise — nothing to rename.
                                </p>
                              ) : (
                                <>
                                  <ul className="space-y-1.5">
                                    {assistantResult.suggestions.map((s) => (
                                      <li key={s.week} className="text-[11px] leading-snug">
                                        <span className="text-muted-foreground">W{s.week}:</span>{" "}
                                        <span className="line-through text-muted-foreground/70">{s.from}</span>
                                        <br />
                                        <span className="text-accent">↳ {s.to}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  <Button
                                    size="sm"
                                    className="w-full h-7 text-[11px]"
                                    onClick={() => applyRenames(assistantResult.suggestions)}
                                  >
                                    <Check className="h-3 w-3 mr-1.5" />
                                    Apply all
                                  </Button>
                                </>
                              )}
                            </div>
                          )}

                          {assistantResult.kind === "outcomes" && (
                            <div className="space-y-2">
                              <ul className="space-y-1.5">
                                {assistantResult.mappings.map((m, i) => (
                                  <li key={i} className="text-[11px] leading-snug">
                                    <span className="text-foreground line-clamp-2">{m.outcome}</span>
                                    <span className="text-muted-foreground">
                                      {m.weeks.length > 0
                                        ? ` → Weeks ${m.weeks.join(", ")}`
                                        : " → Not yet covered"}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                              {assistantResult.uncovered.length > 0 && (
                                <div className="flex items-start gap-1.5 mt-2 pt-2 border-t border-accent/20">
                                  <AlertCircle className="h-3 w-3 text-amber-600 mt-0.5 shrink-0" />
                                  <p className="text-[11px] text-muted-foreground">
                                    {assistantResult.uncovered.length} outcome
                                    {assistantResult.uncovered.length === 1 ? "" : "s"} not yet
                                    covered by any week's topic
                                  </p>
                                </div>
                              )}
                            </div>
                          )}

                          {assistantResult.kind === "overload" && (
                            <div className="space-y-1.5">
                              {assistantResult.flags.length === 0 ? (
                                <div className="flex items-start gap-1.5">
                                  <CheckCircle2 className="h-3 w-3 text-emerald-600 mt-0.5 shrink-0" />
                                  <p className="text-[11px] text-muted-foreground">
                                    Workload looks balanced. No weeks flagged.
                                  </p>
                                </div>
                              ) : (
                                assistantResult.flags.map((f, i) => (
                                  <div key={i} className="text-[11px] leading-snug">
                                    <p className="font-medium text-foreground">
                                      W{f.week}: {f.topic}
                                    </p>
                                    <p className="text-muted-foreground">{f.reason}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          )}

                          {assistantResult.kind === "merges" && (
                            <div className="space-y-2">
                              {assistantResult.suggestions.length === 0 ? (
                                <p className="text-[11px] text-muted-foreground">
                                  No obvious merge candidates — adjacent weeks have distinct content.
                                </p>
                              ) : (
                                assistantResult.suggestions.map((s, i) => (
                                  <div
                                    key={i}
                                    className="text-[11px] leading-snug pb-2 border-b border-accent/10 last:border-b-0 last:pb-0"
                                  >
                                    <p className="font-medium text-foreground">
                                      W{s.week} ({s.topic}) + W{s.nextWeek} ({s.nextTopic})
                                    </p>
                                    <p className="text-muted-foreground mb-1.5">{s.reason}</p>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      className="h-6 text-[10px] px-2"
                                      onClick={() => {
                                        handleMergeWithNext(s.week)
                                        setAssistantResult(null)
                                      }}
                                    >
                                      <Merge className="h-2.5 w-2.5 mr-1" />
                                      Apply merge
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Quick stats</p>
                    <div className="space-y-1.5 text-xs text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Total weeks</span>
                        <span className="font-medium text-foreground">{outline?.weeks.length || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Materials assigned</span>
                        <span className="font-medium text-foreground">
                          {outline?.weeks.reduce((acc, w) => acc + w.pinnedMaterialIds.length, 0) || 0}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Empty weeks</span>
                        <span className="font-medium text-foreground">
                          {outline?.weeks.filter(w => w.pinnedMaterialIds.length === 0).length || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


