/**
 * FAQ カテゴリのマスタ。
 * ここがカテゴリ定義の唯一の元。各記事(frontmatter)の `category` はこの id を参照する。
 * カテゴリを増減する場合は CATEGORY_IDS と categories の両方を編集する。
 *
 * 分類はナレッジベース進捗管理シート（オリィ研究所）の「カテゴリ」列に準拠する。
 * 表示名は日本語の正式名称、id は URL 用の短い英字スラッグ。
 * ※シート上で「通信・ネットワークに関するお困りごと」「通信・ネットワーク環境に
 *   関するお困りごと」の2表記が混在しているが、同一カテゴリとして `network` に統合している。
 */

export const CATEGORY_IDS = [
  'start-guide',
  'device-operation',
  'network',
  'other',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

/**
 * 記事タグの統制語彙（シートの「タグ」列）。
 * frontmatter の tags はこの語彙から選ぶ（検索補助・関連記事スコアリングに使用）。
 * ゆらぎ防止のための一覧であり、スキーマ上は将来の追加に備えて自由文字列を許容する。
 */
export const TAG_VOCAB = [
  'スタートガイド',
  'アカウント関連',
  'トラブルシューティング',
  '通信',
  '活用方法',
] as const;

export interface Category {
  id: CategoryId;
  /** 表示名（正式名称） */
  name: string;
  /** 一覧・カード等に添える短い説明 */
  description: string;
  /** アイコン種別（BrandIcon コンポーネントが SVG を対応付ける） */
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'start-guide',
    name: 'スタートガイド',
    description: 'アカウント・初期設定・ネットワーク要件など、使い始めの準備',
    icon: 'rocket',
  },
  {
    id: 'device-operation',
    name: 'OriHimeの機体・操作時のお困りごと',
    description: 'ランプ表示・再起動・操作画面の不具合など、機体まわりの対処',
    icon: 'cursor',
  },
  {
    id: 'network',
    name: '通信・ネットワークに関するお困りごと',
    description: '動作・通信が不安定なときの切り分けと、ネットワーク環境の改善',
    icon: 'wifi',
  },
  {
    id: 'other',
    name: 'その他のお困りごと',
    description: 'お問い合わせ先など、上記に当てはまらないご質問',
    icon: 'help-circle',
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: CategoryId): Category {
  return categoryMap[id];
}
