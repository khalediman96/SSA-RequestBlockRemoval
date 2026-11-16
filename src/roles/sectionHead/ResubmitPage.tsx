import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompactTopNav } from "@/components/layout/CoordinatorNav";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { RoleLayoutHeader } from "@/components/layout/RoleLayoutHeader";
import { Badge } from "@/components/ui/Badge";
import { PEOPLE, userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { DEMO_APPLICANT, useWorkflow } from "@/context/WorkflowContext";

export function ResubmitPage() {
  const navigate = useNavigate();
  const { resubmit } = useWorkflow();
  const { getApplicantById } = useApplicants();
  const storedAhmed = getApplicantById("ahmed");
  const directorSendBackQuote =
    storedAhmed?.returnedRequest?.directorFeedbackQuote ??
    "Please attach proof of the change in income.";
  const [historyOpen, setHistoryOpen] = useState(false);
  const a = DEMO_APPLICANT;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    resubmit("ahmed", "financial", "");
  };

  return (
    <div className="app-shell">
      <CompactTopNav />
      <RoleLayoutHeader
        userLabel={userPillLabel("sectionHead", "Section Head")}
        breadcrumb={
          <nav className="breadcrumb">
            <a href="#">Awaiting Reapplication</a> / RBR-2026-00412
          </nav>
        }
      />
      <main className="dashboard-shell">
        <div className="dashboard-inner page-inner">
          <header className="page-header">
            <div>
              <p className="step-eyebrow">Step 2b · Regular Application Section Head</p>
              <h1 className="page-title">Update &amp; resubmit request</h1>
            </div>
            <Badge className="badge--returned">Returned for More Information</Badge>
          </header>

          <div className="status-banner status-banner--info status-banner--director">
            <div className="status-banner__head">
              <strong>Director comments</strong>
              <span className="status-banner__meta">{PEOPLE.director} · 09/11/2026 14:10</span>
            </div>
            <p className="status-banner__quote">“{directorSendBackQuote}”</p>
          </div>

          <section className="card card--compact">
            <div className="data-grid data-grid--3">
              <div>
                <span className="field-label">Applicant</span>
                <span className="field-value field-value--upper">{a.name}</span>
              </div>
              <div>
                <span className="field-label">Emirates ID</span>
                <span className="field-value">{a.emiratesId}</span>
              </div>
              <div>
                <span className="field-label">Applicant status</span>
                <Badge className="badge--blocked">Still blocked</Badge>
              </div>
            </div>
          </section>

          <form className="resubmit-form" onSubmit={onSubmit}>
            <label className="form-field">
              <span className="form-field__label">
                Reason for removal <span className="required">*</span>
              </span>
              <select className="form-select" defaultValue="financial">
                <option value="financial">Change in financial circumstances</option>
                <option value="medical">Medical or humanitarian grounds</option>
                <option value="error">Administrative error</option>
              </select>
            </label>
            <label className="form-field">
              <span className="form-field__label">Response to Director</span>
              <textarea
                className="form-textarea"
                rows={4}
                defaultValue="Added the salary certificate and termination letter."
              />
            </label>
            <div className="form-field">
              <span className="form-field__label">Supporting documents</span>
              <div className="file-chips file-chips--removable">
                <span className="file-chip">
                  <img
                    className="ui-icon"
                    src="/application-conclusion/7cef0.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                  salary_certificate.pdf
                </span>
                <span className="file-chip">
                  <img
                    className="ui-icon"
                    src="/application-conclusion/7cef0.svg"
                    alt=""
                    width={14}
                    height={14}
                    aria-hidden="true"
                  />
                  termination_letter.pdf
                </span>
              </div>
            </div>

            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={historyOpen}
              onClick={() => setHistoryOpen((v) => !v)}
            >
              <span className="accordion-trigger__chevron">›</span> Request history (2)
            </button>
            {historyOpen && (
              <div className="accordion-panel" id="resubmit-history">
                <ul className="accordion-panel__list">
                  <li>Sent back for more information — {PEOPLE.director}, 09/11/2026</li>
                  <li>Request submitted — {PEOPLE.sectionHead}, 08/11/2026</li>
                </ul>
              </div>
            )}

            <div className="form-actions form-actions--end">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => navigate("/section-head")}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Resubmit for Approval
              </button>
            </div>
          </form>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}