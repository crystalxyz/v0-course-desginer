"use client"

import React, { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Upload, FileText, X, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UploadedFile {
  name: string
  size: string
  status: "uploading" | "processing" | "complete"
}

interface MaterialsUploadProps {
  uploadedFiles: UploadedFile[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>
  manualTopics: string
  setManualTopics: (topics: string) => void
}

export function MaterialsUpload({
  uploadedFiles,
  setUploadedFiles,
  manualTopics,
  setManualTopics,
}: MaterialsUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const simulateUpload = useCallback((fileName: string) => {
    const newFile: UploadedFile = {
      name: fileName,
      size: `${Math.floor(Math.random() * 500 + 100)} KB`,
      status: "uploading",
    }

    setUploadedFiles(prev => [...prev, newFile])

    // Simulate upload progress
    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === fileName ? { ...f, status: "processing" as const } : f
        )
      )
    }, 800)

    setTimeout(() => {
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.name === fileName ? { ...f, status: "complete" as const } : f
        )
      )
    }, 1600)
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
        return "Extracting topics..."
      case "complete":
        return "Ready"
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Add your learning materials</CardTitle>
        <CardDescription>Upload syllabi, course outlines, or paste topics manually (optional)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
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
          <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <p className="text-sm font-medium text-foreground mb-1">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            Supports PDF, DOCX, and TXT files
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
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(file.status)}
                    <span className="text-xs text-muted-foreground">
                      {getStatusText(file.status)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeFile(file.name)}
                    className="p-1 rounded-md hover:bg-muted transition-colors"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sample Syllabus Button */}
        <Button variant="outline" onClick={useSampleSyllabus} className="w-full">
          <FileText className="mr-2 h-4 w-4" />
          Use sample syllabus
        </Button>

        {/* Manual Topics */}
        <div className="space-y-2">
          <Label htmlFor="topics" className="text-sm font-medium">
            Or paste topics manually
          </Label>
          <Textarea
            id="topics"
            value={manualTopics}
            onChange={(e) => setManualTopics(e.target.value)}
            placeholder="e.g. Linear regression, Decision trees, Neural networks, Cross-validation..."
            className="min-h-[100px] resize-none"
          />
        </div>
      </CardContent>
    </Card>
  )
}
