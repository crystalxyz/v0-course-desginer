"use client"

import { useCallback, useMemo } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import type { Concept } from "@/lib/course-types"
import { cn } from "@/lib/utils"

interface ConceptGraphProps {
  concepts: Concept[]
  currentWeek?: number
  gapConcepts?: string[]
}

const nodeColors: Record<number, string> = {
  1: "bg-blue-500",
  2: "bg-blue-500",
  3: "bg-emerald-500",
  4: "bg-emerald-500",
  5: "bg-amber-500",
  6: "bg-amber-500",
  7: "bg-rose-500",
  8: "bg-rose-500",
  9: "bg-purple-500",
  10: "bg-purple-500",
  11: "bg-cyan-500",
  12: "bg-cyan-500",
  13: "bg-orange-500",
  14: "bg-orange-500",
}

function ConceptNode({ data }: { data: { label: string; week?: number; isGap?: boolean } }) {
  const bgColor = data.week ? nodeColors[data.week] || "bg-secondary" : "bg-secondary"

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg text-xs font-medium shadow-sm border transition-all",
        data.isGap
          ? "bg-destructive/10 border-destructive text-destructive"
          : bgColor + " border-border text-white"
      )}
    >
      {data.label}
      {data.week && !data.isGap && (
        <span className="ml-1.5 text-[10px] opacity-75">W{data.week}</span>
      )}
      {data.isGap && (
        <span className="ml-1.5 text-[10px]">Gap</span>
      )}
    </div>
  )
}

const nodeTypes = {
  concept: ConceptNode,
}

export function ConceptGraph({ concepts, currentWeek, gapConcepts = [] }: ConceptGraphProps) {
  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = []
    const edgeList: Edge[] = []
    const conceptMap = new Map(concepts.map((c) => [c.name, c]))

    // Position nodes in a hierarchical layout
    const levels = new Map<string, number>()
    const visited = new Set<string>()

    function getLevel(conceptName: string): number {
      if (levels.has(conceptName)) return levels.get(conceptName)!
      if (visited.has(conceptName)) return 0

      visited.add(conceptName)
      const concept = conceptMap.get(conceptName)
      if (!concept || concept.dependencies.length === 0) {
        levels.set(conceptName, 0)
        return 0
      }

      const maxDepLevel = Math.max(
        ...concept.dependencies.map((dep) => {
          const depConcept = concepts.find((c) => c.id === dep || c.name === dep)
          return depConcept ? getLevel(depConcept.name) + 1 : 0
        })
      )
      levels.set(conceptName, maxDepLevel)
      return maxDepLevel
    }

    concepts.forEach((c) => getLevel(c.name))

    // Group by level for positioning
    const levelGroups: Map<number, Concept[]> = new Map()
    concepts.forEach((concept) => {
      const level = levels.get(concept.name) || 0
      if (!levelGroups.has(level)) levelGroups.set(level, [])
      levelGroups.get(level)!.push(concept)
    })

    // Create nodes with positions
    levelGroups.forEach((conceptsAtLevel, level) => {
      conceptsAtLevel.forEach((concept, index) => {
        const y = level * 100 + 50
        const x = (index - (conceptsAtLevel.length - 1) / 2) * 180 + 300

        nodeList.push({
          id: concept.id,
          type: "concept",
          position: { x, y },
          data: {
            label: concept.name,
            week: concept.weekIntroduced,
            isGap: concept.isGap || gapConcepts.includes(concept.name),
          },
          sourcePosition: Position.Bottom,
          targetPosition: Position.Top,
        })
      })
    })

    // Create edges
    concepts.forEach((concept) => {
      concept.dependencies.forEach((dep) => {
        const sourceNode = concepts.find((c) => c.id === dep || c.name === dep)
        if (sourceNode) {
          edgeList.push({
            id: `${sourceNode.id}-${concept.id}`,
            source: sourceNode.id,
            target: concept.id,
            type: "smoothstep",
            animated: false,
            style: { stroke: "var(--border)", strokeWidth: 1.5 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: "var(--border)",
            },
          })
        }
      })
    })

    return { nodes: nodeList, edges: edgeList }
  }, [concepts, gapConcepts])

  const [nodesState, , onNodesChange] = useNodesState(nodes)
  const [edgesState, , onEdgesChange] = useEdgesState(edges)

  return (
    <div className="h-full w-full bg-card rounded-lg border border-border">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.3}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="var(--border)" gap={20} size={1} />
        <Controls
          showInteractive={false}
          className="!bg-card !border-border !shadow-sm"
        />
      </ReactFlow>
    </div>
  )
}
