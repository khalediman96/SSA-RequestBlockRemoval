import type { SubmittedRemovalRequest } from "@/types/workflow";

type Props = {
  request: SubmittedRemovalRequest;
};

export function ApplicationDetailsRemovalSummary({ request }: Props) {
  return (
    <section className="app-details__panel" aria-labelledby="removal-summary-heading">
      <h2 id="removal-summary-heading" className="app-details__panel-head">
        Removal Request Summary
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row app-details__summary-row--three">
          <div className="app-details__field">
            <span className="app-details__field-label">Requested By</span>
            <span className="app-details__field-value">{request.requestedBy}</span>
          </div>
          <div className="app-details__field">
            <span className="app-details__field-label">Submission Date</span>
            <span className="app-details__field-value app-details__field-value--plain">
              {request.submissionDate}
            </span>
          </div>
          <div className="app-details__field app-details__field--request-status">
            <span className="app-details__field-label">Request Status</span>
            <span className="app-details__request-status-chip">Pending Director approval</span>
          </div>
        </div>
        <div className="app-details__field app-details__field--reason">
          <span className="app-details__field-label">Reason for Removal</span>
          <span className="app-details__field-value app-details__field-value--body">
            {request.reasonLabel}
          </span>
        </div>
        <hr className="app-details__summary-divider" aria-hidden="true" />
        <div className="app-details__comment-block">
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