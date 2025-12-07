import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function KebabinesValdymoLangas() {
  const router = useRouter()
  const { id } = router.query
  const isEditMode = !!id

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    phoneNumber: '',
    email: '',
    rating: 0,
    openingHours: '',
    employeeCount: 0,
    xCoordinate: 0,
    yCoordinate: 0
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isEditMode) {
      setLoading(true)
      fetch(`/api/kebabines/${id}`)
        .then(res => {
          if (!res.ok) throw new Error('Nepavyko gauti duomenų')
          return res.json()
        })
        .then(data => {
          setForm(data)
          setLoading(false)
        })
        .catch(err => {
          setError(err.message)
          setLoading(false)
        })
    }
  }, [id, isEditMode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: (name === 'rating' || name === 'employeeCount' || name === 'xCoordinate' || name === 'yCoordinate') 
        ? parseFloat(value) 
        : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const url = isEditMode ? `/api/kebabines/${id}` : '/api/kebabines'
      const method = isEditMode ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) {
        throw new Error('Nepavyko išsaugoti duomenų')
      }

      alert(isEditMode ? 'Kebabinė atnaujinta!' : 'Kebabinė sukurta!')
      router.push('/kebabiniu-saraso-langas')

    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  const containerStyle = {
    padding: 20,
    fontFamily: 'Arial, sans-serif',
    maxWidth: 600,
    margin: '0 auto'
  }

  const formGroupStyle = {
    marginBottom: 15
  }

  const labelStyle = {
    display: 'block',
    marginBottom: 5,
    fontWeight: 'bold'
  }

  const inputStyle = {
    width: '100%',
    padding: 8,
    borderRadius: 4,
    border: '1px solid #ccc'
  }

  const buttonStyle = {
    padding: '10px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontSize: 16
  }

  if (loading && isEditMode && !form.name) return <div style={containerStyle}>Kraunama...</div>

  return (
    <div style={containerStyle}>
      <h1>{isEditMode ? 'Redaguoti kebabinę' : 'Pridėti naują kebabinę'}</h1>
      
      {error && <p style={{ color: 'red' }}>Klaida: {error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label style={labelStyle}>Pavadinimas</label>
          <input name="name" value={form.name} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Miestas</label>
          <input name="city" value={form.city} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Adresas</label>
          <input name="address" value={form.address} onChange={handleChange} style={inputStyle} required />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Telefonas</label>
          <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>El. paštas</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Darbo laikas</label>
          <input name="openingHours" value={form.openingHours} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Įvertinimas (0-5)</label>
          <input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Darbuotojų skaičius</label>
          <input name="employeeCount" type="number" value={form.employeeCount} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>X Koordinatė (Latitude)</label>
          <input name="xCoordinate" type="number" step="any" value={form.xCoordinate} onChange={handleChange} style={inputStyle} />
        </div>

        <div style={formGroupStyle}>
          <label style={labelStyle}>Y Koordinatė (Longitude)</label>
          <input name="yCoordinate" type="number" step="any" value={form.yCoordinate} onChange={handleChange} style={inputStyle} />
        </div>

        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Saugoma...' : 'Išsaugoti'}
        </button>
      </form>
      
      <p style={{ marginTop: 30 }}>
        <Link href="/kebabiniu-saraso-langas" style={{ color: '#3498db', textDecoration: 'none' }}>← Atgal į sąrašą</Link>
      </p>
    </div>
  )
}
