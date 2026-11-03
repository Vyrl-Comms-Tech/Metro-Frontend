import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import FileField from "./FileField";
import axiosClient from "../../utils/axiosClient";

// add / edit dialog; `item` is {} for a new one
export default function CustomJewelleryModal({ item, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: item.title ?? "",
    image: item.image ?? "",
    video: item.video ?? "",
    active: item.active ?? true,
  });

  const save = async () => {
    if (!form.image && !form.video) throw new Error("Upload an image or a video");
    const data = { title: form.title.trim(), image: form.image, video: form.video, active: form.active };
    if (item.id) await axiosClient.put(`/custom-jewellery/${item.id}`, data);
    else await axiosClient.post("/custom-jewellery", { ...data, order: nextOrder });
    onSaved();
  };

  return (
    <Modal title={item.id ? "Edit item" : "Add item"} onClose={onClose} onSave={save}>
      <Field label="Title (optional)">
        <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
      </Field>
      <FileField
        label="Image"
        hint="Max 2 MB. Also used as the cover when a video is added."
        value={form.image}
        onChange={(image) => setForm((f) => ({ ...f, image }))}
      />
      <FileField
        label="Video (optional)"
        kind="video"
        hint="Plays in place of the image on the website."
        value={form.video}
        onChange={(video) => setForm((f) => ({ ...f, video }))}
      />
      <div className="ad-category-settings">
      <label className="ad-category-setting">
        <span><strong>Active</strong><small>Show this item on the website.</small></span>
        <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
      </label>
      </div>
    </Modal>
  );
}
