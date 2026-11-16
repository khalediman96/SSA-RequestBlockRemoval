export const PEOPLE = {
  sectionHead: "Ahmed Alkaabi",
  director: "Salem Al Mansouri",
  assessor: "Noura Al Ketibi",
} as const;

export function userPillLabel(role: keyof typeof PEOPLE, title: string) {
  return `${PEOPLE[role]} · ${title}`;
}