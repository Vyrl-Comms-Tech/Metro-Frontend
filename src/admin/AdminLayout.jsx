import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import "../styles/Admin.css";

const LINKS = [
  {
    to: "/admin",
    label: "Overview",
    end: true,
    icon: "M3 12 12 4l9 8M5 10v10h14V10",
  },
  {
    to: "/admin/products",
    label: "Products",
    icon: "M4 8 12 4l8 4v8l-8 4-8-4zM4 8l8 4 8-4M12 12v8",
  },
  {
    to: "/admin/categories",
    label: "Categories",
    icon: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  },
  {
    to: "/admin/content",
    label: "Website Content",
    icon: "M5 4h14v16H5zM8 9h8M8 13h8M8 17h5",
  },
  {
    to: "/admin/faqs",
    label: "FAQs",
    icon: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5M12 17h.01",
  },
  {
    to: "/admin/reels",
    label: "Instagram Reels",
    icon: "M5 4h14v16H5zM10 9l5 3-5 3z",
  },
];

const Icon = ({ d }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={d} />
  </svg>
);

export default function AdminLayout() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const signOut = async () => {
    await logout().catch(() => {});
    navigate("/admin/login", { replace: true });
  };

  return (
    <div
      className={`admin ${open ? "menu-open" : ""} ${collapsed ? "collapsed" : ""}`}
    >
      <aside className="ad-side">
        <div className="ad-brand">
          <span>METRO</span>
          <small>JEWELLERS</small>
        </div>

        <nav
          className="ad-nav"
          aria-label="Admin"
          onClick={() => setOpen(false)}
        >
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>
              <Icon d={l.icon} />
              <span className="ad-nav-label">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          type="button"
          className="ad-site-link"
          onClick={signOut}
        >
          Logout
        </button>

        <button
          type="button"
          className="ad-collapse"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          <Icon d={collapsed ? "m9 6 6 6-6 6" : "m15 6-6 6 6 6"} />
          <span className="ad-nav-label">Collapse</span>
        </button>
      </aside>

      <div className="ad-backdrop" onClick={() => setOpen(false)} />

      <div className="ad-main">
        <header className="ad-top">
          <button
            className="ad-burger"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Icon d="M4 7h16M4 12h16M4 17h16" />
          </button>
          <span className="ad-top-label">Management dashboard</span>
          <span className="ad-user"><span aria-hidden="true">M</span> Admin</span>
        </header>

        <main className="ad-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
