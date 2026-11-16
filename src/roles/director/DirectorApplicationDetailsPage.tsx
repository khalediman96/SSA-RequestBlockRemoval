import { FormEvent, useMemo, useState, type ComponentProps } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ApplicationDetailsActionFooter } from "@/components/application/ApplicationDetailsActionFooter";
import {
  ApplicationDetailsDirectorApprovedBanner,
  ApplicationDetailsApprovedSummary,
} from "@/components/application/ApplicationDetailsApproved";
import {
  ApplicationDetailsRejectionBanner,
  ApplicationDetailsRejectedSummary,
} from "@/components/application/ApplicationDetailsRejected";
import { resolveApprovedRemovalRequest } from "@/lib/approvedRemovalRequest";
import { resolveRejectedRemovalRequest } from "@/lib/rejectedRemovalRequest";
import {
  ApplicationDetailsDirectorPendingBanner,
  ApplicationDetailsSummary,
  ApplicationDetailsTitleRow,
  ApplicationDetailsWorkflow,
} from "@/components/application/ApplicationDetailsSections";
import { ApplicationDetailsDirectorRmiBanner } from "@/components/application/ApplicationDetailsReturned";
import { resolveReturnedRemovalRequest } from "@/lib/returnedRemovalRequest";
import { ApplicationDetailsSectionHeadRequest } from "@/components/application/ApplicationDetailsSectionHeadRequest";
import { DirectorDecisionForm } from "@/components/application/DirectorDecisionForm";
import { DirectorDecisionOutcome } from "@/components/application/DirectorDecisionOutcome";
import { SubmitRequestConfirmSidesheet } from "@/components/application/SubmitRequestConfirmSidesheet";
import { useApplicants } from "@/context/ApplicantsContext";
import { useWorkflow } from "@/context/WorkflowContext";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { userPillLabel } from "@/constants/people";
import { resolveSubmittedRemovalRequest } from "@/lib/submittedRemovalRequest";
import { useCharCount } from "@/hooks/useCharCount";
import type { WorkflowPhase } from "@/components/application/ApplicationDetailsSections";
import type { ApplicantRecord, DirectorDecision, SubmittedRemovalRequest } from "@/types/workflow";

type DirectorDetailsMode = "pending" | "approved" | "rejected" | "returned" | "other";

function directorDetailsMode(applicant: ApplicantRecord): DirectorDetailsMode {
  if (applicant.requestStatus === "pending") return "pending";
  if (applicant.requestStatus === "eligible" || applicant.requestStatus === "approved") {
    return "approved";
  }
  if (applicant.requestStatus === "rejected") return "rejected";
  if (applicant.requestStatus === "returned") return "returned";
  return "other";
}

function directorWorkflowPhase(mode: DirectorDetailsMode): WorkflowPhase {
  if (mode === "pending") return "directorActive";
  if (mode === "approved") return "complete";
  if (mode === "rejected") return "rejected";
  if (mode === "returned") return "directorSentBack";
  return "submitted";
}

function sectionHeadRequestFor(applicant: ApplicantRecord): SubmittedRemovalRequest | undefined {
  return (
    applicant.approvedRequest ??
    applicant.rejectedRequest ??
    applicant.returnedRequest ??
    applicant.submittedRequest ??
    resolveSubmittedRemovalRequest(applicant)
  );
}

export function DirectorApplicationDetailsPage() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const { getApplicantById } = useApplicants();
  const { confirmDirectorDecision } = useWorkflow();
  const applicant = applicantId ? getApplicantById(applicantId) : undefined;

  const [decision, setDecision] = useState<DirectorDecision>("");
  const [decisionError, setDecisionError] = useState(false);
  const [commentsError, setCommentsError] = useState(false);
  const [confirmDecisionOpen, setConfirmDecisionOpen] = useState(false);
  const comments = useCharCount(1000);

  const mode = applicant ? directorDetailsMode(applicant) : "other";

  const approvedRequest = useMemo(
    () => (applicant && mode === "approved" ? resolveApprovedRemovalRequest(applicant) : undefined),
    [applicant, mode],
  );

  const rejectedRequest = useMemo(
    () =>
      applicant && mode === "rejected"
        ? resolveRejectedRemovalRequest(applicant, applicant.rejectedRequest?.directorRejectionQuote)
        : undefined,
    [applicant, mode],
  );

  const returnedRequest = useMemo(
    () =>
      applicant && mode === "returned"
        ? resolveReturnedRemovalRequest(
            applicant,
            applicant.returnedRequest?.directorFeedbackQuote,
          )
        : undefined,
    [applicant, mode],
  );

  const sectionHeadRequest = useMemo(
    () => (applicant ? sectionHeadRequestFor(applicant) : undefined),
    [applicant],
  );

  if (!applicant) {
    return <Navigate to="/director" replace />;
  }

  const isPending = mode === "pending";

  const validateDecision = () => {
    if (!decision) {
      setDecisionError(true);
      return false;
    }
    setDecisionError(false);
    const needsComments = decision === "reject" || decision === "sendback";
    if (needsComments && !comments.value.trim()) {
      setCommentsError(true);
      return false;
    }
    setCommentsError(false);
    return true;
  };

  const onSubmitDecision = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateDecision()) return;
    setConfirmDecisionOpen(true);
  };

  const onConfirmDecision = () => {
    if (!applicantId || !decision) return;
    if (!validateDecision()) return;
    confirmDirectorDecision(applicantId, decision as "approve" | "reject" | "sendback", comments.value);
  };

  const confirmSidesheetCopy = useMemo((): Pick<
    ComponentProps<typeof SubmitRequestConfirmSidesheet>,
    "title" | "description" | "confirmLabel"
  > | null => {
    if (decision === "approve") {
      return {
        title: "Confirm approval?",
        description:
          "The applicant will be removed from the block list and marked Eligible to Reapply.",
        confirmLabel: "Yes, approve",
      };
    }
    if (decision === "reject") {
      return {
        title: "Confirm rejection?",
        description:
          "The block stays active. The Section Head will see your comments in the request details.",
        confirmLabel: "Yes, reject",
      };
    }
    if (decision === "sendback") {
      return {
        title: "Send back for more information?",
        description:
          "The request returns to the Section Head. Your comments will appear in their info banner.",
        confirmLabel: "Yes, send back",
      };
    }
    return null;
  }, [decision]);

  const actionFooter = isPending ? (
    <ApplicationDetailsActionFooter>
      <button type="button" className="app-details__btn-outline" onClick={() => navigate("/director")}>
        Cancel
      </button>
      <button type="submit" form="director-decision-form" className="app-details__btn-primary">
        Confirm Decision
      </button>
    </ApplicationDetailsActionFooter>
  ) : (
    <ApplicationDetailsActionFooter>
      <button type="button" className="app-details__btn-outline" onClick={() => navigate("/director")}>
        Close
      </button>
      <button type="button" className="app-details__btn-primary" onClick={() => navigate("/director")}>
        Back To List
      </button>
    </ApplicationDetailsActionFooter>
  );

  const workflowStepSub =
    rejectedRequest?.workflowStepDate ??
    returnedRequest?.workflowStepDate ??
    approvedRequest?.workflowStepDate ??
    sectionHeadRequest?.workflowStepDate;

  const historyEvents =
    rejectedRequest?.historyEvents ??
    returnedRequest?.historyEvents ??
    approvedRequest?.historyEvents ??
    sectionHeadRequest?.historyEvents;

  const rejectionBannerText =
    rejectedRequest?.directorRejectionQuote.trim() || rejectedRequest?.bannerRejectionText || "";

  return (
    <FigmaApplicationsHub
      hubPath="/director"
      userLabel={userPillLabel("director", "Regular Application Director")}
      pageTitle=""
      pageSubtitle=""
      hidePageHeading
      shellClassName="figma-hub--details"
      workflowCrumbLabel="Remove Block Requests"
      breadcrumbLabel="Applicant Details"
      actionFooter={actionFooter}
    >
      <div className="app-details">
        <ApplicationDetailsTitleRow backHref="/director" applicant={applicant} />

        {isPending ? <ApplicationDetailsDirectorPendingBanner /> : null}
        {mode === "approved" ? <ApplicationDetailsDirectorApprovedBanner /> : null}
        {mode === "rejected" && rejectedRequest ? (
          <ApplicationDetailsRejectionBanner rejectionText={rejectionBannerText} />
        ) : null}
        {mode === "returned" && returnedRequest ? (
          <ApplicationDetailsDirectorRmiBanner
            directorQuote={returnedRequest.directorFeedbackQuote}
          />
        ) : null}

        <ApplicationDetailsWorkflow
          phase={directorWorkflowPhase(mode)}
          submittedStepSub={workflowStepSub ? `Section Head • ${workflowStepSub}` : undefined}
          directorWorkflowSub={
            rejectedRequest?.directorWorkflowSub ??
            returnedRequest?.directorWorkflowSub ??
            approvedRequest?.directorWorkflowSub
          }
          historyEvents={historyEvents}
        />

        {mode === "approved" && approvedRequest ? (
          <ApplicationDetailsApprovedSummary
            applicant={applicant}
            blockPeriodDisplay={approvedRequest.blockPeriodDisplay}
          />
        ) : mode === "rejected" && rejectedRequest ? (
          <ApplicationDetailsRejectedSummary
            applicant={applicant}
            blockPeriodDisplay={rejectedRequest.blockPeriodDisplay}
          />
        ) : mode === "returned" || mode === "pending" ? (
          <ApplicationDetailsSummary applicant={applicant} />
        ) : null}

        {sectionHeadRequest ? <ApplicationDetailsSectionHeadRequest request={sectionHeadRequest} /> : null}

        {isPending ? (
          <DirectorDecisionForm
            formId="director-decision-form"
            decision={decision}
            onDecision={(value) => {
              setDecision(value);
              setDecisionError(false);
              if (value === "approve" || value === "") setCommentsError(false);
            }}
            decisionError={decisionError}
            comments={comments}
            commentsError={commentsError}
            onCommentsInput={(value) => {
              comments.onChange(value);
              if (value.trim()) setCommentsError(false);
            }}
            onSubmit={onSubmitDecision}
          />
        ) : mode === "approved" ? (
          <DirectorDecisionOutcome
            decision="approve"
            comment={approvedRequest?.directorDecisionComment}
          />
        ) : mode === "rejected" ? (
          <DirectorDecisionOutcome
            decision="reject"
            comment={rejectedRequest?.directorRejectionQuote}
          />
        ) : mode === "returned" ? (
          <DirectorDecisionOutcome
            decision="sendback"
            comment={returnedRequest?.directorFeedbackQuote}
          />
        ) : (
          <section className="app-details__form-panel">
            <p className="app-details__read-only-note">
              This request is no longer pending director review (status: {applicant.requestStatus}).
            </p>
          </section>
        )}
      </div>

      {confirmSidesheetCopy ? (
        <SubmitRequestConfirmSidesheet
          open={confirmDecisionOpen}
          onClose={() => setConfirmDecisionOpen(false)}
          onConfirm={onConfirmDecision}
          title={confirmSidesheetCopy.title}
          description={confirmSidesheetCopy.description}
          confirmLabel={confirmSidesheetCopy.confirmLabel}
        />
      ) : null}
    </FigmaApplicationsHub>
  );
}