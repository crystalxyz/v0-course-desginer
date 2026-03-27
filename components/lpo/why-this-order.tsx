"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, Brain, GitBranch, Layers, Clock } from "lucide-react"

const reasons = [
  {
    icon: Brain,
    title: "Knowledge components identified",
    description: "We extracted the core concepts from your materials and mapped them to a structured knowledge model",
  },
  {
    icon: GitBranch,
    title: "Prerequisite structure analyzed",
    description: "We determined which concepts depend on others, ensuring you learn foundations before advanced topics",
  },
  {
    icon: Layers,
    title: "Learning segments grouped",
    description: "Related content is organized around knowledge components for better retention and understanding",
  },
  {
    icon: Clock,
    title: "Optimized for your timeline",
    description: "The sequence was selected from multiple candidates to maximize learning gain within your available time",
  },
]

export function WhyThisOrder() {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-accent" />
          Why this order?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-md bg-accent/10 flex items-center justify-center">
                <reason.icon className="h-4 w-4 text-accent" />
              </div>
              <div>
                <h4 className="text-sm font-medium text-foreground mb-0.5">
                  {reason.title}
                </h4>
                <p className="text-xs text-muted-foreground">{reason.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
