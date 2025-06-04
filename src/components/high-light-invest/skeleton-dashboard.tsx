import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function SkeletonCardOverview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {Array(4)
                .fill(0)
                .map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <Skeleton className="h-5 w-[120px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-[100px] mb-2" />
                            <Skeleton className="h-4 w-[180px]" />
                        </CardContent>
                    </Card>
                ))}
        </div>
    )
}

export function SkeletonTable() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex items-center justify-between py-2 border-b">
                        {Array(5)
                            .fill(0)
                            .map((_, i) => (
                                <Skeleton key={i} className="h-4 w-[100px]" />
                            ))}
                    </div>
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <div key={i} className="flex items-center justify-between py-2">
                                {Array(5)
                                    .fill(0)
                                    .map((_, j) => (
                                        <Skeleton key={j} className="h-4 w-[100px]" />
                                    ))}
                            </div>
                        ))}
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
                <Skeleton className="h-4 w-[120px]" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-20" />
                </div>
            </CardFooter>
        </Card>
    )
}

export function SkeletonChart() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-[180px] mb-2" />
                <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
                <div className="h-[400px] bg-muted/20 rounded-md flex items-center justify-center">
                    <Skeleton className="h-[350px] w-[90%] rounded-md" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function SkeletonDashboard() {
    return (
        <div className="flex min-h-screen flex-col bg-background">
            <main className="flex-1 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                    <Skeleton className="h-10 w-[150px]" />
                    <Skeleton className="h-9 w-[100px]" />
                </div>

                <SkeletonCardOverview />

                <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex space-x-2">
                            {Array(4)
                                .fill(0)
                                .map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-[80px] rounded-md" />
                                ))}
                        </div>
                        <Skeleton className="h-9 w-[200px] rounded-md" />
                    </div>
                    <SkeletonTable />
                </div>
            </main>
        </div>
    )
}
