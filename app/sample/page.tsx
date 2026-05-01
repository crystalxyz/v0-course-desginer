"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  Calendar,
  Target,
  Plus,
} from "lucide-react"
import Link from "next/link"

import { WeekSchedule } from "@/components/course/week-schedule"
import { OutcomesTracker } from "@/components/course/outcomes-tracker"
import {
  sampleCourseSettings,
  sampleMaterials,
  sampleWeeks,
  sampleOutcomeCoverage,
  sampleGapWarnings,
} from "@/lib/mock-course-data"

export default function SampleCoursePage() {
  const [activeTab, setActiveTab] = useState("schedule")

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

      {/* Sample Badge */}
      <div className="border-b border-border bg-accent/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              Sample Course
            </Badge>
            <span className="text-sm text-muted-foreground">
              This is a pre-built example of a graduate ML Systems course
            </span>
          </div>
        </div>
      </div>

      {/* Course Title Bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                {sampleCourseSettings.title}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Graduate
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {sampleCourseSettings.weeks} weeks
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {sampleCourseSettings.hoursPerWeek} hrs/week
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {sampleMaterials.length} materials
                </Badge>
                {sampleGapWarnings.length > 0 && (
                  <Badge variant="outline" className="text-xs bg-amber-500/10 text-amber-600 border-amber-200">
                    {sampleGapWarnings.length} gap warning
                  </Badge>
                )}
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button variant="outline" size="sm">
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
              <WeekSchedule weeks={sampleWeeks} gapWarnings={sampleGapWarnings} />
            </TabsContent>
            <TabsContent value="outcomes" className="h-[600px]">
              <OutcomesTracker outcomes={sampleOutcomeCoverage} />
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
              <WeekSchedule weeks={sampleWeeks} gapWarnings={sampleGapWarnings} />
            </div>
          </div>

          {/* Right: Outcomes */}
          <div className="col-span-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Outcomes</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <OutcomesTracker outcomes={sampleOutcomeCoverage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
