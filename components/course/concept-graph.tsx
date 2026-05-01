"use client"

import { useMemo, useCallback, useState } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  Position,
  MarkerType,
  type Node,
  type Edge,
  type NodeProps,
  Handle,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import dagre from "@dagrejs/dagre"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Concept } from "@/lib/course-types"
import {
  kcsToGraph,
  type ConceptGraphNodeData,
} from "@/lib/optimizer-data"

const NODE_WIDTH = 220
const NODE_HEIGHT = 64

function complexityColor(c: number): { bg: string; border: string; text: string } {
  if (c >= 0.7) return { bg: "bg-rose-50", border: "border-rose-300", text: "text-rose-900" }
  if (c >= 0.55) return { bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-900" }
  if (c >= 0.45) return { bg: "bg-sky-50", border: "border-sky-300", text: "text-sky-900" }
  return { bg: "bg-emerald-50", border: "border-emerald-300", text: "text-emerald-900" }
}

type KCNodeData = ConceptGraphNodeData & {
  highlighted?: boolean
  dimmed?: boolean
  selected?: boolean
} & Record<string, unknown>

function KCNode({ data }: NodeProps<Node<KCNodeData>>) {
  const colors = complexityColor(data.complexity)
  return (
    <>
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground/40" />
      <div
        style={{ width: NODE_WIDTH }}
        className={cn(
          "rounded-lg border-2 px-3 py-2 transition-all shadow-sm",
          colors.bg,
          colors.border,
          colors.text,
          data.selected && "ring-2 ring-primary ring-offset-2",
          data.dimmed && "opacity-30",
          data.highlighted && "shadow-md scale-[1.03]"
        )}
      >
        <div className="flex items-start justify-between gap-2 mb-1">
          {data.weekIntroduced ? (
            <Badge variant="secondary" className="text-[10px] h-4 px-1.5 shrink-0">
              W{data.weekIntroduced}
            </Badge>
          ) : (
            <span />
          )}
          <span className="text-[10px] font-mono opacity-60 tabular-nums">
            {(data.complexity).toFixed(1)}
          </span>
        </div>
        <p className="text-xs font-semibold leading-tight line-clamp-2">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground/40" />
    </>
  )
}

const nodeTypes = { kc: KCNode }

function layoutGraph(nodes: Node[], edges: Edge[]): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: "TB", nodesep: 30, ranksep: 70, marginx: 20, marginy: 20 })

  nodes.forEach((n) => g.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT }))
  edges.forEach((e) => g.setEdge(e.source, e.target))

  dagre.layout(g)

  return nodes.map((n) => {
    const pos = g.node(n.id)
    return {
      ...n,
      position: { x: pos.x - NODE_WIDTH / 2, y: pos.y - NODE_HEIGHT / 2 },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
    }
  })
}

interface ConceptGraphProps {
  concepts: Concept[]
  selectedConceptId?: string
  onConceptClick?: (concept: Concept) => void
}

function InnerConceptGraph({
  concepts,
  selectedConceptId,
  onConceptClick,
}: ConceptGraphProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Build full ancestor / descendant sets so hovering a node lights up its
  // entire prerequisite + dependent chain. Edges come from each concept's
  // own `dependencies` array, so the same component works for both the
  // calculus KC graph and the ML Systems concept graph.
  const { incomers, outgoers } = useMemo(() => {
    const inMap = new Map<string, Set<string>>()
    const outMap = new Map<string, Set<string>>()
    for (const c of concepts) {
      for (const dep of c.dependencies) {
        if (!outMap.has(dep)) outMap.set(dep, new Set())
        outMap.get(dep)!.add(c.id)
        if (!inMap.has(c.id)) inMap.set(c.id, new Set())
        inMap.get(c.id)!.add(dep)
      }
    }
    function transitive(start: string, edges: Map<string, Set<string>>): Set<string> {
      const seen = new Set<string>()
      const stack = [start]
      while (stack.length) {
        const cur = stack.pop()!
        for (const next of edges.get(cur) ?? []) {
          if (!seen.has(next)) {
            seen.add(next)
            stack.push(next)
          }
        }
      }
      return seen
    }
    return {
      incomers: (id: string) => transitive(id, inMap),
      outgoers: (id: string) => transitive(id, outMap),
    }
  }, [concepts])

  const baseNodes: Node<KCNodeData>[] = useMemo(
    () =>
      concepts.map((c) => {
        const data = c as Concept & { description?: string }
        return {
          id: c.id,
          type: "kc",
          position: { x: 0, y: 0 },
          data: {
            label: c.name,
            complexity: 0.5,
            weekIntroduced: c.weekIntroduced,
            description: data.description ?? "",
            cognitiveType: "",
          },
        }
      }),
    [concepts]
  )

  const baseEdges: Edge[] = useMemo(() => {
    const conceptIds = new Set(concepts.map((c) => c.id))
    const edges: Edge[] = []
    for (const c of concepts) {
      for (const dep of c.dependencies) {
        if (!conceptIds.has(dep)) continue
        edges.push({
          id: `${dep}-${c.id}`,
          source: dep,
          target: c.id,
          type: "smoothstep",
          markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
          style: { stroke: "rgb(148 163 184)", strokeWidth: 1.4 },
        })
      }
    }
    return edges
  }, [concepts])

  // Pull real complexity from the optimizer's KC list when the concept ID
  // matches a calculus KC; otherwise estimate from prerequisite count.
  const enrichedNodes: Node<KCNodeData>[] = useMemo(() => {
    const realGraph = kcsToGraph(concepts)
    const complexityById = new Map(
      realGraph.nodes.map((n) => [n.id, n.data.complexity])
    )
    return baseNodes.map((n) => {
      const real = complexityById.get(n.id)
      const c = concepts.find((x) => x.id === n.id)
      const complexity =
        typeof real === "number" && !Number.isNaN(real) && real > 0
          ? real
          : c
            ? estimateComplexity(c)
            : 0.5
      return { ...n, data: { ...n.data, complexity } }
    })
  }, [baseNodes, concepts])

  // Apply layout once (depends on concepts identity).
  const laidOut = useMemo(() => layoutGraph(enrichedNodes, baseEdges), [enrichedNodes, baseEdges])

  // Compute highlight sets when something is hovered or selected.
  const focusId = hoveredId ?? selectedConceptId ?? null
  const { highlightedSet, dimNonHighlighted } = useMemo(() => {
    if (!focusId) return { highlightedSet: new Set<string>(), dimNonHighlighted: false }
    const set = new Set<string>([focusId])
    incomers(focusId).forEach((x) => set.add(x))
    outgoers(focusId).forEach((x) => set.add(x))
    return { highlightedSet: set, dimNonHighlighted: true }
  }, [focusId, incomers, outgoers])

  const nodes: Node<KCNodeData>[] = useMemo(
    () =>
      laidOut.map((n) => {
        const data = n.data as KCNodeData
        return {
          ...n,
          data: {
            ...data,
            highlighted: highlightedSet.has(n.id),
            dimmed: dimNonHighlighted && !highlightedSet.has(n.id),
            selected: selectedConceptId === n.id,
          },
        }
      }),
    [laidOut, highlightedSet, dimNonHighlighted, selectedConceptId]
  )

  const edges: Edge[] = useMemo(
    () =>
      baseEdges.map((e) => {
        const isOnPath =
          highlightedSet.has(e.source) && highlightedSet.has(e.target)
        return {
          ...e,
          animated: isOnPath,
          style: {
            stroke: isOnPath ? "rgb(99 102 241)" : "rgb(148 163 184)",
            strokeWidth: isOnPath ? 2 : 1.4,
            opacity: dimNonHighlighted && !isOnPath ? 0.15 : 1,
          },
        }
      }),
    [baseEdges, highlightedSet, dimNonHighlighted]
  )

  const handleClick = useCallback(
    (_: unknown, node: Node) => {
      const c = concepts.find((x) => x.id === node.id)
      if (c) onConceptClick?.(c)
    },
    [concepts, onConceptClick]
  )

  return (
    <Card className="h-full overflow-hidden p-0 relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeMouseEnter={(_, n) => setHoveredId(n.id)}
        onNodeMouseLeave={() => setHoveredId(null)}
        onNodeClick={handleClick}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        proOptions={{ hideAttribution: true }}
        minZoom={0.2}
        maxZoom={1.6}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background gap={20} size={1} color="rgb(226 232 240)" />
        <Controls showInteractive={false} className="!shadow-sm" />
      </ReactFlow>
      <ComplexityLegend />
    </Card>
  )
}

function ComplexityLegend() {
  const buckets: { label: string; range: string; color: ReturnType<typeof complexityColor> }[] = [
    { label: "Foundational", range: "≤ 0.4", color: complexityColor(0.3) },
    { label: "Building", range: "0.45–0.55", color: complexityColor(0.5) },
    { label: "Applied", range: "0.55–0.7", color: complexityColor(0.6) },
    { label: "Advanced", range: "≥ 0.7", color: complexityColor(0.75) },
  ]
  return (
    <div className="absolute bottom-3 right-3 bg-card/95 backdrop-blur border border-border rounded-md p-2 text-[10px] shadow-sm pointer-events-none">
      <p className="font-medium text-muted-foreground mb-1.5 px-1">Complexity</p>
      <div className="flex flex-col gap-1">
        {buckets.map((b) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <span className={cn("h-3 w-3 rounded-sm border", b.color.bg, b.color.border)} />
            <span className="text-foreground">{b.label}</span>
            <span className="text-muted-foreground tabular-nums ml-auto">{b.range}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Estimate complexity from prerequisite depth when not directly available.
// Roots (no dependencies) → 0.4, deeper KCs scale up.
function estimateComplexity(concept: Concept): number {
  if (concept.dependencies.length === 0) return 0.4
  if (concept.dependencies.length >= 4) return 0.75
  if (concept.dependencies.length >= 2) return 0.6
  return 0.5
}

export function ConceptGraph(props: ConceptGraphProps) {
  // ReactFlow requires a Provider parent for some hooks; wrap defensively.
  return (
    <ReactFlowProvider>
      <InnerConceptGraph {...props} />
    </ReactFlowProvider>
  )
}
