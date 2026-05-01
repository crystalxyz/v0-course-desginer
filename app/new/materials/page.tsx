"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  Upload,
  FileText,
  X,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { CourseMaterial, MaterialTag, CourseSettings } from "@/lib/course-types"

export default function MaterialsUploadPage() {
  const router = useRouter()
  const [isDragOver, setIsDragOver] = useState(false)
  const [materials, setMaterials] = useState<CourseMaterial[]>([])
  const [expandedMaterial, setExpandedMaterial] = useState<string | null>(null)
  const [courseSettings, setCourseSettings] = useState<CourseSettings | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("currentCourseSettings")
    if (stored) {
      setCourseSettings(JSON.parse(stored))
    }
  }, [])

  const simulateUpload = useCallback((fileName: string) => {
    const newMaterial: CourseMaterial = {
      id: `mat-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: fileName,
      size: `${Math.floor(Math.random() * 3000 + 500)} KB`,
      status: "uploading",
      tag: "core",
    }

    setMaterials((prev) => [...prev, newMaterial])

    // Simulate upload progress
    setTimeout(() => {
      setMaterials((prev) =>
        prev.map((m) =>
          m.id === newMaterial.id ? { ...m, status: "processing" as const } : m
        )
      )
    }, 600)

    // Simulate extraction complete with mock concepts
    setTimeout(() => {
      const mockConcepts = [
        "distributed training",
        "gradient aggregation",
        "parameter servers",
        "model parallelism",
        "data parallelism",
        "synchronous SGD",
      ]
      const extractedConcepts = mockConcepts
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * 3) + 2)

      setMaterials((prev) =>
        prev.map((m) =>
          m.id === newMaterial.id
            ? { ...m, status: "complete" as const, extractedConcepts }
            : m
        )
      )
    }, 1800)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      files.forEach((file) => {
        if (file.name.match(/\.pdf$/i)) {
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

  const removeMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id))
  }

  const updateMaterialTag = (id: string, tag: MaterialTag) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, tag } : m))
    )
  }

  const updateMaterialPinnedWeek = (id: string, week: number | undefined) => {
    setMaterials((prev) =>
      prev.map((m) => (m.id === id ? { ...m, pinnedWeek: week } : m))
    )
  }

  const useSampleMaterials = () => {
    const sampleFiles = [
      "Scaling Distributed ML with System Relaxations.pdf",
      "MLSys - Model Serving Chapter.pdf",
      "Data Parallel Training - Survey.pdf",
      "ZeRO - Memory Optimizations.pdf",
    ]
    sampleFiles.forEach((name, i) => {
      setTimeout(() => simulateUpload(name), i * 300)
    })
  }

  const getStatusIcon = (status: CourseMaterial["status"]) => {
    switch (status) {
      case "uploading":
        return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      case "processing":
        return <Loader2 className="h-4 w-4 animate-spin text-accent" />
      case "complete":
        return <Check className="h-4 w-4 text-accent" />
      case "error":
        return <X className="h-4 w-4 text-destructive" />
    }
  }

  const getStatusText = (status: CourseMaterial["status"]) => {
    switch (status) {
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Extracting concepts..."
      case "complete":
        return "Ready"
      case "error":
        return "Error"
    }
  }

  const getTagColor = (tag: MaterialTag) => {
    switch (tag) {
      case "core":
        return "bg-primary/10 text-primary border-primary/20"
      case "supplementary":
        return "bg-accent/10 text-accent border-accent/20"
      case "reference":
        return "bg-muted text-muted-foreground border-muted"
    }
  }

  const allReady = materials.length > 0 && materials.every((m) => m.status === "complete")
  const weekOptions = courseSettings
    ? Array.from({ length: courseSettings.weeks }, (_, i) => i + 1)
    : Array.from({ length: 14 }, (_, i) => i + 1)

  const handleContinue = () => {
    localStorage.setItem("currentCourseMaterials", JSON.stringify(materials))
    router.push("/new/outline")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Course Designer</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/new">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center gap-2 max-w-2xl mx-auto">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-accent text-accent-foreground text-sm font-medium">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Setup</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-accent" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                2
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Materials</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                3
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Outline</span>
            </div>
            <div className="h-[2px] w-6 sm:w-10 bg-border" />
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-secondary text-muted-foreground text-sm font-medium">
                4
              </div>
              <span className="text-sm font-medium text-muted-foreground hidden sm:block">Plan</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Upload Materials</h1>
            <p className="text-muted-foreground">
              Add your reading materials. Tag each as core, supplementary, or reference, and optionally pin to a specific week.
            </p>
          </div>

          <Card className="border-border mb-6">
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
                  "relative border-2 border-dashed rounded-xl p-8 text-center transition-all",
                  isDragOver
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <input
                  type="file"
                  accept=".pdf"
                  multiple
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium text-foreground mb-1">
                  Drag and drop PDF files here, or click to browse
                </p>
                <p className="text-xs text-muted-foreground">
                  Textbook chapters, research papers, lecture notes
                </p>
              </div>

              {/* Sample Button */}
              {materials.length === 0 && (
                <Button
                  variant="outline"
                  onClick={useSampleMaterials}
                  className="w-full"
                  size="sm"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Use sample materials (ML Systems course)
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Uploaded Materials List */}
          {materials.length > 0 && (
            <div className="space-y-3 mb-6">
              <Label className="text-sm font-medium">Uploaded materials ({materials.length})</Label>
              {materials.map((material) => (
                <Card
                  key={material.id}
                  className={cn(
                    "border-border transition-all",
                    expandedMaterial === material.id && "ring-1 ring-accent"
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <FileText className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {material.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {material.size}
                            </span>
                            <span className="text-muted-foreground">·</span>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(material.status)}
                              <span className="text-xs text-muted-foreground">
                                {getStatusText(material.status)}
                              </span>
                            </div>
                          </div>
                          {material.extractedConcepts && material.extractedConcepts.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {material.extractedConcepts.slice(0, 3).map((concept) => (
                                <Badge
                                  key={concept}
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  {concept}
                                </Badge>
                              ))}
                              {material.extractedConcepts.length > 3 && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] px-1.5 py-0"
                                >
                                  +{material.extractedConcepts.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant="outline"
                          className={cn("text-xs capitalize", getTagColor(material.tag))}
                        >
                          {material.tag}
                        </Badge>
                        {material.pinnedWeek && (
                          <Badge variant="secondary" className="text-xs">
                            Week {material.pinnedWeek}
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setExpandedMaterial(
                              expandedMaterial === material.id ? null : material.id
                            )
                          }
                        >
                          {expandedMaterial === material.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMaterial(material.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Expanded Options */}
                    {expandedMaterial === material.id && (
                      <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-xs">Material type</Label>
                          <Select
                            value={material.tag}
                            onValueChange={(v) =>
                              updateMaterialTag(material.id, v as MaterialTag)
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="core">Core reading</SelectItem>
                              <SelectItem value="supplementary">Supplementary</SelectItem>
                              <SelectItem value="reference">Reference</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Pin to week (optional)</Label>
                          <Select
                            value={material.pinnedWeek?.toString() || ""}
                            onValueChange={(v) =>
                              updateMaterialPinnedWeek(
                                material.id,
                                v ? parseInt(v) : undefined
                              )
                            }
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Auto-assign" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="">Auto-assign</SelectItem>
                              {weekOptions.map((week) => (
                                <SelectItem key={week} value={week.toString()}>
                                  Week {week}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <Button variant="outline" size="lg" asChild>
              <Link href="/new">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button
              size="lg"
              onClick={handleContinue}
              disabled={!allReady}
              className="min-w-[160px]"
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
