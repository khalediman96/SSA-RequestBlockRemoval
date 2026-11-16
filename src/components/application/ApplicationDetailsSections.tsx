import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { formatApplicantDisplayName } from "@/lib/formatApplicantName";
import type { ApplicantRecord, WorkflowHistoryEvent } from "@/types/workflow";

export type WorkflowPhase =
  | "draft"
  | "submitted"
  | "directorActive"
  | "complete"
  | "returned"
  | "rejected"
  | "directorSentBack";

type StepVisualState =
  | "active"
  | "complete"
  | "idle"
  | "rmiActive"
  | "returnedReview"
  | "directorRejected";

type TitleRowProps = {
  backHref: string;
  applicant: ApplicantRecord;
  showEligibleChip?: boolean;
  /** Assessor details use the new application number (APP-*). */
  applicationNumberField?: "sspCode" | "appNumber";
};

export function ApplicationDetailsTitleRow({
  backHref,
  applicant,
  showEligibleChip = false,
  applicationNumberField = "sspCode",
}: TitleRowProps) {
  const applicationNo =
    applicationNumberField === "appNumber" ? applicant.appNumber : applicant.sspCode;
  return (
    <header className="app-details__title-row">
      <Link to={backHref} className="app-details__back" aria-label="Back to list">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M10 7L5 12L10 17"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </Link>
      <h1 className="app-details__title">{formatApplicantDisplayName(applicant.name)}</h1>
      {showEligibleChip ? (
        <span className="app-details__title-chip app-details__title-chip--eligible">
          Eligible to Reapply
        </span>
      ) : null}
      <span className="app-details__title-chip app-details__title-chip--app-number">
        Application no. <strong>{applicationNo}</strong>
      </span>
    </header>
  );
}

export function ApplicationDetailsSubmittedBanner() {
  return (
    <div className="app-details__submitted-banner" role="status">
      <img src="/app-details-warning.svg" alt="" width={24} height={24} className="app-details__submitted-banner-icon" />
      <p>
        This request was successfully submitted to the application Director and is pending their
        decision.
      </p>
    </div>
  );
}

export function ApplicationDetailsDirectorPendingBanner() {
  return (
    <div className="app-details__submitted-banner" role="status">
      <img src="/app-details-warning.svg" alt="" width={24} height={24} className="app-details__submitted-banner-icon" />
      <p>This request is pending your approval</p>
    </div>
  );
}

export function ApplicationDetailsInfoBanner() {
  return (
    <div className="app-details__info-banner" role="status">
      <svg className="app-details__info-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#4386CD" strokeWidth="1.5" />
        <path d="M12 8V13" stroke="#4386CD" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.75" fill="#4386CD" />
      </svg>
      <p>
        This request goes to the Regular Application Director for approval. The applicant stays
        blocked until the Director approves it.
      </p>
    </div>
  );
}

export function ApplicationDetailsDirectorCommentsInfoBanner({
  quote,
  directorName,
  meta,
}: {
  quote: string;
  directorName: string;
  meta?: string;
}) {
  const trimmed = quote.trim();
  if (!trimmed) return null;

  return (
    <div className="app-details__info-banner app-details__info-banner--director" role="status">
      <svg className="app-details__info-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#4386CD" strokeWidth="1.5" />
        <path d="M12 8V13" stroke="#4386CD" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="16.5" r="0.75" fill="#4386CD" />
      </svg>
      <div className="app-details__info-banner-copy">
        <p className="app-details__info-banner-head">
          <strong>Director comments</strong>
          {meta ? <span className="app-details__info-banner-meta">{meta}</span> : null}
          {!meta && directorName ? (
            <span className="app-details__info-banner-meta">{directorName}</span>
          ) : null}
        </p>
        <p className="app-details__info-banner-quote">&ldquo;{trimmed}&rdquo;</p>
      </div>
    </div>
  );
}

type StepCopy = { title: string; sub: string };

const DRAFT_STEPS: StepCopy[] = [
  { title: "Request Removal", sub: "Section Head" },
  { title: "Director Review", sub: "Application Director" },
  { title: "Final Decision", sub: "Outcome" },
];

type WorkflowStepOptions = {
  submittedStepSub?: string;
  directorWorkflowSub?: string;
};

function stepsForPhase(phase: WorkflowPhase, options?: WorkflowStepOptions): StepCopy[] {
  if (phase === "draft") return DRAFT_STEPS;
  if (phase === "returned") {
    return [
      { title: "Update & Resubmit", sub: "Section Head • Action Required" },
      {
        title: "Director Review",
        sub: options?.directorWorkflowSub ?? "Regular Application Director",
      },
      { title: "Final Decision", sub: "Outcome" },
    ];
  }
  if (phase === "rejected") {
    return [
      {
        title: "Request Submitted",
        sub: options?.submittedStepSub ?? "Section Head • 12 Nov 2026",
      },
      {
        title: "Director Review",
        sub: options?.directorWorkflowSub ?? "Regular Application Director",
      },
      { title: "Block Removal Closed", sub: "Applicant Remains Blocked" },
    ];
  }
  if (phase === "directorSentBack") {
    return [
      {
        title: "Request Submitted",
        sub: options?.submittedStepSub ?? "Section Head • 12 Nov 2026",
      },
      {
        title: "Director Review",
        sub: options?.directorWorkflowSub ?? "Regular Application Director",
      },
      { title: "Final Decision", sub: "Outcome" },
    ];
  }
  if (phase === "complete") {
    return [
      { title: "Request Submitted", sub: options?.submittedStepSub ?? "Section Head • 12 Nov 2026" },
      {
        title: "Director Review",
        sub: options?.directorWorkflowSub ?? "Approved • 13 Nov 2026",
      },
      { title: "Block Removed", sub: "Eligible to Reapply" },
    ];
  }
  return [
    { title: "Request Submitted", sub: options?.submittedStepSub ?? "Section Head" },
    { title: "Director Review", sub: "Regular Application Director" },
    { title: "Final Decision", sub: "Outcome" },
  ];
}

function stepState(phase: WorkflowPhase, index: number): StepVisualState {
  if (phase === "returned") {
    if (index === 0) return "rmiActive";
    if (index === 1) return "returnedReview";
    return "idle";
  }
  if (phase === "rejected") {
    if (index === 0) return "complete";
    if (index === 1) return "directorRejected";
    return "idle";
  }
  if (phase === "directorSentBack") {
    if (index <= 1) return "complete";
    return "idle";
  }
  if (phase === "complete") return "complete";
  const activeIndex =
    phase === "draft" ? 0 : phase === "submitted" || phase === "directorActive" ? 1 : 2;
  if (index < activeIndex) return "complete";
  if (index === activeIndex) return "active";
  return "idle";
}

function chipForState(state: StepVisualState, index: number, phase: WorkflowPhase) {
  if (phase === "returned") {
    if (index === 0) return "RMI";
    if (index === 1) return "Returned";
    return "on Hold";
  }
  if (phase === "rejected") {
    if (index === 0) return "Done";
    if (index === 1) return "Rejected";
    return "Not Approved";
  }
  if (phase === "directorSentBack") {
    if (index === 0) return "Done";
    if (index === 1) return "Returned";
    return "Awaiting";
  }
  if (phase === "complete") {
    return index === 2 ? "Completed" : "Done";
  }
  const submittedFlow = phase !== "draft";
  if (state === "complete") return submittedFlow && index === 0 ? "Done" : "Completed";
  if (state === "idle") return "Awaiting";
  if (index === 0) return "In Progress";
  if (index === 1 && (phase === "submitted" || phase === "directorActive")) return "Pending";
  return "In Progress";
}

function connectorClass(before: StepVisualState, after: StepVisualState) {
  if (before === "rmiActive" && after === "returnedReview") {
    return " app-details__step-connector--rmi";
  }
  if (before === "directorRejected" && after === "idle") {
    return " app-details__step-connector--rmi";
  }
  if (before === "complete" && after === "complete") return " app-details__step-connector--complete";
  if (before === "complete" && after === "active") return " app-details__step-connector--complete";
  if (before === "active" && after === "idle") return " app-details__step-connector--progress";
  if (before === "complete" && after === "idle") return " app-details__step-connector--progress";
  if (before === "returnedReview" && after === "idle") return " app-details__step-connector--idle";
  return " app-details__step-connector--idle";
}

type WorkflowProps = {
  phase: WorkflowPhase;
  submittedStepSub?: string;
  directorWorkflowSub?: string;
  historyEvents?: WorkflowHistoryEvent[];
};

export function ApplicationDetailsWorkflow({
  phase,
  submittedStepSub,
  directorWorkflowSub,
  historyEvents,
}: WorkflowProps) {
  const [historyOpen, setHistoryOpen] = useState(
    phase === "returned" || phase === "rejected" || phase === "directorSentBack",
  );
  const steps = stepsForPhase(phase, { submittedStepSub, directorWorkflowSub });
  const states = steps.map((_, i) => stepState(phase, i));
  const showHistory = phase !== "draft" && Boolean(historyEvents?.length);

  return (
    <section className="app-details__workflow" aria-label="Approval workflow">
      <div className="app-details__workflow-grid">
        {steps.map((step, i) => {
          const col = i * 2 + 1;
          const state = states[i];
          return (
            <WorkflowStepCells
              key={`${step.title}-${i}`}
              step={i + 1}
              title={step.title}
              sub={step.sub}
              chip={chipForState(state, i, phase)}
              state={state}
              phase={phase}
              column={col}
              connectorBefore={
                i > 0 ? (
                  <div
                    className={`app-details__step-connector${connectorClass(states[i - 1], state)}`}
                    style={{ gridColumn: col - 1, gridRow: 1 }}
                    aria-hidden="true"
                  />
                ) : null
              }
            />
          );
        })}
      </div>
      {showHistory && historyEvents ? (
        <WorkflowHistoryPanel
          events={historyEvents}
          open={historyOpen}
          onToggle={() => setHistoryOpen((value) => !value)}
        />
      ) : null}
    </section>
  );
}

function WorkflowHistoryPanel({
  events,
  open,
  onToggle,
}: {
  events: WorkflowHistoryEvent[];
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`app-details__workflow-history${open ? " app-details__workflow-history--open" : ""}`}>
      <div className="app-details__workflow-history-head">
        <h2 className="app-details__workflow-history-title">Request history</h2>
        <button
          type="button"
          className="app-details__workflow-history-toggle"
          onClick={onToggle}
          aria-expanded={open}
        >
          {open ? "Hide details" : "Show details"}
        </button>
      </div>
      {open ? (
        <div className="app-details__workflow-history-body">
          <ul className="app-details__history-timeline">
            {events.map((event, index) => (
              <li
                key={`${event.title}-${index}`}
                className={`app-details__history-item${
                  event.dotVariant === "green"
                    ? " app-details__history-item--green-dot"
                    : event.dotVariant === "gold"
                      ? " app-details__history-item--gold-dot"
                      : event.dotVariant === "red"
                        ? " app-details__history-item--red-dot"
                        : ""
                }`}
              >
                <span className="app-details__history-dot" aria-hidden="true" />
                <div className="app-details__history-item-main">
                  <div className="app-details__history-item-top">
                    <span className="app-details__history-event-title">{event.title}</span>
                    <time className="app-details__history-datetime" dateTime={event.dateTime}>
                      {event.dateTime}
                    </time>
                  </div>
                  <p className="app-details__history-actor">
                    <span>{event.actor}</span>
                    <span className="app-details__history-actor-sep"> • </span>
                    <span className="app-details__history-actor-role">{event.actorRole}</span>
                  </p>
                  {event.reasonLine ? (
                    <p className="app-details__history-reason">{event.reasonLine}</p>
                  ) : null}
                  {event.statusTransition ? (
                    <p className="app-details__history-outcome">
                      Application status updated from{" "}
                      <strong>{event.statusTransition.from}</strong> to{" "}
                      <strong>{event.statusTransition.to}</strong>
                    </p>
                  ) : null}
                  {event.comment ? (
                    <p className="app-details__history-comment">&ldquo;{event.comment}&rdquo;</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function WorkflowStepCells({
  step,
  title,
  sub,
  chip,
  state,
  phase,
  column,
  connectorBefore,
}: {
  step: number;
  title: string;
  sub: string;
  chip: string;
  state: StepVisualState;
  phase: WorkflowPhase;
  column: number;
  connectorBefore: ReactNode;
}) {
  const circleClass =
    state === "rmiActive"
      ? "app-details__step-circle app-details__step-circle--rmi"
      : state === "returnedReview"
        ? "app-details__step-circle app-details__step-circle--returned-review"
        : state === "directorRejected"
          ? "app-details__step-circle app-details__step-circle--director-rejected"
          : state === "active"
          ? "app-details__step-circle app-details__step-circle--active"
          : state === "complete"
            ? "app-details__step-circle app-details__step-circle--complete"
            : "app-details__step-circle app-details__step-circle--idle";

  const chipDone =
    phase === "rejected" && step === 1 && state === "complete"
      ? true
      : phase === "complete"
        ? step <= 2
        : phase !== "draft" && state === "complete" && step === 1;
  const chipClass =
    phase === "returned" && state === "rmiActive"
      ? "app-details__step-chip app-details__step-chip--rmi"
      : phase === "returned" && state === "returnedReview"
        ? "app-details__step-chip app-details__step-chip--returned"
        : phase === "rejected" && state === "directorRejected"
          ? "app-details__step-chip app-details__step-chip--rmi"
          : phase === "complete" && step === 3
          ? "app-details__step-chip app-details__step-chip--complete"
          : chipDone
            ? "app-details__step-chip app-details__step-chip--done"
            : state === "active"
              ? "app-details__step-chip app-details__step-chip--active"
              : state === "complete"
                ? "app-details__step-chip app-details__step-chip--complete"
                : "app-details__step-chip app-details__step-chip--idle";

  const stepClass =
    state === "rmiActive"
      ? "app-details__step app-details__step--rmi"
      : state === "returnedReview"
        ? "app-details__step app-details__step--returned-review"
        : state === "directorRejected"
          ? "app-details__step app-details__step--rmi"
          : phase === "complete" || state === "complete"
          ? "app-details__step app-details__step--complete"
          : state === "idle"
            ? "app-details__step app-details__step--idle"
            : "app-details__step app-details__step--active";

  return (
    <>
      {connectorBefore}
      <div className="app-details__step-marker" style={{ gridColumn: column, gridRow: 1 }}>
        <div className={circleClass}>
          {state === "complete" ? (
            <span className="app-details__step-check" aria-hidden="true">
              ✓
            </span>
          ) : state === "rmiActive" ? (
            <span className="app-details__step-icon-info" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                <path d="M12 8V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="12" cy="16.5" r="0.75" fill="currentColor" />
              </svg>
            </span>
          ) : state === "returnedReview" ? (
            <span className="app-details__step-icon-eye" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
                <path
                  d="M2 12C2 12 5.5 6 12 6C18.5 6 22 12 22 12C22 12 18.5 18 12 18C5.5 18 2 12 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          ) : state === "directorRejected" ? (
            <span className="app-details__step-icon-cancel" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
                <path
                  d="M8 8L16 16M16 8L8 16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          ) : (
            step
          )}
        </div>
      </div>
      <div className={stepClass} style={{ gridColumn: column, gridRow: 2 }}>
        <div className="app-details__step-copy">
          <span className="app-details__step-title">{title}</span>
          <span className="app-details__step-sub">{sub}</span>
          <span className={chipClass}>{chip}</span>
        </div>
      </div>
    </>
  );
}

export function ApplicationDetailsSummary({ applicant }: { applicant: ApplicantRecord }) {
  const blockPeriod =
    applicant.blockEnd === "—" || !applicant.blockEnd
      ? `${applicant.blockStart} – Present`
      : `${applicant.blockStart} – ${applicant.blockEnd}`;

  return (
    <section className="app-details__panel" aria-labelledby="applicant-summary-heading">
      <h2 id="applicant-summary-heading" className="app-details__panel-head">
        Applicant Summary
      </h2>
      <div className="app-details__summary">
        <div className="app-details__summary-row">
          <SummaryField
            label="Applicant Name"
            value={formatApplicantDisplayName(applicant.name)}
          />
          <SummaryField label="Emirates ID" value={applicant.emiratesId} mono />
          <SummaryField label="Block Period" value={blockPeriod} />
          <div className="app-details__field app-details__field--status">
            <span className="app-details__field-label">Current Status</span>
            {applicant.requestStatus === "approved" || applicant.requestStatus === "eligible" ? (
              <span className="app-details__applicant-status-chip app-details__applicant-status-chip--eligible">
                Eligible to Reapply
              </span>
            ) : (
              <span className="app-details__applicant-status-chip">Awaiting Reapplication</span>
            )}
          </div>
        </div>
        <div className="app-details__field app-details__field--reason">
          <span className="app-details__field-label">Original Block Reason</span>
          <span className="app-details__field-value app-details__field-value--body">
            {applicant.blockReason.replace(/\s*-\s*/g, " – ")}.
          </span>
        </div>
      </div>
    </section>
  );
}

function SummaryField({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="app-details__field">
      <span className="app-details__field-label">{label}</span>
      <span
        className={`app-details__field-value${mono ? " app-details__field-value--plain" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}