"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  Target,
  Check,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { WeekSchedule } from "@/components/course/week-schedule"
import { OutcomesTracker } from "@/components/course/outcomes-tracker"
import { MaterialsPanel } from "@/components/course/materials-panel"
import { ConceptDetail } from "@/components/course/concept-detail"
import { OptimizerProgress, buildOptimizerStages } from "@/components/course/optimizer-progress"
import { ConceptGraph } from "@/components/course/concept-graph"
import { PathPicker } from "@/components/course/path-picker"
import { Network, Route } from "lucide-react"
import { toast } from "sonner"

import {
  sampleCoursePlan,
  sampleConcepts,
  sampleWeeks,
  sampleOutcomeCoverage,
  sampleMaterials,
  sampleCalculusCoursePlan,
  sampleCalculusCourse,
} from "@/lib/mock-course-data"
import { calculusOptimizerStats, applyPathToConcepts } from "@/lib/optimizer-data"
import type {
  CourseSettings,
  CourseMaterial,
  CoursePlan,
  CourseWeek,
  Concept,
  HoverState,
  LearningPath,
} from "@/lib/course-types"

export default function CoursePlanPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(true)
  const [courseSettings, setCourseSettings] = useState<CourseSettings | null>(null)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [plan, setPlan] = useState<CoursePlan | null>(null)
  const [activeTab, setActiveTab] = useState("schedule")
  const [rightPanelTab, setRightPanelTab] = useState<"outcomes" | "materials" | "concept">("outcomes")
  
  // Interaction state
  const [hoverState, setHoverState] = useState<HoverState>({ type: null, id: null })
  const [selectedConcept, setSelectedConcept] = useState<Concept | null>(null)
  const [selectedWeek, setSelectedWeek] = useState<number | undefined>(undefined)

  // Detect which sample plan to base this off of from the course settings.
  const courseTemplate: "calculus" | "ml-systems" =
    (courseSettings?.title ?? "").toLowerCase().includes("calculus")
      ? "calculus"
      : "ml-systems"

  useEffect(() => {
    const storedSettings = localStorage.getItem("currentCourseSettings")
    const storedMaterials = localStorage.getItem("currentCourseMaterials")

    if (storedSettings) {
      setCourseSettings(JSON.parse(storedSettings))
    }
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials))
    } else {
      setMaterials(sampleMaterials)
    }
  }, [])

  // Run after the course template has been determined.
  const finishGeneration = useCallback(() => {
    const basePlan =
      courseTemplate === "calculus" ? sampleCalculusCoursePlan : sampleCoursePlan
    const generatedPlan: CoursePlan = {
      ...basePlan,
      id: `plan-${Date.now()}`,
      generatedAt: new Date(),
    }
    setPlan(generatedPlan)
    setIsGenerating(false)
  }, [courseTemplate])

  const conceptsWithWeeks: Concept[] = plan?.conceptGraph || sampleConcepts
  const currentMaterials = materials.length > 0 ? materials : sampleMaterials

  const handleUpdateWeek = useCallback((weekNumber: number, updates: Partial<CourseWeek>) => {
    if (!plan) return

    const updatedWeeks = plan.weeks.map((week) =>
      week.week === weekNumber ? { ...week, ...updates } : week
    )

    setPlan({ ...plan, weeks: updatedWeeks })
  }, [plan])

  const handleConceptClick = useCallback((concept: Concept) => {
    setSelectedConcept(concept)
    setRightPanelTab("concept")
    setActiveTab("schedule")
  }, [])

  // Set of week numbers that just changed after a path switch — used to
  // briefly highlight those week cards on the Schedule tab.
  const [recentlyChangedWeeks, setRecentlyChangedWeeks] = useState<Set<number>>(
    new Set()
  )

  const handlePathSelect = useCallback(
    (pathId: string) => {
      if (!plan) return
      if (plan.selectedPathId === pathId) return
      const path = plan.learningPaths?.find((p) => p.id === pathId)
      if (!path) return

      const weeksCount = courseSettings?.weeks ?? plan.weeks.length
      const hoursPerWeek = courseSettings?.hoursPerWeek ?? 4

      const { weeks: newWeeks, weekAssignment } = applyPathToConcepts(
        path,
        plan.conceptGraph,
        currentMaterials,
        { weeks: weeksCount, hoursPerWeek }
      )

      // Compute the set of weeks that actually changed (any difference in
      // conceptsIntroduced or readings).
      const changedSet = new Set<number>()
      newWeeks.forEach((w, i) => {
        const prev = plan.weeks[i]
        const sameConcepts =
          prev &&
          prev.conceptsIntroduced.length === w.conceptsIntroduced.length &&
          prev.conceptsIntroduced.every((c, j) => c === w.conceptsIntroduced[j])
        const sameReadings =
          prev &&
          prev.readings.length === w.readings.length &&
          prev.readings.every((r, j) => r.materialId === w.readings[j].materialId)
        if (!sameConcepts || !sameReadings) {
          changedSet.add(w.week)
        }
      })

      const updatedConcepts: Concept[] = plan.conceptGraph.map((c) => ({
        ...c,
        weekIntroduced: weekAssignment[c.id] ?? c.weekIntroduced,
      }))

      setPlan({
        ...plan,
        weeks: newWeeks.length > 0 ? newWeeks : plan.weeks,
        conceptGraph: updatedConcepts,
        selectedPathId: pathId,
      })

      // Light up the changed weeks; clear after ~5s.
      setRecentlyChangedWeeks(changedSet)
      // Auto-scroll the Schedule tab to the first changed week so the user
      // visually sees what's different.
      setActiveTab("schedule")
      const firstChanged = Math.min(...Array.from(changedSet))
      if (Number.isFinite(firstChanged)) {
        setSelectedWeek(firstChanged)
      }
      setTimeout(() => setRecentlyChangedWeeks(new Set()), 5000)

      const pathNumber =
        (plan.learningPaths?.findIndex((p) => p.id === pathId) ?? 0) + 1
      const pathLabel = path.name ?? `Path ${pathNumber}`
      toast.success(`Switched to: ${pathLabel}`, {
        description:
          changedSet.size > 0
            ? `Updated ${changedSet.size} ${changedSet.size === 1 ? "week" : "weeks"} · ~${path.estimatedHours} hrs total`
            : `~${path.estimatedHours} hrs total`,
      })
    },
    [plan, courseSettings, currentMaterials]
  )

  const handleCloseConceptDetail = useCallback(() => {
    setSelectedConcept(null)
    setRightPanelTab("outcomes")
  }, [])

  const handleHoverChange = useCallback((state: HoverState) => {
    setHoverState(state)
  }, [])

  const handleScrollToWeek = useCallback((week: number) => {
    setSelectedWeek(week)
  }, [])

  const handleWeekSelect = useCallback((week: number) => {
    setSelectedWeek(week)
  }, [])

  if (isGenerating) {
    const stats =
      courseTemplate === "calculus"
        ? calculusOptimizerStats
        : {
            knowledgeComponents: Math.max(materials.length * 4, 18),
            dependencyChains: Math.max(Math.ceil(materials.length * 0.6), 5),
            candidatePaths: 6,
          }
    const selectedHours =
      courseTemplate === "calculus"
        ? sampleCalculusCourse.plan.learningPaths?.find(
            (p) => p.id === sampleCalculusCourse.plan.selectedPathId
          )?.estimatedHours ?? "45"
        : `${(courseSettings?.weeks ?? 14) * (courseSettings?.hoursPerWeek ?? 3)}`

    const stages = buildOptimizerStages({
      template: courseTemplate,
      materialsCount: materials.length || (courseTemplate === "calculus" ? 8 : 16),
      kcCount: stats.knowledgeComponents,
      dependencyChainCount: stats.dependencyChains,
      candidatePathCount: stats.candidatePaths,
      selectedPathHours: selectedHours,
      weeks: courseSettings?.weeks ?? 14,
    })

    return (
      <div className="min-h-screen bg-background flex flex-col">
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

        <main className="flex-1 flex items-center justify-center py-10">
          <OptimizerProgress
            stages={stages}
            onComplete={finishGeneration}
            subtitle={
              courseTemplate === "calculus"
                ? "Running the learning-path-optimizer pipeline on your calculus materials."
                : "Analyzing materials, identifying knowledge components, and ranking candidate paths."
            }
          />
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
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/new/repace">
                <RefreshCw className="mr-2 h-4 w-4" />
                Re-pace
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href="/new/plan/export">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Link>
            </Button>
            <Button
              size="sm"
              onClick={() => {
                const slug = Math.random().toString(36).slice(2, 10)
                const link = `https://coursedesigner.app/share/${slug}`
                navigator.clipboard.writeText(link).catch(() => {})
                toast.success("Share link copied", {
                  description: "Anyone with the link can view this course (read-only).",
                })
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Progress (Completed) */}
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
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Outline</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                4
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Course Title Bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {courseSettings?.title || "Machine Learning Systems"}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {courseSettings?.level === "grad"
                    ? "Graduate"
                    : courseSettings?.level === "upper-ug"
                    ? "Upper-Undergrad"
                    : "Intro"}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {courseSettings?.weeks || 14} weeks
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {courseSettings?.hoursPerWeek || 3} hrs/week
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {currentMaterials.length} materials
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {conceptsWithWeeks.length} concepts
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="schedule" className="text-xs">
              <Calendar className="h-3.5 w-3.5 mr-1.5" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="graph" className="text-xs">
              <Network className="h-3.5 w-3.5 mr-1.5" />
              Concept Graph
            </TabsTrigger>
            <TabsTrigger value="paths" className="text-xs">
              <Route className="h-3.5 w-3.5 mr-1.5" />
              Learning Paths
              {plan?.learningPaths && (
                <Badge variant="secondary" className="ml-2 h-4 text-[10px] px-1.5">
                  {plan.learningPaths.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Schedule tab — original 2-panel layout */}
          <TabsContent value="schedule" className="mt-0 lg:h-[calc(100vh-300px)]">
            {/* Mobile: stack */}
            <div className="lg:hidden space-y-4">
              <div className="h-[600px]">
                <WeekSchedule
                  weeks={plan?.weeks || sampleWeeks}
                  onUpdateWeek={handleUpdateWeek}
                  hoverState={hoverState}
                  onHoverChange={handleHoverChange}
                  selectedWeek={selectedWeek}
                  onWeekSelect={handleWeekSelect}
                  recentlyChangedWeeks={recentlyChangedWeeks}
                />
              </div>
              <div className="h-[400px]">
                <OutcomesTracker outcomes={plan?.outcomeCoverage || sampleOutcomeCoverage} />
              </div>
            </div>

            {/* Desktop: 2-panel */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-full">
              <div className="col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-medium text-foreground">Weekly Schedule</h2>
                </div>
                <div className="h-[calc(100%-32px)]">
                  <WeekSchedule
                    weeks={plan?.weeks || sampleWeeks}
                    onUpdateWeek={handleUpdateWeek}
                    hoverState={hoverState}
                    onHoverChange={handleHoverChange}
                    selectedWeek={selectedWeek}
                    onWeekSelect={handleWeekSelect}
                    recentlyChangedWeeks={recentlyChangedWeeks}
                  />
                </div>
              </div>

              <div className="col-span-4">
                <div className="flex items-center gap-2 mb-3">
                  <Tabs
                    value={rightPanelTab}
                    onValueChange={(v) => setRightPanelTab(v as typeof rightPanelTab)}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="outcomes" className="text-xs">
                        <Target className="h-3 w-3 mr-1" />
                        Outcomes
                      </TabsTrigger>
                      <TabsTrigger value="materials" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Materials
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="h-[calc(100%-40px)]">
                  {rightPanelTab === "outcomes" && (
                    <OutcomesTracker outcomes={plan?.outcomeCoverage || sampleOutcomeCoverage} />
                  )}
                  {rightPanelTab === "materials" && (
                    <MaterialsPanel
                      materials={currentMaterials}
                      weeks={plan?.weeks || sampleWeeks}
                      outcomes={plan?.outcomeCoverage || sampleOutcomeCoverage}
                      hoverState={hoverState}
                      onHoverChange={handleHoverChange}
                      onMaterialDrop={(id) => {
                        setMaterials((prev) => prev.filter((m) => m.id !== id))
                      }}
                      onMaterialAdd={(s) => {
                        const newMaterial: CourseMaterial = {
                          id: `mat-added-${Date.now()}`,
                          name: s.title,
                          size: `${(1.2 + Math.random() * 1.5).toFixed(1)} MB`,
                          status: "complete",
                          tag: "supplementary",
                          extractedConcepts: [],
                        }
                        setMaterials((prev) => [...prev, newMaterial])
                      }}
                    />
                  )}
                  {rightPanelTab === "concept" && selectedConcept && (
                    <ConceptDetail
                      concept={selectedConcept}
                      weeks={plan?.weeks || sampleWeeks}
                      outcomes={plan?.outcomeCoverage || sampleOutcomeCoverage}
                      materials={currentMaterials}
                      allConcepts={conceptsWithWeeks}
                      onClose={handleCloseConceptDetail}
                      onWeekClick={handleScrollToWeek}
                    />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Concept Graph tab */}
          <TabsContent value="graph" className="mt-0">
            <div className="mb-3 flex items-start justify-between gap-4 flex-wrap">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Concept dependency graph</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Hover any node to trace its prerequisite chain. Click to open the concept detail panel. Color = complexity.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground tabular-nums">
                <span><span className="font-medium text-foreground">{conceptsWithWeeks.length}</span> nodes</span>
                <span><span className="font-medium text-foreground">{conceptsWithWeeks.reduce((acc, c) => acc + c.dependencies.length, 0)}</span> edges</span>
              </div>
            </div>
            <div className="h-[calc(100vh-340px)] min-h-[500px]">
              <ConceptGraph
                concepts={conceptsWithWeeks}
                selectedConceptId={selectedConcept?.id}
                onConceptClick={handleConceptClick}
              />
            </div>
          </TabsContent>

          {/* Learning Paths tab */}
          <TabsContent value="paths" className="mt-0">
            {plan?.learningPaths && plan.learningPaths.length > 0 ? (
              <PathPicker
                paths={plan.learningPaths}
                selectedPathId={plan.selectedPathId ?? plan.learningPaths[0].id}
                onSelect={handlePathSelect}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No alternative paths available for this course yet.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

    </div>
  )
}
