"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  GraduationCap,
  Calendar,
  Target,
  BookOpen,
  AlertTriangle,
  Plus,
  Copy,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { WeekSchedule } from "@/components/course/week-schedule"
import { OutcomesTracker } from "@/components/course/outcomes-tracker"
import { MaterialsPanel } from "@/components/course/materials-panel"
import {
  readShareFromHash,
  type SharedCourseData,
} from "@/lib/share-url"

export default function SharedCoursePage() {
  const [data, setData] = useState<SharedCourseData | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState<"schedule" | "outcomes" | "materials">("schedule")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Hash isn't sent to the server; only readable client-side. Decode here.
    const fromHash = readShareFromHash(window.location.hash)
    setData(fromHash)
    setLoaded(true)
  }, [])

  const copyCurrentUrl = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success("Link copied")
  }

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading shared course…</p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <Card className="max-w-md w-full border-border">
            <CardContent className="pt-8 pb-6 text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Share link is empty</h1>
                <p className="text-sm text-muted-foreground mt-2">
                  This share URL doesn't carry any course data — likely because the
                  link was copied without its <span className="font-mono">#data=…</span>{" "}
                  fragment, or the data was stripped by an intermediate redirect.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/sample">Browse a sample course</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/new">
                    <Plus className="mr-2 h-3.5 w-3.5" />
                    Build your own
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    )
  }

  const { settings, materials, plan } = data
  const levelLabel =
    settings.level === "grad"
      ? "Graduate"
      : settings.level === "upper-ug"
        ? "Upper-Undergrad"
        : "Intro"

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={copyCurrentUrl}>
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-accent" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy link
                </>
              )}
            </Button>
            <Button size="sm" asChild>
              <Link href="/new">
                <Plus className="mr-2 h-4 w-4" />
                Build your own
              </Link>
            </Button>
          </div>
        }
      />

      {/* Read-only banner */}
      <div className="border-b border-border bg-accent/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
              Shared course · read-only
            </Badge>
            <span className="text-sm text-muted-foreground">
              Snapshot of someone's course plan. Anything you change here stays local.
            </span>
          </div>
        </div>
      </div>

      {/* Course title bar */}
      <div className="border-b border-border bg-background">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-semibold text-foreground">{settings.title}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <Badge variant="secondary" className="text-xs">
              {levelLabel}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {settings.weeks} weeks
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {settings.hoursPerWeek} hrs/week
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {materials.length} materials
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {plan.conceptGraph?.length ?? 0} concepts
            </Badge>
            {plan.selectedPathId && plan.learningPaths && (
              <Badge variant="secondary" className="text-xs">
                Path:{" "}
                {plan.learningPaths.find((p) => p.id === plan.selectedPathId)?.name ??
                  plan.selectedPathId}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Mobile tabs */}
        <div className="lg:hidden">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="schedule" className="text-xs">
                <Calendar className="h-3 w-3 mr-1" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="outcomes" className="text-xs">
                <Target className="h-3 w-3 mr-1" />
                Outcomes
              </TabsTrigger>
              <TabsTrigger value="materials" className="text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Materials
              </TabsTrigger>
            </TabsList>
            <TabsContent value="schedule" className="h-[600px]">
              <WeekSchedule weeks={plan.weeks} />
            </TabsContent>
            <TabsContent value="outcomes" className="h-[600px]">
              <OutcomesTracker outcomes={plan.outcomeCoverage ?? []} />
            </TabsContent>
            <TabsContent value="materials" className="h-[600px]">
              <MaterialsPanel materials={materials} weeks={plan.weeks} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop 2-panel */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-240px)]">
          <div className="col-span-8">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-medium text-foreground">Weekly Schedule</h2>
            </div>
            <div className="h-[calc(100%-32px)]">
              <WeekSchedule weeks={plan.weeks} />
            </div>
          </div>
          <div className="col-span-4">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="grid w-full grid-cols-2 mb-3">
                <TabsTrigger value="outcomes" className="text-xs">
                  <Target className="h-3 w-3 mr-1" />
                  Outcomes
                </TabsTrigger>
                <TabsTrigger value="materials" className="text-xs">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Materials
                </TabsTrigger>
              </TabsList>
              <TabsContent value="outcomes" className="h-[calc(100%-40px)] mt-0">
                <OutcomesTracker outcomes={plan.outcomeCoverage ?? []} />
              </TabsContent>
              <TabsContent value="materials" className="h-[calc(100%-40px)] mt-0">
                <MaterialsPanel materials={materials} weeks={plan.weeks} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}

function Header({ action }: { action?: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <GraduationCap className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-foreground text-lg">Course Designer</span>
        </Link>
        {action}
      </div>
    </header>
  )
}
