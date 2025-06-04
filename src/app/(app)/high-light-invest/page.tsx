import { Suspense } from "react"
import { getDashboardData } from "@/lib/high-light-invest-hooks"
import DashboardShell from "@/components/high-light-invest/dashboard-shell"
import SkeletonDashboard from "@/components/high-light-invest/skeleton-dashboard"

export default async function DashboardPage() {
    // Fetch data from Google Sheets
    const dashboardData = await getDashboardData()

    return (
        <Suspense fallback={<SkeletonDashboard />}>
            <DashboardShell data={dashboardData} />
        </Suspense>
    )
}