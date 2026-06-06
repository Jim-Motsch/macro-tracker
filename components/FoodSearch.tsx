'use client'

import { useState } from 'react'

type Food = {
  fdcId: number
  description: string
  brandName?: string
  foodNutrients: { nutrientId: number; value: number }[]
}
/*Defines the shape of a food object from the USDA API. This is ts telling the 
component what data to expect */
export default function FoodSearch() {
  const [query, setQuery] = useState('') //What's in the search box
  const [results, setResults] = useState<Food[]>([]) //list of foods returned
  const [loading, setLoading] = useState(false)//Shows searching on button

  async function handleSearch() {
    if (!query) return //do nothing if search is empty
    setLoading(true)
    const res = await fetch(`/api/food?query=${query}`) // calls the API route
    const data = await res.json()
    setResults(data.foods || []) // saves results to state, empty array if nothing
    setLoading(false)
  }

  function getNutrient(food: Food, id: number) {
    return food.foodNutrients.find(n => n.nutrientId === id)?.value ?? 0
  }
  async function logMeal(food: Food) {
    console.log('logging meal...')
  const res = await fetch('/api/meals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fdcId: food.fdcId,
      name: food.description,
      calories: getNutrient(food, 1008),
      protein: getNutrient(food, 1003),
      carbs: getNutrient(food, 1005),
      fat: getNutrient(food, 1004),
      quantity: 1
    })
  })
  console.log('response status', res.status)
  if (res.ok) {
    alert('Meal logged!')
  }
}
//Example: chicken, anything with chicken in the name gets put into an array and
//mapped out then displayed for the user to see
  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          className="border rounded p-2 flex-1"
          placeholder="Search for a food..."
          value={query}
          onChange={e => setQuery(e.target.value)} //query 'Chicken'
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
            <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                onClick={() => logMeal(food)}
            >
              Log this food
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}