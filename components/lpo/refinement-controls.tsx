"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Zap, BookOpen, Target, Dumbbell, Brain, Library } from "lucide-react"
import { cn } from "@/lib/utils"

interface RefinementOption {
  id: string
  label: string
  icon: React.ElementType
}

const refinementOptions: RefinementOption[] = [
  { id: "faster", label: "Make it faster", icon: Zap },
  { id: "beginner", label: "More beginner-friendly", icon: BookOpen },
  { id: "interview", label: "Prioritize interview prep", icon: Target },
  { id: "practice", label: "Add more practice", icon: Dumbbell },
  { id: "less-theory", label: "Reduce theory", icon: Brain },
  { id: "resources", label: "Add recommended resources", icon: Library },
]

interface RefinementControlsProps {
  activeRefinements: string[]
  onToggleRefinement: (id: string) => void
}

export function RefinementControls({
  activeRefinements,
  onToggleRefinement,
}: RefinementControlsProps) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Refine your path</CardTitle>
        <CardDescription>Click to adjust your learning path</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {refinementOptions.map((option) => {
            const isActive = activeRefinements.includes(option.id)
            return (
              <button
                key={option.id}
                onClick={() => onToggleRefinement(option.id)}
                className={cn(
                  "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:border-accent/50 hover:bg-secondary/50"
                )}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
