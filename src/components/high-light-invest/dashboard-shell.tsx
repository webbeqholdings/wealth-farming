"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import CardOverview from "@/components/high-light-invest/card-overview"
import TableUsers from "@/components/high-light-invest/table-users"
import TableContracts from "@/components/high-light-invest/table-contracts"
import TableTransactions from "@/components/high-light-invest/table-transactions"
import PasswordOverlay, { LogoutButton } from "@/components/high-light-invest/password-overlay"
import type { DashboardData } from "@/lib/high-light-invest-hooks"

interface DashboardShellProps {
    data: DashboardData
}

export default function DashboardShell({ data }: DashboardShellProps) {
    const [activeTab, setActiveTab] = useState("users")

    return (
        <PasswordOverlay>
            <div className="flex min-h-screen flex-col bg-background">
                <main className="flex-1 p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold tracking-tight">High Light Invest</h1>
                        <div className="flex items-center gap-2">
                            <LogoutButton />
                        </div>
                    </div>

                    {/* Metrics Cards */}
                    <CardOverview metrics={data.overviewMetrics} />

                    {/* Data Tables */}
                    <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
                        <div className="flex items-center justify-between mb-4">
                            <TabsList>
                                <TabsTrigger value="users">Investors</TabsTrigger>
                                <TabsTrigger value="contracts">Contracts</TabsTrigger>
                                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                            </TabsList>
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input type="search" placeholder={`Search ${activeTab}...`} className="w-full pl-8" />
                            </div>
                        </div>

                        <TabsContent value="users" className="space-y-4">
                            <TableUsers users={data.users} />
                        </TabsContent>

                        <TabsContent value="contracts" className="space-y-4">
                            <TableContracts contracts={data.contracts} />
                        </TabsContent>

                        <TabsContent value="transactions" className="space-y-4">
                            <TableTransactions transactions={data.transactions} />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </PasswordOverlay>
    )
}
