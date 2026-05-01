"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  FileText,
  Copy,
  Star,
  Network,
  Sigma,
  Sparkles,
  CheckCircle2,
  CircleDashed,
  PenLine,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  sampleCourseSettings,
  sampleMaterials,
  sampleConcepts,
} from "@/lib/mock-course-data"
import {
  calculusCourseSettings,
  calculusSampleMaterials,
  calculusSampleConcepts,
} from "@/lib/optimizer-data"
import type { CourseSettings } from "@/lib/course-types"

interface SavedCourse {
  settings: CourseSettings
  materialsCount: number
  conceptsCount: number
  lastEdited: string
  status: "draft" | "in-progress" | "finished"
  templateSource?: "calculus" | "ml-systems"
}

// Seeded courses for the demo user. Replaced by Supabase queries in a real
// deployment; for the demo they make /courses look lived-in on first visit.
const seededCourses: SavedCourse[] = [
  {
    settings: { ...calculusCourseSettings, id: "calc-i-spring-26" },
    materialsCount: calculusSampleMaterials.length,
    conceptsCount: calculusSampleConcepts.length,
    lastEdited: "2026-04-22",
    status: "in-progress",
    templateSource: "calculus",
  },
  {
    settings: { ...sampleCourseSettings, id: "ml-systems-fall-25" },
    materialsCount: sampleMaterials.length,
    conceptsCount: sampleConcepts.length,
    lastEdited: "2025-12-09",
    status: "finished",
    templateSource: "ml-systems",
  },
  {
    settings: {
      id: "linalg-draft",
      title: "Linear Algebra (draft)",
      level: "intro",
      weeks: 12,
      hoursPerWeek: 3,
      studentBackground:
        "Students with strong algebra background. Most have not seen formal proofs.",
      prerequisiteTags: ["algebra"],
      learningOutcomes: "Understand vector spaces, linear maps, eigendecomposition.",
      assessmentStyle: "exams",
      createdAt: new Date("2026-04-30"),
      updatedAt: new Date("2026-04-30"),
    },
    materialsCount: 2,
    conceptsCount: 0,
    lastEdited: "2026-04-30",
    status: "draft",
  },
]

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<SavedCourse[]>([])

  useEffect(() => {
    // In production this comes from Supabase; for the demo we hydrate the
    // seeded courses, then layer any in-progress course from localStorage on top.
    const out: SavedCourse[] = [...seededCourses]

    const storedSettings = localStorage.getItem("currentCourseSettings")
    const storedMaterials = localStorage.getItem("currentCourseMaterials")
    if (storedSettings) {
      try {
        const settings = JSON.parse(storedSettings) as CourseSettings
        const materials = storedMaterials ? JSON.parse(storedMaterials) : []
        // Avoid duplicates if the user already has a seed with the same title.
        if (!out.some((c) => c.settings.title === settings.title)) {
          out.unshift({
            settings,
            materialsCount: Array.isArray(materials) ? materials.length : 0,
            conceptsCount: 0,
            lastEdited: new Date().toISOString(),
            status: "draft",
          })
        }
      } catch {
        // Malformed localStorage — ignore.
      }
    }

    setCourses(out)
  }, [])

  const useTemplate = (template: "calculus" | "ml-systems") => {
    if (template === "calculus") {
      localStorage.setItem(
        "currentCourseSettings",
        JSON.stringify(calculusCourseSettings)
      )
      localStorage.setItem(
        "currentCourseMaterials",
        JSON.stringify(calculusSampleMaterials)
      )
    } else {
      localStorage.setItem("currentCourseSettings", JSON.stringify(sampleCourseSettings))
      localStorage.setItem("currentCourseMaterials", JSON.stringify(sampleMaterials))
    }
    router.push("/new/plan")
  }

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "grad":
        return "Graduate"
      case "upper-ug":
        return "Upper-Undergrad"
      case "intro":
        return "Intro"
      default:
        return level
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Course Designer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/courses" className="text-sm text-foreground font-medium">
              Courses
            </Link>
            <Link
              href="/new"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              New Course
            </Link>
            <Link
              href="/sample"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Examples
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/auth/logout">Log out</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/new">
                <Plus className="mr-2 h-4 w-4" />
                New Course
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Demo-mode banner — subtle, not popping out */}
          <div className="mb-6 rounded-lg border border-accent/20 bg-accent/[0.04] px-4 py-2.5 flex items-start gap-3 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent mt-0.5 shrink-0" />
            <div className="flex-1 leading-relaxed">
              <span className="font-medium text-foreground">Demo workspace.</span>{" "}
              <span className="text-muted-foreground">
                You're signed in as the shared demo user. The three courses below
                are pre-seeded; anything you create persists in your browser. Hit{" "}
                <span className="font-medium text-foreground">Log out</span> to
                start over.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Your Courses</h1>
              <p className="text-muted-foreground">
                {courses.length} course{courses.length !== 1 ? "s" : ""} in your library
              </p>
            </div>
          </div>

          {/* Templates */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-medium text-muted-foreground">Start from a template</h2>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <TemplateCard
                title={calculusCourseSettings.title}
                description="14-week intro calculus course generated from the learning-path-optimizer's real outputs (23 KCs, 8 dependency chains, 10 ranked paths)."
                icon={<Sigma className="h-5 w-5 text-primary" />}
                badges={[
                  { label: "Intro" },
                  { label: `${calculusCourseSettings.weeks} weeks` },
                  { label: `${calculusSampleConcepts.length} KCs` },
                  { label: "10 paths" },
                ]}
                onView={() => router.push("/sample?course=calculus")}
                onUse={() => useTemplate("calculus")}
              />
              <TemplateCard
                title={sampleCourseSettings.title}
                description="Pre-built graduate ML Systems course covering distributed training, memory optimization, and serving."
                icon={<Network className="h-5 w-5 text-primary" />}
                badges={[
                  { label: "Graduate" },
                  { label: `${sampleCourseSettings.weeks} weeks` },
                  { label: `${sampleConcepts.length} concepts` },
                  { label: "6 paths" },
                ]}
                onView={() => router.push("/sample?course=ml-systems")}
                onUse={() => useTemplate("ml-systems")}
              />
            </div>
          </div>

          {/* User Courses */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Your courses</h2>
          </div>

          {courses.length === 0 ? (
            <Card className="border-dashed border-border">
              <CardContent className="py-12 text-center">
                <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <h3 className="font-medium text-foreground">No courses yet</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Create your first course to get prerequisite-aware scheduling.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button asChild>
                    <Link href="/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create a course
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={() => useTemplate("calculus")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Start from a template
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <Link
                  key={course.settings.id}
                  href={
                    course.status === "draft"
                      ? "/new"
                      : "/new/plan"
                  }
                  onClick={() => {
                    // Preload this course's data into localStorage so the wizard
                    // / plan view shows the right content.
                    localStorage.setItem(
                      "currentCourseSettings",
                      JSON.stringify(course.settings)
                    )
                    if (course.templateSource === "calculus") {
                      localStorage.setItem(
                        "currentCourseMaterials",
                        JSON.stringify(calculusSampleMaterials)
                      )
                    } else if (course.templateSource === "ml-systems") {
                      localStorage.setItem(
                        "currentCourseMaterials",
                        JSON.stringify(sampleMaterials)
                      )
                    }
                  }}
                >
                  <Card className="border-border hover:shadow-md transition-all cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                              {course.settings.title}
                            </h2>
                            <StatusPill status={course.status} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs">
                              {getLevelLabel(course.settings.level)}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Calendar className="h-3 w-3 mr-1" />
                              {course.settings.weeks} weeks
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {course.settings.hoursPerWeek} hrs/week
                            </Badge>
                            {course.materialsCount > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                <BookOpen className="h-3 w-3 mr-1" />
                                {course.materialsCount} materials
                              </Badge>
                            )}
                          </div>
                          {course.settings.studentBackground && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {course.settings.studentBackground}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Last edited {formatDate(course.lastEdited)}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 shrink-0" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

interface TemplateCardProps {
  title: string
  description: string
  icon: React.ReactNode
  badges: { label: string }[]
  onView: () => void
  onUse: () => void
}

function TemplateCard({ title, description, icon, badges, onView, onUse }: TemplateCardProps) {
  return (
    <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className="h-9 w-9 rounded-lg bg-card border border-border flex items-center justify-center shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {badges.map((b) => (
            <Badge key={b.label} variant="secondary" className="text-[10px] px-1.5 py-0">
              {b.label}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onView} className="flex-1">
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            View
          </Button>
          <Button size="sm" onClick={onUse} className="flex-1">
            <Copy className="mr-1.5 h-3.5 w-3.5" />
            Use template
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusPill({ status }: { status: SavedCourse["status"] }) {
  const cfg = {
    "draft": { Icon: PenLine, label: "Draft", className: "bg-muted text-muted-foreground border-border" },
    "in-progress": { Icon: CircleDashed, label: "In progress", className: "bg-amber-50 text-amber-700 border-amber-200" },
    "finished": { Icon: CheckCircle2, label: "Finished", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  }[status]
  const Icon = cfg.Icon
  return (
    <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 gap-1", cfg.className)}>
      <Icon className="h-2.5 w-2.5" />
      {cfg.label}
    </Badge>
  )
}
