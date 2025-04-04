import { Suspense } from 'react'
import { getUserById, getAllUsers } from '@/lib/high-light-hooks'
import UserDetailShell from '@/components/high-light/user-detail-shell'
import SkeletonDashboard from '@/components/high-light/skeleton-dashboard'
import { notFound } from 'next/navigation'

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch user data from Payload CMS
  const { id } = await params
  const userId = id
  const userData = await getUserById(userId)

  // Fetch all users for the selector
  const allUsers = await getAllUsers()

  // If user not found, show 404
  if (!userData) {
    notFound()
  }

  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <UserDetailShell user={userData} allUsers={allUsers} />
    </Suspense>
  )
}
