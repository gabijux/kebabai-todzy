import Link from 'next/link'

export default function Cart() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Krepšelis</h1>
      <p>Your cart is empty (demo).</p>
      <p><Link href="/order">Create order</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
