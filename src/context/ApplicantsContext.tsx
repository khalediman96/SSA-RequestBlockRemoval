import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MOCK_APPLICANTS } from "@/data/mockApplicants";
import { createSimulatedApplicant, nextSimulatedSequence } from "@/lib/simulateApplicant";
import type { ApplicantRecord } from "@/types/workflow";

function cloneSeedApplicants(): ApplicantRecord[] {
  return MOCK_APPLICANTS.map((a) => ({
    ...a,
    submittedRequest: a.submittedRequest ? { ...a.submittedRequest, historyEvents: [...a.submittedRequest.historyEvents], files: [...a.submittedRequest.files] } : undefined,
    approvedRequest: a.approvedRequest ? { ...a.approvedRequest } : undefined,
    returnedRequest: a.returnedRequest ? { ...a.returnedRequest } : undefined,
    rejectedRequest: a.rejectedRequest ? { ...a.rejectedRequest } : undefined,
  }));
}

/** Pending items awaiting director action (legacy queue / review routing). */
export function selectDirectorQueue(applicants: ApplicantRecord[]): ApplicantRecord[] {
  return applicants.filter(
    (a) => a.requestStatus === "pending" && (a.action === "submitted" || a.action === "resubmit"),
  );
}

function hasDirectorRemovalRequest(applicant: ApplicantRecord): boolean {
  if (
    applicant.submittedRequest ||
    applicant.approvedRequest ||
    applicant.rejectedRequest ||
    applicant.returnedRequest
  ) {
    return true;
  }
  return (
    applicant.requestStatus === "pending" ||
    applicant.requestStatus === "returned" ||
    applicant.requestStatus === "rejected" ||
    applicant.requestStatus === "approved" ||
    applicant.requestStatus === "eligible"
  );
}

/** Director hub — all removal requests the director has seen or must act on (Figma 18:4007). */
export function selectDirectorHubList(applicants: ApplicantRecord[]): ApplicantRecord[] {
  return applicants.filter(hasDirectorRemovalRequest);
}

export function selectAssessorQueue(applicants: ApplicantRecord[]): ApplicantRecord[] {
  return applicants.filter((a) => a.requestStatus === "eligible" || a.requestStatus === "approved");
}

type ApplicantsContextValue = {
  applicants: ApplicantRecord[];
  getApplicantById: (id: string) => ApplicantRecord | undefined;
  updateApplicant: (id: string, patch: Partial<ApplicantRecord>) => void;
  addSimulatedApplicant: () => ApplicantRecord;
  directorQueue: ApplicantRecord[];
  directorHubList: ApplicantRecord[];
  assessorQueue: ApplicantRecord[];
};

const ApplicantsContext = createContext<ApplicantsContextValue | null>(null);

export function ApplicantsProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useState<ApplicantRecord[]>(cloneSeedApplicants);
  const getApplicantById = useCallback(
    (id: string) => applicants.find((a) => a.id === id),
    [applicants],
  );

  const updateApplicant = useCallback((id: string, patch: Partial<ApplicantRecord>) => {
    setApplicants((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    );
  }, []);

  const addSimulatedApplicant = useCallback(() => {
    let created!: ApplicantRecord;
    setApplicants((prev) => {
      const nextSeq = nextSimulatedSequence(prev);
      created = createSimulatedApplicant(nextSeq, prev);
      return [created, ...prev];
    });
    return created!;
  }, []);

  const directorQueue = useMemo(() => selectDirectorQueue(applicants), [applicants]);
  const directorHubList = useMemo(() => selectDirectorHubList(applicants), [applicants]);
  const assessorQueue = useMemo(() => selectAssessorQueue(applicants), [applicants]);

  const value = useMemo(
    () => ({
      applicants,
      getApplicantById,
      updateApplicant,
      addSimulatedApplicant,
      directorQueue,
      directorHubList,
      assessorQueue,
    }),
    [
      applicants,
      getApplicantById,
      updateApplicant,
      addSimulatedApplicant,
      directorQueue,
      directorHubList,
      assessorQueue,
    ],
  );

  return <ApplicantsContext.Provider value={value}>{children}</ApplicantsContext.Provider>;
}

export function useApplicants() {
  const ctx = useContext(ApplicantsContext);
  if (!ctx) throw new Error("useApplicants must be used within ApplicantsProvider");
  return ctx;
}