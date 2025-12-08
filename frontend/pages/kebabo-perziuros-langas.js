import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function KebaboPerziurosLangas() {
  const router = useRouter()
  const { id } = router.query

  const [kebab, setKebab] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    fetchKebab()
  }, [id])

  const fetchKebab = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch(`/api/kebabas/${id}`)
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || 'Nepavyko užkrauti kebabo')
      }
      const data = await res.json()
      setKebab(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Įvyko klaida')
    } finally {
      setLoading(false)
    }
  }

  if (!id) return <main style={{ padding: 20 }}><p>Pasirinkite kebabą...</p></main>
  if (loading) return <main style={{ padding: 20 }}><p>Kraunama...</p></main>
  if (error) return <main style={{ padding: 20 }}><p>Klaida: {error}</p></main>
  if (!kebab) return <main style={{ padding: 20 }}><p>Kebabas nerastas.</p></main>

  return (
    <main style={{ padding: 20 }}>
      <h1>{kebab.name}</h1>
      <p>{kebab.description}</p>

      <div style={{ marginTop: 10 }}>
        <strong>Kategorija:</strong> {kebab.category}<br />
        <strong>Kaina:</strong> €{(Number(kebab.price) || 0).toFixed(2)}
      </div>

      <h2 style={{ marginTop: 20 }}>Ingredientai</h2>
      {Array.isArray(kebab.ingredients) && kebab.ingredients.length > 0 ? (
        <ul>
          {kebab.ingredients.map(i => (
            <li key={i.id}>
              <strong>{i.name}</strong>
              {i.amount ? ` — ${i.amount} g` : ''}
              {i.category ? ` (${i.category})` : ''}
              {i.price ? ` — €${Number(i.price).toFixed(2)}` : ''}
            </li>
          ))}
        </ul>
      ) : (
        <p>Ingredientai nerasta.</p>
      )}

      <p style={{ marginTop: 30 }}><Link href="/kebabu-saraso-langas">← Atgal į Kebabų sąrašo langą</Link></p>
    </main>
  )
}
