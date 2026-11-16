import { PEOPLE } from "@/constants/people";
import type { ApplicantRecord } from "@/types/workflow";

export function directorRequestedBy(applicant: ApplicantRecord): string | undefined {
  return (
    applicant.submittedRequest?.requestedBy ??
    applicant.approvedRequest?.requestedBy ??
    applicant.rejectedRequest?.requestedBy ??
    applicant.returnedRequest?.requestedBy ??
    (applicant.requestStatus !== "none" ? PEOPLE.sectionHead : undefined)
  );
}

export function directorCardApplicationNumber(applicant: ApplicantRecord): string {
  if (applicant.appNumber.startsWith("RBR-")) return applicant.appNumber;
  return applicant.sspCode;
}