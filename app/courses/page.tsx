"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Empty } from "@/components/ui/empty"
import {
  GraduationCap,
  Plus,
  Calendar,
  Clock,
  BookOpen,
  ChevronRight,
  FileText,
  AlertTriangle,
  Copy,
  Star,
  CheckCircle2,
  Network,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { sampleCourseSettings, sampleMaterials, sampleGapWarnings, sampleConcepts } from "@/lib/mock-course-data"
import type { CourseSettings } from "@/lib/course-types"

interface SavedCourse {
  settings: CourseSettings
  materialsCount: number
  conceptsCount: number
  gapCount: number
  lastEdited: string
}

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<SavedCourse[]>([])

  useEffect(() => {
    // In production, this would fetch from a database
    // For now, check localStorage for any saved courses
    const storedSettings = localStorage.getItem("currentCourseSettings")
    const storedMaterials = localStorage.getItem("currentCourseMaterials")

    const savedCourses: SavedCourse[] = []

    if (storedSettings) {
      const settings = JSON.parse(storedSettings) as CourseSettings
      const materials = storedMaterials ? JSON.parse(storedMaterials) : []
      savedCourses.push({
        settings,
        materialsCount: materials.length,
        conceptsCount: 0,
        gapCount: 0,
        lastEdited: new Date().toISOString(),
      })
    }

    setCourses(savedCourses)
  }, [])

  const handleUseTemplate = () => {
    // Save sample course to localStorage and navigate to plan
    localStorage.setItem("currentCourseSettings", JSON.stringify(sampleCourseSettings))
    localStorage.setItem("currentCourseMaterials", JSON.stringify(sampleMaterials))
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
      {/* Header */}
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
            <Link href="/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              New Course
            </Link>
            <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sample Course
            </Link>
            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <Button asChild size="sm">
            <Link href="/new">
              <Plus className="mr-2 h-4 w-4" />
              New Course
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">Your Courses</h1>
              <p className="text-muted-foreground">
                {courses.length} course{courses.length !== 1 ? "s" : ""} in your library
              </p>
            </div>
          </div>

          {/* Sample Course Card (Pinned) */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Star className="h-4 w-4 text-amber-500" />
              <h2 className="text-sm font-medium text-muted-foreground">Sample Course</h2>
            </div>
            <Card className="border-border bg-gradient-to-br from-primary/5 to-accent/5 hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-lg font-semibold text-foreground">
                        {sampleCourseSettings.title}
                      </h2>
                      <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                        <Star className="h-3 w-3 mr-1" />
                        Template
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {sampleCourseSettings.studentBackground}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <Badge variant="secondary" className="text-xs">
                        {getLevelLabel(sampleCourseSettings.level)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Calendar className="h-3 w-3 mr-1" />
                        {sampleCourseSettings.weeks} weeks
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        {sampleCourseSettings.hoursPerWeek} hrs/week
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {sampleMaterials.length} materials
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        <Network className="h-3 w-3 mr-1" />
                        {sampleConcepts.length} concepts
                      </Badge>
                      {sampleGapWarnings.length > 0 ? (
                        <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {sampleGapWarnings.length} gap{sampleGapWarnings.length > 1 ? "s" : ""}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          No gaps
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" asChild>
                        <Link href="/sample">
                          <FileText className="mr-2 h-4 w-4" />
                          View Sample
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleUseTemplate}>
                        <Copy className="mr-2 h-4 w-4" />
                        Use as Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* User Courses */}
          <div className="mb-4">
            <h2 className="text-sm font-medium text-muted-foreground mb-3">Your Courses</h2>
          </div>

          {courses.length === 0 ? (
            <Empty
              icon={<BookOpen className="h-10 w-10" />}
              title="No courses yet"
              description="Create your first course to get started with prerequisite-aware scheduling."
              action={
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild>
                    <Link href="/new">
                      <Plus className="mr-2 h-4 w-4" />
                      Create a course
                    </Link>
                  </Button>
                  <Button variant="outline" onClick={handleUseTemplate}>
                    <Copy className="mr-2 h-4 w-4" />
                    Start from template
                  </Button>
                </div>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <Link key={course.settings.id} href="/new/plan">
                  <Card className="border-border hover:shadow-md transition-all cursor-pointer group h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                              {course.settings.title}
                            </h2>
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
                            {course.gapCount > 0 && (
                              <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                {course.gapCount} gap{course.gapCount > 1 ? "s" : ""}
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
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors ml-4 flex-shrink-0" />
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
