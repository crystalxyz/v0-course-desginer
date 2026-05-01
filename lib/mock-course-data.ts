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
    extractedConcepts: ["parameter servers", "synchronous SGD", "asynchronous SGD", "staleness"],
  },
  {
    id: "mat-2",
    name: "MLSys - Model Serving Chapter.pdf",
    size: "1.8 MB",
    status: "complete",
    tag: "core",
    pinnedWeek: 8,
    extractedConcepts: ["batching", "model serving", "latency optimization", "throughput"],
  },
  {
    id: "mat-3",
    name: "Data Parallel Training - Survey.pdf",
    size: "3.1 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["data parallelism", "gradient aggregation", "all-reduce", "ring all-reduce"],
  },
  {
    id: "mat-4",
    name: "ZeRO - Memory Optimizations.pdf",
    size: "890 KB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["memory optimization", "ZeRO", "model parallelism", "activation checkpointing"],
  },
  {
    id: "mat-5",
    name: "Feature Store Design Patterns.pdf",
    size: "1.2 MB",
    status: "complete",
    tag: "supplementary",
    extractedConcepts: ["feature stores", "feature engineering", "online features", "offline features"],
  },
  {
    id: "mat-6",
    name: "ML Pipeline Orchestration.pdf",
    size: "950 KB",
    status: "complete",
    tag: "supplementary",
    extractedConcepts: ["DAG orchestration", "Airflow", "Kubeflow", "pipeline versioning"],
  },
  {
    id: "mat-7",
    name: "GPU Architecture Primer.pdf",
    size: "2.1 MB",
    status: "complete",
    tag: "reference",
    extractedConcepts: ["CUDA", "GPU memory hierarchy", "kernel optimization", "tensor cores"],
  },
]

export const sampleConcepts: Concept[] = [
  { id: "c1", name: "Distributed Training Basics", dependencies: [], coveredBy: ["mat-3"] },
  { id: "c2", name: "Data Parallelism", dependencies: ["c1"], coveredBy: ["mat-3"] },
  { id: "c3", name: "Gradient Aggregation", dependencies: ["c2"], coveredBy: ["mat-3"] },
  { id: "c4", name: "Parameter Servers", dependencies: ["c1"], coveredBy: ["mat-1"] },
  { id: "c5", name: "Synchronous SGD", dependencies: ["c3", "c4"], coveredBy: ["mat-1"] },
  { id: "c6", name: "Asynchronous SGD", dependencies: ["c5"], coveredBy: ["mat-1"] },
  { id: "c7", name: "Model Parallelism", dependencies: ["c2"], coveredBy: ["mat-4"] },
  { id: "c8", name: "Memory Optimization", dependencies: ["c7"], coveredBy: ["mat-4"] },
  { id: "c9", name: "ZeRO Optimizer", dependencies: ["c8"], coveredBy: ["mat-4"] },
  { id: "c10", name: "Model Serving", dependencies: [], coveredBy: ["mat-2"] },
  { id: "c11", name: "Batching Strategies", dependencies: ["c10"], coveredBy: ["mat-2"] },
  { id: "c12", name: "Latency Optimization", dependencies: ["c11"], coveredBy: ["mat-2"] },
  { id: "c13", name: "Feature Engineering", dependencies: [], coveredBy: ["mat-5"] },
  { id: "c14", name: "Feature Stores", dependencies: ["c13"], coveredBy: ["mat-5"] },
  { id: "c15", name: "Pipeline Orchestration", dependencies: [], coveredBy: ["mat-6"] },
  { id: "c16", name: "GPU Memory", dependencies: [], coveredBy: ["mat-7"], isGap: true },
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
  },
  {
    week: 2,
    readings: [
      { materialId: "mat-3", materialName: "Data Parallel Training - Survey.pdf", pageRange: "15-30", sectionAnchors: ["All-Reduce", "Ring All-Reduce"] },
    ],
    conceptsIntroduced: ["Gradient Aggregation"],
    inClassFocus: "Deep dive into gradient aggregation algorithms. Analyze ring all-reduce bandwidth efficiency.",
    problemSet: [
      "Derive the bandwidth cost of naive all-reduce vs ring all-reduce for N workers",
      "Implement a simple gradient aggregation simulation",
    ],
  },
  {
    week: 3,
    readings: [
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations.pdf", pageRange: "1-20" },
    ],
    conceptsIntroduced: ["Parameter Servers"],
    inClassFocus: "Parameter server architecture. Trade-offs between centralized and decentralized approaches.",
    discussionQuestions: [
      "What are the failure modes of a parameter server architecture?",
      "How does parameter server scale compared to all-reduce?",
    ],
  },
  {
    week: 4,
    readings: [
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations.pdf", pageRange: "20-40" },
    ],
    conceptsIntroduced: ["Synchronous SGD", "Asynchronous SGD"],
    inClassFocus: "Sync vs async training. Staleness and its effects on convergence.",
    problemSet: [
      "Analyze the convergence behavior under different staleness bounds",
      "Design a bounded-staleness protocol",
    ],
  },
  {
    week: 5,
    readings: [
      { materialId: "mat-4", materialName: "ZeRO - Memory Optimizations.pdf", pageRange: "1-15" },
      { materialId: "mat-7", materialName: "GPU Architecture Primer.pdf", pageRange: "1-10", sectionAnchors: ["Memory Hierarchy"] },
    ],
    conceptsIntroduced: ["Model Parallelism", "Memory Optimization"],
    inClassFocus: "Why memory is the bottleneck. Introduction to model parallelism strategies.",
    discussionQuestions: [
      "When would you choose model parallelism over data parallelism?",
      "What are the communication patterns in model parallelism?",
    ],
  },
  {
    week: 6,
    readings: [
      { materialId: "mat-4", materialName: "ZeRO - Memory Optimizations.pdf", pageRange: "15-30" },
    ],
    conceptsIntroduced: ["ZeRO Optimizer"],
    inClassFocus: "Deep dive into ZeRO stages. Memory vs communication trade-offs.",
    problemSet: [
      "Calculate memory savings for ZeRO-1, ZeRO-2, and ZeRO-3 for a given model",
      "Profile memory usage of a training run with and without ZeRO",
    ],
  },
  {
    week: 7,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Midterm review and project checkpoint discussions.",
    discussionQuestions: [
      "Compare the systems we have studied so far. What are the key design decisions?",
    ],
  },
  {
    week: 8,
    readings: [
      { materialId: "mat-2", materialName: "MLSys - Model Serving Chapter.pdf", pageRange: "1-25" },
    ],
    conceptsIntroduced: ["Model Serving", "Batching Strategies"],
    inClassFocus: "From training to serving. Batching for throughput vs latency.",
    discussionQuestions: [
      "How does serving latency SLA affect batching decisions?",
      "What are the differences between online and offline serving?",
    ],
  },
  {
    week: 9,
    readings: [
      { materialId: "mat-2", materialName: "MLSys - Model Serving Chapter.pdf", pageRange: "25-45" },
    ],
    conceptsIntroduced: ["Latency Optimization"],
    inClassFocus: "Optimization techniques for inference. Quantization, distillation, pruning.",
    problemSet: [
      "Measure the latency impact of INT8 quantization on a sample model",
      "Design a serving system that meets a 50ms P99 latency target",
    ],
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
  },
  {
    week: 11,
    readings: [
      { materialId: "mat-6", materialName: "ML Pipeline Orchestration.pdf" },
    ],
    conceptsIntroduced: ["Pipeline Orchestration"],
    inClassFocus: "DAG-based orchestration. Reproducibility and versioning in ML pipelines.",
    problemSet: [
      "Design a pipeline DAG for a complete ML workflow",
      "Implement pipeline versioning and artifact tracking",
    ],
  },
  {
    week: 12,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project work session and debugging clinic.",
  },
  {
    week: 13,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project presentations (Part 1).",
  },
  {
    week: 14,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project presentations (Part 2) and course wrap-up.",
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
    coveredByReadings: ["mat-2"],
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
    coveredInWeeks: [5, 6, 9],
    coveredByReadings: ["mat-4", "mat-7", "mat-2"],
    isCovered: true,
  },
]

export const sampleGapWarnings: GapWarning[] = [
  {
    concept: "GPU Memory Hierarchy",
    assumedInWeek: 5,
    assumedByMaterial: "ZeRO - Memory Optimizations.pdf",
    suggestion: "Consider adding GPU Architecture Primer as required reading in Week 4 or earlier.",
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
