import { useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import { useSite } from '../context/siteContext'
import { contactEnquiry, whatsappLink } from '../utils/whatsapp'
import '../styles/Contact.css'

const EMPTY = { name: '', email: '', phone: '', message: '' }

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const { content } = useSite()

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setSent(false)
  }

  // no backend: the enquiry opens WhatsApp with the form filled in
  const submit = (e) => {
    e.preventDefault()
    window.open(whatsappLink(content.contact.whatsapp, contactEnquiry(form)), '_blank', 'noreferrer')
    setForm(EMPTY)
    setSent(true)
  }

  return (
    <main className="contact">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />

      <div className="ct-layout">
        <div className="ct-photo">
          <img src="/d2.webp" alt="Model wearing Metro Jewellers diamond jewellery" />
        </div>

        <section className="ct-form">
          <h1>Contact Us</h1>
          <p>
            Tell us what you are looking for and our team will reply on WhatsApp.
          </p>

          <form onSubmit={submit}>
            <label>
              Full name
              <input name="name" value={form.name} onChange={update} required autoComplete="name" />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={update} required autoComplete="email" />
            </label>
            <label>
              Phone <span>(optional)</span>
              <input type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" value={form.message} onChange={update} required />
            </label>

            <button type="submit">Send on WhatsApp</button>
            {sent && <p className="ct-sent" role="status">Opening WhatsApp, thank you!</p>}
          </form>
        </section>
      </div>
    </main>
  )
}
