import { useEffect, useState } from "react";

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

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      <div className="ad-modal-backdrop" onClick={onClose} />
      <form
        className="ad-modal-box"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onSubmit={submit}
      >
        <header>
          <h2>{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close">
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
          <button type="button" className="ad-btn ghost" onClick={onClose}>
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
