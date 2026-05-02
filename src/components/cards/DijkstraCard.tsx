import { useEffect, useMemo, useState } from "react";
import { Route, Play, RotateCcw } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { GraphCanvas, type EdgeStyle, type NodeStyle } from "../viz/GraphCanvas";
import { LogPanel } from "../viz/LogPanel";
import { CodeExplain } from "../viz/CodeExplain";
import { initialNodes, initialEdges } from "@/data/expressway";
import { runDijkstra } from "@/algorithms/dijkstra";

export function DijkstraCard() {
  const [source, setSource] = useState("DEL");
  const [target, setTarget] = useState("DDN");
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const result = useMemo(() => runDijkstra(initialNodes, initialEdges, source, target), [source, target]);
  useEffect(() => { setStepIdx(-1); setPlaying(false); }, [source, target]);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => {
      setStepIdx((i) => { if (i >= result.steps.length - 1) { setPlaying(false); return i; } return i + 1; });
    }, 600);
    return () => clearTimeout(t);
  }, [playing, stepIdx, result.steps.length]);
  const current = stepIdx >= 0 ? result.steps[stepIdx] : null;
  const done = stepIdx >= result.steps.length - 1;
  const nodeStyles: Record<string, NodeStyle> = {};
  const edgeStyles: Record<string, EdgeStyle> = {};
  const nodeBadges: Record<string, string> = {};
  if (current) {
    current.visited.forEach((n) => (nodeStyles[n] = "visited"));
    if (current.current) nodeStyles[current.current] = "active";
    if (current.edge) edgeStyles[current.edge] = "active";
    Object.entries(current.distances).forEach(([k, v]) => { if (v !== Infinity) nodeBadges[k] = String(v); });
  }
  if (done) {
    result.path.forEach((n) => (nodeStyles[n] = "path"));
    result.pathEdges.forEach((e) => (edgeStyles[e] = "path"));
  }
  nodeStyles[source] = "source";
  nodeStyles[target] = "target";
  const logs = stepIdx >= 0 ? result.steps.slice(0, stepIdx + 1).map((s) => s.log) : [];
  return (
    <SectionCard id="dijkstra" title="Dijkstra — Shortest Path" subtitle="Step-by-step shortest route with live distance labels." icon={<Route className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <GraphCanvas nodes={initialNodes} edges={initialEdges} nodeStyles={nodeStyles} edgeStyles={edgeStyles} nodeBadges={nodeBadges} />
        <div className="space-y-3">
          <div className="glass rounded-xl p-3 grid grid-cols-2 gap-2 text-sm">
            <label className="space-y-1"><span className="text-xs text-muted-foreground">Source</span>
              <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-background/40 rounded-md px-2 py-1.5 border border-border">
                {initialNodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </label>
            <label className="space-y-1"><span className="text-xs text-muted-foreground">Destination</span>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="w-full bg-background/40 rounded-md px-2 py-1.5 border border-border">
                {initialNodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
              </select>
            </label>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setStepIdx(0); setPlaying(true); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
              <Play className="h-4 w-4" /> {playing ? "Running…" : "Run"}
            </button>
            <button onClick={() => { setStepIdx((i) => Math.min(result.steps.length - 1, i + 1)); setPlaying(false); }} className="rounded-xl px-3 py-2 text-sm glass">Step</button>
            <button onClick={() => { setStepIdx(-1); setPlaying(false); }} className="rounded-xl px-3 py-2 text-sm glass"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="glass rounded-xl p-3 text-sm">
            <div className="text-xs uppercase text-muted-foreground">Distance</div>
            <div className="text-2xl font-bold text-gradient">{result.distance === Infinity ? "∞" : `${result.distance} km`}</div>
            <div className="text-xs text-muted-foreground mt-1">Path: {result.path.join(" → ") || "—"}</div>
          </div>
          <CodeExplain title="How it works" points={["Initialize all distances to ∞, source to 0.","Pick the unvisited node with smallest distance.","Relax outgoing edges: if dist[u]+w < dist[v], update.","Reconstruct path from predecessors."]} />
        </div>
      </div>
      <div className="mt-3"><LogPanel logs={logs} /></div>
    </SectionCard>
  );
}
