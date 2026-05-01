"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
  Loader2,
  Check,
  AlertTriangle,
  ArrowRightLeft,
  Calendar,
  BookOpen,
  MessageSquare,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { CohortSignal, ScheduleEdit } from "@/lib/course-types"

interface TopicScore {
  topic: string
  weekNumber: number
  score: number
}

export default function RepacePage() {
  const router = useRouter()
  const [step, setStep] = useState<"input" | "generating" | "diff">("input")
  
  // Cohort signal inputs
  const [topicScores, setTopicScores] = useState<TopicScore[]>([])
  const [newTopic, setNewTopic] = useState("")
  const [newWeek, setNewWeek] = useState("")
  const [newScore, setNewScore] = useState([70])
  
  const [struggleFeedback, setStruggleFeedback] = useState("")
  
  // Generated proposal
  const [proposedEdits, setProposedEdits] = useState<ScheduleEdit[]>([])

  const addTopicScore = () => {
    if (newTopic && newWeek) {
      setTopicScores([
        ...topicScores,
        { topic: newTopic, weekNumber: parseInt(newWeek), score: newScore[0] },
      ])
      setNewTopic("")
      setNewWeek("")
      setNewScore([70])
    }
  }

  const removeTopicScore = (index: number) => {
    setTopicScores(topicScores.filter((_, i) => i !== index))
  }

  const handleGenerateProposal = async () => {
    setStep("generating")
    
    // Simulate LLM processing
    await new Promise((resolve) => setTimeout(resolve, 2500))
    
    // Generate mock edits based on input
    const mockEdits: ScheduleEdit[] = []
    
    // Find low-scoring topics
    const lowScores = topicScores.filter((s) => s.score < 60)
    lowScores.forEach((score) => {
      mockEdits.push({
        type: "add-review",
        weekNumber: score.weekNumber + 1,
        description: `Add review session for ${score.topic}`,
        originalValue: "Normal lecture",
        proposedValue: `Review session: ${score.topic} fundamentals`,
      })
    })
    
    // If struggle feedback mentions specific concepts
    if (struggleFeedback.toLowerCase().includes("gradient")) {
      mockEdits.push({
        type: "push-back",
        weekNumber: 5,
        description: "Push advanced optimization topics back by 1 week",
        originalValue: "Week 5: Advanced optimization",
        proposedValue: "Week 6: Advanced optimization",
      })
    }
    
    if (struggleFeedback.toLowerCase().includes("math") || struggleFeedback.toLowerCase().includes("linear algebra")) {
      mockEdits.push({
        type: "swap-reading",
        weekNumber: 2,
        description: "Swap technical paper for more accessible introduction",
        originalValue: "Advanced Linear Algebra Methods (Original)",
        proposedValue: "Linear Algebra Refresher with Examples",
      })
    }
    
    // Default suggestions if no specific input
    if (mockEdits.length === 0) {
      mockEdits.push({
        type: "add-review",
        weekNumber: 7,
        description: "Add mid-course checkpoint",
        originalValue: "Continue with new material",
        proposedValue: "Review session covering weeks 1-6",
      })
    }
    
    setProposedEdits(mockEdits)
    setStep("diff")
  }

  const handleApplyChanges = () => {
    // In production, this would update the actual plan
    router.push("/new/plan")
  }

  const getEditIcon = (type: ScheduleEdit["type"]) => {
    switch (type) {
      case "push-back":
        return <ArrowRight className="h-4 w-4" />
      case "add-review":
        return <Plus className="h-4 w-4" />
      case "swap-reading":
        return <ArrowRightLeft className="h-4 w-4" />
      case "remove":
        return <X className="h-4 w-4" />
    }
  }

  const getEditColor = (type: ScheduleEdit["type"]) => {
    switch (type) {
      case "push-back":
        return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "add-review":
        return "bg-accent/10 text-accent border-accent/20"
      case "swap-reading":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "remove":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
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
            <Link href="/new/plan">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to plan
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          {step === "input" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Re-pace Your Course</h1>
                <p className="text-muted-foreground">
                  Enter cohort signals to get schedule adjustment recommendations.
                </p>
              </div>

              {/* Assignment Scores Section */}
              <Card className="border-border mb-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    Assignment Scores by Topic
                  </CardTitle>
                  <CardDescription>
                    Enter average scores for each topic to identify areas needing more time.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Existing scores */}
                  {topicScores.length > 0 && (
                    <div className="space-y-2">
                      {topicScores.map((score, index) => (
                        <div
                          key={index}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-lg border",
                            score.score < 60
                              ? "bg-destructive/5 border-destructive/20"
                              : score.score < 75
                              ? "bg-amber-500/5 border-amber-200"
                              : "bg-accent/5 border-accent/20"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="text-xs">
                              W{score.weekNumber}
                            </Badge>
                            <span className="text-sm font-medium text-foreground">
                              {score.topic}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                score.score < 60
                                  ? "text-destructive"
                                  : score.score < 75
                                  ? "text-amber-600"
                                  : "text-accent"
                              )}
                            >
                              {score.score}%
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTopicScore(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add new score */}
                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-5">
                      <Label className="text-xs text-muted-foreground">Topic</Label>
                      <Input
                        value={newTopic}
                        onChange={(e) => setNewTopic(e.target.value)}
                        placeholder="e.g., Gradient descent"
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Week</Label>
                      <Select value={newWeek} onValueChange={setNewWeek}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="#" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 14 }, (_, i) => (
                            <SelectItem key={i + 1} value={(i + 1).toString()}>
                              {i + 1}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-3">
                      <Label className="text-xs text-muted-foreground">Score: {newScore[0]}%</Label>
                      <Slider
                        value={newScore}
                        onValueChange={setNewScore}
                        min={0}
                        max={100}
                        step={5}
                        className="mt-3"
                      />
                    </div>
                    <div className="col-span-2 flex items-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addTopicScore}
                        disabled={!newTopic || !newWeek}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Struggle Feedback Section */}
              <Card className="border-border mb-6">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Student Feedback
                  </CardTitle>
                  <CardDescription>
                    Describe what students are struggling with in free text.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={struggleFeedback}
                    onChange={(e) => setStruggleFeedback(e.target.value)}
                    placeholder="e.g., Students are having trouble with the math prerequisites for gradient descent. Many are unfamiliar with linear algebra notation..."
                    className="min-h-[120px] resize-none"
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/new/plan">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <Button
                  size="lg"
                  onClick={handleGenerateProposal}
                  disabled={topicScores.length === 0 && !struggleFeedback.trim()}
                  className="min-w-[200px]"
                >
                  Generate recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {step === "generating" && (
            <div className="flex-1 flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent/10 mb-6">
                  <Loader2 className="h-8 w-8 text-accent animate-spin" />
                </div>
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  Analyzing cohort signals
                </h2>
                <p className="text-muted-foreground max-w-md">
                  Generating schedule adjustments based on student performance and feedback...
                </p>
              </div>
            </div>
          )}

          {step === "diff" && (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-semibold text-foreground mb-2">
                  Proposed Schedule Changes
                </h1>
                <p className="text-muted-foreground">
                  Review the recommended adjustments before applying.
                </p>
              </div>

              {/* Diff View */}
              <div className="space-y-4 mb-6">
                {proposedEdits.map((edit, index) => (
                  <Card key={index} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex items-center justify-center h-8 w-8 rounded-lg border",
                            getEditColor(edit.type)
                          )}
                        >
                          {getEditIcon(edit.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              Week {edit.weekNumber}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn("text-xs capitalize", getEditColor(edit.type))}
                            >
                              {edit.type.replace("-", " ")}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-foreground">
                            {edit.description}
                          </p>
                          {edit.originalValue && edit.proposedValue && (
                            <div className="mt-3 grid grid-cols-2 gap-3">
                              <div className="p-2 rounded-md bg-destructive/5 border border-destructive/20">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">
                                  Original
                                </p>
                                <p className="text-xs text-destructive line-through">
                                  {edit.originalValue}
                                </p>
                              </div>
                              <div className="p-2 rounded-md bg-accent/5 border border-accent/20">
                                <p className="text-[10px] text-muted-foreground uppercase mb-1">
                                  Proposed
                                </p>
                                <p className="text-xs text-accent">{edit.proposedValue}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <Button variant="outline" size="lg" onClick={() => setStep("input")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Adjust inputs
                </Button>
                <Button size="lg" onClick={handleApplyChanges} className="min-w-[200px]">
                  <Check className="mr-2 h-4 w-4" />
                  Apply changes
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
