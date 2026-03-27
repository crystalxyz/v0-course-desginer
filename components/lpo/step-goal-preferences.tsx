"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepGoalPreferencesProps {
  goal: string
  setGoal: (goal: string) => void
  timeline: string
  setTimeline: (timeline: string) => void
  level: string
  setLevel: (level: string) => void
  preferences: string[]
  setPreferences: (preferences: string[]) => void
  onNext: () => void
}

const timelineOptions = [
  { value: "3-days", label: "3 days" },
  { value: "1-week", label: "1 week" },
  { value: "2-weeks", label: "2 weeks" },
  { value: "1-month", label: "1 month" },
  { value: "flexible", label: "Flexible" },
]

const levelOptions = [
  { value: "beginner", label: "Beginner", description: "New to the topic" },
  { value: "some-exposure", label: "Some exposure", description: "Familiar with basics" },
  { value: "intermediate", label: "Intermediate", description: "Comfortable with concepts" },
  { value: "advanced-rusty", label: "Advanced but rusty", description: "Need a refresher" },
]

const preferenceOptions = [
  { value: "study-first", label: "Tell me what to study first" },
  { value: "weekly-plan", label: "Build a weekly plan" },
  { value: "prerequisites", label: "Show prerequisites" },
  { value: "resources", label: "Recommend resources" },
  { value: "interview-prep", label: "Interview prep" },
  { value: "course-mastery", label: "Course mastery" },
]

export function StepGoalPreferences({
  goal,
  setGoal,
  timeline,
  setTimeline,
  level,
  setLevel,
  preferences,
  setPreferences,
  onNext,
}: StepGoalPreferencesProps) {
  const togglePreference = (value: string) => {
    if (preferences.includes(value)) {
      setPreferences(preferences.filter((p) => p !== value))
    } else {
      setPreferences([...preferences, value])
    }
  }

  const canContinue = goal.trim() !== "" && timeline !== "" && level !== ""

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Tell us about your learning goals
          </h2>
          <p className="text-muted-foreground">
            We&apos;ll create a personalized path based on your inputs
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-6">
            {/* Learning Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-sm font-medium">
                Learning goal
              </Label>
              <Input
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Prepare for a machine learning interview in 2 weeks"
                className="h-11"
              />
            </div>

            {/* Timeline */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Timeline</Label>
              <Select value={timeline} onValueChange={setTimeline}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select your timeline" />
                </SelectTrigger>
                <SelectContent>
                  {timelineOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Current Level */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Current level</Label>
              <RadioGroup value={level} onValueChange={setLevel} className="grid grid-cols-2 gap-2">
                {levelOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={`level-${option.value}`}
                    className={cn(
                      "flex flex-col items-start gap-0.5 rounded-lg border border-border p-3 cursor-pointer transition-all hover:border-accent/50",
                      level === option.value && "border-accent bg-accent/5"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <RadioGroupItem value={option.value} id={`level-${option.value}`} />
                      <span className="font-medium text-sm">{option.label}</span>
                    </div>
                    <span className="text-xs text-muted-foreground ml-6">{option.description}</span>
                  </Label>
                ))}
              </RadioGroup>
            </div>

            {/* Learning Preferences */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Learning preferences</Label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => togglePreference(option.value)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm font-medium border transition-all",
                      preferences.includes(option.value)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-accent/50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Button
          size="lg"
          className="w-full h-12 text-base font-medium"
          disabled={!canContinue}
          onClick={onNext}
        >
          Continue
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
