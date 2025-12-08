import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function KeboboValdymoLangas() {
  const router = useRouter()
  const { id } = router.query

  const [kebab, setKebab] = useState({
    name: '',
    size: 'Small',
    price: 0,
    category: '',
    sauce: '',
    calories: 0,
    proteins: 0,
    fats: 0,
    carbohydrates: 0,
    spicy: false,
    description: '',
    ingredients: [] // store selected ingredient IDs
  })

  const [ingredients, setIngredients] = useState([]) // all available ingredients
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [message, setMessage] = useState(null)

  const sizeOptions = ['Small', 'Big']

  // --- Fetch all ingredients ---
  useEffect(() => {
    fetch('/api/ingredients')
      .then(res => res.json())
      .then(data => setIngredients(data))
      .catch(err => console.error(err))
  }, [])

  // --- Fetch kebab if editing ---
  useEffect(() => {
    if (id) {
      setLoading(true)
      fetch(`/api/kebabas/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Nepavyko gauti kebabo duomenų')
          return res.json()
        })
        .then(data => {
          setKebab({
            ...data,
            size: data.size === 1 || data.size === 'Big' ? 'Big' : 'Small',
            ingredients: data.Ingredients?.map(i => i.id) || []
          })
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false))
    }
  }, [id])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name === 'ingredients') {
      const ingredientId = parseInt(value)
      setKebab(prev => ({
        ...prev,
        ingredients: checked
          ? [...prev.ingredients, ingredientId]
          : prev.ingredients.filter(id => id !== ingredientId)
      }))
    } else {
      setKebab(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setMessage(null)

    try {
      const method = id ? 'PUT' : 'POST'
      const url = id ? `/api/kebabas/${id}` : '/api/kebabas'

      // Wrap ingredient IDs into objects for backend
      const payload = {
        ...kebab,
        size: kebab.size === 'Big' ? 1 : 0,
        Ingridientas: kebab.ingredients.map(id => ({ id }))
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      let data = null
      try {
        data = await res.json()
      } catch {}

      if (!res.ok) {
        throw new Error(data?.errors?.join(', ') || 'Klaida siunčiant duomenis')
      }

      setMessage(id ? 'Kebabas sėkmingai atnaujintas!' : 'Kebabas sėkmingai pridėtas!')

      if (!id) {
        setKebab({
          name: '',
          size: 'Small',
          price: 0,
          category: '',
          sauce: '',
          calories: 0,
          proteins: 0,
          fats: 0,
          carbohydrates: 0,
          spicy: false,
          description: '',
          ingredients: []
        })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main style={{ padding: 20, maxWidth: 700, margin: '0 auto' }}>
      <h1>{id ? 'Redaguoti kebabą' : 'Pridėti kebabą'}</h1>

      {loading && <p>Kraunama...</p>}
      {error && <p style={{ color: 'red' }}>Klaida: {error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 15 }}>
        <label>
          Pavadinimas
          <input
            type="text"
            name="name"
            value={kebab.name}
            onChange={handleChange}
            placeholder="Įveskite kebabo pavadinimą"
            required
          />
        </label>

        <label>
          Dydis
          <select name="size" value={kebab.size} onChange={handleChange}>
            {sizeOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label>
          Kaina (€)
          <input
            type="number"
            name="price"
            value={kebab.price}
            onChange={handleChange}
            placeholder="Įveskite kainą"
            step="0.01"
            min="0"
            required
          />
        </label>

        {/* Ingredients */}
        <fieldset style={{ border: '1px solid #ccc', padding: 10, borderRadius: 5 }}>
          <legend>Ingridientai</legend>
          {ingredients.length === 0 ? (
            <p>Kraunama ingridientai...</p>
          ) : (
            ingredients.map(ing => (
              <label key={ing.id} style={{ display: 'block', marginBottom: 4 }}>
                <input
                  type="checkbox"
                  name="ingredients"
                  value={ing.id}
                  checked={kebab.ingredients.includes(ing.id)}
                  onChange={handleChange}
                /> {ing.name} ({ing.Category})
              </label>
            ))
          )}
        </fieldset>

        <label>
          Aprašymas
          <textarea
            name="description"
            value={kebab.description}
            onChange={handleChange}
            placeholder="Įveskite aprašymą"
            rows="3"
          />
        </label>

        <label>
          <input
            type="checkbox"
            name="spicy"
            checked={kebab.spicy}
            onChange={handleChange}
          /> Aštrus
        </label>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#2ecc71', color: 'white', border: 'none', borderRadius: 5 }}>
          {id ? 'Išsaugoti pakeitimus' : 'Pridėti kebabą'}
        </button>
      </form>

      <p style={{ marginTop: 30 }}>
        <Link href="/kebabu-saraso-langas">← Atgal į Kebabų sąrašo langą</Link>
      </p>
    </main>
  )
}