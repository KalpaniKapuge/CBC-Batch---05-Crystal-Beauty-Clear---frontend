import { Link, useLocation } from "react-router-dom";

export default function AdminPage(){
    const location = useLocation();
    const path = location.pathname;

    function getClass(name){
        if(path.includes(name)){
            return "bg-accent text-white p-4"
        }else{
            return "text-accent p-4"
        }
    }
    return(
        <div className="w-full h-screen flex bg-accent">
            <div className="h-full w-[300px] flex flex-col text-accent font-bold text-xl bg-white">

                <Link to="/admin/products" className={getClass("products")}>Products</Link>
                <Link to="/admin/orders" className={getClass("orders")}>Orders</Link>
                <Link to="/admin/users" className={getClass("users")}>Users</Link>
                <Link to="/admin/reviews" className={getClass("review")}>Reviews</Link>

            </div>
            
        <Routes path="/*">
            <Route path="/products" element={<h1>Products</h1>} />
            <Route path="/orders" element={<h1>Orders</h1>} />
            <Route path="/users" element={<h1>Users</h1>} />
            <Route path="/reviews" element={<h1>Reviews</h1>} />
            <Route path="/products" element={<h1>AdminProductPage</h1>} />
            <Route path="/edit-product" element={<h1>EditProductPage</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        </div>
    )
}