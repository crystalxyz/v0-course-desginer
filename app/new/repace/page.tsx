"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  MessageSquare,
  Minus,
  Equal,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { sampleConcepts, sampleWeeks, proposeRepacing, sampleCoursePlan } from "@/lib/mock-course-data"
import type { ScheduleChange } from "@/lib/mock-course-data"
import type { CourseWeek } from "@/lib/course-types"

interface TopicScore {
  concept: string
  weekNumber: number
  score: number
}

interface PaceSlider {
  weekNumber: number
  adjustment: number // -1 = slower, 0 = hold, 1 = faster
}

export default function RepacePage() {
  const router = useRouter()
  const [step, setStep] = useState<"input" | "generating" | "diff">("input")
  
  // Cohort signal inputs
  const [topicScores, setTopicScores] = useState<TopicScore[]>([])
  const [newConcept, setNewConcept] = useState("")
  const [newWeek, setNewWeek] = useState("")
  const [newScore, setNewScore] = useState([70])
  
  const [struggleFeedback, setStruggleFeedback] = useState("")
  const [showPaceSliders, setShowPaceSliders] = useState(false)
  const [paceSliders, setPaceSliders] = useState<PaceSlider[]>([])
  
  // Generated proposal
  const [proposedChanges, setProposedChanges] = useState<ScheduleChange[]>([])
  const [originalWeeks, setOriginalWeeks] = useState<CourseWeek[]>(sampleWeeks)
  const [proposedWeeks, setProposedWeeks] = useState<CourseWeek[]>(sampleWeeks)

  // Available concepts from the course
  const availableConcepts = useMemo(() => {
    return sampleConcepts.map(c => ({
      name: c.name,
      week: c.weekIntroduced || 0
    })).filter(c => c.week > 0)
  }, [])

  const addTopicScore = () => {
    if (newConcept && newWeek) {
      setTopicScores([
        ...topicScores,
        { concept: newConcept, weekNumber: parseInt(newWeek), score: newScore[0] },
      ])
      setNewConcept("")
      setNewWeek("")
      setNewScore([70])
    }
  }

  const removeTopicScore = (index: number) => {
    setTopicScores(topicScores.filter((_, i) => i !== index))
  }

  const updatePaceSlider = (weekNumber: number, adjustment: number) => {
    const existing = paceSliders.find(p => p.weekNumber === weekNumber)
    if (existing) {
      setPaceSliders(paceSliders.map(p => 
        p.weekNumber === weekNumber ? { ...p, adjustment } : p
      ))
    } else {
      setPaceSliders([...paceSliders, { weekNumber, adjustment }])
    }
  }

  const handleGenerateProposal = async () => {
    setStep("generating")
    
    const signal = {
      topicScores,
      struggleFeedback,
      paceSliders,
    }
    
    const proposal = await proposeRepacing(sampleCoursePlan, signal)
    
    setOriginalWeeks(proposal.originalWeeks)
    setProposedWeeks(proposal.proposedWeeks)
    setProposedChanges(proposal.changes)
    setStep("diff")
  }

  const handleToggleChange = (changeId: string) => {
    setProposedChanges(changes =>
      changes.map(c =>
        c.id === changeId ? { ...c, accepted: !c.accepted } : c
      )
    )
  }

  const handleApplyChanges = () => {
    const acceptedCount = proposedChanges.filter(c => c.accepted).length
    // In production, this would update the actual plan
    router.push("/new/plan")
  }

  const getChangeIcon = (type: ScheduleChange["type"]) => {
    switch (type) {
      case "push-back":
        return <ArrowRight className="h-4 w-4" />
      case "add-review":
        return <Plus className="h-4 w-4" />
      case "swap-reading":
        return <ArrowRightLeft className="h-4 w-4" />
      case "add-primer":
        return <Plus className="h-4 w-4" />
      case "remove":
        return <X className="h-4 w-4" />
    }
  }

  const getChangeColor = (type: ScheduleChange["type"]) => {
    switch (type) {
      case "push-back":
        return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "add-review":
        return "bg-accent/10 text-accent border-accent/20"
      case "swap-reading":
        return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "add-primer":
        return "bg-purple-500/10 text-purple-600 border-purple-200"
      case "remove":
        return "bg-destructive/10 text-destructive border-destructive/20"
    }
  }

  const getPaceIcon = (adjustment: number) => {
    if (adjustment < 0) return <Minus className="h-3 w-3" />
    if (adjustment > 0) return <Plus className="h-3 w-3" />
    return <Equal className="h-3 w-3" />
  }

  const getPaceLabel = (adjustment: number) => {
    if (adjustment < 0) return "Slower"
    if (adjustment > 0) return "Faster"
    return "Hold"
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
        <div className={cn(
          "container mx-auto px-4",
          step === "diff" ? "max-w-6xl" : "max-w-2xl"
        )}>
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
                              {score.concept}
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
                      <Label className="text-xs text-muted-foreground">Concept</Label>
                      <Select value={newConcept} onValueChange={(v) => {
                        setNewConcept(v)
                        const concept = availableConcepts.find(c => c.name === v)
                        if (concept) setNewWeek(concept.week.toString())
                      }}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select concept..." />
                        </SelectTrigger>
                        <SelectContent>
                          {availableConcepts.map(c => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name} (W{c.week})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">Week</Label>
                      <Input
                        value={newWeek}
                        onChange={(e) => setNewWeek(e.target.value)}
                        placeholder="#"
                        className="mt-1"
                        readOnly
                      />
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
                        disabled={!newConcept || !newWeek}
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
                    placeholder="e.g., Students are having trouble with the math prerequisites for gradient descent. Many are unfamiliar with linear algebra notation. The pace feels too fast for some students..."
                    className="min-h-[120px] resize-none"
                  />
                </CardContent>
              </Card>

              {/* Pace Adjustment Section (Optional) */}
              <Card className="border-border mb-6">
                <CardHeader className="cursor-pointer" onClick={() => setShowPaceSliders(!showPaceSliders)}>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        Pace Adjustments
                        <Badge variant="secondary" className="text-[10px]">Optional</Badge>
                      </CardTitle>
                      <CardDescription>
                        Indicate desired pace changes for remaining weeks.
                      </CardDescription>
                    </div>
                    {showPaceSliders ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {showPaceSliders && (
                  <CardContent>
                    <div className="space-y-3">
                      {sampleWeeks.slice(6).map(week => {
                        const slider = paceSliders.find(p => p.weekNumber === week.week)
                        const adjustment = slider?.adjustment || 0
                        return (
                          <div key={week.week} className="flex items-center gap-4">
                            <div className="w-20 flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">W{week.week}</Badge>
                            </div>
                            <div className="flex-1">
                              <Slider
                                value={[adjustment]}
                                onValueChange={([v]) => updatePaceSlider(week.week, v)}
                                min={-1}
                                max={1}
                                step={1}
                                className="cursor-pointer"
                              />
                            </div>
                            <div className={cn(
                              "w-20 flex items-center gap-1 text-xs",
                              adjustment < 0 ? "text-blue-600" : adjustment > 0 ? "text-amber-600" : "text-muted-foreground"
                            )}>
                              {getPaceIcon(adjustment)}
                              {getPaceLabel(adjustment)}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                )}
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
                  Review the side-by-side comparison and toggle changes to accept or reject.
                </p>
              </div>

              {/* Side-by-side Diff View */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Original Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-medium text-foreground">Original Schedule</h2>
                    <Badge variant="secondary" className="text-xs">Current</Badge>
                  </div>
                  <ScrollArea className="h-[400px] rounded-lg border border-border">
                    <div className="p-4 space-y-2">
                      {originalWeeks.map(week => {
                        const hasChange = proposedChanges.some(c => c.weekNumber === week.week && c.accepted)
                        return (
                          <div 
                            key={week.week}
                            className={cn(
                              "p-3 rounded-lg border transition-colors",
                              hasChange 
                                ? "border-destructive/30 bg-destructive/5" 
                                : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-muted-foreground text-[10px] font-medium">
                                {week.week}
                              </div>
                              <span className="text-xs font-medium text-foreground">
                                Week {week.week}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {week.inClassFocus || "No focus set"}
                            </p>
                            {week.conceptsIntroduced.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {week.conceptsIntroduced.slice(0, 3).map(c => (
                                  <Badge key={c} variant="outline" className="text-[9px]">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>

                {/* Proposed Schedule */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-sm font-medium text-foreground">Proposed Schedule</h2>
                    <Badge className="text-xs bg-accent text-accent-foreground">Updated</Badge>
                  </div>
                  <ScrollArea className="h-[400px] rounded-lg border border-border">
                    <div className="p-4 space-y-2">
                      {proposedWeeks.map(week => {
                        const change = proposedChanges.find(c => c.weekNumber === week.week && c.accepted)
                        return (
                          <div 
                            key={week.week}
                            className={cn(
                              "p-3 rounded-lg border transition-colors",
                              change 
                                ? "border-accent/50 bg-accent/5 border-l-2 border-l-accent" 
                                : "border-border bg-card"
                            )}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                "flex items-center justify-center h-5 w-5 rounded-full text-[10px] font-medium",
                                change ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                              )}>
                                {week.week}
                              </div>
                              <span className="text-xs font-medium text-foreground">
                                Week {week.week}
                              </span>
                              {change && (
                                <Badge variant="outline" className={cn("text-[9px]", getChangeColor(change.type))}>
                                  {change.type.replace("-", " ")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {change?.proposedValue || week.inClassFocus || "No focus set"}
                            </p>
                            {week.conceptsIntroduced.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {week.conceptsIntroduced.slice(0, 3).map(c => (
                                  <Badge key={c} variant="outline" className="text-[9px]">
                                    {c}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </ScrollArea>
                </div>
              </div>

              {/* Change Cards with Accept/Reject */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-foreground mb-3">
                  Individual Changes ({proposedChanges.filter(c => c.accepted).length}/{proposedChanges.length} accepted)
                </h3>
                <div className="space-y-3">
                  {proposedChanges.map((change) => (
                    <Card key={change.id} className={cn(
                      "border-border transition-all",
                      change.accepted ? "border-l-2 border-l-accent" : "opacity-60"
                    )}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              "flex items-center justify-center h-8 w-8 rounded-lg border flex-shrink-0",
                              getChangeColor(change.type)
                            )}
                          >
                            {getChangeIcon(change.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="secondary" className="text-xs">
                                Week {change.weekNumber}
                              </Badge>
                              <Badge
                                variant="outline"
                                className={cn("text-xs capitalize", getChangeColor(change.type))}
                              >
                                {change.type.replace("-", " ")}
                              </Badge>
                            </div>
                            <p className="text-sm font-medium text-foreground">
                              {change.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {change.rationale}
                            </p>
                            {change.originalValue && change.proposedValue && (
                              <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className="p-2 rounded-md bg-muted/50 border border-border">
                                  <p className="text-[10px] text-muted-foreground uppercase mb-1">
                                    Original
                                  </p>
                                  <p className="text-xs text-muted-foreground line-through">
                                    {change.originalValue}
                                  </p>
                                </div>
                                <div className="p-2 rounded-md bg-accent/5 border border-accent/20">
                                  <p className="text-[10px] text-muted-foreground uppercase mb-1">
                                    Proposed
                                  </p>
                                  <p className="text-xs text-foreground">{change.proposedValue}</p>
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Label htmlFor={`change-${change.id}`} className="text-xs text-muted-foreground">
                              {change.accepted ? "Accepted" : "Rejected"}
                            </Label>
                            <Switch
                              id={`change-${change.id}`}
                              checked={change.accepted}
                              onCheckedChange={() => handleToggleChange(change.id)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-border">
                <Button variant="outline" size="lg" onClick={() => setStep("input")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Adjust inputs
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">
                    {proposedChanges.filter(c => c.accepted).length} change{proposedChanges.filter(c => c.accepted).length !== 1 ? "s" : ""} selected
                  </span>
                  <Button 
                    size="lg" 
                    onClick={handleApplyChanges} 
                    disabled={proposedChanges.filter(c => c.accepted).length === 0}
                    className="min-w-[200px]"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Apply {proposedChanges.filter(c => c.accepted).length} change{proposedChanges.filter(c => c.accepted).length !== 1 ? "s" : ""}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
