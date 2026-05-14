type Props = {
  label: string;
  value: number;
  max?: number;
};

export function ScoreBar({ label, value, max = 5 }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const tone =
    value >= 4 ? "bg-emerald-500" : value >= 3 ? "bg-sky-500" : "bg-amber-500";
  return (
    <div>
      <div className="flex items-baseline justify-between text-xs text-slate-600 mb-1">
        <span>{label}</span>
        <span className="font-mono tabular-nums">
          {value.toFixed(1)}
          <span className="text-slate-400"> / {max}</span>
        </span>
      </div>
      <div className="h-2 rounded bg-slate-200 overflow-hidden">
        <div
          className={`h-full ${tone} rounded transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
