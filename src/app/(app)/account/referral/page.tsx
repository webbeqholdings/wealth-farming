'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Users, Link, DollarSign, Award } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getReferralsByParentId } from '@/lib/referrals'
import userStatus from '@/lib/userStatus'
import { useRouter } from 'next/navigation'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface Referral {
  id: string
  name: string
  email: string
  date: string
  status: 'Pending' | 'Completed'
}

export default function ReferralPage() {
  const router = useRouter()
  const { isLoggedIn, loading, user } = userStatus();
  const [referralLink, setReferralLink] = useState('')
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalEarnings: 0,
  })
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Simulating API call to fetch referral data
    const fetchReferralData = async () => {
      const { docs, totalPages, referral_code } = await getReferralsByParentId(currentPage, 10);

      setReferrals(docs); // Store the accounts in state
      setTotalPages(totalPages);
      setReferralLink(`https://wealthfarming.org/ref/${referral_code}`);

      setStats({
        totalReferrals: 3,
        pendingReferrals: 1,
        completedReferrals: 2,
        totalEarnings: 100,
      })
    }

    fetchReferralData()
  }, [loading, currentPage])

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    alert('Referral link copied to clipboard!')
  }

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join');
    return <div>Redirecting...</div>; // Optional: Show a redirect message
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-8">Your Referrals</h1>

        {/* Banner */}
        <Card className="mb-8">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Share your referral link</h2>
              <p className="text-muted-foreground">Invite friends and earn rewards!</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input value={referralLink} readOnly className="w-64" />
              <Button onClick={copyReferralLink}>
                <Link className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Referrals</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingReferrals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Referrals</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedReferrals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalEarnings}</div>
            </CardContent>
          </Card>
        </div>

        {/* Referrals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Your Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals && referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.name}</TableCell>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>{referral.date}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${referral.status === 'Completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {referral.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {referrals.length > 0 ? <div className="flex justify-end mt-4">
              <Pagination className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  Previous
                </PaginationPrevious>
                <PaginationContent>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => setCurrentPage(index + 1)}
                        isActive={currentPage === index + 1}
                        className={`text-sm font-medium rounded-lg ${currentPage === index + 1
                          ? 'border-gray-400'
                          : ''
                          }`}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                </PaginationContent>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  Next
                </PaginationNext>
              </Pagination>
            </div> : <></>}
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
