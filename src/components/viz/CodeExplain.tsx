export function CodeExplain({ title, points }: { title: string; points: string[] }) {
  return (
    <div className="glass rounded-xl p-4">
      <div className="text-sm font-semibold mb-2 text-gradient">{title}</div>
      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}
