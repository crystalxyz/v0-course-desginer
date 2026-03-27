"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  BookOpen, 
  ArrowRight,
  Sparkles,
  Route,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { LearningWeek } from "@/components/lpo/learning-path-results"
import { pipelineStats } from "@/lib/mock-learning-paths"

interface StepLearningPathProps {
  title: string
  timeline: string
  level: string
  focus: string
  basedOn: string
  weeks: LearningWeek[]
  activeRefinements: string[]
  onToggleRefinement: (id: string) => void
  onNext: () => void
}

const refinementOptions = [
  { id: "faster", label: "Make it faster", description: "Compress the timeline" },
  { id: "beginner", label: "More beginner-friendly", description: "Add foundational topics" },
  { id: "interview", label: "Interview focus", description: "Prioritize common questions" },
  { id: "practice", label: "More practice", description: "Add hands-on exercises" },
]

export function StepLearningPath({
  title,
  timeline,
  level,
  focus,
  basedOn,
  weeks,
  activeRefinements,
  onToggleRefinement,
  onNext,
}: StepLearningPathProps) {
  const [expandedWeeks, setExpandedWeeks] = useState<number[]>([0])
  const [showPath, setShowPath] = useState(false)

  useEffect(() => {
    // Animate path appearing
    const timer = setTimeout(() => setShowPath(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const toggleWeek = (index: number) => {
    setExpandedWeeks((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const improvement = pipelineStats.postScore - pipelineStats.preScore

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Your personalized learning path
            </h2>
            <p className="text-muted-foreground">
              Optimized from {pipelineStats.candidatePaths} candidate sequences
            </p>
          </div>

          {/* Summary card */}
          <Card 
            className={cn(
              "border-border shadow-sm transition-all duration-500",
              showPath ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Route className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>Based on {basedOn}</CardDescription>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{timeline}</Badge>
                <Badge variant="secondary">{level}</Badge>
                <Badge variant="secondary">{focus}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Predicted gain mini card */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/20 mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">Predicted learning gain</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{pipelineStats.preScore}%</span>
                  <Badge className="bg-accent text-accent-foreground">+{improvement}%</Badge>
                  <span className="text-sm font-semibold text-accent">{pipelineStats.postScore}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Weekly breakdown */}
          <div 
            className={cn(
              "space-y-3 transition-all duration-500 delay-200",
              showPath ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {weeks.map((week, weekIndex) => (
              <Card key={weekIndex} className="border-border shadow-sm overflow-hidden">
                <button
                  onClick={() => toggleWeek(weekIndex)}
                  className="w-full p-4 flex items-center justify-between hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {weekIndex + 1}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-foreground">{week.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {week.topics.length} topics
                      </p>
                    </div>
                  </div>
                  {expandedWeeks.includes(weekIndex) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
                
                {expandedWeeks.includes(weekIndex) && (
                  <CardContent className="pt-0 pb-4 border-t border-border">
                    <div className="space-y-3 pt-3">
                      {week.topics.map((topic, topicIndex) => (
                        <div
                          key={topicIndex}
                          className="p-3 rounded-lg bg-secondary/50"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <p className="font-medium text-foreground text-sm">
                                {topic.title}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs">{topic.time}</span>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground ml-6 mb-2">
                            {topic.reason}
                          </p>
                          {topic.kcs && topic.kcs.length > 0 && (
                            <div className="flex flex-wrap gap-1 ml-6">
                              {topic.kcs.map((kc) => (
                                <Badge
                                  key={kc}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {kc}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          {/* Refinement options */}
          <Card 
            className={cn(
              "border-border shadow-sm transition-all duration-500 delay-300",
              showPath ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-accent" />
                <CardTitle className="text-base">Refine your path</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {refinementOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => onToggleRefinement(option.id)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      activeRefinements.includes(option.id)
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    )}
                  >
                    <p className="text-sm font-medium text-foreground">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.description}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Next button */}
          <Button
            size="lg"
            onClick={onNext}
            className={cn(
              "w-full h-12 text-base font-medium transition-all duration-500 delay-400",
              showPath ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            Get early access
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
