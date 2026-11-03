import { useSite } from "../context/siteContext";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const { homeBanner } = useSite().content;
  const navigate = useNavigate()

  return (
    <section className="hero">
      {homeBanner.image && (
        <img
          className="hero-photo"
          src={homeBanner.image}
          alt="Model wearing diamond rings, bracelet and necklace"
        />
      )}
      <div className="hero-copy">
        <h1>{homeBanner.heading}</h1>
        <a onClick={()=>navigate("/collections/rings/wedding-rings")} className="hero-btn">
          {homeBanner.buttonText}
        </a>
      </div>
    </section>
  );
}
