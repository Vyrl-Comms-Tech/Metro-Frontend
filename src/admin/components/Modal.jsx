import { useEffect, useId, useRef, useState } from "react";

// Dialog with a form. onSave may be async: the dialog closes when it resolves
// and shows the error message when it throws. Esc and the backdrop also close it.
export default function Modal({
  title,
  onClose,
  onSave,
  saveLabel = "Save",
  children,
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const titleId = useId();
  const formRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    (formRef.current?.querySelector('.ad-modal-body input, .ad-modal-body select, .ad-modal-body textarea')
      ?? formRef.current?.querySelector('button'))?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && !saving) onClose();
      if (e.key !== 'Tab') return;
      const focusable = [...formRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable.at(-1);
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await onSave?.();
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="ad-modal">
      <div className="ad-modal-backdrop" onClick={() => !saving && onClose()} />
      <form
        ref={formRef}
        className="ad-modal-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onSubmit={submit}
      >
        <header>
          <h2 id={titleId}>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" disabled={saving}>
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </header>

        <div className="ad-modal-body">
          {children}
          {error && (
            <p className="ad-error" role="alert">
              {error}
            </p>
          )}
        </div>

        <footer>
          <button type="button" className="ad-btn ghost" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="ad-btn" disabled={saving}>
            {saving ? "Saving…" : saveLabel}
          </button>
        </footer>
      </form>
    </div>
  );
}
