import Link from 'next/link'

export default function Login() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Prisijungimo langas</h1>
      <p>This is a demo login page.</p>
        <li><Link href="/register">Registracijos langas</Link></li>
      <p><Link href="/">Back to Pagrindinis</Link></p>
      </main>
  )
}
