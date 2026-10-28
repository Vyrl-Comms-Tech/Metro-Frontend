import { useState } from "react";
import { GEMSTONES, METALS, SHAPES, TYPES } from "../../data/collections";
import { useSite } from "../../context/siteContext";
import { assetUrl, uploadFiles } from "../../api/client";
import { createProduct, updateProduct } from "../../api/products";
import Modal from "./Modal";
import Field from "./Field";

const toForm = (p = {}, defaultSlug = "") => ({
  name: p.name ?? "",
  collectionSlug: p.collectionSlug ?? defaultSlug,
  category: p.category ?? "",
  type: p.type ?? "",
  metal: p.metal ?? "",
  gemstone: p.gemstone ?? "",
  shape: p.shape ?? "",
  carat: p.carat ?? "",
  width: p.width ?? "",
  description: p.description ?? "",
});

// empty optional fields are sent as null so they clear on update
const text = (v) => v.trim() || null;
const num = (v) => (v === "" ? null : Number(v));

const Select = ({ value, onChange, options, blank }) => (
  <select value={value} onChange={onChange}>
    {blank && <option value="">{blank}</option>}
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

// add / edit dialog; `product` is null-ish for a new product
export default function ProductModal({ product, onClose, onSaved }) {
  const { categories: collections } = useSite();
  const [form, setForm] = useState(() => toForm(product, collections[0]?.slug));
  const [images, setImages] = useState(product?.images ?? []); // already uploaded
  const [files, setFiles] = useState([]); // chosen but not uploaded yet

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const subCategories =
    collections.find((c) => c.slug === form.collectionSlug)?.subCategories ?? [];

  const save = async () => {
    const uploaded = await uploadFiles(files);
    const data = {
      name: form.name.trim(),
      collectionSlug: form.collectionSlug,
      category: text(form.category),
      type: text(form.type),
      metal: text(form.metal),
      gemstone: text(form.gemstone),
      shape: text(form.shape),
      carat: num(form.carat),
      width: num(form.width),
      description: text(form.description),
      images: [...images, ...uploaded],
    };

    if (product?.id) await updateProduct(product.id, data);
    else await createProduct(data);
    onSaved();
  };

  return (
    <Modal
      title={product?.id ? "Edit product" : "Add product"}
      onClose={onClose}
      onSave={save}
    >
      <Field label="Name">
        <input value={form.name} onChange={set("name")} required />
      </Field>

      <div className="ad-grid-2">
        <Field label="Collection">
          <select
            value={form.collectionSlug}
            onChange={(e) =>
              setForm((f) => ({ ...f, collectionSlug: e.target.value, category: "" }))
            }
          >
            {collections.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Category">
          <Select value={form.category} onChange={set("category")} options={subCategories} blank="None" />
        </Field>
        <Field label="Diamond type">
          <Select value={form.type} onChange={set("type")} options={TYPES} blank="None" />
        </Field>
        <Field label="Metal">
          <Select value={form.metal} onChange={set("metal")} options={METALS} blank="None" />
        </Field>
        <Field label="Gemstone">
          <Select value={form.gemstone} onChange={set("gemstone")} options={GEMSTONES} blank="None" />
        </Field>
        <Field label="Shape">
          <Select value={form.shape} onChange={set("shape")} options={SHAPES} blank="None" />
        </Field>
        <Field label="Carat weight">
          <input type="number" min="0" step="0.01" value={form.carat} onChange={set("carat")} />
        </Field>
        <Field label="Width (mm)">
          <input type="number" min="0" step="0.1" value={form.width} onChange={set("width")} />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows="4" value={form.description} onChange={set("description")} />
      </Field>

      <Field label="Images" hint="The first image is the main photo. JPG, PNG or WebP, up to 8 MB each.">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFiles([...files, ...e.target.files])}
        />
      </Field>

      {(images.length > 0 || files.length > 0) && (
        <ul className="ad-previews">
          {images.map((src) => (
            <li key={src}>
              <img src={assetUrl(src)} alt="" />
              <button type="button" aria-label="Remove image" onClick={() => setImages(images.filter((i) => i !== src))}>
                ×
              </button>
            </li>
          ))}
          {files.map((f, i) => (
            <li key={`${f.name}-${i}`}>
              <img src={URL.createObjectURL(f)} alt="" />
              <button type="button" aria-label="Remove image" onClick={() => setFiles(files.filter((_, n) => n !== i))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </Modal>
  );
}
