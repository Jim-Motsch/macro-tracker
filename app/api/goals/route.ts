import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const goal = await prisma.macroGoal.findUnique({ where: { userId: user.id } })
  return Response.json(goal)
}

export async function POST(request: Request) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) return Response.json({ error: 'User not found' }, { status: 404 })

  const { calories, protein, carbs, fat } = await request.json()

  const goal = await prisma.macroGoal.upsert({
    where: { userId: user.id },
    update: { calories, protein, carbs, fat },
    create: { userId: user.id, calories, protein, carbs, fat }
  })

  return Response.json(goal)
}