import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AXIS_LABEL,
  getStudent,
  getUtterance,
  session,
  type Highlight,
  type StudentId,
  type Utterance,
} from "@/data/session";
import { ScoreBar } from "@/components/ScoreBar";
import { VideoHighlightPanel } from "@/components/VideoHighlightPanel";

const VALID_IDS: StudentId[] = ["A", "B", "C", "D"];

export function generateStaticParams() {
  return VALID_IDS.map((id) => ({ id }));
}

type Params = { id: string };

export default function StudentPage({ params }: { params: Params }) {
  const id = params.id.toUpperCase() as StudentId;
  if (!VALID_IDS.includes(id)) notFound();
  const student = getStudent(id);
  if (!student) notFound();

  type Item = { highlight: Highlight; utterance: Utterance };
  const items: Item[] = student.highlightIds
    .map((hid): Item | null => {
      const h = session.highlights.find((x) => x.id === hid);
      if (!h) return null;
      const u = getUtterance(h.utteranceId);
      if (!u) return null;
      return { highlight: h, utterance: u };
    })
    .filter((x): x is Item => x !== null);

  const myUtterances = session.utterances.filter((u) => u.studentId === id);

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 text-sm">
        <Link href="/" className="text-brand-600 hover:underline">
          ← セッション一覧へ戻る
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-600">{student.displayName}</span>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-baseline justify-between">
          <div>
            <div className="text-xs text-slate-500">{session.topic}</div>
            <h2 className="text-2xl font-semibold mt-1">{student.displayName}</h2>
          </div>
          <div className="text-xs text-slate-500">
            総発話 {myUtterances.length} 回 / ハイライト {student.highlightIds.length} 件
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {(["initiative", "leadership", "cognition"] as const).map((axis) => (
            <div key={axis} className="space-y-2">
              <ScoreBar label={AXIS_LABEL[axis]} value={student.scores[axis]} />
              <p className="text-xs text-slate-600 leading-relaxed">
                {student.summary[axis]}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          動画ハイライト
        </h3>
        <VideoHighlightPanel videoUrl={session.videoUrl} items={items} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">
          全発言ログ({student.displayName})
        </h3>
        <ul className="divide-y divide-slate-100">
          {myUtterances.map((u) => (
            <li key={u.id} className="py-3 flex gap-4">
              <span className="font-mono text-xs text-slate-500 w-12 shrink-0">
                {Math.floor(u.startSec / 60)}:
                {(u.startSec % 60).toString().padStart(2, "0")}
              </span>
              <span className="text-sm text-slate-800">{u.text}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
