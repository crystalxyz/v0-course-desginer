"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, ArrowRight, ArrowLeft, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { CourseLevel, AssessmentStyle, CourseSettings } from "@/lib/course-types"

export default function NewCoursePage() {
  const router = useRouter()

  // Course settings state
  const [title, setTitle] = useState("")
  const [level, setLevel] = useState<CourseLevel | "">("")
  const [weeks, setWeeks] = useState("")
  const [hoursPerWeek, setHoursPerWeek] = useState("")
  const [studentBackground, setStudentBackground] = useState("")
  const [prerequisiteInput, setPrerequisiteInput] = useState("")
  const [prerequisiteTags, setPrerequisiteTags] = useState<string[]>([])
  const [learningOutcomes, setLearningOutcomes] = useState("")
  const [assessmentStyle, setAssessmentStyle] = useState<AssessmentStyle | "">("")
  const [prefilledFromTemplate, setPrefilledFromTemplate] = useState(false)

  // Pre-fill from any template seeded into localStorage by /courses 'Use
  // template' or the landing-page 'see a sample' link.
  useEffect(() => {
    const stored = localStorage.getItem("currentCourseSettings")
    if (!stored) return
    try {
      const s = JSON.parse(stored) as CourseSettings
      if (s.title) setTitle(s.title)
      if (s.level) setLevel(s.level)
      if (s.weeks) setWeeks(String(s.weeks))
      if (s.hoursPerWeek) setHoursPerWeek(String(s.hoursPerWeek))
      if (s.studentBackground) setStudentBackground(s.studentBackground)
      if (Array.isArray(s.prerequisiteTags)) setPrerequisiteTags(s.prerequisiteTags)
      if (s.learningOutcomes) setLearningOutcomes(s.learningOutcomes)
      if (s.assessmentStyle) setAssessmentStyle(s.assessmentStyle)
      if (s.title && s.level && s.weeks) setPrefilledFromTemplate(true)
    } catch {
      // ignore malformed localStorage
    }
  }, [])

  const handleAddPrerequisite = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && prerequisiteInput.trim()) {
      e.preventDefault()
      if (!prerequisiteTags.includes(prerequisiteInput.trim())) {
        setPrerequisiteTags([...prerequisiteTags, prerequisiteInput.trim()])
      }
      setPrerequisiteInput("")
    }
  }

  const removePrerequisite = (tag: string) => {
    setPrerequisiteTags(prerequisiteTags.filter((t) => t !== tag))
  }

  const isFormValid = title.trim() && level && weeks && hoursPerWeek

  const handleContinue = () => {
    // Store settings in localStorage for now (clean interface for DB later)
    const settings = {
      id: `course-${Date.now()}`,
      title,
      level,
      weeks: parseInt(weeks),
      hoursPerWeek: parseInt(hoursPerWeek),
      studentBackground,
      prerequisiteTags,
      learningOutcomes,
      assessmentStyle,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem("currentCourseSettings", JSON.stringify(settings))
    router.push("/new/materials")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Course Designer</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                1
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Setup</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Materials</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Outline</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                4
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Course Setup</h1>
            <p className="text-muted-foreground">
              Tell us about your course. This helps us generate a coherent schedule.
            </p>
          </div>

          {prefilledFromTemplate && (
            <div className="mb-6 rounded-lg border border-accent/20 bg-accent/[0.04] px-4 py-2.5 flex items-start gap-3 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
              <div className="flex-1 leading-relaxed">
                <span className="font-medium text-foreground">Prefilled from template.</span>{" "}
                <span className="text-muted-foreground">
                  Edit any field to make this course your own, or just hit{" "}
                  <span className="font-medium text-foreground">Continue</span> to step through
                  the rest of the wizard with example data.
                </span>
              </div>
            </div>
          )}

          <Card className="border-border">
            <CardContent className="pt-6 space-y-6">
              {/* Course Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Machine Learning Systems"
                />
              </div>

              {/* Level and Duration Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Level</Label>
                  <Select value={level} onValueChange={(v) => setLevel(v as CourseLevel)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grad">Graduate</SelectItem>
                      <SelectItem value="upper-ug">Upper-Undergrad</SelectItem>
                      <SelectItem value="intro">Intro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weeks">Weeks</Label>
                  <Input
                    id="weeks"
                    type="number"
                    min="1"
                    max="20"
                    value={weeks}
                    onChange={(e) => setWeeks(e.target.value)}
                    placeholder="14"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hours">Hours/week</Label>
                  <Input
                    id="hours"
                    type="number"
                    min="1"
                    max="10"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    placeholder="3"
                  />
                </div>
              </div>

              {/* Student Background */}
              <div className="space-y-2">
                <Label htmlFor="background">Expected student background</Label>
                <Textarea
                  id="background"
                  value={studentBackground}
                  onChange={(e) => setStudentBackground(e.target.value)}
                  placeholder="Describe what students are expected to know coming in..."
                  className="min-h-[80px] resize-none"
                />
              </div>

              {/* Prerequisite Tags */}
              <div className="space-y-2">
                <Label htmlFor="prereqs">Prerequisite course tags (optional)</Label>
                <Input
                  id="prereqs"
                  value={prerequisiteInput}
                  onChange={(e) => setPrerequisiteInput(e.target.value)}
                  onKeyDown={handleAddPrerequisite}
                  placeholder="Type a tag and press Enter"
                />
                {prerequisiteTags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prerequisiteTags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          onClick={() => removePrerequisite(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Learning Outcomes */}
              <div className="space-y-2">
                <Label htmlFor="outcomes">Learning outcomes</Label>
                <Textarea
                  id="outcomes"
                  value={learningOutcomes}
                  onChange={(e) => setLearningOutcomes(e.target.value)}
                  placeholder="List your course learning outcomes (one per line)..."
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Assessment Style */}
              <div className="space-y-2">
                <Label>Assessment style</Label>
                <Select value={assessmentStyle} onValueChange={(v) => setAssessmentStyle(v as AssessmentStyle)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assessment style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="problem-sets">Problem sets</SelectItem>
                    <SelectItem value="exams">Exams</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="mix">Mix of all</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end mt-6">
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!isFormValid}
              className="min-w-[160px]"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
