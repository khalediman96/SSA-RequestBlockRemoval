import type { ReactNode } from "react";

export function ApplicationDetailsActionFooter({ children }: { children: ReactNode }) {
  return (
    <div className="app-details__action-shell">
      <div className="dashboard-shell">
        <div className="dashboard-inner app-details__action-bar">{children}</div>
      </div>
    </div>
  );
}