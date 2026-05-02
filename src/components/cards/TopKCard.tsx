import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { CodeExplain } from "../viz/CodeExplain";
import { initialEdges, initialNodes } from "@/data/expressway";
import { MaxHeap } from "@/algorithms/heap";

export function TopKCard() {
  const [k, setK] = useState(5);
  const labelOf = (id: string) => initialNodes.find((n) => n.id === id)?.label ?? id;
  const heapSnapshot = useMemo(() => {
    const heap = new MaxHeap<{ id: string; route: string }>();
    initialEdges.forEach((e) => heap.push(e.toll ?? 0, { id: e.id, route: `${labelOf(e.source)} → ${labelOf(e.target)}` }));
    return heap.arr.slice();
  }, []);
  const top = useMemo(() => {
    const heap = new MaxHeap<{ id: string; route: string }>();
    initialEdges.forEach((e) => heap.push(e.toll ?? 0, { id: e.id, route: `${labelOf(e.source)} → ${labelOf(e.target)}` }));
    const out: { key: number; val: { id: string; route: string } }[] = [];
    for (let i = 0; i < k && heap.size(); i++) out.push(heap.pop()!);
    return out;
  }, [k]);
  const levels: { key: number; route: string }[][] = [];
  let lvl = 0;
  while ((1 << lvl) - 1 < heapSnapshot.length) {
    const start = (1 << lvl) - 1;
    const end = Math.min(heapSnapshot.length, start + (1 << lvl));
    levels.push(heapSnapshot.slice(start, end).map((x) => ({ key: x.key, route: x.val.route })));
    lvl++;
  }
  return (
    <SectionCard id="topk" title="Top-K Toll Roads — Max Heap" subtitle="Heap-extract the k most expensive toll segments." icon={<Trophy className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="glass rounded-xl p-4 space-y-3 overflow-x-auto">
          <div className="text-xs uppercase text-muted-foreground">Heap (binary tree)</div>
          <div className="space-y-3 min-w-[600px]">
            {levels.map((row, i) => (
              <div key={i} className="flex justify-around gap-2">
                {row.map((n, j) => (
                  <motion.div key={`${i}-${j}`} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 + j * 0.02 }} className="rounded-lg px-3 py-2 text-xs glass min-w-[110px] text-center">
                    <div className="font-bold text-gradient text-sm">₹{n.key}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{n.route}</div>
                  </motion.div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <div className="glass rounded-xl p-3">
            <label className="text-xs text-muted-foreground">K = {k}</label>
            <input type="range" min={1} max={Math.min(10, initialEdges.length)} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full" />
          </div>
          <div className="glass rounded-xl p-3 space-y-1.5">
            <div className="text-xs uppercase text-muted-foreground mb-1">Top {k}</div>
            {top.map((t, i) => (
              <motion.div key={t.val.id} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: i * 0.06 }} className="flex items-center justify-between text-sm rounded-md px-2 py-1.5 bg-background/40 border border-border">
                <span className="text-xs text-muted-foreground w-5">#{i + 1}</span>
                <span className="flex-1 text-xs">{t.val.route}</span>
                <span className="font-mono font-bold text-gradient">₹{t.key}</span>
              </motion.div>
            ))}
          </div>
          <CodeExplain title="Max-heap" points={["Build heap from all edges by toll.","Extract-max k times.","O(n + k log n)."]} />
        </div>
      </div>
    </SectionCard>
  );
}
