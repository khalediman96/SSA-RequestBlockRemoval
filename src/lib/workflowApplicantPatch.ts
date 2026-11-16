import { PEOPLE } from "@/constants/people";
import type {
  ApplicantRecord,
  ApprovedRemovalRequest,
  RejectedRemovalRequest,
  ReturnedRemovalRequest,
} from "@/types/workflow";
import { formatDateTimeNow, formatTodayDisplay, formatTodayWorkflow } from "@/lib/simulateApplicant";

const DEFAULT_REJECTION_TEXT =
  "The submitted justification does not demonstrate a material change in the applicant's circumstances since the original reapplication block was applied. The block remains active until the scheduled end date.";

function blockPeriodFor(applicant: ApplicantRecord, endOverride?: string): string {
  const end = endOverride ?? (applicant.blockEnd !== "—" ? applicant.blockEnd : formatTodayDisplay());
  return `${applicant.blockStart} - ${end}`;
}

export function patchApplicantApproved(
  applicant: ApplicantRecord,
  comments: string,
): Partial<ApplicantRecord> {
  const approvalDate = formatTodayDisplay();
  const directorComment = comments.trim();
  const submitted = applicant.submittedRequest;
  const approvedRequest: ApprovedRemovalRequest = {
    ...(submitted ?? {
      requestedBy: PEOPLE.sectionHead,
      submissionDate: approvalDate,
      workflowStepDate: formatTodayWorkflow(),
      reasonLabel: "Medical or humanitarian grounds.",
      comments: "",
      historyEvents: [],
      files: [],
    }),
    approvedBy: PEOPLE.director,
    approvalDate,
    bannerApprovedOn: approvalDate,
    blockPeriodDisplay: blockPeriodFor(applicant, approvalDate),
    directorWorkflowSub: `Approved • ${formatTodayWorkflow()}`,
    directorDecisionComment: directorComment || undefined,
    historyEvents: [
      {
        title: "Director Review",
        dateTime: formatDateTimeNow(),
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: submitted?.reasonLabel ? `Reason: ${submitted.reasonLabel}` : undefined,
        comment: directorComment || undefined,
        statusTransition: {
          from: "Awaiting Reapplication",
          to: "Eligible to Reapply",
        },
        dotVariant: "green",
      },
      ...(submitted?.historyEvents ?? []),
    ],
  };

  return {
    requestStatus: "eligible",
    action: "submitted",
    blockEnd: "—",
    blockReason: "Remove block approved — new application",
    approvedRequest,
    rejectedRequest: undefined,
    returnedRequest: undefined,
    lastRequestNote: `Approved · ${approvalDate}`,
  };
}

export function patchApplicantRejected(
  applicant: ApplicantRecord,
  comments: string,
): Partial<ApplicantRecord> {
  const rejectionDate = formatTodayDisplay();
  const quote = comments.trim() || DEFAULT_REJECTION_TEXT;
  const submitted = applicant.submittedRequest;

  const rejectedRequest: RejectedRemovalRequest = {
    ...(submitted ?? {
      requestedBy: PEOPLE.sectionHead,
      submissionDate: rejectionDate,
      workflowStepDate: formatTodayWorkflow(),
      reasonLabel: "Change in financial circumstances.",
      comments: "",
      historyEvents: [],
      files: [],
    }),
    rejectedBy: PEOPLE.director,
    rejectionDate,
    bannerRejectionText: quote,
    directorWorkflowSub: `${PEOPLE.director} • ${rejectionDate}`,
    blockPeriodDisplay: `Blocked Until ${applicant.blockEnd !== "—" ? applicant.blockEnd : rejectionDate}`,
    directorRejectionQuote: quote,
    historyEvents: [
      {
        title: "Request rejected",
        dateTime: formatDateTimeNow(),
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: submitted?.reasonLabel ? `Reason: ${submitted.reasonLabel}` : undefined,
        comment: quote,
        dotVariant: "red",
      },
      ...(submitted?.historyEvents ?? []),
    ],
  };

  return {
    requestStatus: "rejected",
    action: "request-after-reject",
    rejectedRequest,
    approvedRequest: undefined,
    lastRequestNote: `Rejected · ${rejectionDate}`,
  };
}

export function patchApplicantReturned(
  applicant: ApplicantRecord,
  comments: string,
): Partial<ApplicantRecord> {
  const returnedOn = formatTodayDisplay();
  const quote = comments.trim() || "Please attach official proof of the change in income.";
  const submitted = applicant.submittedRequest;

  const returnedRequest: ReturnedRemovalRequest = {
    ...(submitted ?? {
      requestedBy: PEOPLE.sectionHead,
      submissionDate: returnedOn,
      workflowStepDate: formatTodayWorkflow(),
      reasonLabel: "Change in financial circumstances.",
      comments: "",
      historyEvents: [],
      files: [],
    }),
    returnedOn,
    bannerReturnedOn: returnedOn,
    directorWorkflowSub: `${PEOPLE.director} • ${returnedOn}`,
    blockPeriodDisplay: blockPeriodFor(applicant),
    directorFeedbackQuote: quote,
    historyEvents: [
      {
        title: "Sent back for more information",
        dateTime: formatDateTimeNow(),
        actor: PEOPLE.director,
        actorRole: "Regular Application Director",
        reasonLine: submitted?.reasonLabel ? `Reason: ${submitted.reasonLabel}` : undefined,
        comment: quote,
        dotVariant: "green",
      },
      ...(submitted?.historyEvents ?? []),
    ],
  };

  return {
    requestStatus: "returned",
    action: "resubmit",
    returnedRequest,
    approvedRequest: undefined,
    rejectedRequest: undefined,
    lastRequestNote: `RMI · ${returnedOn}`,
  };
}