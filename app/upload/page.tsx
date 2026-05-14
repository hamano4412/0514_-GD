"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Stepper } from "@/components/Stepper";

type Phase = "idle" | "uploading" | "done";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; sizeMb: string } | null>(
    null,
  );
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const setMockFile = useCallback((f: File | null) => {
    if (!f) return;
    setFile({ name: f.name, sizeMb: (f.size / 1024 / 1024).toFixed(1) });
  }, []);

  const useSample = useCallback(() => {
    setFile({ name: "gd_breakout_room_2026-05-14.mp4", sizeMb: "412.0" });
  }, []);

  const startUpload = useCallback(() => {
    setPhase("uploading");
    setProgress(0);
  }, []);

  useEffect(() => {
    if (phase !== "uploading") return;
    const t = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.random() * 12 + 6;
        if (next >= 100) {
          clearInterval(t);
          setPhase("done");
          return 100;
        }
        return next;
      });
    }, 220);
    return () => clearInterval(t);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") {
      const t = setTimeout(() => router.push("/processing/"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, router]);

  return (
    <div className="space-y-8">
      <Stepper currentKey="upload" />

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-xl font-semibold">Zoom録画を取り込む</h2>
        <p className="text-sm text-slate-600 mt-1">
          ブレイクアウトルームの動画ファイル(mp4)をアップロードしてください。アップロード後、AIが音声を文字起こしし、話者ごとに発言を構造化します。
        </p>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            setMockFile(e.dataTransfer.files[0] ?? null);
          }}
          onClick={() => inputRef.current?.click()}
          className={`mt-6 border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
            dragOver
              ? "border-brand-500 bg-brand-50"
              : "border-slate-300 hover:border-slate-400 bg-slate-50"
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setMockFile(e.target.files?.[0] ?? null)}
          />
          <div className="text-slate-500 text-sm">
            ここに動画ファイルをドラッグ&ドロップ
          </div>
          <div className="text-slate-400 text-xs mt-1">または クリックして選択</div>
        </div>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={useSample}
            className="text-xs text-brand-600 hover:underline"
          >
            ▷ デモ用サンプル録画を使う
          </button>
        </div>

        {file && (
          <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{file.name}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  サイズ: {file.sizeMb} MB
                </div>
              </div>
              {phase === "idle" && (
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  クリア
                </button>
              )}
            </div>

            {phase !== "idle" && (
              <div className="mt-3">
                <div className="h-2 bg-slate-200 rounded overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all"
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-slate-600 font-mono tabular-nums">
                  {phase === "done"
                    ? "アップロード完了 — 解析画面へ移動します..."
                    : `アップロード中... ${Math.floor(progress)}%`}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={!file || phase !== "idle"}
            onClick={startUpload}
            className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm font-medium hover:bg-brand-700 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            アップロードを開始する
          </button>
        </div>
      </section>

      <p className="text-xs text-slate-500">
        ※ このモックは実際にはファイルをアップロードしません。プログレスバーは演出で、自動的に解析画面に進みます。
      </p>
    </div>
  );
}
