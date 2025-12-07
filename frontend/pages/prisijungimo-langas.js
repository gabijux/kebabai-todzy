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
      localStorage.setItem("user", JSON.stringify(data));

      // Redirect to home
      router.push('/');
      
    } catch (err) {
      console.error(err)
      setErrors(['Serverio klaida'])
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Prisijungimo langas</h1>

      {/* Klaidos */}
      {errors.length > 0 && (
        <div style={{ background: '#330000', padding: 10, color: '#fff', borderRadius: 6 }}>
          <ul>
            {errors.map((e, i) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: 20 }}>
        <label>
          El. paštas<br/>
          <input 
            type="email" 
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label><br/><br/>

        <label>
          Slaptažodis<br/>
          <input 
            type="password" 
            name="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label><br/><br/>

        <button disabled={isSubmitting} type="submit">
          {isSubmitting ? 'Jungiamasi...' : 'Prisijungti'}
        </button>
      </form>

      <h2 style={{ marginTop: 40 }}>Navigacija</h2>
      <ul>
        <li><Link href="/registracijos-langas">Registracijos langas</Link></li>
      </ul>
      
      <p style={{ marginTop: 30 }}><Link href="/">← Atgal į Pagrindinį langą</Link></p>
    </main>
  )
}
