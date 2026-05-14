import Link from "next/link";
import { AXIS_LABEL, session } from "@/data/session";
import { ScoreBar } from "@/components/ScoreBar";

export default function Page() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="text-xs text-slate-500">セッション</div>
        <h2 className="text-xl font-semibold mt-1">{session.topic}</h2>
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <Info label="実施日時" value={session.conductedAt} />
          <Info label="所要時間" value={`${session.durationSec / 60}分`} />
          <Info label="参加者数" value={`${session.participants.length}名`} />
          <Info label="抽出ハイライト" value={`${session.highlights.length}件`} />
        </div>
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-700 mb-3">
          学生別サマリー(クリックで詳細)
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {session.participants.map((p) => {
            const highlightCount = p.highlightIds.length;
            return (
              <Link
                key={p.id}
                href={`/students/${p.id}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 hover:border-brand-500 hover:shadow-sm transition"
              >
                <div className="flex items-baseline justify-between">
                  <div className="text-lg font-semibold">{p.displayName}</div>
                  <div className="text-xs text-slate-500">
                    ハイライト {highlightCount} 件
                  </div>
                </div>
                <div className="mt-4 space-y-3">
                  <ScoreBar label={AXIS_LABEL.initiative} value={p.scores.initiative} />
                  <ScoreBar label={AXIS_LABEL.leadership} value={p.scores.leadership} />
                  <ScoreBar label={AXIS_LABEL.cognition} value={p.scores.cognition} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
