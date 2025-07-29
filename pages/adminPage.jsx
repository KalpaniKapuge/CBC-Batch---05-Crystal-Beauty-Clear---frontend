import { Link } from "react-router-dom";

export default function AdminPage(){
    return(
        <div className="w-full h-screen flex">
            <div className="h-full w-[300px] flex flex-col">

                <Link to="/admin/products" className="p-4 bg-pink-500 text-white">Products</Link>
                <Link to="/admin/orders" className="p-4 bg-pink-500 text-white">Orders</Link>
                <Link to="/admin/users" className="p-4 bg-pink-500 text-white">Users</Link>
                <Link to="/admin/reviews" className="p-4 bg-pink-500 text-white">Reviews</Link>

            </div>
            
        <Routes path="/*">
            <Route path="/products" element={<h1>Products</h1>} />
            <Route path="/orders" element={<h1>Orders</h1>} />
            <Route path="/users" element={<h1>Users</h1>} />
            <Route path="/reviews" element={<h1>Reviews</h1>} />
            <Route path="/products" element={<h1>AdminProductPage</h1>} />
            <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
        </div>
    )
}