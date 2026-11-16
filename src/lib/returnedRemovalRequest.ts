import { PEOPLE } from "@/constants/people";
import type { ApplicantRecord, ReturnedRemovalRequest } from "@/types/workflow";

const DEFAULT_FILES = [
  { name: "Salary_Certificate.pdf", size: "480kb" },
  { name: "Bank_Statement_Q3.pdf", size: "512kb" },
];

export function resolveReturnedRemovalRequest(
  applicant: ApplicantRecord,
  workflowQuote?: string,
): ReturnedRemovalRequest | undefined {
  if (applicant.returnedRequest) return applicant.returnedRequest;
  if (applicant.requestStatus !== "returned" && applicant.action !== "resubmit") {
    return undefined;
  }

  const returnedOn = "12/11/2026";
  const blockEnd =
    applicant.blockEnd !== "—" && applicant.blockEnd ? applicant.blockEnd : "01/02/2026";
  const quote =
    workflowQuote?.trim() ||
    "Please attach official proof of the change in income (updated salary certificate or termination letter).";

  return {
    requestedBy: PEOPLE.sectionHead,
    submissionDate: "10/11/2026",
    workflowStepDate: "10 Nov 2026",
    reasonLabel: "Change in financial circumstances.",
    comments: "Applicant submitted salary certificate and bank statement for Q3.",
    returnedOn,
    bannerReturnedOn: returnedOn,
    directorWorkflowSub: `${PEOPLE.director} • ${returnedOn}`,
    blockPeriodDisplay: `${applicant.blockStart} - ${blockEnd}`,
    directorFeedbackQuote: quote,
    files: DEFAULT_FILES,
    historyEvents: [
      {
        title: "Sent back for more information",
        dateTime: "13 Nov 2026, 11:20 AM",
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: "Reason: Change in financial circumstances.",
        comment: quote,
        dotVariant: "green",
      },
      {
        title: "Request submitted",
        dateTime: "12 Nov 2026, 11:20 AM",
        actor: PEOPLE.sectionHead,
        actorRole: "Regular Application Section Head",
        reasonLine: "Reason: Change in financial circumstances.",
        comment: "Applicant submitted salary certificate and bank statement for Q3.",
        dotVariant: "gold",
      },
    ],
  };
}