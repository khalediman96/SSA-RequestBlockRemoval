import type { ApplicantRecord } from "@/types/workflow";
import { MOCK_APPLICANTS } from "./mockApplicants";

/** Director hub — remove-block requests queue */
export const MOCK_DIRECTOR_QUEUE: ApplicantRecord[] = [
  {
    ...MOCK_APPLICANTS[1],
    appNumber: "RBR-2026-00398",
    requestStatus: "pending",
    searchHaystack: "sara mohamed rbr-2026-00398 pending",
    action: "submitted",
  },
  {
    ...MOCK_APPLICANTS.find((a) => a.id === "omar")!,
    appNumber: "RBR-2026-00445",
    requestStatus: "pending",
    searchHaystack: "omar hassan rbr-2026-00445 pending",
    action: "submitted",
  },
  {
    ...MOCK_APPLICANTS.find((a) => a.id === "nasser")!,
    appNumber: "RBR-2026-00402",
    requestStatus: "pending",
    searchHaystack: "nasser ali rbr-2026-00402 pending",
    action: "submitted",
  },
  {
    ...MOCK_APPLICANTS[0],
    appNumber: "RBR-2026-00412",
    requestStatus: "pending",
    blockReason: "Change in financial circumstances",
    searchHaystack:
      "rbr-2026-00412 hamad ateeq 784199600000053 pending director approval",
    action: "submitted",
  },
];

/** Assessor hub — applications ready for assessment */
export const MOCK_ASSESSOR_QUEUE: ApplicantRecord[] = [
  {
    ...MOCK_APPLICANTS[0],
    appNumber: "APP-2026-031557",
    requestStatus: "eligible",
    blockReason: "Remove block approved — new application",
    blockStart: "12/11/2026",
    blockEnd: "—",
    searchHaystack: "app-2026-031557 hamad assessor eligible",
  },
  {
    ...MOCK_APPLICANTS.find((a) => a.id === "mariam")!,
    appNumber: "APP-2026-031201",
    requestStatus: "eligible",
    blockReason: "Remove block approved — new application",
    blockEnd: "—",
    searchHaystack: "mariam saeed app-2026-031201 assessor eligible",
  },
  {
    ...MOCK_APPLICANTS.find((a) => a.id === "noor")!,
    appNumber: "APP-2026-030881",
    requestStatus: "eligible",
    blockEnd: "—",
    searchHaystack: "noor ahmed app-2026-030881 assessor eligible",
  },
];