"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Check, Rocket, Sparkles, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

interface StepEarlyAccessProps {
  onBack: () => void
}

const paymentOptions = [
  { value: "no", label: "No" },
  { value: "maybe-9", label: "Maybe at $9/month" },
  { value: "maybe-17", label: "Maybe at $17/month" },
  { value: "yes", label: "Yes, if it worked well" },
]

export function StepEarlyAccess({ onBack }: StepEarlyAccessProps) {
  const [formData, setFormData] = useState({
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
  }

  if (isSubmitted) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
            <Check className="h-10 w-10 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Thanks for your interest!
            </h2>
            <p className="text-muted-foreground">
              We&apos;ll be in touch soon with updates on LPO. Your feedback helps us build a better product.
            </p>
          </div>
          <Button variant="outline" onClick={onBack} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to learning path
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg space-y-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            <Sparkles className="h-4 w-4" />
            Limited early access
          </div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Want the full version?
          </h2>
          <p className="text-muted-foreground">
            Join our early access list for personalized learning paths
          </p>
        </div>

        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
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
                    className="h-10"
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
                    className="h-10"
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
                  className="h-10"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Would you use this again?
                </Label>
                <div className="flex gap-3">
                  {[true, false].map((value) => (
                    <button
                      key={String(value)}
                      type="button"
                      onClick={() => setFormData({ ...formData, wouldUseAgain: value })}
                      className={cn(
                        "flex-1 py-2 rounded-lg border text-sm font-medium transition-all",
                        formData.wouldUseAgain === value
                          ? "border-accent bg-accent/5 text-foreground"
                          : "border-border text-muted-foreground hover:border-accent/50"
                      )}
                    >
                      {value ? "Yes" : "No"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Would you pay for this?
                </Label>
                <RadioGroup
                  value={formData.willingToPay}
                  onValueChange={(value) => setFormData({ ...formData, willingToPay: value })}
                  className="grid grid-cols-2 gap-2"
                >
                  {paymentOptions.map((option) => (
                    <Label
                      key={option.value}
                      htmlFor={`pay-${option.value}`}
                      className={cn(
                        "flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-all text-sm",
                        formData.willingToPay === option.value
                          ? "border-accent bg-accent/5"
                          : "border-border hover:border-accent/50"
                      )}
                    >
                      <RadioGroupItem value={option.value} id={`pay-${option.value}`} />
                      <span>{option.label}</span>
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

        <Button
          variant="ghost"
          className="w-full text-muted-foreground"
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to learning path
        </Button>
      </div>
    </div>
  )
}
