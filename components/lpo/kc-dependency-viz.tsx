"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Network, ArrowRight } from "lucide-react"

// Simplified layered view of KC dependencies
const dependencyLayers = [
  {
    level: 1,
    label: "Foundations",
    kcs: ["Linear Algebra", "Probability"],
    color: "bg-blue-500/10 text-blue-700 border-blue-200",
  },
  {
    level: 2,
    label: "Core Concepts",
    kcs: ["Gradient Descent", "Loss Functions"],
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  {
    level: 3,
    label: "Supervised Learning",
    kcs: ["Regression", "Classification", "Decision Boundary"],
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  {
    level: 4,
    label: "Model Quality",
    kcs: ["Overfitting", "Bias-Variance", "Regularization"],
    color: "bg-rose-500/10 text-rose-700 border-rose-200",
  },
  {
    level: 5,
    label: "Advanced",
    kcs: ["Cross-Validation", "Ensemble Methods"],
    color: "bg-purple-500/10 text-purple-700 border-purple-200",
  },
]

export function KCDependencyViz() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Network className="h-4 w-4 text-accent" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">
              Knowledge structure
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              Concepts are sequenced by prerequisite dependencies
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {dependencyLayers.map((layer, index) => (
            <div key={layer.level} className="relative">
              <div className="flex items-center gap-3">
                <div className="w-20 flex-shrink-0 text-right">
                  <span className="text-xs font-medium text-muted-foreground">
                    {layer.label}
                  </span>
                </div>
                <div className="flex-1 flex flex-wrap gap-2">
                  {layer.kcs.map((kc) => (
                    <Badge
                      key={kc}
                      variant="outline"
                      className={`text-xs font-medium ${layer.color}`}
                    >
                      {kc}
                    </Badge>
                  ))}
                </div>
              </div>
              {index < dependencyLayers.length - 1 && (
                <div className="flex items-center gap-3 my-2">
                  <div className="w-20 flex-shrink-0" />
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  <span className="text-[10px] text-muted-foreground/70">depends on</span>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Summary */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Your path follows this structure to ensure you learn prerequisites before dependent concepts
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
