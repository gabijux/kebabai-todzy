import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getCart, clearCart } from '../utils/cart'

export default function UzsakymoLangas() {
  const router = useRouter()
  const { id } = router.query

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Review state
  const [cart, setCart] = useState({ items: [], createdAt: null })
  const [discountCode, setDiscountCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [showCardModal, setShowCardModal] = useState(false)
  const [cardNumber, setCardNumber] = useState('')
  const [cardError, setCardError] = useState('')

  useEffect(() => {
    if (id) {
      // show existing order
      const fetchOrder = async () => {
        setLoading(true)
        try {
          const res = await fetch(`/api/orders/${id}`)
          if (!res.ok) throw new Error('Užsakymas nerastas')
          const data = await res.json()
          setOrder(data)
        } catch (err) {
          console.error(err)
          setError('Nepavyko gauti užsakymo informacijos.')
        } finally {
          setLoading(false)
        }
      }
      fetchOrder()
      return
    }

    // otherwise prepare order review from cart
    const local = getCart()
    setCart(local)
  }, [id])

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
    maxWidth: 900,
    width: '100%',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  }

  const itemsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: 16,
    marginTop: 16
  }

  const itemCardStyle = {
    borderRadius: 12,
    backgroundColor: '#fafafa',
    border: '1px solid #e5e5e5',
    padding: 14,
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
  }

  const badge = (bg) => ({
    backgroundColor: bg,
    color: '#fff',
    borderRadius: 6,
    padding: '2px 6px',
    fontSize: 12,
    marginRight: 6
  })

  const getSizeLabel = (size) => {
    if (size === null || size === undefined) return 'Nenustatyta'
    return size === 0 ? 'Mažas' : 'Didelis'
  }

  return (
    <main style={pageStyle}>
      <h1>Užsakymo langas</h1>

      <div style={centerWrapper}>
        <div style={cardStyle}>
          {loading && <p>Kraunama...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}

          {order && !loading && !error && (
            <>
              {/* Užsakymo info */}
              <div style={{ marginBottom: 16 }}>
                <p><strong>Užsakymo ID:</strong> {order.id}</p>
                <p><strong>Data:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                <p><strong>Suma:</strong> {order.amount.toFixed(2)} €</p>
                <p><strong>Būsena:</strong> {order.status}</p>
              </div>

              {/* Užsakymo kebabai */}
              <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '16px 0' }} />
              <h2 style={{ marginTop: 0 }}>Užsakymo kebabai</h2>

              {!order.items || order.items.length === 0 ? (
                <p>Šiame užsakyme nėra prekių.</p>
              ) : (
                <div style={itemsGridStyle}>
                  {order.items.map(item => (
                    <div key={item.id} style={itemCardStyle}>
                      <h3 style={{ margin: '0 0 6px 0' }}>
                        {item.name} {item.spicy && <span title="Aštrus">🌶️</span>}
                      </h3>
                      {item.description && (
                        <p style={{ fontSize: 14, color: '#555', marginBottom: 8 }}>
                          {item.description}
                        </p>
                      )}

                      <div style={{ marginBottom: 8 }}>
                        {item.category && (
                          <span style={badge('#3498db')}>
                            {item.category}
                          </span>
                        )}
                        <span style={badge('#9b59b6')}>
                          {getSizeLabel(item.size)}
                        </span>
                      </div>

                      <p style={{ margin: 0, fontSize: 14 }}>
                        Kiekis: <strong>{item.quantity ?? 1}</strong>
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 14 }}>
                        Kaina už vnt.: <strong>{item.price.toFixed(2)} €</strong>
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: 14, color: '#e67e22', fontWeight: 'bold' }}>
                        Viso už šį kebabą:{' '}
                        {((item.quantity ?? 1) * item.price).toFixed(2)} €
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center' }}>
        <Link href="/uzsakymu-perziuros-langas" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Užsakymų peržiūros langą
        </Link>
        {' | '}
        <Link href="/krepselio-langas" style={{ color: '#3498db', textDecoration: 'none' }}>
          ← Atgal į Krepšelio langą
        </Link>
      </div>
    </main>
  )
}
