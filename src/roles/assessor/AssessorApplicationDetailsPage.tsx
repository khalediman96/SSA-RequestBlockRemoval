import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  ApplicationDetailsApprovedRemovalSummary,
  ApplicationDetailsApprovedSummary,
} from "@/components/application/ApplicationDetailsApproved";
import { ApplicationDetailsAssessorEligibleBanner } from "@/components/application/ApplicationDetailsAssessor";
import { ApplicationDetailsActionFooter } from "@/components/application/ApplicationDetailsActionFooter";
import { ApplicationDetailsTitleRow } from "@/components/application/ApplicationDetailsSections";
import { AssessorAssessmentWorkspace } from "@/components/assessor/AssessorAssessmentWorkspace";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { useApplicants } from "@/context/ApplicantsContext";
import { userPillLabel } from "@/constants/people";
import { resolveApprovedRemovalRequest } from "@/lib/approvedRemovalRequest";

export function AssessorApplicationDetailsPage() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const navigate = useNavigate();
  const { getApplicantById } = useApplicants();
  const applicant = applicantId ? getApplicantById(applicantId) : undefined;

  if (!applicant) {
    return <Navigate to="/assessor" replace />;
  }

  const approvedRequest = resolveApprovedRemovalRequest(applicant);
  if (!approvedRequest) {
    return <Navigate to="/assessor" replace />;
  }

  const actionFooter = (
    <ApplicationDetailsActionFooter>
      <button type="button" className="app-details__btn-outline" onClick={() => navigate("/assessor")}>
        Save Draft
      </button>
      <button type="button" className="app-details__btn-primary">
        Submit for Approval
      </button>
    </ApplicationDetailsActionFooter>
  );

  return (
    <FigmaApplicationsHub
      hubPath="/assessor"
      userLabel={userPillLabel("assessor", "Assessor")}
      pageTitle=""
      pageSubtitle=""
      hidePageHeading
      shellClassName="figma-hub--details"
      workflowCrumbLabel="Applications For Assessment"
      breadcrumbLabel="Application Details"
      breadcrumbDetail={applicant.name}
      actionFooter={actionFooter}
    >
      <div className="app-details app-details--assessor">
        <ApplicationDetailsTitleRow
          backHref="/assessor"
          applicant={applicant}
          applicationNumberField="appNumber"
        />

        <ApplicationDetailsAssessorEligibleBanner />

        <ApplicationDetailsApprovedSummary
          applicant={applicant}
          blockPeriodDisplay={approvedRequest.blockPeriodDisplay}
        />

        <ApplicationDetailsApprovedRemovalSummary request={approvedRequest} />

        <AssessorAssessmentWorkspace applicant={applicant} />
      </div>
    </FigmaApplicationsHub>
  );
}