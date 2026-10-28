import { useState } from "react";
import { assetUrl, uploadFiles } from "../../api/client";
import Field from "./Field";

// Uploads the chosen file straight away and reports its stored path via onChange.
// `value` is the current path or URL; kind is "image" or "video".
export default function FileField({ label, hint, value, onChange, kind = "image" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const pick = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      const [url] = await uploadFiles([file]);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  return (
    <Field label={label} hint={busy ? "Uploading…" : hint}>
      <input type="file" accept={`${kind}/*`} onChange={pick} disabled={busy} />
      {error && <small className="ad-error-text">{error}</small>}
      {value && (
        <span className="ad-file-current">
          {kind === "image" ? (
            <img src={assetUrl(value)} alt="" />
          ) : (
            <a href={assetUrl(value)} target="_blank" rel="noreferrer">
              Current video
            </a>
          )}
          <button type="button" onClick={() => onChange("")}>
            Remove
          </button>
        </span>
      )}
    </Field>
  );
}
