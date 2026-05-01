"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowRight, Plus, BookOpen } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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

            <Link href="/docs" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Docs
            </Link>
          </nav>
          <div className="flex items-center gap-3">

            <Button asChild size="sm">
              <Link href="/new">
                <Plus className="mr-2 h-4 w-4" />
                Start a course
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
            <BookOpen className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground">For instructors</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
            Design coherent courses from the papers and chapters you actually want to teach.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
            Upload your reading list. Get a prerequisite-aware schedule, anchored problem sets, and gap warnings — re-paced as your cohort progresses.
          </p>
          
          <div className="flex flex-col items-center justify-center gap-4">
            <Button 
              asChild
              size="lg" 
              className="min-w-[200px] h-12 text-base font-medium"
            >
              <Link href="/new">
                Start a course
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
              or see a sample course
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
