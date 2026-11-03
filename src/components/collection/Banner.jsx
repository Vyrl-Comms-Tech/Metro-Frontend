import bannerImg from "../../assets/hero-photo.jpg";
import "../../styles/Collection.css";

// the green title banner at the top of the collection and stone pages
export default function Banner({ title, image }) {
  return (
    <section className="col-banner">
      <h1>{title}</h1>
      <img className="col-banner-img" src={image || bannerImg} alt="" />
    </section>
  );
}
