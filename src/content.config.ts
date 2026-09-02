import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_IDS } from './data/categories';

/**
 * FAQ 記事コレクション。
 * src/content/faq/*.md を型安全に読み込む（Astro 5 の Content Layer / glob loader）。
 * frontmatter はここで定義するスキーマで検証され、逸脱するとビルドが失敗する（＝堅牢性）。
 */
const faq = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/faq' }),
  schema: z.object({
    /** 質問タイトル（一覧・詳細見出し・検索結果に表示） */
    title: z.string(),
    /** 所属カテゴリ（categories.ts の id と一致させる） */
    category: z.enum(CATEGORY_IDS),
    /** カードや検索結果に出す短い要約 */
    summary: z.string(),
    /** 注目FAQとしてトップページ上部に出すか */
    featured: z.boolean().default(false),
    /** カテゴリ内の並び順（小さいほど上に表示） */
    order: z.number().default(100),
    /** 最終更新日（詳細ページ・構造化データに使用） */
    updated: z.coerce.date().optional(),
    /** 検索補助・関連記事判定のためのキーワード */
    tags: z.array(z.string()).default([]),
    /** true の間は公開一覧・検索から除外する */
    draft: z.boolean().default(false),
  }),
});

export const collections = { faq };
