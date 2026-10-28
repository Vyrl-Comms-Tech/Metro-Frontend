import { Link } from "react-router-dom";
import { faqsApi, productsApi, reelsApi } from "../../api/resources";
import { useAsync } from "../../api/useAsync";
import { useSite } from "../../context/siteContext";
import PageHeader from "../components/PageHeader";

const SHORTCUTS = [
  { label: "Add a product", to: "/admin/products" },
  { label: "Edit website content", to: "/admin/content" },
  { label: "Add an FAQ", to: "/admin/faqs" },
  { label: "Add a reel", to: "/admin/reels" },
];

// total records in one API collection, "-" until it loads
const useTotal = (api) => {
  const { data } = useAsync(() => api.list({ limit: 1 }), []);
  return data?.total ?? "-";
}

export default function Overview() {
  const { categories } = useSite();
  const products = useTotal(productsApi);
  const faqs = useTotal(faqsApi);
  const reels = useTotal(reelsApi);

  const stats = [
    { label: "Products", value: products, to: "/admin/products" },
    { label: "Categories", value: categories.length, to: "/admin/categories" },
    { label: "FAQs", value: faqs, to: "/admin/faqs" },
    { label: "Instagram reels", value: reels, to: "/admin/reels" },
  ];

  return (
    <>
      <PageHeader
        title="Overview"
        text="Manage the catalogue and website content from one place."
      />

      <ul className="ad-stats">
        {stats.map((s) => (
          <li key={s.label}>
            <Link to={s.to}>
              <strong>{s.value}</strong>
              <span>{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <section className="ad-card">
        <h2>Quick actions</h2>
        <div className="ad-shortcuts">
          {SHORTCUTS.map((s) => (
            <Link key={s.label} to={s.to} className="ad-btn ghost">
              {s.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
