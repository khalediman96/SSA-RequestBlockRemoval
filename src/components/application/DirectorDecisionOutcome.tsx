import { DIRECTOR_DECISION_OPTIONS, type DirectorOutcomeDecision } from "@/components/application/directorDecisionOptions";

const COMMENT_MAX = 1000;

type Props = {
  decision: DirectorOutcomeDecision;
  comment?: string;
};

export function DirectorDecisionOutcome({ decision, comment }: Props) {
  const commentValue = comment?.trim() ?? "";
  const showComments = decision === "reject" || decision === "sendback";

  return (
    <section className="app-details__form-panel director-decision-form director-decision-form--readonly">
      <div className="director-decision-form__intro">
        <h2 className="director-decision-form__title">Your decision</h2>
      </div>

      <div className="director-decision-form__options" role="group" aria-label="Recorded director decision">
        {DIRECTOR_DECISION_OPTIONS.map((opt) => (
          <div
            key={opt.value}
            className={`director-decision-form__card${
              decision === opt.value ? " director-decision-form__card--selected" : ""
            } director-decision-form__card--disabled`}
            aria-current={decision === opt.value ? "true" : undefined}
          >
            <span className="director-decision-form__card-radio" aria-hidden="true" />
            <span className="director-decision-form__card-copy">
              <span className="director-decision-form__card-title">{opt.title}</span>
              <span className="director-decision-form__card-desc">{opt.desc}</span>
            </span>
          </div>
        ))}
      </div>

      {showComments ? (
        <div className="app-details__field director-decision-form__comments director-decision-form__comments--readonly">
          <span className="app-details__form-label">
            Director comment <span className="required">*</span>
          </span>
          <div className="app-details__textarea-wrap app-details__textarea-wrap--readonly">
            <textarea
              rows={4}
              value={commentValue}
              readOnly
              disabled
              aria-readonly="true"
              className="director-decision-form__readonly-textarea"
            />
          </div>
          <div className="app-details__char-row app-details__char-row--labeled">
            <span className="app-details__char-label">Characters</span>
            <span>{commentValue.length}</span>
            <span>/</span>
            <span>{COMMENT_MAX}</span>
          </div>
        </div>
      ) : commentValue ? (
        <div className="app-details__field director-decision-form__comments director-decision-form__comments--readonly">
          <span className="app-details__form-label">
            Director comment <span className="optional">(Optional)</span>
          </span>
          <div className="app-details__textarea-wrap app-details__textarea-wrap--readonly">
            <textarea
              rows={4}
              value={commentValue}
              readOnly
              disabled
              aria-readonly="true"
              className="director-decision-form__readonly-textarea"
            />
          </div>
          <div className="app-details__char-row app-details__char-row--labeled">
            <span className="app-details__char-label">Characters</span>
            <span>{commentValue.length}</span>
            <span>/</span>
            <span>{COMMENT_MAX}</span>
          </div>
        </div>
      ) : null}
    </section>
  );
}