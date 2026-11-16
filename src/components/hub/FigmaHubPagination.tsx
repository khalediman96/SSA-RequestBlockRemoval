type FigmaHubPaginationProps = {
  rangeLabel: string;
  page: number;
  totalPages: number;
  pageItemsList: Array<number | "ellipsis">;
  canGoPrev: boolean;
  canGoNext: boolean;
  onPageChange: (page: number) => void;
};

function ChevronLeft({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M14 6L8 12L14 18"
        stroke={disabled ? "#978F89" : "#1F1B16"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronRight({ disabled }: { disabled?: boolean }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10 6L16 12L10 18"
        stroke={disabled ? "#978F89" : "#1F1B16"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FigmaHubPagination({
  rangeLabel,
  page,
  totalPages,
  pageItemsList,
  canGoPrev,
  canGoNext,
  onPageChange,
}: FigmaHubPaginationProps) {
  if (totalPages <= 0) return null;

  return (
    <nav className="figma-hub__pagination" aria-label="Pagination">
      <div className="figma-hub__pagination-inner">
        <p className="figma-hub__pagination-range">{rangeLabel}</p>
        <div className="figma-hub__pagination-controls">
          <button
            type="button"
            className="figma-hub__pagination-item figma-hub__pagination-item--icon"
            disabled={!canGoPrev}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft disabled={!canGoPrev} />
          </button>

          {pageItemsList.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="figma-hub__pagination-ellipsis"
                aria-hidden="true"
              >
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                className={`figma-hub__pagination-item figma-hub__pagination-item--number${
                  item === page ? " figma-hub__pagination-item--selected" : ""
                }`}
                onClick={() => onPageChange(item)}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </button>
            ),
          )}

          <button
            type="button"
            className="figma-hub__pagination-item figma-hub__pagination-item--icon"
            disabled={!canGoNext}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <ChevronRight disabled={!canGoNext} />
          </button>
        </div>
      </div>
    </nav>
  );
}