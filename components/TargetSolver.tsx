'use client'

import { useState } from 'react'

type Food = {
  id: string
  name: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

type SolverResult = {
  remaining: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  suggestions: Food[]
}

export default function TargetSolver() {
  const [result, setResult] = useState<SolverResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSolve() {
    setLoading(true)
    const res = await fetch('/api/solver')
    const data = await res.json()
    setResult(data)
    setLoading(false)
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-4">Target Solver</h2>
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded w-full mb-4"
        onClick={handleSolve}
      >
        {loading ? 'Calculating...' : 'What should I eat?'}
      </button>

      {result && (
        <div>
          <div className="mb-4 p-3 border rounded bg-purple-50">
            <p className="font-semibold">Remaining macros</p>
            <p className="text-sm">
              Cal: {result.remaining.calories.toFixed(0)} |
              Protein: {result.remaining.protein.toFixed(1)}g |
              Carbs: {result.remaining.carbs.toFixed(1)}g |
              Fat: {result.remaining.fat.toFixed(1)}g
            </p>
          </div>

          <p className="font-semibold mb-2">Suggested foods:</p>
          <ul className="space-y-2">
            {result.suggestions.map(food => (
              <li key={food.id} className="border rounded p-3">
                <p className="font-semibold">{food.name}</p>
                <p className="text-sm">
                  Cal: {food.calories} |
                  Protein: {food.protein}g |
                  Carbs: {food.carbs}g |
                  Fat: {food.fat}g
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}