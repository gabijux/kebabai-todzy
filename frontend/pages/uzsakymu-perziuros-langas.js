import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function UzsakymuPerziurosLangas() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      setLoading(false)
      return
    }

    const u = JSON.parse(stored)
    setUser(u)

    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders/user/${u.id}`)
        if (!res.ok) {
          throw new Error('Nepavyko gauti užsakymų')
        }
        const data = await res.json()
        setOrders(data)
      } catch (err) {
        console.error(err)
        setError('Nepavyko gauti užsakymų')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

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
    maxWidth: 800,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const tableHeaderCell = {
    textAlign: 'left',
    padding: '8px 4px',
    borderBottom: '1px solid #ddd',
    fontWeight: 'bold',
    fontSize: 14
  }

  const tableCell = {
    padding: '6px 4px',
    borderBottom: '1px solid #eee',
    fontSize: 14
  }

  return (
    <main style={pageStyle}>
      <h1>Užsakymų peržiūros langas</h1>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {/* Būsena: ne prisijungęs */}
          {!user && !loading && !error && (
            <p>
              Norėdami matyti užsakymus, prisijunkite prie sistemos.{' '}
              <Link href="/prisijungimo-langas" style={{ color: '#3498db' }}>
                Eiti į prisijungimo langą
              </Link>
            </p>
          )}

          {/* Kraunama */}
          {loading && (
            <p>Kraunama...</p>
          )}

          {/* Klaida */}
          {error && (
            <div style={{ 
              background: '#7f1d1d', 
              color: '#fff', 
              padding: 10, 
              borderRadius: 8,
              marginBottom: 10
            }}>
              {error}
            </div>
          )}

          {/* Užsakymai */}
          {user && !loading && !error && (
            <>
              {orders.length === 0 ? (
                <p>Užsakymų dar neturite.</p>
              ) : (
                <>
                  <h2 style={{ marginTop: 0 }}>Jūsų užsakymai</h2>
                  <table style={{ 
                    width: '100%', 
                    marginTop: 10, 
                    borderCollapse: 'collapse' 
                  }}>
                    <thead>
                      <tr>
                        <th style={tableHeaderCell}>ID</th>
                        <th style={tableHeaderCell}>Data</th>
                        <th style={tableHeaderCell}>Suma (€)</th>
                        <th style={tableHeaderCell}>Būsena</th>
                        <th style={tableHeaderCell}>Veiksmai</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td style={tableCell}>{order.id}</td>
                          <td style={tableCell}>
                            {new Date(order.orderDate).toLocaleString()}
                          </td>
                          <td style={tableCell}>{order.amount.toFixed(2)}</td>
                          <td style={tableCell}>{order.status}</td>
                          <td style={tableCell}>
                            <button
                              onClick={() => router.push(`/uzsakymo-langas?id=${order.id}`)}
                              style={{
                                padding: '6px 10px',
                                borderRadius: 6,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: '#3498db',
                                color: '#fff',
                                fontSize: 13
                              }}
                            >
                              Peržiūrėti
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </>
          )}
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
