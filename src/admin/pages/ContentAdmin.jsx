import { useState } from "react";
import { useSite } from "../../context/siteContext";
import PageHeader from "../components/PageHeader";
import Field from "../components/Field";
import FileField from "../components/FileField";
import axiosClient from "../../utils/axiosClient";

// each block is one editable part of the public site; `name` is the key inside the block
const BLOCKS = [
  {
    key: "homeBanner",
    title: "Home banner",
    fields: [
      { name: "heading", label: "Heading" },
      { name: "buttonText", label: "Button text" },
      { name: "image", label: "Banner image", type: "image", hint: "Leave empty to use the default photo." },
    ],
  },
  {
    key: "contact",
    title: "Contact details",
    fields: [
      { name: "whatsapp", label: "WhatsApp number", hint: "Digits only, with country code. Enquiries are sent here." },
      { name: "email", label: "Email" },
      { name: "phone", label: "Phone" },
      { name: "address", label: "Address", long: true, hint: "One line per row." },
    ],
  },
  {
    key: "hours",
    title: "Opening hours",
    fields: [
      { name: "weekdays", label: "Monday to Friday" },
      { name: "weekend", label: "Saturday and Sunday" },
    ],
  },
  {
    key: "footer",
    title: "Footer",
    fields: [
      { name: "newsletterText", label: "Newsletter text", long: true },
      { name: "instagram", label: "Instagram link" },
    ],
  },
];

export default function ContentAdmin() {
  const { content, loaded, reload } = useSite();

  return (
    <>
      <PageHeader title="Website Content" text="Edit the text, images and contact details shown on the site." />

      {!loaded ? (
        <p className="ad-empty">Loading…</p>
      ) : (
        BLOCKS.map((block) => (
          <ContentBlock key={block.key} block={block} saved={content[block.key]} onSaved={reload} />
        ))
      )}
    </>
  );
}

// one card with its own form and Save button; saves just this block
function ContentBlock({ block, saved, onSaved }) {
  const { content } = useSite();
  const [values, setValues] = useState(saved);
  const [status, setStatus] = useState({ busy: false, message: "", error: false });

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    setStatus({ busy: false, message: "", error: false });
  };

  const save = async (e) => {
    e.preventDefault();
    setStatus({ busy: true, message: "", error: false });
    try {
      await axiosClient.put('/content', { ...content, [block.key]: values });
      onSaved();
      setStatus({ busy: false, message: "Saved", error: false });
    } catch (err) {
      setStatus({ busy: false, message: err.message, error: true });
    }
  };

  return (
    <form className="ad-card" onSubmit={save}>
      <h2>{block.title}</h2>
      <div className="ad-grid-2">
        {block.fields.map((f) =>
          f.type === "image" ? (
            <FileField
              key={f.name}
              label={f.label}
              hint={f.hint}
              value={values[f.name]}
              onChange={(url) => set(f.name, url)}
            />
          ) : (
            <Field key={f.name} label={f.label} hint={f.hint}>
              {f.long ? (
                <textarea rows="4" value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
              ) : (
                <input value={values[f.name]} onChange={(e) => set(f.name, e.target.value)} />
              )}
            </Field>
          ),
        )}
      </div>
      <div className="ad-card-foot">
        {status.message && (
          <span className={status.error ? "ad-error-text" : "ad-saved"} role="status">
            {status.message}
          </span>
        )}
        <button type="submit" className="ad-btn" disabled={status.busy}>
          {status.busy ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
