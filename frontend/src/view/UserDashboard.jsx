import React, { useEffect, useState } from "react";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

import { useAuth } from "../context/AuthContext";

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [isLoading, setIsLoading] = useState(true);

  // Profile State
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: "",
    phone: ""
  });

  const navigate = useNavigate();
  const { updateProfile } = useAuth(); // Get updateProfile from context

  // Get logged-in user details
  const userId = localStorage.getItem("userId");
  const storedName = localStorage.getItem("name") || "Art Lover";
  const storedEmail = localStorage.getItem("email");
  const storedPhone = localStorage.getItem("phone") || "";
  const storedAddress = localStorage.getItem("address") || "";

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    // Initialize profile
    setProfile({
      name: storedName,
      email: storedEmail || "",
      address: storedAddress,
      phone: storedPhone
    });

    const initData = async () => {
      setIsLoading(true);
      await Promise.all([fetchUserOrders(), fetchUserCommissions()]);
      setIsLoading(false);
    };

    initData();
  }, [userId]);

  // ... fetch functions ...

  const handleUpdateProfile = async () => {
    const result = await updateProfile({
      phone: profile.phone,
      address: profile.address
    });

    if (result.success) {
      toast.success("Profile updated successfully!");
    } else {
      toast.error("Failed to update profile");
    }
  };

  // ... rest of component ...


  const fetchUserOrders = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error(err);
      toast.error("Could not load orders");
    }
  };

  const fetchUserCommissions = async () => {
    // Need email to fetch commissions. If strictly needed, we should query /auth/me or similar to get email reliably
    // For now, relying on what's available or assuming the backend could filter by userId if we updated it.
    // But we stuck to email in backend. 
    // Let's assume we can get it or fallback.
    if (!storedEmail) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/my-commissions?email=${storedEmail}`);
      if (!res.ok) throw new Error("Failed to fetch commissions");
      const data = await res.json();
      setCommissions(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to fetch commissions", err);
    }
  };

  // ... cancelOrder and getStatusColor ...
  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/user/${orderId}/status?status=CANCELLED`, { method: "PUT" });
      if (res.ok) {
        toast.success("Order cancelled successfully");
        fetchUserOrders();
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (err) {
      console.error("Failed to cancel order", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PLACED": return "bg-blue-100 text-blue-700 border-blue-200";
      case "SHIPPED": return "bg-purple-100 text-purple-700 border-purple-200";
      case "DELIVERED": return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED": return "bg-red-50 text-red-600 border-red-100";
      case "PENDING": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid"></div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-28 pb-20 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-gray-900 mb-2">My Account</h1>
              <p className="text-gray-500 text-lg">Welcome back, <span className="font-semibold text-gray-800">{storedName}</span>! 👋</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-8 border-b border-gray-200 overflow-x-auto">
            {['orders', 'requests', 'profile'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-2 font-bold text-lg capitalize transition whitespace-nowrap ${activeTab === tab ? "text-purple-600 border-b-2 border-purple-600" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab === 'orders' ? `My Orders (${orders.length})` : tab === 'requests' ? `Art Requests (${commissions.length})` : 'Profile'}
              </button>
            ))}
          </div>

          {/* --- TAB CONTENT: ORDERS --- */}
          {activeTab === 'orders' && (
            !orders.length ? (
              <EmptyState
                icon="🎨"
                title="No orders yet"
                desc="Your collection is waiting to be started."
                btnText="Start Exploring"
                action={() => navigate('/explore')}
              />
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 mb-6 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-gray-900 text-lg">Order {order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>{order.status}</span>
                        </div>
                        <p className="text-gray-400 text-sm">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-500 text-sm">Total Amount</p>
                        <p className="text-2xl font-black text-gray-900">₹{order.totalPrice}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                            {item.image ? <img src={item.image} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl bg-gray-50">🖼️</div>}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{item.name}</h4>
                            <p className="text-sm text-gray-500">Qty: {item.quantity} × ₹{item.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {order.status === "PLACED" && (
                      <div className="pt-6 mt-6 border-t border-gray-50 flex justify-end">
                        <button onClick={() => cancelOrder(order.id)} className="px-5 py-2 text-sm font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition">Cancel Order</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {/* --- TAB CONTENT: REQUESTS --- */}
          {activeTab === 'requests' && (
            !commissions.length ? (
              <EmptyState
                icon="✏️"
                title="No art requests"
                desc="Have a specific idea in mind? Request a custom sketch or painting."
                btnText="Request Custom Art"
                action={() => navigate('/contact')}
              />
            ) : (
              <div className="space-y-6 animate-fade-in-up">
                {commissions.map((comm) => (
                  <div key={comm.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-bold text-xl text-gray-900">Custom Request</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(comm.status || 'PENDING')}`}>{comm.status || 'PENDING'}</span>
                        </div>
                        <p className="text-gray-500 text-sm mb-4">Submitted on {new Date(comm.createdAt).toLocaleDateString()}</p>
                        <div className="bg-gray-50 p-4 rounded-xl mb-4"><p className="text-gray-700 italic">"{comm.message}"</p></div>
                      </div>
                      {comm.images && comm.images.length > 0 && (
                        <div className="flex gap-2 mt-4 md:mt-0">
                          {comm.images.map((img, i) => (
                            <img key={i} src={`${API_BASE_URL}/uploads/contact/${img}`} alt="Ref" className="w-20 h-20 object-cover rounded-lg border border-gray-200" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* --- TAB CONTENT: PROFILE --- */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 max-w-2xl animate-fade-in-up">
              <h3 className="text-2xl font-bold mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input type="text" value={profile.name} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                    <input type="text" value={profile.email} disabled className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="text"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                  <textarea
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <button
                    onClick={handleUpdateProfile}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition shadow-lg transform hover:-translate-y-1"
                  >
                    Update Profile
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </>
  );
};

// Helper Component for Empty States
const EmptyState = ({ icon, title, desc, btnText, action }) => (
  <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-gray-200 animate-fade-in-up">
    <div className="text-6xl mb-6">{icon}</div>
    <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">{desc}</p>
    <button onClick={action} className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition transform hover:-translate-y-1">
      {btnText}
    </button>
  </div>
);

export default UserDashboard;
