import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductSkeleton from "./ProductSkeleton";

// whole loading view: filter column + grid of placeholder cards
export default function CollectionSkeleton() {
  return (
    <div className="col-layout" role="status" aria-label="Loading products">
      <aside className="col-side show">
        <div className="col-filters">
          <Skeleton count={5} height={40} style={{ marginBottom: 14 }} />
        </div>
      </aside>
      <section className="col-main">
        <div className="col-grid">
          <ProductSkeleton count={9} />
        </div>
      </section>
    </div>
  );
}
