const BASE = import.meta.env.BASE_URL;

/**
 * 内部パス（`/` 始まり）にベースパス（GitHub Pages のサブディレクトリ等）を付与する。
 * 外部URL・スキーム（mailto: / tel: など）・アンカー（#...）はそのまま返す。
 * これによりリンクが配信先のパスに依存せず、ルート配信でもサブパス配信でも動く。
 */
export function url(path = '/'): string {
  if (/^([a-z][a-z0-9+.-]*:|\/\/|#)/i.test(path)) return path;
  const base = BASE.endsWith('/') ? BASE : `${BASE}/`;
  return base + path.replace(/^\//, '');
}
