import { useState } from "react";
import type { ReactNode } from "react";

const A = "/assets";

const styles = String.raw`
@font-face{font-family:"Noto Sans:Bold";src:url("/fonts/Noto_Sans-Bold.woff2") format("woff2");font-style:normal;font-weight:700}
@font-face{font-family:"Noto Sans:Medium";src:url("/fonts/Noto_Sans-Medium.woff2") format("woff2");font-style:normal;font-weight:500}
@font-face{font-family:"Noto Sans:Regular";src:url("https://static.figma.com/font/NotoSans-VF_3") format("woff2");font-style:normal;font-weight:400}
@font-face{font-family:"Noto Sans:SemiBold";src:url("/fonts/Noto_Sans-SemiBold.woff2") format("woff2");font-style:normal;font-weight:600}
@font-face{font-family:"Noto Kufi Arabic:Bold";src:url("/fonts/Noto_Kufi_Arabic-Bold.woff2") format("woff2");font-style:normal;font-weight:700}
@font-face{font-family:"Noto Kufi Arabic:Medium";src:url("/fonts/Noto_Kufi_Arabic-Medium.woff2") format("woff2");font-style:normal;font-weight:500}
@font-face{font-family:"Noto Kufi Arabic:SemiBold";src:url("/fonts/Noto_Kufi_Arabic-SemiBold.woff2") format("woff2");font-style:normal;font-weight:600}
@font-face{font-family:"Inter:Bold";src:url("https://static.figma.com/font/Inter_1") format("woff2");font-style:normal;font-weight:700}
@font-face{font-family:"Inter:Regular";src:url("https://static.figma.com/font/Inter_1") format("woff2");font-style:normal;font-weight:400}
@font-face{font-family:"Inter:Semi Bold";src:url("https://static.figma.com/font/Inter_1") format("woff2");font-style:normal;font-weight:600}
@font-face{font-family:"IBM Plex Sans:Medium";src:url("https://static.figma.com/font/IBMPlexSans_wdth_wght__1") format("woff2");font-style:normal;font-weight:500}
@font-face{font-family:"IBM Plex Sans:SemiBold";src:url("https://static.figma.com/font/IBMPlexSans_wdth_wght__1") format("woff2");font-style:normal;font-weight:600}
@font-face{font-family:"Roboto:Regular";src:url("https://static.figma.com/font/Roboto_wdth_wght__3") format("woff2");font-style:normal;font-weight:400}
:root{--brown:#442b00;--gold:#bf8521;--line:#e6d6bf;--cream:#faf5f0;--muted:#675d50}
*{box-sizing:border-box}
body{margin:0;background:#fcfcfc;color:#1f1b16;font-family:"Noto Sans:Medium",Arial,sans-serif}
button,a{font:inherit}
button{cursor:pointer}
.page{min-height:100vh;background:#fcfcfc;transition:.25s;background-color}
.wrap{width:min(1200px,calc(100% - 48px));margin-inline:auto}
.portal{height:40px;background:#2b2218;color:#fcfcfc;overflow:auto}
.portal .wrap{display:flex;height:40px;align-items:stretch}
.portal a{display:flex;align-items:center;padding:8px 12px;color:inherit;text-decoration:none;white-space:nowrap;font:13px/18.2px "Noto Sans:SemiBold"}
.portal a.active{background:#faf5f0;color:#2b2218}
.brandbar{height:96px;display:flex;align-items:center;justify-content:space-between}
.logo{width:72px;height:72px}
.profile-wrap{position:relative}
.profile{display:flex;align-items:center;gap:16px;padding:16px;border:0;background:transparent}
.profile img:first-child{width:40px;height:40px}
.profile .chev{width:12px;height:auto;transform:rotate(180deg)}
.profile-menu,.nav-pop{position:absolute;z-index:20;background:white;border:1px solid var(--line);border-radius:8px;box-shadow:0 12px 30px #442b0020;padding:8px;min-width:160px}
.profile-menu{right:0;top:66px}
.profile-menu button,.nav-pop button{width:100%;border:0;background:white;text-align:left;padding:10px;border-radius:5px;color:#6f5b40}
.profile-menu button:hover,.nav-pop button:hover{background:var(--cream)}
.navline{height:55px;border-bottom:1px solid var(--line)}
.nav{height:55px;display:flex;align-items:stretch}
.navitem-wrap{position:relative;display:flex}
.navitem{border:0;background:none;color:#6f5b40;padding:0 16px;font:16px/22.4px "Noto Sans:SemiBold";display:flex;align-items:center;gap:8px}
.navitem.active{border-bottom:2px solid var(--gold)}
.navitem img{width:12px;transform:rotate(180deg)}
.nav-pop{left:8px;top:52px}
.title-area{padding-top:16px}
.crumbs{display:flex;align-items:center;height:40px;font:13px/18.2px "Noto Sans:SemiBold";text-transform:capitalize}
.crumbs img{object-fit:contain}
.home-icon{width:14px;height:14px;margin:0 16px 0 9px}
.crumb-arrow{width:14px;height:14px;margin-right:8px}
.crumb-arrow.wide{width:30px;height:24px;margin:0}
.crumbs .active{color:var(--gold);padding:8px}
.crumbs .muted{color:#bfa889;padding:8px}
.title-row{height:48px;display:flex;align-items:center;gap:16px}
.back-icon{width:24px;height:24px}
h1{margin:0;flex:1;color:var(--brown);font:32px/44.8px "Noto Sans:SemiBold";text-transform:capitalize}
.number-chip{background:#f1edfd;color:#5439a7;border-radius:4px;padding:8px 16px;font:13px/18.2px "Noto Sans:SemiBold";text-transform:capitalize}
.number-chip strong{font-size:14px}
main{display:flex;flex-direction:column;gap:24px;padding:24px 0 0}
.alert{min-height:72px;background:#fedfca;border-radius:16px;padding:20px 32px;display:flex;align-items:center;gap:12px;color:#d25705;font:16px/30px "Noto Kufi Arabic:SemiBold"}
.alert img{width:24px;height:24px}
.stepper{border:1px solid var(--line);border-radius:8px;background:#fff;overflow:hidden}
.steps{height:174px;padding:25px 37px;display:grid;grid-template-columns:160px 1fr 160px 1fr 160px;align-items:start}
.step{text-align:center}
.step-circle{width:44px;height:44px;margin:auto;border-radius:999px;display:grid;place-items:center;color:white;font:14px/21px "Noto Sans:Bold";border:2px solid}
.step.done .step-circle{background:#15803d;border-color:#15803d}.step.done .step-circle img{width:18px;height:18px}
.step.current .step-circle{background:#bf8521;border-color:#bf8521;box-shadow:0 0 0 4px #fbf6ec}
.step.disabled .step-circle{background:#e5e7eb;border-color:#d8dbe1;color:#cbced3}
.step h3{margin:12px 0 0;font:14px/21px "Noto Sans:Bold";color:#1e1a0e}
.step.current h3{color:#bf8521}.step.disabled h3{color:#cbced3}
.step p{margin:0 0 4px;color:#7a7468;font:12px/16.5px "Noto Sans:Regular";font-variation-settings:"CTGR" 0,"wdth" 100}
.step.disabled p{color:#d5d8dd}
.status{display:inline-flex;height:24px;align-items:center;padding:8px;border-radius:4px;font:13px/18.2px "Noto Sans:SemiBold";text-transform:capitalize}
.status.green{background:#b3e8ba;color:#0b6d29}.status.orange{background:#fcc29c;color:#d25705}.status.gray{background:#e5e7eb;color:#cbced3}.status.cyan{background:#c7e5ea;color:#0b6c7b}
.connector{height:2px;margin-top:22px;background:#15803d}.connector.current{background:linear-gradient(90deg,#bf8521,#e5e7eb)}
.history{border-top:1px solid var(--line);background:var(--cream)}
.history-head{height:80px;padding:0 40px;display:flex;align-items:center;justify-content:space-between}
.history-head strong{color:#332206;font:17px/25.5px "Noto Sans:Bold"}
.link-button{border:0;background:none;color:#bf8521;font:12px/18px "Noto Sans:Bold"}
.history-detail{padding:0 40px 24px;color:#675d50;font-size:13px;animation:reveal .25s ease}
@keyframes reveal{from{opacity:0;transform:translateY(-5px)}}
.section-card{border:1px solid #e3dbd3;border-radius:8px;background:#fff;padding:24px;display:flex;flex-direction:column;gap:24px}
.section-card h2{margin:0;color:var(--brown);font:20px/24px "Noto Kufi Arabic:SemiBold"}
.summary{background:var(--cream);border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:24px}
.fields{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
.fields.three{grid-template-columns:1fr 1fr 246px}
.field label,.comment label{display:block;margin-bottom:8px;color:#675d50;font:13px/18.2px "Noto Sans:Medium"}
.field .value{font:20px/24px "Noto Kufi Arabic:SemiBold";color:#1f1b16}
.reason .value{font:16px/22.4px "Noto Sans:Medium"}
.divider{display:block;width:100%;height:48px;object-fit:fill}
.comment{background:#fdfdfd;border-radius:8px;padding:24px}
.comment p{margin:0;font:16px/22.4px "Noto Sans:Medium"}
.attachments{display:flex;flex-direction:column;gap:8px}
.attach-title{color:#6f5b40;font:14px/19.6px "Noto Sans:Medium"}
.files{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.file{min-width:0;background:var(--cream);border:1px solid #e7e7e7;border-radius:8px;padding:16px;display:flex;align-items:center;gap:8px}
.pdf{width:36px;height:36px;display:grid;place-items:center;flex:none;mask:url("/assets/a4826.svg") center/36px 36px no-repeat}
.pdf img{width:27px;height:36px}
.file-copy{min-width:0;flex:1;font-size:12px}.file-copy strong{display:block;overflow:hidden;text-overflow:ellipsis;font:12px/18px "Inter:Semi Bold";white-space:nowrap}.file-copy span{color:#6d6d6d;font:12px/16px "Inter:Regular"}
.download{color:#bf8521;text-decoration:none;font:12px/18px "Noto Sans:Bold"}
.actionbar{margin-top:24px;background:#ebe2d5;min-height:106px;display:flex;align-items:center}
.actions{display:flex;justify-content:flex-end;align-items:center;gap:11px}
.round-button{height:48px;border-radius:30px;padding:0 24px;font:18px/25.2px "Noto Sans:SemiBold";text-transform:capitalize}
.round-button.outline{border:1px solid #bf8521;background:transparent;color:#bf8521}.round-button.fill{border:1px solid #bf8521;background:#bf8521;color:white}
.plus{margin-left:39px;width:44px;height:44px;border:0;border-radius:50%;background:#bf8521;color:white;font:20px/28px "IBM Plex Sans:SemiBold"}
footer{height:136px;display:flex;align-items:center}
.foot{display:flex;align-items:center;justify-content:space-between;width:100%;padding:40px 0 24px}
.copyright{display:flex;align-items:center;gap:24px;color:#6f5b40;font:13px/18.2px "Noto Sans:Medium"}.copyright img{width:32px;height:32px}
.preferences{display:flex;gap:24px}.toggle{display:flex;align-items:center;background:#ebe2d5;border-radius:8px;padding:4px}
.toggle button{width:100px;height:32px;border:0;border-radius:8px;background:transparent;color:#6f5b40;font:13px/18.2px "Noto Sans:SemiBold"}
.toggle button.selected{background:white}
.toast{position:fixed;left:50%;bottom:24px;z-index:50;transform:translateX(-50%);padding:12px 20px;border-radius:8px;background:#2b2218;color:white;font-size:13px;box-shadow:0 10px 30px #0003;animation:reveal .2s ease}
.page.dark{background:#231f1a;color:#f8f4ed}.page.dark .brandbar,.page.dark .navline,.page.dark .title-area,.page.dark main,.page.dark footer{filter:brightness(.82) contrast(1.08)}
@media(max-width:800px){
 .wrap{width:min(100% - 32px,1200px)}.brandbar{height:76px}.logo{width:56px;height:56px}.navline{overflow-x:auto}.nav{width:max-content}
 .portal .wrap{width:max-content}.title-row{height:auto;align-items:flex-start}.number-chip{margin-top:4px}h1{font-size:25px;line-height:36px}.crumbs{overflow:auto}
 main{gap:16px}.alert{padding:18px 20px;line-height:24px}.steps{height:auto;grid-template-columns:1fr;gap:12px;padding:24px}.connector{width:2px;height:28px;margin:0 auto;background:#15803d}.connector.current{background:linear-gradient(#bf8521,#e5e7eb)}
 .step{display:grid;grid-template-columns:52px 1fr;grid-template-rows:auto auto auto;text-align:left;column-gap:12px}.step-circle{grid-row:1/4}.step h3{margin:0;text-align:left}.step p{text-align:left}.status{justify-self:start}
 .history-head{padding:0 24px}.history-detail{padding-inline:24px}.section-card{padding:20px}.summary{padding:20px}.fields,.fields.three{grid-template-columns:1fr 1fr}.reason{grid-column:1/-1}.files{grid-template-columns:1fr}.comment p{font-size:14px}.divider{height:20px}
 .actionbar{padding:18px 0}.actions{flex-wrap:wrap}.plus{margin-left:auto}.foot{align-items:flex-start;gap:24px;flex-direction:column}.preferences{flex-wrap:wrap;gap:12px}footer{height:auto}.copyright{gap:12px}
}
@media(max-width:520px){.wrap{width:calc(100% - 24px)}.profile{padding:8px}.fields,.fields.three{grid-template-columns:1fr}.number-chip{font-size:0}.number-chip strong{font-size:12px}.section-card h2{font-size:18px}.round-button{font-size:15px;padding:0 18px}.plus{margin-left:0}.toggle button{width:82px}}
`;

type FieldProps = { label: string; children: ReactNode; className?: string };

function Field({ label, children, className = "" }: FieldProps) {
  return (
    <div className={`field ${className}`}>
      <label>{label}</label>
      <div className="value">{children}</div>
    </div>
  );
}

function FileCard({ name }: { name: string }) {
  return (
    <div className="file">
      <span className="pdf">
        <img src={`${A}/f4ef9.svg`} alt="" />
      </span>
      <span className="file-copy">
        <strong>{name}</strong>
        <span>500kb</span>
      </span>
      <a className="download" href={`data:text/plain,${encodeURIComponent(name)}`} download={name}>
        Download
      </a>
    </div>
  );
}

export default function App() {
  const [history, setHistory] = useState(false);
  const [profile, setProfile] = useState(false);
  const [menu, setMenu] = useState<"applications" | "controls" | null>(null);
  const [dark, setDark] = useState(false);
  const [toast, setToast] = useState("");

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2200);
  };

  return (
    <div className={`page${dark ? " dark" : ""}`}>
      <style>{styles}</style>
      <header>
        <div className="portal">
          <div className="wrap">
            {[
              "Social Support Applications",
              "Family Growth Applications",
              "Legal cases",
              "Beneficiary Affairs",
              "Fund recovery",
              "followUp requests",
            ].map((item, i) => (
              <a
                key={item}
                className={i === 0 ? "active" : ""}
                href={`#${item.toLowerCase().replaceAll(" ", "-")}`}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
        <div className="wrap brandbar">
          <img className="logo" src={`${A}/4e837.svg`} alt="Social Support Authority" />
          <div className="profile-wrap">
            <button
              className="profile"
              type="button"
              aria-expanded={profile}
              onClick={() => setProfile(!profile)}
            >
              <img src={`${A}/e2193.svg`} alt="" />
              <img className="chev" src={`${A}/56d42.svg`} alt="" />
            </button>
            {profile && (
              <div className="profile-menu">
                <button type="button" onClick={() => notify("Profile selected")}>
                  Profile
                </button>
                <button type="button" onClick={() => notify("Signed out")}>
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="navline">
          <nav className="wrap nav" aria-label="Primary navigation">
            <button className="navitem" type="button">
              Home
            </button>
            <div className="navitem-wrap">
              <button
                className="navitem"
                type="button"
                onClick={() => setMenu(menu === "applications" ? null : "applications")}
              >
                Applications <img src={`${A}/56d42.svg`} alt="" />
              </button>
              {menu === "applications" && (
                <div className="nav-pop">
                  <button type="button">All applications</button>
                  <button type="button">Drafts</button>
                </div>
              )}
            </div>
            <div className="navitem-wrap">
              <button
                className="navitem active"
                type="button"
                onClick={() => setMenu(menu === "controls" ? null : "controls")}
              >
                Application controls <img src={`${A}/56d42.svg`} alt="" />
              </button>
              {menu === "controls" && (
                <div className="nav-pop">
                  <button type="button">Review queue</button>
                  <button type="button">Decisions</button>
                </div>
              )}
            </div>
          </nav>
        </div>
        <div className="wrap title-area">
          <div className="crumbs">
            <img className="home-icon" src={`${A}/c5fde.svg`} alt="Home" />
            <img className="crumb-arrow" src={`${A}/dc594.svg`} alt="" />
            <span className="active">Applications</span>
            <img className="crumb-arrow wide" src={`${A}/4aec1.svg`} alt="" />
            <span className="muted">Applicant details</span>
          </div>
          <div className="title-row">
            <img className="back-icon" src={`${A}/26421.svg`} alt="" />
            <h1>Hussain Mohamed</h1>
            <span className="number-chip">
              Application no. <strong>SSP-1234</strong>
            </span>
          </div>
        </div>
      </header>

      <main className="wrap">
        <section className="alert">
          <img src={`${A}/71270.svg`} alt="" />
          <span>
            This request was successfully submitted to the application Director and is pending their
            decision.
          </span>
        </section>

        <section className="stepper" aria-label="Application progress">
          <div className="steps">
            <div className="step done">
              <div className="step-circle">
                <img src={`${A}/c65eb.svg`} alt="" />
              </div>
              <h3>Request Submitted</h3>
              <p>Section Head • 12 Nov 2026</p>
              <span className="status green">Done</span>
            </div>
            <div className="connector" />
            <div className="step current">
              <div className="step-circle">2</div>
              <h3>Director Review</h3>
              <p>Regular Application Director</p>
              <span className="status orange">Pending</span>
            </div>
            <div className="connector current" />
            <div className="step disabled">
              <div className="step-circle">3</div>
              <h3>Final Decision</h3>
              <p>Outcome</p>
              <span className="status gray">Awaiting</span>
            </div>
          </div>
          <div className="history">
            <div className="history-head">
              <strong>Request history</strong>
              <button className="link-button" type="button" onClick={() => setHistory(!history)}>
                {history ? "Hide details" : "Show details"}
              </button>
            </div>
            {history && (
              <div className="history-detail">
                12 Nov 2026 — The removal request was submitted by Ahmed Al Kaabi and forwarded to
                the Application Director for review.
              </div>
            )}
          </div>
        </section>

        <section className="section-card">
          <h2>Applicant Summary</h2>
          <div className="summary">
            <div className="fields">
              <Field label="Applicant Name">Hussain Mohamed</Field>
              <Field label="Emirates ID">784-1996-0000005-3</Field>
              <Field label="Block Period">01/08/2026 - Present</Field>
              <Field label="Current Status">
                <span className="status cyan">Awaiting Reapplication</span>
              </Field>
            </div>
            <Field label="Original Block Reason" className="reason">
              Rejected application – income above threshold.
            </Field>
          </div>
        </section>

        <section className="section-card">
          <h2>Removal Request Summary</h2>
          <div className="summary">
            <div className="fields three">
              <Field label="Requested By">Ahmed Al Kaabi</Field>
              <Field label="Submission Date">12/11/2026</Field>
              <Field label="Request Status">
                <span className="status orange">Pending Director approval</span>
              </Field>
            </div>
            <Field label="Reason for Removal" className="reason">
              Medical or humanitarian grounds.
            </Field>
            <img className="divider" src={`${A}/fcfd4.svg`} alt="" />
            <div className="comment">
              <label>Comment / Justification</label>
              <p>
                The Applicant has some Medical issues and has provided the supporting document that
                proves his claim.
              </p>
            </div>
          </div>
          <div className="attachments">
            <div className="attach-title">Supporting documents (Optional)</div>
            <div className="files">
              <FileCard name="Medical_Report.pdf" />
              <FileCard name="Salary_Certificate.pdf" />
            </div>
          </div>
        </section>
      </main>

      <div className="actionbar">
        <div className="wrap actions">
          <button
            className="round-button outline"
            type="button"
            onClick={() => notify("Request cancelled")}
          >
            Cancel
          </button>
          <button
            className="round-button fill"
            type="button"
            onClick={() => notify("Returning to applications list")}
          >
            Back To List
          </button>
          <button
            className="plus"
            type="button"
            aria-label="More actions"
            onClick={() => notify("More actions")}
          >
            +
          </button>
        </div>
      </div>
      <footer>
        <div className="wrap foot">
          <div className="copyright">
            <img src={`${A}/1f745.svg`} alt="" />
            <span>All rights reserved to Abu Dhabi Social Support Authority © 2024</span>
          </div>
          <div className="preferences">
            <div className="toggle">
              <button className="selected" type="button">
                English
              </button>
              <button type="button" onClick={() => notify("Arabic language selected")}>
                العربية
              </button>
            </div>
            <div className="toggle">
              <button
                className={!dark ? "selected" : ""}
                type="button"
                onClick={() => setDark(false)}
              >
                Light
              </button>
              <button
                className={dark ? "selected" : ""}
                type="button"
                onClick={() => setDark(true)}
              >
                Dark
              </button>
            </div>
          </div>
        </div>
      </footer>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </div>
  );
}
