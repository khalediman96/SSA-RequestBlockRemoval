import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { UserPill } from "./UserPill";

export function RoleLayoutHeader({
  userLabel,
  breadcrumb,
  logoCompact,
}: {
  userLabel: string;
  breadcrumb?: ReactNode;
  logoCompact?: boolean;
}) {
  return (
    <div className="header-bar header-portal-nav-sticky">
      <div className="dashboard-shell">
        <div className="dashboard-inner">
          <div className="header-bar__inner">
            {logoCompact ? (
              <img
                className="app-hub__logo-mark"
                src="/ADSSA%20Logo.svg"
                alt=""
                width={60}
                height={60}
              />
            ) : (
              <img
                className="brand-logo"
                src="/ADSSA%20Logo.svg"
                alt=""
                width={158}
                height={51}
              />
            )}
            <UserPill label={userLabel} />
          </div>
          {breadcrumb}
          <p className="role-switch">
            <Link to="/">Switch role</Link>
          </p>
        </div>
      </div>
    </div>
  );
}