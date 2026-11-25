/**
 * 開発用シードデータ（尼崎市版）
 *
 * 尼崎市議会 令和8年9月（第8回定例会）・令和8年6月（第6回定例会）の
 * 公開議案説明資料・採決結果一覧表をもとに作成した初期開発用データです。
 */

import type { Database } from "@mirai-gikai/supabase";

type BillInsert = Database["public"]["Tables"]["bills"]["Insert"];
type FactionStanceInsert =
  Database["public"]["Tables"]["faction_stances"]["Insert"];
type TagInsert = Database["public"]["Tables"]["tags"]["Insert"];
type BillsTagsInsert = Database["public"]["Tables"]["bills_tags"]["Insert"];
type CouncilSessionInsert =
  Database["public"]["Tables"]["council_sessions"]["Insert"];
type FactionInsert = Database["public"]["Tables"]["factions"]["Insert"];
type CommitteeInsert = Database["public"]["Tables"]["committees"]["Insert"];
type InterviewConfigInsert =
  Database["public"]["Tables"]["interview_configs"]["Insert"];
type InterviewQuestionInsert =
  Database["public"]["Tables"]["interview_questions"]["Insert"];
type InterviewSessionInsert =
  Database["public"]["Tables"]["interview_sessions"]["Insert"];
type InterviewMessageInsert =
  Database["public"]["Tables"]["interview_messages"]["Insert"];
type InterviewReportInsert =
  Database["public"]["Tables"]["interview_report"]["Insert"];

// 定例会データ（尼崎市議会は2・6・9・12月が定例会）
export const councilSessions: CouncilSessionInsert[] = [
  {
    name: "令和8年9月 第8回定例会",
    slug: "r8-08",
    council_url:
      "https://www.city.amagasaki.hyogo.jp/gikai/1001054/1001061.html",
    start_date: "2026-09-01",
    end_date: "2026-10-07",
    is_active: true,
    schedule_milestones: {
      representativeQuestions: { from: "2026-09-02", to: "2026-09-02" },
      generalQuestions: { from: "2026-09-02", to: "2026-09-04" },
      standingCommittees: { from: "2026-09-16", to: "2026-09-18" },
      billVote: "2026-10-07",
    },
  },
  {
    name: "令和8年6月 第6回定例会",
    slug: "r8-06",
    council_url:
      "https://www.city.amagasaki.hyogo.jp/gikai/1001054/1001061.html",
    start_date: "2026-06-01",
    end_date: "2026-06-24",
    is_active: false,
  },
];

// 会派データ（令和8年9月 第8回定例会 採決結果一覧表準拠）
export const factions: FactionInsert[] = [
  {
    name: "komei",
    display_name: "公明党",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "sofukai",
    display_name: "蒼風会",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "ishin",
    display_name: "日本維新の会",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "shimin_green",
    display_name: "市民グリーンクラブ",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "seiun",
    display_name: "青雲の会",
    sort_order: 5,
    is_active: true,
  },
  {
    name: "ama_first",
    display_name: "尼崎市民ファーストの会",
    sort_order: 6,
    is_active: true,
  },
  {
    name: "jcp",
    display_name: "日本共産党議員団",
    sort_order: 7,
    is_active: true,
  },
];

// 常任委員会データ（尼崎市議会5常任委員会）
export const committees: CommitteeInsert[] = [
  {
    name: "総務委員会",
    description: "市の基本計画、財政、市税、公共施設再編などについての審査",
    sort_order: 1,
    is_active: true,
  },
  {
    name: "文教委員会",
    description: "学校教育、こども、図書館、文化・スポーツなどについての審査",
    sort_order: 2,
    is_active: true,
  },
  {
    name: "健康福祉委員会",
    description:
      "高齢者・障がい者福祉、子育て支援、保健衛生、医療などについての審査",
    sort_order: 3,
    is_active: true,
  },
  {
    name: "経済環境企業委員会",
    description:
      "商工業、農政、環境、ごみ処理、水道・下水道などについての審査",
    sort_order: 4,
    is_active: true,
  },
  {
    name: "建設消防防災委員会",
    description: "都市計画、道路、公園、市営住宅、消防・防災などについての審査",
    sort_order: 5,
    is_active: true,
  },
];

// タグデータ
export const tags: TagInsert[] = [
  {
    label: "まちづくり・環境",
    description: "まちづくり、公園、市営住宅、都市景観に関する議案",
    featured_priority: 1,
  },
  {
    label: "子育て・教育",
    description: "学校教育、図書館、子育て支援に関する議案",
    featured_priority: 2,
  },
  {
    label: "福祉・医療",
    description: "高齢者支援、福祉、医療に関する議案",
    featured_priority: 3,
  },
  {
    label: "防災・安全",
    description: "消防団、防災・減災、地域安全に関する議案",
    featured_priority: 4,
  },
  {
    label: "財政・公共施設",
    description: "補正予算、公共施設再編、財政運営に関する議案",
    featured_priority: 5,
  },
];

// 議案データ（先頭4件：令和8年9月第8回定例会、後半2件：令和8年6月第6回定例会）
export const CURRENT_SESSION_BILL_COUNT = 4;

export const bills: BillInsert[] = [
  {
    name: "令和8年度尼崎市一般会計補正予算（第5号）",
    status: "approved",
    status_note: "第8回定例会 本会議で原案可決（全会一致）",
    published_at: "2026-10-07T15:00:00+09:00",
    publish_status: "published",
    is_featured: true,
    thumbnail_url: "https://placehold.co/600x400",
  },
  {
    name: "工事請負契約について（園田南小学校校舎増築等工事）",
    status: "approved",
    status_note: "第8回定例会 本会議で原案可決（全会一致）",
    published_at: "2026-10-07T14:00:00+09:00",
    publish_status: "published",
    is_featured: true,
    thumbnail_url: "https://placehold.co/600x400",
  },
  {
    name: "尼崎市消防団員等公務災害補償条例の一部改正",
    status: "approved",
    status_note: "第8回定例会 本会議で原案可決（全会一致）",
    published_at: "2026-10-07T13:00:00+09:00",
    publish_status: "published",
    is_featured: false,
    thumbnail_url: "https://placehold.co/600x400",
  },
  {
    name: "尼崎市営住宅・改良住宅の設置及び管理に関する条例の一部改正",
    status: "approved",
    status_note: "第8回定例会 本会議で原案可決（全会一致）",
    published_at: "2026-10-07T12:00:00+09:00",
    publish_status: "published",
    is_featured: false,
    thumbnail_url: "https://placehold.co/600x400",
  },
  {
    name: "尼崎市新図書館整備等事業を実施するための関係条例の整備に関する条例",
    status: "approved",
    status_note: "第6回定例会 本会議で原案可決（賛成多数）",
    published_at: "2026-06-24T15:00:00+09:00",
    publish_status: "published",
    is_featured: true,
    thumbnail_url: "https://placehold.co/600x400",
  },
  {
    name: "尼崎市高齢者乗合自動車運賃助成条例の一部改正",
    status: "approved",
    status_note: "第6回定例会 本会議で原案可決（全会一致）",
    published_at: "2026-06-24T14:00:00+09:00",
    publish_status: "published",
    is_featured: false,
    thumbnail_url: "https://placehold.co/600x400",
  },
];

// 議案とタグの関連付け
export function createBillsTags(
  insertedBills: { id: string; name: string }[],
  insertedTags: { id: string; label: string }[]
): Omit<BillsTagsInsert, "id" | "created_at">[] {
  const billTagMap: { [billName: string]: string[] } = {
    "令和8年度尼崎市一般会計補正予算（第5号）": [
      "財政・公共施設",
      "まちづくり・環境",
    ],
    "工事請負契約について（園田南小学校校舎増築等工事）": ["子育て・教育"],
    "尼崎市消防団員等公務災害補償条例の一部改正": ["防災・安全"],
    "尼崎市営住宅・改良住宅の設置及び管理に関する条例の一部改正": [
      "まちづくり・環境",
    ],
    "尼崎市新図書館整備等事業を実施するための関係条例の整備に関する条例": [
      "財政・公共施設",
      "子育て・教育",
    ],
    "尼崎市高齢者乗合自動車運賃助成条例の一部改正": ["福祉・医療"],
  };

  const billsTags: Omit<BillsTagsInsert, "id" | "created_at">[] = [];

  for (const bill of insertedBills) {
    const tagLabels = billTagMap[bill.name] || [];
    for (const tagLabel of tagLabels) {
      const tag = insertedTags.find((t) => t.label === tagLabel);
      if (tag) {
        billsTags.push({
          bill_id: bill.id,
          tag_id: tag.id,
        });
      }
    }
  }

  return billsTags;
}

// 会派別の賛否データ（尼崎市議会 採決結果一覧表に基づく）
const againstFactionByBillName: Record<string, string[]> = {
  "尼崎市新図書館整備等事業を実施するための関係条例の整備に関する条例": [
    "jcp",
  ],
};

export function createFactionStances(
  insertedBills: { id: string; name: string }[],
  insertedFactions: { id: string; name: string }[]
): FactionStanceInsert[] {
  const stances: FactionStanceInsert[] = [];

  for (const bill of insertedBills) {
    const againstSet = new Set(againstFactionByBillName[bill.name] ?? []);
    const isSession6 =
      bill.name.includes("新図書館") || bill.name.includes("高齢者乗合自動車");
    const sessionLabel = isSession6 ? "第6回定例会" : "第8回定例会";

    for (const faction of insertedFactions) {
      const isAgainst = againstSet.has(faction.name);
      stances.push({
        bill_id: bill.id,
        faction_id: faction.id,
        type: isAgainst ? "against" : "for",
        comment: isAgainst
          ? `採決結果一覧表（${sessionLabel}）にて原案に反対。`
          : `採決結果一覧表（${sessionLabel}）にて原案に賛成。`,
      });
    }
  }

  return stances;
}

// インタビュー設定を作成（最初の議案用）
export function createInterviewConfig(
  insertedBills: { id: string; name: string }[]
): Omit<InterviewConfigInsert, "id" | "created_at" | "updated_at"> | null {
  const targetBill = insertedBills[0];
  if (!targetBill) return null;

  return {
    bill_id: targetBill.id,
    name: "デフォルト設定",
    status: "public",
    themes: ["賛否", "理由"],
    knowledge_source: `この議案についてあなたの意見を聞かせてください。`,
  };
}

// インタビュー質問を作成
export function createInterviewQuestions(
  interviewConfigId: string
): Omit<InterviewQuestionInsert, "id" | "created_at" | "updated_at">[] {
  return [
    {
      interview_config_id: interviewConfigId,
      question: "この議案に賛成ですか？反対ですか？",
      follow_up_guide: "ユーザーの立場を明確にしてください。",
      quick_replies: ["賛成", "反対", "どちらでもない"],
      question_order: 1,
    },
    {
      interview_config_id: interviewConfigId,
      question: "その理由を教えてください。",
      follow_up_guide: "具体的な理由を引き出してください。",
      quick_replies: null,
      question_order: 2,
    },
  ];
}

// インタビューセッションを作成（5パターン × 20回 = 100件）
export function createInterviewSessions(
  interviewConfigId: string
): Omit<InterviewSessionInsert, "id" | "created_at" | "updated_at">[] {
  const now = new Date();
  const sessions: Omit<
    InterviewSessionInsert,
    "id" | "created_at" | "updated_at"
  >[] = [];

  for (let i = 0; i < 20; i++) {
    const baseOffset = i * 86400000 * 3;

    sessions.push({
      interview_config_id: interviewConfigId,
      user_id: `00000000-0000-0000-0000-${String(i * 5 + 1).padStart(12, "0")}`,
      started_at: new Date(
        now.getTime() - baseOffset - 3600000
      ).toISOString(),
      completed_at: new Date(
        now.getTime() - baseOffset - 3000000
      ).toISOString(),
    });

    sessions.push({
      interview_config_id: interviewConfigId,
      user_id: `00000000-0000-0000-0000-${String(i * 5 + 2).padStart(12, "0")}`,
      started_at: new Date(
        now.getTime() - baseOffset - 7200000
      ).toISOString(),
      completed_at: new Date(
        now.getTime() - baseOffset - 6600000
      ).toISOString(),
    });

    sessions.push({
      interview_config_id: interviewConfigId,
      user_id: `00000000-0000-0000-0000-${String(i * 5 + 3).padStart(12, "0")}`,
      started_at: new Date(
        now.getTime() - baseOffset - 10800000
      ).toISOString(),
      completed_at: new Date(
        now.getTime() - baseOffset - 10200000
      ).toISOString(),
    });

    sessions.push({
      interview_config_id: interviewConfigId,
      user_id: `00000000-0000-0000-0000-${String(i * 5 + 4).padStart(12, "0")}`,
      started_at: new Date(
        now.getTime() - baseOffset - 14400000
      ).toISOString(),
      completed_at: new Date(
        now.getTime() - baseOffset - 13800000
      ).toISOString(),
    });

    sessions.push({
      interview_config_id: interviewConfigId,
      user_id: `00000000-0000-0000-0000-${String(i * 5 + 5).padStart(12, "0")}`,
      started_at: new Date(
        now.getTime() - baseOffset - 1800000
      ).toISOString(),
      completed_at: null,
    });
  }

  return sessions;
}

// インタビューメッセージを作成（5パターンをループ）
export function createInterviewMessages(
  sessionIds: string[]
): Omit<InterviewMessageInsert, "id" | "created_at">[] {
  const conversations = [
    [
      {
        role: "assistant" as const,
        content: "この議案に賛成ですか？反対ですか？",
      },
      { role: "user" as const, content: "賛成です" },
      {
        role: "assistant" as const,
        content: "その理由を教えてください。",
      },
      {
        role: "user" as const,
        content: "生活道路や公園の環境改善は市民のためになると思います。",
      },
      {
        role: "assistant" as const,
        content: "ありがとうございました。ご意見を承りました。",
      },
    ],
    [
      {
        role: "assistant" as const,
        content: "この議案に賛成ですか？反対ですか？",
      },
      { role: "user" as const, content: "反対です" },
      {
        role: "assistant" as const,
        content: "その理由を教えてください。",
      },
      {
        role: "user" as const,
        content: "財源の使い方や優先順位をもっと議論すべきだと思います。",
      },
      {
        role: "assistant" as const,
        content: "ありがとうございました。ご意見を承りました。",
      },
    ],
    [
      {
        role: "assistant" as const,
        content: "この議案に賛成ですか？反対ですか？",
      },
      { role: "user" as const, content: "どちらでもないです" },
      {
        role: "assistant" as const,
        content: "その理由を教えてください。",
      },
      {
        role: "user" as const,
        content: "具体的な整備対象エリアの情報がもっと必要だと思います。",
      },
      {
        role: "assistant" as const,
        content: "ありがとうございました。ご意見を承りました。",
      },
    ],
    [
      {
        role: "assistant" as const,
        content: "この議案に賛成ですか？反対ですか？",
      },
      { role: "user" as const, content: "賛成です" },
      {
        role: "assistant" as const,
        content: "その理由を教えてください。",
      },
      {
        role: "user" as const,
        content: "良い議案だと思います。",
      },
      {
        role: "assistant" as const,
        content: "ありがとうございました。ご意見を承りました。",
      },
    ],
    [
      {
        role: "assistant" as const,
        content: "この議案に賛成ですか？反対ですか？",
      },
      {
        role: "user" as const,
        content: "うーん、ちょっと考えさせてください",
      },
    ],
  ];

  const messages: Omit<InterviewMessageInsert, "id" | "created_at">[] = [];

  sessionIds.forEach((sessionId, sessionIndex) => {
    const patternIndex = sessionIndex % 5;
    const conversation = conversations[patternIndex];
    conversation.forEach((msg) => {
      messages.push({
        interview_session_id: sessionId,
        role: msg.role,
        content: msg.content,
      });
    });
  });

  return messages;
}

// インタビューレポートを作成（パターン1,2,3のみ）
export function createInterviewReports(
  sessionIds: string[]
): Omit<InterviewReportInsert, "id" | "created_at" | "updated_at">[] {
  const reportTemplates = [
    {
      stance: "for" as const,
      summary: "この議案に賛成。市民生活の改善につながると考えている。",
      role: "general_citizen" as const,
      role_title: "一般市民",
      role_description: "議案の内容に賛同する市民",
      opinions: [{ title: "賛成理由", content: "生活環境の改善につながる" }],
    },
    {
      stance: "against" as const,
      summary:
        "事業ごとの優先順位や長期的な財政見通しを十分に検証した上で予算配分を行うべきだと考える。",
      role: "work_related" as const,
      role_title: "会社員",
      role_description: "財政面を重視する市民",
      opinions: [{ title: "反対理由", content: "優先順位の検証が不十分" }],
    },
    {
      stance: "neutral" as const,
      summary: "判断するにはより具体的な事業箇所の情報が必要と考えている。",
      role: "subject_expert" as const,
      role_title: "専門家",
      role_description: "慎重な判断を求める市民",
      opinions: [{ title: "態度保留理由", content: "具体情報の不足" }],
    },
  ];

  const reports: Omit<
    InterviewReportInsert,
    "id" | "created_at" | "updated_at"
  >[] = [];

  sessionIds.forEach((sessionId, index) => {
    const patternIndex = index % 5;
    if (patternIndex < 3) {
      const loopIndex = Math.floor(index / 5);
      reports.push({
        interview_session_id: sessionId,
        ...reportTemplates[patternIndex],
        is_public_by_user: loopIndex < 5,
        is_public_by_admin: loopIndex < 3,
      });
    }
  });

  return reports;
}

// デモ用の固定ID
export const DEMO_SESSION_ID = "00000000-0000-0000-0000-000000000001";
export const DEMO_REPORT_ID = "00000000-0000-0000-0000-000000000001";

export const DEMO_SESSION_ID_WORK = "00000000-0000-0000-0000-000000000002";
export const DEMO_SESSION_ID_DAILY = "00000000-0000-0000-0000-000000000003";
export const DEMO_SESSION_ID_CITIZEN = "00000000-0000-0000-0000-000000000004";
export const DEMO_REPORT_ID_WORK = "00000000-0000-0000-0000-000000000002";
export const DEMO_REPORT_ID_DAILY = "00000000-0000-0000-0000-000000000003";
export const DEMO_REPORT_ID_CITIZEN = "00000000-0000-0000-0000-000000000004";

// デモ用のインタビューセッション（公開、固定ID）
export function createDemoSession(
  interviewConfigId: string
): InterviewSessionInsert {
  const now = new Date();
  return {
    id: DEMO_SESSION_ID,
    interview_config_id: interviewConfigId,
    user_id: "00000000-0000-0000-0000-000000000000",
    started_at: new Date(now.getTime() - 3600000).toISOString(),
    completed_at: new Date(now.getTime() - 3000000).toISOString(),
  };
}

// デモ用のインタビューメッセージ
export function createDemoMessages(): Omit<
  InterviewMessageInsert,
  "id" | "created_at"
>[] {
  return [
    {
      interview_session_id: DEMO_SESSION_ID,
      role: "assistant",
      content:
        "こんにちは！本日はインタビューにご協力いただきありがとうございます。\n\n尼崎市議会で審議されている議案について、市民の皆さまのご意見をお聞かせください。この議案について、どのようにお考えですか？",
    },
    {
      interview_session_id: DEMO_SESSION_ID,
      role: "user",
      content: "生活道路や公園の整備、公共施設の保全計画を着実に進めて欲しい",
    },
    {
      interview_session_id: DEMO_SESSION_ID,
      role: "assistant",
      content:
        "なるほど。生活に身近なインフラ整備と将来に向けた公共施設の維持保全に関心をお持ちなのですね。\n\n具体的に、尼崎市内のどのような施設やエリアの改善を期待されていますか？",
    },
    {
      interview_session_id: DEMO_SESSION_ID,
      role: "user",
      content:
        "駅周辺の歩きやすさや、子どもが安全に通える生活道路の補修を優先してほしいです。",
    },
    {
      interview_session_id: DEMO_SESSION_ID,
      role: "assistant",
      content: "ありがとうございました。ご意見を承りました。",
    },
  ];
}

// デモ用のインタビューレポート（固定ID）
export function createDemoReport(): InterviewReportInsert {
  return {
    id: DEMO_REPORT_ID,
    interview_session_id: DEMO_SESSION_ID,
    stance: "neutral",
    summary:
      "生活道路や公園等の環境改善と公共施設整備保全基金への積立てには期待する一方、対象箇所の選定基準や今後の維持管理費の見通しについて丁寧な説明を求める。",
    role: "subject_expert",
    role_title: "建築・施設管理担当",
    role_description:
      "尼崎市在住の会社員\n公共インフラや生活道路の整備状況に関心がある",
    opinions: [
      {
        title: "身近な生活道路と駅周辺の整備を優先してほしい",
        content:
          "駅周辺の歩きやすさや、子どもが安全に通える生活道路の補修を優先してほしい。",
      },
    ],
    is_public_by_user: true,
    is_public_by_admin: true,
  };
}

// 追加のデモ用セッション（3種類のロール確認用）
export function createAdditionalDemoSessions(
  interviewConfigId: string
): InterviewSessionInsert[] {
  const now = new Date();
  return [
    {
      id: DEMO_SESSION_ID_WORK,
      interview_config_id: interviewConfigId,
      user_id: "00000000-0000-0000-0000-000000000010",
      started_at: new Date(now.getTime() - 7200000).toISOString(),
      completed_at: new Date(now.getTime() - 6600000).toISOString(),
    },
    {
      id: DEMO_SESSION_ID_DAILY,
      interview_config_id: interviewConfigId,
      user_id: "00000000-0000-0000-0000-000000000011",
      started_at: new Date(now.getTime() - 10800000).toISOString(),
      completed_at: new Date(now.getTime() - 10200000).toISOString(),
    },
    {
      id: DEMO_SESSION_ID_CITIZEN,
      interview_config_id: interviewConfigId,
      user_id: "00000000-0000-0000-0000-000000000012",
      started_at: new Date(now.getTime() - 14400000).toISOString(),
      completed_at: new Date(now.getTime() - 10200000).toISOString(),
    },
  ];
}

// 追加のデモ用メッセージ（3種類のロール確認用）
export function createAdditionalDemoMessages(): Omit<
  InterviewMessageInsert,
  "id" | "created_at"
>[] {
  return [
    {
      interview_session_id: DEMO_SESSION_ID_WORK,
      role: "assistant",
      content: "こんにちは！本日はインタビューにご協力いただきありがとうございます。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_WORK,
      role: "user",
      content: "駅前の環境改善は地域の商業活性化にもつながるため賛成です。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_WORK,
      role: "assistant",
      content: "地域でお仕事をされている立場からのご意見ですね。具体的にどのような点に期待されていますか？",
    },
    {
      interview_session_id: DEMO_SESSION_ID_WORK,
      role: "user",
      content: "駅前が明るく歩きやすくなれば、来街者が増えて地域のお店にも良い影響があると思います。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_WORK,
      role: "assistant",
      content: "ありがとうございました。ご意見を承りました。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_DAILY,
      role: "assistant",
      content: "こんにちは！本日はインタビューにご協力いただきありがとうございます。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_DAILY,
      role: "user",
      content: "子どもが遊ぶ公園や通学路が整備されるのは嬉しいです。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_DAILY,
      role: "assistant",
      content: "日々の暮らしに直結する点ですね。どのような場面で整備の必要性を感じますか？",
    },
    {
      interview_session_id: DEMO_SESSION_ID_DAILY,
      role: "user",
      content: "ベビーカーや自転車で通りにくい段差や傷んだ舗装が改善されると助かります。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_DAILY,
      role: "assistant",
      content: "ありがとうございました。ご意見を承りました。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      role: "assistant",
      content: "こんにちは！本日はインタビューにご協力いただきありがとうございます。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      role: "user",
      content: "将来の公共施設更新に向けた基金への積立ては重要だと思います。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      role: "assistant",
      content: "中長期的な財政運営の視点をお持ちですね。どのような点に注目されていますか？",
    },
    {
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      role: "user",
      content: "収益事業収入を将来の施設保全に計画的に備える一方で、使途の透明性も保ってほしいです。",
    },
    {
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      role: "assistant",
      content: "ありがとうございました。ご意見を承りました。",
    },
  ];
}

// 追加のデモ用レポート（3種類のロール確認用）
export function createAdditionalDemoReports(): InterviewReportInsert[] {
  return [
    {
      id: DEMO_REPORT_ID_WORK,
      interview_session_id: DEMO_SESSION_ID_WORK,
      stance: "for",
      summary: "駅前周辺の環境整備による地域商業の活性化に期待し賛成",
      role: "work_related",
      role_title: "市内事業者",
      role_description:
        "尼崎市内で事業を営む経営者\n駅周辺の回遊性やまちの印象に関心がある",
      opinions: [
        {
          title: "駅前イメージアップによる来街者増加に期待",
          content:
            "駅前が明るく歩きやすくなれば、来街者が増えて地域のお店にも良い影響がある。",
        },
      ],
      is_public_by_user: true,
      is_public_by_admin: true,
    },
    {
      id: DEMO_REPORT_ID_DAILY,
      interview_session_id: DEMO_SESSION_ID_DAILY,
      stance: "for",
      summary: "子育て中の保護者として生活道路・公園の環境改善を期待",
      role: "daily_life_affected",
      role_title: "保護者",
      role_description:
        "尼崎市在住の保護者\n日常的に生活道路や近隣の公園を利用している",
      opinions: [
        {
          title: "段差や傷んだ舗装の補修を進めてほしい",
          content:
            "ベビーカーや自転車で通りにくい段差や傷んだ舗装が改善されると助かる。",
        },
      ],
      is_public_by_user: true,
      is_public_by_admin: true,
    },
    {
      id: DEMO_REPORT_ID_CITIZEN,
      interview_session_id: DEMO_SESSION_ID_CITIZEN,
      stance: "neutral",
      summary: "公共施設保全基金への積立てを評価しつつ使途の透明性を注視",
      role: "general_citizen",
      role_title: "会社員",
      role_description:
        "尼崎市在住の会社員\n市の財政運営や公共施設の将来計画に関心がある",
      opinions: [
        {
          title: "将来の施設保全への備えと透明性の両立",
          content:
            "収益事業収入を将来の施設保全に計画的に備える一方で、使途の透明性も保ってほしい。",
        },
      ],
      is_public_by_user: true,
      is_public_by_admin: true,
    },
  ];
}
