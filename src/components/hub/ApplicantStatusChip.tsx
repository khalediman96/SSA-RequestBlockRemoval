import type { ApplicantRecord } from "@/types/workflow";

export function ApplicantStatusChip({ status }: { status: ApplicantRecord["requestStatus"] }) {
  if (status === "pending") {
    return (
      <span className="figma-status-chip figma-status-chip--pending">Pending Director Approval</span>
    );
  }
  if (status === "returned") {
    return (
      <span className="figma-status-chip figma-status-chip--returned figma-status-chip--acronym">
        RMI
      </span>
    );
  }
  if (status === "rejected") {
    return <span className="figma-status-chip figma-status-chip--rejected">Rejected</span>;
  }
  if (status === "approved" || status === "eligible") {
    return <span className="figma-status-chip figma-status-chip--eligible">Eligible to Reapply</span>;
  }
  return <span className="figma-status-chip figma-status-chip--awaiting">Awaiting Reapplication</span>;
}