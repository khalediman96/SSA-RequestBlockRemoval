import { useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE_SIZE = 10;

export function getPaginationItems(
  current: number,
  totalPages: number,
): Array<number | "ellipsis"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, "ellipsis", totalPages];
  }
  if (current >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }
  return [1, "ellipsis", current - 1, current, current + 1, "ellipsis", totalPages];
}

export function useHubPagination<T>(items: T[], pageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);

  useEffect(() => {
    setPage(1);
  }, [items]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  const safePage = Math.min(Math.max(1, page), totalPages);

  const pageItems = useMemo(() => {
    if (total === 0) return [];
    const start = (safePage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageSize, safePage, total]);

  const rangeStart = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(safePage * pageSize, total);
  const rangeLabel = `${rangeStart} to ${rangeEnd} of ${total} records`;

  const pageItemsList = useMemo(
    () => getPaginationItems(safePage, totalPages),
    [safePage, totalPages],
  );

  return {
    pageItems,
    page: safePage,
    setPage,
    totalPages,
    total,
    rangeLabel,
    pageItemsList,
    canGoPrev: safePage > 1,
    canGoNext: safePage < totalPages,
  };
}