import { useState } from "react";

const Arrow = ({ dir }) => (
  <svg
    viewBox="0 0 24 24"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d={dir === "prev" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
  </svg>
);

export default function ProductGallery({ images, fallback }) {
  const [index, setIndex] = useState(0);
  const go = (step) =>
    setIndex((i) => (i + step + images.length) % images.length);

  if (images.length === 0) {
    return (
      <div className="pd-gallery">
        <div className="pd-stage pd-stage-empty">{fallback}</div>
      </div>
    );
  }

  return (
    <div className="pd-gallery">
      <ul className="pd-thumbs">
        {images.map((img, i) => (
          <li key={img.src}>
            <button
              className={i === index ? "on" : ""}
              onClick={() => setIndex(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index}
            >
              <img src={img.src} alt="" />
            </button>
          </li>
        ))}
      </ul>

      <div className="pd-stage">
        <img src={images[index].src} alt={images[index].alt} />
        <button
          className="pd-nav prev"
          onClick={() => go(-1)}
          aria-label="Previous image"
        >
          <Arrow dir="prev" />
        </button>
        <button
          className="pd-nav next"
          onClick={() => go(1)}
          aria-label="Next image"
        >
          <Arrow dir="next" />
        </button>
      </div>
    </div>
  );
}
