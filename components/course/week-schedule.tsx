"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  BookOpen,
  MessageSquare,
  FileQuestion,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Circle,
  Eye,
  RefreshCw,
  Sparkles,
  Plus,
  Lightbulb,
  Clock,
  Edit2,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { ProblemSetModal } from "./problem-set-modal"
import { sampleProblemSets, getSuggestedReadings, type SuggestedReading } from "@/lib/mock-course-data"
import type { CourseWeek, HoverState, ProblemSet, WeekReading } from "@/lib/course-types"

// Topic-keyed Bloom-style discussion prompts. Each bank has 9-12 prompts so
// repeated clicks of "Suggest 3" return fresh questions each time. The
// caller filters out any prompts already in the week's discussionQuestions
// before sampling.
const DISCUSSION_BANKS: { kw: string[]; prompts: string[] }[] = [
  { kw: ["limit", "continuity"], prompts: [
    "Where does the intuitive notion of a limit break down, and why do we need the formal ε-δ definition?",
    "Identify a real-world scenario where a function fails one of the three continuity conditions.",
    "How does L'Hôpital's Rule generalize the limit definition of the derivative?",
    "Construct a function with a removable discontinuity and one with an essential discontinuity. How do they differ in behavior?",
    "Why does the squeeze theorem work, and when is it the only tool that does?",
    "Explain why 'plugging in' fails for limits like sin(x)/x at x=0 — what's actually going on?",
    "Compare a piecewise-defined function's limit at a join point vs at an interior point.",
    "When are one-sided limits necessary, and when can you collapse to a two-sided limit?",
    "Why do continuity and differentiability not imply each other in both directions? Give an example.",
    "Sketch a function discontinuous at every rational and continuous at every irrational. Defend the construction.",
  ]},
  { kw: ["derivative", "differen", "tangent"], prompts: [
    "Why is the limit definition of the derivative more powerful than rules like the power rule?",
    "Compare how a physicist, an economist, and a biologist would interpret the same derivative value.",
    "Construct a function that is continuous everywhere but not differentiable at one point. Justify.",
    "When does the chain rule actually 'unwrap' nested operations, and when is it just bookkeeping?",
    "Explain implicit differentiation as if to a student who's only seen explicit y = f(x) so far.",
    "Why are the derivatives of sin(x) and cos(x) so symmetrically related? Where does the negative sign come from?",
    "Pick a real-world rate of change (heart rate, GDP growth, learning rate). What does its derivative tell you that the function alone doesn't?",
    "When would a numerical derivative beat an analytic one, and when does it become unreliable?",
    "Why is local linearity such a powerful idea outside of pure calculus?",
    "Tangent lines vs secant lines: when does each give a better answer and why?",
  ]},
  { kw: ["optim", "extrema", "curve sketching"], prompts: [
    "When is a local extremum not a global extremum? Describe the bookkeeping that prevents missing one.",
    "Pick a real-world optimization problem your students would care about — set up the constraint and objective.",
    "Why does the second derivative test sometimes fail, and what's the fallback?",
    "Compare optimization on a closed interval vs an open one. Where do students most often slip up?",
    "Why is the candidates test (critical points + endpoints) sufficient on a closed interval?",
    "How does concavity inform whether a tangent-line approximation over- or under-estimates?",
    "Explain why Lagrange multipliers feel like 'cheating' the first time, and where they actually come from.",
    "Curve sketching by hand vs by software — what does each force you to learn that the other hides?",
    "What's the role of inflection points in modeling — and why do students often miss them?",
  ]},
  { kw: ["kinematic", "motion"], prompts: [
    "Translate a physical motion problem into derivatives. Where does the chain rule sneak in?",
    "Why is acceleration the second derivative of position? What does that constrain about the motions we can write?",
    "When is average velocity equal to instantaneous velocity? What does the MVT promise?",
    "Compare velocity-time and position-time graphs — what information lives only in each?",
    "Why does antidifferentiation introduce a constant, and what does that mean for initial-value motion problems?",
    "Pick a sport (sprint start, basketball arc) and decompose the motion into derivatives.",
  ]},
  { kw: ["integral", "integration", "riemann", "ftc", "antideriv"], prompts: [
    "Explain how Riemann sums make the leap from finite arithmetic to continuous accumulation.",
    "Why is the Fundamental Theorem of Calculus considered the conceptual bridge of single-variable calculus?",
    "Sketch a definite integral problem where antiderivative methods fail and numerical methods are required.",
    "Compare integration by parts and substitution — what tells you which to reach for?",
    "Why does u-substitution feel like the chain rule in reverse? Where does the analogy break?",
    "When does a definite integral represent area, and when does it represent something else (work, displacement, total change)?",
    "Why are improper integrals 'improper'? When does the convergence question actually matter?",
    "Trapezoidal rule vs Simpson's rule — what error does each commit, and on what kinds of integrands?",
    "Explain the geometric meaning of the FTC: why is the area-so-far function differentiable?",
    "When is a closed-form antiderivative impossible, and how would you know without trying every trick?",
  ]},
  { kw: ["series", "sequence", "taylor", "power series"], prompts: [
    "When does a Taylor polynomial give a useful approximation, and when does it break down?",
    "Compare convergence diagnostics: ratio test vs comparison test — when does each shine?",
    "Construct a function whose Taylor series converges but converges to the wrong value.",
    "Why is the geometric series the foundation of so many other convergence arguments?",
    "Explain absolute vs conditional convergence to a student who's only seen positive-term series.",
    "When does the integral test give a clean answer, and when is it just shifting the work?",
    "Why does the radius of convergence exist for power series? What does it geometrically mean?",
    "Pick a transcendental function — explain why its Taylor expansion is or isn't analytic everywhere.",
    "Compare Maclaurin and Taylor series — when does it matter where you center?",
  ]},
  { kw: ["differential equation", " ode"], prompts: [
    "When is qualitative analysis (slope fields, equilibria) preferable to solving an ODE analytically?",
    "Pick a real-world quantity (population, drug concentration, charge) — model it with a separable ODE.",
    "Why might Euler's method fail catastrophically on a stiff ODE, and what's the practical fix?",
    "Compare exponential growth and logistic growth — what does the carrying capacity actually represent?",
    "When can you solve an ODE by separation, and when do you need an integrating factor?",
    "Why do initial conditions feel arbitrary at first but constrain solutions completely?",
    "Explain a slope field to a student who's never seen one. What does each tick mean?",
    "Compare numerical and analytic solutions: when do you trust each, and how do you reconcile disagreements?",
  ]},
  { kw: ["cross-cutting", "computational", "skills"], prompts: [
    "Which algebraic moves break down most often in your students' work? Where's the misconception?",
    "Pick a notation convention students stumble over (dy/dx vs y′ vs Df) — when does it matter?",
    "What's a problem where the wrong substitution choice doubles the work?",
    "When does dimensional analysis save you, and when is it irrelevant?",
    "Why does sign tracking through chain-rule problems trip up so many students?",
    "What's a habit from precalculus that actively hurts students learning calculus?",
  ]},
  { kw: ["distributed training", "parallel", "all-reduce", "parameter server"], prompts: [
    "Trace a single gradient through ring all-reduce vs a parameter server — where can each fail?",
    "When would you accept staleness in async SGD over the latency cost of synchronous training?",
    "Design a 4-node training setup; defend your choice of data vs pipeline vs tensor parallelism.",
    "Why does the bandwidth cost of all-reduce eventually flatten with N workers?",
    "Compare bulk-synchronous parallel vs asynchronous parallel for ML — what convergence guarantees does each give up?",
    "When does pipeline parallelism's bubble overhead make data parallelism the better choice?",
    "Why is gradient accumulation a poor man's data parallelism? When does it fail?",
    "Explain ZeRO stages 1, 2, 3 in terms of what they shard and what they cost.",
  ]},
  { kw: ["memory", "zero", "offload", "flashattention"], prompts: [
    "Estimate optimizer-state memory for a 7B model — when does ZeRO-3 actually pay off?",
    "Why does FlashAttention beat standard attention without changing the math?",
    "Trade off: NVMe offloading vs sharding. When is each the right move?",
    "Why is HBM bandwidth the bottleneck in modern GPU training, not FLOPs?",
    "Compare gradient checkpointing and activation recomputation — when do they differ?",
    "When would you reach for mixed precision, and when does it bite you?",
    "Why is KV cache memory the fastest-growing budget item in LLM inference?",
  ]},
  { kw: ["serving", "inference", "batching", "kv cache"], prompts: [
    "Compare static batching, dynamic batching, and continuous batching — what request distribution favors each?",
    "How does PagedAttention solve the KV-cache memory fragmentation problem?",
    "Design a serving system that meets a P99 latency SLA on mixed-length requests.",
    "When does speculative decoding pay off, and when does it just add latency?",
    "Why is throughput-vs-latency a fundamental trade-off in LLM serving?",
    "Compare model quantization strategies: INT8 vs INT4 vs FP8 — what breaks first?",
    "Explain iteration-level scheduling to someone who's only seen request-level batching.",
    "Why do GPU utilization metrics lie about LLM serving efficiency?",
  ]},
]

const GENERIC_PROMPTS = [
  "Compare two approaches students might take to this week's problem — when does each fail?",
  "Apply this week's concepts to a problem from another discipline. Where does the analogy break?",
  "What misconception do you expect students to bring into this topic? How would you surface it?",
  "Where would a graduate student in a different sub-field push back on this material?",
  "Pick a homework problem that looks routine but hides a subtle conceptual trap. Describe the trap.",
  "What would the same question look like in a teaching context with no whiteboard, only worksheets?",
  "Which idea from this week is most under-emphasized by standard textbooks? Why?",
  "Sketch how you'd assess understanding of this week's content with a single short-answer question.",
]

function pickDiscussionPrompts(
  topic: string,
  focus: string,
  exclude: string[] = []
): string[] {
  const hay = `${topic} ${focus}`.toLowerCase()
  const excludeSet = new Set(exclude)
  const matched = DISCUSSION_BANKS.find((b) => b.kw.some((k) => hay.includes(k)))
  const pool = matched ? matched.prompts : GENERIC_PROMPTS
  const fresh = pool.filter((p) => !excludeSet.has(p))
  // If the user has already collected most of a bank, reuse the bank
  // (skipping exclude is best-effort, not blocking).
  const sourceList = fresh.length >= 3 ? fresh : pool
  // Fisher-Yates random sample of 3 without replacement.
  const shuffled = [...sourceList]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, 3)
}

interface WeekScheduleProps {
  weeks: CourseWeek[]
  onUpdateWeek?: (weekNumber: number, updates: Partial<CourseWeek>) => void
  onWeekReorder?: (fromWeek: number, toWeek: number) => void
  onReadingMove?: (readingId: string, fromWeek: number, toWeek: number) => void
  hoverState?: HoverState
  onHoverChange?: (state: HoverState) => void
  selectedWeek?: number
  onWeekSelect?: (week: number) => void
  // Week numbers that just changed (e.g. after switching learning paths).
  // Rendered with a brief highlight ring + "Updated" pill.
  recentlyChangedWeeks?: Set<number>
}

// Load indicator dots (1-5)
function LoadIndicator({ hours }: { hours: number }) {
  const dots = Math.min(Math.max(Math.ceil(hours / 1.5), 1), 5)
  return (
    <div className="flex items-center gap-0.5" title={`~${hours} hours`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Circle
          key={i}
          className={cn(
            "h-1.5 w-1.5",
            i < dots ? "fill-primary text-primary" : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}

export function WeekSchedule({
  weeks,
  onUpdateWeek,
  onWeekReorder,
  onReadingMove,
  hoverState,
  onHoverChange,
  selectedWeek,
  onWeekSelect,
  recentlyChangedWeeks,
}: WeekScheduleProps) {
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1)
  const [editingWeek, setEditingWeek] = useState<number | null>(null)
  const [editValues, setEditValues] = useState<Partial<CourseWeek>>({})
  const [draggedReading, setDraggedReading] = useState<{ weekNum: number; index: number } | null>(null)
  const [dragOverWeek, setDragOverWeek] = useState<number | null>(null)
  
  // Problem set modal state
  const [problemSetModalOpen, setProblemSetModalOpen] = useState(false)
  const [selectedProblemSetWeek, setSelectedProblemSetWeek] = useState<number | null>(null)
  const [selectedProblemSet, setSelectedProblemSet] = useState<ProblemSet | null>(null)
  const [isLoadingProblemSet, setIsLoadingProblemSet] = useState(false)

  // Get problem set stats for a week
  const getProblemSetStats = (weekNum: number) => {
    const ps = sampleProblemSets[weekNum]
    if (!ps) return null
    
    const mcqCount = ps.questions.filter(q => q.type === "mcq").length
    const saCount = ps.questions.filter(q => q.type === "short-answer").length
    
    return {
      total: ps.questions.length,
      mcq: mcqCount,
      shortAnswer: saCount,
    }
  }

  const handleViewProblemSet = useCallback(async (weekNum: number, topic: string) => {
    setSelectedProblemSetWeek(weekNum)
    setProblemSetModalOpen(true)
    setIsLoadingProblemSet(true)
    
    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 500))
    
    const ps = sampleProblemSets[weekNum]
    setSelectedProblemSet(ps || null)
    setIsLoadingProblemSet(false)
  }, [])

  const handleRegenerateProblemSet = useCallback(async () => {
    if (!selectedProblemSetWeek) return
    
    setIsLoadingProblemSet(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // In production, this would call generateProblemSet
    const ps = sampleProblemSets[selectedProblemSetWeek]
    setSelectedProblemSet(ps || null)
    setIsLoadingProblemSet(false)
  }, [selectedProblemSetWeek])

  const startEditing = (week: CourseWeek) => {
    setEditingWeek(week.week)
    setEditValues({
      inClassFocus: week.inClassFocus,
      discussionQuestions: week.discussionQuestions,
    })
  }

  const cancelEditing = () => {
    setEditingWeek(null)
    setEditValues({})
  }

  const saveEditing = (weekNum: number) => {
    if (onUpdateWeek) {
      onUpdateWeek(weekNum, editValues)
    }
    setEditingWeek(null)
    setEditValues({})
  }

  const handleWeekClick = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum)
    onWeekSelect?.(weekNum)
  }

  const handleMouseEnter = (weekNum: number) => {
    onHoverChange?.({ type: "week", id: `week-${weekNum}`, weekNumber: weekNum })
  }

  const handleMouseLeave = () => {
    onHoverChange?.({ type: null, id: null })
  }

  // Drag and drop for readings
  const handleReadingDragStart = (e: React.DragEvent, weekNum: number, readingIndex: number) => {
    setDraggedReading({ weekNum, index: readingIndex })
    e.dataTransfer.effectAllowed = "move"
  }

  const handleWeekDragOver = (e: React.DragEvent, weekNum: number) => {
    e.preventDefault()
    if (draggedReading && draggedReading.weekNum !== weekNum) {
      setDragOverWeek(weekNum)
    }
  }

  const handleWeekDragLeave = () => {
    setDragOverWeek(null)
  }

  const handleWeekDrop = (e: React.DragEvent, targetWeek: number) => {
    e.preventDefault()
    if (draggedReading && onReadingMove) {
      const week = weeks.find(w => w.week === draggedReading.weekNum)
      const reading = week?.readings[draggedReading.index]
      if (reading) {
        onReadingMove(reading.materialId, draggedReading.weekNum, targetWeek)
      }
    }
    setDraggedReading(null)
    setDragOverWeek(null)
  }

  // Check if this week should be highlighted based on hover state
  const isWeekHighlighted = (weekNum: number) => {
    if (!hoverState || hoverState.type === null) return false
    if (hoverState.type === "material") {
      const week = weeks.find(w => w.week === weekNum)
      return week?.readings.some(r => r.materialId === hoverState.id) || false
    }
    if (hoverState.type === "concept") {
      return false
    }
    return false
  }

  const currentWeek = weeks.find(w => w.week === selectedProblemSetWeek)

  return (
    <>
      <div className="space-y-3 overflow-y-auto h-full pr-2">
        {weeks.map((week) => {
          const isExpanded = expandedWeek === week.week
          const isEditing = editingWeek === week.week
          const isHighlighted = isWeekHighlighted(week.week)
          const isSelected = selectedWeek === week.week
          const isDragOver = dragOverWeek === week.week
          const isRecentlyChanged = recentlyChangedWeeks?.has(week.week) ?? false
          const problemSetStats = getProblemSetStats(week.week)

          return (
            <Card
              key={week.week}
              className={cn(
                "border-border transition-all",
                isExpanded && "ring-1 ring-accent",
                isHighlighted && "ring-2 ring-primary/50 bg-primary/5",
                isSelected && "ring-2 ring-primary",
                isDragOver && "ring-2 ring-primary bg-primary/10",
                isRecentlyChanged && "ring-2 ring-amber-400 shadow-[0_0_0_4px_rgb(251_191_36/0.1)] animate-pulse"
              )}
              onMouseEnter={() => handleMouseEnter(week.week)}
              onMouseLeave={handleMouseLeave}
              onDragOver={(e) => handleWeekDragOver(e, week.week)}
              onDragLeave={handleWeekDragLeave}
              onDrop={(e) => handleWeekDrop(e, week.week)}
            >
              <CardHeader
                className="py-3 px-4 cursor-pointer"
                onClick={() => handleWeekClick(week.week)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {week.week}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm font-medium">Week {week.week}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {week.inClassFocus || "No focus set"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isRecentlyChanged && (
                      <Badge className="text-[10px] bg-amber-500/15 text-amber-700 border-amber-200 hover:bg-amber-500/15 gap-1">
                        <RefreshCw className="h-2.5 w-2.5" />
                        Updated
                      </Badge>
                    )}
                    {/* Load indicator */}
                    {week.estimatedHours && (
                      <LoadIndicator hours={week.estimatedHours} />
                    )}

                    {/* Reading count */}
                    {week.readings.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {week.readings.length}
                      </Badge>
                    )}
                    
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Collapsed state: show concept chips */}
                {!isExpanded && week.conceptsIntroduced.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2 ml-10">
                    {week.conceptsIntroduced.slice(0, 5).map((concept) => (
                      <Badge 
                        key={concept} 
                        variant="outline" 
                        className="text-[10px] bg-secondary/50"
                      >
                        {concept}
                      </Badge>
                    ))}
                    {week.conceptsIntroduced.length > 5 && (
                      <Badge variant="outline" className="text-[10px] bg-secondary/50">
                        +{week.conceptsIntroduced.length - 5}
                      </Badge>
                    )}
                  </div>
                )}
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 pb-4 px-4 space-y-4">
                  {/* Readings with drag handles */}
                  {week.readings.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" /> Readings ({week.readings.length} paper{week.readings.length !== 1 ? "s" : ""})
                      </p>
                      <div className="space-y-1.5">
                        {week.readings.map((reading, i) => (
                          <div
                            key={i}
                            draggable
                            onDragStart={(e) => handleReadingDragStart(e, week.week, i)}
                            className="text-xs bg-secondary/50 rounded-md p-2.5 border border-border cursor-grab active:cursor-grabbing flex items-start gap-2 group"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground/50 group-hover:text-muted-foreground flex-shrink-0 mt-0.5" />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-medium text-foreground">{reading.materialName}</p>
                                <Badge variant="outline" className="text-[9px] flex-shrink-0">
                                  Paper {i + 1}
                                </Badge>
                              </div>
                              {reading.pageRange && (
                                <p className="text-muted-foreground mt-0.5">Pages {reading.pageRange}</p>
                              )}
                              {reading.sectionAnchors && reading.sectionAnchors.length > 0 && (
                                <p className="text-muted-foreground">
                                  Sections: {reading.sectionAnchors.join(", ")}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Readings (shown when < 2 readings) */}
                  {(() => {
                    const suggestions = getSuggestedReadings(week.week, week.readings.length)
                    if (suggestions.length === 0) return null
                    
                    return (
                      <div className="bg-accent/5 border border-accent/20 rounded-lg p-3">
                        <p className="text-xs font-medium text-accent mb-2 flex items-center gap-1">
                          <Lightbulb className="h-3 w-3" />
                          Suggested additions
                        </p>
                        <div className="space-y-2">
                          {suggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="text-xs bg-background rounded-md p-2.5 border border-border"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-foreground">{suggestion.name}</p>
                                  <p className="text-muted-foreground mt-0.5">{suggestion.reason}</p>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    <Badge variant="outline" className="text-[9px] bg-accent/10 text-accent border-accent/30">
                                      {Math.round(suggestion.relevanceScore * 100)}% match
                                    </Badge>
                                    {suggestion.topics.slice(0, 2).map((topic) => (
                                      <Badge key={topic} variant="secondary" className="text-[9px]">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 text-xs flex-shrink-0"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!onUpdateWeek) return
                                    const exists = week.readings.some(
                                      (r) => r.materialId === suggestion.id
                                    )
                                    if (exists) {
                                      toast.info("Already in this week")
                                      return
                                    }
                                    const reading: WeekReading = {
                                      materialId: suggestion.id,
                                      materialName: suggestion.name,
                                    }
                                    onUpdateWeek(week.week, {
                                      readings: [...week.readings, reading],
                                    })
                                    toast.success(`Added to Week ${week.week}`, {
                                      description: suggestion.name,
                                    })
                                  }}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}

                  {/* Concepts */}
                  {week.conceptsIntroduced.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Concepts introduced</p>
                      <div className="flex flex-wrap gap-1">
                        {week.conceptsIntroduced.map((concept) => (
                          <Badge key={concept} variant="outline" className="text-[10px]">
                            {concept}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* In-class Focus */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">In-class focus</p>
                    {isEditing ? (
                      <Textarea
                        value={editValues.inClassFocus || ""}
                        onChange={(e) =>
                          setEditValues({ ...editValues, inClassFocus: e.target.value })
                        }
                        className="text-xs min-h-[60px]"
                      />
                    ) : (
                      <p className="text-xs text-foreground">{week.inClassFocus || "Not specified"}</p>
                    )}
                  </div>

                  {/* Discussion Questions */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" /> Discussion questions
                      </p>
                      {!isEditing && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px]"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (!onUpdateWeek) return
                            const existing = week.discussionQuestions ?? []
                            // Pass current prompts as exclude so each click
                            // pulls fresh ones from the bank.
                            const prompts = pickDiscussionPrompts(
                              week.conceptsIntroduced[0] ?? "",
                              week.inClassFocus ?? "",
                              existing
                            )
                            const merged = [
                              ...existing,
                              ...prompts.filter((p) => !existing.includes(p)),
                            ]
                            onUpdateWeek(week.week, { discussionQuestions: merged })
                            toast.success(`Added 3 discussion prompts to Week ${week.week}`)
                          }}
                        >
                          <Sparkles className="h-2.5 w-2.5 mr-1" />
                          Suggest 3
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <Textarea
                        value={editValues.discussionQuestions?.join("\n") || ""}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            discussionQuestions: e.target.value.split("\n").filter(Boolean),
                          })
                        }
                        placeholder="One question per line"
                        className="text-xs min-h-[80px]"
                      />
                    ) : week.discussionQuestions?.length ? (
                      <ul className="space-y-1">
                        {week.discussionQuestions.map((q, i) => (
                          <li key={i} className="text-xs text-foreground pl-3 border-l-2 border-border">
                            {q}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-muted-foreground">No discussion questions added</p>
                    )}
                  </div>

                  {/* Auto-generated Problem Set */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <FileQuestion className="h-3 w-3" /> Problem set
                    </p>
                    <div className="bg-muted/50 rounded-lg p-3 border border-border">
                      {problemSetStats ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-foreground font-medium">
                              {problemSetStats.total} questions
                            </span>
                            <Badge variant="outline" className="text-[10px]">
                              {problemSetStats.mcq} MCQ
                            </Badge>
                            <Badge variant="outline" className="text-[10px]">
                              {problemSetStats.shortAnswer} short answer
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-7 text-xs"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewProblemSet(week.week, week.inClassFocus)
                              }}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={async (e) => {
                                e.stopPropagation()
                                setSelectedProblemSetWeek(week.week)
                                setProblemSetModalOpen(true)
                                setIsLoadingProblemSet(true)
                                await new Promise((r) => setTimeout(r, 1500))
                                setSelectedProblemSet(sampleProblemSets[week.week] ?? null)
                                setIsLoadingProblemSet(false)
                                toast.success(`Regenerated problem set for Week ${week.week}`, {
                                  description: "Questions re-shuffled based on this week's focus.",
                                })
                              }}
                            >
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Regenerate
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            No problem set generated
                          </span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-7 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleViewProblemSet(week.week, week.inClassFocus)
                            }}
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Generate
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estimated Hours */}
                  {week.estimatedHours && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>~{week.estimatedHours} hours student time</span>
                    </div>
                  )}

                  {/* Edit Actions */}
                  <div className="flex justify-end gap-2 pt-2 border-t border-border">
                    {isEditing ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={cancelEditing}>
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveEditing(week.week)}>
                          <Check className="h-3 w-3 mr-1" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <Button variant="ghost" size="sm" onClick={() => startEditing(week)}>
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Problem Set Modal */}
      <ProblemSetModal
        open={problemSetModalOpen}
        onOpenChange={setProblemSetModalOpen}
        weekNumber={selectedProblemSetWeek || 0}
        topic={currentWeek?.inClassFocus || ""}
        problemSet={selectedProblemSet}
        isLoading={isLoadingProblemSet}
        onRegenerate={handleRegenerateProblemSet}
      />
    </>
  )
}
