import { Suspense } from 'react'
import { getDashboardData } from '@/lib/high-light-hooks'
import DashboardShell from '@/components/high-light/dashboard-shell'
import SkeletonDashboard from '@/components/high-light/skeleton-dashboard'

export default async function DashboardPage() {
  // Fetch data from Payload CMS
  const dashboardData = await getDashboardData()

  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <DashboardShell data={dashboardData} />
    </Suspense>
  )
}
