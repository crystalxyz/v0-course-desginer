"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Target, FileText, CheckCircle2, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

export interface LearningTopic {
  title: string
  reason: string
  estimatedTime: string
  completed?: boolean
  knowledgeComponents?: string[]
}

export interface LearningWeek {
  week: number
  topics: LearningTopic[]
}

interface LearningPathResultsProps {
  title: string
  timeline: string
  level: string
  focus: string
  basedOn: string
  weeks: LearningWeek[]
  onToggleComplete?: (weekIndex: number, topicIndex: number) => void
}

// KC badge color mapping
const kcColors: Record<string, string> = {
  "Linear Algebra": "bg-blue-500/10 text-blue-700 border-blue-200",
  "Probability": "bg-blue-500/10 text-blue-700 border-blue-200",
  "Gradient Descent": "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "Loss Functions": "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  "Regression": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Classification": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Decision Boundary": "bg-amber-500/10 text-amber-700 border-amber-200",
  "Overfitting": "bg-rose-500/10 text-rose-700 border-rose-200",
  "Regularization": "bg-rose-500/10 text-rose-700 border-rose-200",
  "Bias-Variance": "bg-rose-500/10 text-rose-700 border-rose-200",
  "Cross-Validation": "bg-purple-500/10 text-purple-700 border-purple-200",
  "Ensemble Methods": "bg-purple-500/10 text-purple-700 border-purple-200",
  "Feature Engineering": "bg-purple-500/10 text-purple-700 border-purple-200",
}

export function LearningPathResults({
  title,
  timeline,
  level,
  focus,
  basedOn,
  weeks,
  onToggleComplete,
}: LearningPathResultsProps) {
  const totalHours = weeks.reduce(
    (acc, week) =>
      acc +
      week.topics.reduce((topicAcc, topic) => {
        const hours = parseFloat(topic.estimatedTime)
        return topicAcc + (isNaN(hours) ? 0 : hours)
      }, 0),
    0
  )

  // Count unique KCs across all topics
  const allKCs = new Set<string>()
  weeks.forEach(week => {
    week.topics.forEach(topic => {
      topic.knowledgeComponents?.forEach(kc => allKCs.add(kc))
    })
  })

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div>
            <CardTitle className="text-2xl font-semibold text-foreground mb-3">
              {title}
            </CardTitle>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="font-normal">
                <Clock className="h-3 w-3 mr-1" />
                {timeline}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <Target className="h-3 w-3 mr-1" />
                {level}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <BookOpen className="h-3 w-3 mr-1" />
                {focus}
              </Badge>
              <Badge variant="secondary" className="font-normal">
                <FileText className="h-3 w-3 mr-1" />
                {basedOn}
              </Badge>
              <Badge variant="outline" className="font-normal bg-accent/5 border-accent/20 text-accent">
                <Brain className="h-3 w-3 mr-1" />
                {allKCs.size} knowledge components
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total study time</p>
            <p className="text-2xl font-semibold text-foreground">{totalHours} hours</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {weeks.map((week, weekIndex) => (
            <div key={week.week}>
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {week.week}
                </span>
                Week {week.week}
              </h3>
              <div className="space-y-3 ml-3 border-l-2 border-border pl-6">
                {week.topics.map((topic, topicIndex) => (
                  <div
                    key={topic.title}
                    className={cn(
                      "relative p-4 rounded-lg border border-border bg-card transition-all hover:shadow-sm",
                      topic.completed && "bg-accent/5 border-accent/30"
                    )}
                  >
                    <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-card border-2 border-border" />
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">{topic.title}</h4>
                          {topic.completed && (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {topic.reason}
                        </p>
                        
                        {/* Knowledge Component badges */}
                        {topic.knowledgeComponents && topic.knowledgeComponents.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {topic.knowledgeComponents.map((kc) => (
                              <Badge
                                key={kc}
                                variant="outline"
                                className={cn(
                                  "text-[10px] px-1.5 py-0 font-medium",
                                  kcColors[kc] || "bg-secondary text-secondary-foreground"
                                )}
                              >
                                {kc}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {topic.estimatedTime}
                        </div>
                      </div>
                      {onToggleComplete && (
                        <button
                          onClick={() => onToggleComplete(weekIndex, topicIndex)}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex-shrink-0",
                            topic.completed
                              ? "bg-accent/10 text-accent hover:bg-accent/20"
                              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                          )}
                        >
                          {topic.completed ? "Completed" : "Mark done"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
