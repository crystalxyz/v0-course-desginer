"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ArrowRight, Layers, Clock, Star } from "lucide-react"

const reasons = [
  {
    icon: ArrowRight,
    title: "Prerequisites first",
    description: "We prioritized foundational concepts that other topics depend on",
  },
  {
    icon: Layers,
    title: "Grouped related concepts",
    description: "Tightly related topics are placed together for better retention",
  },
  {
    icon: Clock,
    title: "Adapted to your timeline",
    description: "The pace and depth are calibrated to your available time",
  },
  {
    icon: Star,
    title: "Relevance prioritized",
    description: "The most important topics for your goals appear earlier",
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
