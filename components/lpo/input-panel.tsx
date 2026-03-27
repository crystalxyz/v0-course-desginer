"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

interface InputPanelProps {
  goal: string
  setGoal: (goal: string) => void
  timeline: string
  setTimeline: (timeline: string) => void
  level: string
  setLevel: (level: string) => void
  preferences: string[]
  setPreferences: (preferences: string[]) => void
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
  { value: "prerequisites", label: "Show prerequisites and dependencies" },
  { value: "resources", label: "Recommend learning resources" },
  { value: "interview-prep", label: "Focus on interview prep" },
  { value: "course-mastery", label: "Focus on course mastery" },
]

export function InputPanel({
  goal,
  setGoal,
  timeline,
  setTimeline,
  level,
  setLevel,
  preferences,
  setPreferences,
}: InputPanelProps) {
  const togglePreference = (value: string) => {
    if (preferences.includes(value)) {
      setPreferences(preferences.filter((p) => p !== value))
    } else {
      setPreferences([...preferences, value])
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Tell us about your learning goals</CardTitle>
        <CardDescription>We&apos;ll create a personalized path based on your inputs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
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
          <RadioGroup value={level} onValueChange={setLevel} className="grid grid-cols-2 gap-3">
            {levelOptions.map((option) => (
              <Label
                key={option.value}
                htmlFor={option.value}
                className={cn(
                  "flex flex-col items-start gap-1 rounded-lg border border-border p-4 cursor-pointer transition-all hover:border-accent/50",
                  level === option.value && "border-accent bg-accent/5"
                )}
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-6">{option.description}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>

        {/* Learning Preferences */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Learning preferences</Label>
          <p className="text-xs text-muted-foreground">Select all that apply</p>
          <div className="flex flex-wrap gap-2">
            {preferenceOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => togglePreference(option.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
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
  )
}
