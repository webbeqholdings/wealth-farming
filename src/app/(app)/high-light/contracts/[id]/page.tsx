import { Suspense, use } from 'react'
import { getContractById, getUserById } from '@/lib/high-light-hooks'
import ContractDetailShell from '@/components/high-light/contract-detail-shell'
import SkeletonDashboard from '@/components/high-light/skeleton-dashboard'
import { notFound } from 'next/navigation'

export default async function ContractDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Fetch contract data from Payload CMS
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
    userData = await getUserById(contractData.userId.toString())
  }

  return (
    <Suspense fallback={<SkeletonDashboard />}>
      <ContractDetailShell contract={contractData} user={userData} />
    </Suspense>
  )
}
