import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {

  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user")
      if (stored) {
        setUser(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to read user from localStorage")
    }
  }, [])

  const containerStyle = {
    minHeight: '100vh',
    backgroundImage: "url('https://plus.unsplash.com/premium_photo-1661310177352-f586bf23a403?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#f0f0f0',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Arial, sans-serif',
    padding: 20,
  }

  const cardStyle = {
    backgroundColor: '#1a1a1a',
    border: '1px solid #333',
    borderRadius: 16,
    padding: 24,
    maxWidth: 900,
    width: '90%',
    margin: '20px auto',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
  }

  return (
    <div style={containerStyle}>
      <header>
        <h1>Pagrindinis langas</h1>

        {/* SHOW LOGGED-IN USER */}
        {user && (
          <p style={{ marginTop: 10, fontSize: 18 }}>
            Prisijungęs: <strong>{user.firstName} {user.lastName}</strong> <br/>
            <span style={{ fontSize: 14, color: '#aaa' }}>Rolė: {user.role}</span>
            <span style={{ fontSize: 14, color: '#aaa' }}> | Užsakymų skaičius: {user.ordersCount}</span>
          </p>
        )}
      </header>

      <main style={cardStyle}>
        <h2>Navigacija</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ margin: '10px 0' }}><Link href="/kebabu-saraso-langas" style={{ color: '#3498db' }}>Kebabų sąrašo langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/uzsakymu-perziuros-langas" style={{ color: '#3498db' }}>Užsakymų peržiūros langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/paskyros-langas" style={{ color: '#3498db' }}>Paskyros langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/atsijungimo-langas" style={{ color: '#3498db' }}>Atsijungimo langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/prisijungimo-langas" style={{ color: '#3498db' }}>Prisijungimo langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/artimiausios-kebabines-langas" style={{ color: '#3498db' }}>Artimiausios kebabinės langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/kebabiniu-saraso-langas" style={{ color: '#3498db' }}>Kebabinių sąrašo langas</Link></li>
          <li style={{ margin: '10px 0' }}><Link href="/krepselio-langas" style={{ color: '#3498db' }}>Krepšelio langas</Link></li>

        </ul>
      </main>

      <footer style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
        © {new Date().getFullYear()} Kebabai Todzy
      </footer>
    </div>
  )
}
