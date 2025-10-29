import Link from 'next/link'

export default function About() {
  return (
    <main style={{ padding: 20 }}>
      <h1>About</h1>
      <p>This is a sample Next.js frontend that proxies API requests to a .NET backend.</p>
      <p><Link href="/">Home</Link></p>
    </main>
  )
}
