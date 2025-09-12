import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sendOTP = async () => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`,
        { email: email.trim() },
        { headers: { "Content-Type": "application/json" } }
      );
      setOtpSent(true);
      toast.success("OTP sent to your email. Check your inbox.");
      console.log("sendOTP response:", res.data);
    } catch (error) {
      console.error("sendOTP error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
      const errorMessage =
        error.response?.data?.message || "Failed to send OTP. Please try again.";
      const errorDetails = error.response?.data?.error || "";
      const errorName = error.response?.data?.errorName || "";
      const errorCode = error.response?.data?.errorCode || "";
      toast.error(`${errorMessage}${errorDetails ? `: ${errorDetails}` : ""}`);
      if (error.response?.status === 404) {
        toast.error("User not found. Please check your email or register.");
      } else if (error.response?.status === 500) {
        toast.error(`Server error: ${errorMessage}${errorName ? ` (${errorName}${errorCode ? `, Code: ${errorCode}` : ""})` : ""}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || !newPassword || !confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      setIsSubmitting(true);
      const otpInNumberFormat = parseInt(otp, 10);
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/reset-password`,
        {
          email,
          otp: otpInNumberFormat,
          newPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success(res.data.message || "Password reset successful");
      console.log("verifyOtp response:", res.data);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setOtpSent(false);
      navigate("/login");
    } catch (error) {
      console.error("verifyOtp error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error(
        error.response?.data?.message || "Invalid OTP or failed to reset"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = () => {
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    sendOTP();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">
          Forgot Password
        </h2>

        <div className="space-y-4">
          {!otpSent ? (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <button
                onClick={sendOTP}
                disabled={isSubmitting || !email.trim()}
                className={`w-full flex justify-center items-center gap-2 ${
                  isSubmitting || !email.trim()
                    ? "bg-pink-300 cursor-not-allowed"
                    : "bg-pink-500 hover:bg-pink-600"
                } text-white py-3 rounded-lg font-medium transition`}
              >
                {isSubmitting ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          ) : (
            <>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  OTP
                </label>
                <input
                  type="text"
                  placeholder="Enter your OTP"
                  value={otp}
                  disabled={isSubmitting}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  disabled={isSubmitting}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  disabled={isSubmitting}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={verifyOtp}
                  disabled={
                    isSubmitting ||
                    !otp ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                  }
                  className={`flex-1 flex justify-center items-center gap-2 ${
                    isSubmitting ||
                    !otp ||
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword
                      ? "bg-pink-300 cursor-not-allowed"
                      : "bg-pink-600 hover:bg-pink-700"
                  } text-white py-3 rounded-lg font-medium transition`}
                >
                  {isSubmitting ? "Verifying..." : "Verify OTP"}
                </button>
                <button
                  onClick={handleResend}
                  disabled={isSubmitting}
                  className="flex-1 flex justify-center items-center gap-2 border border-pink-500 text-pink-600 py-3 rounded-lg hover:bg-pink-50 transition font-medium"
                >
                  Resend OTP
                </button>
              </div>
            </>
          )}
          <div className="text-center text-sm text-gray-500 mt-4">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-pink-600 font-semibold cursor-pointer hover:underline"
            >
              Back to Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}