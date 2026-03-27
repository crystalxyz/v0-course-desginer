"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
  onSeeExample: () => void
}

export function HeroSection({ onGetStarted, onSeeExample }: HeroSectionProps) {
  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">For self-directed learners, students, and interview preppers</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
            Stop guessing what to study next.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Generate a personalized AI/ML learning path from your goal, timeline, and materials.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              onClick={onGetStarted}
              className="min-w-[220px] h-12 text-base font-medium"
            >
              Generate my learning path
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={onSeeExample}
              className="min-w-[140px] h-12 text-base font-medium"
            >
              See example
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
