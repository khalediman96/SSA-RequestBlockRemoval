import { useNavigate } from "react-router-dom";
import { FigmaApplicationCard } from "@/components/hub/FigmaApplicationCard";
import { FigmaHubFilters } from "@/components/hub/FigmaHubFilters";
import { FigmaHubPagination } from "@/components/hub/FigmaHubPagination";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { useHubFilters } from "@/hooks/useHubFilters";
import { useHubPagination } from "@/hooks/useHubPagination";

export function AwaitingReapplicationPage() {
  const navigate = useNavigate();
  const { applicants, addSimulatedApplicant } = useApplicants();
  const filters = useHubFilters(applicants);
  const pagination = useHubPagination(filters.filtered);

  const onSimulateApplication = () => {
    addSimulatedApplicant();
    pagination.setPage(1);
  };

  return (
    <FigmaApplicationsHub
      hubPath="/section-head"
      userLabel={userPillLabel("sectionHead", "Section Head")}
      pageTitle="Awaiting Reapplication"
      pageSubtitle="Manage blocked applicants and submit or update block removal requests"
    >
      <FigmaHubFilters
        searchInput={filters.searchInput}
        onSearchInput={filters.setSearchInput}
        statusSelect={filters.statusSelect}
        onStatusSelect={filters.onStatusSelectChange}
        segment={filters.segment}
        onSegment={filters.setSegmentTab}
        onSearch={filters.applySearch}
      />

      <div className="figma-hub__list-toolbar">
        <p className="figma-hub__list-meta">
          Total Applications: <strong>{filters.visibleCount}</strong>
        </p>
        <button type="button" className="figma-hub__simulate-btn" onClick={onSimulateApplication}>
          Simulate Application
        </button>
      </div>

      {filters.visibleCount === 0 && (
        <p className="app-hub__list-empty" role="status">
          No applicants match your filters.
        </p>
      )}

      <div className="figma-hub__list">
        {pagination.pageItems.map((applicant) => (
          <FigmaApplicationCard
            key={applicant.id}
            applicant={applicant}
            onOpen={() => navigate(`/section-head/application/${applicant.id}`)}
          />
        ))}
      </div>

      {filters.visibleCount > 0 ? (
        <FigmaHubPagination
          rangeLabel={pagination.rangeLabel}
          page={pagination.page}
          totalPages={pagination.totalPages}
          pageItemsList={pagination.pageItemsList}
          canGoPrev={pagination.canGoPrev}
          canGoNext={pagination.canGoNext}
          onPageChange={pagination.setPage}
        />
      ) : null}
    </FigmaApplicationsHub>
  );
}