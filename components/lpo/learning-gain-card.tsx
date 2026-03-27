"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ArrowRight, Sparkles } from "lucide-react"
import { pipelineStats } from "@/lib/mock-learning-paths"

export function LearningGainCard() {
  const improvement = pipelineStats.postScore - pipelineStats.preScore
  
  return (
    <Card className="border-border shadow-sm bg-gradient-to-br from-card to-accent/5">
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">Predicted learning gain</h4>
              <Badge className="bg-accent text-accent-foreground text-xs">
                <Sparkles className="h-3 w-3 mr-1" />
                {pipelineStats.confidenceLevel}% confidence
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              This path was selected based on simulated pre-to-post mastery improvement for your profile.
            </p>
            
            {/* Learning gain visualization */}
            <div className="bg-card rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between mb-3">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Pre-learning</p>
                  <p className="text-2xl font-semibold text-muted-foreground">{pipelineStats.preScore}%</p>
                </div>
                <div className="flex-1 flex items-center justify-center px-4">
                  <div className="flex items-center gap-2">
                    <div className="h-[2px] w-8 bg-border" />
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent/10">
                      <ArrowRight className="h-4 w-4 text-accent" />
                    </div>
                    <div className="h-[2px] w-8 bg-border" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Post-learning</p>
                  <p className="text-2xl font-semibold text-accent">{pipelineStats.postScore}%</p>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-muted-foreground/30 rounded-full"
                  style={{ width: `${pipelineStats.preScore}%` }}
                />
                <div 
                  className="absolute inset-y-0 left-0 bg-accent rounded-full transition-all duration-1000"
                  style={{ width: `${pipelineStats.postScore}%` }}
                />
              </div>
              
              <div className="mt-3 text-center">
                <Badge variant="outline" className="bg-accent/5 border-accent/20 text-accent">
                  +{improvement} percentage points projected improvement
                </Badge>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Based on simulated learning evaluation across knowledge components
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
