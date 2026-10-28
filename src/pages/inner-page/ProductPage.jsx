import { Navigate, useParams } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import ProductArt from "../../components/collection/ProductArt";
import { assetUrl } from "../../api/client";
import { getProduct } from "../../api/products";
import { useAsync } from "../../api/useAsync";
import { productEnquiry, whatsappLink } from "../../utils/whatsapp";
import { useSite } from "../../context/siteContext";
import { useWishlist } from "../../context/wishlistContext";
import ProductGallery from "./ProductGallery";
import "../../styles/Product.css";

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

export default function ProductPage() {
  const { id } = useParams();
  const { data: product, error, loading } = useAsync(() => getProduct(id), [id]);

  if (loading) return <main className="product"><p className="pd-status">Loading…</p></main>;
  if (error) return <Navigate to="/" replace />;
  return <ProductView key={id} product={product} />;
}

function ProductView({ product }) {
  const { has, toggle } = useWishlist();
  const saved = has(product.id);
  const { categories, content } = useSite();
  const collection = categories.find((c) => c.slug === product.collectionSlug);
  const images = (product.images ?? []).map((src) => ({ src: assetUrl(src), alt: product.name }));
  const specs = SPECS.filter(([, key]) => product[key] != null && product[key] !== "");

  const enquiry = whatsappLink(
    content.contact.whatsapp,
    productEnquiry({
      name: product.name,
      type: product.type,
      metal: product.metal,
      url: window.location.href,
    }),
  );

  const toggleSaved = () =>
    toggle({
      id: product.id,
      name: product.name,
      metal: product.metal,
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
          images={images}
          fallback={<ProductArt metal={product.metal} />}
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

          {product.description && <p className="pd-desc">{product.description}</p>}

          <a className="pd-whatsapp" href={enquiry} target="_blank" rel="noreferrer">
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
          </a>

          {specs.length > 0 && (
            <>
              <h2 className="pd-label">Product details</h2>
              <dl className="pd-specs">
                {specs.map(([label, key]) => (
                  <div key={key}>
                    <dt>{label}</dt>
                    <dd>{product[key]}</dd>
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
