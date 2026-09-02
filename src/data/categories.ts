/**
 * FAQ カテゴリのマスタ。
 * ここがカテゴリ定義の唯一の元。各記事(frontmatter)の `category` はこの id を参照する。
 * カテゴリを増減する場合は CATEGORY_IDS と categories の両方を編集する。
 */

export const CATEGORY_IDS = [
  'getting-started',
  'connection',
  'operation',
  'av',
  'power',
  'troubleshooting',
  'maintenance',
  'account',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  /** 表示名 */
  name: string;
  /** カテゴリの短い説明（カード等に表示） */
  description: string;
  /** アイコン種別（BrandIcon コンポーネントが SVG を対応付ける） */
  icon: string;
}

export const categories: Category[] = [
  {
    id: 'getting-started',
    name: 'はじめに・初期設定',
    description: '開封から使い始めまでの準備とセットアップ',
    icon: 'rocket',
  },
  {
    id: 'connection',
    name: '接続・ネットワーク',
    description: 'Wi-Fi 接続やネットワークまわりのご案内',
    icon: 'wifi',
  },
  {
    id: 'operation',
    name: '操作・使い方',
    description: '基本の操作方法や日々の使い方',
    icon: 'cursor',
  },
  {
    id: 'av',
    name: 'カメラ・マイク・音声',
    description: '映像や音声が出ないときの確認事項',
    icon: 'camera',
  },
  {
    id: 'power',
    name: '充電・電源・バッテリー',
    description: '電源が入らない・電池の持ちに関するご案内',
    icon: 'battery',
  },
  {
    id: 'troubleshooting',
    name: 'トラブルシューティング',
    description: '動作がおかしいときの切り分けと対処',
    icon: 'wrench',
  },
  {
    id: 'maintenance',
    name: 'メンテナンス・修理',
    description: 'お手入れ・点検・修理のご依頼について',
    icon: 'shield',
  },
  {
    id: 'account',
    name: 'アカウント・ご契約',
    description: '登録情報やお支払い・ご契約の変更',
    icon: 'user',
  },
];

export const categoryMap = Object.fromEntries(
  categories.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export function getCategory(id: CategoryId): Category {
  return categoryMap[id];
}
