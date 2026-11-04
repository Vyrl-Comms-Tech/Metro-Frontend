import Breadcrumb from '../components/Breadcrumb'
import { useSite } from '../context/siteContext'
import '../styles/TermsPage.css'

// each section is a run of blocks: { p } paragraph, { h } sub-heading, { list } bullets
const SECTIONS = [
  {
    title: 'Who We Are',
    blocks: [
      {
        p: 'Metro Jewellers is a luxury bespoke jewellery brand based in Dubai, providing custom-made jewellery and private consultations to clients worldwide.',
      },
    ],
  },
  {
    title: 'What Information We Collect',
    blocks: [
      { p: 'We may collect the following types of personal information:' },
      { h: 'a. Personal information you provide' },
      {
        list: [
          'Name',
          'Email address',
          'Phone number',
          'Address (for shipping)',
          'Payment information',
          'Information provided during consultations or custom orders',
        ],
      },
      { h: 'b. Automatically collected information' },
      {
        list: [
          'IP address',
          'Browser type and version',
          'Device information',
          'Pages visited and time spent on site',
          'Cookies and similar tracking technologies (see section 7)',
        ],
      },
    ],
  },
  {
    title: 'How We Use Your Information',
    blocks: [
      { p: 'We use your data for the following purposes:' },
      {
        list: [
          'To process and fulfill your orders',
          'To personalize your consultation and shopping experience',
          'To respond to enquiries and customer service requests',
          'To improve our Website and services',
          'For marketing purposes (only with your consent)',
          'To comply with legal obligations',
        ],
      },
    ],
  },
  {
    title: 'How We Share Your Information',
    blocks: [
      { p: 'We do not sell or rent your personal data. We may share your data with:' },
      {
        list: [
          'Trusted third-party service providers (e.g., payment gateways, couriers, marketing tools)',
          'Legal authorities when required by law',
          'Our internal team strictly on a need-to-know basis',
        ],
      },
    ],
  },
  {
    title: 'Your Rights',
    blocks: [
      { p: 'Depending on your location, you may have the following rights:' },
      {
        list: [
          'The right to access the personal data we hold about you',
          'The right to correct or update your information',
          'The right to request deletion of your data (unless we are legally required to keep it)',
          'The right to object to or restrict certain data processing',
          'The right to withdraw marketing consent at any time',
        ],
      },
      { email: 'To exercise these rights, please email' },
    ],
  },
  {
    title: 'Data Security',
    blocks: [
      {
        p: 'We take data security seriously. All information is stored securely, and transactions are protected using SSL encryption. We regularly review and update our data handling practices.',
      },
    ],
  },
  {
    title: 'Cookies',
    blocks: [
      { p: 'We use cookies to enhance your experience on our Website. These may include:' },
      {
        list: [
          'Essential cookies (for basic website functionality)',
          'Analytics cookies (to understand how users interact with the site)',
          'Marketing cookies (to serve targeted ads, only if consented)',
        ],
      },
      { p: 'You can control or disable cookies via your browser settings.' },
    ],
  },
  {
    title: 'International Data Transfers',
    blocks: [
      {
        p: 'As we operate globally, your data may be transferred and processed outside your home country, including in countries that may not offer the same level of data protection. We ensure all such transfers are lawful and secure.',
      },
    ],
  },
  {
    title: 'Retention of Data',
    blocks: [
      {
        p: 'We retain personal data only as long as necessary to fulfill the purposes outlined above or as required by law (e.g., for tax and accounting purposes).',
      },
    ],
  },
  {
    title: 'Third-Party Links',
    blocks: [
      {
        p: 'Our Website may contain links to third-party websites. We are not responsible for their privacy practices or content. Please review their policies separately.',
      },
    ],
  },
  {
    title: 'Changes to This Policy',
    blocks: [
      {
        p: 'We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated “Effective Date.” Continued use of the Website implies acceptance of the revised policy.',
      },
    ],
  },
]

export default function PrivacyPage() {
  const { content } = useSite()
  const { email, phone } = content.contact

  return (
    <main className="terms">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />

      <section className="terms-banner">
        <h1>Privacy Policy</h1>
        <p>Last updated: 09/06/2025</p>
      </section>

      <div className="terms-body">
        <p className="terms-intro">
          At Metro Jewellers, we value your privacy and are committed to protecting your personal
          information. This Privacy Policy outlines how we collect, use, and protect your data when
          you visit our Website (metrojewellers.com), use our services, or contact us.
        </p>

        {SECTIONS.map((s, i) => (
          <section key={s.title} className="terms-section">
            <h2>
              {i + 1}. {s.title}
            </h2>
            {s.blocks.map((b, j) => {
              if (b.h) return <h3 key={j}>{b.h}</h3>
              if (b.list)
                return (
                  <ul key={j}>
                    {b.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )
              if (b.email)
                return (
                  <p key={j}>
                    {b.email} <a href={`mailto:${email}`}>{email}</a>
                  </p>
                )
              return <p key={j}>{b.p}</p>
            })}
          </section>
        ))}

        <section className="terms-contact">
          <h2>{SECTIONS.length + 1}. Contact Us</h2>
          <p>For questions or concerns regarding this Privacy Policy, contact us at:</p>
          <p>Metro Jewellers</p>
          <p>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p>
            Phone: <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </p>
          <p>Dubai, United Arab Emirates</p>
        </section>
      </div>
    </main>
  )
}
