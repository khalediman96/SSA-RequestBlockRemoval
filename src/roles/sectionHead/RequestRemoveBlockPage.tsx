import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CoordinatorNav } from "@/components/layout/CoordinatorNav";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { RoleLayoutHeader } from "@/components/layout/RoleLayoutHeader";
import { Badge } from "@/components/ui/Badge";
import { userPillLabel } from "@/constants/people";
import { DEMO_APPLICANT, useWorkflow } from "@/context/WorkflowContext";
import { useCharCount } from "@/hooks/useCharCount";
import type { RemovalReasonKey } from "@/types/workflow";

export function RequestRemoveBlockPage() {
  const navigate = useNavigate();
  const { submitRequest } = useWorkflow();
  const [reason, setReason] = useState<RemovalReasonKey>("");
  const [reasonError, setReasonError] = useState(false);
  const comments = useCharCount(1000);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!reason) {
      setReasonError(true);
      return;
    }
    setReasonError(false);
    submitRequest(a.id, reason, comments.value);
  };

  const a = DEMO_APPLICANT;

  return (
    <div className="app-shell remove-block-request">
      <CoordinatorNav compact />
      <RoleLayoutHeader
        userLabel={userPillLabel("sectionHead", "Section Head")}
        breadcrumb={
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/section-head">Awaiting Reapplication</Link> / Request to Remove Block
          </nav>
        }
      />
      <main className="dashboard-shell">
        <div className="dashboard-inner page-inner">
          <header className="page-header">
            <div>
              <p className="step-eyebrow">Step 1 · Regular Application Section Head</p>
              <h1 className="page-title">Request to Remove Block</h1>
            </div>
            <Badge className="badge--awaiting">Applicant: Awaiting Reapplication</Badge>
          </header>

          <div className="status-banner status-banner--warning">
            <img
              className="ui-icon"
              src="/appeal-conclusion/warning-triangle.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <div className="status-banner__body">
              This request goes to the Regular Application Director for approval. The
              applicant stays blocked until the Director approves it.
            </div>
          </div>

          <section className="card">
            <h2 className="card__title">Applicant summary</h2>
            <div className="summary-box summary-box--flat">
              <div className="data-grid data-grid--3">
                <div>
                  <span className="field-label">Name</span>
                  <span className="field-value field-value--upper">{a.name}</span>
                </div>
                <div>
                  <span className="field-label">Emirates ID</span>
                  <span className="field-value">{a.emiratesId}</span>
                </div>
                <div>
                  <span className="field-label">SSP code</span>
                  <span className="field-value">{a.sspCode}</span>
                </div>
                <div>
                  <span className="field-label">Application number</span>
                  <span className="field-value">{a.appNumber}</span>
                </div>
                <div>
                  <span className="field-label">Block period</span>
                  <span className="field-value">
                    {a.blockStart} – {a.blockEnd}
                  </span>
                </div>
                <div>
                  <span className="field-label">Current status</span>
                  <Badge className="badge--awaiting">Awaiting Reapplication</Badge>
                </div>
              </div>
              <p className="summary-box__reason">
                <span className="field-label">Original block reason</span> {a.blockReason}.
              </p>
            </div>
          </section>

          <form className="request-form" onSubmit={onSubmit} noValidate>
            <section className="card">
              <label className={`form-field${reasonError ? " has-error" : ""}`}>
                <span className="form-field__label">
                  Reason for removal <span className="required">*</span>
                </span>
                <select
                  className="form-select"
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value as RemovalReasonKey);
                    if (e.target.value) setReasonError(false);
                  }}
                >
                  <option value="">Select a reason</option>
                  <option value="financial">Change in financial circumstances</option>
                  <option value="medical">Medical or humanitarian grounds</option>
                  <option value="error">Administrative error</option>
                </select>
                {reasonError && (
                  <p className="field-error">
                    <img
                      className="ui-icon"
                      src="/appeal-conclusion/warning-triangle.svg"
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                    Select a reason for removal before submitting.
                  </p>
                )}
              </label>
              <label className="form-field">
                <span className="form-field__label">
                  Comments / justification <span className="optional">(Optional)</span>
                </span>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Add any details the Director should know."
                  value={comments.value}
                  onChange={(e) => comments.onChange(e.target.value)}
                />
                <span className="char-count">
                  {comments.count} / {comments.max}
                </span>
              </label>
              <div className="form-field">
                <span className="form-field__label">
                  Supporting documents <span className="optional">(Optional)</span>
                </span>
                <div className="upload-zone upload-zone--dashed" tabIndex={0} role="button">
                  <img
                    className="ui-icon upload-zone__icon"
                    src="/application-conclusion/650a3.svg"
                    alt=""
                    width={28}
                    height={28}
                    aria-hidden="true"
                  />
                  <span>
                    <span className="upload-zone__link">Upload files</span> or drag them here ·
                    PDF, JPG, PNG up to 5 MB
                  </span>
                </div>
              </div>
            </section>

            <div className="form-actions form-actions--end page-footer-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/section-head")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Submit for Approval
              </button>
            </div>
          </form>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}