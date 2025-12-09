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

  const pageStyle = {
    padding: 20,
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif'
  }

  const centerWrapper = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 20,
  }

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const inputStyle = {
    width: '100%',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: '1px solid #ccc',
    fontSize: 14
  }

  const buttonStyle = {
    width: '100%',
    padding: '10px 16px',
    marginTop: 10,
    cursor: 'pointer',
    backgroundColor: '#eab308',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15
  }

  return (
    <main style={pageStyle}>
      <h1>Slaptažodžio keitimo langas</h1>
      <p>Pakeiskite savo slaptažodį</p>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {errors.length > 0 && (
            <div style={{ 
              background: '#7f1d1d', 
              padding: 10, 
              borderRadius: 8, 
              color: '#fff', 
              marginBottom: 12 
            }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          {message && (
            <div style={{ 
              background: '#14532d', 
              padding: 10, 
              borderRadius: 8, 
              color: '#fff', 
              marginBottom: 12 
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label>El. paštas</label>
            <input
              type="email"
              name="email"
              style={{
                ...inputStyle,
                backgroundColor: '#e5e5e5',
                color: '#555',
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
              style={buttonStyle}
            >
              {isSubmitting ? 'Siunčiama...' : 'Pakeisti slaptažodį'}
            </button>
          </form>
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Link href="/paskyros-langas" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Paskyros langą
        </Link>
      </div>
    </main>
  )
}
