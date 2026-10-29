import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import FileField from "./FileField";
import axiosClient from "../../utils/axiosClient";

// add / edit dialog; `reel` is {} for a new one
export default function ReelModal({ reel, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: reel.name ?? "",
    href: reel.href ?? "",
    video: reel.video ?? "",
    poster: reel.poster ?? "",
  });
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    const data = {
      name: form.name.trim(),
      href: form.href.trim(),
      video: form.video.trim(),
      poster: form.poster,
    };
    if (reel.id) await axiosClient.put(`/reels/${reel.id}`, data);
    else await axiosClient.post('/reels', { ...data, order: nextOrder });
    onSaved();
  };

  return (
    <Modal title={reel.id ? "Edit reel" : "Add reel"} onClose={onClose} onSave={save}>
      <Field label="Instagram reel link" hint="Paste the reel link to show the Instagram player. Instagram controls playback, so link-only reels may require a tap to play.">
        <input type="url" value={form.href} onChange={set("href")} required />
      </Field>
      <Field label="Name (optional)">
        <input value={form.name} onChange={set("name")} />
      </Field>
      <FileField
        label="Video (optional)"
        kind="video"
        hint="Upload the original video for muted autoplay in the carousel. The Instagram link remains the Watch Reel destination."
        value={form.video}
        onChange={(video) => setForm((f) => ({ ...f, video }))}
      />
      <FileField
        label="Poster image (optional)"
        value={form.poster}
        onChange={(poster) => setForm((f) => ({ ...f, poster }))}
      />
    </Modal>
  );
}
