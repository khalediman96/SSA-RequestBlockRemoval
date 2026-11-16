import { ApplicantStatusChip } from "@/components/hub/ApplicantStatusChip";
import {
  directorCardApplicationNumber,
  directorRequestedBy,
} from "@/lib/directorHubCard";
import type { ApplicantRecord } from "@/types/workflow";
import { daysSinceBlockStart } from "@/lib/blockDays";

const APPLICANT_AVATAR: Record<ApplicantRecord["gender"], string> = {
  female: "/Adult-Female-Emirati.svg",
  male: "/Adult-Male-Emirati.svg",
};

export function FigmaApplicationCard({
  applicant,
  onOpen,
  variant = "sectionHead",
}: {
  applicant: ApplicantRecord;
  onOpen?: () => void;
  variant?: "sectionHead" | "director" | "assessor";
}) {
  const daysLabel = daysSinceBlockStart(applicant.blockStart);
  const requestedBy = variant === "director" ? directorRequestedBy(applicant) : undefined;
  const applicationNumber =
    variant === "director"
      ? directorCardApplicationNumber(applicant)
      : variant === "assessor"
        ? applicant.appNumber
        : applicant.sspCode;
  const statusLabel = variant === "assessor" ? "Application Status" : "Current Status";
  const isAssessor = variant === "assessor";

  return (
    <article
      className={`figma-app-card${isAssessor ? " figma-app-card--assessor" : ""}`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onOpen();
        }
      }}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div className="figma-app-card__body">
        <div className="figma-app-card__main">
          <div className="figma-app-card__avatar-col" aria-hidden="true">
            <div className="figma-app-card__avatar">
              <img
                className="figma-app-card__avatar-img"
                src={APPLICANT_AVATAR[applicant.gender]}
                alt=""
                width={40}
                height={40}
              />
            </div>
          </div>

          <div className="figma-app-card__field figma-app-card__field--applicant">
            <span className="figma-field__label">Applicant Details</span>
            <div className="figma-field__stack">
              <span className="figma-field__value figma-field__value--name field-value--upper">
                {applicant.name}
              </span>
              <div className="figma-field__meta-group">
                <span className="figma-field__meta">{applicant.emiratesId}</span>
                {applicant.mobile && <span className="figma-field__meta">{applicant.mobile}</span>}
              </div>
            </div>
          </div>

          <div
            className={`figma-app-card__field${
              variant === "director" ? " figma-app-card__field--director-app" : ""
            }`}
          >
            <span className="figma-field__label">Application Number</span>
            <div className="figma-field__stack">
              <span className="figma-field__value">{applicationNumber}</span>
              {requestedBy ? (
                <span className="figma-field__meta figma-field__meta--requested-by">
                  Requested by {requestedBy}
                </span>
              ) : null}
            </div>
          </div>

          <div className="figma-app-card__field figma-app-card__field--blocked">
            <div className="figma-app-card__blocked">
              <div className="figma-app-card__cal" aria-hidden="true">
                <img className="ui-icon" src="/all-appeals/74f70.svg" alt="" width={24} height={24} />
              </div>
              <div className="figma-field__stack">
                <span className="figma-field__label">Blocked On</span>
                <span className="figma-field__value">{applicant.blockStart}</span>
                {daysLabel && <span className="figma-field__hint">{daysLabel}</span>}
              </div>
            </div>
          </div>

          {!isAssessor ? (
            <div className="figma-app-card__field figma-app-card__field--reason">
              <span className="figma-field__value figma-field__value--reason-title">Block Reason</span>
              <p className="figma-field__reason">{applicant.blockReason}</p>
            </div>
          ) : null}

          <div className="figma-app-card__field figma-app-card__field--status">
            <span className="figma-field__label">{statusLabel}</span>
            <ApplicantStatusChip status={applicant.requestStatus} />
          </div>
        </div>

        <span className="figma-app-card__chevron" aria-hidden="true">
          <img src="/hugeicons/arrow-right-01-solid.svg" alt="" width={24} height={24} />
        </span>
      </div>
    </article>
  );
}