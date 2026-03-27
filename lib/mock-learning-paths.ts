import type { LearningWeek } from "@/components/lpo/learning-path-results"

// Knowledge Components that power the system (13 categories)
export const knowledgeComponents = [
  { id: "kc-1", name: "Linear Algebra", category: "foundation" },
  { id: "kc-2", name: "Probability", category: "foundation" },
  { id: "kc-3", name: "Gradient Descent", category: "optimization" },
  { id: "kc-4", name: "Loss Functions", category: "optimization" },
  { id: "kc-5", name: "Regression", category: "supervised" },
  { id: "kc-6", name: "Classification", category: "supervised" },
  { id: "kc-7", name: "Decision Boundary", category: "supervised" },
  { id: "kc-8", name: "Overfitting", category: "evaluation" },
  { id: "kc-9", name: "Regularization", category: "evaluation" },
  { id: "kc-10", name: "Bias-Variance", category: "evaluation" },
  { id: "kc-11", name: "Cross-Validation", category: "evaluation" },
  { id: "kc-12", name: "Ensemble Methods", category: "advanced" },
  { id: "kc-13", name: "Feature Engineering", category: "applied" },
]

// KC nodes for visualization (with level-based grouping)
export const kcNodes = [
  { id: "kc-1", label: "Linear Algebra", level: "foundations" },
  { id: "kc-2", label: "Probability", level: "foundations" },
  { id: "kc-3", label: "Statistics Basics", level: "foundations" },
  { id: "kc-4", label: "Gradient Descent", level: "core" },
  { id: "kc-5", label: "Loss Functions", level: "core" },
  { id: "kc-6", label: "Optimization", level: "core" },
  { id: "kc-7", label: "Regression", level: "supervised" },
  { id: "kc-8", label: "Classification", level: "supervised" },
  { id: "kc-9", label: "Decision Trees", level: "supervised" },
  { id: "kc-10", label: "Ensemble Methods", level: "supervised" },
  { id: "kc-11", label: "Overfitting", level: "evaluation" },
  { id: "kc-12", label: "Regularization", level: "evaluation" },
  { id: "kc-13", label: "Bias-Variance", level: "evaluation" },
  { id: "kc-14", label: "Cross-Validation", level: "evaluation" },
  { id: "kc-15", label: "Feature Engineering", level: "advanced" },
  { id: "kc-16", label: "Model Selection", level: "advanced" },
]

// Pipeline statistics for the demo
export const pipelineStats = {
  learningSegments: 261,
  knowledgeComponents: 23,
  kcsExtracted: 16,
  kcLinks: 1101,
  dependencyEdges: 26,
  candidatePaths: 5,
  selectedPath: 1,
  preScore: 32,
  postScore: 87,
  confidenceLevel: 94,
}

// KC Dependencies for visualization
export const kcDependencies = [
  { from: "Linear Algebra", to: "Gradient Descent" },
  { from: "Linear Algebra", to: "Regression" },
  { from: "Probability", to: "Classification" },
  { from: "Probability", to: "Bias-Variance" },
  { from: "Gradient Descent", to: "Loss Functions" },
  { from: "Loss Functions", to: "Regression" },
  { from: "Regression", to: "Classification" },
  { from: "Classification", to: "Decision Boundary" },
  { from: "Decision Boundary", to: "Overfitting" },
  { from: "Overfitting", to: "Regularization" },
  { from: "Bias-Variance", to: "Overfitting" },
  { from: "Regularization", to: "Cross-Validation" },
  { from: "Cross-Validation", to: "Ensemble Methods" },
]

export const defaultPath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "Linear algebra refresh",
        reason: "Needed for understanding models and optimization",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Linear Algebra"],
      },
      {
        title: "Probability and statistics basics",
        reason: "Required before evaluation metrics and uncertainty",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Probability"],
      },
      {
        title: "Linear regression and loss functions",
        reason: "First core supervised learning concept",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Regression", "Loss Functions", "Gradient Descent"],
      },
      {
        title: "Logistic regression and classification",
        reason: "Natural next step after regression",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Classification", "Decision Boundary"],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        title: "Trees and ensemble methods",
        reason: "Common interview topic with intuitive practical value",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Ensemble Methods", "Decision Boundary"],
      },
      {
        title: "Overfitting, regularization, and bias-variance",
        reason: "Connects model behavior and tuning decisions",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Overfitting", "Regularization", "Bias-Variance"],
      },
      {
        title: "Evaluation metrics and model selection",
        reason: "Essential for applied ML and interview discussion",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Cross-Validation"],
      },
      {
        title: "Mock questions and review",
        reason: "Consolidate and test understanding",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Feature Engineering"],
      },
    ],
  },
]

export const fasterPath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "ML fundamentals crash course",
        reason: "Core concepts compressed into essentials",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Linear Algebra", "Probability"],
      },
      {
        title: "Supervised learning overview",
        reason: "Regression and classification in one session",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Regression", "Classification"],
      },
      {
        title: "Decision trees and ensembles",
        reason: "High-frequency interview topics",
        estimatedTime: "1.5 hours",
        knowledgeComponents: ["Ensemble Methods", "Decision Boundary"],
      },
      {
        title: "Key evaluation metrics",
        reason: "Must-know for any ML discussion",
        estimatedTime: "1 hour",
        knowledgeComponents: ["Cross-Validation", "Bias-Variance"],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        title: "Bias-variance and regularization",
        reason: "Conceptual depth for interview answers",
        estimatedTime: "1.5 hours",
        knowledgeComponents: ["Overfitting", "Regularization"],
      },
      {
        title: "Interview practice session",
        reason: "Apply knowledge in interview format",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Feature Engineering"],
      },
    ],
  },
]

export const beginnerPath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "What is machine learning?",
        reason: "Build intuition before technical details",
        estimatedTime: "1 hour",
        knowledgeComponents: ["Linear Algebra"],
      },
      {
        title: "Math foundations: Linear algebra basics",
        reason: "Gentle introduction to vectors and matrices",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Linear Algebra"],
      },
      {
        title: "Math foundations: Probability basics",
        reason: "Understanding uncertainty and distributions",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Probability"],
      },
      {
        title: "Your first ML model: Linear regression",
        reason: "Hands-on introduction to supervised learning",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Regression", "Loss Functions"],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        title: "Classification with logistic regression",
        reason: "Understanding prediction categories",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Classification", "Decision Boundary"],
      },
      {
        title: "Decision trees visualized",
        reason: "Intuitive model with clear decision paths",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Decision Boundary"],
      },
      {
        title: "How do we know if our model is good?",
        reason: "Introduction to evaluation metrics",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Cross-Validation", "Bias-Variance"],
      },
      {
        title: "Common ML mistakes and how to avoid them",
        reason: "Overfitting and data leakage explained simply",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Overfitting", "Regularization"],
      },
    ],
  },
]

export const interviewPath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "ML interview question patterns",
        reason: "Understand what interviewers are looking for",
        estimatedTime: "1.5 hours",
        knowledgeComponents: ["Feature Engineering"],
      },
      {
        title: "Explain ML concepts simply",
        reason: "Practice clear explanations of core concepts",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Regression", "Classification"],
      },
      {
        title: "Supervised vs unsupervised learning",
        reason: "Foundational distinction asked in most interviews",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Classification", "Decision Boundary"],
      },
      {
        title: "Bias-variance tradeoff deep dive",
        reason: "Most common conceptual interview question",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Bias-Variance", "Overfitting"],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        title: "Model selection and evaluation",
        reason: "Choosing the right model and metrics",
        estimatedTime: "2.5 hours",
        knowledgeComponents: ["Cross-Validation", "Regularization"],
      },
      {
        title: "Feature engineering strategies",
        reason: "Practical skills interviewers value",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Feature Engineering"],
      },
      {
        title: "Case study: End-to-end ML problem",
        reason: "Practice the full problem-solving workflow",
        estimatedTime: "2.5 hours",
        knowledgeComponents: ["Ensemble Methods", "Cross-Validation"],
      },
      {
        title: "Mock interview simulation",
        reason: "Practice under interview conditions",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Feature Engineering"],
      },
    ],
  },
]

export const practicePath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "Linear algebra fundamentals + exercises",
        reason: "Build foundation with hands-on practice",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Linear Algebra"],
      },
      {
        title: "Statistics basics + problem sets",
        reason: "Apply concepts through exercises",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Probability"],
      },
      {
        title: "Linear regression: Theory + coding lab",
        reason: "Implement your first model from scratch",
        estimatedTime: "4 hours",
        knowledgeComponents: ["Regression", "Gradient Descent", "Loss Functions"],
      },
      {
        title: "Classification coding challenge",
        reason: "Build a classifier step by step",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Classification", "Decision Boundary"],
      },
    ],
  },
  {
    week: 2,
    topics: [
      {
        title: "Decision trees: Build your own",
        reason: "Deep understanding through implementation",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Decision Boundary", "Ensemble Methods"],
      },
      {
        title: "Model evaluation workshop",
        reason: "Hands-on with cross-validation and metrics",
        estimatedTime: "3 hours",
        knowledgeComponents: ["Cross-Validation", "Bias-Variance"],
      },
      {
        title: "Mini-project: Kaggle-style challenge",
        reason: "Apply all skills to a real dataset",
        estimatedTime: "4 hours",
        knowledgeComponents: ["Feature Engineering", "Ensemble Methods"],
      },
      {
        title: "Code review and optimization",
        reason: "Learn best practices and common patterns",
        estimatedTime: "2 hours",
        knowledgeComponents: ["Regularization", "Overfitting"],
      },
    ],
  },
]

export function getPathForRefinements(refinements: string[]): LearningWeek[] {
  if (refinements.includes("faster")) return fasterPath
  if (refinements.includes("beginner")) return beginnerPath
  if (refinements.includes("interview")) return interviewPath
  if (refinements.includes("practice")) return practicePath
  return defaultPath
}

export function getPathTitle(timeline: string, refinements: string[]): string {
  const timelineLabel = 
    timeline === "3-days" ? "3-Day" :
    timeline === "1-week" ? "1-Week" :
    timeline === "2-weeks" ? "2-Week" :
    timeline === "1-month" ? "1-Month" : "Flexible"
  
  if (refinements.includes("faster")) return `Your ${timelineLabel} Fast-Track ML Path`
  if (refinements.includes("beginner")) return `Your ${timelineLabel} Beginner-Friendly ML Path`
  if (refinements.includes("interview")) return `Your ${timelineLabel} Interview-Focused ML Path`
  if (refinements.includes("practice")) return `Your ${timelineLabel} Hands-On Practice ML Path`
  return `Your ${timelineLabel} Machine Learning Interview Prep Path`
}
