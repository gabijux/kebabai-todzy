import Link from 'next/link'

export default function Register() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Registracijos langas</h1>
      <p>This is a demo registration page.</p>
      <p><Link href="/login">Back to Prisijungimas</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
