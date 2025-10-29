import Link from 'next/link'

export default function Logout() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Atsijungimo langelis</h1>
      <p>You have been logged out (demo).</p>
      
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
