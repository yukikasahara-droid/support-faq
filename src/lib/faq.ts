import { getCollection, type CollectionEntry } from 'astro:content';
import { CATEGORY_IDS, type CategoryId } from '../data/categories';

export type FaqEntry = CollectionEntry<'faq'>;

/** order 昇順 → タイトル(日本語)で安定ソート */
function sortFaq(a: FaqEntry, b: FaqEntry): number {
  if (a.data.order !== b.data.order) return a.data.order - b.data.order;
  return a.data.title.localeCompare(b.data.title, 'ja');
}

/**
 * 公開対象のFAQ一覧。
 * 本番ビルドでは draft を除外、開発時は下書きも表示して確認できるようにする。
 */
export async function getPublishedFaq(): Promise<FaqEntry[]> {
  const all = await getCollection('faq', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return all.sort(sortFaq);
}

/** 注目FAQ（featured）だけを取得 */
export function getFeatured(pool: FaqEntry[], limit = 6): FaqEntry[] {
  return pool.filter((e) => e.data.featured).slice(0, limit);
}

/** 指定カテゴリの記事 */
export function getByCategory(pool: FaqEntry[], id: CategoryId): FaqEntry[] {
  return pool.filter((e) => e.data.category === id);
}

/** カテゴリ別の記事件数 */
export function countByCategory(pool: FaqEntry[]): Record<CategoryId, number> {
  const counts = Object.fromEntries(
    CATEGORY_IDS.map((id) => [id, 0]),
  ) as Record<CategoryId, number>;
  for (const e of pool) counts[e.data.category] += 1;
  return counts;
}

/**
 * 関連記事。まず同カテゴリを優先し、共有タグ数で加点して上位を返す。
 */
export function getRelated(entry: FaqEntry, pool: FaqEntry[], limit = 4): FaqEntry[] {
  return pool
    .filter((e) => e.id !== entry.id)
    .map((e) => {
      let score = e.data.category === entry.data.category ? 3 : 0;
      score += e.data.tags.filter((t) => entry.data.tags.includes(t)).length;
      return { e, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score || sortFaq(a.e, b.e))
    .slice(0, limit)
    .map((s) => s.e);
}

/** 日付を「2026年8月1日」形式に（frontmatterは日付のみなのでUTCで読む） */
export function formatDate(d?: Date): string | null {
  if (!d) return null;
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月${d.getUTCDate()}日`;
}
