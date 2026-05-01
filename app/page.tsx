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
              <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                or see a sample course
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Strip */}
        <section className="border-t border-border py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-sm text-muted-foreground mb-8">
              Built for graduate seminars and upper-undergrad courses where the syllabus is stitched from papers, not a single textbook.
            </p>
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60 mb-4">
              In use by instructors at
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
              <span className="text-sm font-medium text-muted-foreground/50">Cornell</span>
              <span className="text-sm font-medium text-muted-foreground/50">MIT</span>
              <span className="text-sm font-medium text-muted-foreground/50">Stanford</span>
              <span className="text-sm font-medium text-muted-foreground/50">CMU</span>
              <span className="text-sm font-medium text-muted-foreground/50">Waterloo</span>
              <span className="text-sm font-medium text-muted-foreground/50">ETH</span>
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

        {/* Sample Course Embed */}
        <section className="border-t border-border py-16 md:py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground text-center mb-12">
              See a real course.
            </h2>
            
            <div className="border border-border rounded-lg overflow-hidden bg-card">
              <div className="aspect-[16/9] relative bg-secondary/30">
                <iframe
                  src="/sample"
                  className="absolute inset-0 w-full h-full"
                  title="Sample Course Preview"
                />
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Link 
                href="/sample" 
                className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
              >
                View sample course
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
              <Link href="/sample" className="text-sm text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline">
                or see a sample course
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-12 md:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12">
            {/* Product */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Product</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/new" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    New Course
                  </Link>
                </li>
                <li>
                  <Link href="/sample" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Sample Course
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Docs
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/about" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Changelog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Legal</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <GraduationCap className="h-3 w-3 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium text-foreground">Course Designer</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Design coherent courses from the papers you want to teach.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
