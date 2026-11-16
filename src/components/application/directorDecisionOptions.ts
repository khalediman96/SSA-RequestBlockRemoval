export const DIRECTOR_DECISION_OPTIONS = [
  {
    value: "approve" as const,
    title: "Approve",
    desc: "Remove block — move to Eligible to Reapply",
  },
  {
    value: "reject" as const,
    title: "Reject",
    desc: "Block stays active",
  },
  {
    value: "sendback" as const,
    title: "Send Back for More Information",
    desc: "Return to Section Head",
  },
];

export type DirectorOutcomeDecision = (typeof DIRECTOR_DECISION_OPTIONS)[number]["value"];