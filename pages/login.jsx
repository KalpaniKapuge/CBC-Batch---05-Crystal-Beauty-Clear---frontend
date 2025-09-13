import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

const Card = ({ children }) => (
  <div className="relative w-full max-w-md bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden ring-1 ring-pink-100 hover:shadow-3xl transition-all duration-300">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-48 h-48 bg-pink-200 rounded-full blur-2xl opacity-30"></div>
    </div>
    <div className="relative p-10">{children}</div>
  </div>
);

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
      console.log("Payload being sent:", {
        email: cleanedEmail,
        password: cleanedPassword,
      });

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        { email: cleanedEmail, password: cleanedPassword },
        { headers: { "Content-Type": "application/json" } }
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
    <GoogleOAuthProvider clientId={clientId || ""}>
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-pink-200 to-white px-4">
        <Card className="mt-10 mb-20">
          <h2 className="text-4xl font-extrabold mb-2 text-pink-500 text-center">
            Welcome Back
          </h2>
          <p className="text-center text-gray-600 mb-10 mt-4">
            Log in to access your beauty essentials.
          </p>
          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="relative">
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
                disabled={isSubmitting}
                aria-label="Email"
                required
              />
            </div>
            <div className="relative">
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
                disabled={isSubmitting}
                aria-label="Password"
                required
              />
            </div>
            <div className="text-right">
              <span
                onClick={() => navigate("/forgot-password")}
                className="text-pink-600 font-semibold cursor-pointer hover:underline text-sm"
              >
                Forgot Password?
              </span>
            </div>
            <button
              type="submit"
              className={`w-full text-xl flex cursor-pointer justify-center items-center gap-2 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg transform ${
                isSubmitting
                  ? "bg-pink-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-pink-400 to-pink-500 hover:scale-[1.03]"
              }`}
              disabled={isSubmitting}
              aria-label="Submit login"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </form>
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-pink-300"></div>
            <div className="mx-3 text-sm text-pink-500 font-medium">OR</div>
            <div className="flex-1 h-px bg-pink-300"></div>
          </div>
          <button
            onClick={() => googleLogin()}
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-pink-300 py-3 rounded-xl hover:bg-pink-200 cursor-pointer transition shadow-inner font-medium relative overflow-hidden"
            aria-label="Login with Google"
          >
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full">
                <GrGoogle className="text-xl text-pink-600" />
              </div>
              <span className="text-pink-600">Login with Google</span>
            </div>
          </button>
          <div className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-pink-600 font-semibold cursor-pointer hover:underline"
            >
              Register
            </span>
          </div>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}