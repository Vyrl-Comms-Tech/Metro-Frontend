import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// placeholder for the FAQ page while the questions load: the category links, and two categories of accordion rows
export default function FaqSkeleton() {
  return (
    <div role="status" aria-label="Loading questions">
      <nav className="faqpage-nav" aria-hidden="true">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} width={110} height={32} borderRadius={16} />
        ))}
      </nav>

      {Array.from({ length: 2 }, (_, c) => (
        <section key={c} className="faqpage-cat" aria-hidden="true">
          <h2><Skeleton width={180} /></h2>
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} height={58} style={{ marginBottom: 10 }} />
          ))}
        </section>
      ))}
    </div>
  );
}
