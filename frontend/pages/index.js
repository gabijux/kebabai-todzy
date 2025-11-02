import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  const handleLogout = (e) => {
    e.preventDefault()
    alert('You have been logged out!')
    router.push('/')
  }

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

  const linkStyle = {
    display: 'block',
    padding: '10px 16px',
    margin: '6px 0',
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#f0f0f0',
    textDecoration: 'none',
  }

  const logoutButtonStyle = {
    display: 'block',
    padding: '10px 16px',
    margin: '6px 0',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#c0392b',
    color: '#fff',
    width: '100%',
    textAlign: 'left',
  }

  return (
    <div style={containerStyle}>
      <header>
        <h1>Pagrindinis langas</h1>
      </header>

      <main style={cardStyle}>
        <h2>Navigacija</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link href="/kebabine/list" style={linkStyle}>Kebabinių sąrašas</Link></li>
          <li><Link href="/kebabine/nearby" style={linkStyle}>Artimiausios kebabinės</Link></li>
          <li><Link href="/kebabine/info" style={linkStyle}>Kebabinės informacija</Link></li>
          <li><Link href="/order" style={linkStyle}>Užsakymo langas</Link></li>
          <li><Link href="/cart" style={linkStyle}>Krepšelis</Link></li>
          <li><Link href="/admin/kebab-management" style={linkStyle}>Kebabu valdymas (admin)</Link></li>
          <li><Link href="/admin/add-kebab" style={linkStyle}>Kebabo pridėjimas (admin)</Link></li>
          <li><Link href="/account" style={linkStyle}>Paskyros langas</Link></li>
          <li><Link href="/orders/review" style={linkStyle}>Užsakymų peržiūra</Link></li>
          <li><Link href="/login" style={linkStyle}>Prisijungimo langas</Link></li>
          <li><button onClick={handleLogout} style={logoutButtonStyle}>Atsijungimo langas</button></li>
        </ul>
      </main>

      <footer style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>
        © {new Date().getFullYear()} Tavo App
      </footer>
    </div>
  )
}
