// title + optional description on the left, action buttons on the right
export default function PageHeader({ title, text, children }) {
  return (
    <header className="ad-page-head">
      <div>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {children && <div className="ad-actions">{children}</div>}
    </header>
  );
}
