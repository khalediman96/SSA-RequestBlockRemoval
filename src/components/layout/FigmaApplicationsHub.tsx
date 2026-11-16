import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { PortalFooter } from "@/components/layout/PortalFooter";

const PORTAL_TABS = [
  "Social Support Applications",
  "Family Growth Applications",
  "Legal cases",
  "Beneficiary Affairs",
  "Fund recovery",
  "followUp requests",
];

type FigmaApplicationsHubProps = {
  userLabel: string;
  pageTitle: string;
  pageSubtitle: string;
  /** Role hub path — home icon + “Applications” link target */
  hubPath: string;
  breadcrumbLabel?: string;
  /** Extra trailing crumb on workflow pages (e.g. applicant name). */
  breadcrumbDetail?: string;
  /** Middle crumb label when not on hub (default “Applications”). */
  workflowCrumbLabel?: string;
  /** Hide default page title block (details pages use in-content header). */
  hidePageHeading?: boolean;
  /** Rendered directly under the page title (e.g. hub status tabs). */
  pageTitleBelow?: ReactNode;
  /** Extra class on root shell (e.g. figma-hub--details). */
  shellClassName?: string;
  /** Sticky action bar rendered flush above portal footer. */
  actionFooter?: ReactNode;
  children: ReactNode;
};

export function FigmaApplicationsHub({
  userLabel,
  pageTitle,
  pageSubtitle,
  hubPath,
  breadcrumbLabel = "Applications",
  breadcrumbDetail,
  workflowCrumbLabel = "Applications",
  hidePageHeading = false,
  pageTitleBelow,
  shellClassName,
  actionFooter,
  children,
}: FigmaApplicationsHubProps) {
  const location = useLocation();
  const path = location.pathname;
  const onHub = path === hubPath;
  const inWorkflow = path.startsWith(`${hubPath}/`);

  return (
    <div className={["app-shell", "figma-hub", shellClassName].filter(Boolean).join(" ")}>
      <header className="figma-hub__header">
        <div className="figma-hub__portal-menu">
          <div className="dashboard-shell">
            <div className="dashboard-inner figma-hub__portal-menu-inner">
              {PORTAL_TABS.map((label, i) => (
                <a
                  key={label}
                  href="#"
                  className={`figma-hub__portal-tab${i === 0 ? " figma-hub__portal-tab--active" : ""}`}
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-shell">
          <div className="dashboard-inner">
            <div className="figma-hub__brand-row">
              <img className="figma-hub__logo" src="/ADSSA%20Logo.svg" alt="" width={72} height={72} />
              <div className="figma-hub__profile">
                <span className="figma-hub__profile-avatar" aria-hidden="true" />
                <span className="figma-hub__profile-name">{userLabel}</span>
                <img
                  className="figma-hub__profile-chevron ui-icon"
                  src="/all-appeals/b59af.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden="true"
                />
                <span className="figma-hub__switch-role">
                  <Link to="/">Switch role</Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="figma-hub__second-menu" aria-label="Portal navigation">
        <div className="dashboard-shell">
          <div className="dashboard-inner figma-hub__second-menu-inner">
            <Link to="/" className="figma-hub__menu-item">
              Home
            </Link>
            <Link
              to={hubPath}
              className={`figma-hub__menu-item${inWorkflow ? " figma-hub__menu-item--active" : ""}`}
              aria-current={inWorkflow ? "page" : undefined}
            >
              Applications
              <img
                className="figma-hub__menu-chevron"
                src="/hugeicons/arrow-down-01-solid.svg"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
              />
            </Link>
            <Link
              to={hubPath}
              className={`figma-hub__menu-item${onHub ? " figma-hub__menu-item--active" : ""}`}
              aria-current={onHub ? "page" : undefined}
            >
              Application controls
              <img
                className="figma-hub__menu-chevron"
                src="/hugeicons/arrow-down-01-solid.svg"
                alt=""
                width={12}
                height={12}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </nav>

      <main className={["dashboard-shell", actionFooter ? "figma-hub__main" : ""].filter(Boolean).join(" ")}>
        <div className="dashboard-inner figma-hub__workspace">
          <nav className="figma-hub__crumbs" aria-label="Breadcrumb">
            <Link to={hubPath} className="figma-hub__crumbs-home" aria-label="Home">
              <img src="/hugeicons/home-solid.svg" alt="" width={14} height={14} aria-hidden="true" />
            </Link>
            <img
              className="figma-hub__crumbs-sep"
              src="/hugeicons/arrow-right-01-solid.svg"
              alt=""
              width={14}
              height={14}
              aria-hidden="true"
            />
            {onHub ? (
              <span className="figma-hub__crumbs-current">{breadcrumbLabel}</span>
            ) : (
              <>
                <Link to={hubPath} className="figma-hub__crumbs-link">
                  {workflowCrumbLabel}
                </Link>
                <img
                  className="figma-hub__crumbs-sep"
                  src="/hugeicons/arrow-right-01-solid.svg"
                  alt=""
                  width={14}
                  height={14}
                  aria-hidden="true"
                />
                <span
                  className={
                    breadcrumbDetail
                      ? "figma-hub__crumbs-current figma-hub__crumbs-current--workflow"
                      : "figma-hub__crumbs-current"
                  }
                >
                  {breadcrumbLabel}
                </span>
                {breadcrumbDetail ? (
                  <>
                    <img
                      className="figma-hub__crumbs-sep"
                      src="/hugeicons/arrow-right-01-solid.svg"
                      alt=""
                      width={14}
                      height={14}
                      aria-hidden="true"
                    />
                    <span className="figma-hub__crumbs-detail">{breadcrumbDetail}</span>
                  </>
                ) : null}
              </>
            )}
          </nav>

          {!hidePageHeading ? (
            <>
              <h1 className="figma-hub__page-title">{pageTitle}</h1>
              {pageTitleBelow}
              <p className="figma-hub__page-subtitle">{pageSubtitle}</p>
            </>
          ) : null}

          {children}
        </div>
        {actionFooter}
      </main>
      <PortalFooter className={actionFooter ? "portal-footer--after-details-action" : undefined} />
    </div>
  );
}