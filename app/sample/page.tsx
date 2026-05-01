"use client"

import { useState, useMemo, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  Target,
  Plus,
  BookOpen,
  Sigma,
} from "lucide-react"
import Link from "next/link"

import { WeekSchedule } from "@/components/course/week-schedule"
import { OutcomesTracker } from "@/components/course/outcomes-tracker"
import {
  sampleCourseSettings,
  sampleMaterials,
  sampleWeeks,
  sampleOutcomeCoverage,
} from "@/lib/mock-course-data"
import {
  calculusCourseSettings,
  calculusSampleMaterials,
  calculusSampleWeeks,
  calculusSampleOutcomeCoverage,
} from "@/lib/optimizer-data"
import { cn } from "@/lib/utils"

type CourseKey = "ml-systems" | "calculus"

const COURSE_BLURB: Record<CourseKey, string> = {
  "ml-systems": "Pre-built graduate ML Systems course (14 weeks)",
  calculus: "Pre-built intro Calculus course (14 weeks)",
}

function SampleCourseInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const param = searchParams.get("course")
  const courseKey: CourseKey = param === "calculus" ? "calculus" : "ml-systems"

  const [activeTab, setActiveTab] = useState("schedule")

  const data = useMemo(() => {
    if (courseKey === "calculus") {
      return {
        settings: calculusCourseSettings,
        materials: calculusSampleMaterials,
        weeks: calculusSampleWeeks,
        outcomes: calculusSampleOutcomeCoverage,
        levelLabel: "Intro",
      }
    }
    return {
      settings: sampleCourseSettings,
      materials: sampleMaterials,
      weeks: sampleWeeks,
      outcomes: sampleOutcomeCoverage,
      levelLabel: "Graduate",
    }
  }, [courseKey])

  const switchCourse = (key: CourseKey) => {
    router.push(`/sample?course=${key}`)
  }

  const handleShare = () => {
    const slug = Math.random().toString(36).slice(2, 10)
    const link = `https://coursedesigner.app/share/${slug}`
    navigator.clipboard.writeText(link).catch(() => {})
    toast.success("Share link copied", {
      description: "Anyone with the link can view this course (read-only).",
    })
  }

  const handleExport = () => {
    router.push("/new/plan/export")
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
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/new">
                <Plus className="mr-2 h-4 w-4" />
                Create your own
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Sample Badge + Course Switcher */}
      <div className="border-b border-border bg-accent/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                Sample Course
              </Badge>
              <span className="text-sm text-muted-foreground">{COURSE_BLURB[courseKey]}</span>
            </div>
            <div className="inline-flex items-center gap-1 rounded-md bg-card border border-border p-1">
              <button
                onClick={() => switchCourse("ml-systems")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors",
                  courseKey === "ml-systems"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BookOpen className="h-3 w-3" />
                ML Systems
              </button>
              <button
                onClick={() => switchCourse("calculus")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded px-3 py-1 text-xs font-medium transition-colors",
                  courseKey === "calculus"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sigma className="h-3 w-3" />
                Calculus I
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Title Bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">{data.settings.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {data.levelLabel}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {data.settings.weeks} weeks
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {data.settings.hoursPerWeek} hrs/week
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {data.materials.length} materials
                </Badge>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Panel Layout */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Mobile: Tabs */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="schedule" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Outcomes
              </TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="h-[600px]">
              <WeekSchedule weeks={data.weeks} />
            </TabsContent>
            <TabsContent value="outcomes" className="h-[600px]">
              <OutcomesTracker outcomes={data.outcomes} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop: 2-Panel */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          {/* Left: Week Schedule */}
          <div className="col-span-8">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Weekly Schedule</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <WeekSchedule weeks={data.weeks} />
            </div>
          </div>

          {/* Right: Outcomes */}
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Outcomes</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <OutcomesTracker outcomes={data.outcomes} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function SampleCoursePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <SampleCourseInner />
    </Suspense>
  )
}
