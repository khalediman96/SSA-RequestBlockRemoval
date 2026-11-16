import type { SubmittedRemovalRequest } from "@/types/workflow";

type Props = {
  request: SubmittedRemovalRequest;
};

export function ApplicationDetailsSectionHeadRequest({ request }: Props) {
  return (
    <section className="app-details__panel" aria-labelledby="section-head-request-heading">
      <h2 id="section-head-request-heading" className="app-details__panel-head">
        Section Head Request
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row app-details__summary-row--three">
          <div className="app-details__field">
            <span className="app-details__field-label">Requested By</span>
            <span className="app-details__field-value">{request.requestedBy}</span>
          </div>
          <div className="app-details__field">
            <span className="app-details__field-label">Request Date</span>
            <span className="app-details__field-value app-details__field-value--plain">
              {request.submissionDate}
            </span>
          </div>
          <div className="app-details__field app-details__field--reason">
            <span className="app-details__field-label">Requested Removal reason</span>
            <span className="app-details__field-value app-details__field-value--body">
              {request.reasonLabel}
            </span>
          </div>
        </div>
        <hr className="app-details__summary-divider" aria-hidden="true" />
        <div className="app-details__comment-block app-details__comment-block--section-head">
          <span className="app-details__field-label">Section Head Justification</span>
          <p>{request.comments}</p>
        </div>
      </div>
      {request.files.length > 0 ? (
        <div className="app-details__attachments app-details__attachments--compact">
          <span className="app-details__attachments-title">Supporting documents</span>
          <div className="app-details__attachment-chips">
            {request.files.map((file) => (
              <a
                key={file.name}
                className="app-details__attachment-chip"
                href={`data:text/plain,${encodeURIComponent(file.name)}`}
                download={file.name}
              >
                <img src="/PDF-40.svg" alt="" width={16} height={16} aria-hidden="true" />
                <span>{file.name}</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}