"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import PasswordOverlay, { LogoutButton } from "@/components/high-light-invest/password-overlay"
import type { User } from "@/lib/high-light-invest-hooks"
import UserDetailHeader from "@/components/high-light-invest/user-detail-header"
import UserFinancialOverview from "@/components/high-light-invest/user-financial-overview"
import UserContractsList from "@/components/high-light-invest/user-contracts-list"
import UserEquityChart from "@/components/high-light-invest/user-equity-chart"
import UserTransactionsTable from "@/components/high-light-invest/user-transactions-table"

interface UserDetailShellProps {
    user: User
    allUsers: User[]
}

export default function UserDetailShell({ user, allUsers }: UserDetailShellProps) {
    return (
        <PasswordOverlay>
            <div className="flex min-h-screen flex-col bg-background">
                <main className="flex-1 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Button variant="outline" size="sm" asChild className="mr-4">
                                <Link href="/high-light-invest">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to High Light Invest
                                </Link>
                            </Button>
                            <h1 className="text-3xl font-bold tracking-tight">Investor Details</h1>
                        </div>
                        <LogoutButton />
                    </div>

                    {/* User Information */}
                    <UserDetailHeader user={user} />
                    <UserFinancialOverview userId={user.id} />
                    <UserContractsList userId={user.id} />
                    <UserEquityChart userId={user.id} />
                    <UserTransactionsTable userId={user.id} />
                </main>
            </div>
        </PasswordOverlay>
    )
}
