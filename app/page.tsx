import Link from "next/link";
import {
  STATUS_LABEL,
  formatConductedAt,
  sessions,
  type SessionStatus,
} from "@/data/session";

const STATUS_COLOR: Record<SessionStatus, string> = {
  analyzed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  processing: "bg-amber-100 text-amber-800 border-amber-200",
  queued: "bg-slate-100 text-slate-600 border-slate-200",
};

export default function Page() {
  const groups = groupByDate(sessions);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">セッション一覧</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            実施日時の新しい順に表示しています
          </p>
        </div>
        <Link
          href="/upload/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700"
        >
          <span className="text-base leading-none">＋</span>
          新しい録画を取り込む
        </Link>
      </div>

      <div className="space-y-8">
        {groups.map((g) => (
          <section key={g.date}>
            <div className="flex items-baseline gap-3 mb-3">
              <h3 className="text-sm font-semibold text-slate-700">{g.date}</h3>
              {g.weekday && (
                <span className="text-xs text-slate-500">({g.weekday}曜日)</span>
              )}
              <span className="text-xs text-slate-400">— {g.items.length}件</span>
            </div>
            <ul className="space-y-3">
              {g.items.map((s) => {
                const f = formatConductedAt(s.conductedAt);
                const clickable = s.status === "analyzed";
                const href = clickable ? "/dashboard/" : undefined;
                const Wrapper = clickable
                  ? (props: { children: React.ReactNode; className: string }) => (
                      <Link href={href!} className={props.className}>
                        {props.children}
                      </Link>
                    )
                  : (props: { children: React.ReactNode; className: string }) => (
                      <div className={props.className} aria-disabled="true">
                        {props.children}
                      </div>
                    );

                return (
                  <li key={s.id}>
                    <Wrapper
                      className={`block rounded-xl border bg-white p-5 transition ${
                        clickable
                          ? "border-slate-200 hover:border-brand-500 hover:shadow-sm cursor-pointer"
                          : "border-slate-200 opacity-80"
                      }`}
                    >
                      <div className="flex items-start gap-5">
                        <div className="shrink-0 text-center w-20">
                          <div className="font-mono text-2xl font-semibold text-slate-800 tabular-nums">
                            {f.time}
                          </div>
                          <div className="text-[10px] text-slate-500 tracking-wide uppercase mt-0.5">
                            開始
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-[11px] px-2 py-0.5 rounded border ${STATUS_COLOR[s.status]}`}
                            >
                              {STATUS_LABEL[s.status]}
                            </span>
                            {s.statusDetail && (
                              <span className="text-xs text-slate-500">
                                {s.statusDetail}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 text-base font-semibold text-slate-900 truncate">
                            {s.topic}
                          </div>
                          <div className="mt-2 flex gap-4 text-xs text-slate-600">
                            <span>参加 {s.participantCount}名</span>
                            <span>所要 {s.durationSec / 60}分</span>
                            {s.highlightCount !== undefined && (
                              <span>ハイライト {s.highlightCount}件</span>
                            )}
                          </div>
                        </div>
                        {clickable && (
                          <div className="shrink-0 text-brand-600 text-sm self-center">
                            開く →
                          </div>
                        )}
                      </div>
                    </Wrapper>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function groupByDate(items: typeof sessions) {
  const map = new Map<string, typeof sessions>();
  for (const s of items) {
    const { date } = formatConductedAt(s.conductedAt);
    if (!map.has(date)) map.set(date, []);
    map.get(date)!.push(s);
  }
  const result = Array.from(map.entries())
    .map(([date, items]) => {
      const sorted = [...items].sort((a, b) =>
        a.conductedAt < b.conductedAt ? 1 : -1,
      );
      const { weekday } = formatConductedAt(sorted[0].conductedAt);
      return { date, weekday, items: sorted };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return result;
}
