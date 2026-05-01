"use client"

import { useCallback, useMemo, useState, useEffect, useRef } from "react"
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
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
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AlertTriangle, Layers, Network, Maximize2 } from "lucide-react"
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
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-border !w-2 !h-2" />
    </div>
  )
}

// Lane header node for week labels
function LaneHeaderNode({ data }: { data: { week: number; topic: string } }) {
  const colors = weekColors[data.week] || weekColors[1]
  
  return (
    <div className={cn(
      "px-3 py-2 rounded-lg text-xs font-semibold shadow-sm border-2 min-w-[80px]",
      colors.bg, colors.border, colors.text
    )}>
      <div className="flex flex-col gap-0.5">
        <span>Week {data.week}</span>
        {data.topic && (
          <span className="text-[10px] opacity-80 font-normal truncate max-w-[120px]">{data.topic}</span>
        )}
      </div>
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
  laneHeader: LaneHeaderNode,
}

const edgeTypes = {
  gap: GapEdge,
}

type LayoutMode = "layered" | "force"

// Week topics for display
const weekTopics: Record<number, string> = {
  1: "Foundations",
  2: "Gradient Comm",
  3: "Ring/PS",
  4: "Sync/Async",
  5: "Memory Opt",
  6: "ZeRO",
  7: "Review",
  8: "Serving",
  9: "Inference Opt",
  10: "Features",
  11: "Pipelines",
  12: "GPU Deep Dive",
  13: "Projects",
  14: "Wrap-up",
}

function ConceptGraphInner({ 
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
  const reactFlowInstance = useReactFlow()

  const { nodes, edges, gapEdgeCount, upwardEdgeCount } = useMemo(() => {
    const nodeList: Node[] = []
    const edgeList: Edge[] = []
    const conceptMap = new Map(concepts.map((c) => [c.id, c]))
    const conceptByName = new Map(concepts.map((c) => [c.name, c]))

    // Determine which concepts to highlight based on hover state
    const highlightedConcepts = new Set<string>()
    
    if (hoverState?.type === "material" && hoverState.id) {
      concepts.forEach(c => {
        if (c.coveredBy.includes(hoverState.id!)) {
          highlightedConcepts.add(c.id)
        }
      })
    } else if (hoverState?.type === "week" && hoverState.weekNumber) {
      concepts.forEach(c => {
        if (c.weekIntroduced === hoverState.weekNumber) {
          highlightedConcepts.add(c.id)
        }
      })
    }

    // VERTICAL LAYOUT: weeks stacked top-to-bottom
    if (layoutMode === "layered") {
      // Group concepts by week
      const weekGroups: Map<number, Concept[]> = new Map()
      concepts.forEach((concept) => {
        const week = concept.weekIntroduced || 0
        if (!weekGroups.has(week)) weekGroups.set(week, [])
        weekGroups.get(week)!.push(concept)
      })

      // Sort weeks and create rows (top to bottom)
      const sortedWeeks = Array.from(weekGroups.keys()).sort((a, b) => a - b)
      const laneHeight = 80 // Height for each week row
      const nodeSpacing = 140 // Horizontal spacing between concepts
      const laneHeaderWidth = 100 // Width for lane header

      sortedWeeks.forEach((week, rowIndex) => {
        const y = rowIndex * laneHeight + 40
        
        // Add lane header (sticky week label on left)
        nodeList.push({
          id: `lane-header-${week}`,
          type: "laneHeader",
          position: { x: 0, y: y - 8 },
          data: {
            week,
            topic: weekTopics[week] || "",
          },
          draggable: false,
          selectable: false,
        })

        // Add concept nodes in this week's lane
        const conceptsInWeek = weekGroups.get(week)!
        conceptsInWeek.forEach((concept, colIndex) => {
          const isHighlighted = highlightedConcepts.size > 0 && highlightedConcepts.has(concept.id)
          const isDimmed = highlightedConcepts.size > 0 && !highlightedConcepts.has(concept.id)

          nodeList.push({
            id: concept.id,
            type: "concept",
            position: { 
              x: laneHeaderWidth + 20 + colIndex * nodeSpacing, 
              y: y
            },
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
    } else {
      // Force-directed layout with y-constraint by week
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

      // Group by week for y-banding
      const weekGroups: Map<number, Concept[]> = new Map()
      concepts.forEach((concept) => {
        const week = concept.weekIntroduced || 0
        if (!weekGroups.has(week)) weekGroups.set(week, [])
        weekGroups.get(week)!.push(concept)
      })

      const sortedWeeks = Array.from(weekGroups.keys()).sort((a, b) => a - b)
      const weekYBase: Map<number, number> = new Map()
      sortedWeeks.forEach((week, index) => {
        weekYBase.set(week, index * 100 + 50)
      })

      // Position nodes with y constrained by week
      const nodeSpacing = 150
      weekGroups.forEach((conceptsInWeek, week) => {
        const baseY = weekYBase.get(week) || 0
        const totalWidth = (conceptsInWeek.length - 1) * nodeSpacing
        
        conceptsInWeek.forEach((concept, index) => {
          const x = index * nodeSpacing - totalWidth / 2 + 400
          const level = levels.get(concept.id) || 0
          // Add slight y offset based on dependency level
          const y = baseY + (level % 2) * 20
          
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
    let gapCount = 0
    let upwardCount = 0
    
    concepts.forEach((concept) => {
      concept.dependencies.forEach((dep) => {
        const sourceNode = conceptMap.get(dep) || conceptByName.get(dep)
        if (sourceNode) {
          // Check if this is a gap edge (prerequisite introduced after dependent)
          // This means a concept references something from a LATER week = amber upward edge
          const isGapEdge = sourceNode.weekIntroduced && concept.weekIntroduced && 
            sourceNode.weekIntroduced > concept.weekIntroduced
          
          if (isGapEdge) {
            gapCount++
            upwardCount++
          }

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

    return { nodes: nodeList, edges: edgeList, gapEdgeCount: gapCount, upwardEdgeCount: upwardCount }
  }, [concepts, gapConcepts, layoutMode, hoverState])

  const [nodesState, setNodes, onNodesChange] = useNodesState(nodes)
  const [edgesState, setEdges, onEdgesChange] = useEdgesState(edges)

  // Update nodes when external data changes
  useEffect(() => {
    setNodes(nodes)
    setEdges(edges)
  }, [nodes, edges, setNodes, setEdges])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    if (node.type === "laneHeader") return
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
    if (node.type === "laneHeader") return
    if (onHoverChange) {
      onHoverChange({ type: "concept", id: node.id })
    }
  }, [onHoverChange])

  const handleNodeMouseLeave = useCallback(() => {
    if (onHoverChange) {
      onHoverChange({ type: null, id: null })
    }
  }, [onHoverChange])

  const handleFitView = useCallback(() => {
    reactFlowInstance.fitView({ padding: 0.2 })
  }, [reactFlowInstance])

  const showMinimap = concepts.length > 20

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
          <Button variant="ghost" size="sm" onClick={handleFitView} className="h-7 px-2">
            <Maximize2 className="h-3 w-3" />
          </Button>
          {gapEdgeCount > 0 && (
            <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-600 border-amber-200">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {gapEdgeCount} gap{gapEdgeCount > 1 ? "s" : ""}
            </Badge>
          )}
        </div>
      </div>

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
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.2}
          maxZoom={1.5}
          proOptions={{ hideAttribution: true }}
          className="bg-card"
          panOnScroll
          zoomOnScroll
        >
          <Background color="var(--border)" gap={20} size={1} />
          <Controls
            showInteractive={false}
            className="!bg-card !border-border !shadow-sm"
          />
          {showMinimap && (
            <MiniMap 
              nodeStrokeWidth={3}
              zoomable
              pannable
              className="!bg-card !border-border"
            />
          )}
        </ReactFlow>
      </div>
    </div>
  )
}

export function ConceptGraph(props: ConceptGraphProps) {
  return (
    <ReactFlowProvider>
      <ConceptGraphInner {...props} />
    </ReactFlowProvider>
  )
}
