import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  BadgeCheck,
  Box,
  Gift,
  HelpCircle,
  ScrollText,
  Share2,
  Star,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Breadcrumb from "../../components/Breadcrumb";
import ProductArt from "../../components/collection/ProductArt";
import { previewProductById } from "../../data/previewProducts";
import { productEnquiry, whatsappLink } from "../../utils/whatsapp";
import { useSite } from "../../context/siteContext";
import { useWishlist } from "../../context/wishlistContext";
import ProductGallery from "./ProductGallery";
import RingOptions from "./RingOptions";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";
import { productPath } from "../../utils/productPath";
import "../../styles/Product.css";

const CARAT_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10];

const unique = (values) => [
  ...new Set(values.filter((value) => value != null && value !== "")),
];
const productId = (product) => product.id ?? product._id;

function ProductPageSkeleton() {
  return (
    <main className="product" aria-busy="true" aria-label="Loading product">
      <div className="pd-layout pd-skeleton">
        <div className="pd-gallery">
          <div className="pd-thumbs">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} height={74} />
            ))}
          </div>
          <Skeleton className="pd-stage-skeleton" />
        </div>
        <div className="pd-info">
          <Skeleton height={24} width="85%" />
          <div className="pd-skeleton-gap">
            <Skeleton height={42} count={2} />
          </div>
          <div className="pd-skeleton-gap">
            <Skeleton height={18} width="35%" />
            <Skeleton height={42} />
          </div>
          <div className="pd-skeleton-gap">
            <Skeleton height={18} width="35%" />
            <Skeleton height={42} />
          </div>
          <div className="pd-skeleton-gap">
            <Skeleton height={44} count={2} />
          </div>
          <div className="pd-skeleton-gap">
            <Skeleton height={48} count={4} />
          </div>
        </div>
      </div>
    </main>
  );
}

function DetailRow({ title, icon: Icon, children }) {
  return (
    <details className="pd-detail">
      <summary>
        <Icon size={18} strokeWidth={1.5} />
        <span>{title}</span>
        <span className="pd-plus" aria-hidden="true" />
      </summary>
      <div className="pd-detail-body">{children}</div>
    </details>
  );
}

export default function ProductPage() {
  const { id, option: slug } = useParams(); // /collections/necklaces/<slug>, or the older /product/<id>
  const {
    data: product,
    error,
    loading,
  } = useAsync(
    () =>
      slug
        ? axiosClient.get(`/products/slug/${slug}`)
        : Promise.resolve(previewProductById(id) || axiosClient.get(`/products/get/${id}`)),
    [id, slug],
  );

  if (loading) return <ProductPageSkeleton />;
  if (error || !product)
    return (
      <main className="product">
        <p className="pd-status" role="alert">
          {error?.message ?? "Product not found."}
        </p>
      </main>
    );
  return <ProductView key={productId(product)} product={product} slug={slug} />;
}

function ProductView({ product, slug }) {
  const { has, toggle } = useWishlist();
  const { publicCategories, content } = useSite();
  const id = productId(product);
  const saved = has(id);
  const collection = publicCategories.find(
    (category) => category.slug === product.mainCategory,
  );
  const variants = product.variants?.length ? product.variants : [product];
  // the address names the variation: its slug, or (older links) ?code=<product code>
  const [searchParams] = useSearchParams();
  const [selectedIndex, setSelectedIndex] = useState(() =>
    Math.max(
      0,
      variants.findIndex((item) =>
        slug ? item.slug === slug : item.productCode === searchParams.get("code"),
      ),
    ),
  );
  const [added, setAdded] = useState(false);
  const isRing = product.subCategory === "Rings";
  const [ring, setRing] = useState({ country: "", size: "", engraving: "" });
  const variant = variants[selectedIndex] ?? variants[0];
  const variantName = variant.name ?? product.name;
  // tennis bracelets up to 10ct list the carat weights; bigger ones don't
  const showCarats =
    /tennis/i.test(`${product.category} ${product.subCategory}`) &&
    Number(variant.carat ?? product.carat) <= CARAT_OPTIONS[CARAT_OPTIONS.length - 1];
  const types = unique(variants.map((item) => item.type ?? product.type));
  const metals = unique(variants.map((item) => item.metal ?? product.metal));
  const selectedType = variant.type ?? product.type;
  const selectedCarat = variant.carat ?? product.carat;
  const selectedMetal = variant.metal ?? product.metal;
  const price = variant.price ?? product.price;
  const images = (
    variant.images?.length ? variant.images : (product.images ?? [])
  ).map((src) => ({ src, alt: variantName }));
  const details = variant.details ?? {};
  const specs = [
    ["Category", product.subCategory ?? product.category],
    ["Diamond type", selectedType],
    ["Carat weight", selectedCarat != null ? `${selectedCarat}ct` : null],
    ["Gemstone", product.gemstone],
    ["Width", product.width != null ? `${product.width}mm` : null],
    ["Metal", selectedMetal],
    ["Product code", variant.productCode],
    ...Object.entries(details)
      .filter(([key]) => !["width", "metal"].includes(key.toLowerCase()))
      .map(([key, value]) => [key, value]),
  ].filter(([, value]) => value != null && value !== "");

  const navigate = useNavigate();
  const [missingCarat, setMissingCarat] = useState(null);

  const pickCarat = async (carat) => {
    if (carat === Number(selectedCarat)) return;
    const baseName = (name) => name.replace(/^\d+(\.\d+)?ct\s+/i, "");
    try {
      const { items } = await axiosClient.get("/products/getAll", {
        params: {
          mainCategory: product.mainCategory,
          category: product.category,
          caratMin: carat,
          caratMax: carat,
          limit: 100,
        },
      });
   
      const hasType = (item) => item.variants?.some((v) => v.type === selectedType);
      const pool = items.some(hasType) ? items.filter(hasType) : items;
      const match =
        pool.find((item) => baseName(item.name) === baseName(product.name)) ??
        pool.find((item) => item.shape === product.shape) ??
        pool[0];
      if (!match) return setMissingCarat(carat);
      const ofType = match.variants.filter((v) => v.type === selectedType);
      const target = ofType.find((v) => v.metal === selectedMetal) ?? ofType[0] ?? match.variants[0];
      navigate(productPath(match, target));
    } catch {
      setMissingCarat(carat);
    }
  };

  const choose = (key, value) => {
    const selected = variants.findIndex(
      (item) =>
        (item[key] ?? product[key]) === value &&
        (key === "metal" || (item.metal ?? product.metal) === selectedMetal) &&
        (key === "type" || (item.type ?? product.type) === selectedType),
    );
    const fallback = variants.findIndex(
      (item) => (item[key] ?? product[key]) === value,
    );
    const next = Math.max(0, selected >= 0 ? selected : fallback);
    setSelectedIndex(next);
    // update the address without reloading the product
    window.history.replaceState(null, "", productPath(product, variants[next]));
    setAdded(false);
  };

  const enquiry = whatsappLink(
    content.contact.whatsapp,
    productEnquiry({
      name: variantName,
      type: selectedType,
      metal: selectedMetal,
      url: window.location.href,
    }),
  );
  const discountLink = whatsappLink(
    content.contact.whatsapp,
    `Hello, could you check the best price for ${variantName} (${selectedType ?? ""}, ${selectedMetal ?? ""}, ${variant.productCode ?? id})? ${window.location.href}`,
  );

  const addToCart = () => {
    const item = {
      id,
      productCode: variant.productCode ?? id,
      name: variantName,
      type: selectedType,
      metal: selectedMetal,
      carat: selectedCarat,
      price,
      image: images[0]?.src,
      quantity: 1,
      ...(isRing && { ringSize: ring.size && `${ring.country} ${ring.size}`, engraving: ring.engraving }),
    };
    try {
      const current = JSON.parse(localStorage.getItem("metro-cart") ?? "[]");
      const cart = Array.isArray(current) ? current : [];
      const existing = cart.find(
        (entry) => entry.id === id && entry.productCode === item.productCode,
      );
      if (existing) existing.quantity += 1;
      else cart.push(item);
      localStorage.setItem("metro-cart", JSON.stringify(cart));
      setAdded(true);
    } catch {
      setAdded(false);
    }
  };

  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({
          title: variantName,
          url: window.location.href,
        });
      else await navigator.clipboard.writeText(window.location.href);
    } catch {
      /* share dismissed */
    }
  };

  return (
    <main className="product">
      <Breadcrumb
        items={[
          { label: "Home", to: "/" },
          ...(collection
            ? [
              {
                label: collection.title,
                to: `/collections/${collection.slug}`,
              },
            ]
            : []),
          // Jewellery > Earrings (the sub category pages)
          ...(["Rings", "Earrings", "Bracelets", "Necklaces"].includes(product.subCategory)
            ? [{ label: product.subCategory, to: `/collections/${product.subCategory.toLowerCase()}` }]
            : []),
          { label: variantName },
        ]}
      />
      <div className="pd-layout">
        <ProductGallery
          key={variant.productCode ?? selectedIndex}
          images={images}
          fallback={<ProductArt metal={selectedMetal} />}
        />
        <section className="pd-info">
          <div className="pd-title">
            <h1>{variantName}</h1>
            <button
              className={`pd-icon ${saved ? "on" : ""}`}
              type="button"
              onClick={() =>
                toggle({
                  id,
                  name: variantName,
                  metal: selectedMetal,
                  image: images[0]?.src,
                  to: productPath(product, variant),
                })
              }
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              aria-pressed={saved}
            >
              <Star
                size={20}
                strokeWidth={1.5}
                fill={saved ? "currentColor" : "none"}
              />
            </button>
            <button
              className="pd-icon"
              type="button"
              onClick={share}
              aria-label="Share product"
            >
              <Share2 size={20} strokeWidth={1.5} />
            </button>
          </div>

          {types.length > 1 && (
            <div
              className="pd-type-options"
              role="group"
              aria-label="Diamond type"
            >
              {types.map((type) => (
                <button
                  key={type}
                  type="button"
                  className={type === selectedType ? "on" : ""}
                  aria-pressed={type === selectedType}
                  onClick={() => choose("type", type)}
                >
                  <span>{type}</span>
                </button>
              ))}
            </div>
          )}

          {showCarats && (
            <div className="pd-options">
              <h2>Carat Weight</h2>
              <div
                className="pd-carat-options"
                role="group"
                aria-label="Carat weight"
              >
                {CARAT_OPTIONS.map((carat) => (
                  <button
                    key={carat}
                    type="button"
                    className={carat === Number(selectedCarat) ? "on" : ""}
                    aria-pressed={carat === Number(selectedCarat)}
                    onClick={() => pickCarat(carat)}
                  >
                    {carat}ct
                  </button>
                ))}
              </div>
              {missingCarat && (
                <p className="pd-added" role="status">
                  No {missingCarat}ct option is available for this design.
                </p>
              )}
            </div>
          )}

          {metals.length > 0 && (
            <div className="pd-options">
              <h2>
                Select Metal{" "}
                <HelpCircle
                  size={14}
                  aria-label="Available metals for this product"
                />
              </h2>
              <div className="pd-metal-options" role="group" aria-label="Metal">
                {metals.map((metal) => (
                  <button
                    key={metal}
                    type="button"
                    className={metal === selectedMetal ? "on" : ""}
                    aria-pressed={metal === selectedMetal}
                    onClick={() => choose("metal", metal)}
                  >
                    <span
                      className={`pd-metal-swatch ${/rose/i.test(metal) ? "rose" : /yellow/i.test(metal) ? "yellow" : /platinum/i.test(metal) ? "platinum" : "white"}`}
                    />
                    {metal}
                  </button>
                ))}
              </div>
            </div>
          )}

          {isRing && <RingOptions ring={ring} onChange={(patch) => setRing((current) => ({ ...current, ...patch }))} />}

          {!product.preview && (
            <div className="pd-actions">
              <a
                className="pd-discount"
                href={discountLink}
                target="_blank"
                rel="noreferrer"
              >
                CHECK FOR DISCOUNT
              </a>
              <button className="pd-add" type="button" onClick={addToCart}>
                ADD TO CART
              </button>
              {added && (
                <p className="pd-added" role="status">
                  Added to cart.{" "}
                  <a href={enquiry} target="_blank" rel="noreferrer">
                    Enquire to order
                  </a>
                </p>
              )}
            </div>
          )}
          {product.preview && (
            <p className="pd-preview-note">
              This is a sample product. Real product details will appear here
              when the collection is added.
            </p>
          )}

          <div className="pd-details">
            <DetailRow title="PRODUCT DETAILS" icon={ScrollText}>
              <dl className="pd-specs">
                {specs.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label.charAt(0).toUpperCase() + label.slice(1)}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              {product.description && !Object.keys(details).length && (
                <p>{product.description}</p>
              )}
            </DetailRow>
            <DetailRow title="METRO GUARANTEE" icon={BadgeCheck}>
              <p>
                Questions about authenticity or craftsmanship? Contact our team
                for details about this piece.
              </p>
            </DetailRow>
            <DetailRow title="DROP A HINT" icon={Gift}>
              <p>Share this piece with someone special.</p>
              <button
                className="pd-inline-action"
                type="button"
                onClick={share}
              >
                Share product
              </button>
            </DetailRow>
            <DetailRow title="SHIPPING AND RETURNS" icon={Box}>
              <p>
                Contact our team for delivery and return details for your
                location.
              </p>
            </DetailRow>
          </div>
        </section>
      </div>
    </main>
  );
}
