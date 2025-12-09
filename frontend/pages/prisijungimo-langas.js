import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function PrisijungimoLangas() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setErrors([])
    setIsSubmitting(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || ['Nepavyko prisijungti'])
        return
      }

      // Save user session
      localStorage.setItem("user", JSON.stringify(data))

      // Redirect to home
      router.push('/')
      
    } catch (err) {
      console.error(err)
      setErrors(['Serverio klaida'])
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
    alignItems: 'center',
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
    padding: 10,
    borderRadius: 6,
    border: '1px solid #ccc',
    marginTop: 4,
    fontSize: 14,
  }

  const buttonStyle = {
    width: '100%',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#3498db',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  }

  return (
    <main style={pageStyle}>
      {/* Paliekam antraštę ten, kur buvo */}
      <h1>Prisijungimo langas</h1>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {/* Klaidos kortelės viduje */}
          {errors.length > 0 && (
            <div style={{ 
              background: '#7f1d1d', 
              padding: 10, 
              color: '#fff', 
              borderRadius: 6,
              marginBottom: 12 
            }}>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
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
            </div>

            <div style={{ marginBottom: 8 }}>
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
            </div>

            <button disabled={isSubmitting} type="submit" style={buttonStyle}>
              {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
            </button>
          </form>

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14 }}>
            <span>Neturite paskyros? </span>
            <Link href="/registracijos-langas" style={{ color: '#3498db' }}>
              Registracijos langas
            </Link>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Link href="/" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Pagrindinį langą
        </Link>
      </div>
    </main>
  )
}
