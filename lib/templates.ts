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
