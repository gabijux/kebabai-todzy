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
    maxWidth: 450,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const inputStyle = {
    width: '100%',
    padding: 8,
    marginTop: 4,
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
    backgroundColor: '#3498db',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15
  }

  return (
    <main style={pageStyle}>
      <h1>Registracijos langas</h1>
      <p>Sukurkite naują paskyrą</p>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {/* Klaidos */}
          {errors.length > 0 && (
            <div style={{ 
              background: '#7f1d1d', 
              color: 'white', 
              padding: 10, 
              marginBottom: 12, 
              borderRadius: 6 
            }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Sėkmė */}
          {successMessage && (
            <div style={{ 
              background: '#14532d', 
              color: 'white', 
              padding: 10, 
              marginBottom: 12, 
              borderRadius: 6 
            }}>
              {successMessage}
            </div>
          )}

          {/* Registracijos forma */}
          <form onSubmit={handleSubmit}>
            <label>
              Vardas<br />
              <input 
                type="text" 
                name="firstName" 
                value={form.firstName} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </label>

            <label>
              Pavardė<br />
              <input 
                type="text" 
                name="lastName" 
                value={form.lastName} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </label>

            <label>
              El. paštas<br />
              <input 
                type="email" 
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </label>

            <label>
              Slaptažodis<br />
              <input 
                type="password" 
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </label>

            <label>
              Pakartokite slaptažodį<br />
              <input 
                type="password" 
                name="confirmPassword" 
                value={form.confirmPassword} 
                onChange={handleChange} 
                required 
                style={inputStyle}
              />
            </label>

            <label>
              Telefono numeris (nebūtina)<br />
              <input 
                type="text" 
                name="phoneNumber" 
                value={form.phoneNumber} 
                onChange={handleChange} 
                style={inputStyle}
              />
            </label>

            <label>
              Adresas (nebūtina)<br />
              <input 
                type="text" 
                name="address" 
                value={form.address} 
                onChange={handleChange} 
                style={inputStyle}
              />
            </label>

            <button disabled={isSubmitting} type="submit" style={buttonStyle}>
              {isSubmitting ? 'Kuriama...' : 'Registruotis'}
            </button>
          </form>
        </div>
      </div>

      {/* Grįžimo nuoroda */}
      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Link href="/prisijungimo-langas" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Prisijungimo langą
        </Link>
      </div>
    </main>
  )
}
