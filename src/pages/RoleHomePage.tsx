import { useNavigate } from "react-router-dom";
import { PortalFooter } from "@/components/layout/PortalFooter";
import { PEOPLE } from "@/constants/people";

const ROLES = [
  {
    id: "section-head",
    title: "Regular Application Section Head",
    user: PEOPLE.sectionHead,
    description:
      "Manage blocked applicants on Awaiting Reapplication, submit Remove Block requests, and resubmit when the Director sends back.",
    path: "/section-head",
  },
  {
    id: "director",
    title: "Regular Application Director",
    user: PEOPLE.director,
    description:
      "Review Remove Block requests, approve, reject, or send back to the Section Head.",
    path: "/director",
  },
  {
    id: "assessor",
    title: "Assessor",
    user: PEOPLE.assessor,
    description:
      "Open applications after block removal and complete assessment (details, family, income, documents).",
    path: "/assessor",
  },
] as const;

export function RoleHomePage() {
  const navigate = useNavigate();

  return (
    <div className="role-home app-shell">
      <div className="app-hub__top">
        <div className="dashboard-shell">
          <div className="dashboard-inner app-hub__top-inner">
            <img
              className="app-hub__logo-mark"
              src="/ADSSA%20Logo.svg"
              alt=""
              width={60}
              height={60}
            />
            <span className="user-pill">
              <span className="user-pill__avatar" aria-hidden="true" />
              <span>Remove Block — choose role</span>
            </span>
          </div>
        </div>
      </div>

      <main className="dashboard-shell">
        <div className="dashboard-inner role-home__hero">
          <h1 className="role-home__title">Choose your role</h1>
          <p className="role-home__intro">
            Each role opens the Social Support Applications hub (Figma: Awaiting Reapplication).
          </p>
          <div className="role-home__grid">
            {ROLES.map((role) => (
              <article key={role.id} className="role-card">
                <h2>{role.title}</h2>
                <p className="role-card__user">{role.user}</p>
                <p className="role-card__desc">{role.description}</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => navigate(role.path)}
                >
                  Continue as {role.user.split(" ")[0]}
                </button>
              </article>
            ))}
          </div>
        </div>
      </main>
      <PortalFooter />
    </div>
  );
}