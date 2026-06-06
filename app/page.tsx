import { UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <div>
      <h1>Macro Tracker</h1>
      <UserButton />
    </div>
  )
}