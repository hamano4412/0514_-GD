type Step = {
  key: string;
  label: string;
};

const STEPS: Step[] = [
  { key: "upload", label: "1. 録画アップロード" },
  { key: "processing", label: "2. AI解析" },
  { key: "assign", label: "3. 話者割り当て" },
  { key: "dashboard", label: "4. 評価ダッシュボード" },
];

type Props = {
  currentKey: Step["key"];
};

export function Stepper({ currentKey }: Props) {
  const currentIndex = STEPS.findIndex((s) => s.key === currentKey);
  return (
    <ol className="flex items-center gap-2 text-xs sm:text-sm">
      {STEPS.map((s, i) => {
        const state =
          i < currentIndex ? "done" : i === currentIndex ? "current" : "todo";
        const dotClass =
          state === "done"
            ? "bg-emerald-500 text-white border-emerald-500"
            : state === "current"
            ? "bg-brand-600 text-white border-brand-600"
            : "bg-white text-slate-400 border-slate-300";
        const labelClass =
          state === "todo" ? "text-slate-400" : "text-slate-800";
        return (
          <li key={s.key} className="flex items-center gap-2">
            <span
              className={`shrink-0 w-6 h-6 rounded-full border flex items-center justify-center text-[11px] font-semibold ${dotClass}`}
            >
              {state === "done" ? "✓" : i + 1}
            </span>
            <span className={`${labelClass} whitespace-nowrap`}>{s.label}</span>
            {i < STEPS.length - 1 && (
              <span className="hidden sm:inline w-8 h-px bg-slate-300 mx-1" />
            )}
          </li>
        );
      })}
    </ol>
  );
}
