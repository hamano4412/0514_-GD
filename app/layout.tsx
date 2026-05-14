import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GD評価ダッシュボード (モック)",
  description: "新卒採用グループディスカッションのAI評価支援アプリ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500">Ascent Business Consulting</div>
              <h1 className="text-lg font-semibold">
                新卒採用GD評価ダッシュボード
                <span className="ml-2 text-xs font-normal rounded bg-amber-100 text-amber-800 px-2 py-0.5 align-middle">
                  MOCK
                </span>
              </h1>
            </div>
            <nav className="text-sm text-slate-600">
              <a href="/" className="hover:text-brand-600">セッション一覧</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-6 py-8">{children}</main>
        <footer className="mx-auto max-w-6xl px-6 py-8 text-xs text-slate-500">
          このダッシュボードはモックです。動画・発言・スコアはすべてサンプルデータです。
        </footer>
      </body>
    </html>
  );
}
