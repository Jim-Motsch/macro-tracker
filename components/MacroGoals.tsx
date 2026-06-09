'use client'

import { useState, useEffect } from 'react'

export default function MacroGoals() {
  const [calories, setCalories] = useState('')
  const [protein, setProtein] = useState('')
  const [carbs, setCarbs] = useState('')
  const [fat, setFat] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/goals')
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCalories(String(data.calories))
          setProtein(String(data.protein))
          setCarbs(String(data.carbs))
          setFat(String(data.fat))
        }
      })
  }, [])

  async function handleSave() {
    const res = await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fat: Number(fat)
      })
    })
    if (res.ok) setSaved(true)
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Daily Goals</h2>
      <div className="space-y-2">
        <input className="border rounded p-2 w-full" placeholder="Calories" value={calories} onChange={e => setCalories(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Protein (g)" value={protein} onChange={e => setProtein(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Carbs (g)" value={carbs} onChange={e => setCarbs(e.target.value)} />
        <input className="border rounded p-2 w-full" placeholder="Fat (g)" value={fat} onChange={e => setFat(e.target.value)} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded w-full" onClick={handleSave}>
          Save Goals
        </button>
        {saved && <p className="text-green-500 text-sm">Goals saved!</p>}
      </div>
    </div>
  )
}