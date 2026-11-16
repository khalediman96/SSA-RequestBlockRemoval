import { useCallback, useMemo, useState } from "react";
import type { ApplicantRecord, HubSegment } from "@/types/workflow";

function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\s-]+/g, " ")
    .replace(/\s/g, "");
}

function cardMatchesSearch(applicant: ApplicantRecord, queryNorm: string): boolean {
  if (!queryNorm) return true;
  const haystackNorm = normalizeSearchText(applicant.searchHaystack);
  const eidNorm = normalizeSearchText(applicant.emiratesId);
  return haystackNorm.includes(queryNorm) || eidNorm.includes(queryNorm);
}

function cardMatchesStatus(
  applicant: ApplicantRecord,
  statusFilter: string,
): boolean {
  if (statusFilter === "all") return true;
  if (statusFilter === "approved") {
    return applicant.requestStatus === "approved" || applicant.requestStatus === "eligible";
  }
  return applicant.requestStatus === statusFilter;
}

export function useHubFilters(applicants: ApplicantRecord[]) {
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusSelect, setStatusSelect] = useState("all");
  const [segment, setSegment] = useState<HubSegment>("all");

  const resolveStatusFilter = useCallback((): string => {
    if (segment !== "all") return segment;
    return statusSelect;
  }, [segment, statusSelect]);

  const filtered = useMemo(() => {
    const queryNorm = normalizeSearchText(searchQuery);
    const statusFilter = resolveStatusFilter();
    return applicants.filter(
      (a) => cardMatchesSearch(a, queryNorm) && cardMatchesStatus(a, statusFilter),
    );
  }, [applicants, searchQuery, resolveStatusFilter]);

  const applySearch = useCallback(() => {
    setSearchQuery(searchInput);
  }, [searchInput]);

  const clearFilters = useCallback(() => {
    setSearchInput("");
    setSearchQuery("");
    setStatusSelect("all");
    setSegment("all");
  }, []);

  const setSegmentTab = useCallback((next: HubSegment) => {
    setSegment(next);
    if (next === "all") {
      setStatusSelect("all");
    } else {
      setStatusSelect(next);
    }
  }, []);

  const onStatusSelectChange = useCallback((value: string) => {
    setStatusSelect(value);
    setSegment("all");
  }, []);

  return {
    searchInput,
    setSearchInput,
    statusSelect,
    segment,
    filtered,
    visibleCount: filtered.length,
    applySearch,
    clearFilters,
    setSegmentTab,
    onStatusSelectChange,
  };
}