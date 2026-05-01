"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  GraduationCap,
  ArrowLeft,
  Download,
  FileText,
  FileJson,
  Link as LinkIcon,
  Check,
  Copy,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

type ExportFormat = "markdown" | "pdf" | "canvas" | "link"

interface ExportOption {
  id: ExportFormat
  name: string
  description: string
  icon: React.ReactNode
}

const exportOptions: ExportOption[] = [
  {
    id: "markdown",
    name: "Markdown Syllabus",
    description: "Plain text format, easy to edit and version control",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "pdf",
    name: "PDF Document",
    description: "Formatted document ready to print or share",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: "canvas",
    name: "Canvas Import",
    description: "JSON format for LMS import (Canvas, Blackboard)",
    icon: <FileJson className="h-5 w-5" />,
  },
  {
    id: "link",
    name: "Public Link",
    description: "Share a read-only view of your course plan",
    icon: <LinkIcon className="h-5 w-5" />,
  },
]

export default function ExportPage() {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [exportComplete, setExportComplete] = useState(false)
  const [shareLink, setShareLink] = useState("")
  const [linkCopied, setLinkCopied] = useState(false)

  const handleExport = async () => {
    if (!selectedFormat) return

    setIsExporting(true)

    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (selectedFormat === "link") {
      setShareLink(`https://coursedesigner.app/share/${Math.random().toString(36).slice(2, 10)}`)
    }

    setIsExporting(false)
    setExportComplete(true)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleDownload = () => {
    // In production, this would trigger actual file download
    const filename =
      selectedFormat === "markdown"
        ? "course-syllabus.md"
        : selectedFormat === "pdf"
        ? "course-syllabus.pdf"
        : "canvas-import.json"

    // Create mock download
    const mockContent =
      selectedFormat === "markdown"
        ? "# Machine Learning Systems\n\n## Week 1: Introduction to Distributed Training\n..."
        : selectedFormat === "canvas"
        ? JSON.stringify({ course: "ML Systems", weeks: 14 }, null, 2)
        : ""

    if (selectedFormat !== "pdf") {
      const blob = new Blob([mockContent], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
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
            <Link href="/new/plan">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to plan
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Export Course Plan</h1>
            <p className="text-muted-foreground">
              Choose a format to export your course plan.
            </p>
          </div>

          {!exportComplete ? (
            <>
              {/* Export Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {exportOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      selectedFormat === option.id
                        ? "ring-2 ring-primary border-primary"
                        : "border-border"
                    )}
                    onClick={() => setSelectedFormat(option.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "flex items-center justify-center h-10 w-10 rounded-lg border",
                            selectedFormat === option.id
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-secondary text-muted-foreground border-border"
                          )}
                        >
                          {option.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{option.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {option.description}
                          </p>
                        </div>
                        {selectedFormat === option.id && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  onClick={handleExport}
                  disabled={!selectedFormat || isExporting}
                  className="min-w-[200px]"
                >
                  {isExporting ? (
                    <>
                      <Download className="mr-2 h-4 w-4 animate-bounce" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </>
          ) : (
            <Card className="border-border">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-accent/10">
                  <Check className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-lg">Export Complete</CardTitle>
                <CardDescription>
                  {selectedFormat === "link"
                    ? "Your shareable link is ready"
                    : "Your file is ready for download"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {selectedFormat === "link" ? (
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Input value={shareLink} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={handleCopyLink}>
                        {linkCopied ? (
                          <Check className="h-4 w-4 text-accent" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={shareLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      Anyone with this link can view your course plan (read-only)
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <Button size="lg" onClick={handleDownload}>
                      <Download className="mr-2 h-4 w-4" />
                      Download{" "}
                      {selectedFormat === "markdown"
                        ? ".md"
                        : selectedFormat === "pdf"
                        ? ".pdf"
                        : ".json"}
                    </Button>
                    <Button variant="ghost" onClick={() => setExportComplete(false)}>
                      Export another format
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
