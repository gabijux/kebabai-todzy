import Link from 'next/link'

export default function Order() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Užsakymo langas</h1>
      <p>Demo order flow starts here.</p>
      <p><Link href="/cart">Go to Krepšelis</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
