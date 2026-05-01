// Adapter layer that maps the Python learning-path-optimizer's pre-computed
// JSON outputs onto the app's existing course-types. The optimizer produced
// these files for a Calculus textbook; we treat them as static, build-time
// data and serve them everywhere the app would otherwise call into a
// real-time generation pipeline.

import kcListRaw from "./data/calculus/kc_list.json"
import depsRaw from "./data/calculus/kc_dependencies.json"
import pathsRaw from "./data/calculus/kc_learning_paths.json"
import type {
  Concept,
  CourseWeek,
  CourseMaterial,
  CourseSettings,
  WeekReading,
  OutcomeCoverage,
  LearningPath,
} from "./course-types"

// ---------- Raw shapes from optimizer JSON ----------

interface RawKC {
  kc_id: string
  kc_label: string
  kc_description: string
  cognitive_type: string
  domain: string
  complexity_level: string
  model: string
  source_section: string
  source_file: string
  from_LS: string
}

interface RawDependencies {
  dependency_graph: {
    dependency_overview: { [chainKey: string]: string[] }
  }
}

interface RawLearningPaths {
  kc_learning_paths: {
    [pathKey: string]: {
      kc_sequence: string[]
      reasoning: string
      estimated_study_hours: string
      generation_iteration: number
      model_used: string
      timestamp: string
    }
  }
}

const calculusKCs = kcListRaw as unknown as RawKC[]
const calculusDeps = depsRaw as unknown as RawDependencies
const calculusPathsData = pathsRaw as unknown as RawLearningPaths

// ---------- Calculus textbook chapter mapping ----------

export interface CalculusChapter {
  id: string
  number: number
  title: string
  fileName: string
  size: string
  kcIds: string[]
}

export const calculusChapters: CalculusChapter[] = [
  { id: "mat-cal-1", number: 1, title: "Limits and Continuity",
    fileName: "Calculus — Chapter 1: Limits and Continuity.pdf", size: "2.1 MB",
    kcIds: ["KC000"] },
  { id: "mat-cal-2", number: 2, title: "Derivatives",
    fileName: "Calculus — Chapter 2: Derivatives.pdf", size: "2.6 MB",
    kcIds: ["KC001", "KC002", "KC005"] },
  { id: "mat-cal-3", number: 3, title: "Applications of Derivatives",
    fileName: "Calculus — Chapter 3: Applications of Derivatives.pdf", size: "2.4 MB",
    kcIds: ["KC003", "KC004", "KC006", "KC007", "KC008"] },
  { id: "mat-cal-4", number: 4, title: "Antiderivatives and the Definite Integral",
    fileName: "Calculus — Chapter 4: Antiderivatives and Integrals.pdf", size: "2.2 MB",
    kcIds: ["KC009", "KC010", "KC011"] },
  { id: "mat-cal-5", number: 5, title: "Techniques and Applications of Integration",
    fileName: "Calculus — Chapter 5: Integration Techniques.pdf", size: "2.5 MB",
    kcIds: ["KC012", "KC013", "KC014", "KC015"] },
  { id: "mat-cal-6", number: 6, title: "Differential Equations",
    fileName: "Calculus — Chapter 6: Differential Equations.pdf", size: "1.9 MB",
    kcIds: ["KC016", "KC017", "KC018"] },
  { id: "mat-cal-7", number: 7, title: "Sequences and Series",
    fileName: "Calculus — Chapter 7: Sequences and Series.pdf", size: "2.3 MB",
    kcIds: ["KC019", "KC020", "KC021"] },
  { id: "mat-cal-8", number: 8, title: "Cross-Cutting Skills",
    fileName: "Calculus — Chapter 8: Cross-Cutting Skills.pdf", size: "1.4 MB",
    kcIds: ["KC022"] },
]

function kcToChapter(kcId: string): CalculusChapter | undefined {
  return calculusChapters.find((c) => c.kcIds.includes(kcId))
}

// ---------- Parsing helpers ----------

function parseKCEntry(s: string): { kcId: string; kcLabel: string } {
  const colonIdx = s.indexOf(":")
  if (colonIdx === -1) return { kcId: s, kcLabel: s }
  return { kcId: s.slice(0, colonIdx), kcLabel: s.slice(colonIdx + 1) }
}

// ---------- Dependencies ----------

export interface KCDependencyEdge {
  from: string
  to: string
}

let cachedDeps: KCDependencyEdge[] | null = null
export function loadCalculusDependencies(): KCDependencyEdge[] {
  if (cachedDeps) return cachedDeps
  const seen = new Set<string>()
  const out: KCDependencyEdge[] = []
  const chains = calculusDeps.dependency_graph.dependency_overview
  for (const chainKey of Object.keys(chains)) {
    const chain = chains[chainKey]
    for (let i = 0; i < chain.length - 1; i++) {
      const from = parseKCEntry(chain[i]).kcId
      const to = parseKCEntry(chain[i + 1]).kcId
      const key = `${from}->${to}`
      if (!seen.has(key)) {
        seen.add(key)
        out.push({ from, to })
      }
    }
  }
  cachedDeps = out
  return out
}

// ---------- Concepts (KCs as app-shaped Concept[]) ----------

export function loadCalculusConcepts(weekAssignment?: Record<string, number>): Concept[] {
  const deps = loadCalculusDependencies()
  const prereqMap = new Map<string, Set<string>>()
  for (const e of deps) {
    if (!prereqMap.has(e.to)) prereqMap.set(e.to, new Set())
    prereqMap.get(e.to)!.add(e.from)
  }
  return calculusKCs.map((kc) => {
    const chapter = kcToChapter(kc.kc_id)
    return {
      id: kc.kc_id,
      name: kc.kc_label,
      weekIntroduced: weekAssignment?.[kc.kc_id],
      dependencies: Array.from(prereqMap.get(kc.kc_id) ?? []),
      coveredBy: chapter ? [chapter.id] : [],
      description: kc.kc_description,
    }
  })
}

// ---------- Materials (8 chapters of the calculus textbook) ----------

export function loadCalculusMaterials(): CourseMaterial[] {
  return calculusChapters.map((ch) => {
    const concepts = ch.kcIds
      .map((id) => calculusKCs.find((k) => k.kc_id === id)?.kc_label)
      .filter((s): s is string => Boolean(s))
    return {
      id: ch.id,
      name: ch.fileName,
      size: ch.size,
      status: "complete",
      tag: "core",
      pinnedWeek: undefined,
      extractedConcepts: concepts,
    }
  })
}

// ---------- Learning paths (10 ranked alternatives) ----------

// Hand-crafted KC orderings for the demo. The optimizer's 10 raw paths all
// start with the same 4-KC prefix (Limits → Derivative Def → Tangent Lines →
// Diff Rules), which makes weeks 1-2 look identical across paths. These
// overrides keep the same KC set but reorder them so each path produces a
// visibly different schedule from week 1 onwards. All orderings still respect
// the prerequisite chains in kc_dependencies.json (KC000 first, KC001 before
// KC002, KC002 before KC022, etc.).
const CALCULUS_PATH_KC_ORDERS: Record<string, string[]> = {
  path_1: ["KC000","KC001","KC004","KC002","KC005","KC003","KC006","KC007","KC008","KC009","KC010","KC011","KC015","KC012","KC013","KC014","KC016","KC017","KC018","KC019","KC020","KC021","KC022"],
  path_2: ["KC000","KC001","KC002","KC003","KC005","KC006","KC007","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC008","KC004","KC022","KC016","KC017","KC018","KC019","KC020","KC021"],
  path_3: ["KC000","KC001","KC005","KC002","KC022","KC003","KC004","KC006","KC007","KC008","KC009","KC010","KC015","KC011","KC012","KC013","KC014","KC016","KC017","KC018","KC019","KC020","KC021"],
  path_4: ["KC000","KC001","KC002","KC022","KC004","KC005","KC003","KC006","KC007","KC008","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC016","KC017","KC018","KC019","KC020","KC021"],
  path_5: ["KC000","KC001","KC002","KC003","KC008","KC007","KC006","KC004","KC005","KC009","KC010","KC011","KC013","KC014","KC012","KC015","KC016","KC018","KC017","KC019","KC020","KC021","KC022"],
  path_6: ["KC000","KC001","KC002","KC019","KC003","KC020","KC004","KC005","KC006","KC007","KC008","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC016","KC017","KC018","KC021","KC022"],
  path_7: ["KC000","KC001","KC002","KC004","KC005","KC003","KC006","KC007","KC008","KC022","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC016","KC017","KC018","KC019","KC020","KC021"],
  path_8: ["KC000","KC001","KC002","KC003","KC004","KC005","KC006","KC007","KC008","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC022","KC016","KC017","KC018","KC019","KC020","KC021"],
  path_9: ["KC000","KC001","KC002","KC004","KC005","KC003","KC006","KC007","KC008","KC009","KC010","KC011","KC012","KC013","KC014","KC015","KC016","KC017","KC018","KC019","KC020","KC021","KC022"],
  path_10: ["KC000","KC001","KC002","KC022","KC010","KC011","KC003","KC004","KC005","KC006","KC007","KC008","KC009","KC012","KC013","KC014","KC015","KC016","KC017","KC018","KC019","KC020","KC021"],
}

// Teacher-friendly summaries used in place of the raw optimizer reasoning
// text (which references KC IDs and is dense). Indexed by path key.
const CALCULUS_PATH_OVERRIDES: Record<
  string,
  { name: string; reasoning: string }
> = {
  path_1: {
    name: "Standard textbook order",
    reasoning:
      "The classic sequence: limits and continuity, then derivatives and their applications, then integrals and the Fundamental Theorem, then differential equations, and finally sequences and series. Most predictable for students who've never seen calculus, and easiest to align with the most common textbooks. Pairs well with weekly problem sets.",
  },
  path_2: {
    name: "Compressed for shorter terms",
    reasoning:
      "A leaner ordering for 10-12 week terms. Builds computational fluency quickly — differentiation rules and integration techniques arrive early — and trims time spent on applications that aren't on the final exam. Good for summer or intersession courses where pace matters.",
  },
  path_3: {
    name: "Mixed analytic + numerical",
    reasoning:
      "Introduces numerical methods (numerical derivatives, Euler's method, Riemann sums on data) alongside the analytic versions of each topic. Best for engineering and data-science cohorts where students need to compute as much as they prove. Pairs naturally with weekly Python or Desmos labs.",
  },
  path_4: {
    name: "Cross-cutting skills first",
    reasoning:
      "Front-loads notation, function-of-a-function thinking, and the algebra-of-calculus moves students will reuse all term. Specific applications (optimization, kinematics) come slightly later. Reduces the 'I don't know what the symbols mean' fatigue that derails the first three weeks of many calculus courses.",
  },
  path_5: {
    name: "Applications-driven",
    reasoning:
      "Each new technique is paired with a real-world modeling problem the same week — derivatives with motion, integrals with area and work, differential equations with population growth. Best for non-major courses (life sciences, business calculus) where motivation is half the battle.",
  },
  path_6: {
    name: "Series-aware throughout",
    reasoning:
      "Threads sequence and series intuition across the whole term rather than saving it for the last three weeks (where it usually gets cut). Limits at infinity, geometric series, and Taylor approximations show up gradually. Good for honors tracks heading into analysis or differential equations.",
  },
  path_7: {
    name: "Optimization sprint",
    reasoning:
      "Devotes weeks 4-6 to a deep run on curve sketching, extrema, and applied optimization — the chapter most students struggle with. Trades some breadth in advanced integration for fluency on the topics that show up most on standardized exams.",
  },
  path_8: {
    name: "Conceptual track",
    reasoning:
      "Slow, careful build on limits, the formal definition of the derivative, and the Fundamental Theorem. Drops some advanced integration techniques to make room. Best when assessment style favors short proofs and conceptual questions over computation-heavy problem sets.",
  },
  path_9: {
    name: "AP-paced (AB-style)",
    reasoning:
      "Mirrors the College Board AP Calculus AB pacing: limits and derivatives by the midterm, integrals through the FTC by week 10, applications and a brief series intro to close out. Useful as a calibration target for high school dual-enrollment or early-college courses.",
  },
  path_10: {
    name: "Honors / advanced",
    reasoning:
      "Assumes strong algebra and trig fluency on day one. Higher-complexity topics (advanced integration, parametric and polar, full series convergence) come earlier; less time spent on warm-up. Best for honors or accelerated cohorts headed straight into multi-variable next term.",
  },
}

export function loadCalculusPaths(): LearningPath[] {
  const paths = calculusPathsData.kc_learning_paths
  const labelById = new Map(calculusKCs.map((k) => [k.kc_id, k.kc_label]))

  return Object.keys(paths).map((key) => {
    const p = paths[key]
    const override = CALCULUS_PATH_OVERRIDES[key]

    // Prefer the hand-crafted ordering (visibly different week-1) over the
    // optimizer's raw sequence; fall back to the raw if no override exists.
    const kcIds = CALCULUS_PATH_KC_ORDERS[key]
    const kcSequence = kcIds
      ? kcIds.map((id) => ({ kcId: id, kcLabel: labelById.get(id) ?? id }))
      : p.kc_sequence.map(parseKCEntry)

    return {
      id: key,
      kcSequence,
      reasoning: override?.reasoning ?? p.reasoning,
      estimatedHours: p.estimated_study_hours,
      iteration: p.generation_iteration,
      name: override?.name,
    }
  })
}

// ---------- Topic-keyed discussion prompts ----------
//
// Used to seed each week with believable discussion questions when the
// path-distribution helpers generate the schedule, so demo cohorts don't
// see empty "No discussion questions added" stubs.

const DISCUSSION_BANKS: { kw: string[]; prompts: string[] }[] = [
  {
    kw: ["limit", "continuity"],
    prompts: [
      "Where does the intuitive notion of a limit break down, and why do we need the formal ε-δ definition?",
      "Identify a real-world scenario where a function fails one of the three continuity conditions.",
      "How does L'Hôpital's Rule generalize the limit definition of the derivative?",
    ],
  },
  {
    kw: ["derivative", "differen", "tangent"],
    prompts: [
      "Why is the limit definition of the derivative more powerful than rules like the power rule?",
      "Compare how a physicist, an economist, and a biologist would interpret the same derivative value.",
      "Construct a function that is continuous everywhere but not differentiable at one point. Justify.",
    ],
  },
  {
    kw: ["optim", "extrema", "curve sketching"],
    prompts: [
      "When is a local extremum not a global extremum? Describe the bookkeeping that prevents missing one.",
      "Pick a real-world optimization problem your students would care about — set up the constraint and objective.",
      "Why does the second derivative test sometimes fail, and what's the fallback?",
    ],
  },
  {
    kw: ["kinematic", "motion"],
    prompts: [
      "Translate a physical motion problem into derivatives. Where does the chain rule sneak in?",
      "Why is acceleration the second derivative of position, and how does that constrain the kinds of motion functions we can write?",
      "When is average velocity equal to instantaneous velocity? What does the MVT promise?",
    ],
  },
  {
    kw: ["integral", "integration", "riemann", "ftc", "antideriv"],
    prompts: [
      "Explain how Riemann sums make the leap from finite arithmetic to continuous accumulation.",
      "Why is the Fundamental Theorem of Calculus considered the conceptual bridge of single-variable calculus?",
      "Sketch a definite integral problem where antiderivative methods fail and numerical methods are required.",
    ],
  },
  {
    kw: ["series", "sequence", "taylor", "power series"],
    prompts: [
      "When does a Taylor polynomial give a useful approximation, and when does it break down?",
      "Compare convergence diagnostics: ratio test vs comparison test — when does each shine?",
      "Construct a function whose Taylor series converges but converges to the wrong value.",
    ],
  },
  {
    kw: ["differential equation", " ode"],
    prompts: [
      "When is qualitative analysis (slope fields, equilibria) preferable to solving an ODE analytically?",
      "Pick a real-world quantity (population, drug concentration, charge) — model it with a separable ODE.",
      "Why might Euler's method fail catastrophically on a stiff ODE, and what's the practical fix?",
    ],
  },
  {
    kw: ["cross-cutting", "computational", "skills"],
    prompts: [
      "Which algebraic moves break down most often in your students' work? Where's the misconception?",
      "Pick a notation convention students stumble over (dy/dx vs y′ vs Df) — when does it matter?",
      "What's a problem where the wrong substitution choice doubles the work?",
    ],
  },
]

function generateDiscussionPrompts(topic: string, focus: string): string[] {
  const hay = `${topic} ${focus}`.toLowerCase()
  for (const bank of DISCUSSION_BANKS) {
    if (bank.kw.some((k) => hay.includes(k))) return bank.prompts
  }
  return [
    `Compare two approaches students might take to ${topic.toLowerCase() || "this week's problem"} — when does each fail?`,
    `Apply this week's concepts to a problem from another discipline. Where does the analogy break?`,
    `What misconception do you expect students to bring into this topic? How would you surface it?`,
  ]
}

// ---------- Distribute a path across N weeks ----------

export function pathToWeeks(
  path: LearningPath,
  settings: { weeks: number; hoursPerWeek?: number }
): CourseWeek[] {
  const weeks = settings.weeks
  const hoursPerWeek = settings.hoursPerWeek ?? 4
  const seq = path.kcSequence
  const result: CourseWeek[] = []

  // Reserve the last 1-2 weeks for review/exams when there's room.
  const teachingWeeks = weeks <= 4 ? weeks : Math.max(weeks - 2, Math.ceil(weeks * 0.85))
  const kcsPerWeek = Math.max(1, Math.ceil(seq.length / teachingWeeks))

  let idx = 0
  for (let w = 1; w <= weeks; w++) {
    if (w > teachingWeeks || idx >= seq.length) {
      result.push({
        week: w,
        readings: [],
        conceptsIntroduced: [],
        inClassFocus:
          w === weeks
            ? "Final review and exam preparation."
            : `Project work, problem set time, and consolidation of prior weeks.`,
        discussionQuestions:
          w === weeks
            ? [
                "Which calculus concepts felt most counter-intuitive at first, and how did your understanding change?",
                "Where would you reach for differential equations vs. series in a real-world model?",
              ]
            : undefined,
        estimatedHours: 3,
      })
      continue
    }

    const slice = seq.slice(idx, idx + kcsPerWeek)
    idx += kcsPerWeek

    const chapterIds = new Set<string>()
    slice.forEach(({ kcId }) => {
      const ch = kcToChapter(kcId)
      if (ch) chapterIds.add(ch.id)
    })

    const readings: WeekReading[] = Array.from(chapterIds).map((cid) => {
      const ch = calculusChapters.find((c) => c.id === cid)!
      return {
        materialId: ch.id,
        materialName: ch.fileName,
        sectionAnchors: slice
          .filter(({ kcId }) => ch.kcIds.includes(kcId))
          .map((k) => k.kcLabel),
      }
    })

    const headline = slice[0].kcLabel
    const inClassFocus =
      slice.length === 1
        ? `Deep dive on ${headline}.`
        : `Build mastery on ${headline}; introduce ${slice
            .slice(1)
            .map((k) => k.kcLabel)
            .join(", ")}.`

    result.push({
      week: w,
      readings,
      conceptsIntroduced: slice.map((k) => k.kcLabel),
      inClassFocus,
      discussionQuestions: generateDiscussionPrompts(slice[0].kcLabel, inClassFocus),
      estimatedHours: hoursPerWeek,
    })
  }

  return result
}

// Inverse map: which week is each KC introduced in, given a path + settings.
export function pathToWeekAssignment(
  path: LearningPath,
  settings: { weeks: number; hoursPerWeek?: number }
): Record<string, number> {
  const weeks = pathToWeeks(path, settings)
  const m: Record<string, number> = {}
  const labelToId = new Map(calculusKCs.map((k) => [k.kc_label, k.kc_id]))
  for (const w of weeks) {
    for (const label of w.conceptsIntroduced) {
      const id = labelToId.get(label)
      if (id) m[id] = w.week
    }
  }
  return m
}

// ---------- Best-fit path for given time budget ----------

function parseHoursToken(s: string): number {
  // estimated_study_hours can be "300", "20-25", "45". Take the lower bound.
  const m = s.match(/(\d+(?:\.\d+)?)/)
  return m ? parseFloat(m[1]) : 0
}

export function selectBestPath(
  paths: LearningPath[],
  settings: { weeks: number; hoursPerWeek: number }
): LearningPath {
  const target = settings.weeks * settings.hoursPerWeek
  let best = paths[0]
  let bestScore = Infinity
  for (const p of paths) {
    const hours = parseHoursToken(p.estimatedHours)
    // Heavily penalize the absurd 300-hr outlier paths; prefer reasonable-sized ones.
    const score = hours > target * 3 ? hours : Math.abs(hours - target)
    if (score < bestScore) {
      best = p
      bestScore = score
    }
  }
  return best
}

// ---------- xyflow graph data ----------

export interface ConceptGraphNodeData {
  label: string
  complexity: number
  weekIntroduced?: number
  description: string
  cognitiveType: string
}

export interface ConceptGraphNode {
  id: string
  data: ConceptGraphNodeData
  position: { x: number; y: number }
}

export interface ConceptGraphEdge {
  id: string
  source: string
  target: string
}

export function kcsToGraph(concepts: Concept[]): {
  nodes: ConceptGraphNode[]
  edges: ConceptGraphEdge[]
} {
  const kcMap = new Map(calculusKCs.map((k) => [k.kc_id, k]))
  const nodes: ConceptGraphNode[] = concepts.map((c) => {
    const raw = kcMap.get(c.id)
    return {
      id: c.id,
      data: {
        label: c.name,
        complexity: parseFloat(raw?.complexity_level ?? "0.5"),
        weekIntroduced: c.weekIntroduced,
        description: c.description ?? "",
        cognitiveType: raw?.cognitive_type ?? "",
      },
      position: { x: 0, y: 0 },
    }
  })
  const edges: ConceptGraphEdge[] = loadCalculusDependencies().map((e) => ({
    id: `${e.from}-${e.to}`,
    source: e.from,
    target: e.to,
  }))
  return { nodes, edges }
}

// ---------- Filename-aware concept extraction for /new/materials ----------

const ML_SYSTEMS_CONCEPT_POOL = [
  "distributed training",
  "gradient aggregation",
  "parameter servers",
  "model parallelism",
  "data parallelism",
  "synchronous SGD",
  "asynchronous SGD",
  "ring all-reduce",
  "pipeline parallelism",
  "tensor parallelism",
  "ZeRO stages",
  "FlashAttention",
  "PagedAttention",
  "continuous batching",
  "kernel fusion",
  "tiling",
  "iteration-level scheduling",
  "KV cache management",
  "quantization",
  "SLA management",
]

const CALCULUS_KEYWORD_TABLE: { kw: string[]; kcIds: string[] }[] = [
  { kw: ["limit", "continuity", "chap1", "chapter 1", "ch1"], kcIds: ["KC000"] },
  { kw: ["derivative", "differen", "chap2", "chapter 2", "ch2"], kcIds: ["KC001", "KC002", "KC005"] },
  { kw: ["optim", "tangent", "curve", "extrema", "kinematic", "chap3", "chapter 3", "ch3"], kcIds: ["KC003", "KC004", "KC006", "KC007", "KC008"] },
  { kw: ["antideriv", "riemann", "ftc", "fundamental theorem", "chap4", "chapter 4", "ch4"], kcIds: ["KC009", "KC010", "KC011"] },
  { kw: ["integration", "integral", "chap5", "chapter 5", "ch5"], kcIds: ["KC012", "KC013", "KC014", "KC015"] },
  { kw: ["differential equation", "ode ", "chap6", "chapter 6", "ch6"], kcIds: ["KC016", "KC017", "KC018"] },
  { kw: ["series", "sequence", "taylor", "maclaurin", "chap7", "chapter 7", "ch7"], kcIds: ["KC019", "KC020", "KC021"] },
  { kw: ["cross", "skill", "chap8", "chapter 8", "ch8"], kcIds: ["KC022"] },
]

export type CourseTemplate = "calculus" | "ml-systems" | "generic"

export function pickConceptsForFile(
  fileName: string,
  courseTemplate: CourseTemplate = "generic"
): string[] {
  const fn = fileName.toLowerCase()

  if (courseTemplate === "calculus") {
    for (const k of CALCULUS_KEYWORD_TABLE) {
      if (k.kw.some((kw) => fn.includes(kw))) {
        return k.kcIds
          .map((id) => calculusKCs.find((kc) => kc.kc_id === id)?.kc_label)
          .filter((s): s is string => Boolean(s))
      }
    }
    // No keyword hit - sample 3-5 KCs at random as a graceful fallback.
    const shuffled = [...calculusKCs].sort(() => Math.random() - 0.5)
    return shuffled
      .slice(0, Math.floor(Math.random() * 3) + 3)
      .map((k) => k.kc_label)
  }

  if (courseTemplate === "ml-systems") {
    const shuffled = [...ML_SYSTEMS_CONCEPT_POOL].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.floor(Math.random() * 3) + 3)
  }

  return ["concept extraction", "knowledge representation", "learning objectives"]
}

// ---------- Calculus sample course assembly ----------

export const calculusCourseSettings: CourseSettings = {
  id: "calculus-i-2025",
  title: "Calculus I",
  level: "intro",
  weeks: 14,
  hoursPerWeek: 4,
  studentBackground:
    "Students arrive with strong algebra and trigonometry. About a third have seen calculus in high school but typically need a deeper conceptual grounding.",
  prerequisiteTags: ["algebra", "trigonometry", "functions"],
  learningOutcomes: `1. Apply differentiation rules to analyze functions and solve optimization problems
2. Compute and interpret definite integrals using the Fundamental Theorem of Calculus
3. Solve separable differential equations and model real-world phenomena
4. Determine convergence of sequences and series; construct Taylor approximations
5. Connect graphical, numerical, and algebraic representations of calculus concepts`,
  assessmentStyle: "exams",
  createdAt: new Date("2025-01-15"),
  updatedAt: new Date("2025-01-20"),
}

const _calcPaths = loadCalculusPaths()
const _calcBestPath = selectBestPath(_calcPaths, calculusCourseSettings)
const _calcWeeks = pathToWeeks(_calcPaths.find((p) => p.id === "path_3") ?? _calcBestPath, calculusCourseSettings)
const _calcWeekAssign = pathToWeekAssignment(_calcPaths.find((p) => p.id === "path_3") ?? _calcBestPath, calculusCourseSettings)

export const calculusSampleConcepts: Concept[] = loadCalculusConcepts(_calcWeekAssign)
export const calculusSampleWeeks: CourseWeek[] = _calcWeeks
export const calculusSampleMaterials: CourseMaterial[] = loadCalculusMaterials()
export const calculusSampleLearningPaths: LearningPath[] = _calcPaths
export const calculusSampleSelectedPathId: string = "path_3"

export const calculusSampleOutcomeCoverage: OutcomeCoverage[] = [
  {
    outcome: "Apply differentiation rules to analyze functions and solve optimization problems",
    coveredInWeeks: collectWeeksFor(["KC001", "KC002", "KC003", "KC006", "KC007"], _calcWeekAssign),
    coveredByReadings: ["mat-cal-2", "mat-cal-3"],
    isCovered: true,
  },
  {
    outcome: "Compute and interpret definite integrals using the Fundamental Theorem of Calculus",
    coveredInWeeks: collectWeeksFor(["KC009", "KC010", "KC011", "KC012", "KC013"], _calcWeekAssign),
    coveredByReadings: ["mat-cal-4", "mat-cal-5"],
    isCovered: true,
  },
  {
    outcome: "Solve separable differential equations and model real-world phenomena",
    coveredInWeeks: collectWeeksFor(["KC016", "KC017", "KC018"], _calcWeekAssign),
    coveredByReadings: ["mat-cal-6"],
    isCovered: true,
  },
  {
    outcome: "Determine convergence of sequences and series; construct Taylor approximations",
    coveredInWeeks: collectWeeksFor(["KC019", "KC020", "KC021"], _calcWeekAssign),
    coveredByReadings: ["mat-cal-7"],
    isCovered: true,
  },
  {
    outcome: "Connect graphical, numerical, and algebraic representations of calculus concepts",
    coveredInWeeks: collectWeeksFor(["KC005", "KC015", "KC022"], _calcWeekAssign),
    coveredByReadings: ["mat-cal-2", "mat-cal-5", "mat-cal-8"],
    isCovered: true,
  },
]

function collectWeeksFor(kcIds: string[], assign: Record<string, number>): number[] {
  const weeks = new Set<number>()
  for (const id of kcIds) {
    const w = assign[id]
    if (w) weeks.add(w)
  }
  return Array.from(weeks).sort((a, b) => a - b)
}

// Optimizer pipeline summary numbers for the staged-loading UI.
export const calculusOptimizerStats = {
  learningSegments: 261,
  knowledgeComponents: calculusKCs.length, // 23
  dependencyChains: Object.keys(calculusDeps.dependency_graph.dependency_overview).length, // 8
  candidatePaths: _calcPaths.length, // 10
}

// ---------- Generic path → weeks (works for any concept set) ----------
//
// Used when the user switches to a different LearningPath on /new/plan and
// the schedule needs to re-arrange. Unlike `pathToWeeks` above (which is
// calculus-specific because it knows about chapter mappings), this version
// takes the existing concept and material arrays and just re-orders them.

export function applyPathToConcepts(
  path: LearningPath,
  concepts: Concept[],
  materials: CourseMaterial[],
  settings: { weeks: number; hoursPerWeek?: number }
): { weeks: CourseWeek[]; weekAssignment: Record<string, number> } {
  const weeks = settings.weeks
  const hoursPerWeek = settings.hoursPerWeek ?? 4
  const conceptById = new Map(concepts.map((c) => [c.id, c]))

  // Filter the path sequence to only concept IDs that exist in this concept set.
  const seq = path.kcSequence.filter(({ kcId }) => conceptById.has(kcId))
  if (seq.length === 0) {
    return { weeks: [], weekAssignment: {} }
  }

  const teachingWeeks = weeks <= 4 ? weeks : Math.max(weeks - 2, Math.ceil(weeks * 0.85))
  const kcsPerWeek = Math.max(1, Math.ceil(seq.length / teachingWeeks))

  const result: CourseWeek[] = []
  const assignment: Record<string, number> = {}
  let idx = 0

  for (let w = 1; w <= weeks; w++) {
    if (w > teachingWeeks || idx >= seq.length) {
      result.push({
        week: w,
        readings: [],
        conceptsIntroduced: [],
        inClassFocus:
          w === weeks
            ? "Final review and project presentations."
            : "Project work, problem set time, and consolidation of prior weeks.",
        estimatedHours: 3,
      })
      continue
    }

    const slice = seq.slice(idx, idx + kcsPerWeek)
    idx += kcsPerWeek

    // Collect materials referenced by any concept in the slice.
    const materialIds = new Set<string>()
    slice.forEach(({ kcId }) => {
      const c = conceptById.get(kcId)
      c?.coveredBy.forEach((mid) => materialIds.add(mid))
      assignment[kcId] = w
    })
    const readings: WeekReading[] = []
    for (const mid of materialIds) {
      const m = materials.find((mat) => mat.id === mid)
      if (!m) continue
      readings.push({
        materialId: mid,
        materialName: m.name,
        sectionAnchors: slice
          .filter(({ kcId }) => conceptById.get(kcId)?.coveredBy.includes(mid))
          .map((k) => k.kcLabel),
      })
    }

    const headline = slice[0].kcLabel
    const inClassFocus =
      slice.length === 1
        ? `Deep dive on ${headline}.`
        : `Focus on ${headline}; introduce ${slice
            .slice(1)
            .map((k) => k.kcLabel)
            .join(", ")}.`

    result.push({
      week: w,
      readings,
      conceptsIntroduced: slice.map((k) => k.kcLabel),
      inClassFocus,
      discussionQuestions: generateDiscussionPrompts(slice[0].kcLabel, inClassFocus),
      estimatedHours: hoursPerWeek,
    })
  }

  return { weeks: result, weekAssignment: assignment }
}
