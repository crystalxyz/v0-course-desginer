"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, Check, Loader2, ArrowRight, SkipForward } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  name: string
  size: string
  status: "uploading" | "processing" | "complete"
}

interface StepMaterialsProps {
  uploadedFiles: UploadedFile[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  manualTopics: string
  setManualTopics: (topics: string) => void
  onNext: () => void
  onSkip: () => void
}

export function StepMaterials({
  uploadedFiles,
  setUploadedFiles,
  manualTopics,
  setManualTopics,
  onNext,
  onSkip,
}: StepMaterialsProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const simulateUpload = useCallback((fileName: string) => {
    const newFile: UploadedFile = {
      name: fileName,
      size: `${Math.floor(Math.random() * 500 + 100)} KB`,
      status: "uploading",
    }

    setUploadedFiles(prev => [...prev, newFile])

    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === fileName ? { ...f, status: "processing" as const } : f
        )
      )
    }, 600)

    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === fileName ? { ...f, status: "complete" as const } : f
        )
      )
    }, 1200)
  }, [setUploadedFiles])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      
      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        if (file.name.match(/\.(pdf|docx|txt)$/i)) {
          simulateUpload(file.name)
        }
      })
    },
    [simulateUpload]
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach((file) => {
      simulateUpload(file.name)
    })
  }

  const removeFile = (fileName: string) => {
    setUploadedFiles(prev => prev.filter((f) => f.name !== fileName))
  }

  const useSampleSyllabus = () => {
    simulateUpload("ml_interview_topics.pdf")
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-accent" />
      case "complete":
        return <Check className="h-4 w-4 text-accent" />
    }
  }

  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "complete":
        return "Ready"
    }
  }

  const hasContent = uploadedFiles.length > 0 || manualTopics.trim() !== ""
  const allFilesReady = uploadedFiles.every((f) => f.status === "complete")

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl space-y-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Add your learning materials
          </h2>
          <p className="text-muted-foreground">
            Upload syllabi, course outlines, or paste topics manually
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-5">
            {/* Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 text-center transition-all",
                isDragOver
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              )}
            >
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                multiple
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, DOCX, TXT
              </p>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium text-foreground">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(file.status)}
                      <span className="text-xs text-muted-foreground">
                        {getStatusText(file.status)}
                      </span>
                      <button
                        onClick={() => removeFile(file.name)}
                        className="p-1 rounded-md hover:bg-muted transition-colors"
                      >
                        <X className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sample Button */}
            {uploadedFiles.length === 0 && (
              <Button variant="outline" onClick={useSampleSyllabus} className="w-full" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Use sample syllabus
              </Button>
            )}

            {/* Manual Topics */}
            <div className="space-y-2">
              <Label htmlFor="topics" className="text-sm font-medium">
                Or paste topics manually
              </Label>
              <Textarea
                id="topics"
                value={manualTopics}
                onChange={(e) => setManualTopics(e.target.value)}
                placeholder="e.g. Linear regression, Decision trees, Neural networks..."
                className="min-h-[80px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="lg"
            className="flex-1 h-12"
            onClick={onSkip}
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip for now
          </Button>
          <Button
            size="lg"
            className="flex-1 h-12"
            disabled={!hasContent || !allFilesReady}
            onClick={onNext}
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
