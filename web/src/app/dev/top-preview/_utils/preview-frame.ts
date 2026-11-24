export const PREVIEW_FRAME_ATTR = "data-preview-frame";
export const PREVIEW_FRAME_READY_VALUE = "ready";

export const PREVIEW_FRAME_SRCDOC = `<!doctype html><html><head></head><body ${PREVIEW_FRAME_ATTR}="${PREVIEW_FRAME_READY_VALUE}"></body></html>`;

/**
 * iframe の srcDoc がロード完了済みかを判定する。
 *
 * マウント直後の初期 about:blank は readyState === "complete" になるため、
 * srcDoc 側に埋め込んだ data 属性の有無もあわせて確認し、
 * 破棄直前の about:blank に誤ってポータルを作成する競合を防ぐ。
 */
export function isPreviewDocumentReady(
  doc: Document | null | undefined
): doc is Document {
  if (!doc) return false;
  if (doc.readyState !== "complete") return false;
  return (
    doc.body?.getAttribute(PREVIEW_FRAME_ATTR) === PREVIEW_FRAME_READY_VALUE
  );
}

function getStyleSignature(doc: Document): string {
  return Array.from(doc.querySelectorAll('link[rel="stylesheet"], style'))
    .map((node) =>
      node.tagName === "LINK"
        ? `L:${node.getAttribute("href") ?? ""}`
        : `S:${node.textContent ?? ""}`
    )
    .join("\0");
}

/**
 * 親ドキュメントのスタイルシート・インラインスタイルを iframe の head に同期する。
 * 既に同一のスタイル構成であれば DOM を書き換えず、再適用によるちらつきを防ぐ。
 */
export function syncHeadStyles(
  sourceDoc: Document,
  targetDoc: Document
): boolean {
  if (getStyleSignature(sourceDoc) === getStyleSignature(targetDoc)) {
    return false;
  }
  const styleNodes = Array.from(
    sourceDoc.querySelectorAll('link[rel="stylesheet"], style'),
    (node) => node.cloneNode(true)
  );
  targetDoc.head.replaceChildren(...styleNodes);
  return true;
}

/**
 * プレビューコンテンツの実寸高さを計測する。
 *
 * scrollHeight は親 iframe の高さより縮みにくいため、
 * getBoundingClientRect().height と offsetHeight を基準にする。
 */
export function measurePreviewHeight(
  mountNode: HTMLElement,
  minHeight = 400
): number {
  const rectHeight = Math.ceil(mountNode.getBoundingClientRect().height);
  return Math.max(rectHeight, mountNode.offsetHeight, minHeight);
}
