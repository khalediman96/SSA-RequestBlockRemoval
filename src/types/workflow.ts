export type RequestStatus =
  | "none"
  | "pending"
  | "returned"
  | "rejected"
  | "approved"
  | "eligible";

export type ApplicantBlockStatus = "Awaiting Reapplication" | "Eligible to Reapply";

export type RemovalReasonKey = "financial" | "medical" | "error" | "";

export type DirectorDecision = "approve" | "reject" | "sendback" | "";

export const REASON_LABELS: Record<Exclude<RemovalReasonKey, "">, string> = {
  financial: "Change in financial circumstances",
  medical: "Medical or humanitarian grounds",
  error: "Administrative error",
};

export type HubSegment =
  | "all"
  | "none"
  | "pending"
  | "returned"
  | "approved"
  | "rejected";

export type ApplicantGender = "male" | "female";

export interface WorkflowHistoryEvent {
  title: string;
  dateTime: string;
  actor: string;
  actorRole: string;
  reasonLine?: string;
  comment?: string;
  dotVariant?: "gold" | "green" | "red";
  statusTransition?: { from: string; to: string };
}

export interface SubmittedRemovalRequest {
  requestedBy: string;
  submissionDate: string;
  workflowStepDate: string;
  reasonLabel: string;
  comments: string;
  historyEvents: WorkflowHistoryEvent[];
  files: { name: string; size: string }[];
}

export interface ApprovedRemovalRequest extends SubmittedRemovalRequest {
  approvedBy: string;
  approvalDate: string;
  bannerApprovedOn: string;
  blockPeriodDisplay: string;
  directorWorkflowSub: string;
  directorDecisionComment?: string;
}

export interface RejectedRemovalRequest extends SubmittedRemovalRequest {
  rejectedBy: string;
  rejectionDate: string;
  bannerRejectionText: string;
  directorWorkflowSub: string;
  blockPeriodDisplay: string;
  directorRejectionQuote: string;
}

export interface ReturnedRemovalRequest extends SubmittedRemovalRequest {
  returnedOn: string;
  bannerReturnedOn: string;
  directorWorkflowSub: string;
  blockPeriodDisplay: string;
  directorFeedbackQuote: string;
}

export interface ApplicantRecord {
  id: string;
  appNumber: string;
  sspCode: string;
  name: string;
  gender: ApplicantGender;
  mobile?: string;
  emiratesId: string;
  blockStart: string;
  blockEnd: string;
  blockReason: string;
  requestStatus: RequestStatus;
  searchHaystack: string;
  lastRequestNote?: string;
  removeBlockRequests?: string;
  expandedDefault?: boolean;
  action: "request" | "submitted" | "resubmit" | "request-after-reject";
  submittedRequest?: SubmittedRemovalRequest;
  approvedRequest?: ApprovedRemovalRequest;
  returnedRequest?: ReturnedRemovalRequest;
  rejectedRequest?: RejectedRemovalRequest;
}