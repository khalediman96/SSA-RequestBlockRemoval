import { PEOPLE } from "@/constants/people";
import type { ApplicantRecord, ApprovedRemovalRequest } from "@/types/workflow";

const DEFAULT_FILES = [
  { name: "Medical_Report.pdf", size: "500kb" },
  { name: "Salary_Certificate.pdf", size: "500kb" },
];

export function resolveApprovedRemovalRequest(
  applicant: ApplicantRecord,
): ApprovedRemovalRequest | undefined {
  if (applicant.approvedRequest) return applicant.approvedRequest;
  if (applicant.requestStatus !== "approved" && applicant.requestStatus !== "eligible") {
    return undefined;
  }

  const approvalDate =
    applicant.removeBlockRequests?.match(/(\d{2}\/\d{2}\/\d{4})/)?.[1] ?? "13/11/2026";
  const blockEnd =
    applicant.blockEnd !== "—" && applicant.blockEnd ? applicant.blockEnd : approvalDate;

  return {
    requestedBy: PEOPLE.sectionHead,
    submissionDate: "12/11/2026",
    workflowStepDate: "12 Nov 2026",
    reasonLabel: "Medical or humanitarian grounds.",
    comments:
      "The Applicant has some Medical issues and has provided the supporting document that proves his claim.",
    approvedBy: PEOPLE.director,
    approvalDate,
    bannerApprovedOn: approvalDate,
    blockPeriodDisplay: `${applicant.blockStart} - ${blockEnd}`,
    directorWorkflowSub: "Approved • 13 Nov 2026",
    files: DEFAULT_FILES,
    historyEvents: [
      {
        title: "Director Review",
        dateTime: "13 Nov 2026, 11:20 AM",
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: "Reason: Medical or humanitarian grounds.",
        statusTransition: {
          from: "Awaiting Reapplication",
          to: "Eligible to Reapply",
        },
        dotVariant: "green",
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