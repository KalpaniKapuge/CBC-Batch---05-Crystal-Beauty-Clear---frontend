
import './header.css'
import { Link } from "react-router-dom";

export default function Header() {
    console.log("Header component loaded");
    return (
        <div className="bg-pink-500 px-20">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/testing">Testing</Link>
            <a href="https://www.google.com">Google</a>
        </div>
    );
}
