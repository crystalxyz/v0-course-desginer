"use client"

import { Button } from "@/components/ui/button"
import { GraduationCap, ArrowRight, Plus, BookOpen, Upload, ListOrdered, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
            <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Examples
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

      <main className="flex-1">
        {/* Hero */}
        <section className="py-24 md:py-32 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border mb-8">
              <BookOpen className="h-4 w-4 text-accent" />
              <span className="text-sm text-muted-foreground">For instructors</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6 text-balance">
              Design coherent courses from the papers and chapters you actually want to teach.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
              Upload your reading list. Get a prerequisite-aware schedule, anchored problem sets, and an agent that re-paces the course as your cohort progresses.
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
              <Link href="/sample?course=ml-systems" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                or see a sample ML Systems course
              </Link>
            </div>
          </div>
        </section>

        {/* Three-Step Summary */}
        <section className="border-t border-border py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-16">
              From a folder of PDFs to a 14-week course.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
              {/* Step 1 */}
              <div className="p-8 md:border-r md:border-border">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Upload className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    Upload your reading list
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Drop in chapters and papers. Concepts get extracted and mapped to your outcomes.
                  </p>
                </div>
              </div>
              
              {/* Step 2 */}
              <div className="p-8 md:border-r md:border-border border-t md:border-t-0 border-border">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <ListOrdered className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    Approve the outline
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Review the week-by-week topic sequence before details generate. Drag, reorder, or ask the agent.
                  </p>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="p-8 border-t md:border-t-0 border-border">
                <div className="flex flex-col items-center text-center">
                  <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="text-base font-medium text-foreground mb-2">
                    Generate, refine, re-pace
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Per-week readings, discussion prompts, and a 10-question problem set. Re-pace mid-semester from cohort signal.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Example Courses */}
        <section className="border-t border-border py-16 md:py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-3">
              See real examples.
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-10 max-w-xl mx-auto">
              Two pre-built courses, ready to browse end-to-end.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Link
                href="/sample?course=ml-systems"
                className="group block border border-border rounded-lg overflow-hidden bg-card hover:shadow-md hover:border-primary/40 transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-9 w-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-accent" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Graduate seminar
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">
                  Machine Learning Systems
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Built from 16 papers on distributed training, parallelism, memory optimization, and LLM serving. Includes a concept dependency graph and 6 alternative learning-path orderings.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">14 weeks</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">Graduate</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">30 concepts</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">6 paths</span>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                  View course <ArrowRight className="h-3 w-3" />
                </div>
              </Link>

              <Link
                href="/sample?course=calculus"
                className="group block border border-border rounded-lg overflow-hidden bg-card hover:shadow-md hover:border-primary/40 transition-all p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Intro undergrad
                  </span>
                </div>
                <h3 className="text-base font-semibold text-foreground mb-1.5">
                  Calculus I
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                  Built from an 8-chapter undergraduate calculus textbook. Limits, derivatives, integrals, differential equations, and series — sequenced with prerequisite-aware weekly readings.
                </p>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">14 weeks</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">Intro</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">8 chapters</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-foreground">10 paths</span>
                </div>
                <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                  View course <ArrowRight className="h-3 w-3" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-border py-16 md:py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
              What instructors are saying.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="border border-border rounded-lg p-8">
                <blockquote className="text-sm text-foreground mb-6 leading-relaxed">
                  &ldquo;I rebuild my reading list every fall. This is the first tool that actually understands the difference between a foundational paper and a survey, and orders them like a person would.&rdquo;
                </blockquote>
                <footer className="text-xs text-muted-foreground">
                  <span className="block">— Asst. Professor, CS</span>
                  <span className="block mt-0.5">Graduate ML Systems</span>
                </footer>
              </div>
              
              {/* Testimonial 2 */}
              <div className="border border-border rounded-lg p-8">
                <blockquote className="text-sm text-foreground mb-6 leading-relaxed">
                  &ldquo;The problem set generator is the killer feature. Ten grounded MCQs with the source page anchored on each one. I edit two or three and ship it.&rdquo;
                </blockquote>
                <footer className="text-xs text-muted-foreground">
                  <span className="block">— Lecturer, EECS</span>
                  <span className="block mt-0.5">Distributed Systems Seminar</span>
                </footer>
              </div>
              
              {/* Testimonial 3 */}
              <div className="border border-border rounded-lg p-8">
                <blockquote className="text-sm text-foreground mb-6 leading-relaxed">
                  &ldquo;Re-pacing actually works. After the midterm I told the agent the cohort struggled with attention math; it pushed FlashAttn back a week and inserted a primer. Two minutes.&rdquo;
                </blockquote>
                <footer className="text-xs text-muted-foreground">
                  <span className="block">— Visiting Prof, Stats</span>
                  <span className="block mt-0.5">Deep Learning Methods</span>
                </footer>
              </div>
            </div>
            
            <p className="text-[11px] text-muted-foreground/60 text-center mt-8">
              Representative feedback from pilot users.
            </p>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="border-t border-border py-16 md:py-24 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-8">
              Ready to plan your next course?
            </h2>
            
            <div className="flex flex-col items-center justify-center gap-4">
              <Button 
                asChild
                size="lg" 
                className="min-w-[180px] h-11 text-base font-medium"
              >
                <Link href="/new">
                  Start a course
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Link href="/sample?course=ml-systems" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                or see a sample ML Systems course
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-12">
            <Link href="/new" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
              New Course
            </Link>
            <Link href="/courses" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
              My Courses
            </Link>
            <Link href="/sample?course=ml-systems" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
              Example course
            </Link>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Course Designer</span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Design coherent courses from the papers you want to teach.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
