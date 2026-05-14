# 新卒採用GD評価ダッシュボード (モック)

Zoom録画から学生A〜Dの発言をAI解析し、評価軸ごとにスコア化・ハイライト提示するダッシュボードのモックです。

## ローカルで動かす

```powershell
npm install
npm run dev
```

http://localhost:3000 でアクセスできます。

## ビルド (静的サイトを生成)

```powershell
npm run build
```

`out/` ディレクトリに完全な静的サイトが出力されます。

## Render にデプロイして公開URLを発行する

### 前提
- GitHub アカウント
- Render アカウント (https://render.com 無料)

### 手順

#### 1. GitHub にリポジトリを作る

GitHub の Web で空のリポジトリ (例: `gd-evaluation-mock`) を作成。`README.md` などの初期化はチェックを外す。

#### 2. このプロジェクトを Git に登録して push

このディレクトリ (`新卒採用GD評価`) で:

```powershell
git init
git add .
git commit -m "initial mock"
git branch -M main
git remote add origin https://github.com/<あなたのユーザー名>/gd-evaluation-mock.git
git push -u origin main
```

#### 3. Render で Blueprint としてデプロイ

1. Render にログイン → **New** → **Blueprint** を選択
2. 「Connect a repository」で先ほど push した GitHub リポジトリを選ぶ
3. Render が `render.yaml` を自動検出してプレビュー表示する
4. **Apply** をクリック

数分でビルドが完了し、`https://gd-evaluation-mock.onrender.com`(または末尾にハッシュ付き)のような公開URLが発行されます。

#### 代替手順: Blueprint を使わず手動でも可

1. Render で **New** → **Static Site**
2. GitHub リポジトリを選択
3. Build Command: `npm install && npm run build`
4. Publish Directory: `out`
5. **Create Static Site** をクリック

## 構成

- `app/page.tsx` — トップ(学生一覧 + 各スコア)
- `app/students/[id]/page.tsx` — 学生別詳細(スコア・根拠・動画ハイライト・全発言)
- `components/VideoHighlightPanel.tsx` — 動画 + ハイライト一覧、クリックでタイムスタンプジャンプ
- `data/session.ts` — モックデータ(学生A〜D・発言録・ハイライト)
- `render.yaml` — Render Blueprint 定義(Static Site)

## モックデータについて

`data/session.ts` の `session` オブジェクトを編集すれば、お題・発言録・スコア・ハイライトを差し替えられます。

動画は Big Buck Bunny のサンプルMP4を使っています。実データでは `session.videoUrl` をZoom録画のURLに置き換えます。
