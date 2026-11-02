import { useParams } from "react-router-dom";
import { categoryFromSlug } from "../components/menuData";
import CollectionPage from "./CollectionPage";
import ProductPage from "./inner-page/ProductPage";

export default function CollectionRoute() {
  const { slug, option } = useParams();
  return categoryFromSlug(slug, option) ? <CollectionPage /> : <ProductPage />;
}
