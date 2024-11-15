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
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timer, setTimer] = useState(60); // Initial timer set to 60 seconds
  const [error, setError] = useState('');
  const router = useRouter();
  const user_id = localStorage.getItem('user_id');

  // Function to verify OTP
  const verifyOTP = async (otp) => {
    const formData = {
      id: user_id,
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
      body: JSON.stringify({ id: user_id }),
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
  const handleOTPChange = (newOTP) => {
    if (newOTP.length === 6) {
      verifyOTP(newOTP);
    }
  };

  // Function to handle password reset after OTP verification
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const formData = {
      id: user_id,
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

  return (
    <div>
      <SiteHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        <div className="flex flex-col items-center space-y-6 p-10 bg-white rounded-xl shadow-2xl w-100 h-auto">
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
              <form onSubmit={handlePasswordReset} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-lg"
                  />
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-1 text-lg"
                  />
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="mt-4 px-6 py-3 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700"
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