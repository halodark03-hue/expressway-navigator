import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calculator } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { CodeExplain } from "../viz/CodeExplain";
import { Fenwick } from "@/algorithms/fenwick";
import { initialEdges } from "@/data/expressway";

export function FenwickCard() {
  const baseTolls = useMemo(() => initialEdges.map((e) => e.toll ?? 0), []);
  const [vals, setVals] = useState<number[]>(baseTolls);
  const fenwick = useMemo(() => new Fenwick(vals), [vals]);
  const [l, setL] = useState(0);
  const [r, setR] = useState(Math.min(5, vals.length - 1));
  const [updIdx, setUpdIdx] = useState(0);
  const [updVal, setUpdVal] = useState(vals[0]);
  const [highlighted, setHighlighted] = useState<number[]>([]);
  const [mode, setMode] = useState<"query" | "update">("query");
  const sum = fenwick.range(l, r);
  const onQuery = () => { setMode("query"); setHighlighted(fenwick.queryPath(r + 1)); };
  const onUpdate = () => { setMode("update"); setHighlighted(fenwick.updatePath(updIdx)); const next = [...vals]; next[updIdx] = updVal; setVals(next); };
  return (
    <SectionCard id="fenwick" title="Fenwick Tree — Toll Range Queries" subtitle="Range-sum and point-update over toll values in O(log n)." icon={<Calculator className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="glass rounded-xl p-4 space-y-4">
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Toll array (₹)</div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
              {vals.map((v, i) => (
                <div key={i} className={`rounded-md text-center text-xs py-2 ${i >= l && i <= r ? "bg-[oklch(0.7_0.18_200/0.35)]" : "bg-background/40"} border border-border`}>
                  <div className="text-[10px] text-muted-foreground">i{i}</div>
                  <div className="font-mono">{v}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground mb-2">Internal BIT (1-indexed)</div>
            <div className="grid gap-1.5" style={{ gridTemplateColumns: "repeat(9, minmax(0, 1fr))" }}>
              {fenwick.tree.slice(1).map((v, i) => {
                const idx = i + 1;
                const active = highlighted.includes(idx);
                return (
                  <motion.div key={i} animate={{ scale: active ? 1.08 : 1, backgroundColor: active ? (mode === "update" ? "oklch(0.78 0.2 60 / 0.5)" : "oklch(0.72 0.19 280 / 0.45)") : "oklch(0.18 0.06 280 / 0.4)" }} className="rounded-md text-center text-xs py-2 border border-border">
                    <div className="text-[10px] text-muted-foreground">t{idx}</div>
                    <div className="font-mono">{v}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div className="glass rounded-xl p-3 space-y-2">
            <div className="text-xs uppercase text-muted-foreground">Range query</div>
            <div className="flex gap-2 items-center text-sm">
              <span>L</span><input type="number" min={0} max={vals.length - 1} value={l} onChange={(e) => setL(Number(e.target.value))} className="w-16 bg-background/40 rounded-md px-2 py-1 border border-border" />
              <span>R</span><input type="number" min={0} max={vals.length - 1} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-16 bg-background/40 rounded-md px-2 py-1 border border-border" />
              <button onClick={onQuery} className="ml-auto rounded-md px-3 py-1 text-sm" style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}>Query</button>
            </div>
            <div className="text-xl font-bold text-gradient">Σ = ₹{sum}</div>
          </div>
          <div className="glass rounded-xl p-3 space-y-2">
            <div className="text-xs uppercase text-muted-foreground">Point update</div>
            <div className="flex gap-2 items-center text-sm">
              <span>i</span><input type="number" min={0} max={vals.length - 1} value={updIdx} onChange={(e) => setUpdIdx(Number(e.target.value))} className="w-16 bg-background/40 rounded-md px-2 py-1 border border-border" />
              <span>v</span><input type="number" value={updVal} onChange={(e) => setUpdVal(Number(e.target.value))} className="w-20 bg-background/40 rounded-md px-2 py-1 border border-border" />
              <button onClick={onUpdate} className="ml-auto rounded-md px-3 py-1 text-sm glass">Update</button>
            </div>
          </div>
          <CodeExplain title="Binary Indexed Tree" points={["tree[i] stores partial sums based on i&-i.","Query: walk i -= i&-i.","Update: walk i += i&-i.","All ops O(log n)."]} />
        </div>
      </div>
    </SectionCard>
  );
}
