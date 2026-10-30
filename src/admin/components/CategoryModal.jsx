import { useState } from "react";
import Modal from "./Modal";
import Field from "./Field";
import FileField from "./FileField";
import axiosClient from "../../utils/axiosClient";

// a subcategory row in the form: its name and its categories as a comma list
const toRow = (s) =>
  typeof s === "string" ? { title: s, options: "" } : { title: s.title, options: (s.options ?? []).join(", ") };
const fromRow = (r) => ({
  title: r.title.trim(),
  options: r.options.split(",").map((o) => o.trim()).filter(Boolean),
});

const toForm = (c = {}) => ({
  title: c.title ?? "",
  subCategories: (c.subCategories ?? []).map(toRow),
  description: c.description ?? "",
  tag: c.tag ?? "",
  image: c.image ?? "",
  banner: c.banner ?? "",
  showOnHome: c.showOnHome ?? true,
  active: c.active ?? true,
  order: c.order ?? "",
});


export default function CategoryModal({ category, nextOrder, onClose, onSaved }) {
  const [form, setForm] = useState(() => toForm(category));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const setSub = (i, patch) =>
    setForm((f) => ({ ...f, subCategories: f.subCategories.map((r, n) => (n === i ? { ...r, ...patch } : r)) }));

  const save = async () => {
    const data = {
      title: form.title.trim(),
      subCategories: form.subCategories.map(fromRow).filter((s) => s.title),
      description: form.description.trim(),
      tag: form.tag.trim(),
      image: form.image,
      banner: form.banner,
      showOnHome: form.showOnHome,
      active: form.active,
      order: form.order === "" ? nextOrder : Number(form.order),
    };

    if (category?.id) await axiosClient.put(`/categories/update/${category.id}`, data);
    else await axiosClient.post("/categories/createCategory", data);
    onSaved();
  };

  return (
    <Modal title={category?.id ? "Edit category" : "Add category"} onClose={onClose} onSave={save}>
      <div className="ad-category-form">
        <section className="ad-form-group">
          <h3>Collection details</h3>
          <Field label="Category name *">
            <input value={form.title} onChange={set("title")} placeholder="e.g. Loose Diamond" required />
          </Field>
          <Field label="Short description" optional hint="A short line that introduces this collection.">
            <input value={form.description} onChange={set("description")} placeholder="Explore the collection" />
          </Field>
          <div className="ad-subs">
            <span className="ad-subs-title">
              Subcategories <em className="ad-optional">(optional)</em>
            </span>
            {form.subCategories.map((row, i) => (
              <div className="ad-sub-row" key={i}>
                <input
                  value={row.title}
                  onChange={(e) => setSub(i, { title: e.target.value })}
                  placeholder="Name, e.g. Rings"
                  aria-label="Subcategory name"
                />
                <input
                  value={row.options}
                  onChange={(e) => setSub(i, { options: e.target.value })}
                  placeholder="Categories, e.g. Plain, Diamond"
                  aria-label="Categories of this subcategory"
                />
                <button
                  type="button"
                  className="ad-sub-remove"
                  aria-label="Remove subcategory"
                  onClick={() => setForm((f) => ({ ...f, subCategories: f.subCategories.filter((_, n) => n !== i) }))}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              className="ad-btn ghost"
              onClick={() => setForm((f) => ({ ...f, subCategories: [...f.subCategories, { title: "", options: "" }] }))}
            >
              + Add subcategory
            </button>
            <small>The categories are the choices shown under a subcategory when adding a product. Leave them empty if it has none.</small>
          </div>
          <div className="ad-grid-2">
            <Field label="Card badge" optional hint="Such as New In.">
              <input value={form.tag} onChange={set("tag")} placeholder="Optional" />
            </Field>
            <Field label="Display order" optional hint="Lower numbers appear first. Left blank, it goes last.">
              <input type="number" min="0" value={form.order} onChange={set("order")} placeholder={`${nextOrder}`} />
            </Field>
          </div>
        </section>

        <section className="ad-form-group">
          <h3>Images</h3>
          <p>Use clear product photography. You can add images later.</p>
          <div className="ad-grid-2">
            <FileField label="Category card" optional value={form.image} onChange={(image) => setForm((f) => ({ ...f, image }))} />
            <FileField label="Collection banner" optional value={form.banner} onChange={(banner) => setForm((f) => ({ ...f, banner }))} />
          </div>
        </section>

        <section className="ad-form-group ad-form-group-last">
          <h3>Visibility</h3>
          <div className="ad-category-settings">
            <label className="ad-category-setting">
              <span><strong>Show on home page</strong><small>Include this collection in the category section.</small></span>
              <input type="checkbox" checked={form.showOnHome} onChange={(e) => setForm((f) => ({ ...f, showOnHome: e.target.checked }))} />
            </label>
            <label className="ad-category-setting">
              <span><strong>Active</strong><small>Customers can browse this collection.</small></span>
              <input type="checkbox" checked={form.active} onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))} />
            </label>
          </div>
        </section>
      </div>
    </Modal>
  );
}
