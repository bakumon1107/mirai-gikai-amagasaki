"use client";

import {
  Check,
  Copy,
  Menu,
  MessageCircle,
  Monitor,
  Search,
  Send,
  Smartphone,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { DesktopNav } from "@/components/layouts/navigation/desktop-nav";
import {
  buildMobileNavItems,
  buildPcNavItems,
} from "@/components/layouts/navigation/nav-items";
import { Button } from "@/components/ui/button";
import { resolveSessionSlots } from "@/features/council-sessions/shared/utils/resolve-session-slot-status";
import { ArchiveHomeView } from "@/features/top-sections/server/components/archive-home-view";
import { cn } from "@/lib/utils";
import {
  MUNICIPALITY_PRESETS,
  type MunicipalityPresetKey,
  SAMPLE_BILL_SUMMARY_CLOSED,
  SAMPLE_BILL_SUMMARY_IN_SESSION,
  SAMPLE_COMMITTEES,
  SAMPLE_LATEST_CONFERENCE,
  SAMPLE_PRESS_CONFERENCES,
  SAMPLE_QUESTIONS,
  SAMPLE_RECENT_CONFERENCES,
  createSampleSessions,
} from "../_data/sample-top-data";
import {
  PREVIEW_FRAME_SRCDOC,
  isPreviewDocumentReady,
  measurePreviewHeight,
  syncHeadStyles,
} from "../_utils/preview-frame";

type HomeLayoutOption = "bills" | "archive";
type SessionStateOption = "closed" | "in_session";
type ViewportOption = "desktop" | "mobile";

type FeatureState = {
  bills: boolean;
  showFactionStances: boolean;
  generalQuestions: boolean;
  committeeMinutes: boolean;
  pressConferences: boolean;
  search: boolean;
  aiChat: boolean;
};

const FEATURE_LABELS: Array<{
  key: keyof FeatureState;
  label: string;
  hint: string;
}> = [
  { key: "bills", label: "議案一覧・詳細", hint: "Tier 1 以上" },
  {
    key: "showFactionStances",
    label: "会派別賛否",
    hint: "会派別データがある場合",
  },
  {
    key: "generalQuestions",
    label: "一般質問・代表質問",
    hint: "会議録アーカイブ",
  },
  {
    key: "committeeMinutes",
    label: "委員会議事録",
    hint: "記名ありの委員会記録",
  },
  {
    key: "pressConferences",
    label: "首長記者会見",
    hint: "定例会見の公開がある場合",
  },
  { key: "search", label: "横断検索・テーマ", hint: "キーワード・8テーマ検索" },
  { key: "aiChat", label: "AIチャット", hint: "LLM APIキー設定時" },
];

function PreviewViewportFrame({
  viewport,
  children,
}: {
  viewport: ViewportOption;
  children: ReactNode;
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const setupDocument = () => {
      const doc = iframe.contentDocument;
      if (!isPreviewDocumentReady(doc)) return;

      doc.documentElement.lang = document.documentElement.lang || "ja";
      doc.documentElement.className = document.documentElement.className;
      doc.body.className = document.body.className;
      doc.body.style.margin = "0";
      doc.body.style.overflowX = "hidden";

      syncHeadStyles(document, doc);

      let root = doc.getElementById("preview-root");
      if (!root) {
        root = doc.createElement("div");
        root.id = "preview-root";
        doc.body.replaceChildren(root);
      }
      setMountNode(root);
    };

    iframe.addEventListener("load", setupDocument);
    setupDocument();

    const headObserver = new MutationObserver(() => {
      const doc = iframe.contentDocument;
      if (!isPreviewDocumentReady(doc)) return;
      syncHeadStyles(document, doc);
    });
    headObserver.observe(document.head, { childList: true });

    return () => {
      iframe.removeEventListener("load", setupDocument);
      headObserver.disconnect();
      setMountNode(null);
    };
  }, []);

  useEffect(() => {
    if (!mountNode) return;

    const updateHeight = () => {
      setHeight(measurePreviewHeight(mountNode, 400));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(mountNode);
    return () => observer.disconnect();
  }, [mountNode]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title="トップページプレビュー"
        srcDoc={PREVIEW_FRAME_SRCDOC}
        style={{ height: `${height}px` }}
        className={cn(
          "w-full rounded-2xl border border-mirai-border bg-mirai-surface shadow-sm transition-all",
          viewport === "mobile" ? "max-w-[390px]" : "max-w-full"
        )}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}

export function TopPreviewClient() {
  const [homeLayout, setHomeLayout] = useState<HomeLayoutOption>("archive");
  const [sessionState, setSessionState] =
    useState<SessionStateOption>("closed");
  const [municipalityKey, setMunicipalityKey] =
    useState<MunicipalityPresetKey>("city");
  const [viewport, setViewport] = useState<ViewportOption>("desktop");
  const [copied, setCopied] = useState(false);

  const [features, setFeatures] = useState<FeatureState>({
    bills: true,
    showFactionStances: true,
    generalQuestions: true,
    committeeMinutes: true,
    pressConferences: true,
    search: true,
    aiChat: false,
  });

  const municipality = MUNICIPALITY_PRESETS[municipalityKey];
  const sessions = useMemo(
    () => createSampleSessions(municipality.regularSessionMonths),
    [municipality.regularSessionMonths]
  );

  const today = sessionState === "in_session" ? "2026-09-17" : "2026-08-26";
  const currentSession = sessionState === "in_session" ? sessions[2] : null;
  const nextSession = sessionState === "in_session" ? sessions[3] : sessions[2];
  const sessionSlots = useMemo(
    () =>
      resolveSessionSlots(sessions, today, municipality.regularSessionMonths),
    [sessions, today, municipality.regularSessionMonths]
  );

  const mobileNavItems = useMemo(
    () => buildMobileNavItems(features),
    [features]
  );
  const pcNavItems = useMemo(
    () => buildPcNavItems(features, municipality.executiveTitle),
    [features, municipality.executiveTitle]
  );

  const applyPreset = (
    preset: "bills-tier2" | "archive-full" | "archive-town"
  ) => {
    if (preset === "bills-tier2") {
      setHomeLayout("bills");
      setMunicipalityKey("city");
      setSessionState("closed");
      setFeatures({
        bills: true,
        showFactionStances: true,
        generalQuestions: true,
        committeeMinutes: false,
        pressConferences: false,
        search: true,
        aiChat: true,
      });
      return;
    }
    if (preset === "archive-full") {
      setHomeLayout("archive");
      setMunicipalityKey("pref");
      setSessionState("closed");
      setFeatures({
        bills: true,
        showFactionStances: true,
        generalQuestions: true,
        committeeMinutes: true,
        pressConferences: true,
        search: true,
        aiChat: false,
      });
      return;
    }
    setHomeLayout("archive");
    setMunicipalityKey("town");
    setSessionState("closed");
    setFeatures({
      bills: true,
      showFactionStances: false,
      generalQuestions: true,
      committeeMinutes: false,
      pressConferences: false,
      search: true,
      aiChat: false,
    });
  };

  const toggleFeature = (key: keyof FeatureState) => {
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const configSnippet = useMemo(() => {
    return `homeLayout: "${homeLayout}" as "bills" | "archive",
executiveTitle: "${municipality.executiveTitle}",
executiveName: "" as string,
governmentTerm: "${municipality.governmentTerm}",
regularSessionMonths: [${municipality.regularSessionMonths.join(", ")}] as readonly number[],
features: {
  bills: ${features.bills} as boolean,
  showFactionStances: ${features.showFactionStances} as boolean,
  generalQuestions: ${features.generalQuestions} as boolean,
  committeeMinutes: ${features.committeeMinutes} as boolean,
  pressConferences: ${features.pressConferences} as boolean,
  search: ${features.search} as boolean,
  aiChat: ${features.aiChat} as boolean,
  aiInterview: false as boolean,
  showTeamMiraiSection: false as boolean,
},`;
  }, [homeLayout, municipality, features]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(configSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-mirai-text">
          トップ構成・パーツ選択シミュレーター
        </h1>
        <p className="mt-1 text-sm text-mirai-text-secondary">
          自治体の調査結果に合わせて、トップページの型（議案中心 /
          議事録・活動中心）と各パーツの ON/OFF
          を切り替えながら実画面イメージを確認できます。
        </p>
      </div>

      {/* コントロールパネル */}
      <div className="rounded-2xl border border-mirai-border bg-white p-5 flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-mirai-text-secondary mr-1">
            おすすめプリセット:
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset("bills-tier2")}
          >
            議案中心（Tier 2）
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset("archive-full")}
          >
            議事録中心（フル構成・県議会型）
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => applyPreset("archive-town")}
          >
            議事録中心（小規模町・記者会見/委員会なし）
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-mirai-text-secondary">
              トップの型（homeLayout）
            </span>
            <div className="flex gap-2">
              <Button
                type="button"
                size="sm"
                variant={homeLayout === "bills" ? "default" : "outline"}
                onClick={() => setHomeLayout("bills")}
              >
                bills（議案中心）
              </Button>
              <Button
                type="button"
                size="sm"
                variant={homeLayout === "archive" ? "default" : "outline"}
                onClick={() => setHomeLayout("archive")}
              >
                archive（議事録中心）
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-mirai-text-secondary">
              自治体タイプ（語彙・開催月）
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(
                Object.keys(MUNICIPALITY_PRESETS) as MunicipalityPresetKey[]
              ).map((key) => (
                <Button
                  key={key}
                  type="button"
                  size="sm"
                  variant={municipalityKey === key ? "default" : "outline"}
                  onClick={() => setMunicipalityKey(key)}
                >
                  {MUNICIPALITY_PRESETS[key].cityName.replace("サンプル", "")}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-mirai-text-secondary">
              表示状態 / 画面幅
            </span>
            <div className="flex flex-wrap gap-1.5">
              {homeLayout === "archive" && (
                <>
                  <Button
                    type="button"
                    size="sm"
                    variant={sessionState === "closed" ? "default" : "outline"}
                    onClick={() => setSessionState("closed")}
                  >
                    閉会中
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      sessionState === "in_session" ? "default" : "outline"
                    }
                    onClick={() => setSessionState("in_session")}
                  >
                    会期中
                  </Button>
                </>
              )}
              <Button
                type="button"
                size="sm"
                variant={viewport === "desktop" ? "default" : "outline"}
                onClick={() => setViewport("desktop")}
              >
                <Monitor className="size-3.5" />
                PC
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewport === "mobile" ? "default" : "outline"}
                onClick={() => setViewport("mobile")}
              >
                <Smartphone className="size-3.5" />
                スマホ幅
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold text-mirai-text-secondary">
            載せるパーツ（siteConfig.features）
          </span>
          <div className="flex flex-wrap gap-2">
            {FEATURE_LABELS.map(({ key, label, hint }) => (
              <Button
                key={key}
                type="button"
                size="sm"
                variant={features[key] ? "default" : "outline"}
                onClick={() => toggleFeature(key)}
                title={hint}
              >
                {features[key] ? "ON" : "OFF"} : {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* プレビュー領域（iframe で独立ビューポートを作り PC / スマホ幅のメディアクエリを正確に反映） */}
      <div className="flex justify-center">
        <PreviewViewportFrame viewport={viewport}>
          <div className="w-full bg-mirai-surface">
            {/* 疑似ヘッダー */}
            <div className="bg-white border-b border-mirai-border px-4 py-3 flex items-center justify-between gap-3">
              <span className="font-bold text-sm text-mirai-text whitespace-nowrap">
                みらい議会＠{municipality.cityName}
              </span>
              {homeLayout === "archive" && viewport === "desktop" && (
                <DesktopNav
                  features={features}
                  executiveTitle={municipality.executiveTitle}
                />
              )}
              <div className="flex items-center gap-2 text-xs text-mirai-text-muted">
                {features.search ? (
                  <span className="inline-flex items-center gap-1 text-mirai-text-secondary">
                    <Search className="size-3.5" />
                    検索あり
                  </span>
                ) : (
                  <span>検索なし</span>
                )}
                {homeLayout === "bills" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-mirai-surface-grouped px-2 py-0.5 text-mirai-text-secondary">
                    <Menu className="size-3.5" />
                    メニュー({pcNavItems.length})
                  </span>
                )}
              </div>
            </div>

            {/* 本体（PC幅で AI チャット ON のときは本番同様に右サイドパネルを並べる） */}
            <div
              className={cn(
                "w-full",
                features.aiChat && viewport === "desktop" && "flex items-start"
              )}
            >
              <div className="flex-1 min-w-0">
                {homeLayout === "archive" ? (
                  <div className="py-4">
                    <ArchiveHomeView
                      currentSession={currentSession}
                      nextSession={nextSession}
                      latestConference={SAMPLE_LATEST_CONFERENCE}
                      recentConferences={SAMPLE_RECENT_CONFERENCES}
                      inSessionCounts={
                        sessionState === "in_session"
                          ? { deliberatingBills: 4, questioners: 12 }
                          : null
                      }
                      today={today}
                      sessionSlots={sessionSlots}
                      committeeMeetings={SAMPLE_COMMITTEES}
                      questions={SAMPLE_QUESTIONS}
                      questionSessionName="令和8年 6月定例会"
                      billSummary={
                        sessionState === "in_session"
                          ? SAMPLE_BILL_SUMMARY_IN_SESSION
                          : SAMPLE_BILL_SUMMARY_CLOSED
                      }
                      billsSessionSlug={
                        sessionState === "in_session" ? "r8-09" : "r8-06"
                      }
                      isBillSessionInSession={sessionState === "in_session"}
                      pastSessions={sessions}
                      pressConferences={SAMPLE_PRESS_CONFERENCES}
                      cityName={municipality.cityName}
                      councilName={municipality.councilName}
                      executiveTitle={municipality.executiveTitle}
                      governmentTerm={municipality.governmentTerm}
                      features={features}
                    />
                  </div>
                ) : (
                  <div className="max-w-[700px] mx-auto p-6 flex flex-col gap-6">
                    <div className="rounded-2xl bg-mirai-gradient p-8 text-mirai-text">
                      <p className="text-xs font-medium text-primary-accent">
                        議案中心レイアウト（homeLayout: &quot;bills&quot;）
                      </p>
                      <p className="mt-2 text-xl font-bold leading-relaxed">
                        いま{municipality.councilName}で議論されていること
                        <br />
                        やさしい言葉で説明します
                      </p>
                    </div>

                    {features.bills ? (
                      <div className="rounded-2xl bg-white p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h2 className="font-bold text-mirai-text">
                            注目の議案
                          </h2>
                          <span className="rounded-full bg-mirai-surface-grouped px-2.5 py-1 text-xs text-mirai-text-secondary">
                            会派別賛否:{" "}
                            {features.showFactionStances
                              ? "表示する"
                              : "非表示（可否のみ）"}
                          </span>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-mirai-border p-4">
                            <span className="text-xs text-primary-accent font-medium">
                              子育て・教育
                            </span>
                            <p className="mt-1 font-bold text-sm text-mirai-text">
                              学校給食費の無償化に関する条例の一部改正
                            </p>
                            <p className="mt-1 text-xs text-mirai-text-secondary">
                              対象学年を拡大し、保護者の負担を軽減します。
                            </p>
                          </div>
                          <div className="rounded-xl border border-mirai-border p-4">
                            <span className="text-xs text-primary-accent font-medium">
                              防災・安全
                            </span>
                            <p className="mt-1 font-bold text-sm text-mirai-text">
                              令和8年度 一般会計補正予算（第2号）
                            </p>
                            <p className="mt-1 text-xs text-mirai-text-secondary">
                              避難所の空調設備と非常用電源の整備費を計上します。
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-mirai-border bg-white/60 p-5 text-xs text-mirai-text-secondary">
                        「議案一覧・詳細（features.bills）」が OFF
                        のため、議案パーツは非表示になります。議案を出さない自治体では
                        homeLayout: &quot;archive&quot; をおすすめします。
                      </div>
                    )}

                    {/* bills 型でメニュー・フッターに現れるパーツのプレビュー */}
                    <div className="rounded-2xl border border-mirai-border bg-white p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h2 className="font-bold text-sm text-mirai-text">
                          メニューから開ける機能（bills 型の構成）
                        </h2>
                        <span className="text-xs text-mirai-text-muted">
                          ヘッダーメニュー・フッターに反映
                        </span>
                      </div>
                      <p className="text-xs text-mirai-text-secondary">
                        議案中心レイアウトでは、一般質問・委員会・
                        {municipality.executiveTitle}
                        記者会見はトップ本文ではなくヘッダーのメニューやフッターから開く構成になります。
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {pcNavItems.map((item) => (
                          <span
                            key={item.href}
                            className="rounded-full bg-mirai-surface-grouped px-3 py-1 text-xs font-medium text-mirai-text"
                          >
                            {item.label}
                          </span>
                        ))}
                        {features.search && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mirai-surface-grouped px-3 py-1 text-xs font-medium text-mirai-text">
                            <Search className="size-3" />
                            横断検索
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PC幅の AI チャット右サイドパネルプレビュー */}
              {features.aiChat && viewport === "desktop" && (
                <aside className="w-[320px] shrink-0 border-l border-mirai-border bg-white p-4 flex flex-col gap-4 self-stretch">
                  <div className="flex items-center gap-2 border-b border-mirai-border pb-3">
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-mirai-gradient text-mirai-text">
                      <MessageCircle className="size-4" />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-mirai-text">
                        AI チャット（PC 右サイド常駐）
                      </p>
                      <p className="text-[11px] text-mirai-text-secondary">
                        features.aiChat: true で表示
                      </p>
                    </div>
                  </div>
                  <p className="text-xs font-bold leading-relaxed text-mirai-text">
                    議会や議案について、気になることをAIに質問してください。
                  </p>
                  <div className="flex flex-col gap-2">
                    <span className="rounded-xl border border-mirai-border bg-mirai-surface px-3 py-2 text-xs text-mirai-text-secondary">
                      いま注目されている議案は？
                    </span>
                    <span className="rounded-xl border border-mirai-border bg-mirai-surface px-3 py-2 text-xs text-mirai-text-secondary">
                      子育て・教育に関する議論を教えて
                    </span>
                  </div>
                  <div className="mt-auto rounded-full border border-mirai-border bg-mirai-surface px-3.5 py-2 flex items-center justify-between gap-2 text-xs text-mirai-text-muted">
                    <span>わからないことをAIに質問する</span>
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-mirai-gradient text-mirai-text">
                      <Send className="size-3.5" />
                    </span>
                  </div>
                </aside>
              )}
            </div>

            {/* スマホ幅の AI チャットフローティングボタンプレビュー */}
            {features.aiChat && viewport === "mobile" && (
              <div className="px-4 py-3 bg-mirai-surface">
                <div className="rounded-full bg-mirai-gradient p-[2px] shadow-sm">
                  <div className="rounded-full bg-white px-4 py-2.5 flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-mirai-text-secondary">
                      わからないことをAIに質問する
                    </span>
                    <span className="inline-flex size-8 items-center justify-center rounded-full bg-mirai-gradient text-mirai-text">
                      <MessageCircle className="size-4" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* スマホボトムナビのイメージ */}
            {homeLayout === "archive" && mobileNavItems.length > 1 && (
              <div className="border-t border-archive-divider bg-white px-3 py-2 flex items-center justify-around text-xs text-mirai-text-secondary">
                {mobileNavItems.map((item, idx) => (
                  <span
                    key={item.href}
                    className={cn(
                      "px-2.5 py-1 rounded-full",
                      idx === 0 &&
                        "bg-archive-pill-bg text-archive-pill-text font-medium"
                    )}
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </PreviewViewportFrame>
      </div>

      {/* siteConfig スニペット出力 */}
      <div className="rounded-2xl border border-mirai-border bg-white p-5">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div>
            <h2 className="text-sm font-bold text-mirai-text">
              この構成の `web/src/config/site.config.ts` 設定スニペット
            </h2>
            <p className="text-xs text-mirai-text-secondary">
              選んだ組み合わせをそのまま `site.config.ts`
              に貼り付けて反映できます。
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check className="size-3.5" />
                コピーしました
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                コピー
              </>
            )}
          </Button>
        </div>
        <pre className="rounded-xl bg-mirai-surface p-4 text-xs overflow-x-auto text-mirai-text">
          <code>{configSnippet}</code>
        </pre>
      </div>
    </div>
  );
}
