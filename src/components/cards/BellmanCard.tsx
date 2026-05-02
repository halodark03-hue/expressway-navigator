import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Play, RotateCcw } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { GraphCanvas, type EdgeStyle } from "../viz/GraphCanvas";
import { LogPanel } from "../viz/LogPanel";
import { CodeExplain } from "../viz/CodeExplain";
import { initialNodes, initialEdges } from "@/data/expressway";
import { runBellmanFord } from "@/algorithms/bellman";

export function BellmanCard() {
  const [fuelSavings, setFuelSavings] = useState(180);
  const [source, setSource] = useState("DEL");
  const result = useMemo(() => runBellmanFord(initialNodes, initialEdges, source, (e) => (e.toll ?? 0) - fuelSavings), [source, fuelSavings]);
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => { setIdx(-1); setPlaying(false); }, [fuelSavings, source]);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => { setIdx((i) => { if (i >= result.steps.length - 1) { setPlaying(false); return i; } return i + 1; }); }, 250);
    return () => clearTimeout(t);
  }, [playing, idx, result.steps.length]);
  const cur = idx >= 0 ? result.steps[idx] : null;
  const edgeStyles: Record<string, EdgeStyle> = {};
  if (cur?.edge) edgeStyles[cur.edge] = "active";
  if (cur?.negativeCycleEdges) cur.negativeCycleEdges.forEach((e) => (edgeStyles[e] = "negative"));
  const logs = idx >= 0 ? result.steps.slice(0, idx + 1).map((s) => s.log) : [];
  const edgeLabels: Record<string, string> = {};
  initialEdges.forEach((e) => (edgeLabels[e.id] = String((e.toll ?? 0) - fuelSavings)));
  const negCount = result.negativeCycleEdges.length;
  return (
    <SectionCard id="bellman" title="Bellman-Ford — Negative Cycle Detection" subtitle="Edge weight = toll − fuel savings. Detect routes that pay you back." icon={<AlertTriangle className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <GraphCanvas nodes={initialNodes} edges={initialEdges} edgeStyles={edgeStyles} edgeLabels={edgeLabels} />
        <div className="space-y-3">
          <div className="glass rounded-xl p-3 space-y-2">
            <label className="text-xs text-muted-foreground">Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full bg-background/40 rounded-md px-2 py-1.5 border border-border text-sm">
              {initialNodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
            <label className="text-xs text-muted-foreground block mt-2">Fuel savings per edge: ₹{fuelSavings}</label>
            <input type="range" min={0} max={300} value={fuelSavings} onChange={(e) => setFuelSavings(Number(e.target.value))} className="w-full" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setIdx(0); setPlaying(true); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}><Play className="h-4 w-4" /> Run</button>
            <button onClick={() => { setIdx(-1); setPlaying(false); }} className="rounded-xl px-3 py-2 text-sm glass"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className={`glass rounded-xl p-3 ${negCount ? "ring-1 ring-[var(--edge-negative)]" : ""}`}>
            <div className="text-xs uppercase text-muted-foreground">Result</div>
            <div className="text-base font-semibold">{negCount ? `⚠ ${negCount} negative-cycle edge(s)` : "✓ No negative cycle"}</div>
          </div>
          <CodeExplain title="Bellman-Ford" points={["Relax all edges V−1 times.","If any edge can still be relaxed → negative cycle.","Handles negative weights (Dijkstra cannot)."]} />
        </div>
      </div>
      <div className="mt-3"><LogPanel logs={logs} /></div>
    </SectionCard>
  );
}
