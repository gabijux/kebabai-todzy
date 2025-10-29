import Link from 'next/link'

export default function Nearby() {

  return (
    <main style={{ padding: 20 }}>
      <h1>Artimiausios kebabinės</h1>
      <ul>
        <li><Link href={`/kebabine/info`}>Kebabinė C (200m)</Link></li>
        <li><Link href={`/kebabine/info`}>Kebabinė D (500m)</Link></li>
      </ul>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
