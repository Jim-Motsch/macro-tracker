import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
//get the userid
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
//if there is no user Unauthorized
  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)
//set todays date
  const meals = await prisma.meal.findMany({
    where: {
      userId: user.id,
      date: { gte: today }
    },
    include: {
      foods: {
        include: { food: true }
      }
    }
  })
//fetch the meals from today with all details included
  return Response.json(meals)
}