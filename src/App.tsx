import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ApplicantsProvider } from "@/context/ApplicantsContext";
import { WorkflowProvider } from "@/context/WorkflowContext";
import { RoleHomePage } from "@/pages/RoleHomePage";
import { ApplicationPage } from "@/roles/assessor/ApplicationPage";
import { AssessorHomePage } from "@/roles/assessor/AssessorHomePage";
import { DirectorHomePage } from "@/roles/director/DirectorHomePage";
import { ReviewPage } from "@/roles/director/ReviewPage";
import { AssessorApplicationDetailsPage } from "@/roles/assessor/AssessorApplicationDetailsPage";
import { AwaitingReapplicationPage } from "@/roles/sectionHead/AwaitingReapplicationPage";
import { SectionHeadApplicationDetailsPage } from "@/roles/sectionHead/SectionHeadApplicationDetailsPage";
import { DirectorApplicationDetailsPage } from "@/roles/director/DirectorApplicationDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <ApplicantsProvider>
        <WorkflowProvider>
          <Routes>
          <Route path="/" element={<RoleHomePage />} />
          <Route path="/section-head" element={<AwaitingReapplicationPage />} />
          <Route path="/section-head/application/:applicantId" element={<SectionHeadApplicationDetailsPage />} />
          <Route path="/section-head/request" element={<Navigate to="/section-head/application/hamad" replace />} />
          <Route path="/section-head/resubmit" element={<Navigate to="/section-head/application/ahmed" replace />} />
          <Route path="/director" element={<DirectorHomePage />} />
          <Route path="/director/application/:applicantId" element={<DirectorApplicationDetailsPage />} />
          <Route path="/director/review" element={<ReviewPage />} />
          <Route path="/assessor" element={<AssessorHomePage />} />
          <Route path="/assessor/application/:applicantId" element={<AssessorApplicationDetailsPage />} />
          <Route path="/assessor/application" element={<ApplicationPage />} />
          </Routes>
        </WorkflowProvider>
      </ApplicantsProvider>
    </BrowserRouter>
  );
}