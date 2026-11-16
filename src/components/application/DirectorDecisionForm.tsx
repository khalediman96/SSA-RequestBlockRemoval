import { DIRECTOR_DECISION_OPTIONS } from "@/components/application/directorDecisionOptions";
import type { FormEvent } from "react";
import type { DirectorDecision } from "@/types/workflow";

type CharField = {
  value: string;
  count: number;
  max: number;
  onChange: (value: string) => void;
};

type Props = {
  formId: string;
  decision: DirectorDecision;
  onDecision: (value: DirectorDecision) => void;
  decisionError: boolean;
  comments: CharField;
  commentsError: boolean;
  onCommentsInput: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

export function DirectorDecisionForm({
  formId,
  decision,
  onDecision,
  decisionError,
  comments,
  commentsError,
  onCommentsInput,
  onSubmit,
}: Props) {
  const showComments = decision === "reject" || decision === "sendback";

  return (
    <form
      id={formId}
      className="app-details__form-panel director-decision-form"
      onSubmit={onSubmit}
      noValidate
    >
      <div className="director-decision-form__intro">
        <h2 className="director-decision-form__title">Your decision</h2>
        <p className="director-decision-form__hint">Comments are required to Reject or Send Back.</p>
      </div>

      <div
        className="director-decision-form__options"
        role="radiogroup"
        aria-label="Director decision"
        aria-invalid={decisionError || undefined}
      >
        {DIRECTOR_DECISION_OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`director-decision-form__card${
              decision === opt.value ? " director-decision-form__card--selected" : ""
            }`}
          >
            <input
              type="radio"
              name="director-decision"
              value={opt.value}
              checked={decision === opt.value}
              onChange={() => onDecision(opt.value)}
            />
            <span className="director-decision-form__card-radio" aria-hidden="true" />
            <span className="director-decision-form__card-copy">
              <span className="director-decision-form__card-title">{opt.title}</span>
              <span className="director-decision-form__card-desc">{opt.desc}</span>
            </span>
          </label>
        ))}
      </div>
      {decisionError ? (
        <p className="app-details__field-error">Select approve, reject, or send back before confirming.</p>
      ) : null}

      <div
        className={`director-decision-form__comments-reveal${
          showComments ? " director-decision-form__comments-reveal--open" : ""
        }`}
        aria-hidden={showComments ? undefined : true}
      >
        <div className="director-decision-form__comments-reveal-inner">
          <div className="app-details__field director-decision-form__comments">
            <span className="app-details__form-label">
              Director comment <span className="required">*</span>
            </span>
            <div
              className={`app-details__textarea-wrap${
                commentsError ? " app-details__textarea-wrap--error" : ""
              }`}
            >
              <textarea
                rows={4}
                placeholder="Add any details the section head should know."
                value={comments.value}
                onChange={(e) => onCommentsInput(e.target.value)}
                aria-invalid={commentsError || undefined}
                disabled={!showComments}
                tabIndex={showComments ? 0 : -1}
              />
            </div>
            {commentsError && showComments ? (
              <p className="app-details__field-error">Comments are required when returning or rejecting.</p>
            ) : null}
            <div className="app-details__char-row app-details__char-row--labeled">
              <span className="app-details__char-label">Characters</span>
              <span>{comments.count}</span>
              <span>/</span>
              <span>{comments.max}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}