'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (user === null) {
      router.push('/auth')
    } else {
      setIsLoading(false)
    }
  }, [user, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (user === null) {
    return null
  }

  return <>{children}</>
}
