"use client"

import { useState, useCallback, useRef } from "react"
import { HeroSection } from "@/components/lpo/hero-section"
import { InputPanel } from "@/components/lpo/input-panel"
import { MaterialsUpload } from "@/components/lpo/materials-upload"
import { GeneratingLoader } from "@/components/lpo/generating-loader"
import { LearningPathResults, type LearningWeek } from "@/components/lpo/learning-path-results"
import { WhyThisOrder } from "@/components/lpo/why-this-order"
import { RefinementControls } from "@/components/lpo/refinement-controls"
import { DemandCapture } from "@/components/lpo/demand-capture"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { getPathForRefinements, getPathTitle, defaultPath } from "@/lib/mock-learning-paths"

interface UploadedFile {
  name: string
  size: string
  status: "uploading" | "processing" | "complete"
}

type AppState = "hero" | "input" | "generating" | "results"

export default function LPOPage() {
  // App state
  const [appState, setAppState] = useState<AppState>("hero")
  
  // Input form state
  const [goal, setGoal] = useState("")
  const [timeline, setTimeline] = useState("")
  const [level, setLevel] = useState("")
  const [preferences, setPreferences] = useState<string[]>([])
  
  // Materials state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [manualTopics, setManualTopics] = useState("")
  
  // Results state
  const [activeRefinements, setActiveRefinements] = useState<string[]>([])
  const [learningPath, setLearningPath] = useState<LearningWeek[]>(defaultPath)
  
  // Refs for scrolling
  const inputSectionRef = useRef<HTMLDivElement>(null)
  const resultsSectionRef = useRef<HTMLDivElement>(null)

  const handleGetStarted = () => {
    setAppState("input")
    setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleSeeExample = () => {
    // Pre-fill with example data
    setGoal("Prepare for a machine learning interview")
    setTimeline("2-weeks")
    setLevel("some-exposure")
    setPreferences(["interview-prep", "prerequisites"])
    setUploadedFiles([
      { name: "ml_interview_topics.pdf", size: "245 KB", status: "complete" }
    ])
    setAppState("input")
    setTimeout(() => {
      inputSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleGenerate = () => {
    setAppState("generating")
  }

  const handleGenerationComplete = useCallback(() => {
    setLearningPath(getPathForRefinements(activeRefinements))
    setAppState("results")
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }, [activeRefinements])

  const handleToggleRefinement = (id: string) => {
    const newRefinements = activeRefinements.includes(id)
      ? activeRefinements.filter((r) => r !== id)
      : [id] // Only one refinement at a time for simplicity
    
    setActiveRefinements(newRefinements)
    setLearningPath(getPathForRefinements(newRefinements))
  }

  const handleToggleComplete = (weekIndex: number, topicIndex: number) => {
    setLearningPath((prev) =>
      prev.map((week, wIdx) =>
        wIdx === weekIndex
          ? {
              ...week,
              topics: week.topics.map((topic, tIdx) =>
                tIdx === topicIndex
                  ? { ...topic, completed: !topic.completed }
                  : topic
              ),
            }
          : week
      )
    )
  }

  const handleStartOver = () => {
    setAppState("hero")
    setGoal("")
    setTimeline("")
    setLevel("")
    setPreferences([])
    setUploadedFiles([])
    setManualTopics("")
    setActiveRefinements([])
    setLearningPath(defaultPath)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const canGenerate = goal.trim() !== "" && timeline !== "" && level !== ""

  // Get display values for results
  const getLevelDisplay = (level: string) => {
    const labels: Record<string, string> = {
      "beginner": "Beginner",
      "some-exposure": "Some exposure",
      "intermediate": "Intermediate",
      "advanced-rusty": "Advanced but rusty",
    }
    return labels[level] || level
  }

  const getTimelineDisplay = (timeline: string) => {
    const labels: Record<string, string> = {
      "3-days": "3 days",
      "1-week": "1 week",
      "2-weeks": "2 weeks",
      "1-month": "1 month",
      "flexible": "Flexible",
    }
    return labels[timeline] || timeline
  }

  const getFocusDisplay = (preferences: string[]) => {
    if (preferences.includes("interview-prep")) return "Interview prep"
    if (preferences.includes("course-mastery")) return "Course mastery"
    return "General learning"
  }

  const getBasedOnDisplay = () => {
    const sources = []
    if (uploadedFiles.length > 0) sources.push("uploaded materials")
    if (manualTopics.trim()) sources.push("custom topics")
    if (goal.trim()) sources.push("your goal")
    return sources.length > 0 ? sources.join(" + ") : "default curriculum"
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">LPO</span>
          </div>
          {appState !== "hero" && (
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              Start over
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section - Always visible in hero state */}
        {appState === "hero" && (
          <HeroSection onGetStarted={handleGetStarted} onSeeExample={handleSeeExample} />
        )}

        {/* Input Section */}
        {(appState === "input" || appState === "results") && (
          <section ref={inputSectionRef} className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <div className="max-w-2xl mx-auto space-y-6">
                <InputPanel
                  goal={goal}
                  setGoal={setGoal}
                  timeline={timeline}
                  setTimeline={setTimeline}
                  level={level}
                  setLevel={setLevel}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />

                <MaterialsUpload
                  uploadedFiles={uploadedFiles}
                  setUploadedFiles={setUploadedFiles}
                  manualTopics={manualTopics}
                  setManualTopics={setManualTopics}
                />

                {appState === "input" && (
                  <Button
                    size="lg"
                    className="w-full h-12 text-base font-medium"
                    disabled={!canGenerate}
                    onClick={handleGenerate}
                  >
                    Generate my learning path
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Generating Loader */}
        {appState === "generating" && (
          <GeneratingLoader onComplete={handleGenerationComplete} />
        )}

        {/* Results Section */}
        {appState === "results" && (
          <section ref={resultsSectionRef} className="py-12 md:py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto space-y-6">
                <LearningPathResults
                  title={getPathTitle(timeline, activeRefinements)}
                  timeline={getTimelineDisplay(timeline)}
                  level={getLevelDisplay(level)}
                  focus={getFocusDisplay(preferences)}
                  basedOn={getBasedOnDisplay()}
                  weeks={learningPath}
                  onToggleComplete={handleToggleComplete}
                />

                <WhyThisOrder />

                <RefinementControls
                  activeRefinements={activeRefinements}
                  onToggleRefinement={handleToggleRefinement}
                />

                <DemandCapture />
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-primary flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">LPO</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Learning Path Optimizer — Built for self-directed learners
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
