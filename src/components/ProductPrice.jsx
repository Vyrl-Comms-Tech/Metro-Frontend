import "../styles/ProductPrice.css";

const fmt = (n) => Number(n).toLocaleString("en-US", { maximumFractionDigits: 2 });

// price under a product card; the compare price is struck through when it is higher
export default function ProductPrice({ price, compareAtPrice }) {
  if (price == null || price === "") return null;
  const onSale = compareAtPrice != null && Number(compareAtPrice) > Number(price);

  return (
    <p className="prod-price">
      <strong>AED {fmt(price)}</strong>
      {onSale && <del>AED {fmt(compareAtPrice)}</del>}
    </p>
  );
}
