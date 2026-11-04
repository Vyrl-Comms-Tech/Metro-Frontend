import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ProductSkeleton from "./ProductSkeleton";

// whole loading view, laid out like the real page: the filter column and the grid on wide screens,
// the Filters / Sort buttons and a two-across grid on phones
export default function CollectionSkeleton() {
  return (
    <div className="col-layout col-drawer col-sk" role="status" aria-label="Loading products">
      <aside className="col-side">
        <div className="col-filters">
          <Skeleton count={5} height={40} style={{ marginBottom: 14 }} />
        </div>
      </aside>
      <section className="col-main">
        <div className="col-toolbar">
          <div className="col-filter-open">
            <Skeleton width={90} height={16} />
          </div>
          <p>
            <Skeleton width={90} height={16} />
          </p>
          <div className="col-sort col-sort-sk">
            <Skeleton height={44} style={{ display: "block" }} />
          </div>
        </div>
        <div className="col-grid">
          <ProductSkeleton count={9} />
        </div>
      </section>
    </div>
  );
}
