import Link from 'next/link'

export default function KebabManagement() {
  const sample = [
    { id: 1, name: 'Kebabinė A' },
    { id: 2, name: 'Kebabinė B' }
  ]

  return (
    <main style={{ padding: 20 }}>
      <h1>Kebabų valdymo langas (admin)</h1>
      <ul>
        {sample.map(s => (
          <li key={s.id}>{s.name} — <Link href={`/admin/add-kebab`}>Edit</Link></li>
        ))}
      </ul>
      <p><Link href="/admin/add-kebab">Pridėti naują kebabą</Link></p>
      <p><Link href="/">Back to Pagrindinis</Link></p>
    </main>
  )
}
