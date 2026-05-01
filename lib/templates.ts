// Pre-seed the wizard's localStorage so users can step through the full
// /new → /new/materials → /new/outline → /new/plan flow with all fields
// already populated. Used by:
//   - /courses "Use template" buttons
//   - landing-page "see a sample" links
//   - any other place that wants to drop the user into the wizard with a
//     ready-made example.

import {
  sampleCourseSettings,
  sampleMaterials,
} from "./mock-course-data"
import {
  calculusCourseSettings,
  calculusSampleMaterials,
} from "./optimizer-data"

export type CourseTemplateKey = "calculus" | "ml-systems"

const TEMPLATES: Record<
  CourseTemplateKey,
  { settings: typeof sampleCourseSettings; materials: typeof sampleMaterials }
> = {
  calculus: {
    settings: calculusCourseSettings,
    materials: calculusSampleMaterials,
  },
  "ml-systems": {
    settings: sampleCourseSettings,
    materials: sampleMaterials,
  },
}

// Session-scoped flag (sessionStorage, cleared on tab close) signaling that
// the wizard was entered via a template — downstream pages use this to skip
// the slow generation animations and show the plan immediately, since the
// user already selected pre-built content.
export const TEMPLATE_FAST_MODE_KEY = "currentCourseTemplateMode"

// Write the template's settings + materials into localStorage. Safe to call
// from any client component; no-ops on the server.
export function seedTemplate(template: CourseTemplateKey): void {
  if (typeof window === "undefined") return
  const t = TEMPLATES[template]
  // Refresh the timestamps so /courses lists this as a recent course.
  const settings = {
    ...t.settings,
    id: `course-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  localStorage.setItem("currentCourseSettings", JSON.stringify(settings))
  localStorage.setItem("currentCourseMaterials", JSON.stringify(t.materials))
  // Mark this wizard run as a template flow. Cleared once the plan page
  // consumes it so a later "New Course" run still gets the full animation.
  sessionStorage.setItem(TEMPLATE_FAST_MODE_KEY, template)
}

export function consumeTemplateFastMode(): CourseTemplateKey | null {
  if (typeof window === "undefined") return null
  const v = sessionStorage.getItem(TEMPLATE_FAST_MODE_KEY) as
    | CourseTemplateKey
    | null
  if (v) sessionStorage.removeItem(TEMPLATE_FAST_MODE_KEY)
  return v
}

export function peekTemplateFastMode(): CourseTemplateKey | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(TEMPLATE_FAST_MODE_KEY) as
    | CourseTemplateKey
    | null
}

// Wipe any prior course-creation state so a fresh wizard run starts at a
// clean slate. Used by 'Start a course' to make sure stale localStorage from
// a previous template seed doesn't leak into a new manual course.
export function clearWizardState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentCourseSettings")
  localStorage.removeItem("currentCourseMaterials")
  sessionStorage.removeItem(TEMPLATE_FAST_MODE_KEY)
}

// Signal that the next /new/plan visit should skip its staged optimizer
// animation. Set by Re-pace's Apply Changes and Export's Back-to-plan
// navigation, so coming back to a plan you just generated doesn't make
// you sit through the loader again.
export const PLAN_FAST_FORWARD_KEY = "planFastForward"

export function setPlanFastForward(): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(PLAN_FAST_FORWARD_KEY, "1")
}

export function consumePlanFastForward(): boolean {
  if (typeof window === "undefined") return false
  const v = sessionStorage.getItem(PLAN_FAST_FORWARD_KEY)
  if (v) sessionStorage.removeItem(PLAN_FAST_FORWARD_KEY)
  return v === "1"
}
