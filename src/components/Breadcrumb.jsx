import { Link } from 'react-router-dom'
import '../styles/Breadcrumb.css'


export default function Breadcrumb({ items }) {
  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item) =>
          item.to ? (
            <li key={item.label}>
              <Link to={item.to}>{item.label}</Link>
            </li>
          ) : (
            <li key={item.label} aria-current="page">
              {item.label}
            </li>
          ),
        )}
      </ol>
    </nav>
  )
}
