import type { HubSegment } from "@/types/workflow";

const SECTION_HEAD_SEGMENTS: { id: HubSegment; label: string }[] = [
  { id: "all", label: "All" },
  { id: "none", label: "Awaiting" },
  { id: "pending", label: "Director Approval" },
  { id: "returned", label: "RMI" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const DIRECTOR_SEGMENTS: { id: HubSegment; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending Approval" },
  { id: "returned", label: "RMI" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export function FigmaHubFilters({
  searchInput,
  onSearchInput,
  statusSelect,
  onStatusSelect,
  segment,
  onSegment,
  onSearch,
  variant = "sectionHead",
}: {
  searchInput: string;
  onSearchInput: (v: string) => void;
  statusSelect: string;
  onStatusSelect: (v: string) => void;
  segment: HubSegment;
  onSegment: (s: HubSegment) => void;
  onSearch: () => void;
  variant?: "sectionHead" | "director" | "assessor";
}) {
  const segments = variant === "director" ? DIRECTOR_SEGMENTS : SECTION_HEAD_SEGMENTS;
  const showSegments = variant !== "assessor";

  return (
    <>
      {showSegments ? (
        <div className="figma-hub__segments" role="tablist" aria-label="Status filter">
          {segments.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              className={segment === s.id ? "is-active" : ""}
              aria-selected={segment === s.id}
              onClick={() => onSegment(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <section className="figma-hub__filter-panel" aria-labelledby="figma-filter-heading">
        <div className="figma-hub__filter-title-row">
          <h2 id="figma-filter-heading">Filter Applications</h2>
          <button type="button" className="figma-hub__btn-extract">
            Extract Excel
          </button>
        </div>

        <div className="figma-hub__filter-fields">
          <div className="figma-hub__field figma-hub__field--search">
            <label className="figma-hub__field-label" htmlFor="hub-search-applications">
              Search Applications
            </label>
            <input
              id="hub-search-applications"
              type="search"
              className="figma-hub__field-input"
              placeholder="Search application by application number, applicant name, emirates ID, or mobile number."
              value={searchInput}
              onChange={(e) => onSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSearch();
                }
              }}
            />
          </div>

          <div className="figma-hub__field figma-hub__field--status">
            <label className="figma-hub__field-label" htmlFor="hub-status-select">
              Status
            </label>
            <div className="figma-hub__select-wrap">
              <select
                id="hub-status-select"
                className="figma-hub__field-input figma-hub__field-select"
                aria-label="Status"
                value={statusSelect}
                onChange={(e) => onStatusSelect(e.target.value)}
              >
                {variant === "assessor" ? (
                  <>
                    <option value="all">Select Status</option>
                    <option value="approved">Eligible to Reapply</option>
                  </>
                ) : (
                  <>
                    <option value="all">Select Status</option>
                    <option value="none">No active request</option>
                    <option value="pending">Pending Director Approval</option>
                    <option value="returned">Returned for More Information</option>
                    <option value="approved">Approved / Eligible to Reapply</option>
                    <option value="rejected">Rejected</option>
                  </>
                )}
              </select>
              <img
                className="figma-hub__select-chevron"
                src="/hugeicons/arrow-down-01-solid.svg"
                alt=""
                width={16}
                height={16}
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        <div className="figma-hub__filter-actions">
          <button type="button" className="figma-hub__more-filters">
            <img src="/hugeicons/filter-solid.svg" alt="" width={20} height={20} aria-hidden="true" />
            More Filters
          </button>
          <button type="button" className="figma-hub__btn-search" onClick={onSearch}>
            <img src="/hugeicons/search-01-solid.svg" alt="" width={20} height={20} aria-hidden="true" />
            Search
          </button>
        </div>
      </section>
    </>
  );
}