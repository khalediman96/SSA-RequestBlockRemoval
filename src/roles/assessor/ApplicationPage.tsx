import { useState } from "react";
import { Link } from "react-router-dom";
import { CompactTopNav } from "@/components/layout/CoordinatorNav";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { RoleLayoutHeader } from "@/components/layout/RoleLayoutHeader";
import { Badge } from "@/components/ui/Badge";
import { PEOPLE, userPillLabel } from "@/constants/people";
import { DEMO_APPLICANT } from "@/context/WorkflowContext";
import { useCharCount } from "@/hooks/useCharCount";

type AssessorTab = "details" | "family" | "income" | "documents" | "assessment";

const TABS: { id: AssessorTab; label: string }[] = [
  { id: "details", label: "Applicant details" },
  { id: "family", label: "Family members" },
  { id: "income", label: "Income" },
  { id: "documents", label: "Documents" },
  { id: "assessment", label: "Assessment" },
];

export function ApplicationPage() {
  const [tab, setTab] = useState<AssessorTab>("details");
  const notes = useCharCount(1000);
  const a = DEMO_APPLICANT;

  return (
    <div className="app-shell">
      <CompactTopNav />
      <RoleLayoutHeader
        userLabel={userPillLabel("assessor", "Assessor")}
        breadcrumb={
          <nav className="breadcrumb">
            <a href="#">My assessments</a> / APP-2026-031557
          </nav>
        }
      />
      <main className="dashboard-shell">
        <div className="dashboard-inner page-inner">
          <header className="page-header">
            <div>
              <p className="step-eyebrow">Step 3 · Assessor</p>
              <h1 className="page-title">Application APP-2026-031557</h1>
            </div>
            <Badge className="badge--success">Eligible to Reapply</Badge>
          </header>

          <div className="status-banner status-banner--info status-banner--bilingual">
            <img
              className="ui-icon status-banner__icon"
              src="/application-review/a2b64.svg"
              alt=""
              width={18}
              height={18}
              aria-hidden="true"
            />
            <p>
              This applicant was removed from the Reapplication Block List based on a request
              submitted by <strong>{PEOPLE.sectionHead}</strong> and approved by{" "}
              <strong>{PEOPLE.director}</strong>.
            </p>
            <p className="status-banner__ar" dir="rtl" lang="ar">
              تمت إزالة مقدم الطلب من قائمة حظر إعادة التقديم بناءً على طلب مقدم من{" "}
              <strong>أحمد الكعبي</strong> وبعد اعتماده من قبل مدير الطلبات العادية.
            </p>
            <Link to="/director/review" className="status-banner__link">
              View removal request RBR-2026-00412
            </Link>
          </div>

          <nav className="tabs" role="tablist" aria-label="Application sections">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                className={`tabs__tab${tab === t.id ? " tabs__tab--active" : ""}`}
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="assessor-tab-panels">
            {tab === "details" && (
              <section className="tab-panel card" role="tabpanel">
                <h2 className="card__title">Applicant details</h2>
                <div className="data-grid data-grid--4">
                  <div>
                    <span className="field-label">Name</span>
                    <span className="field-value field-value--upper">{a.name}</span>
                  </div>
                  <div>
                    <span className="field-label">Name (Arabic)</span>
                    <span className="field-value" dir="rtl" lang="ar">
                      حماد عتيق سعيد عبيد البلوشي
                    </span>
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
                    <span className="field-label">Previous application</span>
                    <span className="field-value">{a.appNumber}</span>
                  </div>
                  <StandardFields />
                </div>
                <p className="summary-box__reason">
                  <span className="field-label">Employment</span> Unemployed since 01/08/2025.
                </p>
              </section>
            )}
            {tab === "family" && <FamilyPanel />}
            {tab === "income" && <IncomePanel />}
            {tab === "documents" && <DocumentsPanel />}
            {tab === "assessment" && (
              <AssessmentPanel notes={notes.value} onNotes={notes.onChange} />
            )}
          </div>

          <div className="form-actions form-actions--end page-footer-actions assessor-footer-actions">
            <button type="button" className="btn btn-outline btn-lg">
              Save draft
            </button>
            <button type="button" className="btn btn-primary btn-lg">
              Submit assessment
            </button>
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}

function StandardFields() {
  return (
    <>
      <div>
        <span className="field-label">Date of birth</span>
        <span className="field-value">14/03/1996</span>
      </div>
      <div>
        <span className="field-label">Gender</span>
        <span className="field-value">Male</span>
      </div>
      <div>
        <span className="field-label">Marital status</span>
        <span className="field-value">Married</span>
      </div>
      <div>
        <span className="field-label">Nationality</span>
        <span className="field-value">United Arab Emirates</span>
      </div>
      <div>
        <span className="field-label">Submitted</span>
        <span className="field-value">12/11/2026 10:15</span>
      </div>
      <div>
        <span className="field-label">Block removed on</span>
        <span className="field-value">11/11/2026</span>
      </div>
    </>
  );
}

function FamilyPanel() {
  return (
    <section className="tab-panel card" role="tabpanel">
      <h2 className="card__title">Family members</h2>
      <p className="card__hint">
        Household size for assessment: <strong>4</strong> (applicant + 3 dependents)
      </p>
      <table className="assessor-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Relationship</th>
            <th scope="col">Emirates ID</th>
            <th scope="col">Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="field-value--upper">HAMAD ATEEQ SAEED OBAID ALBLOOSHI</td>
            <td>Applicant</td>
            <td>784-1996-0000005-3</td>
            <td>30</td>
          </tr>
          <tr>
            <td className="field-value--upper">FATMA RASHED SAEED AL DHAHERI</td>
            <td>Spouse</td>
            <td>784-1998-0000033-8</td>
            <td>28</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function IncomePanel() {
  return (
    <section className="tab-panel card" role="tabpanel">
      <h2 className="card__title">Income &amp; wealth</h2>
      <table className="assessor-table">
        <thead>
          <tr>
            <th scope="col">Source</th>
            <th scope="col">Amount (AED)</th>
            <th scope="col">Verified</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Spouse salary</td>
            <td className="assessor-amount">6,500</td>
            <td>
              <Badge className="badge--success">Verified</Badge>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function DocumentsPanel() {
  return (
    <section className="tab-panel card" role="tabpanel">
      <h2 className="card__title">Documents</h2>
      <table className="assessor-table">
        <tbody>
          <tr>
            <td>Termination letter — applicant</td>
            <td>
              <Badge className="badge--pending">Under review</Badge>
            </td>
          </tr>
          <tr>
            <td>Remove Block supporting pack (RBR-2026-00412)</td>
            <td>
              <Link to="/director/review" className="btn btn-outline btn-sm">
                View request
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}

function AssessmentPanel({
  notes,
  onNotes,
}: {
  notes: string;
  onNotes: (v: string) => void;
}) {
  return (
    <section className="tab-panel card" role="tabpanel">
      <h2 className="card__title">Assessment</h2>
      <ul className="assessor-checklist">
        <li>
          <label className="assessor-check">
            <input type="checkbox" defaultChecked disabled /> Identity verified
          </label>
        </li>
      </ul>
      <label className="form-field">
        <span className="form-field__label">Assessor notes</span>
        <textarea
          className="form-textarea"
          rows={4}
          value={notes}
          onChange={(e) => onNotes(e.target.value)}
        />
      </label>
    </section>
  );
}