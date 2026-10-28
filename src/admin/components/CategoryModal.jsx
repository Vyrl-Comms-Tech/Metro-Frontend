import { useState } from "react";
import { categoriesApi } from "../../api/resources";
import { slugify } from "../../utils/faq";
import Modal from "./Modal";
import Field from "./Field";
import FileField from "./FileField";

const toForm = (c = {}) => ({
  title: c.title ?? "",
  slug: c.slug ?? "",
  subCategories: (c.subCategories ?? []).join(", "),
  description: c.description ?? "",
  tag: c.tag ?? "",
  image: c.image ?? "",
  banner: c.banner ?? "",
  showOnHome: c.showOnHome ?? true,
});

// add / edit dialog; `category` is {} for a new one
export default function CategoryModal({ category, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(category));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const save = async () => {
    const data = {
      title: form.title.trim(),
      slug: slugify(form.slug || form.title),
      subCategories: form.subCategories.split(",").map((s) => s.trim()).filter(Boolean),
      description: form.description.trim(),
      tag: form.tag.trim(),
      image: form.image,
      banner: form.banner,
      showOnHome: form.showOnHome,
    };

    if (category?.id) await categoriesApi.update(category.id, data);
    else await categoriesApi.create({ ...data, order: nextOrder });
    onSaved();
  };

  return (
    <Modal title={category?.id ? "Edit category" : "Add category"} onClose={onClose} onSave={save}>
      <Field label="Title">
        <input value={form.title} onChange={set("title")} required />
      </Field>
      <Field label="Link slug" hint="Used in the page address, e.g. engagement-rings. Leave empty to use the title.">
        <input value={form.slug} onChange={set("slug")} />
      </Field>
      <Field label="Sub-categories" hint="Separate with commas. Products are placed in one of these.">
        <input value={form.subCategories} onChange={set("subCategories")} />
      </Field>
      <div className="ad-grid-2">
        <Field label="Home card text">
          <input value={form.description} onChange={set("description")} />
        </Field>
        <Field label="Home card badge" hint='e.g. "New In"'>
          <input value={form.tag} onChange={set("tag")} />
        </Field>
      </div>
      <FileField label="Home card image" value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />
      <FileField label="Collection page banner" value={form.banner} onChange={(banner) => setForm((f) => ({ ...f, banner }))} />
      <label className="ad-check">
        <input
          type="checkbox"
          checked={form.showOnHome}
          onChange={(e) => setForm((f) => ({ ...f, showOnHome: e.target.checked }))}
        />
        Show on the home page
      </label>
    </Modal>
  );
}
