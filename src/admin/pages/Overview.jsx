import { Link } from "react-router-dom";
import axiosClient from "../../utils/axiosClient";
import { useAsync } from "../../utils/useAsync";
import { useSite } from "../../context/siteContext";
import PageHeader from "../components/PageHeader";

const SHORTCUTS = [
  { label: "Products", description: "Add products and manage catalogue details", to: "/admin/products" },
  { label: "Categories", description: "Organise collections and their visibility", to: "/admin/categories" },
  { label: "Website content", description: "Update the home page and contact details", to: "/admin/content" },
  { label: "FAQs", description: "Manage answers to common questions", to: "/admin/faqs" },
  { label: "Instagram reels", description: "Manage videos shown on the home page", to: "/admin/reels" },
];

// total records in one API collection, "-" until it loads
const useTotal = (collection) => {
  const { data } = useAsync(() => axiosClient.get(`/${collection}`, { params: { limit: 1 } }), []);
  return data?.total ?? "-";
}

export default function Overview() {
  const { categories } = useSite();
  const { data: productList } = useAsync(() => axiosClient.get("/products/getAll", { params: { limit: 1 } }), []);
  const products = productList?.total ?? "-";
  const faqs = useTotal("faqs");
  const reels = useTotal("reels");

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
        text="A clear view of your catalogue and website content."
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

      <section className="ad-card ad-overview-section">
        <div className="ad-section-head">
          <h2>Manage your store</h2>
          <p>Choose an area to review or update.</p>
        </div>
        <div className="ad-management-list">
          {SHORTCUTS.map((s) => (
            <Link key={s.label} to={s.to}>
              <span><strong>{s.label}</strong><small>{s.description}</small></span>
              <span className="ad-management-arrow" aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
