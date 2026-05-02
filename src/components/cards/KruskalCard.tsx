import { useEffect, useMemo, useState } from "react";
import { GitBranch, Play, RotateCcw } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { GraphCanvas, type EdgeStyle } from "../viz/GraphCanvas";
import { LogPanel } from "../viz/LogPanel";
import { CodeExplain } from "../viz/CodeExplain";
import { initialNodes, initialEdges } from "@/data/expressway";
import { runKruskal } from "@/algorithms/kruskal";

export function KruskalCard() {
  const result = useMemo(() => runKruskal(initialNodes, initialEdges), []);
  const [idx, setIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    if (!playing) return;
    const t = setTimeout(() => { setIdx((i) => { if (i >= result.steps.length - 1) { setPlaying(false); return i; } return i + 1; }); }, 500);
    return () => clearTimeout(t);
  }, [playing, idx, result.steps.length]);
  const cur = idx >= 0 ? result.steps[idx] : null;
  const edgeStyles: Record<string, EdgeStyle> = {};
  if (cur) { cur.mst.forEach((e) => (edgeStyles[e] = "mst")); edgeStyles[cur.edge] = cur.accepted ? "mst" : "negative"; }
  const logs = idx >= 0 ? result.steps.slice(0, idx + 1).map((s) => s.log) : [];
  return (
    <SectionCard id="kruskal" title="Kruskal — Minimum Spanning Tree" subtitle="Sort edges by weight, union-find to avoid cycles." icon={<GitBranch className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <GraphCanvas nodes={initialNodes} edges={initialEdges} edgeStyles={edgeStyles} />
        <div className="space-y-3">
          <div className="flex gap-2">
            <button onClick={() => { setIdx(0); setPlaying(true); }} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-primary-foreground" style={{ background: "var(--gradient-primary)" }}><Play className="h-4 w-4" /> Run</button>
            <button onClick={() => { setIdx((i) => Math.min(result.steps.length - 1, i + 1)); setPlaying(false); }} className="rounded-xl px-3 py-2 text-sm glass">Step</button>
            <button onClick={() => { setIdx(-1); setPlaying(false); }} className="rounded-xl px-3 py-2 text-sm glass"><RotateCcw className="h-4 w-4" /></button>
          </div>
          <div className="glass rounded-xl p-3">
            <div className="text-xs uppercase text-muted-foreground">MST total cost</div>
            <div className="text-2xl font-bold text-gradient">{result.total} km</div>
            <div className="text-xs text-muted-foreground">Edges: {result.mst.length}/{initialNodes.length - 1}</div>
          </div>
          <CodeExplain title="Union-Find" points={["Sort edges ascending by weight.","For each edge, find roots of both endpoints.","If roots differ → union them and add edge to MST.","Stop when MST has V-1 edges."]} />
        </div>
      </div>
      <div className="mt-3"><LogPanel logs={logs} /></div>
    </SectionCard>
  );
}
