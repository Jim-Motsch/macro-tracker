import { UserButton } from '@clerk/nextjs'
//Sign out button component from Clerk
import { currentUser } from '@clerk/nextjs/server'
//Clerk function that gets the currently signed in user's data
import FoodSearch from '@/components/FoodSearch'
import MealLog from '@/components/MealLog'
export default async function Dashboard() {
//async because we're fetching the current user from clerk's server
  const user = await currentUser()
//Fetch current user
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Macro Tracker</h1>
        <UserButton />
      </div>
      <p>Welcome, {user?.firstName}!</p>
      <div className="grid grid-cols-2 gap-8">
        <FoodSearch />
        <MealLog />
      </div>
    </div>
  )
}