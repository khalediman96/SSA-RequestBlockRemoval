import { PEOPLE } from "@/constants/people";
import {
  REASON_LABELS,
  type ApplicantGender,
  type ApplicantRecord,
  type RemovalReasonKey,
  type SubmittedRemovalRequest,
  type WorkflowHistoryEvent,
} from "@/types/workflow";

const SIM_MALE_FIRST = [
  "YOUSSEF",
  "OMAR",
  "KHALID",
  "RASHID",
  "SAEED",
  "HAMAD",
  "SULTAN",
  "MAJID",
  "NASSER",
  "FAHAD",
];

const SIM_FEMALE_FIRST = [
  "LAYLA",
  "AMNA",
  "FATIMA",
  "MARIAM",
  "NOORA",
  "SHAMMA",
  "HIND",
  "LATIFA",
  "AISHA",
  "RAWDA",
];

const SIM_MIDDLE = [
  "KHALID",
  "HASSAN",
  "SAEED",
  "RASHID",
  "MOHAMED",
  "SULTAN",
  "OBAID",
  "ZAYED",
  "ABDULLA",
  "NAHYAN",
];

const SIM_FAMILY = [
  "AL NUAIMI",
  "AL SHAMSI",
  "AL KAABI",
  "AL DHAHERI",
  "AL KETBI",
  "AL MANSOORI",
  "AL NAHAYAN",
  "AL QASIMI",
  "AL HOSANI",
  "AL SUWEIDI",
];

function maxSimSequence(applicants: ApplicantRecord[]): number {
  return applicants.reduce((max, applicant) => {
    const match = /^sim-(\d+)$/i.exec(applicant.id);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 0);
}

function takenApplicantNumbers(applicants: ApplicantRecord[]) {
  const appNumbers = new Set<string>();
  const sspCodes = new Set<string>();
  const emiratesIds = new Set<string>();
  for (const applicant of applicants) {
    appNumbers.add(applicant.appNumber);
    sspCodes.add(applicant.sspCode);
    emiratesIds.add(applicant.emiratesId);
  }
  return { appNumbers, sspCodes, emiratesIds };
}

function nextUniqueValue(
  base: number,
  format: (n: number) => string,
  taken: Set<string>,
): string {
  let n = base;
  let value = format(n);
  while (taken.has(value)) {
    n += 1;
    value = format(n);
  }
  taken.add(value);
  return value;
}

export function nextSimulatedSequence(applicants: ApplicantRecord[]): number {
  return maxSimSequence(applicants) + 1;
}

function buildSimProfile(seq: number): { name: string; gender: ApplicantGender } {
  const gender: ApplicantGender = seq % 2 === 1 ? "male" : "female";
  const firstPool = gender === "male" ? SIM_MALE_FIRST : SIM_FEMALE_FIRST;
  const fi = (seq * 3 + 1) % firstPool.length;
  const mi = (seq * 7 + 2) % SIM_MIDDLE.length;
  const li = (seq * 11 + 3) % SIM_FAMILY.length;
  const first = firstPool[fi]!;
  const middle = SIM_MIDDLE[mi]!;
  const family = SIM_FAMILY[li]!;
  return { name: `${first} ${middle} ${family}`, gender };
}

export function formatTodayDisplay(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

export function formatTodayWorkflow(): string {
  const d = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function formatDateTimeNow(): string {
  const d = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const h12 = hours % 12 || 12;
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${h12}:${minutes} ${ampm}`;
}

export function allocateRemovalRequestNumber(applicants: ApplicantRecord[]): string {
  const taken = new Set(applicants.map((a) => a.appNumber));
  const maxExisting = applicants.reduce((max, applicant) => {
    const match = /^RBR-2026-(\d+)$/i.exec(applicant.appNumber);
    if (!match) return max;
    return Math.max(max, Number(match[1]));
  }, 500);
  return nextUniqueValue(maxExisting + 1, (n) => `RBR-2026-${String(n).padStart(5, "0")}`, taken);
}

function buildHaystack(applicant: Pick<ApplicantRecord, "name" | "emiratesId" | "sspCode" | "appNumber">) {
  return `${applicant.name} ${applicant.emiratesId} ${applicant.sspCode} ${applicant.appNumber}`
    .toLowerCase()
    .replace(/[\s-]+/g, " ");
}

export function createSimulatedApplicant(
  seq: number,
  existingApplicants: ApplicantRecord[] = [],
): ApplicantRecord {
  const profile = buildSimProfile(seq);
  const id = `sim-${String(seq).padStart(4, "0")}`;
  const taken = takenApplicantNumbers(existingApplicants);
  const sspCode = nextUniqueValue(80000 + seq, (n) => `SSP-${n}`, taken.sspCodes);
  const appNumber = nextUniqueValue(91000 + seq, (n) => `APP-2026-${n}`, taken.appNumbers);
  const emiratesId = nextUniqueValue(
    seq,
    (n) => {
      const y = 1990 + (n % 15);
      const mid = String(1000000 + n).padStart(7, "0").slice(0, 7);
      return `784-${y}-${mid}-${n % 10}`;
    },
    taken.emiratesIds,
  );
  const blockStart = formatTodayDisplay();
  const blockEnd = "01/02/2027";
  const mobileSuffix = String(1000 + (seq % 9000)).padStart(4, "0");
  const mobile =
    profile.gender === "male" ? `+971 50 800 ${mobileSuffix}` : `+971 55 800 ${mobileSuffix}`;

  const base = {
    id,
    appNumber,
    sspCode,
    name: profile.name,
    gender: profile.gender as ApplicantGender,
    mobile,
    emiratesId,
    blockStart,
    blockEnd,
    blockReason: "Rejected application - Income above threshold",
    requestStatus: "none" as const,
    action: "request" as const,
    removeBlockRequests: "None",
  };

  return {
    ...base,
    searchHaystack: buildHaystack(base),
  };
}

export function buildSubmittedRemovalSnapshot(
  reason: RemovalReasonKey,
  comments: string,
  existing?: SubmittedRemovalRequest,
): SubmittedRemovalRequest {
  const reasonLabel = REASON_LABELS[reason as Exclude<RemovalReasonKey, "">] ?? reason;
  const reasonLine = reasonLabel.endsWith(".") ? reasonLabel : `${reasonLabel}.`;
  const submissionDate = formatTodayDisplay();
  const workflowStepDate = formatTodayWorkflow();
  const commentText = comments.trim() || "No additional comments provided.";
  const history: WorkflowHistoryEvent[] = [
    {
      title: "Request submitted",
      dateTime: formatDateTimeNow(),
      actor: PEOPLE.sectionHead,
      actorRole: "Regular Application Section Head",
      reasonLine: `Reason: ${reasonLine}`,
      comment: commentText,
      dotVariant: "gold",
    },
    ...(existing?.historyEvents.filter((e) => e.title !== "Request submitted") ?? []),
  ];

  return {
    requestedBy: PEOPLE.sectionHead,
    submissionDate,
    workflowStepDate,
    reasonLabel: reasonLine,
    comments: commentText,
    historyEvents: history,
    files: existing?.files ?? [],
  };
}

export function applicantAfterSubmit(
  applicant: ApplicantRecord,
  reason: RemovalReasonKey,
  comments: string,
  allApplicants: ApplicantRecord[],
): Partial<ApplicantRecord> {
  const submittedRequest = buildSubmittedRemovalSnapshot(reason, comments, applicant.submittedRequest);
  const rbrNumber = applicant.appNumber.startsWith("RBR-")
    ? applicant.appNumber
    : allocateRemovalRequestNumber(allApplicants);

  return {
    appNumber: rbrNumber,
    requestStatus: "pending",
    action: "submitted",
    submittedRequest,
    returnedRequest: undefined,
    rejectedRequest: undefined,
    approvedRequest: undefined,
    lastRequestNote: `Submitted · ${submissionDateFromRequest(submittedRequest)}`,
    searchHaystack: buildHaystack({ ...applicant, appNumber: rbrNumber }),
  };
}

function submissionDateFromRequest(req: SubmittedRemovalRequest): string {
  return req.submissionDate;
}

export { buildHaystack };