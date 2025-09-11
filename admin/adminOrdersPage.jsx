import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Modal from "react-modal";
import toast from "react-hot-toast";

Modal.setAppElement("#root");

function Loading() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-4 shadow-sm animate-pulse border border-gray-200"
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-pink-100 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-pink-100 rounded w-1/3"></div>
              <div className="h-3 bg-pink-100 rounded w-2/3"></div>
            </div>
            <div className="h-3 bg-pink-100 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => {
    try {
      const savedOrders = localStorage.getItem("orders");
      const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];
      console.log("Initial orders from localStorage:", parsedOrders); // Debug
      return parsedOrders;
    } catch (e) {
      console.error("Error parsing orders from localStorage:", e);
      return [];
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrderIndex, setActiveOrderIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const fetchOrders = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("API Response:", res.data); // Debug
      if (res.data && Array.isArray(res.data)) {
        const normalizedOrders = res.data.map(order => ({
          ...order,
          status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase() : "Unknown"
        }));
        setOrders(normalizedOrders);
      } else {
        console.error("Invalid API response: Expected an array");
        setOrders([]);
      }
    } catch (e) {
      toast.error(
        "Error fetching orders: " +
          (e.response?.data?.message || "Unknown error")
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("orders"); // Clear stale data
    fetchOrders();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("orders", JSON.stringify(orders));
    } catch (e) {
      console.error("Error saving orders to localStorage:", e);
    }
  }, [orders]);

  const activeOrder = useMemo(() => {
    if (
      activeOrderIndex === null ||
      activeOrderIndex < 0 ||
      activeOrderIndex >= orders.length
    )
      return null;
    return orders[activeOrderIndex];
  }, [activeOrderIndex, orders]);

  const formatMoney = (amount) => {
    if (typeof amount !== "number") return "-";
    return `Rs. ${amount.toLocaleString()}`;
  };

  const handleStatusChange = async (newStatus) => {
    if (!activeOrder) return;
    if (statusUpdating) return;
    setStatusUpdating(true);
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${activeOrder.orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("Status update response:", response.data); // Debug
      setOrders((prev) => {
        const clone = [...prev];
        clone[activeOrderIndex] = {
          ...clone[activeOrderIndex],
          status: newStatus,
        };
        return clone;
      });
      toast.success("Order status updated");
    } catch (e) {
      toast.error(
        "Error updating order status: " +
          (e.response?.data?.message || "Unknown error")
      );
      console.error(e);
    } finally {
      setStatusUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500 to-pink-600 px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-1">
                  Order Management
                </h1>
                <p className="text-pink-100 text-sm">
                  Manage your store's orders
                </p>
              </div>
            </div>
          </div>

          {/* Order Stats Cards */}
<div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-200 hover:shadow-xl hover:border-pink-300 transition duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-black text-sm font-semibold uppercase tracking-wide">Total Orders</p>
        <p className="text-2xl font-bold text-pink-600">{orders.length}</p>
      </div>
      <div className="text-pink-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
      </div>
    </div>
  </div>
  <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-200 hover:shadow-xl hover:border-pink-300 transition duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-black text-sm font-semibold uppercase tracking-wide">Pending Orders</p>
        <p className="text-2xl font-bold text-pink-600">{orders.filter((o) => o.status?.toLowerCase() === "pending").length}</p>
      </div>
      <div className="text-pink-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l1.5 1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  </div>
  <div className="bg-white rounded-lg p-6 shadow-lg border border-pink-200 hover:shadow-xl hover:border-pink-300 transition duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-black text-sm font-semibold uppercase tracking-wide">Completed Orders</p>
        <p className="text-2xl font-bold text-pink-600">{orders.filter((o) => o.status?.toLowerCase() === "completed").length}</p>
      </div>
      <div className="text-pink-500">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      </div>
    </div>
  </div>
</div>

          {/* Rest of the component remains unchanged */}
          <div className="p-6">
            {isLoading && orders.length === 0 ? (
              <Loading />
            ) : orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-pink-500 text-2xl">📦</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  There are no orders to display at the moment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl shadow-lg border border-gray-200">
                <table className="w-full text-sm text-left border-separate border-spacing-0">
                  <thead className="bg-pink-400 text-white sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 font-semibold text-sm rounded-tl-xl">
                        Order ID
                      </th>
                      <th className="px-6 py-3 font-semibold text-sm">
                        Customer
                      </th>
                      <th className="px-6 py-3 font-semibold text-sm">Email</th>
                      <th className="px-6 py-3 font-semibold text-sm">Total</th>
                      <th className="px-6 py-3 font-semibold text-sm">Date</th>
                      <th className="px-6 py-3 font-semibold text-sm">Status</th>
                      <th className="px-6 py-3 font-semibold text-sm text-center rounded-tr-xl">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={order._id || idx}
                        className={`${
                          idx % 2 === 0 ? "bg-white" : "bg-pink-100"
                        } hover:bg-pink-200 transition duration-200 border-b border-gray-200 last:border-b-0 shadow-sm hover:shadow-md`}
                      >
                        <td className="px-6 py-4 text-gray-800 font-medium text-sm">
                          #{order.orderId || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-medium text-sm">
                          {order.name || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-sm">
                          {order.email || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-900 font-semibold text-sm">
                          {order.total != null ? formatMoney(order.total) : "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-900 text-sm">
                          {order.date
                            ? new Date(order.date).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                              order.status?.toLowerCase() === "completed"
                                ? "bg-green-100 text-green-700"
                                : order.status?.toLowerCase() === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {order.status || "-"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setActiveOrderIndex(idx);
                              setIsModalOpen(true);
                            }}
                            className="px-3 py-1 bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
                            title="View Order"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Order Details"
            overlayClassName="fixed inset-0 bg-black/60 flex items-start justify-center z-50"
            className="max-w-4xl w-full mt-12 bg-white rounded-3xl shadow-2xl p-8 outline-none relative max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-pink-200 p-2 rounded-full bg-pink-500 hover:bg-pink-600 transition duration-200 shadow-sm"
              title="Close"
            >
              ✕
            </button>
            {activeOrder ? (
              <div className="space-y-8">
                <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-pink-500 to-pink-600  bg-clip-text">
                  Order Details - #{activeOrder.orderId || "-"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border border-pink-200 shadow-lg hover:shadow-xl transition duration-200">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      Shipping Address
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.name || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.address || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.city || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.country || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.postalCode || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span> {activeOrder.phone || "-"}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border border-pink-200 shadow-lg hover:shadow-xl transition duration-200">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      Customer Info
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span>
                        <strong>Name:</strong> {activeOrder.name || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span>
                        <strong>Email:</strong> {activeOrder.email || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span>
                        <strong>Phone:</strong> {activeOrder.phone || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {activeOrder.items && activeOrder.items.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Items</h3>
                    <div className="overflow-x-auto rounded-xl shadow-lg border border-pink-200">
                      <table className="w-full text-sm text-left border-separate border-spacing-0">
                        <thead className="bg-gradient-to-r from-pink-400 to-pink-500 text-white">
                          <tr>
                            <th className="px-4 py-3 text-left border-b border-pink-200 rounded-tl-xl">
                              Product
                            </th>
                            <th className="px-4 py-3 text-center border-b border-pink-200">
                              Qty
                            </th>
                            <th className="px-4 py-3 text-right border-b border-pink-200">
                              Price
                            </th>
                            <th className="px-4 py-3 text-right border-b border-pink-200 rounded-tr-xl">
                              Subtotal
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeOrder.items.map((it, i) => {
                            const qty = it.quantity || 0;
                            const price = it.price || 0;
                            return (
                              <tr
                                key={i}
                                className={`${
                                  i % 2 === 0 ? "bg-white" : "bg-pink-50"
                                } hover:bg-pink-100 transition duration-200 border-b border-pink-200 last:border-b-0`}
                              >
                                <td className="px-4 py-3 text-gray-900 text-sm">
                                  {it.productName || it.name || "-"}
                                </td>
                                <td className="px-4 py-3 text-gray-900 text-sm text-center">
                                  {qty}
                                </td>
                                <td className="px-4 py-3 text-gray-900 text-sm text-right">
                                  {formatMoney(price)}
                                </td>
                                <td className="px-4 py-3 text-gray-900 font-semibold text-sm text-right">
                                  {formatMoney(qty * price)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-600 text-sm bg-pink-50 p-4 rounded-xl border border-pink-200">
                    No items data available for this order.
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border border-pink-200 shadow-lg hover:shadow-xl transition duration-200">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Payment</h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span>
                        <strong>Method:</strong> {activeOrder.paymentMethod || "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-pink-500">•</span>
                        <strong>Paid:</strong>{" "}
                        {activeOrder.isPaid ? (
                          <span className="text-green-600 font-medium">Yes</span>
                        ) : (
                          <span className="text-red-600 font-medium">No</span>
                        )}
                      </div>
                      {activeOrder.paidAt && (
                        <div className="flex items-center gap-2">
                          <span className="text-pink-500">•</span>
                          <strong>Paid At:</strong>{" "}
                          {new Date(activeOrder.paidAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border border-pink-200 shadow-lg hover:shadow-xl transition duration-200">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">
                      Order Summary
                    </h3>
                    <div className="text-sm text-gray-700 space-y-2">
                      <div className="flex justify-between">
                        <div>Items:</div>
                        <div>
                          {formatMoney(
                            activeOrder.items
                              ? activeOrder.items.reduce(
                                  (s, it) =>
                                    s +
                                    (it.price || 0) * (it.quantity || 0),
                                  0
                                )
                              : 0
                          )}
                        </div>
                      </div>
                      {activeOrder.shippingPrice != null && (
                        <div className="flex justify-between">
                          <div>Shipping:</div>
                          <div>{formatMoney(activeOrder.shippingPrice)}</div>
                        </div>
                      )}
                      {activeOrder.taxPrice != null && (
                        <div className="flex justify-between">
                          <div>Tax:</div>
                          <div>{formatMoney(activeOrder.taxPrice)}</div>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t border-pink-200 pt-3 text-gray-900">
                        <div>Total:</div>
                        <div>{formatMoney(activeOrder.total || 0)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-white to-pink-50 p-6 rounded-xl border border-pink-200 shadow-lg hover:shadow-xl transition duration-200">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Status</h3>
                  <div className="flex flex-wrap gap-6 text-sm text-gray-700 mb-4">
                    <div>
                      <strong>Order:</strong>{" "}
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          activeOrder.status?.toLowerCase() === "completed"
                            ? "bg-green-100 text-green-700"
                            : activeOrder.status?.toLowerCase() === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {activeOrder.status || "-"}
                      </span>
                    </div>
                    {activeOrder.isDelivered != null && (
                      <div>
                        <strong>Delivered:</strong>{" "}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            activeOrder.isDelivered
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {activeOrder.isDelivered ? "Yes" : "No"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    {["Pending", "Completed"].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={statusUpdating || activeOrder.status === status}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition duration-200 shadow-sm hover:shadow-md ${
                          statusUpdating || activeOrder.status === status
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
                        }`}
                      >
                        Set to {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-600 text-sm bg-pink-50 p-4 rounded-xl border border-pink-200">
                No selection.
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
}