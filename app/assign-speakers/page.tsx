"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Stepper } from "@/components/Stepper";

type StudentSlot = "A" | "B" | "C" | "D" | "";

type DetectedSpeaker = {
  id: string;
  totalUtterances: number;
  totalSec: number;
  firstUtterance: string;
  /** デフォルト割り当て */
  defaultAssignment: Exclude<StudentSlot, "">;
};

const DETECTED: DetectedSpeaker[] = [
  {
    id: "Speaker 1",
    totalUtterances: 5,
    totalSec: 92,
    firstUtterance:
      "まず時間配分を決めませんか。前半20分で論点出し、後半20分で結論まとめという形で進めたいです。",
    defaultAssignment: "A",
  },
  {
    id: "Speaker 2",
    totalUtterances: 4,
    totalSec: 84,
    firstUtterance:
      "賛成です。論点出しのフェーズでは、まずお題の前提を揃えるところから始めるのがよさそうです。",
    defaultAssignment: "B",
  },
  {
    id: "Speaker 3",
    totalUtterances: 3,
    totalSec: 51,
    firstUtterance:
      "うーん、いきなり前提を揃えるより、思いついたアイデアを並べる方が早い気もしますが…どうでしょう。",
    defaultAssignment: "C",
  },
  {
    id: "Speaker 4",
    totalUtterances: 3,
    totalSec: 47,
    firstUtterance:
      "あ、はい。私もそれでいいと思います。Aさんの言う通り5分なら時間ロスも少ないので。",
    defaultAssignment: "D",
  },
];

const SLOTS: StudentSlot[] = ["A", "B", "C", "D"];

export default function AssignSpeakersPage() {
  const router = useRouter();
  const [assignments, setAssignments] = useState<Record<string, StudentSlot>>(
    () =>
      Object.fromEntries(DETECTED.map((s) => [s.id, s.defaultAssignment])) as Record<
        string,
        StudentSlot
      >,
  );
  const [submitting, setSubmitting] = useState(false);

  const usedCounts = useMemo(() => {
    const c: Record<StudentSlot, number> = { A: 0, B: 0, C: 0, D: 0, "": 0 };
    Object.values(assignments).forEach((v) => {
      c[v]++;
    });
    return c;
  }, [assignments]);

  const hasDuplicate = SLOTS.some((s) => s !== "" && usedCounts[s] > 1);
  const hasEmpty = Object.values(assignments).some((v) => v === "");
  const canSubmit = !hasDuplicate && !hasEmpty && !submitting;

  const submit = () => {
    setSubmitting(true);
    setTimeout(() => {
      router.push("/dashboard/");
    }, 700);
  };

  return (
    <div className="space-y-8">
      <Stepper currentKey="assign" />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">話者を学生に割り当てる</h2>
        <p className="text-sm text-slate-600 mt-1">
          AIが4名の話者を識別しました。それぞれを学生A〜Dに割り当ててください(声紋だけでは個人特定できないため、ここだけ人間が確認します)。
        </p>

        <ul className="mt-6 space-y-3">
          {DETECTED.map((sp) => {
            const current = assignments[sp.id];
            const isDup =
              current !== "" && usedCounts[current] > 1;
            return (
              <li
                key={sp.id}
                className={`rounded-lg border p-4 ${
                  isDup ? "border-rose-300 bg-rose-50/40" : "border-slate-200"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{sp.id}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      発話 {sp.totalUtterances} 回 / 合計 {sp.totalSec} 秒
                    </div>
                    <div className="text-sm text-slate-700 mt-2 line-clamp-2">
                      「{sp.firstUtterance}」
                    </div>
                  </div>
                  <div className="shrink-0">
                    <label className="block text-[10px] text-slate-500 uppercase tracking-wide mb-1">
                      割り当て
                    </label>
                    <select
                      value={current}
                      onChange={(e) =>
                        setAssignments((prev) => ({
                          ...prev,
                          [sp.id]: e.target.value as StudentSlot,
                        }))
                      }
                      className={`rounded-lg border px-3 py-2 text-sm bg-white ${
                        isDup ? "border-rose-400" : "border-slate-300"
                      }`}
                    >
                      <option value="">-- 選択 --</option>
                      {SLOTS.filter((s) => s !== "").map((s) => (
                        <option key={s} value={s}>
                          学生{s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        {hasDuplicate && (
          <p className="mt-4 text-xs text-rose-700">
            同じ学生に複数の話者が割り当てられています。それぞれ別の学生を選んでください。
          </p>
        )}
        {!hasDuplicate && hasEmpty && (
          <p className="mt-4 text-xs text-slate-500">
            全ての話者を割り当てると、ダッシュボードに進めます。
          </p>
        )}

        <div className="mt-6 flex justify-between items-center">
          <button
            type="button"
            onClick={() => router.push("/upload/")}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            ← 別の録画を取り込む
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {submitting ? "ダッシュボードを準備中..." : "ダッシュボードを開く"}
          </button>
        </div>
      </section>

      <p className="text-xs text-slate-500">
        ※ モックです。実際の割り当ては保存されず、ダッシュボードには既存のサンプル評価が表示されます。
      </p>
    </div>
  );
}
