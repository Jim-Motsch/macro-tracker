

import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
//Defines what routes are public
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/webhooks(.*)'
])
export default clerkMiddleware(async (auth, request) => {
//This says - sign in and sign up pages are public, everyone can see them
//protect is from clerkMiddleWare library
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}