import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb'
import { useSite } from '../context/siteContext'
import '../styles/TermsPage.css'

const SECTIONS = [
  {
    title: 'General',
    paragraphs: [
      'By visiting and using this website, you acknowledge that you have read, understood, and agreed to these Terms & Conditions. We may update these terms from time to time, and it is your responsibility to review them regularly. Continued use of the website following any changes constitutes acceptance of those changes.',
    ],
  },
  {
    title: 'Pricing & Duties',
    list: [
      'All prices are listed in base currency of the U.S. Dollar (USD).',
      'Prices exclude any local taxes, duties, or import surcharges. These are the responsibility of the buyer and must be paid upon delivery.',
      'Please check with your country’s customs authority for applicable duties before placing an order.',
      'While we aim for accuracy, occasional pricing errors may occur. In such cases, we reserve the right to correct the error and cancel or amend the order. If an item is incorrectly priced, we will contact you before proceeding or issue a cancellation and refund.',
    ],
  },
  {
    title: 'Order Eligibility',
    paragraphs: ['To place an order on our website, you must:'],
    list: [
      'Provide accurate personal details (e.g. full name, email, and valid contact number).',
      'Use a valid payment method.',
      'In some cases, we may request additional documentation (such as ID, passport, or credit card proof) for security verification.',
    ],
  },
  {
    title: 'Product Information',
    paragraphs: ['We do our best to present our products as accurately as possible. However:'],
    list: [
      'Images may not reflect true size due to varying monitor settings and image scaling.',
      'Colours may also vary depending on screen displays.',
      'Measurements and descriptions are provided for guidance only.',
    ],
  },
  {
    title: 'Use of the Website',
    paragraphs: ['All content on this website is for personal, non-commercial use only. You may not:'],
    list: [
      'Reproduce, distribute, modify, transmit, or commercially exploit any content without written permission from Metro Jewellers.',
      'Use the website for any unlawful or unauthorized purpose.',
    ],
  },
  {
    title: 'Customer Reviews',
    paragraphs: ['We value your feedback and encourage customer reviews. By submitting a review:'],
    list: [
      'You are solely responsible for its content.',
      'You grant us the right to use, reproduce, and display your review for promotional and marketing purposes.',
    ],
  },
]

export default function TermsPage() {
  const { content } = useSite()
  const { email, phone } = content.contact

  return (
    <main className="terms">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Terms & Conditions' }]} />

      <section className="terms-banner">
        <h1>Terms &amp; Conditions</h1>
        <p>Last updated: 09/06/2025</p>
      </section>

      <div className="terms-body">
        <p className="terms-intro">
          Welcome to www.metrojewellers.com. By accessing or using our website, you agree to be
          bound by the following Terms &amp; Conditions. Please read them carefully. If you do not
          agree, please do not use this website.
        </p>

        {SECTIONS.map((s, i) => (
          <section key={s.title} className="terms-section">
            <h2>
              {i + 1}. {s.title}
            </h2>
            {s.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="terms-section">
          <h2>{SECTIONS.length + 1}. Privacy Policy</h2>
          <p>
            Please refer to our <Link to="/privacy-policy">Privacy Policy</Link> to understand how
            we collect, store, and use your personal information.
          </p>
        </section>

        <section className="terms-contact">
          <h2>Contact Us</h2>
          <p>Metro Jewellers</p>
          <p>If you have any questions regarding these Terms &amp; Conditions, feel free to reach out:</p>
          <p>
            Email: <a href={`mailto:${email}`}>{email}</a>
          </p>
          <p>
            Mobile Number: <a href={`tel:${phone.replace(/\s/g, '')}`}>{phone}</a>
          </p>
        </section>
      </div>
    </main>
  )
}
