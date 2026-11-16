export function PortalFooter({ className }: { className?: string }) {
  return (
    <footer className={["portal-footer", className].filter(Boolean).join(" ")} aria-label="Site footer">
      <div className="dashboard-shell">
        <div className="dashboard-inner portal-footer__inner">
          <div className="portal-footer__separator-wrap">
            <div className="portal-footer__separator" role="presentation" />
          </div>

          <div className="portal-footer__bar">
            <div className="portal-footer__brand">
              <div className="portal-footer__logo" aria-hidden="true">
                <img src="/ssa-footer-mark.svg" alt="" width={32} height={32} />
              </div>
              <p className="portal-footer__info">
                © 2026 Abu Dhabi Social Support Authority. All rights reserved.
              </p>
            </div>

            <div className="portal-footer__controls">
              <div className="portal-footer__segmented" role="group" aria-label="Language">
                <button type="button" className="portal-footer__pill is-active" aria-pressed="true">
                  English
                </button>
                <button type="button" className="portal-footer__pill" aria-pressed="false">
                  العربية
                </button>
              </div>

              <div className="portal-footer__segmented" role="group" aria-label="Color mode">
                <button type="button" className="portal-footer__pill is-active" aria-pressed="true">
                  Light
                </button>
                <button type="button" className="portal-footer__pill" aria-pressed="false">
                  Dark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}