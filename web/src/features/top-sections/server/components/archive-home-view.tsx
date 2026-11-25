import { PastSessionsSection } from "@/components/top/past-sessions-section";
import { siteConfig } from "@/config/site.config";
import type { BillStatusSummary } from "@/features/bills/shared/utils/summarize-bill-statuses";
import type { CommitteeMeetingSummary } from "@/features/committee-minutes/shared/types";
import type { CouncilSession } from "@/features/council-sessions/shared/types";
import type { SessionSlot } from "@/features/council-sessions/shared/utils/resolve-session-slot-status";
import type { GeneralQuestion } from "@/features/general-questions/shared/types";
import { PressConferenceArchiveSection } from "@/features/press-conferences/client/components/press-conference-archive-section";
import type {
  PressConferenceListItem,
  PressConferenceRef,
  PressConferenceSummary,
} from "@/features/press-conferences/shared/types";
import { TopHero } from "@/features/top-hero/server/components/top-hero";
import type { InSessionCounts } from "@/features/top-hero/server/loaders/load-top-hero-data";
import { BillSummaryCard } from "./bill-summary-card";
import { CommitteeSection } from "./committee-section";
import { QuestionsSection } from "./questions-section";
import { SessionBand } from "./session-band";
import { ThemeSection } from "./theme-section";

export type ArchiveHomeFeatures = {
  bills: boolean;
  generalQuestions: boolean;
  committeeMinutes: boolean;
  pressConferences: boolean;
  search: boolean;
};

export type ArchiveHomeViewProps = {
  currentSession: CouncilSession | null;
  nextSession: CouncilSession | null;
  latestConference: PressConferenceSummary | null;
  recentConferences: PressConferenceRef[];
  inSessionCounts: InSessionCounts | null;
  today: string;
  sessionSlots: SessionSlot[];
  committeeMeetings: CommitteeMeetingSummary[];
  questions: GeneralQuestion[];
  questionSessionName: string | null;
  billSummary: BillStatusSummary;
  billsSessionSlug: string | null;
  isBillSessionInSession: boolean;
  pastSessions: CouncilSession[];
  pressConferences: PressConferenceListItem[];
  cityName?: string;
  councilName?: string;
  executiveTitle?: string;
  governmentTerm?: string;
  features?: ArchiveHomeFeatures;
};

/**
 * 議事録・活動中心トップ（homeLayout: "archive"）の本体ビュー。
 * 本番のトップページと /dev/top-preview の双方から同じコンポーネントを描画する。
 */
export function ArchiveHomeView({
  currentSession,
  nextSession,
  latestConference,
  recentConferences,
  inSessionCounts,
  today,
  sessionSlots,
  committeeMeetings,
  questions,
  questionSessionName,
  billSummary,
  billsSessionSlug,
  isBillSessionInSession,
  pastSessions,
  pressConferences,
  cityName = siteConfig.cityName,
  councilName = siteConfig.councilName,
  executiveTitle = siteConfig.executiveTitle,
  governmentTerm = siteConfig.governmentTerm,
  features = siteConfig.features,
}: ArchiveHomeViewProps) {
  return (
    <>
      <TopHero
        currentSession={currentSession}
        nextSession={nextSession}
        latestConference={features.pressConferences ? latestConference : null}
        recentConferences={features.pressConferences ? recentConferences : []}
        fallbackCommittees={features.committeeMinutes ? committeeMeetings : []}
        fallbackQuestions={features.generalQuestions ? questions : []}
        fallbackQuestionSessionName={questionSessionName}
        inSessionCounts={inSessionCounts}
        today={today}
        cityName={cityName}
        councilName={councilName}
        executiveTitle={executiveTitle}
        features={features}
      />

      <SessionBand
        slots={sessionSlots}
        showBills={features.bills}
        showGeneralQuestions={features.generalQuestions}
      />

      {features.committeeMinutes && (
        <CommitteeSection
          meetings={committeeMeetings}
          isInSession={currentSession !== null}
        />
      )}

      {features.generalQuestions && (
        <QuestionsSection
          questions={questions}
          sessionName={questionSessionName}
        />
      )}

      {features.search && <ThemeSection governmentTerm={governmentTerm} />}

      {features.bills && (
        <BillSummaryCard
          billSummary={billSummary}
          billsSessionSlug={billsSessionSlug}
          isInSession={isBillSessionInSession}
        />
      )}

      {(features.bills || features.generalQuestions) && (
        <div className="mt-10 bg-mirai-surface-muted py-10 pc:mt-12">
          <div className="mx-4 pc:mx-16">
            <PastSessionsSection
              sessions={pastSessions}
              showBills={features.bills}
              showGeneralQuestions={features.generalQuestions}
            />
          </div>
        </div>
      )}

      {features.pressConferences && pressConferences.length > 0 && (
        <div className="bg-white py-10">
          <div className="mx-4 pc:mx-16">
            <PressConferenceArchiveSection
              pressConferences={pressConferences}
              executiveTitle={executiveTitle}
            />
          </div>
        </div>
      )}
    </>
  );
}
