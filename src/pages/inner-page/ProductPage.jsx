import { useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import ProductArt from "../../components/collection/ProductArt";
import { previewProductById } from "../../data/previewProducts";
import { productEnquiry, whatsappLink } from "../../utils/whatsapp";
import { useSite } from "../../context/siteContext";
import { useWishlist } from "../../context/wishlistContext";
import ProductGallery from "./ProductGallery";
import "../../styles/Product.css";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";

// label + product field shown in the details list
const SPECS = [
  ["Category", "category"],
  ["Diamond type", "type"],
  ["Metal", "metal"],
  ["Gemstone", "gemstone"],
  ["Shape", "shape"],
  ["Carat weight", "carat"],
  ["Width (mm)", "width"],
];

// variant details already shown elsewhere on the page, or just shop boilerplate
const HIDDEN_DETAILS = ["width", "metal", "packaging", "weights", "made in"];
const unique = (list) => [...new Set(list.filter(Boolean))];
const aed = (n) => `AED ${Number(n).toLocaleString()}`;

// a row of buttons for choosing one value
function Choice({ label, options, value, onPick, isAvailable = () => true }) {
  return (
    <div className="pd-choice">
      <h2 className="pd-label">
        {label}: <strong>{value}</strong>
      </h2>
      <div className="pd-pills" role="group" aria-label={label}>
        {options.map((o) => (
          <button
            key={o}
            type="button"
            className={`pd-pill ${o === value ? "on" : ""}`}
            aria-pressed={o === value}
            disabled={!isAvailable(o)}
            onClick={() => onPick(o)}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, error, loading } = useAsync(
    () => Promise.resolve(previewProductById(id) || axiosClient.get(`/products/get/${id}`)),
    [id],
  );

  if (loading) return <main className="product"><p className="pd-status">Loading…</p></main>;
  if (error) return <Navigate to="/" replace />;
  return <ProductView key={id} product={product} />;
}

function ProductView({ product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const { publicCategories, content } = useSite();
  const collection = publicCategories.find((c) => c.slug === product.mainCategory);

  // diamond type and metal pick one variant; its photos, price, code and details replace the product's
  const variants = product.variants ?? [];
  const [choice, setChoice] = useState({ type: variants[0]?.type, metal: variants[0]?.metal });
  const types = unique(variants.map((v) => v.type));
  const metals = unique(variants.map((v) => v.metal));
  const variant =
    variants.find((v) => v.type === choice.type && v.metal === choice.metal) ??
    variants.find((v) => v.type === choice.type) ??
    variants[0];
  const hasMetal = (type) => (metal) => variants.some((v) => v.type === type && v.metal === metal);

  // changing the type keeps the metal when that type comes in it, otherwise its first metal
  const pickType = (type) =>
    setChoice({
      type,
      metal: hasMetal(type)(choice.metal) ? choice.metal : variants.find((v) => v.type === type).metal,
    });

  const shown = { ...product, type: variant?.type ?? product.type, metal: variant?.metal ?? product.metal };
  const price = variant?.price ?? product.price;
  const compareAtPrice = variant?.compareAtPrice;
  const images = (variant?.images?.length ? variant.images : (product.images ?? [])).map((src) => ({ src: src, alt: product.name }));
  const specs = SPECS.filter(([, key]) => shown[key] != null && shown[key] !== "");
  const details = Object.entries(variant?.details ?? {}).filter(([k]) => !HIDDEN_DETAILS.includes(k));

  const enquiry = whatsappLink(
    content.contact.whatsapp,
    productEnquiry({
      name: product.name,
      type: shown.type,
      metal: shown.metal,
      url: window.location.href,
    }),
  );

  const toggleSaved = () =>
    toggle({
      id: product.id,
      name: product.name,
      metal: shown.metal,
      image: images[0]?.src,
      to: `/product/${product.id}`,
    });

  const share = async () => {
    const data = { title: product.name, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else await navigator.clipboard.writeText(data.url);
    } catch {
      /* share dismissed or clipboard blocked: nothing to do */
    }
  };

  return (
    <main className="product">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          ...(collection
            ? [{ label: collection.title, to: `/collections/${collection.slug}` }]
            : []),
          { label: product.name },
        ]}
      />

      <div className="pd-layout">
        <ProductGallery
          key={variant?.productCode}
          images={images}
          fallback={<ProductArt metal={shown.metal} />}
        />

        <section className="pd-info">
          <div className="pd-title">
            <h1>{product.name}</h1>
            <button
              className={`pd-icon ${saved ? "on" : ""}`}
              onClick={toggleSaved}
              aria-label="Add to wishlist"
              aria-pressed={saved}
            >
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill={saved ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              >
                <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" />
              </svg>
            </button>
            <button className="pd-icon" onClick={share} aria-label="Share">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="6" cy="12" r="2.5" />
                <circle cx="18" cy="6" r="2.5" />
                <circle cx="18" cy="18" r="2.5" />
                <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
              </svg>
            </button>
          </div>

          {price != null && (
            <p className="pd-price">
              {aed(price)}
              {compareAtPrice > price && <s>{aed(compareAtPrice)}</s>}
            </p>
          )}

          {product.description && <p className="pd-desc">{product.description}</p>}

          {types.length > 0 && (
            <Choice label="Diamond type" options={types} value={choice.type ?? variant.type} onPick={pickType} />
          )}
          {metals.length > 1 && (
            <Choice
              label="Metal"
              options={metals}
              value={variant.metal}
              onPick={(metal) => setChoice({ type: variant.type, metal })}
              isAvailable={hasMetal(variant.type)}
            />
          )}

          {product.preview ? (
            <p className="pd-preview-note">This is a sample product. Real product details will appear here when the collection is added.</p>
          ) : <a className="pd-whatsapp" href={enquiry} target="_blank" rel="noreferrer">
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 20l1.2-4A8 8 0 1 1 8 18.8L4 20Z" />
              <path d="M9.2 8.8c.3 2.6 2.4 4.8 5 5.4l1-1.2-1.6-.9-.7.6c-.9-.3-1.7-1.1-2-2l.6-.7-.9-1.6-1.4.4Z" />
            </svg>
            Enquire on WhatsApp
          </a>}

          {specs.length > 0 && (
            <>
              <h2 className="pd-label">Product details</h2>
              <dl className="pd-specs">
                {specs.map(([label, key]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{shown[key]}</dd>
                  </div>
                ))}
                {variant?.productCode && (
                  <div>
                    <dt>Product code</dt>
                    <dd>{variant.productCode}</dd>
                  </div>
                )}
                {details.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label.charAt(0).toUpperCase() + label.slice(1)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
