// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// `site` は本番の公開URL（暫定）。sitemap / canonical / OGP の絶対URL生成に使う。
// 実際のドメインが決まったらここを差し替える。
// GitHub Pages（プロジェクトページ）で配信するため base をリポジトリ名に合わせる。
// 独自ドメイン等ルート配信に変える場合は base を外し、site を差し替える。
const BASE = '/support-faq';

/**
 * Markdown 本文中の内部リンク（例: `/faq/orihime-network`）に base を前置する rehype プラグイン。
 * .astro 側は url() ヘルパで base を付けているが、Markdown の素のリンクには Astro が base を付けない。
 * これが無いと GitHub Pages（/support-faq 配下）や将来の別リポジトリ移設で内部リンクが 404 になる。
 * 記事側は base を直書きせず `/faq/xxx` と書けば良い状態を保つ（＝移設耐性・堅牢性）。
 */
function rehypeBasePrefix() {
  return (/** @type {any} */ tree) => {
    const visit = (/** @type {any} */ node) => {
      if (
        node.tagName === 'a' &&
        node.properties &&
        typeof node.properties.href === 'string'
      ) {
        const href = node.properties.href;
        const isInternalAbsolute =
          href.startsWith('/') &&
          !href.startsWith('//') &&
          href !== BASE &&
          !href.startsWith(BASE + '/');
        if (isInternalAbsolute) node.properties.href = BASE + href;
      }
      if (Array.isArray(node.children)) node.children.forEach(visit);
    };
    visit(tree);
  };
}

export default defineConfig({
  site: 'https://yukikasahara-droid.github.io',
  base: BASE,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  markdown: {
    rehypePlugins: [rehypeBasePrefix],
  },
  // 内部リンクを hover 時に先読みして体感速度を上げる（静的サイトなので安全）。
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  integrations: [
    sitemap(),
    // Pagefind: `astro build` 後に dist を全文インデックス化し、/search で検索できるようにする。
    pagefind(),
  ],
});
