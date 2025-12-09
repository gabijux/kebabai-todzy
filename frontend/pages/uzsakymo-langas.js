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

  const subtotal = cart.items.reduce((sum, it) => sum + ((it.price || 0) * (it.quantity || 0)), 0)
  const discountAmount = +(subtotal * (discountPercent / 100)).toFixed(2)
  const total = +(subtotal - discountAmount).toFixed(2)

  const applyDiscount = () => {
    // simple demo: DISCOUNT10 -> 10% off
    if (!discountCode) { setDiscountPercent(0); return }
    if (discountCode.trim().toUpperCase() === 'DISCOUNT10') {
      setDiscountPercent(10)
    } else {
      setDiscountPercent(0)
      alert('Neteisingas nuolaidos kodas')
    }
  }

  const handlePay = async () => {
    // Build payload
    const stored = localStorage.getItem('user')
    const parsed = stored ? JSON.parse(stored) : null
    const userId = parsed?.id ?? parsed?.Id ?? parsed?.userId ?? null

    if (!userId) {
      // For demo require login
      alert('Prašome prisijungti prieš tęsiant užsakymą')
      router.push('/prisijungimo-langas')
      return
    }

    setProcessing(true)
    try {
      const payload = {
        UserId: userId,
        Items: cart.items.map(i => ({ KebabasId: i.id, Quantity: i.quantity })),
        Amount: total,
        DiscountCode: discountCode || null
      }

      const payloadWithReturn = { ...payload, ReturnUrl: window.location.origin + '/uzsakymo-langas' }

      const res = await fetch('/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadWithReturn)
      })

      const data = await res.json()

      if (!res.ok) {
        const txt = JSON.stringify(data)
        throw new Error(txt || 'Nepavyko apdoroti apmokėjimo')
      }

      // If Stripe requires redirect for additional action, redirect the browser
      if (data.requiresAction && data.redirectUrl) {
        // navigate user to Stripe's hosted authentication/3DS flow
        window.location.href = data.redirectUrl
        return
      }

      // success: server created order and returned orderId
      clearCart()
      router.push(`/uzsakymo-langas?id=${data.orderId || data.id || data.Id}`)
    } catch (err) {
      console.error(err)
      alert('Klaida apdorojant užsakymą')
    } finally {
      setProcessing(false)
    }
  }

  if (id) {
    return (
      <main style={{ padding: 20 }}>
        <h1>Užsakymo langas</h1>

        {loading && <p>Kraunama...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {order && !loading && !error && (
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: 20,
            borderRadius: 16,
            maxWidth: 500,
            marginBottom: 20,
            color: 'white'
          }}>
            <p><strong>Užsakymo ID:</strong> {order.id}</p>
            <p><strong>Data:</strong> {new Date(order.orderDate).toLocaleString()}</p>
            <p><strong>Suma:</strong> {order.amount.toFixed(2)} €</p>
            <p><strong>Būsena:</strong> {order.status}</p>
          </div>
        )}

        <p style={{ marginTop: 30 }}>
          <Link href="/uzsakymu-perziuros-langas">← Atgal į Užsakymų peržiūros langą</Link>
          {' | '}
          <Link href="/krepselio-langas">← Atgal į Krepšelio langą</Link>
        </p>
      </main>
    )
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Užsakymo peržiūra</h1>

      {cart.items.length === 0 && <p>Krepšelis tuščias.</p>}

      {cart.items.map(item => (
        <div key={item.id} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8, marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ margin: 0 }}>{item.name}</h3>
              <div>Kiekis: {item.quantity}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div>{(item.price || 0).toFixed(2)} €</div>
              <div style={{ fontWeight: 'bold' }}>{((item.price || 0) * (item.quantity || 0)).toFixed(2)} €</div>
            </div>
          </div>
        </div>
      ))}

      <div style={{ marginTop: 12 }}>
        <div><strong>Bendra suma:</strong> {subtotal.toFixed(2)} €</div>
        <div style={{ marginTop: 6 }}>
          <input type="text" placeholder="Nuolaidos kodas" value={discountCode} onChange={e => setDiscountCode(e.target.value)} style={{ padding: 8, marginRight: 8 }} />
          <button onClick={applyDiscount} style={{ padding: '8px 12px' }}>Taikyti</button>
        </div>
        <div style={{ marginTop: 6 }}><strong>Nuolaida:</strong> {discountPercent}% (-{discountAmount.toFixed(2)} €)</div>
        <div style={{ marginTop: 6, fontSize: 18 }}><strong>Bendra suma:</strong> {total.toFixed(2)} €</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button onClick={() => setShowCardModal(true)} disabled={processing || cart.items.length === 0} style={{ padding: '10px 16px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 6 }}>{processing ? 'Apdorojama...' : 'Mokėti'}</button>
        <Link href="/krepselio-langas" style={{ marginLeft: 12 }}>← Atgal į Krepšelio langą</Link>
      </div>

      {showCardModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 400, maxWidth: '90%' }}>
            <h2>Mokėjimas</h2>
            <p>Įveskite kortelės numerį (test):</p>
            <input
              type="text"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              placeholder="Kortelės numeris"
              style={{ width: '100%', padding: 8, marginBottom: 8 }}
            />
            {cardError && <div style={{ color: 'red', marginBottom: 8 }}>{cardError}</div>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button onClick={() => { setShowCardModal(false); setCardError(''); }} style={{ padding: '8px 12px' }}>Atšaukti</button>
              <button onClick={() => {
                // validate card number: test value is '42424242'
                if (cardNumber.trim() === '42424242') {
                  setCardError('')
                  setShowCardModal(false)
                  // proceed with payment
                  handlePay()
                } else {
                  setCardError('Neteisingas kortelės numeris')
                }
              }} style={{ padding: '8px 12px', background: '#27ae60', color: 'white', border: 'none', borderRadius: 4 }}>Patvirtinti</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
