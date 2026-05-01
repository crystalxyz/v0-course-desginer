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

// Sample outline for ML Systems course
export const sampleOutlineWeeks: OutlineWeek[] = [
  { week: 1, topic: "Distributed Training Fundamentals", description: "Introduction to distributed ML, data parallelism basics", pinnedMaterialIds: ["mat-3"] },
  { week: 2, topic: "Gradient Communication", description: "Gradient aggregation, collective operations, all-reduce patterns", pinnedMaterialIds: ["mat-3"] },
  { week: 3, topic: "Parameter Servers & Ring All-Reduce", description: "Centralized vs decentralized architectures, ring all-reduce implementation", pinnedMaterialIds: ["mat-1", "mat-3"] },
  { week: 4, topic: "Synchronous vs Asynchronous Training", description: "Sync/async SGD, staleness effects, bounded staleness protocols", pinnedMaterialIds: ["mat-1"] },
  { week: 5, topic: "Memory Optimization & Model Parallelism", description: "Memory bottlenecks, model parallelism strategies, activation checkpointing", pinnedMaterialIds: ["mat-4"] },
  { week: 6, topic: "ZeRO Optimizer Deep Dive", description: "ZeRO stages, gradient and optimizer state partitioning", pinnedMaterialIds: ["mat-4"] },
  { week: 7, topic: "Midterm Review", description: "Consolidation of distributed training concepts", pinnedMaterialIds: [] },
  { week: 8, topic: "Model Serving Fundamentals", description: "From training to serving, batching strategies", pinnedMaterialIds: ["mat-2"] },
  { week: 9, topic: "Inference Optimization", description: "Latency optimization, quantization, knowledge distillation", pinnedMaterialIds: ["mat-2", "mat-9"] },
  { week: 10, topic: "Feature Engineering at Scale", description: "Feature stores, online vs offline features", pinnedMaterialIds: ["mat-5"] },
  { week: 11, topic: "ML Pipeline Orchestration", description: "DAG orchestration, artifact tracking, reproducibility", pinnedMaterialIds: ["mat-6"] },
  { week: 12, topic: "GPU Architecture Deep Dive", description: "GPU memory hierarchy, tensor cores, kernel optimization", pinnedMaterialIds: ["mat-7"] },
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
