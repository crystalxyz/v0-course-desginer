"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const statusMessages = [
  "Parsing your materials...",
  "Identifying prerequisite concepts...",
  "Analyzing topic dependencies...",
  "Adapting to your timeline...",
  "Optimizing learning sequence...",
  "Building your learning path...",
]

interface GeneratingLoaderProps {
  onComplete: () => void
}

export function GeneratingLoader({ onComplete }: GeneratingLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => {
        if (prev < statusMessages.length - 1) {
          return prev + 1
        }
        return prev
      })
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          clearInterval(messageInterval)
          return 100
        }
        return prev + 2
      })
    }, 70)

    const completeTimeout = setTimeout(() => {
      onComplete()
    }, 3500)

    return () => {
      clearInterval(messageInterval)
      clearInterval(progressInterval)
      clearTimeout(completeTimeout)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border shadow-lg">
        <CardContent className="pt-8 pb-8">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Generating your learning path
              </h3>
              <p className="text-sm text-muted-foreground min-h-[20px] transition-all duration-300">
                {statusMessages[currentMessageIndex]}
              </p>
            </div>

            <div className="w-full space-y-2">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-200 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{progress}% complete</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
