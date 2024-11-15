'use client'
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { useToast } from "@/hooks/use-toast";

export default function Page() {
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification state
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Access localStorage only on the client side
    const storedUserId = localStorage.getItem('user_id');
    setUserId(storedUserId);
  }, []);

  // Function to verify OTP
  const verifyOTP = async (otp: string) => {
    const formData = {
      id: userId,
      otp: otp,
    };
    try {
      const response = await fetch("/api/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        setOtpVerified(true); // Set OTP as verified
        setError('');
      } else {
        setError(data.response.message || "Failed to verify OTP");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Failed to connect to the server");
    }
  };

  // Function to resend OTP
  const resendOTP = async () => {
    setTimer(60); // Reset timer to 60 seconds
    await fetch("/api/resend-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: userId }),
    });
  };

  // Start the countdown timer when it's above 0
  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  // Handle OTP change and trigger verification when max length is reached
  const handleOTPChange = (newOTP: string) => {
    if (newOTP.length === 6) {
      verifyOTP(newOTP);
    }
  };

  // Function to handle password reset after OTP verification
  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = {
      id: userId,
      password: newPassword,
    };

    try {
      const response = await fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reset Password Successfully!",
        });
        router.replace("/join");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Failed to connect to the server");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <div>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="flex flex-col items-center space-y-6 p-10 bg-white rounded-xl shadow-2xl w-100 h-auto w-[400px]">
          {!otpVerified ? (
            <>
              <h2 className="text-2xl font-semibold text-gray-800">OTP Verification</h2>

              <div className="flex space-x-3">
                <InputOTP onChange={handleOTPChange} maxLength={6}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <p className="text-sm text-gray-500">Please enter the 6-digit code sent to your email.</p>
              {error && <p className="text-red-500">{error}</p>}
              <button
                onClick={resendOTP}
                disabled={timer > 0}
                className={`mt-6 px-6 py-3 rounded-lg text-white font-medium ${timer > 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
              </button>
            </>
          ) : (
            <>
              <h3 className="text-lg font-medium text-gray-800">Reset Password</h3>
              <form onSubmit={handlePasswordReset} className="space-y-6">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <div className="relative mt-1">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="flex h-10 w-[360px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-blue-800 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.71 2.257-2.104 4.066-3.958 5.196M15.464 15.464A5.048 5.048 0 0112 17a5.048 5.048 0 01-3.464-1.464M8.536 8.536A5.048 5.048 0 0112 7c1.36 0 2.605.538 3.464 1.464" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-blue-800 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .882-2.804 3.01-5.013 5.602-6.146M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.709-1.291a9.992 9.992 0 00-.869-1.119m.869 1.119l3.291 3.291M21 21l-3.291-3.291" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <div className="relative mt-1">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="flex h-10 w-[360px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                    >
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-blue-800 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.71 2.257-2.104 4.066-3.958 5.196M15.464 15.464A5.048 5.048 0 0112 17a5.048 5.048 0 01-3.464-1.464M8.536 8.536A5.048 5.048 0 0112 7c1.36 0 2.605.538 3.464 1.464" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 hover:text-blue-800 transition-all" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7 .882-2.804 3.01-5.013 5.602-6.146M15 12a3 3 0 11-6 0 3 3 0 016 0zm3.709-1.291a9.992 9.992 0 00-.869-1.119m.869 1.119l3.291 3.291M21 21l-3.291-3.291" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="mt-4 px-4 py-2 rounded-lg text-sm text-white font-medium bg-blue-600 hover:bg-blue-700"
                >
                  Reset Password
                </button>
              </form>
            </>
          )}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}