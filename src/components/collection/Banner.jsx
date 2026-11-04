import bannerImg from "../../assets/hero-photo.jpg";
import "../../styles/Collection.css";

const SHOP_BANNERS = {
  jewellery: '/shop-jewellery.png',
  rings: '/shop-rings.png',
  earrings: '/shop-earrings.png',
  bracelets: '/shop-bracelets.png',
  necklaces: '/shop-necklaces.png',
  diamonds: '/shop-diamonds.png',
  'loose-diamond': '/shop-loose-diamond.png',
  gemstone: '/shop-gemstones.png',
  gemstones: '/shop-gemstones.png',
}

// the green title banner at the top of the collection and stone pages
export default function Banner({ title, image, slug }) {
  return (
    <section className="col-banner">
      <h1>{title}</h1>
      <img className="col-banner-img" src={SHOP_BANNERS[slug] || image || bannerImg} alt="" />
    </section>
  );
}
