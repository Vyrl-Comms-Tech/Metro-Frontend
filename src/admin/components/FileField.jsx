import { useState } from "react";
import axiosClient from "../../utils/axiosClient";

// Uploads the chosen file straight away and reports its stored path via onChange.
// `value` is the current path or URL; kind is "image" or "video".
export default function FileField({ label, hint, optional, value, onChange, kind = "image" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const form = new FormData();
      form.append("files", file);
      const { urls: [url] } = await axiosClient.post("/uploads", form);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <div className="ad-field">
      <span>
        {label}
        {optional && <em className="ad-optional"> (optional)</em>}
      </span>
      <label className={`ad-upload ${busy ? 'is-busy' : ''}`}>
        <input type="file" accept={`${kind}/*`} onChange={pick} disabled={busy} aria-label={`Upload ${label}`} />
        <span className="ad-upload-icon" aria-hidden="true">↑</span>
        <span className="ad-upload-copy">
          <strong>{busy ? 'Uploading…' : value ? `Replace ${kind}` : `Choose ${kind}`}</strong>
          <small>{kind === 'image' ? 'JPG, PNG or WebP' : 'Video file'}</small>
        </span>
      </label>
      {hint && <small>{hint}</small>}
      {error && <small className="ad-error-text" role="alert">{error}</small>}
      {value && (
        <span className="ad-file-current">
          {kind === "image" ? (
            <img src={value} alt="" />
          ) : (
            <a href={value} target="_blank" rel="noreferrer">
              Current video
            </a>
          )}
          <button type="button" onClick={() => onChange("")}>
            Remove
          </button>
        </span>
      )}
    </div>
  );
}
