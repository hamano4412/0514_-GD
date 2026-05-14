"use client";

import { useCallback, useRef, useState } from "react";
import {
  AXIS_LABEL,
  formatTime,
  type AxisKey,
  type Highlight,
  type Utterance,
} from "@/data/session";

type Item = {
  highlight: Highlight;
  utterance: Utterance;
};

type Props = {
  videoUrl: string;
  items: Item[];
};

const AXIS_COLOR: Record<AxisKey, string> = {
  initiative: "bg-rose-100 text-rose-800 border-rose-200",
  leadership: "bg-violet-100 text-violet-800 border-violet-200",
  cognition: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function VideoHighlightPanel({ videoUrl, items }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeId, setActiveId] = useState<string | null>(
    items[0]?.highlight.id ?? null,
  );

  const jumpTo = useCallback((sec: number, id: string) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = sec;
    v.play().catch(() => {
      /* autoplay 制限などは無視 */
    });
    setActiveId(id);
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-3">
        <div className="aspect-video bg-black rounded-xl overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            playsInline
            className="w-full h-full"
          />
        </div>
        <p className="text-xs text-slate-500">
          ※ 動画はモック用のサンプル素材です。ハイライトをクリックすると該当時刻にジャンプします。
        </p>
      </div>

      <div>
        <div className="text-sm font-semibold text-slate-700 mb-2">
          評価の決め手になった発言
        </div>
        <ul className="space-y-3">
          {items.length === 0 && (
            <li className="text-sm text-slate-500 rounded-lg border border-dashed border-slate-300 p-4">
              この学生について、AIが「評価の決め手」と判定した発言は抽出されませんでした。
            </li>
          )}
          {items.map(({ highlight, utterance }) => {
            const isActive = highlight.id === activeId;
            return (
              <li key={highlight.id}>
                <button
                  type="button"
                  onClick={() => jumpTo(utterance.startSec, highlight.id)}
                  className={`w-full text-left rounded-lg border p-3 transition ${
                    isActive
                      ? "border-brand-500 bg-brand-50"
                      : "border-slate-200 bg-white hover:border-slate-400"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded border ${AXIS_COLOR[highlight.axis]}`}
                    >
                      {AXIS_LABEL[highlight.axis]}
                    </span>
                    {highlight.weight === "high" && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        重要度高
                      </span>
                    )}
                    <span className="ml-auto text-xs font-mono text-slate-500">
                      ▶ {formatTime(utterance.startSec)}
                    </span>
                  </div>
                  <div className="text-sm text-slate-800 line-clamp-3">
                    「{utterance.text}」
                  </div>
                  <div className="mt-2 text-xs text-slate-600">
                    {highlight.rationale}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
