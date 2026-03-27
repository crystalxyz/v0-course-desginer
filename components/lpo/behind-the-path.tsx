"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Brain, 
  Network, 
  GitBranch, 
  Route, 
  TrendingUp,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { pipelineStats } from "@/lib/mock-learning-paths"

const pipelineSteps = [
  {
    icon: FileText,
    title: "Learning segments extracted",
    description: "Parsed your materials into discrete learning units",
    metric: pipelineStats.learningSegments,
    label: "segments",
  },
  {
    icon: Brain,
    title: "Knowledge components identified",
    description: "Core concepts your path is built around",
    metric: pipelineStats.knowledgeComponents,
    label: "KCs",
  },
  {
    icon: Network,
    title: "Segment-KC mapping",
    description: "Linked each segment to relevant concepts",
    metric: pipelineStats.kcLinks,
    label: "links",
  },
  {
    icon: GitBranch,
    title: "Prerequisite structure",
    description: "Analyzed which concepts depend on others",
    metric: pipelineStats.dependencyEdges,
    label: "dependencies",
  },
  {
    icon: Route,
    title: "Candidate paths generated",
    description: "Created multiple valid learning sequences",
    metric: pipelineStats.candidatePaths,
    label: "paths",
  },
  {
    icon: TrendingUp,
    title: "Optimal path selected",
    description: "Chose the path with highest predicted learning gain",
    metric: pipelineStats.selectedPath,
    label: "selected",
  },
]

export function BehindThePath() {
  return (
    <Card className="border-border shadow-sm overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              How your path was built
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              A structured approach to personalized learning
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Desktop: Horizontal pipeline */}
        <div className="hidden md:block">
          <div className="flex items-start justify-between gap-2">
            {pipelineSteps.map((step, index) => (
              <div key={step.title} className="flex items-start">
                <div className="flex flex-col items-center text-center min-w-[100px] max-w-[120px]">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-3 border border-border">
                    <step.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <Badge variant="secondary" className="mb-2 font-semibold text-foreground">
                    {step.metric} {step.label}
                  </Badge>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {step.title}
                  </p>
                </div>
                {index < pipelineSteps.length - 1 && (
                  <ChevronRight className="h-4 w-4 text-muted-foreground mt-4 mx-1 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical pipeline */}
        <div className="md:hidden space-y-3">
          {pipelineSteps.map((step, index) => (
            <div key={step.title} className="relative">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                <div className="flex-shrink-0 h-10 w-10 rounded-lg bg-card border border-border flex items-center justify-center">
                  <step.icon className="h-4 w-4 text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">{step.title}</p>
                    <Badge variant="outline" className="text-xs font-semibold">
                      {step.metric}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
              </div>
              {index < pipelineSteps.length - 1 && (
                <div className="absolute left-[27px] top-full h-3 w-[2px] bg-border" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
