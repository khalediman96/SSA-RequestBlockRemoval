const PROGRAM_TABS = [
  "Social Support Applications",
  "Family Growth Applications",
  "Legal Cases",
  "Beneficiary Affairs",
  "Fund Recovery",
  "FollowUp Requests",
];

export function CoordinatorNav({ compact }: { compact?: boolean }) {
  const tabs = compact
    ? PROGRAM_TABS.slice(0, 4)
  : PROGRAM_TABS;
  return (
    <header className="coordinator-committee-nav top-nav" role="banner">
      <div className="dashboard-shell">
        <div
          className={`dashboard-inner top-nav__inner coordinator-committee-nav__tabs${compact ? " top-nav__inner--compact" : ""}`}
          role="navigation"
          aria-label="Programs"
        >
          {tabs.map((label, i) => (
            <a
              key={label}
              href="#"
              className={`nav-tab${i === 0 ? " nav-tab--active" : ""}`}
              onClick={(e) => e.preventDefault()}
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}

export function CompactTopNav() {
  const tabs = PROGRAM_TABS.slice(0, 4);
  return (
    <header className="top-nav">
      <div className="top-nav__inner top-nav__inner--compact">
        {tabs.map((label, i) => (
          <a
            key={label}
            href="#"
            className={`nav-tab${i === 0 ? " nav-tab--active" : ""}`}
            onClick={(e) => e.preventDefault()}
          >
            {label}
          </a>
        ))}
      </div>
    </header>
  );
}