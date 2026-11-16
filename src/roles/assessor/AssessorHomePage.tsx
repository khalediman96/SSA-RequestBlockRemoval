import { useNavigate } from "react-router-dom";
import { FigmaApplicationCard } from "@/components/hub/FigmaApplicationCard";
import { FigmaHubFilters } from "@/components/hub/FigmaHubFilters";
import { FigmaHubPagination } from "@/components/hub/FigmaHubPagination";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { useHubFilters } from "@/hooks/useHubFilters";
import { useHubPagination } from "@/hooks/useHubPagination";

export function AssessorHomePage() {
  const navigate = useNavigate();
  const { assessorQueue } = useApplicants();
  const filters = useHubFilters(assessorQueue);
  const pagination = useHubPagination(filters.filtered);

  return (
    <FigmaApplicationsHub
      hubPath="/assessor"
      userLabel={userPillLabel("assessor", "Assessor")}
      pageTitle="Applications For Assessment"
      pageSubtitle="Track and manage files submitted for wealth assessment and outcome approvals."
      breadcrumbLabel="Applications For Assessment"
      pageTitleBelow={
        <div className="figma-hub__segments" role="tablist" aria-label="Application queues">
          <button type="button" className="is-active" role="tab" aria-selected>
            Eligible to Reapply
          </button>
        </div>
      }
    >
      <FigmaHubFilters
        variant="assessor"
        searchInput={filters.searchInput}
        onSearchInput={filters.setSearchInput}
        statusSelect={filters.statusSelect}
        onStatusSelect={filters.onStatusSelectChange}
        segment={filters.segment}
        onSegment={filters.setSegmentTab}
        onSearch={filters.applySearch}
      />

      <p className="figma-hub__list-meta">
        Total Applications: <strong>{filters.visibleCount}</strong>
      </p>

      {filters.visibleCount === 0 ? (
        <p className="app-hub__list-empty" role="status">
          No eligible applications match your filters.
        </p>
      ) : null}

      <div className="figma-hub__list">
        {pagination.pageItems.map((row) => (
          <FigmaApplicationCard
            key={row.id}
            variant="assessor"
            applicant={row}
            onOpen={() => navigate(`/assessor/application/${row.id}`)}
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