import { PEOPLE } from "@/constants/people";
import type { ApplicantRecord, SubmittedRemovalRequest } from "@/types/workflow";

export function resolveSubmittedRemovalRequest(
  applicant: ApplicantRecord,
  workflow?: { requestedReasonLabel: string; sectionHeadJustification: string },
): SubmittedRemovalRequest | undefined {
  if (applicant.submittedRequest) return applicant.submittedRequest;
  if (applicant.requestStatus !== "pending" && applicant.action !== "submitted") return undefined;
  if (!workflow) return undefined;

  const today = "12 Nov 2026";
  return {
    requestedBy: PEOPLE.sectionHead,
    submissionDate: "12/11/2026",
    workflowStepDate: today,
    reasonLabel: workflow.requestedReasonLabel.endsWith(".")
      ? workflow.requestedReasonLabel
      : `${workflow.requestedReasonLabel}.`,
    comments: workflow.sectionHeadJustification,
    historyEvents: [
      {
        title: "Request submitted",
        dateTime: "12 Nov 2026, 11:20 AM",
        actor: PEOPLE.sectionHead,
        actorRole: "Regular Application Section Head",
        reasonLine: `Reason: ${
          workflow.requestedReasonLabel.endsWith(".")
            ? workflow.requestedReasonLabel
            : `${workflow.requestedReasonLabel}.`
        }`,
        comment: workflow.sectionHeadJustification.replace(/^\[|\]$/g, "").trim(),
      },
    ],
    files: [],
  };
}