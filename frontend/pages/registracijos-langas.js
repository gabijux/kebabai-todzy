import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function RegistracijosLangas() {
  const router = useRouter()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
  })

  const [errors, setErrors] = useState([])
  const [successMessage, setSuccessMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setSuccessMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors(data.errors || ['Registracijos klaida'])
        return
      }

      setSuccessMessage('Paskyra sėkmingai sukurta! Nukreipiama...')
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      console.error(err)
      setErrors(['Nepavyko pasiekti serverio'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Registracijos langas</h1>
      <p>Sukurkite naują paskyrą</p>

      {/* Klaidos */}
      {errors.length > 0 && (
        <div style={{ background: '#330000', color: 'white', padding: 10, marginTop: 20, borderRadius: 6 }}>
          <ul>
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        </div>
      )}

      {/* Sėkmė */}
      {successMessage && (
        <div style={{ background: '#003300', color: 'white', padding: 10, marginTop: 20, borderRadius: 6 }}>
          {successMessage}
        </div>
      )}

      {/* Registracijos forma */}
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: 20 }}>
        <label>Vardas<br />
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required />
        </label><br /><br />

        <label>Pavardė<br />
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required />
        </label><br /><br />

        <label>El. paštas<br />
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label><br /><br />

        <label>Slaptažodis<br />
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label><br /><br />

        <label>Pakartokite slaptažodį<br />
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
        </label><br /><br />

        <label>Telefono numeris (nebūtina)<br />
          <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
        </label><br /><br />

        <label>Adresas (nebūtina)<br />
          <input type="text" name="address" value={form.address} onChange={handleChange} />
        </label><br /><br />

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Kuriama...' : 'Registruotis'}
        </button>
      </form>

      {/* Grįžimo nuoroda */}
      <p style={{ marginTop: 30 }}>
        <Link href="/prisijungimo-langas">← Atgal į Prisijungimo langą</Link>
      </p>
    </main>
  )
}
