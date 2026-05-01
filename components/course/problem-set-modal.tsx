"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  RefreshCw,
  Download,
  FileText,
  CheckCircle2,
  Edit2,
  Trash2,
  Flag,
  Loader2,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProblemSet, Question, MCQQuestion, ShortAnswerQuestion } from "@/lib/course-types"

interface ProblemSetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  weekNumber: number
  topic: string
  problemSet: ProblemSet | null
  isLoading?: boolean
  onRegenerate?: () => void
}

function MCQQuestionCard({ 
  question, 
  index,
  onEdit,
  onDelete,
  onFlag,
}: { 
  question: MCQQuestion
  index: number 
  onEdit?: () => void
  onDelete?: () => void
  onFlag?: () => void
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {index + 1}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            MCQ
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onFlag}>
            <Flag className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <p className="text-sm font-medium text-foreground mb-3">{question.stem}</p>

      <div className="space-y-2 mb-3">
        {question.options.map((option) => (
          <div
            key={option.label}
            className={cn(
              "flex items-start gap-2 p-2 rounded-md text-sm",
              option.label === question.correctAnswer
                ? "bg-accent/10 border border-accent/30"
                : "bg-muted/50"
            )}
          >
            <span className={cn(
              "font-medium min-w-[20px]",
              option.label === question.correctAnswer && "text-accent"
            )}>
              {option.label}.
            </span>
            <span className={cn(
              option.label === question.correctAnswer && "text-accent font-medium"
            )}>
              {option.text}
            </span>
            {option.label === question.correctAnswer && (
              <CheckCircle2 className="h-4 w-4 text-accent ml-auto flex-shrink-0" />
            )}
          </div>
        ))}
      </div>

      <div className="bg-muted/50 rounded-md p-3 mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-1">Explanation</p>
        <p className="text-sm text-foreground">{question.explanation}</p>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          <FileText className="h-2.5 w-2.5 mr-1" />
          {question.sourceMaterial}
        </Badge>
        {question.sourcePages && (
          <Badge variant="outline" className="text-[10px]">
            pp. {question.sourcePages}
          </Badge>
        )}
      </div>
    </div>
  )
}

function ShortAnswerQuestionCard({ 
  question, 
  index,
  onEdit,
  onDelete,
  onFlag,
}: { 
  question: ShortAnswerQuestion
  index: number 
  onEdit?: () => void
  onDelete?: () => void
  onFlag?: () => void
}) {
  return (
    <div className="border border-border rounded-lg p-4 bg-card">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {index + 1}
          </Badge>
          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-600 border-blue-200">
            Short Answer
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onEdit}>
            <Edit2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={onFlag}>
            <Flag className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <p className="text-sm font-medium text-foreground mb-3">{question.stem}</p>

      <div className="bg-muted/50 rounded-md p-3 mb-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Rubric Points</p>
        <ul className="space-y-1">
          {question.rubricPoints.map((point, i) => (
            <li key={i} className="text-sm text-foreground flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px]">
          <FileText className="h-2.5 w-2.5 mr-1" />
          {question.sourceMaterial}
        </Badge>
        {question.sourcePages && (
          <Badge variant="outline" className="text-[10px]">
            pp. {question.sourcePages}
          </Badge>
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-5 w-8" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function ProblemSetModal({
  open,
  onOpenChange,
  weekNumber,
  topic,
  problemSet,
  isLoading,
  onRegenerate,
}: ProblemSetModalProps) {
  const [isRegenerating, setIsRegenerating] = useState(false)

  const handleRegenerate = async () => {
    setIsRegenerating(true)
    onRegenerate?.()
    // Simulate regeneration
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRegenerating(false)
  }

  const handleExportCSV = () => {
    if (!problemSet) return

    const headers = [
      "question_number",
      "type",
      "question",
      "option_a",
      "option_b",
      "option_c",
      "option_d",
      "correct_answer",
      "explanation",
      "source_material",
      "source_pages",
    ]

    const rows = problemSet.questions.map((q, i) => {
      if (q.type === "mcq") {
        const mcq = q as MCQQuestion
        return [
          i + 1,
          "mcq",
          `"${mcq.stem.replace(/"/g, '""')}"`,
          `"${mcq.options[0]?.text || ""}"`,
          `"${mcq.options[1]?.text || ""}"`,
          `"${mcq.options[2]?.text || ""}"`,
          `"${mcq.options[3]?.text || ""}"`,
          mcq.correctAnswer,
          `"${mcq.explanation.replace(/"/g, '""')}"`,
          `"${mcq.sourceMaterial}"`,
          mcq.sourcePages || "",
        ]
      } else {
        const sa = q as ShortAnswerQuestion
        return [
          i + 1,
          "short-answer",
          `"${sa.stem.replace(/"/g, '""')}"`,
          "",
          "",
          "",
          "",
          "",
          `"${sa.rubricPoints.join("; ")}"`,
          `"${sa.sourceMaterial}"`,
          sa.sourcePages || "",
        ]
      }
    })

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `week-${weekNumber}-problem-set.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const mcqCount = problemSet?.questions.filter((q) => q.type === "mcq").length || 0
  const shortAnswerCount = problemSet?.questions.filter((q) => q.type === "short-answer").length || 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[85vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4 border-b border-border space-y-3">
          <div>
            <DialogTitle className="text-lg font-semibold">
              Week {weekNumber}: {topic}
            </DialogTitle>
            {problemSet && (
              <p className="text-sm text-muted-foreground mt-1">
                {problemSet.questions.length} questions • {mcqCount} MCQ, {shortAnswerCount} short answer
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isRegenerating || isLoading}
            >
              {isRegenerating ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Regenerate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={!problemSet || isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!problemSet || isLoading}
            >
              Export as Canvas QTI
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 min-h-0 overflow-hidden -mx-6">
          <ScrollArea className="h-full px-6">
          {isLoading ? (
            <LoadingSkeleton />
          ) : problemSet ? (
            <div className="space-y-4 pb-4">
              {problemSet.questions.map((question, index) =>
                question.type === "mcq" ? (
                  <MCQQuestionCard
                    key={question.id}
                    question={question as MCQQuestion}
                    index={index}
                  />
                ) : (
                  <ShortAnswerQuestionCard
                    key={question.id}
                    question={question as ShortAnswerQuestion}
                    index={index}
                  />
                )
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No problem set generated yet
            </div>
          )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
