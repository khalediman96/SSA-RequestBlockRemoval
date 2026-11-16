import { useState } from "react";
import { Link } from "react-router-dom";
import { CompactTopNav } from "@/components/layout/CoordinatorNav";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { RoleLayoutHeader } from "@/components/layout/RoleLayoutHeader";
import { Badge } from "@/components/ui/Badge";
import { PEOPLE, userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { DEMO_APPLICANT, useWorkflow } from "@/context/WorkflowContext";
import { useCharCount } from "@/hooks/useCharCount";

type Decision = "approve" | "reject" | "sendback" | "";

export function ReviewPage() {
  const { confirmDirectorDecision } = useWorkflow();
  const { getApplicantById } = useApplicants();
  const [decision, setDecision] = useState<Decision>("sendback");
  const [commentsError, setCommentsError] = useState(false);
  const comments = useCharCount(1000);
  const a = getApplicantById(DEMO_APPLICANT.id) ?? DEMO_APPLICANT;
  const submitted = a.submittedRequest;
  const requestedReasonLabel = submitted?.reasonLabel ?? "Change in financial circumstances.";
  const sectionHeadJustification = submitted?.comments ?? "—";

  const onConfirm = () => {
    if (!decision) return;
    const ok = confirmDirectorDecision(a.id, decision, comments.value);
    if (!ok) {
      setCommentsError(true);
      return;
    }
    setCommentsError(false);
  };

  return (
    <div className="app-shell">
      <CompactTopNav />
      <RoleLayoutHeader
        userLabel={userPillLabel("director", "Regular Application Director")}
        breadcrumb={
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="#">My approvals</a> / <a href="#">Remove Block requests</a> / RBR-2026-00412
          </nav>
        }
      />
      <main className="dashboard-shell">
        <div className="dashboard-inner page-inner director-layout">
          <header className="page-header">
            <div>
              <h1 className="page-title">Remove Block request · RBR-2026-00412</h1>
              <p className="page-subtitle">
                Requested by {PEOPLE.sectionHead} (Section Head) on 11/11/2026 09:42
              </p>
            </div>
            <Badge className="badge--pending-director">Pending Director Approval</Badge>
          </header>
          <p className="step-eyebrow step-eyebrow--inline">Step 2 · Regular Application Director</p>

          <div className="director-layout__grid">
            <div className="director-layout__main">
              <section className="card">
                <h2 className="card__title">Applicant</h2>
                <div className="data-grid data-grid--3">
                  <div>
                    <span className="field-label">Name</span>
                    <span className="field-value">{a.name}</span>
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
                    <span className="field-label">Current blocking status</span>
                    <Badge className="badge--awaiting">Awaiting Reapplication</Badge>
                  </div>
                  <div>
                    <span className="field-label">Block start / end</span>
                    <span className="field-value">
                      {a.blockStart} – {a.blockEnd}
                    </span>
                  </div>
                </div>
                <p className="card__footer-text">
                  <strong>Original block reason</strong> {a.blockReason}.
                </p>
              </section>

              <section className="card">
                <h2 className="card__title">Request</h2>
                <div className="data-grid data-grid--3">
                  <div>
                    <span className="field-label">Requested removal reason</span>
                    <span className="field-value">{requestedReasonLabel}</span>
                  </div>
                  <div>
                    <span className="field-label">Request date</span>
                    <span className="field-value">11/11/2026 09:42</span>
                  </div>
                  <div>
                    <span className="field-label">Requested by</span>
                    <span className="field-value">{PEOPLE.sectionHead}</span>
                  </div>
                </div>
                <div className="quote-box">
                  <span className="field-label">Section Head justification</span>
                  <p>{sectionHeadJustification}</p>
                </div>
              </section>

              <section className="card card--decision">
                <h2 className="card__title">Your decision</h2>
                <p className="card__hint">Comments are required to Reject or Send Back.</p>
                <div className="decision-cards" role="radiogroup" aria-label="Director decision">
                  {(
                    [
                      {
                        value: "approve" as const,
                        title: "Approve",
                        desc: "Remove block — move to Eligible to Reapply",
                      },
                      {
                        value: "reject" as const,
                        title: "Reject",
                        desc: "Block stays active",
                      },
                      {
                        value: "sendback" as const,
                        title: "Send Back for More Information",
                        desc: "Return to Section Head",
                      },
                    ] as const
                  ).map((opt) => (
                    <label
                      key={opt.value}
                      className={`decision-card${decision === opt.value ? " decision-card--selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="decision"
                        value={opt.value}
                        checked={decision === opt.value}
                        onChange={() => setDecision(opt.value)}
                      />
                      <span className="decision-card__title">{opt.title}</span>
                      <span className="decision-card__desc">{opt.desc}</span>
                    </label>
                  ))}
                </div>
                <label className={`form-field${commentsError ? " has-error" : ""}`}>
                  <span className="form-field__label">
                    Director comments <span className="required">*</span>
                  </span>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Explain what information is needed"
                    value={comments.value}
                    onChange={(e) => {
                      comments.onChange(e.target.value);
                      if (e.target.value.trim()) setCommentsError(false);
                    }}
                  />
                  {commentsError && (
                    <p className="field-error">
                      <img
                        className="ui-icon"
                        src="/appeal-conclusion/warning-triangle.svg"
                        alt=""
                        width={14}
                        height={14}
                        aria-hidden="true"
                      />
                      Comments are required to Reject or Send Back.
                    </p>
                  )}
                </label>
                <div className="form-actions">
                  <Link to="/" className="btn btn-outline">
                    Cancel
                  </Link>
                  <button type="button" className="btn btn-primary" onClick={onConfirm}>
                    Confirm decision
                  </button>
                </div>
              </section>
            </div>

            <aside className="card timeline-card">
              <h2 className="card__title">Request history</h2>
              <ol className="timeline">
                <li className="timeline__item timeline__item--gold">
                  <strong>Resubmitted for approval</strong>
                  <span className="timeline__meta">{PEOPLE.sectionHead}</span>
                  <p className="timeline__quote">
                    “Added the salary certificate and termination letter.”
                  </p>
                </li>
                <li className="timeline__item timeline__item--blue">
                  <strong>Sent back for more information</strong>
                  <span className="timeline__meta">{PEOPLE.director}</span>
                  <p className="timeline__quote">“Please attach proof of the change in income.”</p>
                </li>
                <li className="timeline__item timeline__item--gold">
                  <strong>Request submitted</strong>
                  <span className="timeline__meta">{PEOPLE.sectionHead}</span>
                  <p>Reason: Change in financial circumstances</p>
                </li>
              </ol>
            </aside>
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}