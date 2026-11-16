import { useNavigate } from "react-router-dom";
import { FigmaApplicationCard } from "@/components/hub/FigmaApplicationCard";
import { FigmaHubFilters } from "@/components/hub/FigmaHubFilters";
import { FigmaHubPagination } from "@/components/hub/FigmaHubPagination";
import { FigmaApplicationsHub } from "@/components/layout/FigmaApplicationsHub";
import { userPillLabel } from "@/constants/people";
import { useApplicants } from "@/context/ApplicantsContext";
import { useHubFilters } from "@/hooks/useHubFilters";
import { useHubPagination } from "@/hooks/useHubPagination";

export function DirectorHomePage() {
  const navigate = useNavigate();
  const { directorHubList } = useApplicants();
  const filters = useHubFilters(directorHubList);
  const pagination = useHubPagination(filters.filtered);

  return (
    <FigmaApplicationsHub
      hubPath="/director"
      userLabel={userPillLabel("director", "Regular Application Director")}
      pageTitle="Block Removal Requests"
      pageSubtitle="Review and take action on submitted block removal requests"
      breadcrumbLabel="My approvals"
    >
      <FigmaHubFilters
        variant="director"
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

      {filters.visibleCount === 0 && (
        <p className="app-hub__list-empty" role="status">
          No removal requests match your filters.
        </p>
      )}

      <div className="figma-hub__list">
        {pagination.pageItems.map((row) => (
          <FigmaApplicationCard
            key={row.id}
            variant="director"
            applicant={row}
            onOpen={() => navigate(`/director/application/${row.id}`)}
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