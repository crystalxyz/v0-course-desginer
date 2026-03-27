"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Mail, Rocket, FileText, RefreshCw, Check, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const quickActions = [
  { id: "email", label: "Email me this plan", icon: Mail },
  { id: "early-access", label: "Join early access", icon: Rocket },
  { id: "detailed", label: "Get detailed weekly version", icon: FileText },
  { id: "revised", label: "Request a revised plan", icon: RefreshCw },
]

const paymentOptions = [
  { value: "no", label: "No" },
  { value: "maybe-9", label: "Maybe at $9/month" },
  { value: "maybe-17", label: "Maybe at $17/month" },
  { value: "yes", label: "Yes, if it consistently saved me time" },
]

interface DemandCaptureProps {
  onSubmit?: (data: FormData) => void
}

interface FormData {
  name: string
  email: string
  learningFor: string
  wouldUseAgain: boolean
  willingToPay: string
}

export function DemandCapture({ onSubmit }: DemandCaptureProps) {
  const [selectedAction, setSelectedAction] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    learningFor: "",
    wouldUseAgain: true,
    willingToPay: "",
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitted(true)
    onSubmit?.(formData)
  }

  if (isSubmitted) {
    return (
      <Card className="border-border shadow-sm bg-accent/5 border-accent/30">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              Thanks for your interest!
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We&apos;ll be in touch soon with updates on LPO. Your feedback helps us build a better product.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium text-accent">Limited early access</span>
        </div>
        <CardTitle className="text-2xl font-semibold">
          Want the full version of this learning path?
        </CardTitle>
        <CardDescription className="text-base">
          Join our early access list to get personalized learning paths delivered to your inbox.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedAction(action.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-all",
                selectedAction === action.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-foreground border-border hover:border-accent/50"
              )}
            >
              <action.icon className="h-4 w-4" />
              {action.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="h-11"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="h-11"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningFor" className="text-sm font-medium">
              What are you learning for?
            </Label>
            <Input
              id="learningFor"
              value={formData.learningFor}
              onChange={(e) => setFormData({ ...formData, learningFor: e.target.value })}
              placeholder="e.g. Career change, interview prep, school project..."
              className="h-11"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Would you use a product like this again?
            </Label>
            <div className="flex gap-4">
              <Label
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all",
                  formData.wouldUseAgain
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <input
                  type="radio"
                  name="wouldUseAgain"
                  checked={formData.wouldUseAgain}
                  onChange={() => setFormData({ ...formData, wouldUseAgain: true })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">Yes</span>
              </Label>
              <Label
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg border cursor-pointer transition-all",
                  !formData.wouldUseAgain
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/50"
                )}
              >
                <input
                  type="radio"
                  name="wouldUseAgain"
                  checked={!formData.wouldUseAgain}
                  onChange={() => setFormData({ ...formData, wouldUseAgain: false })}
                  className="sr-only"
                />
                <span className="text-sm font-medium">No</span>
              </Label>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Would you pay for a product like this if it worked well?
            </Label>
            <RadioGroup
              value={formData.willingToPay}
              onValueChange={(value) => setFormData({ ...formData, willingToPay: value })}
              className="grid gap-2 sm:grid-cols-2"
            >
              {paymentOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={`pay-${option.value}`}
                  className={cn(
                    "flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                    formData.willingToPay === option.value
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/50"
                  )}
                >
                  <RadioGroupItem value={option.value} id={`pay-${option.value}`} />
                  <span className="text-sm">{option.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>

          <Button type="submit" size="lg" className="w-full h-12 text-base font-medium">
            <Rocket className="mr-2 h-4 w-4" />
            Join early access
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
