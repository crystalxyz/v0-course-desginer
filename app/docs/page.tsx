"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  GraduationCap,
  ArrowLeft,
  BookOpen,
  Upload,
  Network,
  Calendar,
  Target,
  RefreshCw,
  Download,
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: <Upload className="h-5 w-5" />,
    title: "Materials Upload",
    description:
      "Upload PDFs of textbook chapters, research papers, and lecture notes. Tag each as core, supplementary, or reference reading.",
  },
  {
    icon: <Network className="h-5 w-5" />,
    title: "Concept Graph",
    description:
      "Automatic extraction of concepts and their dependencies. Visualize the prerequisite structure of your course materials.",
  },
  {
    icon: <Calendar className="h-5 w-5" />,
    title: "Schedule Generation",
    description:
      "Get a week-by-week schedule with readings, concepts, in-class focus, and auto-generated problem sets tied to specific sections.",
  },
  {
    icon: <Target className="h-5 w-5" />,
    title: "Outcomes Tracking",
    description:
      "Map your stated learning outcomes to weeks and readings. Get flagged when outcomes are not covered by your materials.",
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: "Re-pacing",
    description:
      "After the course starts, enter cohort signals (assignment scores, struggle feedback) to get schedule adjustment recommendations.",
  },
  {
    icon: <Download className="h-5 w-5" />,
    title: "Export",
    description:
      "Export your course plan as Markdown, PDF, or Canvas-ready JSON. Share a public read-only link with TAs or colleagues.",
  },
]

export default function DocsPage() {
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
            <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Courses
            </Link>
            <Link href="/new" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              New Course
            </Link>
            <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Sample Course
            </Link>
            <Link href="/docs" className="text-sm text-foreground font-medium">
              Docs
            </Link>
          </nav>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-accent/10 mb-4">
              <BookOpen className="h-6 w-6 text-accent" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-3">Documentation</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Course Designer helps professors build coherent courses from heterogeneous materials
              with prerequisite-aware scheduling.
            </p>
          </div>

          {/* How it works */}
          <Card className="border-border mb-8">
            <CardHeader>
              <CardTitle>How it works</CardTitle>
              <CardDescription>Three steps to a coherent course plan</CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Set up your course</p>
                    <p className="text-sm text-muted-foreground">
                      Enter course title, level, duration, student background, learning outcomes,
                      and assessment style.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Upload your materials</p>
                    <p className="text-sm text-muted-foreground">
                      Add PDFs of your readings. Tag each as core, supplementary, or reference.
                      Optionally pin materials to specific weeks.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Get your course plan</p>
                    <p className="text-sm text-muted-foreground">
                      Review the generated schedule, concept graph, and outcomes coverage. Edit
                      inline, export, or share.
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* Features */}
          <h2 className="text-xl font-semibold text-foreground mb-4">Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-border">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-secondary text-muted-foreground">
                      {feature.icon}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{feature.title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/new">Get started</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
