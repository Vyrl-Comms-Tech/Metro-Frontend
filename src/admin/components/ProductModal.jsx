import { useState } from "react";
import { GEMSTONES, METALS, PENDANT_TYPES, SHAPES, TYPES } from "../../data/collections";
import { useSite } from "../../context/siteContext";
import axiosClient from "../../utils/axiosClient";
import Modal from "./Modal";
import Field from "./Field";

const GENDERS = ["Male", "Female"];
const RING_COVERINGS = ["Half Eternity", "3/4 Eternity", "Full Eternity"];
const METAL_CODES = { white: "WG", yellow: "YG", rose: "RG", platinum: "PL" };

const metalCode = (metal) =>
  METAL_CODES[Object.keys(METAL_CODES).find((k) => metal.toLowerCase().includes(k))];

// a subcategory is { title, options }; older data may still be a plain string
const subTitle = (s) => (typeof s === "string" ? s : s.title);
const subOptions = (s) => (typeof s === "string" ? [] : (s.options ?? []));

const emptyVariant = () => ({ type: "", metal: METALS[0], productCode: "", price: "", compareAtPrice: "", images: [], files: [] });

const toVariant = (v) => ({
  ...v, // keeps details / sourceUrl of an existing variant
  type: v.type ?? "",
  price: v.price ?? "",
  compareAtPrice: v.compareAtPrice ?? "",
  images: v.images ?? [],
  files: [],
});

const toForm = (p = {}, defaultMain = "") => ({
  name: p.name ?? "",
  mainCategory: p.mainCategory ?? defaultMain,
  subCategory: p.subCategory ?? "",
  category: p.category ?? "",
  gemstone: p.gemstone ?? "",
  shape: p.shape ?? "",
  carat: p.carat ?? "",
  width: p.width ?? "",
  gender: p.gender ?? "",
  ringCovering: p.ringCovering ?? "",
  pendantType: p.pendantType ?? "",
  description: p.description ?? "",
});

// empty optional fields are sent as null so they clear on update
const text = (v) => v.trim() || null;
const num = (v) => (v === "" ? null : Number(v));

const Select = ({ value, onChange, options, blank, ...rest }) => (
  <select value={value} onChange={onChange} {...rest}>
    {blank && <option value="">{blank}</option>}
    {options.map((o) => (
      <option key={o}>{o}</option>
    ))}
  </select>
);

async function upload(files) {
  if (!files.length) return [];
  const body = new FormData();
  files.forEach((f) => body.append("files", f));
  const { urls } = await axiosClient.post("/uploads", body);
  return urls;
}

// add / edit dialog; `product` is null-ish for a new product
export default function ProductModal({ product, onClose, onSaved }) {
  const { categories: mains } = useSite();
  const [form, setForm] = useState(() => toForm(product, mains[0]?.slug));
  const [variants, setVariants] = useState(() =>
    product?.variants?.length ? product.variants.map(toVariant) : [emptyVariant()],
  );

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  // main category > sub category > category, each list comes from the Categories page
  const subs = mains.find((c) => c.slug === form.mainCategory)?.subCategories ?? [];
  const options = subOptions(subs.find((s) => subTitle(s) === form.subCategory) ?? "");
  const isRing = form.subCategory === "Rings";
  const isNecklace = form.subCategory === "Necklaces";

  const setVariant = (i, patch) => setVariants((list) => list.map((v, n) => (n === i ? { ...v, ...patch } : v)));

  const save = async () => {
    if (!form.name.trim()) throw new Error("Name is required");
    if (subs.length && !form.subCategory) throw new Error("Choose a sub category");
    if (options.length && !form.category) throw new Error("Choose a category");
    if (variants.some((v) => !v.productCode.trim() || v.price === "")) {
      throw new Error("Every variant needs a product code and a price");
    }

    const saved = [];
    for (const v of variants) {
      const { files, images, ...rest } = v;
      saved.push({
        ...rest,
        type: text(v.type),
        productCode: v.productCode.trim(),
        metalCode: metalCode(v.metal),
        price: num(v.price),
        compareAtPrice: num(v.compareAtPrice),
        images: [...images, ...(await upload(files))],
      });
    }

    const data = {
      name: form.name.trim(),
      mainCategory: form.mainCategory,
      subCategory: text(form.subCategory),
      category: text(form.category),
      gemstone: text(form.gemstone),
      shape: text(form.shape),
      carat: num(form.carat),
      width: num(form.width),
      gender: isRing ? text(form.gender) : null,
      ringCovering: isRing ? text(form.ringCovering) : null,
      pendantType: isNecklace ? text(form.pendantType) : null,
      description: text(form.description),
      variants: saved, // price, metal, type and photos of the product itself come from the first variant
    };

    if (product?.id) await axiosClient.put(`/products/update/${product.id}`, data);
    else await axiosClient.post("/products/create", data);
    onSaved();
  };

  return (
    <Modal title={product?.id ? "Edit product" : "Add product"} onClose={onClose} onSave={save}>
      <Field label="Name">
        <input value={form.name} onChange={set("name")} required />
      </Field>

      <div className="ad-grid-2">
        <Field label="Main category">
          <select
            value={form.mainCategory}
            onChange={(e) => setForm((f) => ({ ...f, mainCategory: e.target.value, subCategory: "", category: "" }))}
          >
            {mains.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.title}
              </option>
            ))}
          </select>
        </Field>
        {subs.length > 0 && (
          <Field label="Sub category">
            <Select
              value={form.subCategory}
              onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value, category: "" }))}
              options={subs.map(subTitle)}
              blank="Choose…"
            />
          </Field>
        )}
        {options.length > 0 && (
          <Field label="Category">
            <Select value={form.category} onChange={set("category")} options={options} blank="Choose…" />
          </Field>
        )}
        {isRing && (
          <>
            <Field label="Gender">
              <Select value={form.gender} onChange={set("gender")} options={GENDERS} blank="None" />
            </Field>
            <Field label="Ring covering">
              <Select value={form.ringCovering} onChange={set("ringCovering")} options={RING_COVERINGS} blank="None" />
            </Field>
          </>
        )}
        {isNecklace && (
          <Field label="Pendant type" optional>
            <Select value={form.pendantType} onChange={set("pendantType")} options={PENDANT_TYPES} blank="None" />
          </Field>
        )}
        <Field label="Gemstone" optional>
          <Select value={form.gemstone} onChange={set("gemstone")} options={GEMSTONES} blank="None" />
        </Field>
        <Field label="Shape" optional>
          <Select value={form.shape} onChange={set("shape")} options={SHAPES} blank="None" />
        </Field>
        <Field label="Carat weight" optional>
          <input type="number" min="0" step="0.01" value={form.carat} onChange={set("carat")} />
        </Field>
        <Field label="Width (mm)" optional>
          <input type="number" min="0" step="0.1" value={form.width} onChange={set("width")} />
        </Field>
      </div>

      <Field label="Description" optional>
        <textarea rows="3" value={form.description} onChange={set("description")} />
      </Field>

      <h3 className="ad-variants-title">Variants</h3>
      <p className="ad-variants-hint">
        One row for each diamond type and metal, e.g. Lab Grown in White Gold. The first variant sets the price and photo shown in the shop.
      </p>

      {variants.map((v, i) => (
        <div className="ad-variant" key={i}>
          <div className="ad-variant-head">
            <strong>
              Variant {i + 1}
              {v.productCode && ` · ${v.productCode}`}
            </strong>
            {variants.length > 1 && (
              <button type="button" className="ad-btn ghost" onClick={() => setVariants(variants.filter((_, n) => n !== i))}>
                Remove
              </button>
            )}
          </div>
          <div className="ad-grid-2">
            <Field label="Diamond type" optional hint="Lab Grown or Natural. Leave as None for pieces without one.">
              <Select value={v.type} onChange={(e) => setVariant(i, { type: e.target.value })} options={TYPES} blank="None" />
            </Field>
            <Field label="Metal">
              <Select value={v.metal} onChange={(e) => setVariant(i, { metal: e.target.value })} options={METALS} />
            </Field>
            <Field label="Product code">
              <input value={v.productCode} onChange={(e) => setVariant(i, { productCode: e.target.value })} />
            </Field>
            <Field label="Price (AED)">
              <input type="number" min="0" value={v.price} onChange={(e) => setVariant(i, { price: e.target.value })} />
            </Field>
            <Field label="Compare price (AED)" optional hint="Shown struck through when on sale.">
              <input type="number" min="0" value={v.compareAtPrice} onChange={(e) => setVariant(i, { compareAtPrice: e.target.value })} />
            </Field>
            <Field label="Photos" optional hint="The first photo is the main one.">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setVariant(i, { files: [...v.files, ...e.target.files] })}
              />
            </Field>
          </div>

          {(v.images.length > 0 || v.files.length > 0) && (
            <ul className="ad-previews">
              {v.images.map((src) => (
                <li key={src}>
                  <img src={src} alt="" />
                  <button type="button" aria-label="Remove photo" onClick={() => setVariant(i, { images: v.images.filter((s) => s !== src) })}>
                    ×
                  </button>
                </li>
              ))}
              {v.files.map((f, n) => (
                <li key={`${f.name}-${n}`}>
                  <img src={URL.createObjectURL(f)} alt="" />
                  <button type="button" aria-label="Remove photo" onClick={() => setVariant(i, { files: v.files.filter((_, k) => k !== n) })}>
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}

        </div>
      ))}

      <button type="button" className="ad-btn ghost ad-add-variant" onClick={() => setVariants([...variants, emptyVariant()])}>
        + Add variant
      </button>
    </Modal>
  );
}
