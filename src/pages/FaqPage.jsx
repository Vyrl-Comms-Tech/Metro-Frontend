import FaqList from "../components/FaqList";
import { faqsApi } from "../api/resources";
import { useAsync } from "../api/useAsync";
import { useSite } from "../context/siteContext";
import { groupByCategory } from "../utils/faq";
import "../styles/Faq.css";
import "../styles/FaqPage.css";

export default function FaqPage() {
  const { content } = useSite();
  const { data, error, loading } = useAsync(
    () => faqsApi.list({ limit: 500 }),
    [],
  );
  const groups = groupByCategory(data?.items ?? []);

  return (
    <main className="faqpage">
      <section className="faqpage-banner">
        <h1>Frequently Asked Questions</h1>
        <p>
          Everything you need to know about our diamonds, design process,
          delivery and care.
        </p>
      </section>

      <div className="faqpage-body">
        {(loading || error || groups.length === 0) && (
          <p className="faqpage-status">
            {loading
              ? "Loading…"
              : (error?.message ?? "No questions have been added yet.")}
          </p>
        )}

        {groups.length > 0 && (
          <nav className="faqpage-nav" aria-label="FAQ categories">
            {groups.map((c) => (
              <a key={c.id} href={`#${c.id}`}>
                {c.title}
              </a>
            ))}
          </nav>
        )}

        {groups.map((c) => (
          <section key={c.id} id={c.id} className="faqpage-cat">
            <h2>{c.title}</h2>
            <FaqList items={c.items} idPrefix={c.id} defaultOpen={null} />
          </section>
        ))}

        <div className="faqpage-help">
          <p>Still can't find what you're looking for?</p>
          <a
            href={`https://wa.me/${content.contact.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="faq-all"
          >
            Contact Us
          </a>
        </div>
      </div>
    </main>
  );
}
