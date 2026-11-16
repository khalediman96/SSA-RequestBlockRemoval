import { formatApplicantDisplayName } from "@/lib/formatApplicantName";
import type { ApplicantRecord } from "@/types/workflow";

/** Director read-only view after sending a request back (Figma 94:35715). */
export function ApplicationDetailsDirectorRmiBanner({ directorQuote }: { directorQuote: string }) {
  const quote = directorQuote.trim();

  return (
    <div className="app-details__rmi-banner app-details__rmi-banner--director" role="status">
      <div className="app-details__rmi-banner-tile">
        <img
          src="/app-details-warning.svg"
          alt=""
          width={24}
          height={24}
          className="app-details__rmi-banner-icon"
        />
        <div className="app-details__rmi-banner-copy">
          <p className="app-details__rmi-banner-title">Sent back for more information</p>
          {quote ? (
            <p className="app-details__rmi-banner-body">&ldquo;{quote}&rdquo;</p>
          ) : (
            <p className="app-details__rmi-banner-body">
              This request was returned to the Section Head for additional information.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export function ApplicationDetailsRmiBanner({
  returnedOn,
  directorQuote,
  directorMeta,
}: {
  returnedOn: string;
  directorQuote?: string;
  directorMeta?: string;
}) {
  const quote = directorQuote?.trim() ?? "";

  return (
    <div className="app-details__info-banner app-details__info-banner--rmi" role="status">
      <svg className="app-details__info-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#4386CD" strokeWidth="1.5" />
        <path d="M12 8V13" stroke="#4386CD" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.75" fill="#4386CD" />
      </svg>
      <div className="app-details__info-banner-copy">
        <p className="app-details__info-banner-head">
          <strong>Returned for More Information</strong>
          {directorMeta ? <span className="app-details__info-banner-meta">{directorMeta}</span> : null}
        </p>
        <p className="app-details__info-banner-lead">
          The Regular Application Director returned this request on {returnedOn}. Please review the
          feedback below, update the requested details, and resubmit for approval.
        </p>
        {quote ? (
          <>
            <p className="app-details__info-banner-head app-details__info-banner-head--sub">
              <strong>Director comments</strong>
            </p>
            <p className="app-details__info-banner-quote">&ldquo;{quote}&rdquo;</p>
          </>
        ) : null}
      </div>
    </div>
  );
}

export function ApplicationDetailsRmiSummary({
  applicant,
  blockPeriodDisplay,
}: {
  applicant: ApplicantRecord;
  blockPeriodDisplay: string;
}) {
  const blockReason = applicant.blockReason.replace(/\s*-\s*/g, " – ");
  const reasonText = blockReason.endsWith(".") ? blockReason : `${blockReason}.`;

  return (
    <section className="app-details__panel" aria-labelledby="applicant-summary-rmi-heading">
      <h2 id="applicant-summary-rmi-heading" className="app-details__panel-head">
        Applicant Summary
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row app-details__summary-row--approved">
          <RmiSummaryField
            label="Applicant Name"
            value={formatApplicantDisplayName(applicant.name)}
          />
          <RmiSummaryField label="Emirates ID" value={applicant.emiratesId} plain />
          <RmiSummaryField label="Block Period" value={blockPeriodDisplay} plain />
          <div className="app-details__field app-details__field--status">
            <span className="app-details__field-label">Previous Block Status</span>
            <span className="app-details__applicant-status-chip app-details__applicant-status-chip--struck">
              Awaiting Reapplication
            </span>
          </div>
          <div className="app-details__field app-details__field--status">
            <span className="app-details__field-label">Current Status</span>
            <span className="app-details__applicant-status-chip">Awaiting Reapplication</span>
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

function RmiSummaryField({
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
        className={`app-details__field-value${
          plain ? " app-details__field-value--plain" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}