"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { GraduationCap, Mail, Sparkles, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

function LoginInner() {
  const searchParams = useSearchParams()
  const next = searchParams.get("next") ?? "/courses"
  const [email, setEmail] = useState("")
  const [emailSubmitted, setEmailSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [emailLoading, setEmailLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState(false)

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setEmailError(null)
    setEmailLoading(true)
    try {
      const supabaseConfigured =
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
        Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      if (!supabaseConfigured) {
        setEmailError(
          "Supabase isn't configured yet. Use the demo button below — or set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
        )
        return
      }
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      })
      if (error) {
        setEmailError(error.message)
        return
      }
      setEmailSubmitted(true)
    } finally {
      setEmailLoading(false)
    }
  }

  const handleDemo = () => {
    setDemoLoading(true)
    window.location.href = `/auth/demo?next=${encodeURIComponent(next)}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground text-lg">Course Designer</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Card className="w-full max-w-md border-border">
          <CardContent className="pt-8 pb-6 space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-semibold text-foreground">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Save courses across devices, share with co-instructors.
              </p>
            </div>

            {emailSubmitted ? (
              <div className="rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm">
                <div className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-foreground">Check your email</p>
                    <p className="text-muted-foreground mt-1">
                      We sent a magic link to <span className="font-mono">{email}</span>.
                      Click it to finish signing in.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmail} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@university.edu"
                    autoComplete="email"
                  />
                </div>
                {emailError && (
                  <p className="text-xs text-destructive leading-relaxed">{emailError}</p>
                )}
                <Button type="submit" className="w-full" disabled={emailLoading || !email}>
                  {emailLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Mail className="mr-2 h-4 w-4" />
                  )}
                  Send magic link
                </Button>
              </form>
            )}

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleDemo}
                disabled={demoLoading}
              >
                {demoLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Continue as demo user
              </Button>
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Skips email — instant access to a shared demo workspace with seeded courses.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <LoginInner />
    </Suspense>
  )
}
