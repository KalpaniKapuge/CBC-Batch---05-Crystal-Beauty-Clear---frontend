import { Link } from "react-router-dom";

export default function Header() {
  console.log("Header component loaded");
  return (
    <div className="bg-pink-500 px-6 py-4 flex justify-between items-center shadow-md">
      <div className="text-white text-xl font-bold">My Website</div>

      <nav className="flex gap-6 text-white text-base font-medium">
        <Link to="/" className="hover:text-gray-200 transition">Home</Link>
        <Link to="/login" className="hover:text-gray-200 transition">Login</Link>
        <Link to="/register" className="hover:text-gray-200 transition">Register</Link>
        <Link to="/testing" className="hover:text-gray-200 transition">Testing</Link>
        <a
          href="https://www.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-200 transition"
        >
          Google
        </a>
      </nav>
    </div>
  );
}
