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

  

  if (!user) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Paskyros langas</h1>
        <p>Nėra prisijungusio naudotojo.</p>
        <Link href="/">← Atgal į Pagrindinį langą</Link>
      </main>
    )
  }

  const inputStyle = (locked) => ({
    width: '100%',
    padding: '8px',
    marginBottom: 12,
    borderRadius: 6,
    border: '1px solid #555',
    backgroundColor: locked ? '#2a2a2a' : '#111',
    color: locked ? '#aaa' : '#fff'
  })

  return (
    <main style={{ padding: 20 }}>
      <h1>Paskyros langas</h1>

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

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: 20,
        borderRadius: 16,
        maxWidth: 500
      }}>
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
            padding: '10px 20px',
            marginTop: 20,
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

  <button 
    onClick={() => router.push('/paskyros-salinimo-langas')}
    style={{ 
      background: '#e74c3c', 
      color: '#fff',
      padding: "6px 12px",
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
    background: '#3498db', 
    color: '#fff',
    padding: "6px 12px",
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    marginLeft: 10
  }}
>
  Slaptažodžio keitimo langas
</button>


      <ul>
        <li>
          <button
            style={{
              background: '#16a34a',
              color: '#fff',
              padding: "6px 12px",
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
            >Gauti nuolaidos kodą</button>
        </li>
      </ul>

      <p style={{ marginTop: 30 }}><Link href="/">← Atgal į Pagrindinį langą</Link></p>
    </main>
  )
}
