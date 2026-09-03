// サイトから計測イベントを送る「唯一の出し口」。
// 送り先は PUBLIC_TELEMETRY_ENDPOINT（ビルド時に埋め込み）。未設定なら無効＝何も送らない
// （公開サンプルやローカルでも壊れない）。将来 Clarity 等の別送信先を足すのもここ1か所で済む。
// - sendBeacon（text/plain）で送るため CORS プリフライト不要・ページ遷移時も落ちにくい。
// - 付与するのは匿名の一時ID（sessionStorage）のみ。個人情報・IPは送らない/保存しない。

function sessionId(): string {
  try {
    const k = 'sf_sid';
    let v = sessionStorage.getItem(k);
    if (!v) {
      v = crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return 'anon';
  }
}

const ENDPOINT = import.meta.env.PUBLIC_TELEMETRY_ENDPOINT as string | undefined;

export type TrackType = 'search' | 'result_click' | 'view' | 'feedback';

export function track(type: TrackType, data: Record<string, unknown> = {}): void {
  if (!ENDPOINT) return;
  let payload: string;
  try {
    payload = JSON.stringify({ type, session_id: sessionId(), path: location.pathname, ...data });
  } catch {
    return;
  }
  try {
    const blob = new Blob([payload], { type: 'text/plain' });
    if (navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob)) return;
    void fetch(ENDPOINT, {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'text/plain' },
      keepalive: true,
      mode: 'no-cors',
    });
  } catch {
    /* 計測失敗はユーザー体験に影響させない */
  }
}
