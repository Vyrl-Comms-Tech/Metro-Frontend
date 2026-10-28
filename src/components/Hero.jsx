import heroPhoto from "../assets/hero-photo.jpg";
import { assetUrl } from "../api/client";
import { useSite } from "../context/siteContext";
import "../styles/Hero.css";

export default function Hero() {
  const { homeBanner } = useSite().content;

  return (
    <section className="hero">
      <img
        className="hero-photo"
        src={assetUrl(homeBanner.image) || heroPhoto}
        alt="Model wearing diamond rings, bracelet and necklace"
      />
      <div className="hero-copy">
        <h1>{homeBanner.heading}</h1>
        <a href="#" className="hero-btn">
          {homeBanner.buttonText}
        </a>
      </div>
    </section>
  );
}
