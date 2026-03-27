"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Route, Check, Clock, Target, Zap } from "lucide-react"
import { pipelineStats } from "@/lib/mock-learning-paths"

const candidatePaths = [
  { id: 1, name: "Depth-first", score: 72, selected: false, trait: "thorough" },
  { id: 2, name: "Breadth-first", score: 68, selected: false, trait: "exploratory" },
  { id: 3, name: "Goal-optimized", score: 94, selected: true, trait: "efficient" },
  { id: 4, name: "Practice-heavy", score: 81, selected: false, trait: "hands-on" },
  { id: 5, name: "Theory-focused", score: 65, selected: false, trait: "conceptual" },
]

export function CandidatePathsCard() {
  const selectedPath = candidatePaths.find((p) => p.selected)
  
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="pt-5">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
            <Route className="h-5 w-5 text-accent" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-foreground">Path selection</h4>
              <Badge variant="secondary" className="text-xs">
                {pipelineStats.candidatePaths} considered
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              We generated multiple valid learning sequences and selected the one optimized for your timeline and focus.
            </p>
            
            {/* Mini path comparison */}
            <div className="space-y-2">
              {candidatePaths.map((path) => (
                <div
                  key={path.id}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                    path.selected 
                      ? "bg-accent/10 border border-accent/30" 
                      : "bg-secondary/50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {path.selected && (
                      <Check className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                    )}
                    <span className={`text-sm ${path.selected ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                      {path.name}
                    </span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {path.trait}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <div 
                      className={`h-1.5 rounded-full ${path.selected ? "bg-accent" : "bg-muted-foreground/30"}`}
                      style={{ width: `${path.score * 0.6}px` }}
                    />
                    <span className={`text-xs ${path.selected ? "text-accent font-medium" : "text-muted-foreground"}`}>
                      {path.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedPath && (
              <div className="mt-4 pt-3 border-t border-border flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-accent" />
                  <span>Selected: <span className="font-medium text-foreground">{selectedPath.name}</span></span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  <span>Match score: {selectedPath.score}%</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
