import { PEOPLE } from "@/constants/people";

export function ApplicationDetailsAssessorEligibleBanner() {
  return (
    <div className="app-details__info-banner" role="status">
      <img
        src="/hugeicons/information-circle-solid.svg"
        alt=""
        width={20}
        height={20}
        className="app-details__info-icon"
        aria-hidden="true"
      />
      <p>
        This applicant was removed from the Reapplication Block List based on a request submitted by{" "}
        <strong>{PEOPLE.sectionHead}</strong> and approved by the{" "}
        <strong>Regular Application Director</strong>.
      </p>
    </div>
  );
}