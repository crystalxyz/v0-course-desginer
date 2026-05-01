import type {
  CourseSettings,
  CourseMaterial,
  CoursePlan,
  Concept,
  CourseWeek,
  OutcomeCoverage,
  GapWarning,
  SampleCourse,
} from "./course-types"

// Sample ML Systems Course
export const sampleCourseSettings: CourseSettings = {
  id: "ml-systems-2024",
  title: "Machine Learning Systems",
  level: "grad",
  weeks: 14,
  hoursPerWeek: 3,
  studentBackground: "Students have completed undergraduate ML and have programming experience in Python. Familiarity with basic distributed systems concepts is helpful but not required.",
  prerequisiteTags: ["machine-learning", "python", "algorithms"],
  learningOutcomes: `1. Design and implement scalable ML training pipelines
2. Optimize model inference for production deployment
3. Understand tradeoffs in distributed training strategies
4. Apply MLOps best practices for model lifecycle management
5. Debug and profile ML system performance bottlenecks`,
  assessmentStyle: "mix",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
}

export const sampleMaterials: CourseMaterial[] = [
  {
    id: "mat-1",
    name: "Scaling Distributed ML with System Relaxations.pdf",
    size: "2.4 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["parameter servers", "synchronous SGD", "asynchronous SGD", "staleness", "bounded staleness"],
  },
  {
    id: "mat-2",
    name: "MLSys - Model Serving Chapter.pdf",
    size: "1.8 MB",
    status: "complete",
    tag: "core",
    pinnedWeek: 8,
    extractedConcepts: ["batching", "model serving", "latency optimization", "throughput", "dynamic batching", "SLA management"],
  },
  {
    id: "mat-3",
    name: "Data Parallel Training - Survey.pdf",
    size: "3.1 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["data parallelism", "gradient aggregation", "all-reduce", "ring all-reduce", "collective operations"],
  },
  {
    id: "mat-4",
    name: "ZeRO - Memory Optimizations.pdf",
    size: "890 KB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["memory optimization", "ZeRO", "model parallelism", "activation checkpointing", "gradient partitioning", "optimizer state partitioning"],
  },
  {
    id: "mat-5",
    name: "Feature Store Design Patterns.pdf",
    size: "1.2 MB",
    status: "complete",
    tag: "supplementary",
    extractedConcepts: ["feature stores", "feature engineering", "online features", "offline features", "feature versioning"],
  },
  {
    id: "mat-6",
    name: "ML Pipeline Orchestration.pdf",
    size: "950 KB",
    status: "complete",
    tag: "supplementary",
    extractedConcepts: ["DAG orchestration", "Airflow", "Kubeflow", "pipeline versioning", "artifact tracking"],
  },
  {
    id: "mat-7",
    name: "GPU Architecture Primer.pdf",
    size: "2.1 MB",
    status: "complete",
    tag: "reference",
    extractedConcepts: ["CUDA", "GPU memory hierarchy", "kernel optimization", "tensor cores", "memory coalescing"],
  },
  {
    id: "mat-8",
    name: "Megatron-LM: Training Multi-Billion Parameter Models.pdf",
    size: "1.5 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["tensor parallelism", "pipeline parallelism", "3D parallelism", "sequence parallelism"],
  },
  {
    id: "mat-9",
    name: "Model Compression Survey.pdf",
    size: "1.1 MB",
    status: "complete",
    tag: "supplementary",
    extractedConcepts: ["quantization", "pruning", "knowledge distillation", "INT8 inference"],
  },
]

// Expanded concept graph with 28 concepts for ML Systems course
export const sampleConcepts: Concept[] = [
  // Week 1 - Foundations
  { id: "c1", name: "Distributed Training Basics", weekIntroduced: 1, dependencies: [], coveredBy: ["mat-3"] },
  { id: "c2", name: "Data Parallelism", weekIntroduced: 1, dependencies: ["c1"], coveredBy: ["mat-3"] },
  
  // Week 2 - Gradient Communication
  { id: "c3", name: "Gradient Aggregation", weekIntroduced: 2, dependencies: ["c2"], coveredBy: ["mat-3"] },
  { id: "c4", name: "Collective Operations", weekIntroduced: 2, dependencies: ["c3"], coveredBy: ["mat-3"] },
  { id: "c5", name: "All-Reduce", weekIntroduced: 2, dependencies: ["c4"], coveredBy: ["mat-3"] },
  
  // Week 3 - Ring All-Reduce and Parameter Servers
  { id: "c6", name: "Ring All-Reduce", weekIntroduced: 3, dependencies: ["c5"], coveredBy: ["mat-3"] },
  { id: "c7", name: "Parameter Servers", weekIntroduced: 3, dependencies: ["c1"], coveredBy: ["mat-1"] },
  
  // Week 4 - Sync/Async Training
  { id: "c8", name: "Synchronous SGD", weekIntroduced: 4, dependencies: ["c3", "c7"], coveredBy: ["mat-1"] },
  { id: "c9", name: "Asynchronous SGD", weekIntroduced: 4, dependencies: ["c8"], coveredBy: ["mat-1"] },
  { id: "c10", name: "Staleness", weekIntroduced: 4, dependencies: ["c9"], coveredBy: ["mat-1"] },
  { id: "c11", name: "Bounded Staleness", weekIntroduced: 4, dependencies: ["c10"], coveredBy: ["mat-1"] },
  
  // Week 5 - Memory & Model Parallelism (GAP: GPU Memory assumed but not covered until later)
  { id: "c12", name: "Model Parallelism", weekIntroduced: 5, dependencies: ["c2"], coveredBy: ["mat-4"] },
  { id: "c13", name: "Memory Optimization", weekIntroduced: 5, dependencies: ["c12", "c27"], coveredBy: ["mat-4"] }, // c27 is GPU Memory - GAP
  { id: "c14", name: "Activation Checkpointing", weekIntroduced: 5, dependencies: ["c13"], coveredBy: ["mat-4"] },
  
  // Week 6 - ZeRO
  { id: "c15", name: "Gradient Partitioning", weekIntroduced: 6, dependencies: ["c13"], coveredBy: ["mat-4"] },
  { id: "c16", name: "Optimizer State Partitioning", weekIntroduced: 6, dependencies: ["c15"], coveredBy: ["mat-4"] },
  { id: "c17", name: "ZeRO Optimizer", weekIntroduced: 6, dependencies: ["c15", "c16"], coveredBy: ["mat-4"] },
  
  // Week 8 - Model Serving
  { id: "c18", name: "Model Serving", weekIntroduced: 8, dependencies: [], coveredBy: ["mat-2"] },
  { id: "c19", name: "Batching Strategies", weekIntroduced: 8, dependencies: ["c18"], coveredBy: ["mat-2"] },
  { id: "c20", name: "Dynamic Batching", weekIntroduced: 8, dependencies: ["c19"], coveredBy: ["mat-2"] },
  
  // Week 9 - Inference Optimization
  { id: "c21", name: "Latency Optimization", weekIntroduced: 9, dependencies: ["c20"], coveredBy: ["mat-2"] },
  { id: "c22", name: "SLA Management", weekIntroduced: 9, dependencies: ["c21"], coveredBy: ["mat-2"] },
  { id: "c23", name: "Quantization", weekIntroduced: 9, dependencies: ["c21"], coveredBy: ["mat-9"] },
  { id: "c24", name: "Knowledge Distillation", weekIntroduced: 9, dependencies: ["c23"], coveredBy: ["mat-9"] },
  
  // Week 10 - Feature Engineering
  { id: "c25", name: "Feature Engineering", weekIntroduced: 10, dependencies: [], coveredBy: ["mat-5"] },
  { id: "c26", name: "Feature Stores", weekIntroduced: 10, dependencies: ["c25"], coveredBy: ["mat-5"] },
  
  // Week 11 - Pipeline Orchestration
  { id: "c28", name: "Pipeline Orchestration", weekIntroduced: 11, dependencies: [], coveredBy: ["mat-6"] },
  { id: "c29", name: "Artifact Tracking", weekIntroduced: 11, dependencies: ["c28"], coveredBy: ["mat-6"] },
  
  // GPU Memory - introduced late (Week 12) but assumed in Week 5 - THIS IS A GAP
  { id: "c27", name: "GPU Memory Hierarchy", weekIntroduced: 12, dependencies: [], coveredBy: ["mat-7"], isGap: true },
  
  // Advanced topics (if GPU primer was moved earlier)
  { id: "c30", name: "Tensor Cores", weekIntroduced: 12, dependencies: ["c27"], coveredBy: ["mat-7"] },
]

export const sampleWeeks: CourseWeek[] = [
  {
    week: 1,
    readings: [
      { materialId: "mat-3", materialName: "Data Parallel Training - Survey.pdf", pageRange: "1-15", sectionAnchors: ["Introduction", "Background"] },
    ],
    conceptsIntroduced: ["Distributed Training Basics", "Data Parallelism"],
    inClassFocus: "Motivate distributed training with scale examples. Compare single-GPU vs multi-GPU training.",
    discussionQuestions: [
      "What are the main bottlenecks when training on a single GPU?",
      "How does data parallelism differ from model parallelism conceptually?",
    ],
    estimatedHours: 3,
  },
  {
    week: 2,
    readings: [
      { materialId: "mat-3", materialName: "Data Parallel Training - Survey.pdf", pageRange: "15-30", sectionAnchors: ["All-Reduce", "Ring All-Reduce"] },
    ],
    conceptsIntroduced: ["Gradient Aggregation", "Collective Operations", "All-Reduce"],
    inClassFocus: "Deep dive into gradient aggregation algorithms. Analyze ring all-reduce bandwidth efficiency.",
    problemSet: [
      "Derive the bandwidth cost of naive all-reduce vs ring all-reduce for N workers",
      "Implement a simple gradient aggregation simulation",
    ],
    estimatedHours: 4,
  },
  {
    week: 3,
    readings: [
      { materialId: "mat-3", materialName: "Data Parallel Training - Survey.pdf", pageRange: "30-45", sectionAnchors: ["Ring All-Reduce Implementation"] },
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations.pdf", pageRange: "1-20" },
    ],
    conceptsIntroduced: ["Ring All-Reduce", "Parameter Servers"],
    inClassFocus: "Parameter server architecture. Trade-offs between centralized and decentralized approaches.",
    discussionQuestions: [
      "What are the failure modes of a parameter server architecture?",
      "How does parameter server scale compared to all-reduce?",
    ],
    estimatedHours: 4,
  },
  {
    week: 4,
    readings: [
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations.pdf", pageRange: "20-40" },
    ],
    conceptsIntroduced: ["Synchronous SGD", "Asynchronous SGD", "Staleness", "Bounded Staleness"],
    inClassFocus: "Sync vs async training. Staleness and its effects on convergence.",
    problemSet: [
      "Analyze the convergence behavior under different staleness bounds",
      "Design a bounded-staleness protocol",
    ],
    estimatedHours: 5,
  },
  {
    week: 5,
    readings: [
      { materialId: "mat-4", materialName: "ZeRO - Memory Optimizations.pdf", pageRange: "1-15" },
    ],
    conceptsIntroduced: ["Model Parallelism", "Memory Optimization", "Activation Checkpointing"],
    inClassFocus: "Why memory is the bottleneck. Introduction to model parallelism strategies.",
    discussionQuestions: [
      "When would you choose model parallelism over data parallelism?",
      "What are the communication patterns in model parallelism?",
    ],
    estimatedHours: 4,
  },
  {
    week: 6,
    readings: [
      { materialId: "mat-4", materialName: "ZeRO - Memory Optimizations.pdf", pageRange: "15-30" },
    ],
    conceptsIntroduced: ["Gradient Partitioning", "Optimizer State Partitioning", "ZeRO Optimizer"],
    inClassFocus: "Deep dive into ZeRO stages. Memory vs communication trade-offs.",
    problemSet: [
      "Calculate memory savings for ZeRO-1, ZeRO-2, and ZeRO-3 for a given model",
      "Profile memory usage of a training run with and without ZeRO",
    ],
    estimatedHours: 5,
  },
  {
    week: 7,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Midterm review and project checkpoint discussions.",
    discussionQuestions: [
      "Compare the systems we have studied so far. What are the key design decisions?",
    ],
    estimatedHours: 3,
  },
  {
    week: 8,
    readings: [
      { materialId: "mat-2", materialName: "MLSys - Model Serving Chapter.pdf", pageRange: "1-25" },
    ],
    conceptsIntroduced: ["Model Serving", "Batching Strategies", "Dynamic Batching"],
    inClassFocus: "From training to serving. Batching for throughput vs latency.",
    discussionQuestions: [
      "How does serving latency SLA affect batching decisions?",
      "What are the differences between online and offline serving?",
    ],
    estimatedHours: 4,
  },
  {
    week: 9,
    readings: [
      { materialId: "mat-2", materialName: "MLSys - Model Serving Chapter.pdf", pageRange: "25-45" },
      { materialId: "mat-9", materialName: "Model Compression Survey.pdf", pageRange: "1-20" },
    ],
    conceptsIntroduced: ["Latency Optimization", "SLA Management", "Quantization", "Knowledge Distillation"],
    inClassFocus: "Optimization techniques for inference. Quantization, distillation, pruning.",
    problemSet: [
      "Measure the latency impact of INT8 quantization on a sample model",
      "Design a serving system that meets a 50ms P99 latency target",
    ],
    estimatedHours: 5,
  },
  {
    week: 10,
    readings: [
      { materialId: "mat-5", materialName: "Feature Store Design Patterns.pdf" },
    ],
    conceptsIntroduced: ["Feature Engineering", "Feature Stores"],
    inClassFocus: "Feature engineering at scale. Online vs offline feature serving.",
    discussionQuestions: [
      "What consistency guarantees do feature stores need?",
      "How do you handle feature drift in production?",
    ],
    estimatedHours: 3,
  },
  {
    week: 11,
    readings: [
      { materialId: "mat-6", materialName: "ML Pipeline Orchestration.pdf" },
    ],
    conceptsIntroduced: ["Pipeline Orchestration", "Artifact Tracking"],
    inClassFocus: "DAG-based orchestration. Reproducibility and versioning in ML pipelines.",
    problemSet: [
      "Design a pipeline DAG for a complete ML workflow",
      "Implement pipeline versioning and artifact tracking",
    ],
    estimatedHours: 4,
  },
  {
    week: 12,
    readings: [
      { materialId: "mat-7", materialName: "GPU Architecture Primer.pdf" },
    ],
    conceptsIntroduced: ["GPU Memory Hierarchy", "Tensor Cores"],
    inClassFocus: "GPU architecture deep dive. Understanding hardware for optimization.",
    estimatedHours: 3,
  },
  {
    week: 13,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project presentations (Part 1).",
    estimatedHours: 3,
  },
  {
    week: 14,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project presentations (Part 2) and course wrap-up.",
    estimatedHours: 3,
  },
]

export const sampleOutcomeCoverage: OutcomeCoverage[] = [
  {
    outcome: "Design and implement scalable ML training pipelines",
    coveredInWeeks: [1, 2, 3, 4, 5, 6, 11],
    coveredByReadings: ["mat-1", "mat-3", "mat-4", "mat-6"],
    isCovered: true,
  },
  {
    outcome: "Optimize model inference for production deployment",
    coveredInWeeks: [8, 9],
    coveredByReadings: ["mat-2", "mat-9"],
    isCovered: true,
  },
  {
    outcome: "Understand tradeoffs in distributed training strategies",
    coveredInWeeks: [1, 2, 3, 4, 5, 6],
    coveredByReadings: ["mat-1", "mat-3", "mat-4"],
    isCovered: true,
  },
  {
    outcome: "Apply MLOps best practices for model lifecycle management",
    coveredInWeeks: [10, 11],
    coveredByReadings: ["mat-5", "mat-6"],
    isCovered: true,
  },
  {
    outcome: "Debug and profile ML system performance bottlenecks",
    coveredInWeeks: [5, 6, 9, 12],
    coveredByReadings: ["mat-4", "mat-7", "mat-2"],
    isCovered: true,
  },
]

// Gap warnings - GPU Memory is assumed in Week 5 but not covered until Week 12
export const sampleGapWarnings: GapWarning[] = [
  {
    concept: "GPU Memory Hierarchy",
    assumedInWeek: 5,
    introducedInWeek: 12,
    assumedByMaterial: "ZeRO - Memory Optimizations.pdf",
    assumedByReading: "mat-4",
    dependentConcept: "Memory Optimization",
    suggestion: "Move GPU Architecture Primer to Week 4 or earlier.",
    suggestedFix: {
      type: "move-reading",
      fromWeek: 12,
      toWeek: 4,
      materialId: "mat-7",
    },
    alternativeFix: {
      type: "add-primer",
      week: 4,
      concept: "GPU Memory Basics",
      description: "Add a 30-minute primer on GPU memory hierarchy before introducing ZeRO.",
    },
  },
]

export const sampleCoursePlan: CoursePlan = {
  id: "plan-1",
  courseId: "ml-systems-2024",
  weeks: sampleWeeks,
  conceptGraph: sampleConcepts,
  outcomeCoverage: sampleOutcomeCoverage,
  gapWarnings: sampleGapWarnings,
  generatedAt: new Date("2024-01-20"),
}

export const sampleCourse: SampleCourse = {
  settings: sampleCourseSettings,
  materials: sampleMaterials,
  plan: sampleCoursePlan,
}

// Helper to generate a course plan from materials and settings
export async function generateCoursePlan(
  materials: CourseMaterial[],
  settings: CourseSettings
): Promise<CoursePlan> {
  // Stub - in production this would call an LLM
  // For now, return a modified version of the sample plan
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing
  
  return {
    ...sampleCoursePlan,
    id: `plan-${Date.now()}`,
    courseId: settings.id,
    generatedAt: new Date(),
  }
}

// Propose re-pacing based on cohort signals
export interface CohortSignalInput {
  topicScores: { concept: string; weekNumber: number; score: number }[]
  struggleFeedback: string
  paceSliders: { weekNumber: number; adjustment: number }[] // -1 = slower, 0 = hold, 1 = faster
}

export interface ScheduleChange {
  id: string
  type: "push-back" | "add-review" | "swap-reading" | "add-primer" | "remove"
  weekNumber: number
  description: string
  rationale: string
  originalValue?: string
  proposedValue?: string
  accepted: boolean
}

export interface RePacingProposal {
  originalWeeks: CourseWeek[]
  proposedWeeks: CourseWeek[]
  changes: ScheduleChange[]
}

export async function proposeRepacing(
  course: CoursePlan,
  signal: CohortSignalInput
): Promise<RePacingProposal> {
  // Simulate LLM processing
  await new Promise((resolve) => setTimeout(resolve, 2000))
  
  const changes: ScheduleChange[] = []
  const proposedWeeks = [...course.weeks.map(w => ({ ...w }))]
  
  // Find low-scoring topics (< 60%)
  const lowScores = signal.topicScores.filter(s => s.score < 60)
  lowScores.forEach((score, i) => {
    changes.push({
      id: `change-${i}`,
      type: "add-review",
      weekNumber: Math.min(score.weekNumber + 1, 14),
      description: `Add review session for ${score.concept}`,
      rationale: `${score.score}% of cohort scored below passing on ${score.concept} problem set`,
      originalValue: proposedWeeks[score.weekNumber]?.inClassFocus || "Normal lecture",
      proposedValue: `Review session: ${score.concept} fundamentals + practice problems`,
      accepted: true,
    })
  })
  
  // Analyze struggle feedback for specific concepts
  const feedback = signal.struggleFeedback.toLowerCase()
  if (feedback.includes("gradient") || feedback.includes("math")) {
    changes.push({
      id: `change-math-1`,
      type: "push-back",
      weekNumber: 5,
      description: "Push advanced optimization topics back by 1 week",
      rationale: "Multiple students reported struggling with mathematical prerequisites",
      originalValue: "Week 5: Model Parallelism & Memory Optimization",
      proposedValue: "Week 6: Model Parallelism & Memory Optimization",
      accepted: true,
    })
  }
  
  if (feedback.includes("fast") || feedback.includes("overwhelmed")) {
    changes.push({
      id: `change-pace-1`,
      type: "add-review",
      weekNumber: 7,
      description: "Convert Week 7 to comprehensive review week",
      rationale: "Cohort feedback indicates pacing is too fast",
      originalValue: "Midterm review",
      proposedValue: "Extended review: Weeks 1-6 concept consolidation with practice",
      accepted: true,
    })
  }
  
  // Default if no specific signals
  if (changes.length === 0) {
    changes.push({
      id: `change-default-1`,
      type: "add-review",
      weekNumber: 7,
      description: "Add mid-course checkpoint",
      rationale: "Standard mid-course review to consolidate learning",
      originalValue: "Continue with new material",
      proposedValue: "Review session covering weeks 1-6",
      accepted: true,
    })
  }
  
  return {
    originalWeeks: course.weeks,
    proposedWeeks,
    changes,
  }
}
