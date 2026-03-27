"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"
import { WizardShell } from "@/components/lpo/wizard-shell"
import { StepGoalPreferences } from "@/components/lpo/step-goal-preferences"
import { StepMaterials } from "@/components/lpo/step-materials"
import { StepExtractedConcepts } from "@/components/lpo/step-extracted-concepts"
import { StepLearningPath } from "@/components/lpo/step-learning-path"
import { StepEarlyAccess } from "@/components/lpo/step-early-access"
import { getPathForRefinements, getPathTitle, defaultPath } from "@/lib/mock-learning-paths"
import type { LearningWeek } from "@/components/lpo/learning-path-results"

interface UploadedFile {
  name: string
  size: string
  status: "uploading" | "processing" | "complete"
}

type AppState = "hero" | "step-1" | "step-2" | "step-3" | "step-4" | "step-5"

const wizardSteps = [
  { id: "goal", label: "Goals" },
  { id: "materials", label: "Materials" },
  { id: "concepts", label: "Concepts" },
  { id: "path", label: "Path" },
  { id: "access", label: "Access" },
]

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

  const handleGetStarted = () => {
    setAppState("step-1")
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
    setAppState("step-1")
  }

  const handleToggleRefinement = (id: string) => {
    const newRefinements = activeRefinements.includes(id)
      ? activeRefinements.filter((r) => r !== id)
      : [id]
    
    setActiveRefinements(newRefinements)
    setLearningPath(getPathForRefinements(newRefinements))
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
  }

  // Get display values
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

  const getCurrentStepIndex = () => {
    const stepMap: Record<AppState, number> = {
      "hero": -1,
      "step-1": 0,
      "step-2": 1,
      "step-3": 2,
      "step-4": 3,
      "step-5": 4,
    }
    return stepMap[appState]
  }

  // Prepare learning path when moving to step 4
  const prepareAndShowPath = useCallback(() => {
    setLearningPath(getPathForRefinements(activeRefinements))
    setAppState("step-4")
  }, [activeRefinements])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={handleStartOver} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">LPO</span>
          </button>
          {appState !== "hero" && (
            <Button variant="ghost" size="sm" onClick={handleStartOver}>
              Start over
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Hero */}
        {appState === "hero" && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
                <Sparkles className="h-4 w-4 text-accent" />
                <span className="text-sm text-muted-foreground">For self-directed learners</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-6 text-balance">
                Stop guessing what to study next.
              </h1>
              
              <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto text-pretty">
                Generate a personalized AI/ML learning path from your goal, timeline, and materials.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button 
                  size="lg" 
                  onClick={handleGetStarted}
                  className="min-w-[200px] h-12 text-base font-medium"
                >
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={handleSeeExample}
                  className="min-w-[140px] h-12 text-base font-medium"
                >
                  See example
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Wizard Steps */}
        {appState !== "hero" && (
          <WizardShell steps={wizardSteps} currentStep={getCurrentStepIndex()}>
            {appState === "step-1" && (
              <StepGoalPreferences
                goal={goal}
                setGoal={setGoal}
                timeline={timeline}
                setTimeline={setTimeline}
                level={level}
                setLevel={setLevel}
                preferences={preferences}
                setPreferences={setPreferences}
                onNext={() => setAppState("step-2")}
              />
            )}

            {appState === "step-2" && (
              <StepMaterials
                uploadedFiles={uploadedFiles}
                setUploadedFiles={setUploadedFiles}
                manualTopics={manualTopics}
                setManualTopics={setManualTopics}
                onNext={() => setAppState("step-3")}
                onSkip={() => setAppState("step-3")}
              />
            )}

            {appState === "step-3" && (
              <StepExtractedConcepts
                onNext={prepareAndShowPath}
              />
            )}

            {appState === "step-4" && (
              <StepLearningPath
                title={getPathTitle(timeline, activeRefinements)}
                timeline={getTimelineDisplay(timeline)}
                level={getLevelDisplay(level)}
                focus={getFocusDisplay(preferences)}
                basedOn={getBasedOnDisplay()}
                weeks={learningPath}
                activeRefinements={activeRefinements}
                onToggleRefinement={handleToggleRefinement}
                onNext={() => setAppState("step-5")}
              />
            )}

            {appState === "step-5" && (
              <StepEarlyAccess
                onBack={() => setAppState("step-4")}
              />
            )}
          </WizardShell>
        )}
      </main>
    </div>
  )
}
