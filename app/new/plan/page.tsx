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
  Loader2,
  Network,
  Calendar,
  Target,
  Check,
  BookOpen,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ConceptGraph } from "@/components/course/concept-graph"
import { WeekSchedule } from "@/components/course/week-schedule"
import { OutcomesTracker } from "@/components/course/outcomes-tracker"
import { MaterialsPanel } from "@/components/course/materials-panel"
import { ConceptDetail } from "@/components/course/concept-detail"
import { GapsSheet, GapIndicator } from "@/components/course/gaps-sheet"
import { 
  sampleCoursePlan, 
  sampleConcepts, 
  sampleWeeks, 
  sampleOutcomeCoverage, 
  sampleGapWarnings,
  sampleMaterials,
} from "@/lib/mock-course-data"
import type { 
  CourseSettings, 
  CourseMaterial, 
  CoursePlan, 
  CourseWeek, 
  Concept,
  HoverState,
  GapWarning,
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
  const [gapsSheetOpen, setGapsSheetOpen] = useState(false)

  useEffect(() => {
    // Load settings and materials from localStorage
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

    // Simulate plan generation
    const generatePlan = async () => {
      setIsGenerating(true)
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Use sample data for now
      const generatedPlan: CoursePlan = {
        ...sampleCoursePlan,
        id: `plan-${Date.now()}`,
        generatedAt: new Date(),
      }

      setPlan(generatedPlan)
      setIsGenerating(false)
    }

    generatePlan()
  }, [])

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
  }, [])

  const handleCloseConceptDetail = useCallback(() => {
    setSelectedConcept(null)
    setRightPanelTab("outcomes")
  }, [])

  const handleHoverChange = useCallback((state: HoverState) => {
    setHoverState(state)
  }, [])

  const handleGapClick = useCallback((warning: GapWarning) => {
    setGapsSheetOpen(true)
  }, [])

  const handleApplyFix = useCallback((gapIndex: number, fixType: "primary" | "alternative") => {
    // In production, this would update the plan
    console.log(`Applying ${fixType} fix for gap ${gapIndex}`)
    // For now, just close the sheet
    setGapsSheetOpen(false)
  }, [])

  const handleScrollToWeek = useCallback((week: number) => {
    setSelectedWeek(week)
    setGapsSheetOpen(false)
    // Could add smooth scrolling to the week card here
  }, [])

  const handleWeekSelect = useCallback((week: number) => {
    setSelectedWeek(week)
  }, [])

  const conceptsWithWeeks: Concept[] = plan?.conceptGraph || sampleConcepts
  const gapConceptNames = plan?.gapWarnings.map((g) => g.concept) || []
  const currentMaterials = materials.length > 0 ? materials : sampleMaterials

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
            <h2 className="text-xl font-semibold text-foreground mb-2">Generating your course plan</h2>
            <p className="text-muted-foreground max-w-md">
              Analyzing materials, building concept graph, optimizing schedule, and generating artifacts...
            </p>
            <div className="flex items-center justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-accent" />
                <span>Extracting concepts</span>
              </div>
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Building dependencies</span>
              </div>
              <div className="flex items-center gap-2 opacity-50">
                <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                <span>Generating schedule</span>
              </div>
            </div>
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
          <div className="flex items-center gap-3">
            {/* Gap Indicator */}
            <GapIndicator 
              gapCount={plan?.gapWarnings.length || 0}
              onClick={() => setGapsSheetOpen(true)}
            />
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
            <Button size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Progress (Completed) */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Setup</span>
            </div>
            <div className="h-[2px] w-8 sm:w-16 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Materials</span>
            </div>
            <div className="h-[2px] w-8 sm:w-16 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                3
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

      {/* 3-Panel Layout */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Mobile: Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="graph" className="text-xs">
                <Network className="h-3 w-3 mr-1" />
                Graph
              </TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Outcomes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="graph" className="h-[500px]">
              <ConceptGraph
                concepts={conceptsWithWeeks}
                materials={currentMaterials}
                gapConcepts={gapConceptNames}
                onConceptClick={handleConceptClick}
                hoverState={hoverState}
                onHoverChange={handleHoverChange}
              />
            </TabsContent>
            <TabsContent value="schedule" className="h-[600px]">
              <WeekSchedule
                weeks={plan?.weeks || sampleWeeks}
                gapWarnings={plan?.gapWarnings || sampleGapWarnings}
                onUpdateWeek={handleUpdateWeek}
                onGapClick={handleGapClick}
                hoverState={hoverState}
                onHoverChange={handleHoverChange}
                selectedWeek={selectedWeek}
                onWeekSelect={handleWeekSelect}
              />
            </TabsContent>
            <TabsContent value="outcomes" className="h-[600px]">
              <OutcomesTracker outcomes={plan?.outcomeCoverage || sampleOutcomeCoverage} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: 3-Panel */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-280px)]">
          {/* Left: Concept Graph */}
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Network className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Prerequisite Graph</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <ConceptGraph
                concepts={conceptsWithWeeks}
                materials={currentMaterials}
                gapConcepts={gapConceptNames}
                onConceptClick={handleConceptClick}
                hoverState={hoverState}
                onHoverChange={handleHoverChange}
              />
            </div>
          </div>

          {/* Center: Week Schedule */}
          <div className="col-span-5">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Weekly Schedule</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <WeekSchedule
                weeks={plan?.weeks || sampleWeeks}
                gapWarnings={plan?.gapWarnings || sampleGapWarnings}
                onUpdateWeek={handleUpdateWeek}
                onGapClick={handleGapClick}
                hoverState={hoverState}
                onHoverChange={handleHoverChange}
                selectedWeek={selectedWeek}
                onWeekSelect={handleWeekSelect}
              />
            </div>
          </div>

          {/* Right: Outcomes/Materials/Concept Detail */}
          <div className="col-span-3">
            {/* Tab Switcher */}
            <div className="flex items-center gap-2 mb-3">
              <Tabs value={rightPanelTab} onValueChange={(v) => setRightPanelTab(v as typeof rightPanelTab)} className="w-full">
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
                  hoverState={hoverState}
                  onHoverChange={handleHoverChange}
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
      </main>

      {/* Gaps Sheet */}
      <GapsSheet
        open={gapsSheetOpen}
        onOpenChange={setGapsSheetOpen}
        gapWarnings={plan?.gapWarnings || sampleGapWarnings}
        onApplyFix={handleApplyFix}
        onScrollToWeek={handleScrollToWeek}
      />
    </div>
  )
}
