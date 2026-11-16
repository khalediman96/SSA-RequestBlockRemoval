import { FormEvent, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ApplicationDetailsActionFooter } from "@/components/application/ApplicationDetailsActionFooter";
import {
  ApplicationDetailsInfoBanner,
  ApplicationDetailsSubmittedBanner,
  ApplicationDetailsSummary,
  ApplicationDetailsTitleRow,
  ApplicationDetailsWorkflow,
  type WorkflowPhase,
} from "@/components/application/ApplicationDetailsSections";
import {
  ApplicationDetailsApprovedBanner,
  ApplicationDetailsApprovedRemovalSummary,
  ApplicationDetailsApprovedSummary,
} from "@/components/application/ApplicationDetailsApproved";
import {
  ApplicationDetailsRmiBanner,
  ApplicationDetailsRmiSummary,
} from "@/components/application/ApplicationDetailsReturned";
import { resolveReturnedRemovalRequest } from "@/lib/returnedRemovalRequest";
import {
  ApplicationDetailsRejectionBanner,
  ApplicationDetailsRejectedRemovalSummary,
  ApplicationDetailsRejectedSummary,
} from "@/components/application/ApplicationDetailsRejected";
import { resolveRejectedRemovalRequest } from "@/lib/rejectedRemovalRequest";
import { ApplicationDetailsRemovalSummary } from "@/components/application/ApplicationDetailsRemovalSummary";
import { resolveApprovedRemovalRequest } from "@/lib/approvedRemovalRequest";
import { ApplicationDetailsUpload } from "@/components/application/ApplicationDetailsUpload";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { PEOPLE, userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { resolveSubmittedRemovalRequest } from "@/lib/submittedRemovalRequest";
import { useCharCount } from "@/hooks/useCharCount";
import { useWorkflow } from "@/context/WorkflowContext";
import { SubmitRequestConfirmSidesheet } from "@/components/application/SubmitRequestConfirmSidesheet";
import { REASON_LABELS, type RemovalReasonKey } from "@/types/workflow";

export function SectionHeadApplicationDetailsPage() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const { getApplicantById } = useApplicants();
  const applicant = applicantId ? getApplicantById(applicantId) : undefined;
  const { submitRequest, resubmit } = useWorkflow();

  const [reason, setReason] = useState<RemovalReasonKey>("");
  const [reasonError, setReasonError] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const comments = useCharCount(1000);

  const mode = useMemo(() => {
    if (!applicant) return "request";
    if (applicant.requestStatus === "returned" || applicant.action === "resubmit") return "resubmit";
    if (applicant.requestStatus === "approved" || applicant.requestStatus === "eligible") {
      return "approved";
    }
    if (applicant.action === "submitted" || applicant.requestStatus === "pending") return "submitted";
    if (applicant.requestStatus === "rejected") return "rejected";
    return "request";
  }, [applicant]);

  if (!applicant) {
    return <Navigate to="/section-head" replace />;
  }

  const workflowPhase: WorkflowPhase =
    mode === "approved"
      ? "complete"
      : mode === "submitted"
        ? "submitted"
        : mode === "resubmit"
          ? "returned"
          : mode === "rejected"
            ? "rejected"
            : "draft";

  const approvedRequest = useMemo(
    () => (mode === "approved" ? resolveApprovedRemovalRequest(applicant) : undefined),
    [applicant, mode],
  );

  const submittedRequest = useMemo(
    () =>
      mode === "submitted"
        ? applicant.submittedRequest ?? resolveSubmittedRemovalRequest(applicant)
        : undefined,
    [applicant, mode],
  );

  const returnedRequest = useMemo(
    () =>
      mode === "resubmit"
        ? resolveReturnedRemovalRequest(
            applicant,
            applicant.returnedRequest?.directorFeedbackQuote,
          )
        : undefined,
    [applicant, mode],
  );

  const rejectedRequest = useMemo(
    () =>
      mode === "rejected"
        ? resolveRejectedRemovalRequest(
            applicant,
            applicant.rejectedRequest?.directorRejectionQuote,
          )
        : undefined,
    [applicant, mode],
  );

  const onSubmitRequest = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "submitted") return;
    if (!reason) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    setConfirmSubmitOpen(true);
  };

  const onConfirmSubmit = () => {
    if (!applicantId) return;
    if (mode === "resubmit") {
      resubmit(applicantId, reason, comments.value);
      return;
    }
    submitRequest(applicantId, reason, comments.value);
  };

  const actionFooter = (
    <ApplicationDetailsActionFooter>
      <Link to="/section-head" className="app-details__btn-outline">
        Cancel
      </Link>
      {mode === "submitted" || mode === "approved" || mode === "rejected" ? (
        <Link to="/section-head" className="app-details__btn-primary">
          Back To List
        </Link>
      ) : (
        <button type="submit" form="section-head-details-form" className="app-details__btn-primary">
          {mode === "resubmit" ? "Resubmit For Approval" : "Submit For Approval"}
        </button>
      )}
    </ApplicationDetailsActionFooter>
  );

  return (
    <FigmaApplicationsHub
      hubPath="/section-head"
      userLabel={userPillLabel("sectionHead", "Section Head")}
      pageTitle=""
      pageSubtitle=""
      hidePageHeading
      shellClassName="figma-hub--details"
      workflowCrumbLabel="Awaiting Reapplication"
      breadcrumbLabel="Request To Remove Block"
      actionFooter={actionFooter}
    >
      <div className="app-details">
        <ApplicationDetailsTitleRow backHref="/section-head" applicant={applicant} />

        {mode === "request" ? <ApplicationDetailsInfoBanner /> : null}
        {mode === "submitted" ? <ApplicationDetailsSubmittedBanner /> : null}
        {mode === "approved" && approvedRequest ? (
          <ApplicationDetailsApprovedBanner approvedOn={approvedRequest.bannerApprovedOn} />
        ) : null}
        {mode === "resubmit" && returnedRequest ? (
          <ApplicationDetailsRmiBanner
            returnedOn={returnedRequest.bannerReturnedOn}
            directorQuote={returnedRequest.directorFeedbackQuote}
            directorMeta={`${PEOPLE.director} · ${returnedRequest.bannerReturnedOn}`}
          />
        ) : null}
        {mode === "rejected" && rejectedRequest ? (
          <ApplicationDetailsRejectionBanner
            rejectionText={
              rejectedRequest.directorRejectionQuote.trim() || rejectedRequest.bannerRejectionText
            }
          />
        ) : null}

        <ApplicationDetailsWorkflow
          phase={workflowPhase}
          submittedStepSub={
            rejectedRequest
              ? `Section Head • ${rejectedRequest.workflowStepDate}`
              : approvedRequest
                ? `Section Head • ${approvedRequest.workflowStepDate}`
                : submittedRequest
                  ? `Section Head • ${submittedRequest.workflowStepDate}`
                  : undefined
          }
          directorWorkflowSub={
            rejectedRequest?.directorWorkflowSub ??
            returnedRequest?.directorWorkflowSub ??
            approvedRequest?.directorWorkflowSub
          }
          historyEvents={
            rejectedRequest?.historyEvents ??
            returnedRequest?.historyEvents ??
            approvedRequest?.historyEvents ??
            submittedRequest?.historyEvents
          }
        />

        {mode === "approved" && approvedRequest ? (
          <>
            <ApplicationDetailsApprovedSummary
              applicant={applicant}
              blockPeriodDisplay={approvedRequest.blockPeriodDisplay}
            />
            <ApplicationDetailsApprovedRemovalSummary request={approvedRequest} />
          </>
        ) : mode === "resubmit" && returnedRequest ? (
          <ApplicationDetailsRmiSummary
            applicant={applicant}
            blockPeriodDisplay={returnedRequest.blockPeriodDisplay}
          />
        ) : mode === "rejected" && rejectedRequest ? (
          <>
            <ApplicationDetailsRejectedSummary
              applicant={applicant}
              blockPeriodDisplay={rejectedRequest.blockPeriodDisplay}
            />
            <ApplicationDetailsRejectedRemovalSummary request={rejectedRequest} />
          </>
        ) : (
          <>
            <ApplicationDetailsSummary applicant={applicant} />
            {mode === "submitted" && submittedRequest ? (
              <ApplicationDetailsRemovalSummary request={submittedRequest} />
            ) : null}
          </>
        )}

        {mode !== "submitted" && mode !== "approved" && mode !== "rejected" ? (
          <form
            id="section-head-details-form"
            className="app-details__form-panel"
            onSubmit={onSubmitRequest}
            noValidate
          >
            <>
              <fieldset className="app-details__field">
                <legend className="app-details__form-label">
                  Reason for removal <span className="required">*</span>
                </legend>
                <div className="app-details__select-wrap">
                  <select
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value as RemovalReasonKey);
                      if (e.target.value) setReasonError(false);
                    }}
                    required
                  >
                    <option value="">Select a reason</option>
                    {(Object.keys(REASON_LABELS) as Array<Exclude<RemovalReasonKey, "">>).map((key) => (
                      <option key={key} value={key}>
                        {REASON_LABELS[key]}
                      </option>
                    ))}
                  </select>
                  <img
                    src="/hugeicons/arrow-down-01-solid.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                  />
                </div>
                {reasonError ? (
                  <p className="app-details__field-error">Select a reason for removal before submitting.</p>
                ) : null}
              </fieldset>

              <div className="app-details__field">
                <span className="app-details__form-label">
                  Comments / Justification <span className="optional">(Optional)</span>
                </span>
                <div className="app-details__textarea-wrap">
                  <textarea
                    rows={4}
                    placeholder={
                      mode === "resubmit"
                        ? "Add any details the Director should know when you resubmit."
                        : "Add any details the Director should know."
                    }
                    value={comments.value}
                    onChange={(e) => comments.onChange(e.target.value)}
                  />
                </div>
                <div className="app-details__char-row">
                  <span>{comments.count}</span>
                  <span>/</span>
                  <span>{comments.max}</span>
                </div>
              </div>

              <div className="app-details__field">
                <span className="app-details__form-label">
                  Supporting Documents <span className="optional">(Optional)</span>
                </span>
                <ApplicationDetailsUpload />
              </div>
            </>
          </form>
        ) : null}
      </div>

      <SubmitRequestConfirmSidesheet
        open={confirmSubmitOpen}
        onClose={() => setConfirmSubmitOpen(false)}
        onConfirm={onConfirmSubmit}
        title={mode === "resubmit" ? "Resubmit Request?" : "Submit Request?"}
        description={
          mode === "resubmit"
            ? "Are you sure you want to resubmit this request?"
            : "Are you sure you want to submit this request?"
        }
      />
    </FigmaApplicationsHub>
  );
}