import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Modal from "react-modal";

// Accessibility: attach to root
Modal.setAppElement("#root");

function Loading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-pulse space-y-3 text-center">
        <div className="h-6 bg-gray-300 rounded w-60 mx-auto" />
        <div className="h-4 bg-gray-300 rounded w-96 mx-auto" />
        <div className="h-4 bg-gray-300 rounded w-72 mx-auto" />
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeOrderIndex, setActiveOrderIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch orders once
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      setIsLoading(false);
      return;
    }

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/api/orders`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      })
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((e) => {
        alert(
          "Error fetching orders: " +
            (e.response?.data?.message || "Unknown error")
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeOrder = useMemo(() => {
    if (
      activeOrderIndex === null ||
      activeOrderIndex < 0 ||
      activeOrderIndex >= orders.length
    )
      return null;
    return orders[activeOrderIndex];
  }, [activeOrderIndex, orders]);

  // Helper to format money (assuming cents or integer)
  const formatMoney = (amount) => {
    if (typeof amount !== "number") return "-";
    return `Rs. ${amount.toLocaleString()}`;
  };

  // Determine if the object is product-like based on sample shape
  const isProductObject = (obj) =>
    obj &&
    (obj.productId || obj._id) &&
    ("price" in obj || "labelledPrice" in obj);

  return (
    <div className="w-full h-full p-6 overflow-x-auto font-sans">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      {isLoading ? (
        <Loading />
      ) : orders.length === 0 ? (
        <div className="text-center text-gray-600 py-10">
          No orders available.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse shadow rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left border">Order ID</th>
                <th className="px-4 py-3 text-left border">Customer</th>
                <th className="px-4 py-3 text-left border">Email</th>
                <th className="px-4 py-3 text-left border">Total</th>
                <th className="px-4 py-3 text-left border">Date</th>
                <th className="px-4 py-3 text-left border">Status</th>
                <th className="px-4 py-3 text-center border">Details</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {orders.map((order, idx) => (
                <tr
                  key={order._id || idx}
                  className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-4 py-2 border">{order.orderId || "-"}</td>
                  <td className="px-4 py-2 border">{order.name || "-"}</td>
                  <td className="px-4 py-2 border">{order.email || "-"}</td>
                  <td className="px-4 py-2 border font-medium">
                    {order.total != null ? formatMoney(order.total) : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {order.date
                      ? new Date(order.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td
                    className={`px-4 py-2 border font-semibold ${
                      order.status === "Completed"
                        ? "text-green-600"
                        : order.status === "Pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {order.status || "-"}
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => {
                        setActiveOrderIndex(idx);
                        setIsModalOpen(true);
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            contentLabel="Details"
            overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center z-50"
            className="max-w-4xl w-full mt-16 bg-white rounded-2xl shadow-xl p-6 outline-none relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold">
                  {isProductObject(activeOrder)
                    ? activeOrder.name || "Product Detail"
                    : `Order #${activeOrder?.orderId || "-"}`}
                </h2>
                <div className="text-sm text-gray-500">
                  {activeOrder?.date
                    ? new Date(activeOrder.date).toLocaleString()
                    : ""}
                </div>
              </div>
              <button
                aria-label="Close"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-600 hover:text-gray-900 text-xl"
              >
                ✕
              </button>
            </div>

            {activeOrder ? (
              <div className="space-y-6">
                {/* If it's a product-like object, show product details */}
                {isProductObject(activeOrder) ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Images */}
                    <div className="space-y-3">
                      {Array.isArray(activeOrder.images) &&
                      activeOrder.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {activeOrder.images.map((src, i) => (
                            <div
                              key={i}
                              className="border rounded overflow-hidden"
                            >
                              <img
                                src={src}
                                alt={activeOrder.name || "product image"}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-40 flex items-center justify-center border rounded text-gray-400">
                          No Images
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="space-y-3">
                      <div>
                        <div className="text-lg font-semibold mb-1">
                          {activeOrder.name || "-"}
                        </div>
                        {Array.isArray(activeOrder.altNames) &&
                          activeOrder.altNames.length > 0 && (
                            <div className="text-sm text-gray-600 mb-1">
                              Also known as: {activeOrder.altNames.join(", ")}
                            </div>
                          )}
                        <div className="text-sm text-gray-700">
                          {activeOrder.description || "No description provided."}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="bg-gray-50 p-3 rounded border flex-1">
                          <div className="text-xs text-gray-500">Labelled</div>
                          <div className="text-lg font-bold">
                            {formatMoney(activeOrder.labelledPrice || 0)}
                          </div>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border flex-1">
                          <div className="text-xs text-gray-500">Price</div>
                          <div className="text-lg font-bold">
                            {formatMoney(activeOrder.price || 0)}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="px-3 py-2 border rounded flex-1">
                          <div className="text-xs text-gray-500">Stock</div>
                          <div className="font-medium">
                            {activeOrder.stock != null
                              ? activeOrder.stock
                              : "Unknown"}
                          </div>
                        </div>
                        <div className="px-3 py-2 border rounded flex-1">
                          <div className="text-xs text-gray-500">
                            Availability
                          </div>
                          <div
                            className={`font-semibold ${
                              activeOrder.isAvailable
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {activeOrder.isAvailable
                              ? "Available"
                              : "Not Available"}
                          </div>
                        </div>
                        <div className="px-3 py-2 border rounded flex-1">
                          <div className="text-xs text-gray-500">Product ID</div>
                          <div>{activeOrder.productId || activeOrder._id}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Otherwise, assume it's an order object and show order details
                  <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">
                          Customer Information
                        </h3>
                        <div>
                          <div>
                            <strong>Name:</strong> {activeOrder.name || "-"}
                          </div>
                          <div>
                            <strong>Email:</strong> {activeOrder.email || "-"}
                          </div>
                          <div>
                            <strong>Phone:</strong> {activeOrder.phone || "-"}
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-2">
                          Shipping Address
                        </h3>
                        <div>{activeOrder.address || "-"}</div>
                        {activeOrder.city && (
                          <div>
                            {activeOrder.city}
                            {activeOrder.country
                              ? `, ${activeOrder.country}`
                              : ""}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Items */}
                    {Array.isArray(activeOrder.items) &&
                    activeOrder.items.length > 0 ? (
                      <div className="bg-white border rounded-lg shadow-sm p-4">
                        <h3 className="font-semibold mb-3">Ordered Items</h3>
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm table-auto border-collapse">
                            <thead className="bg-gray-100">
                              <tr>
                                <th className="px-3 py-2 border text-left">
                                  Product
                                </th>
                                <th className="px-3 py-2 border text-center">
                                  Qty
                                </th>
                                <th className="px-3 py-2 border text-right">
                                  Price
                                </th>
                                <th className="px-3 py-2 border text-right">
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
                                    className={
                                      i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                  >
                                    <td className="px-3 py-2 border">
                                      {it.productName || it.name || "-"}
                                    </td>
                                    <td className="px-3 py-2 border text-center">
                                      {qty}
                                    </td>
                                    <td className="px-3 py-2 border text-right">
                                      {formatMoney(price)}
                                    </td>
                                    <td className="px-3 py-2 border text-right font-medium">
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
                      <div className="text-gray-500">
                        No items data available for this order.
                      </div>
                    )}

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="font-semibold mb-2">Payment</h3>
                        <div>
                          <div>
                            <strong>Method:</strong>{" "}
                            {activeOrder.paymentMethod || "-"}
                          </div>
                          <div>
                            <strong>Paid:</strong>{" "}
                            {activeOrder.isPaid ? (
                              <span className="text-green-600">Yes</span>
                            ) : (
                              <span className="text-red-600">No</span>
                            )}
                          </div>
                          {activeOrder.paidAt && (
                            <div>
                              <strong>Paid At:</strong>{" "}
                              {new Date(activeOrder.paidAt).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded border">
                        <h3 className="font-semibold mb-2">Order Summary</h3>
                        <div className="space-y-1">
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
                          <div className="flex justify-between font-bold border-t pt-2">
                            <div>Total:</div>
                            <div>{formatMoney(activeOrder.total || 0)}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="bg-gray-50 p-4 rounded border">
                      <h3 className="font-semibold mb-2">Status</h3>
                      <div className="flex flex-wrap gap-6">
                        <div>
                          <strong>Order:</strong>{" "}
                          <span
                            className={`${
                              activeOrder.status === "Completed"
                                ? "text-green-600"
                                : activeOrder.status === "Pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            } font-semibold`}
                          >
                            {activeOrder.status || "-"}
                          </span>
                        </div>
                        {activeOrder.isDelivered != null && (
                          <div>
                            <strong>Delivered:</strong>{" "}
                            {activeOrder.isDelivered ? (
                              <span className="text-green-600">Yes</span>
                            ) : (
                              <span className="text-red-600">No</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500">No selection.</div>
            )}
          </Modal>
        </div>
      )}
    </div>
  );
}
