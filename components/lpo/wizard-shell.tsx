"use client"

import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface WizardStep {
  id: string
  label: string
}

interface WizardShellProps {
  steps: WizardStep[]
  currentStep: number
  children: React.ReactNode
}

export function WizardShell({ steps, currentStep, children }: WizardShellProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Progress indicator */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-1 sm:gap-2 max-w-2xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex items-center justify-center h-8 w-8 rounded-full text-sm font-medium transition-all",
                      index < currentStep
                        ? "bg-accent text-accent-foreground"
                        : index === currentStep
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm font-medium hidden sm:block",
                      index <= currentStep ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "h-[2px] w-6 sm:w-12 mx-2",
                      index < currentStep ? "bg-accent" : "bg-border"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  )
}
