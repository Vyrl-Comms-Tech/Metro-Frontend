import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

// placeholder cards shown while products load
export default function ProductSkeleton({ count = 6 }) {
  return Array.from({ length: count }, (_, i) => (
    <article key={i} className="prod" aria-hidden="true">
      <Skeleton className="prod-sk-img" />
      <Skeleton style={{ marginTop: 14 }} />
      <Skeleton width="60%" />
    </article>
  ));
}
