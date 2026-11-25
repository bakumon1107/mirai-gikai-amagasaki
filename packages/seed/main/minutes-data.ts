/**
 * 議事録ベースのアーカイブ（一般質問・委員会議事録・首長の記者会見）の開発用シードデータ（尼崎市版）
 *
 * 尼崎市議会の質問通告テーマ・常任委員会構成および市長定例記者会見の公開情報をもとに構成した
 * 開発・レイアウト検証用データです。発言録本文は会議録検索システムから取り込む前のサンプルです。
 */

import type { Database } from "@mirai-gikai/supabase";

type GeneralQuestionInsert =
  Database["public"]["Tables"]["general_questions"]["Insert"];
type CommitteeMeetingInsert =
  Database["public"]["Tables"]["committee_meetings"]["Insert"];
type CommitteeMeetingTopicInsert =
  Database["public"]["Tables"]["committee_meeting_topics"]["Insert"];
type PressConferenceInsert =
  Database["public"]["Tables"]["press_conferences"]["Insert"];
type PressConferenceItemInsert =
  Database["public"]["Tables"]["press_conference_items"]["Insert"];
type PressConferenceTurnInsert =
  Database["public"]["Tables"]["press_conference_turns"]["Insert"];

type SpeakerType = "chairperson" | "member" | "executive" | "unknown";

type Speech = {
  voiceNo: number;
  speakerLabel: string | null;
  speakerType: SpeakerType;
  text: string;
};

const AMAGASAKI_MINUTES_URL =
  "https://ssp.kaigiroku.net/tenant/amagasaki/pg/index.html";

// ============================================================
// 一般質問・代表質問
// ============================================================

/**
 * @param sessionIds data.ts の councilSessions の順（[0]=令和8年9月第8回, [1]=令和8年6月第6回）で挿入した ID
 */
export function createGeneralQuestions(
  sessionIds: string[]
): GeneralQuestionInsert[] {
  const [current, previous] = sessionIds;
  if (!current || !previous) {
    throw new Error("council sessions が2件必要です");
  }

  return [
    {
      council_session_id: current,
      question_type: "representative",
      questioner_name: "市議会議員A（開発用サンプル）",
      questioner_party: "公明党",
      questioner_number: 1,
      session_day: 1,
      question_order: 1,
      summary:
        "市長公約の進捗と財政環境、学校体育館の空調整備を含む防災・減災対策の強化について質した。",
      topics: [
        {
          title: "学校体育館のエアコン整備、いつまでに進む？",
          question_summary:
            "避難所となる学校体育館の空調整備スケジュールと、未整備校での暑さ対策を質した。",
          answer_summary:
            "教育委員会は、避難所機能も踏まえて計画的に整備を進め、未整備校ではスポットクーラー等で代替措置を講じると答弁した。",
          answerer_role: "教育長",
          answerer_name: "",
        },
        {
          title: "本市の財政環境とまちづくりの方向性は？",
          question_summary:
            "物価高や公共施設の老朽化が進む中での財政運営とまちづくりの優先順位を質した。",
          answer_summary:
            "市長は、健全な財政規律を保ちつつ、子育て・防災・生活空間の環境改善に重点配分すると答弁した。",
          answerer_role: "市長",
          answerer_name: "松本 眞",
        },
      ],
      raw_text:
        "○市議会議員A　防災・減災対策の強化と学校体育館の空調整備について伺います。（開発用サンプル）",
      answer_raw_text:
        "○松本眞市長　ご質問にお答えいたします。防災力の強化と健全な財政運営の両立に取り組んでまいります。（開発用サンプル）",
      source_url: AMAGASAKI_MINUTES_URL,
      publish_status: "published",
    },
    {
      council_session_id: current,
      question_type: "general",
      questioner_name: "市議会議員B（開発用サンプル）",
      questioner_party: "蒼風会",
      questioner_number: 2,
      session_day: 2,
      question_order: 1,
      summary:
        "聴覚障害者への支援拡充と、手話通訳者の育成・手話リンクサービスの導入について質した。",
      topics: [
        {
          title: "手話通訳者の育成や手話リンクサービスの導入は？",
          question_summary:
            "聴覚障害者が市役所手続きを円滑に行えるよう、手話通訳者の育成支援や遠隔手話サービスの導入状況を質した。",
          answer_summary:
            "健康福祉局は、手話奉仕員養成講座の充実を図るとともに、窓口での遠隔手話通訳の活用拡大を検討すると答弁した。",
          answerer_role: "健康福祉局長",
          answerer_name: "",
        },
      ],
      raw_text:
        "○市議会議員B　聴覚障害者への支援拡充と手話通訳者の育成について伺います。（開発用サンプル）",
      answer_raw_text:
        "○健康福祉局長　お答えいたします。関係団体と連携しながら支援体制の充実に努めます。（開発用サンプル）",
      source_url: AMAGASAKI_MINUTES_URL,
      publish_status: "published",
    },
    {
      council_session_id: current,
      question_type: "general",
      questioner_name: "市議会議員C（開発用サンプル）",
      questioner_party: "日本維新の会",
      questioner_number: 3,
      session_day: 2,
      question_order: 2,
      summary: "在宅・車中泊避難者への支援体制と避難所環境の格差解消について質した。",
      topics: [
        {
          title: "避難所の環境整備（TKB48）と在宅避難者支援は？",
          question_summary:
            "災害時のトイレ・キッチン・ベッド整備と、在宅避難者への物資・情報提供体制を質した。",
          answer_summary:
            "危機管理安全局は、災害対応車両の活用や地域防災組織との連携により避難所と在宅双方の支援を強化すると答弁した。",
          answerer_role: "危機管理安全局長",
          answerer_name: "",
        },
      ],
      raw_text:
        "○市議会議員C　避難所の環境整備と在宅避難者支援について伺います。（開発用サンプル）",
      answer_raw_text:
        "○危機管理安全局長　お答えいたします。災害関連死を防ぐための体制整備を進めます。（開発用サンプル）",
      source_url: AMAGASAKI_MINUTES_URL,
      publish_status: "published",
    },
    {
      council_session_id: previous,
      question_type: "general",
      questioner_name: "市議会議員D（開発用サンプル）",
      questioner_party: "市民グリーンクラブ",
      questioner_number: 4,
      session_day: 1,
      question_order: 1,
      summary:
        "大井戸公園への新図書館整備と周辺地域の利便性・景観への配慮について質した。",
      topics: [
        {
          title: "大井戸公園の新図書館整備、地域の声はどう反映する？",
          question_summary:
            "北図書館の移転再編にあたり、公園利用や周辺道路の安全性について地域住民の意見をどう反映するかを質した。",
          answer_summary:
            "資産統括局は、地域説明会やワークショップの意見を踏まえ、公園と一体となった利用しやすい整備を進めると答弁した。",
          answerer_role: "資産統括局長",
          answerer_name: "",
        },
      ],
      raw_text:
        "○市議会議員D　大井戸公園内での新図書館整備について伺います。（開発用サンプル）",
      answer_raw_text:
        "○資産統括局長　お答えいたします。地域の皆さまの声を丁寧に伺いながら進めてまいります。（開発用サンプル）",
      source_url: AMAGASAKI_MINUTES_URL,
      publish_status: "published",
    },
    {
      // 下書き（公開されないことの確認用）
      council_session_id: current,
      question_type: "general",
      questioner_name: "市議会議員E（開発用サンプル）",
      questioner_party: "青雲の会",
      questioner_number: 5,
      session_day: 3,
      question_order: 1,
      summary: null,
      topics: [],
      raw_text: "○市議会議員E　（要約前の下書きサンプル）……",
      source_url: AMAGASAKI_MINUTES_URL,
      publish_status: "draft",
    },
  ];
}

// ============================================================
// 委員会議事録
// ============================================================

function buildSpeeches(
  chair: string,
  pairs: { member: string; question: string; executive: string; answer: string }[]
): Speech[] {
  const speeches: Speech[] = [
    {
      voiceNo: 1,
      speakerLabel: `${chair}委員長`,
      speakerType: "chairperson",
      text: "ただいまから委員会を開会いたします。本日は付託議案および所管事務について審査・質疑を行います。",
    },
  ];
  for (const pair of pairs) {
    speeches.push({
      voiceNo: speeches.length + 1,
      speakerLabel: `${pair.member}委員`,
      speakerType: "member",
      text: pair.question,
    });
    speeches.push({
      voiceNo: speeches.length + 1,
      speakerLabel: pair.executive,
      speakerType: "executive",
      text: pair.answer,
    });
  }
  speeches.push({
    voiceNo: speeches.length + 1,
    speakerLabel: `${chair}委員長`,
    speakerType: "chairperson",
    text: "以上で本日の委員会を閉会いたします。",
  });
  return speeches;
}

const bunkyoSpeeches = buildSpeeches("文教委員会", [
  {
    member: "A",
    question:
      "園田南小学校の校舎増築工事について、工事期間中の児童の安全確保はどう進めますか。",
    executive: "教育委員会事務局",
    answer:
      "仮囲いの徹底や工事車両の動線分離を行い、登下校時間帯の搬入制限と誘導員配置で安全を確保します。",
  },
  {
    member: "B",
    question:
      "増築後の普通教室数と給食提供数の見通しは十分でしょうか。",
    executive: "教育委員会事務局",
    answer:
      "今後の児童数推計に基づき必要な教室数と給食対応能力を確保できる規模で計画しています。",
  },
  {
    member: "C",
    question:
      "大庄健康ふれあい体育館の新築工事とあわせた地域利用の考え方をお聞かせください。",
    executive: "教育委員会事務局",
    answer:
      "学校利用と地域のスポーツ・健康づくり利用の双方に配慮し、運用ルールを整備してまいります。",
  },
  {
    member: "A",
    question:
      "学校体育館の空調整備について、今後の進捗見通しを教えてください。",
    executive: "教育委員会事務局",
    answer:
      "避難所指定や施設条件を踏まえて順次工事を進め、早期の環境改善を図ります。",
  },
]);

const kensetsuSpeeches = buildSpeeches("建設消防防災委員会", [
  {
    member: "D",
    question:
      "市営住宅の建替事業に伴い供用終了した住宅の跡地活用はどう検討していますか。",
    executive: "都市整備局",
    answer:
      "地域のまちづくりや防災面の課題も踏まえ、関係部局と連携して利活用方針を検討しています。",
  },
  {
    member: "E",
    question:
      "消防団員の公務災害補償の改定に加え、団員確保の取り組み状況を教えてください。",
    executive: "消防局",
    answer:
      "処遇面の充実とあわせて、地域や事業所への広報活動を通じて幅広い世代への入団促進に取り組んでいます。",
  },
  {
    member: "D",
    question:
      "生活道路や公園の環境改善予算は、どのような基準で優先順位を決めますか。",
    executive: "都市整備局",
    answer:
      "老朽化の度合いや通学路の安全性、地域からの要望状況を踏まえて優先的に整備します。",
  },
]);

// 発言が少ない回（トップの委員会カードの選定から外れることの確認用）
const keizaiSpeeches = buildSpeeches("経済環境企業委員会", [
  {
    member: "F",
    question: "水道・工業用水道事業の報告について質疑はございませんか。",
    executive: "公営企業局",
    answer: "（質疑なし）",
  },
]);

export const committeeMeetings: CommitteeMeetingInsert[] = [
  {
    committee_name: "文教委員会",
    committee_slug: "bunkyo",
    meeting_date: "2026-09-16",
    title: "令和8年9月16日 文教委員会",
    source_id: "amagasaki-bunkyo-20260916",
    source_url: AMAGASAKI_MINUTES_URL,
    summary:
      "園田南小学校校舎増築等工事および大庄健康ふれあい体育館新築工事の請負契約、学校体育館の空調整備について審査・質疑が行われた。",
    speeches: bunkyoSpeeches,
    raw_text: bunkyoSpeeches
      .map((s) => `○${s.speakerLabel}　${s.text}`)
      .join("\n"),
    publish_status: "published",
  },
  {
    committee_name: "建設消防防災委員会",
    committee_slug: "kensetsu-shobo-bosai",
    meeting_date: "2026-09-17",
    title: "令和8年9月17日 建設消防防災委員会",
    source_id: "amagasaki-kensetsu-20260917",
    source_url: AMAGASAKI_MINUTES_URL,
    summary:
      "市営住宅・改良住宅条例の一部改正、消防団員等公務災害補償条例の一部改正、生活道路・公園整備の進め方について審査・質疑が行われた。",
    speeches: kensetsuSpeeches,
    raw_text: kensetsuSpeeches
      .map((s) => `○${s.speakerLabel}　${s.text}`)
      .join("\n"),
    publish_status: "published",
  },
  {
    committee_name: "経済環境企業委員会",
    committee_slug: "keizai-kankyo-kigyo",
    meeting_date: "2026-09-18",
    title: "令和8年9月18日 経済環境企業委員会",
    source_id: "amagasaki-keizai-20260918",
    source_url: AMAGASAKI_MINUTES_URL,
    summary: "水道・工業用水道事業に関する所管報告があった。",
    speeches: keizaiSpeeches,
    raw_text: keizaiSpeeches
      .map((s) => `○${s.speakerLabel}　${s.text}`)
      .join("\n"),
    publish_status: "published",
  },
];

/**
 * 委員会の committee_id を名前で埋める（data.ts の committees を挿入した結果を渡す）
 */
export function withCommitteeIds(
  meetings: CommitteeMeetingInsert[],
  insertedCommittees: { id: string; name: string }[]
): CommitteeMeetingInsert[] {
  const idByName = new Map(insertedCommittees.map((c) => [c.name, c.id]));
  return meetings.map((m) => ({
    ...m,
    committee_id: idByName.get(m.committee_name) ?? null,
  }));
}

/**
 * @param meetingIds committeeMeetings の順で挿入した ID
 */
export function createCommitteeMeetingTopics(
  meetingIds: string[]
): CommitteeMeetingTopicInsert[] {
  const [bunkyo, kensetsu, keizai] = meetingIds;
  if (!bunkyo || !kensetsu || !keizai) {
    throw new Error("committee meetings が3件必要です");
  }

  return [
    {
      meeting_id: bunkyo,
      topic_order: 1,
      title: "園田南小学校の増築工事、安全対策と教室確保は？",
      summary:
        "児童数増加に対応する増築工事について、工事中の安全対策と将来の教室・給食能力の見通しが確認された。",
      discussion_summary:
        "委員は登下校時の安全対策や教室数を質し、事務局は動線分離と推計に基づく規模確保を説明した。",
      speakers: [{ label: "A委員" }, { label: "B委員" }],
      start_voice_no: 2,
      end_voice_no: 5,
    },
    {
      meeting_id: bunkyo,
      topic_order: 2,
      title: "大庄健康ふれあい体育館の地域利用と学校空調は？",
      summary:
        "新築体育館の地域利用ルールや、学校体育館への空調整備の進め方が議論された。",
      discussion_summary:
        "委員は地域利用との両立や空調整備の進捗を質し、事務局は計画的な運用整備と順次施工を説明した。",
      speakers: [{ label: "C委員" }, { label: "A委員" }],
      start_voice_no: 6,
      end_voice_no: 9,
    },
    {
      meeting_id: kensetsu,
      topic_order: 1,
      title: "供用終了した市営住宅の跡地と生活道路整備は？",
      summary:
        "建替事業で供用終了した住宅跡地の検討状況と、生活道路・公園整備の優先基準が確認された。",
      discussion_summary:
        "委員は跡地活用と整備基準を質し、局は通学路の安全性や老朽化度合いを踏まえて進めると説明した。",
      speakers: [{ label: "D委員" }],
      start_voice_no: 2,
      end_voice_no: 7,
    },
    {
      meeting_id: kensetsu,
      topic_order: 2,
      title: "消防団員の処遇改善と担い手確保は？",
      summary:
        "公務災害補償条例の改正にあわせ、消防団員の確保策について質疑が行われた。",
      discussion_summary:
        "委員は団員確保の取り組みを質し、消防局は処遇充実と地域・事業所向け広報を説明した。",
      speakers: [{ label: "E委員" }],
      start_voice_no: 4,
      end_voice_no: 5,
    },
    {
      meeting_id: keizai,
      topic_order: 1,
      title: "水道・工業用水道事業の所管報告",
      summary: "水道・工業用水道事業の決算・運営状況について報告があった。",
      discussion_summary: null,
      speakers: [],
      start_voice_no: 1,
      end_voice_no: 4,
    },
  ];
}

// ============================================================
// 首長の記者会見（尼崎市公式 市長定例記者会見ページ準拠）
// ============================================================

export const pressConferences: PressConferenceInsert[] = [
  {
    slug: "2026-11-20",
    title: "令和8年11月 市長定例記者会見",
    held_at: "2026-11-20",
    youtube_url: null,
    status: "published",
  },
  {
    slug: "2026-10-20",
    title: "令和8年10月 市長定例記者会見",
    held_at: "2026-10-20",
    youtube_url: "https://youtu.be/PcMEndTJ70M",
    status: "published",
  },
];

type ItemSeed = Omit<PressConferenceItemInsert, "press_conference_id"> & {
  turns: Omit<PressConferenceTurnInsert, "press_conference_item_id">[];
};

/**
 * pressConferences の順で挿入した ID ごとの発表・質疑
 */
export function createPressConferenceItems(
  conferenceIds: string[]
): { pressConferenceId: string; items: ItemSeed[] }[] {
  const [latest, earlier] = conferenceIds;
  if (!latest || !earlier) {
    throw new Error("press conferences が2件必要です");
  }

  return [
    {
      pressConferenceId: latest,
      items: [
        {
          item_type: "announcement",
          order_index: 1,
          title: "駅で出会う、採れたての「あまやさい」～冷蔵機能付きあまやさい販売機を設置します！～",
          summary:
            "市内産農産物「あまやさい」をより身近に購入できるよう、駅周辺に冷蔵機能付きの販売機を設置する。",
          detail: null,
          material_url:
            "https://www.city.amagasaki.hyogo.jp/shisei/1001823/1002089/1002091/index.html",
          turns: [
            {
              speaker: "executive",
              speaker_name: "松本市長",
              content:
                "採れたての市内産農産物「あまやさい」を日常的に手に取っていただけるよう、冷蔵機能付き販売機を設置します。",
              order_index: 1,
            },
          ],
        },
        {
          item_type: "announcement",
          order_index: 2,
          title: "シニア就職面接会を開催します ～就職から生きがいづくりまで応援～",
          summary:
            "高齢者の多様な社会参加や就労機会の拡大に向け、シニア就職面接会を開催する。",
          detail: null,
          material_url:
            "https://www.city.amagasaki.hyogo.jp/shisei/1001823/1002089/1002091/index.html",
          turns: [
            {
              speaker: "executive",
              speaker_name: "松本市長",
              content:
                "就労から地域の生きがいづくりまで、高齢者の多様な社会参加を応援するシニア就職面接会を開催します。",
              order_index: 1,
            },
          ],
        },
        {
          item_type: "announcement",
          order_index: 3,
          title: "「阪神タイガース2026年優勝報告会」の実施について",
          summary:
            "尼崎市にゆかりのある阪神タイガースの2026年優勝報告会の実施概要を発表。",
          detail: null,
          material_url:
            "https://www.city.amagasaki.hyogo.jp/shisei/1001823/1002089/1002091/index.html",
          turns: [
            {
              speaker: "executive",
              speaker_name: "松本市長",
              content:
                "市民の皆さまとともに喜びを分かち合う「阪神タイガース2026年優勝報告会」を実施します。",
              order_index: 1,
            },
          ],
        },
      ],
    },
    {
      pressConferenceId: earlier,
      items: [
        {
          item_type: "announcement",
          order_index: 1,
          title: "防災服のリニューアル等の実施について",
          summary:
            "災害対応時の視認性・機能性を高めるため、市の防災服をリニューアルする。",
          detail: null,
          material_url:
            "https://www.city.amagasaki.hyogo.jp/shisei/1001823/1002089/1002091/index.html",
          turns: [
            {
              speaker: "executive",
              speaker_name: "松本市長",
              content:
                "災害現場での活動性や視認性を高めるため、尼崎市の防災服をリニューアルします。",
              order_index: 1,
            },
          ],
        },
        {
          item_type: "announcement",
          order_index: 2,
          title:
            "第11回尼崎市まちかどチャーミング賞の決定について「市制110周年記念事業」",
          summary:
            "市制110周年記念事業として、地域の魅力を高める建築物や活動を表彰する第11回まちかどチャーミング賞を決定。",
          detail: null,
          material_url:
            "https://www.city.amagasaki.hyogo.jp/shisei/1001823/1002089/1002091/index.html",
          turns: [
            {
              speaker: "executive",
              speaker_name: "松本市長",
              content:
                "市制110周年記念事業として実施した第11回尼崎市まちかどチャーミング賞の受賞対象を決定しました。",
              order_index: 1,
            },
          ],
        },
      ],
    },
  ];
}
