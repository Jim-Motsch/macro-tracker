import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
export async function GET() {
  return Response.json({ message: 'meals route works' })
}
export async function POST(request: Request) {
  console.log('POST /api/meals hit')

  const { userId } = await auth()
  //Gets the current user's Clerk ID from the session
  console.log('userId:', userId)

  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  //If no user is signed in reject the request immediately
  const body = await request.json()
  const { fdcId, name, calories, protein, carbs, fat, quantity } = body

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  })
  //looks up the User in the database using Clerk ID

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 })
  }

  const meal = await prisma.meal.create({
    data: {
      userId: user.id,
      foods: {
        create: {
          quantity,
          food: {
            connectOrCreate: {
              where: { fdcId: String(fdcId) },
              create: {
                fdcId: String(fdcId),
                name,
                calories,
                protein,
                carbs,
                fat
              }
            }
          }
        }
      }
    }
  })
  //Creates a new Meal in the database linked to the User
  return Response.json(meal)
}