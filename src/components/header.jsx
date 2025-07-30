import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  console.log("Header rendered");
  return(
    <header className="w-full h-[80px] shadow-2xl">
      <img onClick={() => {
        navigate("/");
      }} src="/logo.png" alt="Logo" className="w-[80px] h-[80px] object-cover cursor-pointer"/>
      <div className="h-full w-[Calc(100% - 160px)] flex items-center justify-between px-4">
        <Link to="/" className="text-[20px] font-bold mx-2">Home</Link>
        <Link to="/products" className="text-[20px] font-bold mx-2">Products</Link>
        <Link to="/about" className="text-[20px] font-bold mx-2">About</Link>
        <Link to="/contact" className="text-[20px] font-bold mx-2">Contact</Link>

      </div>
      <div className="w-[80px] bg-pink-600 flex justify-center items-center">
        <Link to="/cart" className="text-[20px] font-bold mex-2">
        <BsCarts/></Link>

      </div>

    </header>
  )
}
