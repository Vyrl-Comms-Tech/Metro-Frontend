import { useState } from 'react'
import Breadcrumb from '../components/Breadcrumb'
import axiosClient from '../utils/axiosClient'
import '../styles/Contact.css'

const EMPTY = { name: '', email: '', phone: '', message: '' }

export default function ContactPage() {
  const [form, setForm] = useState(EMPTY)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const update = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setSent(false)
  }

  // the enquiry is saved in the backend and shows up in the admin dashboard
  const submit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await axiosClient.post('/enquiries', form)
      setForm(EMPTY)
      setSent(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="contact">
      <Breadcrumb items={[{ label: 'Home', to: '/' }, { label: 'Contact Us' }]} />

      <div className="ct-layout">
        <div className="ct-photo">
          <img src="/contact-us.jpg" alt="Model wearing Metro Jewellers diamond jewellery" />
        </div>

        <section className="ct-form">
          <h1>Contact Us</h1>
          <p>
            Tell us what you are looking for and our team will get back to you shortly.
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
              <span>Phone <span className="ct-optional">(optional)</span></span>
              <input type="tel" name="phone" value={form.phone} onChange={update} autoComplete="tel" />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" value={form.message} onChange={update} required />
            </label>

            <button type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send message'}</button>
            {sent && <p className="ct-sent" role="status">Thank you! Your message has been sent.</p>}
            {error && <p className="ct-sent ct-error" role="alert">{error}</p>}
          </form>
        </section>
      </div>
    </main>
  )
}
