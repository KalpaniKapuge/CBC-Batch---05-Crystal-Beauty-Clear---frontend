import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleRegister() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success("Registration successful");
      console.log(response.data);
      navigate("/login");
    } catch (e) {
      toast.error(e.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-pink-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-pink-600 text-center">Register</h2>
        
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-pink-300 rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-pink-400"
        />
        
        <button
          onClick={handleRegister}
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition-colors"
        >
          Register
        </button>
      </div>
    </div>
  );
}
