import heroPhoto from "../assets/hero-photo.jpg";
import { useSite } from "../context/siteContext";
import "../styles/Hero.css";
import { useNavigate } from "react-router-dom";
export default function Hero() {
  const { homeBanner } = useSite().content;
  const navigate = useNavigate()
  console.log("home banner", homeBanner)

  return (
    <section className="hero">
      <img
        className="hero-photo"
        src={homeBanner.image || heroPhoto}
        alt="Model wearing diamond rings, bracelet and necklace"
      />
      <div className="hero-copy">
        <h1>{homeBanner.heading}</h1>
        <a onClick={()=>navigate("/collections/rings/wedding-rings")} className="hero-btn">
          {homeBanner.buttonText}
        </a>
      </div>
    </section>
  );
}
