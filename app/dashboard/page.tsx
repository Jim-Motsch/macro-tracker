'use client'
import { useState, useCallback } from 'react'
import { UserButton } from '@clerk/nextjs'
//Sign out button component from Clerk
import { currentUser } from '@clerk/nextjs/server'
//Clerk function that gets the currently signed in user's data
import FoodSearch from '@/components/FoodSearch'
import MealLog from '@/components/MealLog'
import MacroGoals from '@/components/MacroGoals'
export default function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleMealLogged = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Macro Tracker</h1>
        <UserButton />
      </div>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <MacroGoals />
          <FoodSearch onMealLogged={handleMealLogged} />
        </div>
        <MealLog refreshKey={refreshKey} />
      </div>
    </div>
  )
}