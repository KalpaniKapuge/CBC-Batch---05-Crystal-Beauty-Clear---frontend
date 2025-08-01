import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const cleanedEmail = email.trim();
    const cleanedPassword = password.trim();

    if (!cleanedEmail || !cleanedPassword) {
      toast.error("Email and password are required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Debug payload
      console.log("📦 Payload being sent:", {
        email: cleanedEmail,
        password: cleanedPassword,
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email: cleanedEmail,
          password: cleanedPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Login successful");
      localStorage.setItem("token", response.data.token);
      navigate(response.data.role === "admin" ? "/admin/products" : "/");
    } catch (err) {
      console.error("Login error response:", err.response || err);
      const msg = err?.response?.data?.message || "Invalid email or password";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/users/login/google`,
          { accessToken }
        );
        localStorage.setItem("token", res.data.token);
        toast.success("Google login successful");
        navigate(res.data.role === "admin" ? "/admin/products" : "/");
      } catch (err) {
        toast.error("Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="w-full h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm">
          <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">Login</h2>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-pink-300 rounded-lg"
              disabled={isSubmitting}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-pink-300 rounded-lg"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-medium ${
                isSubmitting ? "bg-pink-300 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="relative flex items-center my-4">
            <div className="flex-grow h-px bg-pink-200" />
            <span className="mx-3 text-sm text-pink-500 font-medium">OR</span>
            <div className="flex-grow h-px bg-pink-200" />
          </div>

          <button
            onClick={() => googleLogin()}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-pink-400 text-pink-700 py-2 rounded-lg hover:bg-pink-50"
          >
            <GrGoogle className="text-xl" />
            <span className="font-semibold">Login with Google</span>
          </button>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
