import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PaskyrosSalinimoLangas() {
  const router = useRouter()

  const [form, setForm] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState([])
  const [message, setMessage] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Užpildom email iš prisijungusio userio (jei yra)
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        const u = JSON.parse(stored)
        setForm(prev => ({ ...prev, email: u.email || '' }))
      }
    } catch (e) {
      console.error("Nepavyko nuskaityti naudotojo iš localStorage", e)
    }
  }, [])

  const handleChange = e => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleDelete = async () => {
    setErrors([])
    setMessage(null)
    setIsSubmitting(true)

    try {
      const res = await fetch("/api/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setErrors(data.errors || ["Nepavyko ištrinti paskyros."])
        return
      }

      // SUCCESS — paaiškinta PDF seku diagramoj
      setMessage("Paskyra sėkmingai ištrinta.")

      // Išvalom sesiją
      localStorage.removeItem("user")

      // Po trumpo laiko grąžinam į pagrindinį
      setTimeout(() => {
        router.push("/")
      }, 1500)

    } catch (e) {
      console.error(e)
      setErrors(["Serverio klaida."])
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
    width: "100%",
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
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 15
  }

  return (
    <main style={pageStyle}>
      <h1>Paskyros šalinimo langas</h1>
      <p>Įveskite savo duomenis patvirtinimui</p>

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
                {errors.map((e,i)=><li key={i}>{e}</li>)}
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

          <div>
            <label>El. paštas</label>
            <input
              name="email"
              type="email"
              value={form.email}
              // laukelis neredaguojamas
              readOnly
              disabled
              style={{
                ...inputStyle,
                backgroundColor: '#e5e5e5',
                color: '#555',
                cursor: 'not-allowed'
              }}
              required
            />

            <label>Slaptažodis</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              style={inputStyle}
              required
            />

            <button 
              onClick={handleDelete}
              style={buttonStyle}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Šalinama...' : 'Ištrinti paskyrą'}
            </button>
          </div>
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
