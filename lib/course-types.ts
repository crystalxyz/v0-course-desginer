// Course Designer Types

export type CourseLevel = "grad" | "upper-ug" | "intro"
export type AssessmentStyle = "problem-sets" | "exams" | "projects" | "mix"
export type MaterialTag = "core" | "supplementary" | "reference"
export type MaterialStatus = "uploading" | "processing" | "complete" | "error"

export interface CourseSettings {
  id: string
  title: string
  level: CourseLevel
  weeks: number
  hoursPerWeek: number
  studentBackground: string
  prerequisiteTags: string[]
  learningOutcomes: string
  assessmentStyle: AssessmentStyle
  createdAt: Date
  updatedAt: Date
}

export interface CourseMaterial {
  id: string
  name: string
  size: string
  status: MaterialStatus
  tag: MaterialTag
  pinnedWeek?: number
  pinnedTopic?: string
  extractedConcepts?: string[]
  pageRanges?: string
}

export interface Concept {
  id: string
  name: string
  weekIntroduced?: number
  dependencies: string[]
  coveredBy: string[] // material IDs
  isGap?: boolean // true if assumed but never covered
  description?: string
}

export interface WeekReading {
  materialId: string
  materialName: string
  pageRange?: string
  sectionAnchors?: string[]
}

export interface CourseWeek {
  week: number
  readings: WeekReading[]
  conceptsIntroduced: string[]
  inClassFocus: string
  problemSet?: string[]
  discussionQuestions?: string[]
  estimatedHours?: number
}

export interface OutcomeCoverage {
  outcome: string
  coveredInWeeks: number[]
  coveredByReadings: string[]
  isCovered: boolean
}

export interface GapWarning {
  concept: string
  assumedInWeek: number
  introducedInWeek?: number
  assumedByMaterial: string
  assumedByReading?: string
  dependentConcept?: string
  suggestion?: string
  suggestedFix?: {
    type: "move-reading" | "add-primer" | "reorder-weeks"
    fromWeek?: number
    toWeek?: number
    materialId?: string
    concept?: string
    description?: string
  }
  alternativeFix?: {
    type: "move-reading" | "add-primer" | "reorder-weeks"
    week?: number
    concept?: string
    description?: string
  }
}

export interface CoursePlan {
  id: string
  courseId: string
  weeks: CourseWeek[]
  conceptGraph: Concept[]
  outcomeCoverage: OutcomeCoverage[]
  gapWarnings: GapWarning[]
  generatedAt: Date
}

export interface CohortSignal {
  type: "assignment-scores" | "struggle-feedback"
  topic?: string
  score?: number
  feedback?: string
  weekNumber: number
}

export interface ScheduleEdit {
  type: "push-back" | "add-review" | "swap-reading" | "remove" | "add-primer"
  weekNumber: number
  description: string
  originalValue?: string
  proposedValue?: string
}

export interface RePacingProposal {
  signals: CohortSignal[]
  proposedEdits: ScheduleEdit[]
  originalPlan: CoursePlan
  proposedPlan: CoursePlan
}

// Sample course data for the "See a sample course" CTA
export interface SampleCourse {
  settings: CourseSettings
  materials: CourseMaterial[]
  plan: CoursePlan
}

// Outline types for the intermediate step
export interface OutlineWeek {
  week: number
  topic: string
  description: string
  pinnedMaterialIds: string[]
}

export interface CourseOutline {
  weeks: OutlineWeek[]
  generatedAt: Date
}

// Problem set types
export type QuestionType = "mcq" | "short-answer"

export interface MCQQuestion {
  id: string
  type: "mcq"
  stem: string
  options: { label: string; text: string }[]
  correctAnswer: string // "A", "B", "C", or "D"
  explanation: string
  sourceMaterial: string
  sourcePages?: string
}

export interface ShortAnswerQuestion {
  id: string
  type: "short-answer"
  stem: string
  rubricPoints: string[]
  sourceMaterial: string
  sourcePages?: string
}

export type Question = MCQQuestion | ShortAnswerQuestion

export interface ProblemSet {
  weekNumber: number
  topic: string
  questions: Question[]
  generatedAt: Date
}

// Hover state for cross-panel highlighting
export interface HoverState {
  type: "material" | "concept" | "week" | null
  id: string | null
  weekNumber?: number
}
