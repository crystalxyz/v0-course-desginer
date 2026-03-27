"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Sparkles } from "lucide-react"
import { pipelineStats } from "@/lib/mock-learning-paths"

export function LearningGainCard() {
  const improvement = pipelineStats.postScore - pipelineStats.preScore
  
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <CardTitle className="text-base">Predicted learning gain</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            <Sparkles className="h-3 w-3 mr-1" />
            {pipelineStats.confidenceLevel}% confidence
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score comparison */}
        <div className="flex items-end justify-center gap-8">
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Before</p>
            <p className="text-3xl font-bold text-muted-foreground/60">{pipelineStats.preScore}%</p>
          </div>
          <div className="text-center pb-1">
            <Badge className="bg-accent text-accent-foreground font-semibold">
              +{improvement}%
            </Badge>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">After</p>
            <p className="text-3xl font-bold text-accent">{pipelineStats.postScore}%</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="relative h-3 bg-secondary rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-muted-foreground/20 rounded-full"
              style={{ width: `${pipelineStats.preScore}%` }}
            />
            <div 
              className="absolute inset-y-0 left-0 bg-accent rounded-full"
              style={{ width: `${pipelineStats.postScore}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Simulated mastery across {pipelineStats.kcsExtracted} knowledge components
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
