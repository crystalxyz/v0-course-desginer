// Self-contained share links: encode the entire course state into the URL
// fragment (#data=…) so the receiving /share/[slug] page can render the
// exact same course without any backend round-trip.
//
// Browser-only: uses btoa/atob and TextEncoder/TextDecoder.

import type {
  CourseSettings,
  CourseMaterial,
  CoursePlan,
} from "./course-types"

export interface SharedCourseData {
  settings: CourseSettings
  materials: CourseMaterial[]
  plan: CoursePlan
  v: 1 // schema version, for forward-compatibility
}

// URL-safe base64 (RFC 4648 §5). Same encoding as JWT/.well-known.
function toBase64Url(s: string): string {
  // Use TextEncoder so we handle multibyte UTF-8 correctly (KC labels can
  // contain "ε", "≤", "→" etc.).
  const bytes = new TextEncoder().encode(s)
  let bin = ""
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

function fromBase64Url(s: string): string {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") +
    "=".repeat((4 - (s.length % 4)) % 4)
  const bin = atob(padded)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}

export function encodeShare(data: SharedCourseData): string {
  return toBase64Url(JSON.stringify(data))
}

export function decodeShare(encoded: string): SharedCourseData | null {
  try {
    const json = fromBase64Url(encoded)
    const parsed = JSON.parse(json) as SharedCourseData
    if (!parsed?.settings?.title || !Array.isArray(parsed.plan?.weeks)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40) || "course"
  )
}

export function buildShareUrl(data: SharedCourseData, origin?: string): string {
  const root = origin ?? (typeof window !== "undefined" ? window.location.origin : "")
  const slug = slugify(data.settings.title)
  // Add a 6-char suffix so re-sharing the same course produces a fresh-looking
  // URL — the data is the same, just gives the user a new link to copy.
  const suffix = Math.random().toString(36).slice(2, 8)
  const encoded = encodeShare(data)
  return `${root}/share/${slug}-${suffix}#data=${encoded}`
}

// Read the share payload from the current URL fragment. Returns null if
// nothing is present or the payload is malformed.
export function readShareFromHash(hash: string): SharedCourseData | null {
  // hash typically begins with "#data=…"
  const m = hash.match(/(?:^#|&)data=([^&]+)/)
  if (!m) return null
  return decodeShare(decodeURIComponent(m[1]))
}
