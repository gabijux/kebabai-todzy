import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function PaskyrosLangas() {

  const router = useRouter() 

  const [user, setUser] = useState(null)
  const [editable, setEditable] = useState(false)
  const [formValues, setFormValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  })

  const [message, setMessage] = useState(null)

  // Load user data from session (localStorage)
  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      const u = JSON.parse(stored)
      setUser(u)
      setFormValues({
        firstName: u.firstName || '',
        lastName: u.lastName || '',
        email: u.email || '',
        phoneNumber: u.phoneNumber || '',
        address: u.address || ''
      })
    }
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues(prev => ({ ...prev, [name]: value }))
  }

  const handleEditToggle = async () => {
    if (editable) {
      // IŠSAUGOJIMAS
      try {
        const res = await fetch("/api/users/edit", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            id: user.id,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            phoneNumber: formValues.phoneNumber,
            address: formValues.address
          })
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage({ type: 'error', text: data.errors?.[0] || "Nepavyko išsaugoti." });
          return;
        }

        // SUCCESS
        setMessage({ type: 'success', text: data.message });

        // Atnaujinti localStorage su NAUJOMIS reikšmėmis
        const updatedUser = data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setEditable(false);

      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: "Serverio klaida." });
      }
    } 
    else {
      // PEREITI Į REDAGAVIMO REŽIMĄ
      setEditable(true);
      setMessage(null);
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
    maxWidth: 500,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const inputStyle = (locked) => ({
    width: '100%',
    padding: 8,
    marginBottom: 12,
    borderRadius: 6,
    border: '1px solid #ccc',
    backgroundColor: locked ? '#eeeeee' : '#ffffff',
    color: '#111'
  })

  // Jei nėra prisijungusio naudotojo
  if (!user) {
    return (
      <main style={pageStyle}>
        <h1>Paskyros langas</h1>

        <div style={centerWrapper}>
          <div style={{ ...cardStyle, textAlign: 'center' }}>
            <p>Nėra prisijungusio naudotojo.</p>
            <p>
              <Link href="/prisijungimo-langas" style={{ color: '#3498db' }}>
                Eiti į prisijungimo langą
              </Link>
            </p>
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

  return (
    <main style={pageStyle}>
      <h1>Paskyros langas</h1>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {/* Pranešimai */}
          {message && (
            <div style={{
              background: message.type === 'success' ? '#14532d' : '#7f1d1d',
              color: 'white',
              padding: 10,
              borderRadius: 8,
              marginBottom: 20
            }}>
              {message.text}
            </div>
          )}

          {/* Forma */}
          <div>
            <label>Vardas</label>
            <input
              style={inputStyle(!editable)}
              name="firstName"
              value={formValues.firstName}
              onChange={handleChange}
              disabled={!editable}
            />

            <label>Pavardė</label>
            <input
              style={inputStyle(!editable)}
              name="lastName"
              value={formValues.lastName}
              onChange={handleChange}
              disabled={!editable}
            />

            <label>El. paštas</label>
            <input
              style={inputStyle(!editable)}
              name="email"
              value={formValues.email}
              onChange={handleChange}
              disabled={!editable}
            />

            <label>Telefono numeris</label>
            <input
              style={inputStyle(!editable)}
              name="phoneNumber"
              value={formValues.phoneNumber}
              onChange={handleChange}
              disabled={!editable}
            />

            <label>Adresas</label>
            <input
              style={inputStyle(!editable)}
              name="address"
              value={formValues.address}
              onChange={handleChange}
              disabled={!editable}
            />

            <button
              onClick={handleEditToggle}
              style={{
                width: '100%',
                padding: '10px 20px',
                marginTop: 10,
                cursor: 'pointer',
                backgroundColor: '#eab308',
                border: 'none',
                borderRadius: 8,
                fontWeight: 'bold'
              }}
            >
              {editable ? "Išsaugoti" : "Redaguoti"}
            </button>
          </div>

          {/* Mygtukai po forma */}
          <div style={{ marginTop: 20, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              onClick={() => router.push('/paskyros-salinimo-langas')}
              style={{ 
                flex: 1,
                background: '#e74c3c', 
                color: '#fff',
                padding: "8px 12px",
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer' 
              }}
            >
              Paskyros šalinimo langas
            </button>

            <button 
              onClick={() => router.push('/slaptazodzio-keitimo-langas')}
              style={{ 
                flex: 1,
                background: '#3498db', 
                color: '#fff',
                padding: "8px 12px",
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Slaptažodžio keitimo langas
            </button>
          </div>

          {/* Nuolaidos kodas */}
          <div style={{ marginTop: 20 }}>
            <button
              style={{
                width: '100%',
                background: '#16a34a',
                color: '#fff',
                padding: "8px 12px",
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (user.ordersCount >= 5) {
                  router.push('/nuolaidos-kodo-generavimo-langas')
                } else {
                  setMessage({ type: 'error', text: 'Nuolaidos kodo generavimas negalimas.' })
                }
              }}
            >
              Gauti nuolaidos kodą
            </button>
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
