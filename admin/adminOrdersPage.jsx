import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoading) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login first");
        return;
      }

      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/orders", {
          headers: {
            Authorization: "Bearer " + token,
          },
        })
        .then((res) => {
          setOrders(res.data);
          setIsLoading(false);
        })
        .catch((e) => {
          alert(
            "Error fetching orders: " +
              (e.response?.data?.message || "Unknown error")
          );
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  return (
    <div className="w-full h-full p-4 overflow-x-auto">
      {isLoading ? (
        <div className="text-center text-lg text-gray-600">Loading...</div>
      ) : (
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-2 border">Order Id</th>
              <th className="px-4 py-2 border">Name</th>
              <th className="px-4 py-2 border">Email</th>
              <th className="px-4 py-2 border">Address</th>
              <th className="px-4 py-2 border">Phone</th>
              <th className="px-4 py-2 border">Total</th>
              <th className="px-4 py-2 border">Date</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {orders.map((order, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-100"}
              >
                <td className="px-4 py-2 border">{order.orderId}</td>
                <td className="px-4 py-2 border">{order.name}</td>
                <td className="px-4 py-2 border">{order.email}</td>
                <td className="px-4 py-2 border">{order.address}</td>
                <td className="px-4 py-2 border">{order.phone}</td>
                <td className="px-4 py-2 border text-green-600 font-semibold">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(order.date).toLocaleDateString()}
                </td>
                <td
                  className={`px-4 py-2 border ${
                    order.status === "Completed"
                      ? "text-green-600 font-medium"
                      : order.status === "Pending"
                      ? "text-yellow-600 font-medium"
                      : "text-red-600 font-medium"
                  }`}
                >
                  {order.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
