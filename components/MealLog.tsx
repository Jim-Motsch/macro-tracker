'use client'

import { useEffect, useState } from 'react'

type MealFood = {
  quantity: number
  food: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

type Meal = {
  id: string
  date: string
  foods: MealFood[]
}

type Goal = {
  calories: number
  protein: number
  carbs: number
  fat: number
}

export default function MealLog({ refreshKey }: { refreshKey: number }) {
  const [meals, setMeals] = useState<Meal[]>([])
  const [goal, setGoal] = useState<Goal | null>(null)

  useEffect(() => {
    fetch('/api/meals/today')
      .then(res => res.json())
      .then(data => setMeals(data))

    fetch('/api/goals')
      .then(res => res.json())
      .then(data => setGoal(data))
  }, [refreshKey])  // ← refetches whenever refreshKey changes

  const totalCalories = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.calories * f.quantity, 0)
  const totalProtein = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.protein * f.quantity, 0)
  const totalCarbs = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.carbs * f.quantity, 0)
  const totalFat = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.fat * f.quantity, 0)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Today&apos;s Meals</h2>
      
      {goal && (
        <div className="mb-4 p-3 border rounded bg-blue-50">
          <p className="font-semibold">Remaining</p>
          <p className="text-sm">
            Cal: {(goal.calories - totalCalories).toFixed(0)} | 
            Protein: {(goal.protein - totalProtein).toFixed(1)}g | 
            Carbs: {(goal.carbs - totalCarbs).toFixed(1)}g | 
            Fat: {(goal.fat - totalFat).toFixed(1)}g
          </p>
        </div>
      )}

      <div className="mb-4 p-3 border rounded">
        <p className="font-semibold">Today&apos;s Totals</p>
        <p className="text-sm">
          Cal: {totalCalories.toFixed(0)} | 
          Protein: {totalProtein.toFixed(1)}g | 
          Carbs: {totalCarbs.toFixed(1)}g | 
          Fat: {totalFat.toFixed(1)}g
        </p>
      </div>

      <ul className="space-y-2">
        {meals.flatMap(m => m.foods).map((mealFood, i) => (
          <li key={i} className="border rounded p-3">
            <p className="font-semibold">{mealFood.food.name}</p>
            <p className="text-sm">
              Cal: {mealFood.food.calories} | 
              Protein: {mealFood.food.protein}g | 
              Carbs: {mealFood.food.carbs}g | 
              Fat: {mealFood.food.fat}g
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}