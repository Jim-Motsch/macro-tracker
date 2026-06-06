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

export default function MealLog() {
  const [meals, setMeals] = useState<Meal[]>([])

  useEffect(() => {
    fetch('/api/meals/today')
      .then(res => res.json())
      .then(data => setMeals(data))
  }, [])

  const totalCalories = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.calories * f.quantity, 0)
  const totalProtein = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.protein * f.quantity, 0)
  const totalCarbs = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.carbs * f.quantity, 0)
  const totalFat = meals.flatMap(m => m.foods).reduce((sum, f) => sum + f.food.fat * f.quantity, 0)

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Todays Meals</h2>
      <div className="mb-4 p-3 border rounded">
        <p className="font-semibold">Daily Totals</p>
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