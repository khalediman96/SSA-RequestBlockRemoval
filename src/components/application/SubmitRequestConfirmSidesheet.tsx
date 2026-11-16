import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

export type SubmitRequestConfirmSidesheetProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
};

export function SubmitRequestConfirmSidesheet({
  open,
  onClose,
  onConfirm,
  title = "Submit Request?",
  description = "Are you sure you want to submit this request?",
  confirmLabel = "Yes",
}: SubmitRequestConfirmSidesheetProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open]);

  if (!open) return null;

  return createPortal(
    <div className="submit-sidesheet-root">
      <button
        type="button"
        className="submit-sidesheet__backdrop"
        aria-label="Close confirmation"
        onClick={onClose}
      />
      <div
        className="submit-sidesheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className="submit-sidesheet__header">
          <button type="button" className="submit-sidesheet__close" onClick={onClose} aria-label="Close">
            <img src="/submit-sidesheet-close.svg" alt="" width={24} height={24} aria-hidden />
          </button>
        </div>

        <div className="submit-sidesheet__body">
          <div className="submit-sidesheet__icon-wrap" aria-hidden>
            <img
              src="/submit-confirm-notice.svg"
              alt=""
              width={40}
              height={40}
              className="submit-sidesheet__icon"
            />
          </div>
          <div className="submit-sidesheet__copy">
            <h2 id={titleId} className="submit-sidesheet__title">
              {title}
            </h2>
            <p className="submit-sidesheet__description">{description}</p>
          </div>
        </div>

        <div className="submit-sidesheet__footer">
          <div className="submit-sidesheet__actions">
            <button type="button" className="submit-sidesheet__btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button
              type="button"
              className="submit-sidesheet__btn-yes"
              onClick={() => {
                onConfirm();
                onClose();
              }}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}