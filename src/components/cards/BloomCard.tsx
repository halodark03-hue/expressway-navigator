import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { SectionCard } from "./SectionCard";
import { CodeExplain } from "../viz/CodeExplain";
import { BloomFilter } from "@/algorithms/bloom";

export function BloomCard() {
  const [filter] = useState(() => { const f = new BloomFilter(64, 3); ["DL01AB1234","UP14CD5678","HR26EF9012","DL08GH3456"].forEach((v) => f.add(v)); return f; });
  const [tick, setTick] = useState(0);
  const [input, setInput] = useState("");
  const [lastHashes, setLastHashes] = useState<number[]>([]);
  const [lastResult, setLastResult] = useState<null | "present" | "absent">(null);
  const bits = useMemo(() => Array.from(filter.bits), [filter, tick]);
  const onTest = () => { if (!input.trim()) return; const h = filter.hashes(input.trim()); setLastHashes(h); setLastResult(filter.test(input.trim()) ? "present" : "absent"); };
  const onAdd = () => { if (!input.trim()) return; filter.add(input.trim()); setLastHashes(filter.hashes(input.trim())); setLastResult("present"); setTick((t) => t + 1); };
  const fpRate = ((1 - Math.exp(-3 * filter.count / filter.size)) ** 3 * 100).toFixed(1);
  return (
    <SectionCard id="bloom" title="Bloom Filter — Vehicle Pass System" subtitle="Probabilistic membership for FASTag-style lookups." icon={<ShieldCheck className="h-5 w-5 text-primary-foreground" />}>
      <div className="grid lg:grid-cols-[1fr_320px] gap-4">
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="text-xs uppercase text-muted-foreground">Bit array ({filter.size} bits, k=3)</div>
          <div className="grid gap-1" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}>
            {bits.map((b, i) => {
              const lit = lastHashes.includes(i);
              return <motion.div key={i} animate={{ backgroundColor: b ? (lit ? "oklch(0.78 0.2 60)" : "oklch(0.72 0.19 280 / 0.7)") : (lit ? "oklch(0.78 0.2 60 / 0.4)" : "oklch(0.3 0.05 270 / 0.4)"), scale: lit ? 1.15 : 1 }} className="aspect-square rounded border border-border" />;
            })}
          </div>
          <div className="text-xs text-muted-foreground">{filter.count} items inserted, ~{fpRate}% false-positive rate</div>
        </div>
        <div className="space-y-3">
          <div className="glass rounded-xl p-3 space-y-2">
            <input value={input} onChange={(e) => setInput(e.target.value.toUpperCase())} placeholder="DL01AB1234" className="w-full bg-background/40 rounded-md px-3 py-2 border border-border text-sm font-mono" />
            <div className="flex gap-2">
              <button onClick={onTest} className="flex-1 rounded-md px-3 py-2 text-sm" style={{ background: "var(--gradient-primary)", color: "var(--primary-foreground)" }}>Test</button>
              <button onClick={onAdd} className="flex-1 rounded-md px-3 py-2 text-sm glass">Add</button>
            </div>
          </div>
          {lastResult && (
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`glass rounded-xl p-3 text-sm ${lastResult === "present" ? "ring-1 ring-[var(--node-path)]" : "ring-1 ring-[var(--edge-negative)]"}`}>
              <div className="font-semibold">{lastResult === "present" ? "Possibly present ✓" : "Definitely not present ✗"}</div>
              <div className="text-xs text-muted-foreground mt-1">Hashes → bits {lastHashes.join(", ")}</div>
            </motion.div>
          )}
          <CodeExplain title="Bloom filter" points={["k hash fns map input to k bit positions.","Insert: set all k bits to 1.","All k bits set ⇒ possibly present.","Any bit 0 ⇒ definitely not present."]} />
        </div>
      </div>
    </SectionCard>
  );
}
