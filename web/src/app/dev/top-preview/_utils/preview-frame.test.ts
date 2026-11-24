// @vitest-environment jsdom

import { describe, expect, it } from "vitest";
import {
  PREVIEW_FRAME_ATTR,
  PREVIEW_FRAME_READY_VALUE,
  isPreviewDocumentReady,
  measurePreviewHeight,
  syncHeadStyles,
} from "./preview-frame";

function createDocumentWithReadyState(
  readyState: DocumentReadyState
): Document {
  const doc = document.implementation.createHTMLDocument("");
  Object.defineProperty(doc, "readyState", {
    value: readyState,
    configurable: true,
  });
  return doc;
}

describe("isPreviewDocumentReady", () => {
  it("doc が null / undefined のときは false を返す", () => {
    expect(isPreviewDocumentReady(null)).toBe(false);
    expect(isPreviewDocumentReady(undefined)).toBe(false);
  });

  it("初期 about:blank（readyState=complete だが srcDoc マーカーなし）は false を返す", () => {
    const aboutBlankDoc = createDocumentWithReadyState("complete");
    expect(isPreviewDocumentReady(aboutBlankDoc)).toBe(false);
  });

  it("srcDoc マーカーがあっても readyState が complete でなければ false を返す", () => {
    const loadingDoc = createDocumentWithReadyState("loading");
    loadingDoc.body.setAttribute(PREVIEW_FRAME_ATTR, PREVIEW_FRAME_READY_VALUE);
    expect(isPreviewDocumentReady(loadingDoc)).toBe(false);
  });

  it("srcDoc マーカーがあり readyState が complete のとき true を返す", () => {
    const readyDoc = createDocumentWithReadyState("complete");
    readyDoc.body.setAttribute(PREVIEW_FRAME_ATTR, PREVIEW_FRAME_READY_VALUE);
    expect(isPreviewDocumentReady(readyDoc)).toBe(true);
  });
});

describe("syncHeadStyles", () => {
  it("stylesheet link と style タグだけを targetDoc.head に同期し、差分がなければスキップする", () => {
    const sourceDoc = document.implementation.createHTMLDocument("source");
    const targetDoc = document.implementation.createHTMLDocument("target");

    const link = sourceDoc.createElement("link");
    link.rel = "stylesheet";
    link.href = "/_next/static/css/app.css";
    const style = sourceDoc.createElement("style");
    style.textContent = ".foo { color: red; }";
    const script = sourceDoc.createElement("script");
    script.textContent = "console.log('skip')";
    sourceDoc.head.append(link, style, script);

    expect(syncHeadStyles(sourceDoc, targetDoc)).toBe(true);
    expect(
      targetDoc.head.querySelectorAll('link[rel="stylesheet"]')
    ).toHaveLength(1);
    expect(targetDoc.head.querySelectorAll("style")).toHaveLength(1);
    expect(targetDoc.head.querySelectorAll("script")).toHaveLength(0);

    // 変更がなければ DOM 書き換えをスキップする
    expect(syncHeadStyles(sourceDoc, targetDoc)).toBe(false);

    // 後から追加された style にも再同期で追従する
    const lateStyle = sourceDoc.createElement("style");
    lateStyle.textContent = ".bar { color: blue; }";
    sourceDoc.head.append(lateStyle);

    expect(syncHeadStyles(sourceDoc, targetDoc)).toBe(true);
    expect(targetDoc.head.querySelectorAll("style")).toHaveLength(2);
  });
});

describe("measurePreviewHeight", () => {
  it("実寸高さが minHeight より大きければ実寸を返す", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () =>
      ({
        height: 1234.2,
        width: 800,
        top: 0,
        left: 0,
        bottom: 1234.2,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    expect(measurePreviewHeight(el, 400)).toBe(1235);
  });

  it("実寸高さが minHeight より小さければ minHeight を返す", () => {
    const el = document.createElement("div");
    el.getBoundingClientRect = () =>
      ({
        height: 120,
        width: 800,
        top: 0,
        left: 0,
        bottom: 120,
        right: 800,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect;
    expect(measurePreviewHeight(el, 400)).toBe(400);
  });
});
