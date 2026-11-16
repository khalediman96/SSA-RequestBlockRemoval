import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { useCharCount } from "@/hooks/useCharCount";
import { formatApplicantDisplayName } from "@/lib/formatApplicantName";
import type { ApplicantRecord } from "@/types/workflow";

type AssessorNavTab = "details" | "family" | "income" | "supporting";

const NAV: { id: AssessorNavTab; label: string }[] = [
  { id: "details", label: "Applicant Details" },
  { id: "family", label: "Family Members" },
  { id: "income", label: "Income verification" },
  { id: "supporting", label: "Supporting documents" },
];

const PANEL_TITLE: Record<AssessorNavTab, string> = {
  details: "Applicant Details",
  family: "Family Members",
  income: "Income verification",
  supporting: "Documents",
};

const SUPPORTING_DOCS: { title: string; icon: "pdf" | "word" | "image" }[] = [
  { title: "Water and Electricity Bill", icon: "pdf" },
  { title: "Wealth declaration doc..", icon: "word" },
  { title: "Proof of HOH Income doc...", icon: "pdf" },
  { title: "Salary Certificate", icon: "pdf" },
  { title: "Family Consent", icon: "word" },
  { title: "Bank Statement", icon: "image" },
];

const APPLICANT_AVATAR: Record<ApplicantRecord["gender"], string> = {
  female: "/Adult-Female-Emirati.svg",
  male: "/Adult-Male-Emirati.svg",
};

export function AssessorAssessmentWorkspace({ applicant }: { applicant: ApplicantRecord }) {
  const [tab, setTab] = useState<AssessorNavTab>("supporting");
  const [docsOpen, setDocsOpen] = useState(true);
  const notes = useCharCount(1000);
  const showUpload = tab === "supporting";

  return (
    <section className="assessor-workspace" aria-label="Eligibility assessment workspace">
      <div className="assessor-workspace__shell">
        <nav className="assessor-workspace__nav" aria-label="Assessment sections">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`assessor-workspace__nav-item${tab === item.id ? " assessor-workspace__nav-item--active" : ""}`}
              aria-current={tab === item.id ? "page" : undefined}
              onClick={() => setTab(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="assessor-workspace__quick-links">
            <span className="assessor-workspace__quick-links-label">Quick links</span>
            <button type="button" className="assessor-workspace__quick-link">
              <img src="/application-conclusion/545b3.svg" alt="" width={16} height={16} aria-hidden="true" />
              Event Logs
            </button>
            <button type="button" className="assessor-workspace__quick-link">
              <img src="/application-conclusion/53e6a.svg" alt="" width={16} height={16} aria-hidden="true" />
              Previous Benefit Requests
            </button>
          </div>
        </nav>

        <div className="assessor-workspace__main">
          <div className="assessor-workspace__main-head">
            <div className="assessor-workspace__main-title-row">
              {tab === "supporting" ? (
                <img
                  className="assessor-workspace__bankfiles-icon"
                  src="/bankfiles.svg"
                  alt=""
                  width={48}
                  height={48}
                />
              ) : (
                <span className="assessor-workspace__panel-icon" aria-hidden="true">
                  <img src="/application-review/47648.svg" alt="" width={28} height={28} />
                </span>
              )}
              <h2 className="assessor-workspace__panel-title">{PANEL_TITLE[tab]}</h2>
            </div>
            {showUpload ? (
              <button type="button" className="assessor-workspace__upload-btn">
                Upload Document
              </button>
            ) : null}
          </div>

          {tab === "supporting" ? (
            <SupportingDocumentsPanel
              applicant={applicant}
              open={docsOpen}
              onToggle={() => setDocsOpen((v) => !v)}
            />
          ) : (
            <div className="assessor-workspace__panel">
              {tab === "details" ? <ApplicantDetailsPanel applicant={applicant} /> : null}
              {tab === "family" ? <FamilyPanel applicant={applicant} /> : null}
              {tab === "income" ? (
                <>
                  <IncomePanel />
                  <AssessmentNotes notes={notes.value} onNotes={notes.onChange} />
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SupportingDocumentsPanel({
  applicant,
  open,
  onToggle,
}: {
  applicant: ApplicantRecord;
  open: boolean;
  onToggle: () => void;
}) {
  const displayName = formatApplicantDisplayName(applicant.name);
  const mid = Math.ceil(SUPPORTING_DOCS.length / 2);
  const leftCol = SUPPORTING_DOCS.slice(0, mid);
  const rightCol = SUPPORTING_DOCS.slice(mid);

  return (
    <div className="assessor-workspace__doc-panel">
      <button type="button" className="assessor-workspace__doc-applicant-row" onClick={onToggle}>
        <span className="assessor-workspace__doc-applicant">
          <img
            className="assessor-workspace__doc-applicant-avatar"
            src={APPLICANT_AVATAR[applicant.gender]}
            alt=""
            width={31}
            height={31}
          />
          <span className="assessor-workspace__doc-applicant-name">{displayName}</span>
        </span>
        <img
          className={`assessor-workspace__doc-chevron${open ? "" : " assessor-workspace__doc-chevron--collapsed"}`}
          src="/hugeicons/arrow-down-01-solid.svg"
          alt=""
          width={24}
          height={16}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="assessor-workspace__doc-columns">
          <div className="assessor-workspace__doc-column">
            {leftCol.map((doc) => (
              <DocumentCard key={doc.title} title={doc.title} icon={doc.icon} />
            ))}
          </div>
          <div className="assessor-workspace__doc-column">
            {rightCol.map((doc) => (
              <DocumentCard key={doc.title} title={doc.title} icon={doc.icon} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function DocumentCard({ title, icon }: { title: string; icon: "pdf" | "word" | "image" }) {
  return (
    <div className="assessor-workspace__doc-card">
      <div className="assessor-workspace__doc-card-main">
        <span className={`assessor-workspace__doc-file-icon assessor-workspace__doc-file-icon--${icon}`}>
          {icon === "pdf" ? (
            <img src="/PDF-40.svg" alt="" width={24} height={24} />
          ) : icon === "word" ? (
            <span className="assessor-workspace__doc-file-word" aria-hidden="true">
              DOC
            </span>
          ) : (
            <span className="assessor-workspace__doc-file-image" aria-hidden="true" />
          )}
        </span>
        <div className="assessor-workspace__doc-card-copy">
          <span className="assessor-workspace__doc-card-title">{title}</span>
          <span className="assessor-workspace__doc-chip">Latest Version</span>
        </div>
      </div>
      <ul className="assessor-workspace__doc-actions" aria-label={`Actions for ${title}`}>
        <li>
          <button type="button" className="assessor-workspace__doc-action" aria-label="View">
            <DocActionEye />
          </button>
        </li>
        <li>
          <button type="button" className="assessor-workspace__doc-action" aria-label="Download">
            <img src="/application-review/da907.svg" alt="" width={15} height={15} />
          </button>
        </li>
        <li>
          <button type="button" className="assessor-workspace__doc-action" aria-label="Refresh versions">
            <img src="/application-review/9f91d.svg" alt="" width={15} height={15} />
          </button>
        </li>
      </ul>
    </div>
  );
}

function DocActionEye() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12C2 12 5.5 6 12 6C18.5 6 22 12 22 12C22 12 18.5 18 12 18C5.5 18 2 12 2 12Z"
        stroke="#53442F"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="#53442F" strokeWidth="1.5" />
    </svg>
  );
}

function ApplicantDetailsPanel({ applicant }: { applicant: ApplicantRecord }) {
  return (
    <div className="assessor-workspace__details-grid">
      <DetailField label="Name" value={formatApplicantDisplayName(applicant.name)} upper />
      <DetailField label="Emirates ID" value={applicant.emiratesId} />
      <DetailField label="SSP code" value={applicant.sspCode} />
      <DetailField label="Application number" value={applicant.appNumber} />
      <DetailField label="Date of birth" value="14/03/1996" />
      <DetailField label="Gender" value={applicant.gender === "female" ? "Female" : "Male"} />
      <DetailField label="Marital status" value="Married" />
      <DetailField label="Nationality" value="United Arab Emirates" />
      <DetailField label="Block removed on" value={applicant.blockStart} />
      <div className="assessor-workspace__detail-span">
        <span className="assessor-workspace__detail-label">Employment</span>
        <p className="assessor-workspace__detail-value">Unemployed since 01/08/2025.</p>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  upper,
}: {
  label: string;
  value: string;
  upper?: boolean;
}) {
  return (
    <div>
      <span className="assessor-workspace__detail-label">{label}</span>
      <span
        className={`assessor-workspace__detail-value${upper ? " assessor-workspace__detail-value--upper" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

function FamilyPanel({ applicant }: { applicant: ApplicantRecord }) {
  return (
    <>
      <p className="assessor-workspace__hint">
        Household size for assessment: <strong>4</strong> (applicant + 3 dependents)
      </p>
      <table className="assessor-table assessor-workspace__table">
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
            <td className="field-value--upper">{applicant.name}</td>
            <td>Applicant</td>
            <td>{applicant.emiratesId}</td>
            <td>30</td>
          </tr>
          <tr>
            <td className="field-value--upper">Fatma Rashed Saeed Al Dhaheri</td>
            <td>Spouse</td>
            <td>784-1998-0000033-8</td>
            <td>28</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

function IncomePanel() {
  return (
    <table className="assessor-table assessor-workspace__table">
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
  );
}

function AssessmentNotes({
  notes,
  onNotes,
}: {
  notes: string;
  onNotes: (value: string) => void;
}) {
  return (
    <div className="assessor-workspace__notes">
      <label className="assessor-workspace__notes-label" htmlFor="assessor-assessment-notes">
        Assessor notes
      </label>
      <textarea
        id="assessor-assessment-notes"
        className="assessor-workspace__notes-input"
        rows={4}
        value={notes}
        onChange={(e) => onNotes(e.target.value)}
        placeholder="Add assessment notes…"
      />
    </div>
  );
}