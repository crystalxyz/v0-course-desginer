import type { LearningWeek } from "@/components/lpo/learning-path-results"

export const defaultPath: LearningWeek[] = [
  {
    week: 1,
    topics: [
      {
        title: "Linear algebra refresh",
        reason: "Needed for understanding models and optimization",
        estimatedTime: "2 hours",
      },
      {
        title: "Probability and statistics basics",
        reason: "Required before evaluation metrics and uncertainty",
        estimatedTime: "3 hours",
      },
      {
        title: "Linear regression and loss functions",
        reason: "First core supervised learning concept",
        estimatedTime: "3 hours",
      },
      {
        title: "Logistic regression and classification",
        reason: "Natural next step after regression",
        estimatedTime: "3 hours",
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
      },
      {
        title: "Overfitting, regularization, and bias-variance",
        reason: "Connects model behavior and tuning decisions",
        estimatedTime: "2 hours",
      },
      {
        title: "Evaluation metrics and model selection",
        reason: "Essential for applied ML and interview discussion",
        estimatedTime: "2 hours",
      },
      {
        title: "Mock questions and review",
        reason: "Consolidate and test understanding",
        estimatedTime: "2 hours",
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
      },
      {
        title: "Supervised learning overview",
        reason: "Regression and classification in one session",
        estimatedTime: "2 hours",
      },
      {
        title: "Decision trees and ensembles",
        reason: "High-frequency interview topics",
        estimatedTime: "1.5 hours",
      },
      {
        title: "Key evaluation metrics",
        reason: "Must-know for any ML discussion",
        estimatedTime: "1 hour",
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
      },
      {
        title: "Interview practice session",
        reason: "Apply knowledge in interview format",
        estimatedTime: "2 hours",
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
      },
      {
        title: "Math foundations: Linear algebra basics",
        reason: "Gentle introduction to vectors and matrices",
        estimatedTime: "3 hours",
      },
      {
        title: "Math foundations: Probability basics",
        reason: "Understanding uncertainty and distributions",
        estimatedTime: "3 hours",
      },
      {
        title: "Your first ML model: Linear regression",
        reason: "Hands-on introduction to supervised learning",
        estimatedTime: "3 hours",
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
      },
      {
        title: "Decision trees visualized",
        reason: "Intuitive model with clear decision paths",
        estimatedTime: "2 hours",
      },
      {
        title: "How do we know if our model is good?",
        reason: "Introduction to evaluation metrics",
        estimatedTime: "2 hours",
      },
      {
        title: "Common ML mistakes and how to avoid them",
        reason: "Overfitting and data leakage explained simply",
        estimatedTime: "2 hours",
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
      },
      {
        title: "Explain ML concepts simply",
        reason: "Practice clear explanations of core concepts",
        estimatedTime: "2 hours",
      },
      {
        title: "Supervised vs unsupervised learning",
        reason: "Foundational distinction asked in most interviews",
        estimatedTime: "2 hours",
      },
      {
        title: "Bias-variance tradeoff deep dive",
        reason: "Most common conceptual interview question",
        estimatedTime: "2 hours",
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
      },
      {
        title: "Feature engineering strategies",
        reason: "Practical skills interviewers value",
        estimatedTime: "2 hours",
      },
      {
        title: "Case study: End-to-end ML problem",
        reason: "Practice the full problem-solving workflow",
        estimatedTime: "2.5 hours",
      },
      {
        title: "Mock interview simulation",
        reason: "Practice under interview conditions",
        estimatedTime: "2 hours",
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
      },
      {
        title: "Statistics basics + problem sets",
        reason: "Apply concepts through exercises",
        estimatedTime: "3 hours",
      },
      {
        title: "Linear regression: Theory + coding lab",
        reason: "Implement your first model from scratch",
        estimatedTime: "4 hours",
      },
      {
        title: "Classification coding challenge",
        reason: "Build a classifier step by step",
        estimatedTime: "3 hours",
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
      },
      {
        title: "Model evaluation workshop",
        reason: "Hands-on with cross-validation and metrics",
        estimatedTime: "3 hours",
      },
      {
        title: "Mini-project: Kaggle-style challenge",
        reason: "Apply all skills to a real dataset",
        estimatedTime: "4 hours",
      },
      {
        title: "Code review and optimization",
        reason: "Learn best practices and common patterns",
        estimatedTime: "2 hours",
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
