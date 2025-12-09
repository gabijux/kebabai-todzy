import Link from 'next/link'
import { useRouter } from 'next/router'

export default function AtsijungimoLangas() {
  const router = useRouter()

  const handleLogout = () => {
    // 1. Ištrinti naudotojo sesiją
    localStorage.removeItem("user")

    // 2. Nukreipti į pagrindinį langą
    router.push("/")
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
    textAlign: 'center',
  }

  const buttonStyle = {
    width: '100%',
    padding: '10px 16px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#e74c3c',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 10,
  }

  return (
    <main style={pageStyle}>
      {/* Antraštė paliekama viršuje */}
      <h1>Atsijungimo langas</h1>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          <p>Ar tikrai norite atsijungti?</p>

          <button 
            onClick={handleLogout}
            style={buttonStyle}
          >
            Atsijungti
          </button>
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
