import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { GrGoogle } from "react-icons/gr";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleLogin() {
    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        {
          email,
          password,
        }
      );
      toast.success("Login successful");
      localStorage.setItem("token", response.data.token);

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleLogin = () => {
    // placeholder: integrate OAuth redirect
    toast("Google login clicked");
  };

  const gooleLogin = useGoogleLogin({
    onSuccess:(response) => {
      const accessToken = response.access_token
      axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/login/google",
        {
          accessToken:accessToken
        }
      ).then((response) => {
        toast.success("Login Successfull")
        const token = response.data.token
        localStorage.setItem("token",token)
        if(response.data.role==="admin"){
          navigate("/admin/")
        }else{
          navigate("/")
        }
      })
    }
  })

  return (
    <div className="w-full h-screen flex items-center justify-center bg-pink-50">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm">
        <h2 className="text-3xl font-bold mb-6 text-pink-600 text-center">
          Login
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            disabled={isSubmitting}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            aria-label="Email"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            disabled={isSubmitting}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-pink-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            aria-label="Password"
          />

          <button
            onClick={handleLogin}
            disabled={isSubmitting}
            className={`w-full flex justify-center items-center gap-2 ${
              isSubmitting
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-pink-500 hover:bg-pink-600"
            } text-white py-3 rounded-lg font-medium transition-colors`}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <div className="relative flex items-center my-4">
            <div className="flex-grow h-px bg-pink-200" />
            <span className="mx-3 text-sm text-pink-500 font-medium">
              OR
            </span>
            <div className="flex-grow h-px bg-pink-200" />
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-pink-400 text-pink-700 py-2 rounded-lg hover:bg-pink-50 transition"
          >
            <GrGoogle className="text-xl" />
            <span className="font-semibold">Login with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
}
//nkmb czcn xyys zpzb