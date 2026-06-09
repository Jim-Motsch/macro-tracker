import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  // Get macro goals
  const goal = await prisma.macroGoal.findUnique({ where: { userId: user.id } })
  if (!goal) return Response.json({ error: 'No goals set' }, { status: 404 })

  // Get today's meals
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const meals = await prisma.meal.findMany({
    where: { userId: user.id, date: { gte: today } },
    include: { foods: { include: { food: true } } }
  })

  // Calculate remaining macros
  const eaten = meals.flatMap(m => m.foods).reduce(
    (acc, f) => ({
      calories: acc.calories + f.food.calories * f.quantity,
      protein: acc.protein + f.food.protein * f.quantity,
      carbs: acc.carbs + f.food.carbs * f.quantity,
      fat: acc.fat + f.food.fat * f.quantity,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  const remaining = {
    calories: goal.calories - eaten.calories,
    protein: goal.protein - eaten.protein,
    carbs: goal.carbs - eaten.carbs,
    fat: goal.fat - eaten.fat,
  }

  // Get foods from user history
  const historicalFoods = await prisma.food.findMany({
    where: {
      meals: {
        some: {
          meal: { userId: user.id }
        }
      }
    }
  })

  // Greedy algorithm - score each food by how well it fills remaining macros
  const scored = historicalFoods.map(food => {
    const score =
      (remaining.protein > 0 ? Math.min(food.protein, remaining.protein) / remaining.protein : 0) * 40 +
      (remaining.carbs > 0 ? Math.min(food.carbs, remaining.carbs) / remaining.carbs : 0) * 30 +
      (remaining.fat > 0 ? Math.min(food.fat, remaining.fat) / remaining.fat : 0) * 20 +
      (remaining.calories > 0 ? Math.min(food.calories, remaining.calories) / remaining.calories : 0) * 10

    return { food, score }
  })

  const suggestions = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(s => s.food)

  return Response.json({ remaining, suggestions })
}