import { PEOPLE } from "@/constants/people";
import type { ApplicantRecord, RejectedRemovalRequest } from "@/types/workflow";

const DEFAULT_FILES = [
  { name: "Medical_Report.pdf", size: "500kb" },
  { name: "Salary_Certificate.pdf", size: "500kb" },
];

const DEFAULT_REJECTION_QUOTE =
  "The submitted justification does not demonstrate a material change in the applicant's circumstances since the original reapplication block was applied. The block remains active until the scheduled end date.";

export function resolveRejectedRemovalRequest(
  applicant: ApplicantRecord,
  workflowQuote?: string,
): RejectedRemovalRequest | undefined {
  if (applicant.rejectedRequest) return applicant.rejectedRequest;
  if (applicant.requestStatus !== "rejected") return undefined;

  const rejectionDate = applicant.lastRequestNote?.match(/(\d{2}\/\d{2}\/\d{4})/)?.[1] ?? "13/11/2026";
  const blockEnd =
    applicant.blockEnd !== "—" && applicant.blockEnd ? applicant.blockEnd : rejectionDate;
  const workflowText = workflowQuote?.trim();
  const quote =
    workflowText && !workflowText.toLowerCase().includes("remains under awaiting")
      ? workflowText
      : DEFAULT_REJECTION_QUOTE;

  return {
    requestedBy: PEOPLE.sectionHead,
    submissionDate: "12/11/2026",
    workflowStepDate: "12 Nov 2026",
    reasonLabel: "Medical or humanitarian grounds.",
    comments:
      "The Applicant has some Medical issues and has provided the supporting document that proves his claim.",
    rejectedBy: PEOPLE.director,
    rejectionDate,
    bannerRejectionText: quote,
    directorWorkflowSub: `${PEOPLE.director} • ${rejectionDate}`,
    blockPeriodDisplay: `Blocked Until ${blockEnd}`,
    directorRejectionQuote: quote,
    files: DEFAULT_FILES,
    historyEvents: [
      {
        title: "Request rejected",
        dateTime: "13 Nov 2026, 11:20 AM",
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: "Reason: Medical or humanitarian grounds.",
        comment: quote,
        dotVariant: "red",
      },
      {
        title: "Request submitted",
        dateTime: "12 Nov 2026, 11:20 AM",
        actor: PEOPLE.sectionHead,
        actorRole: "Regular Application Section Head",
        reasonLine: "Reason: Medical or humanitarian grounds.",
        comment: "Applicant submitted medical report history and supporting salary certificate",
        dotVariant: "gold",
      },
    ],
  };
}