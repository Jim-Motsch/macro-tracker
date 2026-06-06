'use client'

import { useState } from 'react'

type Food = {
  fdcId: number
  description: string
  brandName?: string
  foodNutrients: { nutrientId: number; value: number }[]
}

export default function FoodSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Food[]>([])
  const [loading, setLoading] = useState(false)

  async function handleSearch() {
    if (!query) return
    setLoading(true)
    const res = await fetch(`/api/food?query=${query}`)
    const data = await res.json()
    setResults(data.foods || [])
    setLoading(false)
  }

  function getNutrient(food: Food, id: number) {
    return food.foodNutrients.find(n => n.nutrientId === id)?.value ?? 0
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Search for a food..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleSearch}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      <ul className="space-y-2">
        {results.map(food => (
          <li key={food.fdcId} className="border rounded p-3">
            <p className="font-semibold">{food.description}</p>
            {food.brandName && <p className="text-sm text-gray-500">{food.brandName}</p>}
            <p className="text-sm">
              Cal: {getNutrient(food, 1008)} |
              Protein: {getNutrient(food, 1003)}g |
              Carbs: {getNutrient(food, 1005)}g |
              Fat: {getNutrient(food, 1004)}g
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}