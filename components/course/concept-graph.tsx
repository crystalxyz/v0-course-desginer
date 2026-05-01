"use client"

import { useCallback, useMemo, useState } from "react"
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
  Handle,
  EdgeProps,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlertTriangle, Layers, Network, BookOpen, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Concept, CourseMaterial, HoverState } from "@/lib/course-types"

interface ConceptGraphProps {
  concepts: Concept[]
  materials?: CourseMaterial[]
  currentWeek?: number
  gapConcepts?: string[]
  onConceptClick?: (concept: Concept) => void
  onEdgeClick?: (sourceId: string, targetId: string, concepts: Concept[]) => void
  hoverState?: HoverState
  onHoverChange?: (state: HoverState) => void
}

// Sequential color palette for weeks (cool to warm)
const weekColors: Record<number, { bg: string; border: string; text: string }> = {
  1: { bg: "bg-blue-500", border: "border-blue-400", text: "text-blue-100" },
  2: { bg: "bg-blue-400", border: "border-blue-300", text: "text-blue-50" },
  3: { bg: "bg-cyan-500", border: "border-cyan-400", text: "text-cyan-100" },
  4: { bg: "bg-teal-500", border: "border-teal-400", text: "text-teal-100" },
  5: { bg: "bg-emerald-500", border: "border-emerald-400", text: "text-emerald-100" },
  6: { bg: "bg-green-500", border: "border-green-400", text: "text-green-100" },
  7: { bg: "bg-lime-500", border: "border-lime-400", text: "text-lime-100" },
  8: { bg: "bg-yellow-500", border: "border-yellow-400", text: "text-yellow-900" },
  9: { bg: "bg-amber-500", border: "border-amber-400", text: "text-amber-900" },
  10: { bg: "bg-orange-500", border: "border-orange-400", text: "text-orange-100" },
  11: { bg: "bg-red-400", border: "border-red-300", text: "text-red-100" },
  12: { bg: "bg-rose-500", border: "border-rose-400", text: "text-rose-100" },
  13: { bg: "bg-pink-500", border: "border-pink-400", text: "text-pink-100" },
  14: { bg: "bg-fuchsia-500", border: "border-fuchsia-400", text: "text-fuchsia-100" },
}

function ConceptNode({ 
  data, 
  selected 
}: { 
  data: { 
    label: string
    week?: number
    isGap?: boolean
    materials?: string[]
    isHighlighted?: boolean
    isDimmed?: boolean
  }
  selected?: boolean 
}) {
  const colors = data.week ? weekColors[data.week] || weekColors[1] : weekColors[1]

  return (
    <div
      className={cn(
        "px-3 py-2 rounded-lg text-xs font-medium shadow-sm border-2 transition-all cursor-pointer",
        "hover:shadow-md hover:scale-105",
        data.isGap
          ? "bg-amber-500/20 border-amber-500 text-amber-700"
          : `${colors.bg} ${colors.border} ${colors.text}`,
        selected && "ring-2 ring-primary ring-offset-2",
        data.isHighlighted && "ring-2 ring-accent ring-offset-1 scale-105",
        data.isDimmed && "opacity-30"
      )}
    >
      <Handle type="target" position={Position.Top} className="!bg-border !w-2 !h-2" />
      <div className="flex items-center gap-1.5">
        {data.isGap && <AlertTriangle className="h-3 w-3 text-amber-600" />}
        <span>{data.label}</span>
        {data.week && !data.isGap && (
          <span className="text-[10px] opacity-75 ml-1">W{data.week}</span>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2" />
    </div>
  )
}

// Custom edge with gap warning indicator
function GapEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  style,
  markerEnd,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  const isGapEdge = data?.isGap

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: isGapEdge ? "rgb(245 158 11)" : "var(--border)",
          strokeWidth: isGapEdge ? 2.5 : 1.5,
          strokeDasharray: isGapEdge ? "5,5" : undefined,
        }}
      />
      {isGapEdge && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <div className="bg-amber-500 text-amber-950 rounded-full p-1 shadow-sm cursor-pointer hover:scale-110 transition-transform">
              <AlertTriangle className="h-3 w-3" />
            </div>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}

const nodeTypes = {
  concept: ConceptNode,
}

const edgeTypes = {
  gap: GapEdge,
}

type LayoutMode = "force" | "layered"

export function ConceptGraph({ 
  concepts, 
  materials = [],
  currentWeek, 
  gapConcepts = [],
  onConceptClick,
  onEdgeClick,
  hoverState,
  onHoverChange,
}: ConceptGraphProps) {
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("layered")
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  const { nodes, edges } = useMemo(() => {
    const nodeList: Node[] = []
    const edgeList: Edge[] = []
    const conceptMap = new Map(concepts.map((c) => [c.id, c]))
    const conceptByName = new Map(concepts.map((c) => [c.name, c]))

    // Determine which concepts to highlight based on hover state
    const highlightedConcepts = new Set<string>()
    const highlightedMaterials = new Set<string>()
    
    if (hoverState?.type === "material" && hoverState.id) {
      // Highlight concepts from this material
      concepts.forEach(c => {
        if (c.coveredBy.includes(hoverState.id!)) {
          highlightedConcepts.add(c.id)
        }
      })
    } else if (hoverState?.type === "week" && hoverState.weekNumber) {
      // Highlight concepts introduced in this week
      concepts.forEach(c => {
        if (c.weekIntroduced === hoverState.weekNumber) {
          highlightedConcepts.add(c.id)
        }
      })
    }

    if (layoutMode === "layered") {
      // Group concepts by week for layered layout
      const weekGroups: Map<number, Concept[]> = new Map()
      concepts.forEach((concept) => {
        const week = concept.weekIntroduced || 0
        if (!weekGroups.has(week)) weekGroups.set(week, [])
        weekGroups.get(week)!.push(concept)
      })

      // Sort weeks and create columns
      const sortedWeeks = Array.from(weekGroups.keys()).sort((a, b) => a - b)
      const columnWidth = 160
      const rowHeight = 70

      sortedWeeks.forEach((week, colIndex) => {
        const conceptsInWeek = weekGroups.get(week)!
        conceptsInWeek.forEach((concept, rowIndex) => {
          const isHighlighted = highlightedConcepts.size > 0 && highlightedConcepts.has(concept.id)
          const isDimmed = highlightedConcepts.size > 0 && !highlightedConcepts.has(concept.id)

          nodeList.push({
            id: concept.id,
            type: "concept",
            position: { 
              x: colIndex * columnWidth + 50, 
              y: rowIndex * rowHeight + 50 
            },
            data: {
              label: concept.name,
              week: concept.weekIntroduced,
              isGap: concept.isGap || gapConcepts.includes(concept.name),
              materials: concept.coveredBy,
              isHighlighted,
              isDimmed,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
          })
        })
      })
    } else {
      // Force-directed / hierarchical layout
      const levels = new Map<string, number>()
      const visited = new Set<string>()

      function getLevel(conceptId: string): number {
        if (levels.has(conceptId)) return levels.get(conceptId)!
        if (visited.has(conceptId)) return 0

        visited.add(conceptId)
        const concept = conceptMap.get(conceptId)
        if (!concept || concept.dependencies.length === 0) {
          levels.set(conceptId, 0)
          return 0
        }

        const maxDepLevel = Math.max(
          ...concept.dependencies.map((dep) => {
            const depConcept = conceptMap.get(dep) || conceptByName.get(dep)
            return depConcept ? getLevel(depConcept.id) + 1 : 0
          })
        )
        levels.set(conceptId, maxDepLevel)
        return maxDepLevel
      }

      concepts.forEach((c) => getLevel(c.id))

      // Group by level
      const levelGroups: Map<number, Concept[]> = new Map()
      concepts.forEach((concept) => {
        const level = levels.get(concept.id) || 0
        if (!levelGroups.has(level)) levelGroups.set(level, [])
        levelGroups.get(level)!.push(concept)
      })

      // Position nodes
      const levelHeight = 100
      const nodeSpacing = 150

      levelGroups.forEach((conceptsAtLevel, level) => {
        const totalWidth = (conceptsAtLevel.length - 1) * nodeSpacing
        conceptsAtLevel.forEach((concept, index) => {
          const x = index * nodeSpacing - totalWidth / 2 + 300
          const y = level * levelHeight + 50
          
          const isHighlighted = highlightedConcepts.size > 0 && highlightedConcepts.has(concept.id)
          const isDimmed = highlightedConcepts.size > 0 && !highlightedConcepts.has(concept.id)

          nodeList.push({
            id: concept.id,
            type: "concept",
            position: { x, y },
            data: {
              label: concept.name,
              week: concept.weekIntroduced,
              isGap: concept.isGap || gapConcepts.includes(concept.name),
              materials: concept.coveredBy,
              isHighlighted,
              isDimmed,
            },
            sourcePosition: Position.Bottom,
            targetPosition: Position.Top,
          })
        })
      })
    }

    // Create edges with gap detection
    concepts.forEach((concept) => {
      concept.dependencies.forEach((dep) => {
        const sourceNode = conceptMap.get(dep) || conceptByName.get(dep)
        if (sourceNode) {
          // Check if this is a gap edge (prerequisite introduced after dependent)
          const isGapEdge = sourceNode.weekIntroduced && concept.weekIntroduced && 
            sourceNode.weekIntroduced > concept.weekIntroduced

          edgeList.push({
            id: `${sourceNode.id}-${concept.id}`,
            source: sourceNode.id,
            target: concept.id,
            type: isGapEdge ? "gap" : "smoothstep",
            animated: false,
            data: { 
              isGap: isGapEdge,
              sourceWeek: sourceNode.weekIntroduced,
              targetWeek: concept.weekIntroduced,
            },
            style: { 
              stroke: isGapEdge ? "rgb(245 158 11)" : "var(--border)", 
              strokeWidth: isGapEdge ? 2.5 : 1.5 
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 12,
              height: 12,
              color: isGapEdge ? "rgb(245 158 11)" : "var(--border)",
            },
          })
        }
      })
    })

    return { nodes: nodeList, edges: edgeList }
  }, [concepts, gapConcepts, layoutMode, hoverState])

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes)
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges)

  // Update nodes when external data changes
  useMemo(() => {
    setNodes(nodes)
    setEdges(edges)
  }, [nodes, edges, setNodes, setEdges])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id)
    const concept = concepts.find(c => c.id === node.id)
    if (concept && onConceptClick) {
      onConceptClick(concept)
    }
  }, [concepts, onConceptClick])

  const handleEdgeClick = useCallback((event: React.MouseEvent, edge: Edge) => {
    if (onEdgeClick) {
      onEdgeClick(edge.source, edge.target, concepts)
    }
  }, [concepts, onEdgeClick])

  const handleNodeMouseEnter = useCallback((event: React.MouseEvent, node: Node) => {
    if (onHoverChange) {
      onHoverChange({ type: "concept", id: node.id })
    }
  }, [onHoverChange])

  const handleNodeMouseLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange({ type: null, id: null })
    }
  }, [onHoverChange])

  return (
    <div className="h-full w-full flex flex-col bg-card rounded-lg border border-border">
      {/* Layout Toggle */}
      <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
        <ToggleGroup 
          type="single" 
          value={layoutMode} 
          onValueChange={(v) => v && setLayoutMode(v as LayoutMode)}
          className="gap-1"
        >
          <ToggleGroupItem value="layered" size="sm" className="h-7 px-2 text-xs">
            <Layers className="h-3 w-3 mr-1" />
            By Week
          </ToggleGroupItem>
          <ToggleGroupItem value="force" size="sm" className="h-7 px-2 text-xs">
            <Network className="h-3 w-3 mr-1" />
            Dependencies
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex items-center gap-2">
          {edges.filter(e => e.data?.isGap).length > 0 && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {edges.filter(e => e.data?.isGap).length} gap{edges.filter(e => e.data?.isGap).length > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

      {/* Week Legend (for layered view) */}
      {layoutMode === "layered" && (
        <div className="flex items-center gap-1 p-2 border-b border-border overflow-x-auto">
          <span className="text-[10px] text-muted-foreground mr-1">Weeks:</span>
          {Array.from(new Set(concepts.map(c => c.weekIntroduced).filter(Boolean))).sort((a, b) => (a || 0) - (b || 0)).slice(0, 12).map(week => {
            const colors = weekColors[week || 1]
            return (
              <div 
                key={week} 
                className={cn("h-4 w-4 rounded text-[9px] flex items-center justify-center font-medium", colors.bg, colors.text)}
              >
                {week}
              </div>
            )
          })}
        </div>
      )}

      {/* Graph */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodesState}
          edges={edgesState}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={handleNodeClick}
          onEdgeClick={handleEdgeClick}
          onNodeMouseEnter={handleNodeMouseEnter}
          onNodeMouseLeave={handleNodeMouseLeave}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-card"
        >
          <Background color="var(--border)" gap={20} size={1} />
          <Controls
            showInteractive={false}
            className="!bg-card !border-border !shadow-sm"
          />
        </ReactFlow>
      </div>
    </div>
  )
}
