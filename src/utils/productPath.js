export const productPath = (product, variant = product) => {
  const sub = (product.subCategory ?? product.mainCategory)?.toLowerCase();
  if (variant?.slug && sub) return `/collections/${sub}/${variant.slug}`;
  const id = product.id ?? product._id;
  return `/product/${id}${variant?.productCode ? `?code=${encodeURIComponent(variant.productCode)}` : ""}`;
};
