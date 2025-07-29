import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/products`)
      .then((res) => {
        console.log(res.data);
        setProducts(res.data);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
      });
  }, []);

  return (
    <div className="w-full h-full max-h-full overflow-y-scroll">
        <Link to="/admin/add-product" className="absolute text-xl cursor-pointer top-4 right-4 bg-pink-500 text-white p-2 rounded">
        +
        </Link>
      <table className="w-full text-center">
        <thead>
          <tr>
            <th>ProductId</th>
            <th>Name</th>
            <th>Image</th>
            <th>Labelled Price</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {products.map((item, index) => (
            <tr key={index}>
              <td>{item.productId}</td>
              <td>{item.name}</td>
              <td>
                <img
                  src={item.images?.[0]}
                  alt={item.name}
                  className="w-[50px] h-[50px] object-cover"
                />
              </td>
              <td>{item.labelledPrice}</td>
              <td>{item.price}</td>
              <td>{item.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


//https://ofviqmvabgpkantxleui.supabase.co
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mdmlxbXZhYmdwa2FudHhsZXVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MTE1NDgsImV4cCI6MjA2OTM4NzU0OH0.P-I_Mxr6k9JgmFHioJQ827swKfRi-aNQFSnxgvpUjW4
