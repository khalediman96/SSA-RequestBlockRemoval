import { formatApplicantDisplayName } from "@/lib/formatApplicantName";
import type { ApplicantRecord, ApprovedRemovalRequest } from "@/types/workflow";

export function ApplicationDetailsDirectorApprovedBanner() {
  return (
    <div className="app-details__approved-banner" role="status">
      <img
        src="/app-details-check-circle.svg"
        alt=""
        width={24}
        height={24}
        className="app-details__approved-banner-icon"
      />
      <p>This request was approved.</p>
    </div>
  );
}

export function ApplicationDetailsApprovedBanner({ approvedOn }: { approvedOn: string }) {
  return (
    <div className="app-details__approved-banner" role="status">
      <img
        src="/app-details-check-circle.svg"
        alt=""
        width={24}
        height={24}
        className="app-details__approved-banner-icon"
      />
      <p>
        Approved by Regular Application Director on {approvedOn}. Applicant removed from block list
        and is now Eligible to Reapply.
      </p>
    </div>
  );
}

export function ApplicationDetailsApprovedSummary({
  applicant,
  blockPeriodDisplay,
}: {
  applicant: ApplicantRecord;
  blockPeriodDisplay: string;
}) {
  const blockReason = applicant.blockReason.replace(/\s*-\s*/g, " – ");
  const reasonText = blockReason.endsWith(".") ? blockReason : `${blockReason}.`;

  return (
    <section className="app-details__panel" aria-labelledby="applicant-summary-approved-heading">
      <h2 id="applicant-summary-approved-heading" className="app-details__panel-head">
        Applicant Summary
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row app-details__summary-row--approved">
          <ApprovedSummaryField
            label="Applicant Name"
            value={formatApplicantDisplayName(applicant.name)}
          />
          <ApprovedSummaryField label="Emirates ID" value={applicant.emiratesId} plain />
          <ApprovedSummaryField label="Block Period" value={blockPeriodDisplay} plain />
          <div className="app-details__field app-details__field--status">
            <span className="app-details__field-label">Previous Block Status</span>
            <span className="app-details__applicant-status-chip app-details__applicant-status-chip--struck">
              Awaiting Reapplication
            </span>
          </div>
          <div className="app-details__field app-details__field--status">
            <span className="app-details__field-label">Current Status</span>
            <span className="app-details__applicant-status-chip app-details__applicant-status-chip--eligible">
              Eligible to Reapply
            </span>
          </div>
          <div className="app-details__field app-details__field--reason app-details__field--approved-reason">
            <span className="app-details__field-label">Original Block Reason</span>
            <span className="app-details__field-value app-details__field-value--body">{reasonText}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ApplicationDetailsApprovedRemovalSummary({
  request,
}: {
  request: ApprovedRemovalRequest;
}) {
  return (
    <section className="app-details__panel" aria-labelledby="removal-summary-approved-heading">
      <h2 id="removal-summary-approved-heading" className="app-details__panel-head">
        Removal Request Summary
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row app-details__summary-row--approved-removal">
          <ApprovedSummaryField label="Requested By" value={request.requestedBy} />
          <ApprovedSummaryField label="Approved By" value={request.approvedBy} />
          <ApprovedSummaryField label="Submission Date" value={request.submissionDate} plain />
          <ApprovedSummaryField label="Approval Date" value={request.approvalDate} plain />
          <div className="app-details__field app-details__field--request-status">
            <span className="app-details__field-label">Request Status</span>
            <span className="app-details__request-status-chip app-details__request-status-chip--approved">
              Approved
            </span>
          </div>
          <div className="app-details__field app-details__field--reason app-details__field--approved-reason">
            <span className="app-details__field-label">Reason for Removal</span>
            <span className="app-details__field-value app-details__field-value--body">
              {request.reasonLabel}
            </span>
          </div>
        </div>
        <hr className="app-details__summary-divider" aria-hidden="true" />
        <div className="app-details__comment-block app-details__comment-block--approved">
          <span className="app-details__field-label">Comment / Justification</span>
          <p>{request.comments}</p>
        </div>
      </div>
      {request.files.length > 0 ? (
        <div className="app-details__attachments">
          <span className="app-details__attachments-title">Supporting documents (Optional)</span>
          <div className="app-details__attachment-grid">
            {request.files.map((file) => (
              <div key={file.name} className="app-details__attachment-card">
                <img
                  className="app-details__attachment-pdf"
                  src="/PDF-40.svg"
                  alt=""
                  width={36}
                  height={36}
                />
                <div className="app-details__attachment-meta">
                  <strong>{file.name}</strong>
                  <span>{file.size}</span>
                </div>
                <a
                  className="app-details__attachment-download"
                  href={`data:text/plain,${encodeURIComponent(file.name)}`}
                  download={file.name}
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ApprovedSummaryField({
  label,
  value,
  plain,
}: {
  label: string;
  value: string;
  plain?: boolean;
}) {
  return (
    <div className="app-details__field">
      <span className="app-details__field-label">{label}</span>
      <span
        className={`app-details__field-value${plain ? " app-details__field-value--plain" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}