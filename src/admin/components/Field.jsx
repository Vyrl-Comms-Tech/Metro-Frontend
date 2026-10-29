// labelled form control; pass the input / select / textarea as children
export default function Field({ label, hint, optional, children }) {
  return (
    <label className="ad-field">
      <span>
        {label}
        {optional && <em className="ad-optional"> (optional)</em>}
      </span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
