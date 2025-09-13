import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Card = ({ children }) => (
  <div className="relative w-full max-w-md bg-white/60 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden ring-1 ring-pink-100 hover:shadow-3xl transition-all duration-300">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-pink-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
      <div className="absolute bottom-8 left-8 w-48 h-48 bg-pink-200 rounded-full blur-2xl opacity-30"></div>
    </div>
    <div className="relative p-10">{children}</div>
  </div>
);

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) {
      toast.error("All fields are required");
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      toast.success("Registration successful");
      navigate("/login");
    } catch (e) {
      console.error("Register error:", e.response || e);
      toast.error(e.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r from-white via-pink-200 to-white px-4 py-10">
      <Card>
        <h2 className="text-4xl font-extrabold mb-2 text-pink-500 text-center">
          Create Account
        </h2>
        <p className="text-center text-gray-600 mb-10 mt-4">
          Join us and get your beauty essentials.
        </p>

        <form onSubmit={handleRegister} className="space-y-5">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <label className="sr-only" htmlFor="firstName">
                First Name
              </label>
              <input
                id="firstName"
                type="text"
                placeholder="First Name"
                value={firstName}
                disabled={isSubmitting}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
                aria-label="First Name"
                required
              />
            </div>
            <div className="flex-1 relative">
              <label className="sr-only" htmlFor="lastName">
                Last Name
              </label>
              <input
                id="lastName"
                type="text"
                placeholder="Last Name"
                value={lastName}
                disabled={isSubmitting}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
                aria-label="Last Name"
                required
              />
            </div>
          </div>

          <div className="relative">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              disabled={isSubmitting}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
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
              disabled={isSubmitting}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 border border-pink-300 rounded-xl shadow-sm placeholder-pink-400 focus:outline-none focus:ring-3 focus:ring-pink-300 transition disabled:opacity-60"
              aria-label="Password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-xl flex cursor-pointer justify-center items-center gap-2 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg transform ${
              isSubmitting
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-gradient-to-r from-pink-400 to-pink-500 hover:scale-[1.03]"
            }`}
            aria-label="Submit registration"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-pink-600 font-semibold cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </Card>
    </div>
  );
}