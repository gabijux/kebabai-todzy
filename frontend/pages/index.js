import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Pagrindinis langas</h1>

      <h2>Navigacija</h2>
      <ul>
        <li><Link href="/kebabine/list">Kebabinių sąrašas</Link></li>
        <li><Link href="/kebabine/nearby">Artimiausios kebabinės</Link></li>
        <li><Link href="/kebabine/info">Kebabinės informacija</Link></li>
        <li><Link href="/order">Užsakymo langas</Link></li>
        <li><Link href="/cart">Krepšelis</Link></li>
        <li><Link href="/admin/kebab-management">Kebabu valdymas (admin)</Link></li>
        <li><Link href="/admin/add-kebab">Kebabo pridėjimas (admin)</Link></li>
        <li><Link href="/account">Paskyros langas</Link></li>
        <li><Link href="/orders/review">Užsakymų peržiūra</Link></li>
        <li><Link href="/login">Prisijungimo langas</Link></li>
        <li><Link href="/logout">Atsijungimo langas</Link></li>
      </ul>
    </main>
  )
}
