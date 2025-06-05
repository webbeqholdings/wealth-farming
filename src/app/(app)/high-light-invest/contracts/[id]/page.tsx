import { Suspense } from "react"
import { getContractById, getUserByEmail } from "@/lib/high-light-invest-hooks"
import ContractDetailShell from "@/components/high-light-invest/contract-detail-shell"
import SkeletonDashboard from "@/components/high-light-invest/skeleton-dashboard"
import { notFound } from "next/navigation"

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // Fetch contract data from Google Sheets
    const { id } = await params
    const contractId = id
    const contractData = await getContractById(contractId)

    // If contract not found, show 404
    if (!contractData) {
        notFound()
    }

    // Fetch associated user data if available
    let userData = null
    if (contractData.userId) {
        userData = await getUserByEmail(contractData.userId)
    }

    return (
        <Suspense fallback={<SkeletonDashboard />}>
            <ContractDetailShell contract={contractData} user={userData} />
        </Suspense>
    )
}
