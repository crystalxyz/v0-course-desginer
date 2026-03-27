"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Network, ArrowRight, Loader2, Check } from "lucide-react"
import { pipelineStats, kcNodes } from "@/lib/mock-learning-paths"
import { cn } from "@/lib/utils"

interface StepExtractedConceptsProps {
  onNext: () => void
}

const processingSteps = [
  { id: "parsing", label: "Parsing materials...", duration: 800 },
  { id: "extracting", label: "Extracting knowledge components...", duration: 1200 },
  { id: "mapping", label: "Mapping segment relationships...", duration: 1000 },
  { id: "analyzing", label: "Analyzing prerequisites...", duration: 800 },
]

export function StepExtractedConcepts({ onNext }: StepExtractedConceptsProps) {
  const [currentProcessingStep, setCurrentProcessingStep] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [visibleKCs, setVisibleKCs] = useState<number>(0)

  useEffect(() => {
    let totalDelay = 0
    processingSteps.forEach((step, index) => {
      totalDelay += step.duration
      setTimeout(() => {
        setCurrentProcessingStep(index + 1)
      }, totalDelay)
    })

    // Mark complete after all processing
    setTimeout(() => {
      setIsComplete(true)
    }, totalDelay + 300)
  }, [])

  // Animate KCs appearing after processing is complete
  useEffect(() => {
    if (isComplete && visibleKCs < kcNodes.length) {
      const timer = setTimeout(() => {
        setVisibleKCs((prev) => Math.min(prev + 2, kcNodes.length))
      }, 80)
      return () => clearTimeout(timer)
    }
  }, [isComplete, visibleKCs])

  const groupedKCs = kcNodes.reduce((acc, kc) => {
    if (!acc[kc.level]) acc[kc.level] = []
    acc[kc.level].push(kc)
    return acc
  }, {} as Record<string, typeof kcNodes>)

  const levelOrder = ["foundations", "core", "supervised", "evaluation", "advanced"]
  const levelLabels: Record<string, string> = {
    foundations: "Foundations",
    core: "Core Concepts",
    supervised: "Supervised Learning",
    evaluation: "Model Quality",
    advanced: "Advanced Topics",
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-2xl space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Analyzing your materials
          </h2>
          <p className="text-muted-foreground">
            Extracting knowledge components and mapping dependencies
          </p>
        </div>

        {/* Processing status */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="space-y-3">
              {processingSteps.map((step, index) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg transition-all",
                    index < currentProcessingStep
                      ? "bg-accent/10"
                      : index === currentProcessingStep
                      ? "bg-secondary"
                      : "opacity-50"
                  )}
                >
                  {index < currentProcessingStep ? (
                    <Check className="h-5 w-5 text-accent" />
                  ) : index === currentProcessingStep ? (
                    <Loader2 className="h-5 w-5 text-accent animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-border" />
                  )}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      index <= currentProcessingStep
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Extracted KCs */}
        {isComplete && (
          <Card className="border-border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle className="text-lg">
                    {pipelineStats.kcsExtracted} Knowledge Components Identified
                  </CardTitle>
                  <CardDescription>
                    {pipelineStats.kcLinks} segment-KC links mapped
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {levelOrder.map((level) => (
                groupedKCs[level] && (
                  <div key={level} className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {levelLabels[level]}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {groupedKCs[level].map((kc, idx) => {
                        const globalIndex = kcNodes.findIndex((n) => n.id === kc.id)
                        return (
                          <Badge
                            key={kc.id}
                            variant="secondary"
                            className={cn(
                              "transition-all duration-300",
                              globalIndex < visibleKCs
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-2"
                            )}
                          >
                            {kc.label}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )
              ))}

              <div className="flex items-center gap-2 pt-4 text-sm text-muted-foreground">
                <Network className="h-4 w-4" />
                <span>{pipelineStats.dependencyEdges} prerequisite dependencies detected</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next button */}
        {isComplete && visibleKCs >= kcNodes.length && (
          <Button
            size="lg"
            onClick={onNext}
            className="w-full h-12 text-base font-medium animate-in fade-in slide-in-from-bottom-2 duration-300"
          >
            Generate learning path
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
