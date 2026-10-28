// labelled form control; pass the input / select / textarea as children
export default function Field({ label, hint, children }) {
  return (
    <label className="ad-field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}
