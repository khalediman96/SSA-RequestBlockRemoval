import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { useApplicants } from "@/context/ApplicantsContext";
import { applicantAfterSubmit } from "@/lib/simulateApplicant";
import {
  patchApplicantApproved,
  patchApplicantRejected,
  patchApplicantReturned,
} from "@/lib/workflowApplicantPatch";
import { MOCK_APPLICANTS } from "@/data/mockApplicants";
import type { RemovalReasonKey } from "@/types/workflow";

interface WorkflowContextValue {
  submitRequest: (applicantId: string, reason: RemovalReasonKey, comments: string) => boolean;
  confirmDirectorDecision: (
    applicantId: string,
    decision: "approve" | "reject" | "sendback",
    comments: string,
  ) => boolean;
  resubmit: (applicantId: string, reason: RemovalReasonKey, comments: string) => void;
}

const WorkflowContext = createContext<WorkflowContextValue | null>(null);

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { applicants, getApplicantById, updateApplicant } = useApplicants();

  const submitRequest = useCallback(
    (applicantId: string, reason: RemovalReasonKey, comments: string): boolean => {
      if (!reason) return false;
      const applicant = getApplicantById(applicantId);
      if (!applicant) return false;

      const patch = applicantAfterSubmit(applicant, reason, comments, applicants);
      updateApplicant(applicantId, patch);
      navigate("/section-head");
      return true;
    },
    [applicants, getApplicantById, navigate, updateApplicant],
  );

  const resubmit = useCallback(
    (applicantId: string, reason: RemovalReasonKey, comments: string) => {
      if (!reason) return;
      const applicant = getApplicantById(applicantId);
      if (!applicant) return;

      const patch = applicantAfterSubmit(applicant, reason, comments, applicants);
      updateApplicant(applicantId, {
        ...patch,
        action: "submitted",
        requestStatus: "pending",
        returnedRequest: applicant.returnedRequest,
      });
      navigate("/section-head");
    },
    [applicants, getApplicantById, navigate, updateApplicant],
  );

  const confirmDirectorDecision = useCallback(
    (applicantId: string, decision: "approve" | "reject" | "sendback", comments: string): boolean => {
      const needsComments = decision === "reject" || decision === "sendback";
      if (needsComments && !comments.trim()) return false;

      const applicant = getApplicantById(applicantId);
      if (!applicant) return false;

      if (decision === "approve") {
        updateApplicant(applicantId, patchApplicantApproved(applicant, comments));
        navigate("/director");
        return true;
      }
      if (decision === "sendback") {
        updateApplicant(applicantId, patchApplicantReturned(applicant, comments));
        navigate("/director");
        return true;
      }

      updateApplicant(applicantId, patchApplicantRejected(applicant, comments));
      navigate("/director");
      return true;
    },
    [getApplicantById, navigate, updateApplicant],
  );

  const value = useMemo(
    () => ({
      submitRequest,
      confirmDirectorDecision,
      resubmit,
    }),
    [submitRequest, confirmDirectorDecision, resubmit],
  );

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

export function useWorkflow() {
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error("useWorkflow must be used within WorkflowProvider");
  return ctx;
}

export const DEMO_APPLICANT = MOCK_APPLICANTS[0];