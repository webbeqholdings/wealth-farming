'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { useToast } from '@/hooks/use-toast'

export default function Page() {
  const [userId, setUserId] = useState<string | null>(null)
  const [timer, setTimer] = useState(60) // Initial timer set to 60 seconds
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Access localStorage only on the client side
    const storedUserId = localStorage.getItem('user_id')
    setUserId(storedUserId)
  }, [])

  // Function to verify OTP
  const verifyOTP = async (otp: string) => {
    const formData = {
      id: userId, // Replace with the actual ID value if needed
      otp: otp,
    }
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Register successfully!',
        })
        router.replace('/join') // Redirect on successful verification
      } else {
        toast({
          title: 'Error',
          description: data.response.message || 'Failed to verify OTP',
        })
      }
    } catch (error) {
      console.error('Network error:', error)
      toast({
        title: 'Error',
        description: 'Failed to connect to the server!',
      })
    }
  }

  // Function to resend OTP
  const resendOTP = async () => {
    setTimer(60) // Reset timer to 60 seconds
    await fetch('/api/otp/resend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: userId }),
    })
  }

  // Start the countdown timer when it's above 0
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000)
      return () => clearTimeout(countdown)
    }
  }, [timer])

  // Handle OTP change and trigger verification when max length is reached
  const handleOTPChange = (newOTP: string) => {
    if (newOTP.length === 6) {
      verifyOTP(newOTP)
    }
  }

  return (
    <div>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center ">
        <div className="flex flex-col items-center space-y-6 p-10  rounded-xl shadow-2xl w-100 h-auto">
          <h2 className="text-2xl font-semibold ">OTP Verification</h2>
          <div className="flex">
            <InputOTP onChange={handleOTPChange} maxLength={6}>
              <InputOTPGroup className="space-x-1">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          <p className="text-sm ">Please enter the 6-digit code sent to your email.</p>
          <button
            onClick={resendOTP}
            disabled={timer > 0}
            className={`mt-6 px-6 py-3 rounded-lg text-white font-medium ${
              timer > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
          </button>
        </div>
      </div>
      <SiteFooter />
    </div>
  )
}
