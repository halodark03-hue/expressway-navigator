import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Edge, Node } from "@/data/expressway";

export type EdgeStyle = "default" | "active" | "path" | "mst" | "negative";
export type NodeStyle = "default" | "visited" | "active" | "path" | "source" | "target";

type Props = {
  nodes: Node[];
  edges: Edge[];
  edgeStyles?: Record<string, EdgeStyle>;
  nodeStyles?: Record<string, NodeStyle>;
  edgeLabels?: Record<string, string>;
  nodeBadges?: Record<string, string>;
  onNodeClick?: (id: string) => void;
  height?: number;
};

const NODE_COLORS: Record<NodeStyle, string> = {
  default: "var(--node)",
  visited: "var(--node-visited)",
  active: "var(--node-active)",
  path: "var(--node-path)",
  source: "var(--node-source)",
  target: "var(--node-target)",
};
const EDGE_COLORS: Record<EdgeStyle, string> = {
  default: "var(--edge)",
  active: "var(--edge-active)",
  path: "var(--edge-path)",
  mst: "var(--edge-mst)",
  negative: "var(--edge-negative)",
};
const EDGE_WIDTHS: Record<EdgeStyle, number> = {
  default: 1.6, active: 3, path: 4, mst: 3.4, negative: 3.4,
};

export function GraphCanvas({
  nodes: initialNodes, edges, edgeStyles = {}, nodeStyles = {},
  edgeLabels = {}, nodeBadges = {}, onNodeClick, height = 520,
}: Props) {
  const [nodes, setNodes] = useState(initialNodes);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const dragRef = useRef<{ id: string | null; offX: number; offY: number }>({ id: null, offX: 0, offY: 0 });
  const panRef = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number }>({ active: false, sx: 0, sy: 0, ox: 0, oy: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => { setNodes(initialNodes); }, [initialNodes]);

  const nodeMap: Record<string, Node> = {};
  nodes.forEach((n) => (nodeMap[n.id] = n));

  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const sx = (clientX - rect.left) * (1000 / rect.width);
    const sy = (clientY - rect.top) * (600 / rect.height);
    return { x: (sx - transform.x) / transform.k, y: (sy - transform.y) / transform.k };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current.id) {
      const { x, y } = toSvg(e.clientX, e.clientY);
      setNodes((ns) => ns.map((n) => n.id === dragRef.current.id ? { ...n, x: x - dragRef.current.offX, y: y - dragRef.current.offY } : n));
    } else if (panRef.current.active) {
      const dx = e.clientX - panRef.current.sx;
      const dy = e.clientY - panRef.current.sy;
      const rect = svgRef.current!.getBoundingClientRect();
      setTransform((t) => ({ ...t, x: panRef.current.ox + dx * (1000 / rect.width), y: panRef.current.oy + dy * (600 / rect.height) }));
    }
  };
  const endInteraction = () => { dragRef.current.id = null; panRef.current.active = false; };

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.1 : 0.9;
    const { x, y } = toSvg(e.clientX, e.clientY);
    setTransform((t) => {
      const k = Math.max(0.4, Math.min(3, t.k * factor));
      return { k, x: t.x - (x * (k - t.k)), y: t.y - (y * (k - t.k)) };
    });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-xl glass" style={{ height }}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        className="w-full h-full touch-none select-none cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
          if (e.target === svgRef.current) {
            panRef.current = { active: true, sx: e.clientX, sy: e.clientY, ox: transform.x, oy: transform.y };
          }
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endInteraction}
        onPointerLeave={endInteraction}
        onWheel={onWheel as unknown as React.WheelEventHandler<SVGSVGElement>}
      >
        <defs>
          <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g transform={`translate(${transform.x} ${transform.y}) scale(${transform.k})`}>
          {edges.map((e) => {
            const a = nodeMap[e.source], b = nodeMap[e.target];
            if (!a || !b) return null;
            const style = edgeStyles[e.id] ?? "default";
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            const label = edgeLabels[e.id] ?? String(e.weight);
            return (
              <g key={e.id}>
                <motion.line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={EDGE_COLORS[style]}
                  strokeWidth={EDGE_WIDTHS[style]}
                  strokeLinecap="round"
                  initial={false}
                  animate={{ opacity: style === "default" ? 0.7 : 1 }}
                  transition={{ duration: 0.4 }}
                />
                <rect x={mx - 14} y={my - 9} width={28} height={16} rx={5}
                  fill="oklch(0.18 0.06 280 / 0.85)" stroke="oklch(0.85 0.05 270 / 0.25)" />
                <text x={mx} y={my + 3} fontSize={10} fill="oklch(0.95 0.01 250)" textAnchor="middle" fontFamily="ui-monospace, monospace">
                  {label}
                </text>
              </g>
            );
          })}
          <AnimatePresence>
            {nodes.map((n) => {
              const style = nodeStyles[n.id] ?? "default";
              const badge = nodeBadges[n.id];
              return (
                <motion.g
                  key={n.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  style={{ cursor: "pointer" }}
                  onPointerDown={(e) => {
                    e.stopPropagation();
                    const { x, y } = toSvg(e.clientX, e.clientY);
                    dragRef.current = { id: n.id, offX: x - n.x, offY: y - n.y };
                  }}
                  onClick={(e) => { e.stopPropagation(); onNodeClick?.(n.id); }}
                >
                  <motion.circle
                    cx={n.x} cy={n.y} r={22}
                    fill={NODE_COLORS[style]}
                    stroke="oklch(0.97 0.01 250 / 0.7)"
                    strokeWidth={1.5}
                    animate={{
                      r: style === "active" ? 26 : 22,
                      filter: style !== "default" ? "drop-shadow(0 0 8px currentColor)" : "none",
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <circle cx={n.x - 6} cy={n.y - 6} r={10} fill="url(#nodeGlow)" pointerEvents="none" />
                  <text x={n.x} y={n.y + 4} fontSize={9} fill="white" textAnchor="middle" fontWeight={700} pointerEvents="none">
                    {n.id}
                  </text>
                  <text x={n.x} y={n.y + 38} fontSize={11} fill="oklch(0.85 0.04 260)" textAnchor="middle" pointerEvents="none">
                    {n.label}
                  </text>
                  {badge && (
                    <g pointerEvents="none">
                      <rect x={n.x + 12} y={n.y - 32} width={Math.max(22, badge.length * 7)} height={16} rx={8}
                        fill="oklch(0.78 0.2 60)" />
                      <text x={n.x + 12 + Math.max(22, badge.length * 7) / 2} y={n.y - 20} fontSize={10} fontWeight={700} fill="oklch(0.15 0.05 280)" textAnchor="middle">
                        {badge}
                      </text>
                    </g>
                  )}
                </motion.g>
              );
            })}
          </AnimatePresence>
        </g>
      </svg>
      <div className="absolute bottom-3 right-3 flex gap-2 text-xs">
        <button className="glass-strong px-2 py-1 rounded-md" onClick={() => setTransform({ x: 0, y: 0, k: 1 })}>Reset view</button>
      </div>
    </div>
  );
}