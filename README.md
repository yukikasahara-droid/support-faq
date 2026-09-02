# Ory サポート / FAQ（たたき台）

お客様からのお問い合わせに対する回答記事を掲載する、**カスタマーサポート／FAQ サイト**の提案用たたき台です。
参考: [LOVOT ウェブFAQ](https://www.pa-solution.net/as/scope3/groove-x/lovot/jp/) のようなナレッジベース構成。

- **静的サイト（SSG）**なのでサーバー不要・高速・堅牢（攻撃面が小さい）
- 記事は **Markdown**（`src/content/faq/`）で管理。frontmatter はスキーマ検証され、不備があるとビルドが失敗する
- **全文検索は Pagefind**（ビルド時にインデックス生成。外部サービス不要）
- デザインは **オリィ研究所グランドデザイン準拠**（色・グラデーション・タイポ）

## 技術スタック

| 項目 | 内容 |
|---|---|
| フレームワーク | Astro（SSG / Content Collections） |
| 検索 | Pagefind（`astro-pagefind`） |
| フォント | Noto Sans JP（`@fontsource` で自ホスト。外部リクエスト無し） |
| 言語 | TypeScript（strict） |

## 必要環境・セットアップ

Node.js 22 系。このリポジトリは Volta で Node を固定しているため、Volta 利用者は自動で正しいバージョンになります（`package.json` の `volta` フィールド）。

```bash
npm install
npm run dev       # 開発サーバー（http://localhost:4321）
```

> ⚠️ 開発サーバー（`npm run dev`）では検索インデックスが未生成のため、検索結果は表示されません。
> 検索まで含めて確認する場合は本番ビルドをプレビューしてください。

```bash
npm run build     # 本番ビルド（dist/ を生成し、Pagefind でインデックス化）
npm run preview   # dist/ をローカル配信して確認
npm run check     # 型チェック（astro check）
```

## 記事の追加

`src/content/faq/` に Markdown ファイルを追加します。ファイル名がそのまま URL（`/faq/<ファイル名>`）になります。

```markdown
---
title: 質問のタイトル
category: troubleshooting      # src/data/categories.ts の id から選ぶ
summary: 一覧・検索結果に出る短い要約（必須）
featured: true                 # トップの「注目FAQ」に出す場合 true（任意）
order: 10                      # 小さいほど上（任意 / 既定 100）
updated: 2026-08-20            # 最終更新日（任意）
tags: [電源, 起動]             # 検索・関連記事の補助（任意）
draft: false                   # true の間は公開ビルドから除外（任意）
---

## 見出し
本文（Markdown）。番号付きリストは手順、`>` は補足ノートとして装飾されます。
```

### カテゴリを増やす

`src/data/categories.ts` の `CATEGORY_IDS` と `categories` の両方に追記します（アイコンは `src/components/BrandIcon.astro` に対応する図形を追加）。

## 確定前に差し替えが必要なプレースホルダー

| 箇所 | ファイル | 内容 |
|---|---|---|
| ロゴマーク | `src/components/BrandLogo.astro` | 暫定の図形。**公式ロゴ SVG**（変形・色変更不可）に差し替える |
| 公開 URL | `astro.config.mjs` の `site` | canonical / OGP / sitemap の絶対URL生成に使用 |
| お問い合わせ導線 | `src/components/ContactCta.astro` ほか | `#` を実際の問い合わせフォーム／メール／チャットのURLに |
| 参考ドメイン | `public/robots.txt` / `public/_headers` | 実ドメインに合わせる |

## デザインの調整ポイント

`src/styles/global.css` 冒頭の CSS 変数（`:root`）が配色・タイポの一元管理場所です。

- 基調グレー `--ory-gray: #4f4c4c`（PANTONE COOL GRAY 9C）
- アクセント（差し色）`--ory-green: #00c8aa`（接触・起動。ボタンhoverや細い線など限定使用）
- シグネチャのグラデーション `--ory-gradient`（navy→orange。トップの帯や細い罫に使用）
- 本文 17px / 行間ゆったり / 左揃え基本（グランドデザインの Web スケール準拠）

## デプロイ

`npm run build` の出力（`dist/`）をそのまま配信します。

- **S3 + CloudFront**：`dist/` を同期。`public/_headers` 相当のセキュリティヘッダを CloudFront の Response Headers Policy に設定。
- **Netlify / Cloudflare Pages**：`dist/` を公開ディレクトリに指定すれば `public/_headers` がそのまま効きます。

## 堅牢性・セキュリティ面（提案時の説明用）

- 静的配信でサーバー実行なし（攻撃面が小さい）／機密・APIキーを持たない
- 外部CDN依存なし（フォントも自ホスト）＝第三者リクエスト無し・プライバシー配慮
- セキュリティHTTPヘッダ（CSP・HSTS・X-Content-Type-Options ほか）を `public/_headers` に同梱
- 型安全（TypeScript strict + コンテンツスキーマ検証）
- アクセシビリティ（ランドマーク・スキップリンク・フォーカス可視化・`prefers-reduced-motion`・ネイティブ`<details>`）
- SEO（メタ／OGP／sitemap／robots／FAQPage 構造化データ／404）
