"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Stepper } from "@/components/Stepper";

type Status = "pending" | "running" | "done";

type Job = {
  key: string;
  label: string;
  detail: string;
  /** 完了に要するミリ秒(モック演出) */
  durationMs: number;
};

const JOBS: Job[] = [
  {
    key: "audio",
    label: "音声トラックの抽出",
    detail: "mp4ファイルから音声(16kHz mono)を分離しています",
    durationMs: 1800,
  },
  {
    key: "transcribe",
    label: "音声→テキスト変換 (Whisper)",
    detail: "発話内容をテキストに変換しています(精度モデル: large-v3)",
    durationMs: 3200,
  },
  {
    key: "diarize",
    label: "話者分離",
    detail: "声紋の特徴量から4名の話者を識別しています",
    durationMs: 2400,
  },
  {
    key: "analyze",
    label: "評価軸プロンプトによるファクト抽出",
    detail: "主体性・リーダーシップ・認知能力の各観点でAIが発言を解析中",
    durationMs: 3000,
  },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<Status[]>(
    JOBS.map(() => "pending"),
  );
  const [currentDetailIdx, setCurrentDetailIdx] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      for (let i = 0; i < JOBS.length; i++) {
        if (cancelled) return;
        setCurrentDetailIdx(i);
        setStatuses((prev) => {
          const next = [...prev];
          next[i] = "running";
          return next;
        });
        await new Promise((r) => setTimeout(r, JOBS[i].durationMs));
        if (cancelled) return;
        setStatuses((prev) => {
          const next = [...prev];
          next[i] = "done";
          return next;
        });
      }
      // 全部終わったら次の画面へ
      await new Promise((r) => setTimeout(r, 800));
      if (!cancelled) router.push("/assign-speakers/");
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const totalDuration = JOBS.reduce((s, j) => s + j.durationMs, 0);
  const elapsedSoFar = statuses.reduce((s, st, i) => {
    if (st === "done") return s + JOBS[i].durationMs;
    if (st === "running") return s + JOBS[i].durationMs * 0.5;
    return s;
  }, 0);
  const overallPct = Math.min(100, Math.round((elapsedSoFar / totalDuration) * 100));

  return (
    <div className="space-y-8">
      <Stepper currentKey="processing" />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-xl font-semibold">AI解析を実行中</h2>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            進捗 {overallPct}%
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          gd_breakout_room_2026-05-14.mp4 を解析しています。完了するとダッシュボードで結果を確認できます。
        </p>

        <div className="mt-4 h-2 bg-slate-200 rounded overflow-hidden">
          <div
            className="h-full bg-brand-600 transition-all duration-500"
            style={{ width: `${overallPct}%` }}
          />
        </div>

        <ul className="mt-8 space-y-4">
          {JOBS.map((job, i) => {
            const st = statuses[i];
            return (
              <li
                key={job.key}
                className={`rounded-lg border p-4 transition ${
                  st === "running"
                    ? "border-brand-500 bg-brand-50"
                    : st === "done"
                    ? "border-emerald-200 bg-emerald-50/40"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div className="flex items-start gap-3">
                  <StatusIcon status={st} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{job.label}</div>
                      <div className="text-xs text-slate-500">
                        {st === "done"
                          ? "完了"
                          : st === "running"
                          ? "実行中..."
                          : "待機中"}
                      </div>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {job.detail}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <p className="text-xs text-slate-500">
        ※ モックです。実際の音声処理は行っていません。約{Math.round(totalDuration / 1000)}秒で自動的に次の画面に進みます。
      </p>
    </div>
  );
}

function StatusIcon({ status }: { status: Status }) {
  if (status === "done") {
    return (
      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
        ✓
      </div>
    );
  }
  if (status === "running") {
    return (
      <div className="w-6 h-6 rounded-full border-2 border-brand-600 border-t-transparent animate-spin shrink-0" />
    );
  }
  return (
    <div className="w-6 h-6 rounded-full border-2 border-slate-300 shrink-0" />
  );
}
