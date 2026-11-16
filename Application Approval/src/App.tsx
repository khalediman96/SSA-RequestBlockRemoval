import { useState, type ReactNode } from "react";

const assets = "/assets";

type FieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
};

function Field({ label, children, className = "" }: FieldProps) {
  return (
    <div className={`field ${className}`}>
      <span className="field-label">{label}</span>
      <div className="field-value">{children}</div>
    </div>
  );
}

function StatusChip({
  children,
  tone = "green",
  struck = false,
}: {
  children: ReactNode;
  tone?: "green" | "blue" | "purple";
  struck?: boolean;
}) {
  return <span className={`status-chip ${tone} ${struck ? "struck" : ""}`}>{children}</span>;
}

const steps = [
  ["Request Submitted", "Section Head • 12 Nov 2026", "Done"],
  ["Director Review", "Approved • 13 Nov 2026", "Done"],
  ["Block Removed", "Status: Eligible to Reapply", "Completed"],
];

function Progress() {
  return (
    <div className="progress-card">
      {steps.map(([title, sub, status], index) => (
        <div className="progress-fragment" key={title}>
          <div className="step">
            <div className="step-check">
              <img src={`${assets}/c65eb.svg`} alt="" />
            </div>
            <strong>{title}</strong>
            <span>{sub}</span>
            <StatusChip>{status}</StatusChip>
          </div>
          {index < steps.length - 1 && <div className="connector" />}
        </div>
      ))}
    </div>
  );
}

function History({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <section className="history">
      <div className="history-head">
        <h2>Request history</h2>
        <button onClick={onToggle}>{open ? "Hide details" : "Show details"}</button>
      </div>
      {open && (
        <div className="history-list">
          <article className="history-item green-dot">
            <div className="history-copy">
              <strong>Directed Review</strong>
              <span>Salem Al Mansouri • Regular Application Section Head</span>
              <p>Reason: Medical or humanitarian grounds.</p>
              <em>
                Application status updated from <b>Awaiting Reapplication</b> to{" "}
                <b>Eligible to Reapply</b>
              </em>
            </div>
            <time>13 Nov 2026, 11:20 AM</time>
          </article>
          <article className="history-item gold-dot">
            <div className="history-copy">
              <strong>Request submitted</strong>
              <span>Ahmed Al Kaabi • Regular Application Section Head</span>
              <p>Reason: Medical or humanitarian grounds.</p>
              <em>
                "Applicant submitted medical report history and supporting salary certificate"
              </em>
            </div>
            <time>12 Nov 2026, 11:20 AM</time>
          </article>
        </div>
      )}
    </section>
  );
}

function SummaryCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`summary-card ${className}`}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function downloadFile(name: string) {
  const blob = new Blob(["Supporting document preview"], {
    type: "application/pdf",
  });
  const href = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = href;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(href);
}

function DocumentCard({ name }: { name: string }) {
  return (
    <div className="document-card">
      <div className="pdf-icon">
        <img src={`${assets}/f4ef9.svg`} alt="" />
      </div>
      <div className="document-name">
        <strong>{name}</strong>
        <span>500kb</span>
      </div>
      <button onClick={() => downloadFile(name)}>Download</button>
    </div>
  );
}

function Header({
  menu,
  setMenu,
}: {
  menu: string | null;
  setMenu: (value: string | null) => void;
}) {
  const portalItems = [
    "Social Support Applications",
    "Family Growth Applications",
    "Legal Cases",
    "Beneficiary Affairs",
    "Fund Recovery",
    "Follow Up Requests",
  ];
  return (
    <header>
      <div className="portal-strip">
        <div className="shell portal-items">
          {portalItems.map((item, index) => (
            <button className={index === 0 ? "active" : ""} key={item}>
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="shell brand-row">
        <img className="brand-logo" src={`${assets}/4e837.svg`} alt="SSA" />
        <button
          className="profile"
          aria-expanded={menu === "profile"}
          onClick={() => setMenu(menu === "profile" ? null : "profile")}
        >
          <img src={`${assets}/e2193.svg`} alt="" />
          <img className="chevron" src={`${assets}/56d42.svg`} alt="" />
          {menu === "profile" && <span className="dropdown profile-menu">Account settings</span>}
        </button>
      </div>
      <nav className="main-nav">
        <div className="shell nav-inner">
          <button>Home</button>
          <div className="nav-menu">
            <button onClick={() => setMenu(menu === "applications" ? null : "applications")}>
              Applications
              <img src={`${assets}/56d42.svg`} alt="" />
            </button>
            {menu === "applications" && <span className="dropdown">Application list</span>}
          </div>
          <div className="nav-menu selected">
            <button onClick={() => setMenu(menu === "controls" ? null : "controls")}>
              Application Controls
              <img src={`${assets}/56d42.svg`} alt="" />
            </button>
            {menu === "controls" && <span className="dropdown">Block removal requests</span>}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default function App() {
  const [historyOpen, setHistoryOpen] = useState(true);
  const [menu, setMenu] = useState<string | null>(null);
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState<"English" | "العربية">("English");
  const [message, setMessage] = useState("");

  const notify = (text: string) => {
    setMessage(text);
    window.setTimeout(() => setMessage(""), 2400);
  };

  return (
    <div className={dark ? "app dark" : "app"}>
      <Header menu={menu} setMenu={setMenu} />

      <main>
        <div className="shell page-heading">
          <div className="breadcrumbs">
            <img src={`${assets}/c5fde.svg`} alt="" />
            <img className="crumb-arrow" src={`${assets}/dc594.svg`} alt="" />
            <span>Applications</span>
            <img className="crumb-wide-arrow" src={`${assets}/4aec1.svg`} alt="" />
            <span className="muted">Applicant Details</span>
          </div>
          <div className="title-row">
            <button
              className="back"
              aria-label="Go back"
              onClick={() => notify("Returning to applications")}
            >
              <img src={`${assets}/26421.svg`} alt="" />
            </button>
            <h1>Hussain Mohamed</h1>
            <StatusChip tone="purple">Application No. SSP-1234</StatusChip>
          </div>
        </div>

        <div className="shell content-stack">
          <div className="approval-banner">
            <img src={`${assets}/b8949.svg`} alt="" />
            <p>
              Approved by Regular Application Director on 13/11/2026. Applicant removed from block
              list and is now Eligible to Reapply.
            </p>
          </div>

          <div className="workflow">
            <Progress />
            <History open={historyOpen} onToggle={() => setHistoryOpen(!historyOpen)} />
          </div>

          <SummaryCard title="Applicant Summary">
            <div className="summary-panel applicant-grid">
              <Field label="Applicant Name">Hussain Mohamed</Field>
              <Field label="Emirates ID">784-1996-0000005-3</Field>
              <Field label="Block Period">01/08/2026 - 13/11/2026</Field>
              <Field label="Previous Block Status">
                <StatusChip tone="blue" struck>
                  Awaiting Reapplication
                </StatusChip>
              </Field>
              <Field label="Current Status">
                <StatusChip>Eligible to Reapply</StatusChip>
              </Field>
              <Field label="Original Block Reason" className="wide">
                Rejected application – income above threshold.
              </Field>
            </div>
          </SummaryCard>

          <SummaryCard title="Removal Request Summary">
            <div className="summary-panel removal-panel">
              <div className="removal-grid">
                <Field label="Requested By">Ahmed Al Kaabi</Field>
                <Field label="Approved By">Salem Al Mansouri</Field>
                <Field label="Submission Date">12/11/2026</Field>
                <Field label="Approval Date">13/11/2026</Field>
                <Field label="Request Status">
                  <StatusChip>Approved</StatusChip>
                </Field>
                <Field label="Reason for Removal" className="wide">
                  Medical or humanitarian grounds.
                </Field>
              </div>
              <img className="summary-divider" src={`${assets}/fcfd4.svg`} alt="" />
              <Field label="Comment / Justification" className="comment">
                The Applicant has some Medical issues and has provided the supporting document that
                proves his claim.
              </Field>
            </div>
            <div className="documents">
              <span className="documents-label">Supporting documents (Optional)</span>
              <div className="document-grid">
                <DocumentCard name="Medical_Report.pdf" />
                <DocumentCard name="Salary_Certificate.pdf" />
              </div>
            </div>
          </SummaryCard>
        </div>
      </main>

      <div className="action-footer">
        <div className="shell action-inner">
          <button className="secondary" onClick={() => notify("Action cancelled")}>
            Cancel
          </button>
          <button className="primary" onClick={() => notify("Returning to application list")}>
            Back To List
          </button>
          <button
            className="fab"
            aria-label="More actions"
            onClick={() => notify("More actions opened")}
          >
            +
          </button>
        </div>
      </div>

      <footer className="shell site-footer">
        <div className="copyright">
          <img src={`${assets}/1f745.svg`} alt="" />
          <span>All rights reserved to Abu Dhabi Social Support Authority © 2024</span>
        </div>
        <div className="preferences">
          <div className="segmented">
            {(["English", "العربية"] as const).map((item) => (
              <button
                className={language === item ? "active" : ""}
                onClick={() => setLanguage(item)}
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="segmented">
            <button className={!dark ? "active" : ""} onClick={() => setDark(false)}>
              Light
            </button>
            <button className={dark ? "active" : ""} onClick={() => setDark(true)}>
              Dark
            </button>
          </div>
        </div>
      </footer>
      {message && (
        <div className="toast" role="status">
          {message}
        </div>
      )}
    </div>
  );
}
