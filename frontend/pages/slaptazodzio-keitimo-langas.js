import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function SlaptazodzioKeitimoLangas() {
  const [form, setForm] = useState({
    email: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Užpildom email iš prisijungusio userio (jei yra)
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setForm(prev => ({ ...prev, email: u.email || '' }))
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || ['Nepavyko pakeisti slaptažodžio.'])
        return
      }

      setMessage(data.message || 'Slaptažodis sėkmingai pakeistas.')
      // formos išvalymas (išskyrus email)
      setForm(prev => ({
        ...prev,
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))

    } catch (err) {
      console.error(err)
      setErrors(['Serverio klaida.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: '1px solid #555',
    backgroundColor: '#111',
    color: '#fff'
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Slaptažodžio keitimo langas</h1>
      <p>Pakeiskite savo slaptažodį</p>

      {errors.length > 0 && (
        <div style={{ background: '#7f1d1d', padding: 10, borderRadius: 8, color: '#fff', marginTop: 15 }}>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      {message && (
        <div style={{ background: '#14532d', padding: 10, borderRadius: 8, color: '#fff', marginTop: 15 }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: 20 }}>
        <label>El. paštas</label>
<input
  type="email"
  name="email"
  style={{
    ...inputStyle,
    backgroundColor: '#2a2a2a',
    color: '#aaa',
    cursor: 'not-allowed'
  }}
  value={form.email}
  disabled
  readOnly
/>


        <label>Senas slaptažodis</label>
        <input
          type="password"
          name="oldPassword"
          style={inputStyle}
          value={form.oldPassword}
          onChange={handleChange}
          required
        />

        <label>Naujas slaptažodis</label>
        <input
          type="password"
          name="newPassword"
          style={inputStyle}
          value={form.newPassword}
          onChange={handleChange}
          required
        />

        <label>Pakartokite naują slaptažodį</label>
        <input
          type="password"
          name="confirmPassword"
          style={inputStyle}
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            padding: '10px 20px',
            marginTop: 10,
            cursor: 'pointer',
            backgroundColor: '#eab308',
            border: 'none',
            borderRadius: 8,
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? 'Siunčiama...' : 'Pakeisti slaptažodį'}
        </button>
      </form>

      <p style={{ marginTop: 30 }}>
        <Link href="/paskyros-langas">← Atgal į Paskyros langą</Link>
      </p>
    </main>
  )
}
