// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';

// `site` は本番の公開URL（暫定）。sitemap / canonical / OGP の絶対URL生成に使う。
// 実際のドメインが決まったらここを差し替える。
// GitHub Pages（プロジェクトページ）で配信するため base をリポジトリ名に合わせる。
// 独自ドメイン等ルート配信に変える場合は base を外し、site を差し替える。
export default defineConfig({
  site: 'https://yukikasahara-droid.github.io',
  base: '/support-faq',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
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
