import bannerImg from "../../assets/hero-photo.jpg";
import "../../styles/Collection.css";

const SHOP_BANNERS = {
  jewellery: '/jewellery-banner.avif',
  rings: '/shop-rings.avif',
  earrings: '/shop-earrings.avif',
  necklaces: '/shop-necklaces.avif',
  diamonds: '/shop-diamonds.avif',
  'loose-diamond': '/shop-loose-diamond.avif',
  gemstone: '/gemstone-banner.avif',
  gemstones: '/gemstone-banner.avif',
}

const FULL_BLEED_BANNERS = new Set(['jewellery', 'gemstone', 'gemstones'])
const MOBILE_BANNERS = {
  jewellery: '/jeweller-mobile.avif',
  gemstone: '/gemstone-mobile.avif',
  gemstones: '/gemstone-mobile.avif',
}

// the green title banner at the top of the collection and stone pages
export default function Banner({ title, image, slug }) {
  const fullBleed = FULL_BLEED_BANNERS.has(slug)
  return (
    <section className={`col-banner${fullBleed ? ' col-banner-full' : ''}`}>
      <h1>{title}</h1>
      <picture>
        {MOBILE_BANNERS[slug] && <source media="(max-width: 560px)" srcSet={MOBILE_BANNERS[slug]} />}
        <img className="col-banner-img" src={SHOP_BANNERS[slug] || image || bannerImg} alt="" />
      </picture>
    </section>
  );
}
