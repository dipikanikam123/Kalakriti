import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/image/kalakriti.png";

/* ================= MAIN ADMIN PANEL ================= */
const AdminPanel = () => {
  const { role, logout } = useAuth();
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("dashboard");

  useEffect(() => {
    if (role !== "ADMIN") {
      navigate("/");
    }
  }, [role, navigate]);

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      {/* SIDEBAR */}
      <aside className="w-72 bg-purple-700   text-white p-6 fixed h-full z-10 shadow-2xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-12 px-2">

            <h2 className="text-2xl font-bold tracking-wide">Kalakriti</h2>
          </div>

          <ul className="space-y-3">
            <SidebarItem
              label="Overview"
              page="dashboard"
              icon="📊"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Add Service"
              page="upload"
              icon="✨"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Manage Art"
              page="manage"
              icon="🎨"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Orders"
              page="orders"
              icon="📦"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Users"
              page="users"
              icon="👥"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Messages"
              page="messages"
              icon="💬"
              {...{ activePage, setActivePage }}
            />
            <SidebarItem
              label="Reviews"
              page="reviews"
              icon="⭐"
              {...{ activePage, setActivePage }}
            />
          </ul>
        </div>

        <button
          onClick={logout}
          className="w-full text-left p-4 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition flex items-center gap-3 mb-4"
        >
          <span>🚪</span> Logout
        </button>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-10 ml-72">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "upload" && <UploadService />}
        {activePage === "manage" && <ManageServices />}
        {activePage === "orders" && <Orders />}
        {activePage === "users" && <Users />}
        {activePage === "messages" && <ContactMessages />}
        {activePage === "reviews" && <ReviewsManagement />}
      </main>
    </div>
  );
};

/* ================= SIDEBAR ITEM ================= */
const SidebarItem = ({ label, page, icon, activePage, setActivePage }) => (
  <li
    onClick={() => setActivePage(page)}
    className={`cursor-pointer p-4 rounded-xl transition-all font-medium flex items-center gap-4 ${activePage === page
      ? "bg-purple-600 text-white shadow-lg "
      : " "
      }`}
  >
    <span className="text-lg">{icon}</span>
    {label}
  </li>
);

// Helper function to format timestamp
const formatTimestamp = (timestamp) => {
  const now = new Date();
  const activityTime = new Date(timestamp);
  const diffMs = now - activityTime;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return activityTime.toLocaleDateString();
};

/* ================= DASHBOARD ================= */

const Dashboard = () => {
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await api.get("/admin/dashboard/activities");
      setActivities(res.data);
    } catch (err) {
      console.error("Activities fetch error:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Placeholder data simulation
      const res = await api.get("/admin/dashboard");
      setStats({
        totalOrders: res.data.totalOrders,
        totalRevenue: res.data.totalRevenue,
        totalUsers: res.data.totalUsers,
      });
      setLoading(false);
    } catch (err) {
      console.error("Dashboard error:", err);
      // Fallback only on error
      setStats({ totalOrders: 0, totalRevenue: 0, totalUsers: 0 });
      setLoading(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div></div>;

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-2">Welcome back, Admin! Here's what's happening today.</p>
        </div>
        <div className="text-right">
          <span className="bg-white px-4 py-2 rounded-full border shadow-sm text-sm font-medium text-gray-600">
            📅 {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card title="Total Orders" value={stats.totalOrders} color="from-blue-500 to-cyan-400" />
        <Card title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} color="from-purple-500 to-pink-500" />
        <Card title="Active Users" value={stats.totalUsers} color="from-orange-500 to-yellow-400" />
      </div>

      {/* ===== RECENT ACTIVITY ===== */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold mb-6 text-gray-800">Recent System Activity</h2>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-gray-400 text-center py-6">No recent activity</p>
          ) : (
            activities.map((activity, index) => (
              <div key={index} className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition cursor-default">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">{activity.icon}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, value, icon, color }) => (
  <div className={`bg-gradient-to-br ${color} rounded-3xl p-8 text-white shadow-xl shadow-gray-200 transform transition hover:-translate-y-1`}>
    <div className="flex justify-between items-start">
      <div>
        <p className="font-medium opacity-90 mb-1">{title}</p>
        <h2 className="text-4xl font-black">{value}</h2>
      </div>
      <div className="bg-white/20 p-3 rounded-2xl text-2xl backdrop-blur-sm">
        {icon}
      </div>
    </div>
  </div>
);


/* ================= ADD SERVICE ================= */
const UploadService = () => {
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    }
  }

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.price) {
      return toast.error("Please fill all required fields ❌");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("category", form.category);
      formData.append("price", form.price);
      // formData.append("description", form.description);
      if (file) formData.append("image", file);

      await api.post("/services/addservice", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      toast.success("Service added successfully! 🎉");
      setForm({ name: "", category: "", price: "" });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add service ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in-up">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Add New Service</h1>

      <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-10">

        {/* Form Section */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Service Name</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Sunset Bliss"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Category</label>
              <input
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Abstract"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
            <input
              type="number"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition"
              name="price"
              value={form.price}
              onChange={handleChange}
              placeholder="e.g. 1500"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition h-32 resize-none"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the artwork details..."
            />
          </div> */}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold shadow-lg transition transform active:scale-95"
          >
            {loading ? "Uploading..." : "Publish Service"}
          </button>
        </div>

        {/* Image Upload Section */}
        <div className="w-full md:w-80">
          <label className="block text-sm font-bold text-gray-700 mb-2">Artwork Image</label>
          <div className="border-2 border-dashed border-gray-200 rounded-2xl h-80 flex flex-col items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition relative overflow-hidden group">
            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />

            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <div className="text-4xl mb-4 text-gray-300">📷</div>
                <p className="text-gray-500 font-medium">Click or Drag to Upload</p>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG up to 5MB</p>
              </div>
            )}

            {preview && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition z-10">
                <span className="text-white font-bold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md">Change Image</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

/* ================= MANAGE SERVICES ================= */
const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/services")
      .then((res) => setServices(res.data))
      .catch(() => toast.error("Failed to load services"))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(services.filter(s => (s.serviceId || s.id) !== id));
      toast.success("Service deleted 🗑️");
    } catch (e) {
      toast.error("Delete failed");
    }
  }

  if (loading) return <div className="text-center py-20 text-gray-400">Loading library...</div>

  return (
    <div className="size-full animate-fade-in-up">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Manage Inventory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((s) => (
          <div key={s.serviceId || s.id} className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-48 rounded-xl overflow-hidden mb-4">
              <img
                src={s.image}
                alt={s.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
                {s.category}
              </div>
            </div>

            <div className="px-2 pb-2">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 truncate flex-1">{s.name}</h3>
                <span className="font-black text-purple-600">₹{s.price}</span>
              </div>

              <p className="text-gray-500 text-xs line-clamp-2 mb-4 h-8">{s.description}</p>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.serviceId || s.id)}
                  className="flex-1 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ================= ORDERS ================= */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/admin");
      setOrders(res.data);
    } catch (err) {
      console.error("Order fetch error:", err);
      toast.error("Could not fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/admin/${id}/status`, null, { params: { status } });
      toast.success(`Order #${id} marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Status update failed");
    }
  };

  if (loading) return <p className="text-gray-500 p-6">Loading orders...</p>;

  return (
    <div className="animate-fade-in-up">
      <h1 className="text-3xl font-black text-gray-900 mb-8">Order Management</h1>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-5 whitespace-nowrap">Date & ID</th>
                <th className="p-5">Customer Details</th>
                <th className="p-5 min-w-[200px]">Delivery Address</th>
                <th className="p-5 min-w-[200px]">Items</th>
                <th className="p-5 whitespace-nowrap">Payment</th>
                <th className="p-5 whitespace-nowrap">Status</th>
                <th className="p-5 whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {orders.length === 0 ? (
                <tr><td colSpan="7" className="p-10 text-center text-gray-400">No orders found</td></tr>
              ) : orders.map((o) => (
                <tr key={o.orderId || o.id} className="hover:bg-gray-50/50 transition">
                  {/* Date & ID */}
                  <td className="p-5 align-top">
                    <p className="font-bold text-gray-900">{o.orderId || o.id}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Just now"}
                    </p>
                    <p className="text-xs text-gray-400">{o.createdAt ? new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}</p>
                  </td>

                  {/* Customer */}
                  <td className="p-5 align-top">
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-800">{o.customerName}</span>
                      <a href={`mailto:${o.userEmail}`} className="text-xs text-purple-600 hover:underline mt-0.5">{o.userEmail}</a>
                      <span className="text-xs text-gray-500 mt-0.5">📞 {o.phone}</span>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="p-5 align-top text-sm text-gray-600 leading-relaxed max-w-[250px]">
                    {o.address}
                  </td>

                  {/* Items */}
                  <td className="p-5 align-top">
                    <div className="space-y-1">
                      {o.items?.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-700 truncate max-w-[150px]" title={i.name}>{i.name}</span>
                          {/* <span className="text-gray-400 text-xs whitespace-nowrap">x{i.quantity}</span> */}
                        </div>
                      ))}
                    </div>
                  </td>

                  {/* Payment */}
                  <td className="p-5 align-top">
                    <p className="font-black text-gray-900 text-lg">₹{o.totalPrice}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${(o.paymentMethod === 'ONLINE' || o.paymentMethod === 'Online Payment')
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                        }`}>
                        {o.paymentMethod === 'ONLINE' ? 'ONLINE' : 'COD'}
                      </span>
                      {o.paymentStatus === 'PAID' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-50 text-green-700 border border-green-100">PAID</span>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-5 align-top">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border inline-block ${o.status === "COMPLETED" || o.status === "DELIVERED" ? "bg-green-100 text-green-700 border-green-200" :
                      o.status === "SHIPPED" ? "bg-blue-100 text-blue-700 border-blue-200" :
                        o.status === "CANCELLED" ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-yellow-50 text-yellow-700 border-yellow-100 mr-2"
                      }`}>
                      {o.status || "PENDING"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-5 align-top">
                    {o.status !== "DELIVERED" && o.status !== "CANCELLED" && (
                      <div className="flex flex-col gap-2">
                        {o.status !== "SHIPPED" && (
                          <button
                            onClick={() => updateStatus(o.orderId || o.id, "SHIPPED")}
                            className="px-3 py-1.5 bg-white border border-purple-200 text-purple-600 rounded-lg text-xs font-bold hover:bg-purple-50 transition w-full text-center"
                          >
                            Mark Shipped
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(o.orderId || o.id, "DELIVERED")}
                          className="px-3 py-1.5 bg-purple-600 border border-purple-600 text-white rounded-lg text-xs font-bold hover:bg-purple-700 transition shadow-sm w-full text-center"
                        >
                          Mark Delivered
                        </button>
                      </div>
                    )}
                    {o.status === "DELIVERED" && <span className="text-gray-400 text-xs font-medium block text-center mt-2">Completed</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ================= USERS ================= */
const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get("/users")
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-black text-gray-900">Registered Users</h1>
        <div className="text-gray-500 text-sm font-medium bg-white px-3 py-1 rounded-lg border shadow-sm">
          Total: {users.length}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs font-bold tracking-wider border-b border-gray-100">
            <tr>
              <th className="p-5">ID</th>
              <th className="p-5">User Profile</th>
              <th className="p-5">Role</th>
              <th className="p-5">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/50 transition">
                <td className="p-5 text-gray-400 font-mono text-sm">{u.id}</td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
                      {u.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${u.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700 border-purple-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                    }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-5 text-sm text-gray-400">
                  {new Date().toLocaleDateString()} {/* Placeholder for join date if missing */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ================= CONTACT MESSAGES ================= */
const ContactMessages = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // ===== REPLY STATE =====
  const [replyModal, setReplyModal] = useState(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [sendingReply, setSendingReply] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await api.get("/admin/contacts");
      setContacts(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setLoading(false);
    }
  };

  const sendReply = async () => {
    if (!replyMessage.trim()) return toast.error("Please write a message first");

    setSendingReply(true);
    try {
      await api.post("/admin/reply", {
        email: replyModal.email,
        message: replyMessage,
      });
      toast.success(`Reply sent to ${replyModal.name} successfully! 📧`);
      setReplyModal(null);
      setReplyMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply. Please try again.");
    } finally {
      setSendingReply(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div></div>;

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-4xl font-black text-gray-900">Contact Messages</h1>
        <p className="text-gray-500 mt-2">View all custom artwork requests from users</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-gray-200">
              <tr>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Name</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Email</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Phone</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Address</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Message</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Images</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Date</th>
                <th className="p-5 text-left text-sm font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-400">No contact messages yet</td>
                </tr>
              ) : (
                contacts.map((contact, index) => (
                  <tr key={contact.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="p-5 text-sm font-medium text-gray-900">{contact.name}</td>
                    <td className="p-5 text-sm text-gray-600">{contact.email}</td>
                    <td className="p-5 text-sm text-gray-600">{contact.phone}</td>
                    <td className="p-5 text-sm text-gray-600">{contact.address}</td>
                    <td className="p-5 text-sm text-gray-600 max-w-xs truncate">{contact.message}</td>
                    <td className="p-5">
                      {contact.images && contact.images.length > 0 ? (
                        <div className="flex gap-2">
                          {contact.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={`http://localhost:8080/uploads/contact/${img}`}
                              alt={`Request ${idx + 1}`}
                              className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200 cursor-pointer hover:border-purple-500 transition"
                              onClick={() => setSelectedImage(`http://localhost:8080/uploads/contact/${img}`)}
                            />
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs">No images</span>
                      )}
                    </td>
                    <td className="p-5 text-sm text-gray-400">
                      {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="p-5 flex gap-2">
                      {/* CONNECT BUTTON */}
                      <button
                        onClick={() => setReplyModal(contact)}
                        className="text-purple-600 hover:text-purple-800 font-bold text-sm bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Connect ✉️
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={async () => {
                          if (window.confirm("Are you sure you want to delete this message?")) {
                            try {
                              await api.delete(`/admin/contacts/${contact.id}`);
                              setContacts(contacts.filter(c => c.id !== contact.id));
                              toast.success("Message deleted successfully");
                            } catch (err) {
                              toast.error("Failed to delete message");
                            }
                          }
                        }}
                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== REPLY MODAL ===== */}
      {replyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-4">Reply to {replyModal.name}</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 mb-1">To:</label>
              <input
                type="text"
                value={replyModal.email}
                disabled
                className="w-full bg-gray-100 border rounded px-3 py-2 text-gray-600"
              />
            </div>
            <textarea
              rows="5"
              placeholder="Write your reply here..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-purple-400 outline-none mb-4"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setReplyModal(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={sendingReply}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition disabled:opacity-50 flex items-center gap-2"
              >
                {sendingReply ? "Sending..." : "Send Reply 🚀"}
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-4 -right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center text-gray-700 hover:bg-gray-100 shadow-lg"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REVIEWS MANAGEMENT ================= */
const ReviewsManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, 5star, 4star, 3star, 2star, 1star

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    try {
      // Fetch all reviews from all services
      const res = await api.get("/reviews/all");
      setReviews(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching reviews:", err);
      toast.error("Failed to load reviews");
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    try {
      await api.delete(`/reviews/${reviewId}`);
      setReviews(reviews.filter(r => r.id !== reviewId));
      toast.success("Review deleted successfully");
    } catch (err) {
      console.error("Error deleting review:", err);
      toast.error("Failed to delete review");
    }
  };

  const getFilteredReviews = () => {
    if (filter === 'all') return reviews;
    const rating = parseInt(filter.replace('star', ''));
    return reviews.filter(r => r.rating === rating);
  };

  const filteredReviews = getFilteredReviews();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900">Reviews Management</h1>
          <p className="text-gray-500 mt-2">View and manage all user reviews</p>
        </div>
        <div className="text-right">
          <span className="bg-white px-4 py-2 rounded-full border shadow-sm text-sm font-medium text-gray-600">
            Total Reviews: {reviews.length}
          </span>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 flex-wrap">
        {['all', '5star', '4star', '3star', '2star', '1star'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl font-semibold text-sm transition ${filter === f
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
              }`}
          >
            {f === 'all' ? 'All Reviews' : `${f.replace('star', '')} ⭐`}
            <span className="ml-2 text-xs opacity-75">
              ({f === 'all' ? reviews.length : reviews.filter(r => r.rating === parseInt(f.replace('star', ''))).length})
            </span>
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredReviews.length === 0 ? (
          <div className="p-10 text-center text-gray-400">
            No reviews found
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredReviews.map((review) => (
              <div key={review.id} className="p-6 hover:bg-gray-50 transition">
                <div className="flex gap-6">
                  {/* Review Image (if exists) */}
                  {review.imageUrl && (
                    <div className="flex-shrink-0">
                      <img
                        src={review.imageUrl}
                        alt="Review"
                        className="w-24 h-24 object-cover rounded-xl border-2 border-gray-200"
                      />
                    </div>
                  )}

                  {/* Review Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                            {review.userName?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{review.userName || 'Anonymous'}</p>
                            <p className="text-xs text-gray-500">
                              {review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }) : 'Recently'}
                            </p>
                          </div>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className={`text-lg ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          {review.verifiedPurchase && (
                            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full border border-green-200">
                              ✓ Verified Purchase
                            </span>
                          )}
                        </div>

                        {/* Service Name */}
                        <p className="text-sm text-gray-500 mb-2">
                          <span className="font-semibold">Service:</span> {review.serviceName || `Service #${review.serviceId}`}
                        </p>

                        {/* Review Text */}
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>

                        {/* Helpful Votes */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                          <span>👍 {review.helpfulCount || 0} helpful</span>
                          <span>👎 {review.notHelpfulCount || 0} not helpful</span>
                        </div>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteReview(review.id)}
                        className="text-red-500 hover:text-red-700 font-bold text-sm bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition flex items-center gap-2"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">5 Star Reviews</p>
          <p className="text-3xl font-black">{reviews.filter(r => r.rating === 5).length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">4 Star Reviews</p>
          <p className="text-3xl font-black">{reviews.filter(r => r.rating === 4).length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">3 Star Reviews</p>
          <p className="text-3xl font-black">{reviews.filter(r => r.rating === 3).length}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">2 Star Reviews</p>
          <p className="text-3xl font-black">{reviews.filter(r => r.rating === 2).length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">1 Star Reviews</p>
          <p className="text-3xl font-black">{reviews.filter(r => r.rating === 1).length}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
