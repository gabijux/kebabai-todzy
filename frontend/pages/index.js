import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [user, setUser] = useState(null)
  const [openSections, setOpenSections] = useState({
    shopping: true,
    locations: false,
    account: true,
  })

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

  const toggleSection = (key) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }))
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
    backgroundColor: 'rgba(10,10,10,0.9)',
    border: '1px solid #333',
    borderRadius: 16,
    padding: 24,
    maxWidth: 1000,
    width: '95%',
    margin: '20px auto',
    boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
  }

  const sectionCard = {
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    border: '1px solid #333',
  }

  const sectionHeader = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
  }

  const sectionBody = {
    marginTop: 10,
  }

  const navListStyle = { listStyle: 'none', padding: 0, margin: 0 }
  const navItemStyle = { margin: '8px 0' }
  const linkStyle = { color: '#3498db', textDecoration: 'none' }

  const accountLinks = user
  ? [
      { href: '/paskyros-langas', label: 'Paskyros langas' },
      { href: '/atsijungimo-langas', label: 'Atsijungimo langas' },
    ]
  : [
      { href: '/prisijungimo-langas', label: 'Prisijungimo langas' },
    ]

  return (
    <div style={containerStyle}>
      <header style={{ padding: '0 10px' }}>
        <h1 style={{ marginBottom: 5 }}>Pagrindinis langas</h1>

        {user ? (
          <p style={{ marginTop: 10, fontSize: 16 }}>
            Prisijungęs: <strong>{user.firstName} {user.lastName}</strong><br />
            <span style={{ fontSize: 14, color: '#aaa' }}>
              Rolė: {user.role} | Užsakymų skaičius: {user.ordersCount ?? 0}
            </span>
          </p>
        ) : (
          <p style={{ marginTop: 10, fontSize: 16, color: '#ddd' }}>
            Sveiki, svečias! Norėdami pilno funkcionalumo - prisijunkite!
          </p>
        )}
      </header>

      <main style={cardStyle}>
        <h2 style={{ textAlign: 'center' }}> KEBABAI TODZY </h2>

        {/* Apsipirkimo / užsakymų sekcija */}
        <div style={sectionCard}>
          <div style={sectionHeader} onClick={() => toggleSection('shopping')}>
            <div>
              <h3 style={{ margin: 0 }}>Apsipirkimas ir užsakymai</h3>
              <small style={{ color: '#aaa' }}>Kebabai, krepšelis ir jūsų užsakymų istorija</small>
            </div>
            <span>{openSections.shopping ? '▲' : '▼'}</span>
          </div>

          {openSections.shopping && (
            <div style={sectionBody}>
              <ul style={navListStyle}>
                <li style={navItemStyle}>
                  <Link href="/kebabu-saraso-langas" style={linkStyle}>Kebabų sąrašo langas</Link>
                </li>
                <li style={navItemStyle}>
                  <Link href="/krepselio-langas" style={linkStyle}>Krepšelio langas</Link>
                </li>
                <li style={navItemStyle}>
                  <Link href="/uzsakymu-perziuros-langas" style={linkStyle}>Užsakymų peržiūros langas</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Kebabinių / lokacijų sekcija */}
        <div style={sectionCard}>
          <div style={sectionHeader} onClick={() => toggleSection('locations')}>
            <div>
              <h3 style={{ margin: 0 }}>Kebabinės ir vietovės</h3>
              <small style={{ color: '#aaa' }}>Artimiausios kebabinės ir visų kebabinių sąrašas</small>
            </div>
            <span>{openSections.locations ? '▲' : '▼'}</span>
          </div>

          {openSections.locations && (
            <div style={sectionBody}>
              <ul style={navListStyle}>
                <li style={navItemStyle}>
                  <Link href="/artimiausios-kebabines-langas" style={linkStyle}>Artimiausios kebabinės langas</Link>
                </li>
                <li style={navItemStyle}>
                  <Link href="/kebabiniu-saraso-langas" style={linkStyle}>Kebabinių sąrašo langas</Link>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Paskyros sekcija */}
<div style={sectionCard}>
  <div style={sectionHeader} onClick={() => toggleSection('account')}>
    <div>
      <h3 style={{ margin: 0 }}>Paskyra</h3>
      <small style={{ color: '#aaa' }}>Paskyros peržiūra, atsijungimas ir prisijungimas</small>
    </div>
    <span>{openSections.account ? '▲' : '▼'}</span>
  </div>

  {openSections.account && (
    <div style={sectionBody}>
      <ul style={navListStyle}>
        {accountLinks.map(link => (
          <li key={link.href} style={navItemStyle}>
            <Link href={link.href} style={linkStyle}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  )}
</div>

      </main>
    </div>
  )
}
