import type {
  CourseSettings,
  CourseMaterial,
  CoursePlan,
  Concept,
  CourseWeek,
  OutcomeCoverage,
  GapWarning,
  SampleCourse,
  OutlineWeek,
  CourseOutline,
  ProblemSet,
  Question,
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
  // Foundational Papers
  {
    id: "mat-1",
    name: "Scaling Distributed ML with System Relaxations (Li et al., 2014).pdf",
    size: "2.4 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["parameter servers", "synchronous SGD", "asynchronous SGD", "staleness", "bounded staleness"],
  },
  {
    id: "mat-2",
    name: "Horovod: Fast and Easy Distributed Deep Learning (Sergeev & Del Balso, 2018).pdf",
    size: "1.2 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["ring all-reduce", "gradient aggregation", "MPI", "tensor fusion", "collective operations"],
  },
  {
    id: "mat-3",
    name: "PyTorch Distributed: Experiences on Accelerating Data Parallel Training.pdf",
    size: "1.8 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["data parallelism", "DDP", "gradient bucketing", "communication overlap"],
  },
  // Pipeline & Model Parallelism
  {
    id: "mat-4",
    name: "GPipe: Efficient Training of Giant Neural Networks (Huang et al., 2019).pdf",
    size: "1.5 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["pipeline parallelism", "micro-batching", "activation recomputation", "bubble overhead"],
  },
  {
    id: "mat-5",
    name: "PipeDream: Generalized Pipeline Parallelism (Narayanan et al., 2019).pdf",
    size: "1.7 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["1F1B scheduling", "weight stashing", "pipeline flush", "asynchronous pipelines"],
  },
  {
    id: "mat-6",
    name: "Megatron-LM: Training Multi-Billion Parameter Models (Shoeybi et al., 2019).pdf",
    size: "1.5 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["tensor parallelism", "3D parallelism", "sequence parallelism", "model sharding"],
  },
  // Memory Optimization
  {
    id: "mat-7",
    name: "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al., 2020).pdf",
    size: "1.9 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["ZeRO stages", "optimizer state partitioning", "gradient partitioning", "parameter partitioning"],
  },
  {
    id: "mat-8",
    name: "DeepSpeed: System Optimizations Enable Training Deep Learning Models with Over 100 Billion Parameters.pdf",
    size: "2.1 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["ZeRO-Offload", "ZeRO-Infinity", "NVMe offloading", "CPU offloading"],
  },
  // Attention & Memory Efficient Training
  {
    id: "mat-9",
    name: "FlashAttention: Fast and Memory-Efficient Exact Attention (Dao et al., 2022).pdf",
    size: "1.3 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["IO-aware attention", "tiling", "kernel fusion", "memory hierarchy optimization"],
  },
  {
    id: "mat-10",
    name: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning.pdf",
    size: "980 KB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["sequence parallelism", "work partitioning", "forward pass optimization"],
  },
  // Model Serving
  {
    id: "mat-11",
    name: "Orca: A Distributed Serving System for Transformer-Based Generative Models (Yu et al., 2022).pdf",
    size: "1.6 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["continuous batching", "iteration-level scheduling", "selective batching"],
  },
  {
    id: "mat-12",
    name: "vLLM: Efficient Memory Management for Large Language Model Serving (Kwon et al., 2023).pdf",
    size: "1.4 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["PagedAttention", "KV cache management", "memory fragmentation", "copy-on-write"],
  },
  {
    id: "mat-13",
    name: "AlpaServe: Statistical Multiplexing with Model Parallelism for Deep Learning Serving.pdf",
    size: "1.5 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["statistical multiplexing", "model placement", "auto-parallelization", "SLO management"],
  },
  // Inference Optimization
  {
    id: "mat-14",
    name: "DeepSpeed-Inference: Enabling Efficient Inference of Transformer Models at Unprecedented Scale.pdf",
    size: "1.8 MB",
    status: "complete",
    tag: "core",
    extractedConcepts: ["inference optimization", "kernel injection", "tensor slicing", "heterogeneous inference"],
  },
  // Textbook Chapters
  {
    id: "mat-15",
    name: "MLSys Textbook - Ch. 3: Distributed Training Fundamentals.pdf",
    size: "3.2 MB",
    status: "complete",
    tag: "reference",
    extractedConcepts: ["distributed training", "communication primitives", "scaling laws", "batch size effects"],
  },
  {
    id: "mat-16",
    name: "MLSys Textbook - Ch. 7: Model Serving Systems.pdf",
    size: "2.8 MB",
    status: "complete",
    tag: "reference",
    extractedConcepts: ["serving systems", "batching", "latency optimization", "throughput", "SLA management"],
  },
]

// Expanded concept graph for ML Systems course
export const sampleConcepts: Concept[] = [
  // Week 1 - Foundations
  { id: "c1", name: "Distributed Training Basics", weekIntroduced: 1, dependencies: [], coveredBy: ["mat-15", "mat-3"] },
  { id: "c2", name: "Data Parallelism", weekIntroduced: 1, dependencies: ["c1"], coveredBy: ["mat-3"] },
  { id: "c3", name: "Gradient Bucketing", weekIntroduced: 1, dependencies: ["c2"], coveredBy: ["mat-3"] },
  
  // Week 2 - Communication Patterns
  { id: "c4", name: "Ring All-Reduce", weekIntroduced: 2, dependencies: ["c2"], coveredBy: ["mat-2"] },
  { id: "c5", name: "Parameter Servers", weekIntroduced: 2, dependencies: ["c1"], coveredBy: ["mat-1"] },
  { id: "c6", name: "Collective Operations", weekIntroduced: 2, dependencies: ["c4"], coveredBy: ["mat-2"] },
  
  // Week 3 - Sync/Async Training
  { id: "c7", name: "Synchronous SGD", weekIntroduced: 3, dependencies: ["c5"], coveredBy: ["mat-1"] },
  { id: "c8", name: "Asynchronous SGD", weekIntroduced: 3, dependencies: ["c7"], coveredBy: ["mat-1"] },
  { id: "c9", name: "Communication Overlap", weekIntroduced: 3, dependencies: ["c3"], coveredBy: ["mat-3"] },
  
  // Week 4 - Pipeline Parallelism
  { id: "c10", name: "Pipeline Parallelism", weekIntroduced: 4, dependencies: ["c2"], coveredBy: ["mat-4", "mat-5"] },
  { id: "c11", name: "Micro-batching", weekIntroduced: 4, dependencies: ["c10"], coveredBy: ["mat-4"] },
  { id: "c12", name: "1F1B Scheduling", weekIntroduced: 4, dependencies: ["c10"], coveredBy: ["mat-5"] },
  
  // Week 5 - Tensor Parallelism & Memory
  { id: "c13", name: "Tensor Parallelism", weekIntroduced: 5, dependencies: ["c10"], coveredBy: ["mat-6"] },
  { id: "c14", name: "3D Parallelism", weekIntroduced: 5, dependencies: ["c2", "c10", "c13"], coveredBy: ["mat-6"] },
  { id: "c15", name: "Memory Analysis", weekIntroduced: 5, dependencies: [], coveredBy: ["mat-7"] },
  
  // Week 6 - ZeRO
  { id: "c16", name: "ZeRO Stages", weekIntroduced: 6, dependencies: ["c15"], coveredBy: ["mat-7"] },
  { id: "c17", name: "Optimizer State Partitioning", weekIntroduced: 6, dependencies: ["c16"], coveredBy: ["mat-7"] },
  { id: "c18", name: "CPU/NVMe Offloading", weekIntroduced: 6, dependencies: ["c16"], coveredBy: ["mat-8"] },
  
  // Week 8 - FlashAttention
  { id: "c19", name: "IO-Aware Algorithms", weekIntroduced: 8, dependencies: [], coveredBy: ["mat-9"] },
  { id: "c20", name: "Kernel Fusion", weekIntroduced: 8, dependencies: ["c19"], coveredBy: ["mat-9"] },
  { id: "c21", name: "Tiling", weekIntroduced: 8, dependencies: ["c19"], coveredBy: ["mat-9", "mat-10"] },
  
  // Week 9 - Model Serving
  { id: "c22", name: "Model Serving", weekIntroduced: 9, dependencies: [], coveredBy: ["mat-16"] },
  { id: "c23", name: "Continuous Batching", weekIntroduced: 9, dependencies: ["c22"], coveredBy: ["mat-11"] },
  { id: "c24", name: "Iteration-Level Scheduling", weekIntroduced: 9, dependencies: ["c23"], coveredBy: ["mat-11"] },
  
  // Week 10 - Advanced Serving
  { id: "c25", name: "PagedAttention", weekIntroduced: 10, dependencies: ["c23"], coveredBy: ["mat-12"] },
  { id: "c26", name: "KV Cache Management", weekIntroduced: 10, dependencies: ["c25"], coveredBy: ["mat-12"] },
  { id: "c27", name: "Statistical Multiplexing", weekIntroduced: 10, dependencies: ["c22"], coveredBy: ["mat-13"] },
  
  // Week 11 - Inference Optimization
  { id: "c28", name: "Inference Optimization", weekIntroduced: 11, dependencies: ["c22"], coveredBy: ["mat-14"] },
  { id: "c29", name: "Quantization", weekIntroduced: 11, dependencies: ["c28"], coveredBy: ["mat-16"] },
  { id: "c30", name: "SLA Management", weekIntroduced: 11, dependencies: ["c28"], coveredBy: ["mat-16"] },
]

export const sampleWeeks: CourseWeek[] = [
  {
    week: 1,
    readings: [
      { materialId: "mat-15", materialName: "MLSys Textbook - Ch. 3: Distributed Training Fundamentals.pdf", pageRange: "1-25", sectionAnchors: ["Introduction", "Communication Primitives"] },
      { materialId: "mat-3", materialName: "PyTorch Distributed: Experiences on Accelerating Data Parallel Training.pdf", pageRange: "1-8", sectionAnchors: ["Introduction", "System Design"] },
    ],
    conceptsIntroduced: ["Distributed Training Basics", "Data Parallelism", "Gradient Bucketing"],
    inClassFocus: "Motivate distributed training with scale examples. Compare single-GPU vs multi-GPU training. PyTorch DDP architecture.",
    discussionQuestions: [
      "What are the main bottlenecks when training on a single GPU?",
      "How does data parallelism differ from model parallelism conceptually?",
      "Why does PyTorch use gradient bucketing?",
    ],
    estimatedHours: 4,
  },
  {
    week: 2,
    readings: [
      { materialId: "mat-2", materialName: "Horovod: Fast and Easy Distributed Deep Learning (Sergeev & Del Balso, 2018).pdf", sectionAnchors: ["Ring All-Reduce", "Implementation"] },
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations (Li et al., 2014).pdf", pageRange: "1-15", sectionAnchors: ["Parameter Server Architecture"] },
    ],
    conceptsIntroduced: ["Ring All-Reduce", "Parameter Servers", "Collective Operations"],
    inClassFocus: "Deep dive into gradient aggregation algorithms. Compare ring all-reduce (Horovod) vs parameter server approaches.",
    problemSet: [
      "Derive the bandwidth cost of naive all-reduce vs ring all-reduce for N workers",
      "Implement a simple gradient aggregation simulation",
    ],
    estimatedHours: 5,
  },
  {
    week: 3,
    readings: [
      { materialId: "mat-1", materialName: "Scaling Distributed ML with System Relaxations (Li et al., 2014).pdf", pageRange: "15-30", sectionAnchors: ["Synchronous SGD", "Asynchronous SGD"] },
      { materialId: "mat-3", materialName: "PyTorch Distributed: Experiences on Accelerating Data Parallel Training.pdf", pageRange: "8-15", sectionAnchors: ["Communication Overlap", "Performance"] },
    ],
    conceptsIntroduced: ["Synchronous SGD", "Asynchronous SGD", "Staleness", "Communication Overlap"],
    inClassFocus: "Sync vs async training. Staleness and convergence. Overlapping computation with communication.",
    discussionQuestions: [
      "What are the failure modes of a parameter server architecture?",
      "When would async training be preferred over sync training?",
    ],
    estimatedHours: 4,
  },
  {
    week: 4,
    readings: [
      { materialId: "mat-4", materialName: "GPipe: Efficient Training of Giant Neural Networks (Huang et al., 2019).pdf", sectionAnchors: ["Pipeline Parallelism", "Micro-batching"] },
      { materialId: "mat-5", materialName: "PipeDream: Generalized Pipeline Parallelism (Narayanan et al., 2019).pdf", sectionAnchors: ["1F1B Schedule", "Weight Stashing"] },
    ],
    conceptsIntroduced: ["Pipeline Parallelism", "Micro-batching", "1F1B Scheduling", "Bubble Overhead"],
    inClassFocus: "Pipeline parallelism deep dive. Compare GPipe synchronous approach vs PipeDream's asynchronous 1F1B schedule.",
    problemSet: [
      "Calculate bubble overhead for different pipeline depths and micro-batch counts",
      "Design a weight stashing strategy for a 4-stage pipeline",
    ],
    estimatedHours: 5,
  },
  {
    week: 5,
    readings: [
      { materialId: "mat-6", materialName: "Megatron-LM: Training Multi-Billion Parameter Models (Shoeybi et al., 2019).pdf", sectionAnchors: ["Tensor Parallelism", "3D Parallelism"] },
      { materialId: "mat-7", materialName: "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al., 2020).pdf", pageRange: "1-10", sectionAnchors: ["Memory Analysis"] },
    ],
    conceptsIntroduced: ["Tensor Parallelism", "3D Parallelism", "Memory Bottlenecks", "ZeRO Introduction"],
    inClassFocus: "Tensor parallelism in Megatron-LM. Memory analysis for large models. Introduction to ZeRO.",
    discussionQuestions: [
      "When would you choose tensor parallelism over pipeline parallelism?",
      "What are the communication patterns in tensor parallelism?",
    ],
    estimatedHours: 5,
  },
  {
    week: 6,
    readings: [
      { materialId: "mat-7", materialName: "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models (Rajbhandari et al., 2020).pdf", pageRange: "10-20", sectionAnchors: ["ZeRO Stages", "Implementation"] },
      { materialId: "mat-8", materialName: "DeepSpeed: System Optimizations Enable Training Deep Learning Models with Over 100 Billion Parameters.pdf", sectionAnchors: ["ZeRO-Offload", "ZeRO-Infinity"] },
    ],
    conceptsIntroduced: ["ZeRO Stages", "Optimizer State Partitioning", "CPU Offloading", "NVMe Offloading"],
    inClassFocus: "Deep dive into ZeRO-1/2/3. DeepSpeed's offloading strategies for extreme scale.",
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
      "How do you choose between data, pipeline, and tensor parallelism?",
    ],
    estimatedHours: 3,
  },
  {
    week: 8,
    readings: [
      { materialId: "mat-9", materialName: "FlashAttention: Fast and Memory-Efficient Exact Attention (Dao et al., 2022).pdf", sectionAnchors: ["IO-Aware Attention", "Tiling"] },
      { materialId: "mat-10", materialName: "FlashAttention-2: Faster Attention with Better Parallelism and Work Partitioning.pdf", sectionAnchors: ["Optimizations", "Benchmarks"] },
    ],
    conceptsIntroduced: ["IO-Aware Algorithms", "Kernel Fusion", "Memory Hierarchy Optimization", "Tiling"],
    inClassFocus: "Understanding FlashAttention's IO-aware approach. Why memory bandwidth matters more than FLOPs.",
    discussionQuestions: [
      "Why is standard attention memory-inefficient?",
      "How does tiling reduce memory access?",
    ],
    estimatedHours: 4,
  },
  {
    week: 9,
    readings: [
      { materialId: "mat-16", materialName: "MLSys Textbook - Ch. 7: Model Serving Systems.pdf", pageRange: "1-30", sectionAnchors: ["Serving Architecture", "Batching"] },
      { materialId: "mat-11", materialName: "Orca: A Distributed Serving System for Transformer-Based Generative Models (Yu et al., 2022).pdf", sectionAnchors: ["Continuous Batching", "Iteration-Level Scheduling"] },
    ],
    conceptsIntroduced: ["Model Serving", "Continuous Batching", "Iteration-Level Scheduling", "Dynamic Batching"],
    inClassFocus: "From training to serving. Orca's continuous batching breakthrough.",
    problemSet: [
      "Compare throughput of static batching vs continuous batching",
      "Design an iteration-level scheduler for mixed-length requests",
    ],
    estimatedHours: 5,
  },
  {
    week: 10,
    readings: [
      { materialId: "mat-12", materialName: "vLLM: Efficient Memory Management for Large Language Model Serving (Kwon et al., 2023).pdf", sectionAnchors: ["PagedAttention", "Memory Management"] },
      { materialId: "mat-13", materialName: "AlpaServe: Statistical Multiplexing with Model Parallelism for Deep Learning Serving.pdf", sectionAnchors: ["Model Placement", "Multiplexing"] },
    ],
    conceptsIntroduced: ["PagedAttention", "KV Cache Management", "Statistical Multiplexing", "Model Placement"],
    inClassFocus: "vLLM's PagedAttention for memory efficiency. AlpaServe's approach to multi-model serving.",
    discussionQuestions: [
      "How does PagedAttention solve memory fragmentation?",
      "When would statistical multiplexing improve efficiency?",
    ],
    estimatedHours: 5,
  },
  {
    week: 11,
    readings: [
      { materialId: "mat-14", materialName: "DeepSpeed-Inference: Enabling Efficient Inference of Transformer Models at Unprecedented Scale.pdf", sectionAnchors: ["Kernel Injection", "Tensor Slicing"] },
      { materialId: "mat-16", materialName: "MLSys Textbook - Ch. 7: Model Serving Systems.pdf", pageRange: "30-50", sectionAnchors: ["Latency Optimization", "Quantization"] },
    ],
    conceptsIntroduced: ["Inference Optimization", "Kernel Injection", "Quantization", "SLA Management"],
    inClassFocus: "DeepSpeed-Inference optimizations. Quantization and other inference optimizations.",
    problemSet: [
      "Measure the latency impact of INT8 quantization on a sample model",
      "Design a serving system that meets a 50ms P99 latency target",
    ],
    estimatedHours: 5,
  },
  {
    week: 12,
    readings: [],
    conceptsIntroduced: [],
    inClassFocus: "Project work session and office hours.",
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
    coveredInWeeks: [1, 2, 3, 4, 5, 6],
    coveredByReadings: ["mat-1", "mat-2", "mat-3", "mat-4", "mat-5", "mat-6", "mat-7", "mat-8"],
    isCovered: true,
  },
  {
    outcome: "Optimize model inference for production deployment",
    coveredInWeeks: [9, 10, 11],
    coveredByReadings: ["mat-11", "mat-12", "mat-13", "mat-14", "mat-16"],
    isCovered: true,
  },
  {
    outcome: "Understand tradeoffs in distributed training strategies",
    coveredInWeeks: [1, 2, 3, 4, 5, 6],
    coveredByReadings: ["mat-1", "mat-2", "mat-3", "mat-4", "mat-5", "mat-6", "mat-7", "mat-8", "mat-15"],
    isCovered: true,
  },
  {
    outcome: "Implement memory-efficient training for large models",
    coveredInWeeks: [5, 6, 8],
    coveredByReadings: ["mat-7", "mat-8", "mat-9", "mat-10"],
    isCovered: true,
  },
  {
    outcome: "Build efficient LLM serving systems",
    coveredInWeeks: [9, 10, 11],
    coveredByReadings: ["mat-11", "mat-12", "mat-13", "mat-14"],
    isCovered: true,
  },
]

// No gap warnings - course is properly sequenced
export const sampleGapWarnings: GapWarning[] = []

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

// Sample outline for ML Systems course
export const sampleOutlineWeeks: OutlineWeek[] = [
  { week: 1, topic: "Distributed Training Fundamentals", description: "Introduction to distributed ML, PyTorch DDP, data parallelism", pinnedMaterialIds: ["mat-15", "mat-3"] },
  { week: 2, topic: "Communication Patterns", description: "Ring all-reduce (Horovod), parameter servers, collective operations", pinnedMaterialIds: ["mat-2", "mat-1"] },
  { week: 3, topic: "Sync vs Async Training", description: "Synchronous/asynchronous SGD, staleness, communication overlap", pinnedMaterialIds: ["mat-1", "mat-3"] },
  { week: 4, topic: "Pipeline Parallelism", description: "GPipe, PipeDream, micro-batching, 1F1B scheduling", pinnedMaterialIds: ["mat-4", "mat-5"] },
  { week: 5, topic: "Tensor Parallelism & 3D Parallelism", description: "Megatron-LM, tensor parallelism, memory analysis", pinnedMaterialIds: ["mat-6", "mat-7"] },
  { week: 6, topic: "ZeRO & Memory Optimization", description: "ZeRO stages, DeepSpeed offloading, trillion-parameter training", pinnedMaterialIds: ["mat-7", "mat-8"] },
  { week: 7, topic: "Midterm Review", description: "Consolidation of distributed training concepts", pinnedMaterialIds: [] },
  { week: 8, topic: "FlashAttention", description: "IO-aware algorithms, kernel fusion, memory hierarchy optimization", pinnedMaterialIds: ["mat-9", "mat-10"] },
  { week: 9, topic: "Model Serving & Continuous Batching", description: "Orca's continuous batching, iteration-level scheduling", pinnedMaterialIds: ["mat-16", "mat-11"] },
  { week: 10, topic: "LLM Serving Systems", description: "vLLM PagedAttention, AlpaServe multiplexing, KV cache management", pinnedMaterialIds: ["mat-12", "mat-13"] },
  { week: 11, topic: "Inference Optimization", description: "DeepSpeed-Inference, quantization, SLA management", pinnedMaterialIds: ["mat-14", "mat-16"] },
  { week: 12, topic: "Project Work Session", description: "Office hours and project development time", pinnedMaterialIds: [] },
  { week: 13, topic: "Project Presentations (Part 1)", description: "Student project presentations and feedback", pinnedMaterialIds: [] },
  { week: 14, topic: "Project Presentations (Part 2) & Wrap-up", description: "Final presentations and course summary", pinnedMaterialIds: [] },
]

export const sampleOutline: CourseOutline = {
  weeks: sampleOutlineWeeks,
  generatedAt: new Date("2024-01-18"),
}

// Generate outline from materials
export async function generateOutline(
  materials: CourseMaterial[],
  settings: CourseSettings
): Promise<CourseOutline> {
  // Stub - in production this would call an LLM
  await new Promise((resolve) => setTimeout(resolve, 1500))
  
  return {
    weeks: sampleOutlineWeeks.slice(0, settings.weeks),
    generatedAt: new Date(),
  }
}

// Candidate pool for reading suggestions
export interface SuggestedReading {
  id: string
  name: string
  reason: string
  relevanceScore: number
  topics: string[]
}

// Map week numbers to suggested complementary readings
export const suggestedReadingsPool: Record<number, SuggestedReading[]> = {
  // Week 7 (Midterm) - suggest review papers
  7: [
    {
      id: "sug-7-1",
      name: "A Survey on Distributed Machine Learning (Verbraeken et al., 2020).pdf",
      reason: "Comprehensive survey covering all distributed training paradigms discussed so far",
      relevanceScore: 0.92,
      topics: ["distributed training", "data parallelism", "model parallelism"],
    },
    {
      id: "sug-7-2",
      name: "Efficient Large-Scale Language Model Training on GPU Clusters Using Megatron-LM.pdf",
      reason: "Practical case study combining techniques from weeks 1-6",
      relevanceScore: 0.88,
      topics: ["3D parallelism", "large-scale training"],
    },
  ],
  // Week 12 (Project work) - suggest recent papers
  12: [
    {
      id: "sug-12-1",
      name: "LoRA: Low-Rank Adaptation of Large Language Models (Hu et al., 2021).pdf",
      reason: "Efficient fine-tuning technique relevant to project work",
      relevanceScore: 0.85,
      topics: ["fine-tuning", "parameter efficiency"],
    },
    {
      id: "sug-12-2",
      name: "QLoRA: Efficient Finetuning of Quantized LLMs (Dettmers et al., 2023).pdf",
      reason: "Combines quantization with efficient fine-tuning",
      relevanceScore: 0.83,
      topics: ["quantization", "fine-tuning"],
    },
  ],
  // Week 13 (Presentations) - optional advanced readings
  13: [
    {
      id: "sug-13-1",
      name: "Scaling Laws for Neural Language Models (Kaplan et al., 2020).pdf",
      reason: "Foundational paper on scaling behavior",
      relevanceScore: 0.80,
      topics: ["scaling laws", "compute-optimal training"],
    },
  ],
  // Week 14 (Wrap-up) - future directions
  14: [
    {
      id: "sug-14-1",
      name: "Mixture of Experts Meets Instruction Tuning (Shen et al., 2023).pdf",
      reason: "Emerging approach combining MoE with instruction tuning",
      relevanceScore: 0.78,
      topics: ["mixture of experts", "instruction tuning"],
    },
  ],
}

// Get suggested readings for a week based on its current reading count
export function getSuggestedReadings(weekNum: number, currentReadingsCount: number): SuggestedReading[] {
  // If week has fewer than 2 readings, suggest additions
  if (currentReadingsCount < 2) {
    return suggestedReadingsPool[weekNum] || []
  }
  return []
}

// Sample problem sets for first 3 weeks
export const sampleProblemSets: Record<number, ProblemSet> = {
  1: {
    weekNumber: 1,
    topic: "Distributed Training Fundamentals",
    generatedAt: new Date("2024-01-20"),
    questions: [
      {
        id: "w1-q1",
        type: "mcq",
        stem: "What is the primary motivation for using distributed training in machine learning?",
        options: [
          { label: "A", text: "To reduce the cost of hardware" },
          { label: "B", text: "To train larger models that don't fit in single GPU memory and reduce training time" },
          { label: "C", text: "To improve model accuracy" },
          { label: "D", text: "To simplify the training code" },
        ],
        correctAnswer: "B",
        explanation: "Distributed training allows training of larger models by splitting across multiple GPUs and parallelizing computation to reduce wall-clock training time.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "1-5",
      },
      {
        id: "w1-q2",
        type: "mcq",
        stem: "In data parallelism, what is replicated across all workers?",
        options: [
          { label: "A", text: "The training data" },
          { label: "B", text: "The model parameters" },
          { label: "C", text: "The loss function only" },
          { label: "D", text: "The optimizer state only" },
        ],
        correctAnswer: "B",
        explanation: "In data parallelism, each worker maintains a complete copy of the model parameters and processes different mini-batches of data.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "6-10",
      },
      {
        id: "w1-q3",
        type: "mcq",
        stem: "Which of the following is NOT a benefit of data parallelism?",
        options: [
          { label: "A", text: "Linear scaling of throughput with number of workers" },
          { label: "B", text: "Reduced memory requirements per GPU" },
          { label: "C", text: "Ability to process larger batch sizes" },
          { label: "D", text: "Faster iteration through the dataset" },
        ],
        correctAnswer: "B",
        explanation: "Data parallelism does not reduce memory per GPU - each GPU still holds the full model. Model parallelism is needed for memory reduction.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "10-12",
      },
      {
        id: "w1-q4",
        type: "mcq",
        stem: "What happens to the effective batch size when using 8 GPUs with data parallelism?",
        options: [
          { label: "A", text: "It remains the same as single GPU" },
          { label: "B", text: "It becomes 8x the per-GPU batch size" },
          { label: "C", text: "It becomes 1/8 of the original" },
          { label: "D", text: "It depends on the model architecture" },
        ],
        correctAnswer: "B",
        explanation: "With data parallelism, each GPU processes its own mini-batch, so the effective global batch size is the sum of all per-GPU batches.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "12-14",
      },
      {
        id: "w1-q5",
        type: "mcq",
        stem: "Which statement about single-GPU training bottlenecks is correct?",
        options: [
          { label: "A", text: "Memory is never a concern with modern GPUs" },
          { label: "B", text: "Compute is the only bottleneck" },
          { label: "C", text: "Memory, compute, and time can all be bottlenecks depending on the model" },
          { label: "D", text: "Network bandwidth is the main bottleneck" },
        ],
        correctAnswer: "C",
        explanation: "Single-GPU training can be limited by GPU memory (model size), compute (throughput), or wall-clock time (training duration).",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "1-3",
      },
      {
        id: "w1-q6",
        type: "mcq",
        stem: "In the context of distributed training, what does 'scaling efficiency' measure?",
        options: [
          { label: "A", text: "The total cost of training" },
          { label: "B", text: "How close the speedup is to the ideal linear speedup" },
          { label: "C", text: "The size of the model" },
          { label: "D", text: "The accuracy of the final model" },
        ],
        correctAnswer: "B",
        explanation: "Scaling efficiency measures how effectively additional resources translate to speedup, with 100% meaning perfect linear scaling.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "14-15",
      },
      {
        id: "w1-q7",
        type: "mcq",
        stem: "What is the main overhead that reduces scaling efficiency in data parallel training?",
        options: [
          { label: "A", text: "Disk I/O" },
          { label: "B", text: "Gradient synchronization communication" },
          { label: "C", text: "Model initialization" },
          { label: "D", text: "Data preprocessing" },
        ],
        correctAnswer: "B",
        explanation: "The main overhead is the communication required to synchronize gradients across workers, which can become a bottleneck at scale.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "15-18",
      },
      {
        id: "w1-q8",
        type: "mcq",
        stem: "Which distributed training approach is most suitable for models that fit entirely in a single GPU's memory?",
        options: [
          { label: "A", text: "Model parallelism" },
          { label: "B", text: "Pipeline parallelism" },
          { label: "C", text: "Data parallelism" },
          { label: "D", text: "Tensor parallelism" },
        ],
        correctAnswer: "C",
        explanation: "Data parallelism is the simplest and most efficient approach when the model fits in memory, as it avoids the complexity of splitting the model.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "5-8",
      },
      {
        id: "w1-q9",
        type: "short-answer",
        stem: "Explain the tradeoff between batch size and learning rate when scaling to multiple GPUs with data parallelism.",
        rubricPoints: [
          "Larger effective batch size with more GPUs",
          "May need to scale learning rate (linear or sqrt scaling)",
          "Warmup period often needed to stabilize training",
          "Very large batches can hurt generalization",
        ],
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "12-15",
      },
      {
        id: "w1-q10",
        type: "short-answer",
        stem: "Compare and contrast data parallelism and model parallelism. When would you choose one over the other?",
        rubricPoints: [
          "Data parallelism: replicate model, split data",
          "Model parallelism: split model across devices",
          "Use data parallelism when model fits in memory",
          "Use model parallelism when model is too large",
          "Can combine both approaches for very large models",
        ],
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "5-10",
      },
    ],
  },
  2: {
    weekNumber: 2,
    topic: "Gradient Communication",
    generatedAt: new Date("2024-01-20"),
    questions: [
      {
        id: "w2-q1",
        type: "mcq",
        stem: "What is the purpose of gradient aggregation in distributed training?",
        options: [
          { label: "A", text: "To compress gradients for storage" },
          { label: "B", text: "To combine gradients from all workers to compute a consistent update" },
          { label: "C", text: "To discard outlier gradients" },
          { label: "D", text: "To normalize gradients for stability" },
        ],
        correctAnswer: "B",
        explanation: "Gradient aggregation combines gradients from all workers so each maintains consistent model weights after the update.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "15-18",
      },
      {
        id: "w2-q2",
        type: "mcq",
        stem: "In the all-reduce operation, what does each worker receive?",
        options: [
          { label: "A", text: "Only its own gradients" },
          { label: "B", text: "The sum (or average) of all workers' gradients" },
          { label: "C", text: "A random subset of gradients" },
          { label: "D", text: "The gradients from the master worker only" },
        ],
        correctAnswer: "B",
        explanation: "All-reduce distributes the aggregated result to all workers, so each receives the same combined gradient.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "18-22",
      },
      {
        id: "w2-q3",
        type: "mcq",
        stem: "What is the bandwidth cost of naive all-reduce with N workers and M parameters?",
        options: [
          { label: "A", text: "O(M)" },
          { label: "B", text: "O(N * M)" },
          { label: "C", text: "O(N^2 * M)" },
          { label: "D", text: "O(log(N) * M)" },
        ],
        correctAnswer: "C",
        explanation: "Naive all-reduce requires each worker to send to all others, resulting in O(N^2 * M) total bandwidth.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "20-25",
      },
      {
        id: "w2-q4",
        type: "mcq",
        stem: "Which collective operation gathers data from all processes to all processes?",
        options: [
          { label: "A", text: "Broadcast" },
          { label: "B", text: "Scatter" },
          { label: "C", text: "All-gather" },
          { label: "D", text: "Reduce" },
        ],
        correctAnswer: "C",
        explanation: "All-gather collects data from all processes and distributes the concatenated result to all processes.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "22-25",
      },
      {
        id: "w2-q5",
        type: "mcq",
        stem: "What is the key advantage of ring all-reduce over naive all-reduce?",
        options: [
          { label: "A", text: "It requires less memory" },
          { label: "B", text: "It achieves optimal bandwidth utilization regardless of cluster size" },
          { label: "C", text: "It doesn't require a network" },
          { label: "D", text: "It's faster for small clusters" },
        ],
        correctAnswer: "B",
        explanation: "Ring all-reduce achieves bandwidth-optimal communication by having each node send only 2(N-1)/N of the data total.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "25-30",
      },
      {
        id: "w2-q6",
        type: "mcq",
        stem: "How many phases does ring all-reduce have?",
        options: [
          { label: "A", text: "One phase" },
          { label: "B", text: "Two phases: scatter-reduce and all-gather" },
          { label: "C", text: "Three phases" },
          { label: "D", text: "N phases where N is the number of workers" },
        ],
        correctAnswer: "B",
        explanation: "Ring all-reduce consists of a scatter-reduce phase (partial sums) followed by an all-gather phase (distribution).",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "26-28",
      },
      {
        id: "w2-q7",
        type: "mcq",
        stem: "In ring all-reduce with 4 workers, how many steps does the scatter-reduce phase take?",
        options: [
          { label: "A", text: "2 steps" },
          { label: "B", text: "3 steps" },
          { label: "C", text: "4 steps" },
          { label: "D", text: "8 steps" },
        ],
        correctAnswer: "B",
        explanation: "Scatter-reduce takes N-1 steps where N is the number of workers, so 3 steps for 4 workers.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "27-29",
      },
      {
        id: "w2-q8",
        type: "mcq",
        stem: "What limits the scalability of ring all-reduce?",
        options: [
          { label: "A", text: "Memory per node" },
          { label: "B", text: "Latency increases with ring size (more hops)" },
          { label: "C", text: "Bandwidth per node" },
          { label: "D", text: "Compute per node" },
        ],
        correctAnswer: "B",
        explanation: "While bandwidth-optimal, ring all-reduce latency grows with N because messages must traverse more hops.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "29-30",
      },
      {
        id: "w2-q9",
        type: "short-answer",
        stem: "Derive the total data transferred per node in ring all-reduce and compare it to naive all-reduce.",
        rubricPoints: [
          "Ring: each node sends 2(N-1)M/N data total",
          "Naive: each node sends (N-1)M data",
          "Ring is bandwidth-optimal",
          "Clear mathematical derivation",
        ],
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "25-28",
      },
      {
        id: "w2-q10",
        type: "short-answer",
        stem: "Explain how gradient compression techniques can reduce communication overhead and what tradeoffs they introduce.",
        rubricPoints: [
          "Quantization reduces bits per value",
          "Sparsification sends only important gradients",
          "Tradeoff: compression overhead vs bandwidth savings",
          "Potential impact on convergence",
        ],
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "30-35",
      },
    ],
  },
  3: {
    weekNumber: 3,
    topic: "Parameter Servers & Ring All-Reduce",
    generatedAt: new Date("2024-01-20"),
    questions: [
      {
        id: "w3-q1",
        type: "mcq",
        stem: "In a parameter server architecture, where are the global model parameters stored?",
        options: [
          { label: "A", text: "On all worker nodes equally" },
          { label: "B", text: "On dedicated parameter server nodes" },
          { label: "C", text: "On the fastest worker" },
          { label: "D", text: "In distributed storage" },
        ],
        correctAnswer: "B",
        explanation: "Parameter servers maintain the authoritative copy of model parameters and coordinate updates from workers.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "1-5",
      },
      {
        id: "w3-q2",
        type: "mcq",
        stem: "What is a key advantage of parameter servers over all-reduce?",
        options: [
          { label: "A", text: "Lower latency" },
          { label: "B", text: "Better bandwidth utilization" },
          { label: "C", text: "Easier fault tolerance and ability to handle stragglers" },
          { label: "D", text: "Simpler implementation" },
        ],
        correctAnswer: "C",
        explanation: "Parameter servers can continue with partial updates, making them more resilient to worker failures and slow workers.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "5-10",
      },
      {
        id: "w3-q3",
        type: "mcq",
        stem: "What is the main bottleneck in parameter server architectures?",
        options: [
          { label: "A", text: "Worker compute" },
          { label: "B", text: "Parameter server network bandwidth" },
          { label: "C", text: "Disk I/O" },
          { label: "D", text: "Memory fragmentation" },
        ],
        correctAnswer: "B",
        explanation: "All gradients flow through the parameter server, making its network bandwidth a potential bottleneck at scale.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "8-12",
      },
      {
        id: "w3-q4",
        type: "mcq",
        stem: "How do parameter servers handle the bandwidth bottleneck?",
        options: [
          { label: "A", text: "By using faster networks" },
          { label: "B", text: "By sharding parameters across multiple servers" },
          { label: "C", text: "By reducing model size" },
          { label: "D", text: "By using smaller batches" },
        ],
        correctAnswer: "B",
        explanation: "Parameters are sharded across multiple server nodes to distribute the bandwidth load.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "10-15",
      },
      {
        id: "w3-q5",
        type: "mcq",
        stem: "In what scenario would you prefer ring all-reduce over parameter servers?",
        options: [
          { label: "A", text: "When you need fault tolerance" },
          { label: "B", text: "When workers have heterogeneous speeds" },
          { label: "C", text: "When you have homogeneous workers with fast interconnect" },
          { label: "D", text: "When training on CPUs" },
        ],
        correctAnswer: "C",
        explanation: "Ring all-reduce is more efficient when workers are similar and well-connected, as it has optimal bandwidth utilization.",
        sourceMaterial: "Data Parallel Training - Survey.pdf",
        sourcePages: "30-35",
      },
      {
        id: "w3-q6",
        type: "mcq",
        stem: "What does 'pull' and 'push' refer to in parameter server terminology?",
        options: [
          { label: "A", text: "Git operations" },
          { label: "B", text: "Workers fetch params (pull) and send gradients (push)" },
          { label: "C", text: "Data loading operations" },
          { label: "D", text: "Model checkpointing" },
        ],
        correctAnswer: "B",
        explanation: "Workers pull current parameters before forward pass and push computed gradients after backward pass.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "3-6",
      },
      {
        id: "w3-q7",
        type: "mcq",
        stem: "What is a hierarchical parameter server?",
        options: [
          { label: "A", text: "Servers organized by parameter importance" },
          { label: "B", text: "Multi-level aggregation to reduce cross-rack traffic" },
          { label: "C", text: "Servers with different hardware tiers" },
          { label: "D", text: "A backup server system" },
        ],
        correctAnswer: "B",
        explanation: "Hierarchical PS first aggregates within racks, then across racks, reducing expensive cross-rack communication.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "12-15",
      },
      {
        id: "w3-q8",
        type: "mcq",
        stem: "Which system first popularized the parameter server abstraction?",
        options: [
          { label: "A", text: "TensorFlow" },
          { label: "B", text: "PyTorch" },
          { label: "C", text: "DistBelief/Google Brain" },
          { label: "D", text: "MXNet" },
        ],
        correctAnswer: "C",
        explanation: "DistBelief, developed at Google Brain, popularized the parameter server architecture for large-scale deep learning.",
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "1-3",
      },
      {
        id: "w3-q9",
        type: "short-answer",
        stem: "Compare the failure modes and recovery strategies of parameter servers versus ring all-reduce.",
        rubricPoints: [
          "PS: server failure is catastrophic without replication",
          "PS: worker failure is recoverable",
          "Ring: any node failure breaks the ring",
          "Ring recovery requires reconfiguration",
          "Discussion of replication strategies",
        ],
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "15-20",
      },
      {
        id: "w3-q10",
        type: "short-answer",
        stem: "Design a hybrid system that combines parameter servers and ring all-reduce. When would each component be used?",
        rubricPoints: [
          "Use ring within fast-connected node groups",
          "Use PS for cross-group aggregation",
          "Consider network topology in design",
          "Discuss practical systems like BytePS",
        ],
        sourceMaterial: "Scaling Distributed ML with System Relaxations.pdf",
        sourcePages: "18-20",
      },
    ],
  },
}

// Generate problem set stub
export async function generateProblemSet(
  weekNumber: number,
  materials: string[],
  concepts: string[]
): Promise<ProblemSet> {
  // Stub - in production this would call an LLM
  await new Promise((resolve) => setTimeout(resolve, 2000))
  
  // Return mock data if available, otherwise generate placeholder
  if (sampleProblemSets[weekNumber]) {
    return sampleProblemSets[weekNumber]
  }
  
  return {
    weekNumber,
    topic: `Week ${weekNumber} Topics`,
    generatedAt: new Date(),
    questions: [
      {
        id: `w${weekNumber}-q1`,
        type: "mcq",
        stem: "Sample question for this week",
        options: [
          { label: "A", text: "Option A" },
          { label: "B", text: "Option B" },
          { label: "C", text: "Option C" },
          { label: "D", text: "Option D" },
        ],
        correctAnswer: "A",
        explanation: "This is a placeholder explanation.",
        sourceMaterial: "Sample Material.pdf",
      },
    ],
  }
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
