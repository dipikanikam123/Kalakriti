import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useCart } from "../context/CartContext";
import Footer from "../component/Footer";
import toast from "react-hot-toast";

const Explore = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const { addToCart } = useCart();


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Helper to normalize text (Title Case)
  const normalizeText = (text) => text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : "";

  // Extract unique categories
  const categories = ["All", ...new Set(services.map((item) => normalizeText(item.category)).filter(Boolean))];

  const filteredServices = services.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(search.toLowerCase()) ||
      item.category?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || normalizeText(item.category) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto py-12">

          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 animate-fade-in">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight">Explore Art</h1>
              <p className="text-gray-500 mt-2">Discover unique masterpieces curated just for you.</p>
            </div>

            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search by art, category, or artist..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-3 pl-12 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent shadow-sm transition"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-lg">🔍</span>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex gap-3 overflow-x-auto pb-6 mb-4 custom-scrollbar animate-fade-in">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all duration-300 border ${selectedCategory === cat
                  ? "bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-200"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                  <div className="h-64 bg-gray-200"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded-full w-8"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 animate-fade-in-up">
              {filteredServices.length > 0 ? (
                filteredServices.map(service => (
                  <div
                    key={service.serviceId || service.id}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer border border-gray-100"
                    onClick={() => navigate(`/art/${service.serviceId || service.id}`)}
                  >
                    <div className="relative overflow-hidden h-64 w-full bg-gray-100">
                      <img
                        src={service.image}
                        // alt={service.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                    </div>

                    <div className="p-5">
                      {/* <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{service.name}</h3> */}
                      {/* <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-3">{service.category || "Art Piece"}</p> */}



                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-900 font-black text-lg">₹{service.price}</span>
                          <button
                            className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-200 transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/art/${service.serviceId || service.id}`);
                            }}
                          >
                            View
                          </button>
                        </div>

                        <div className="flex gap-2">
                          {/* Cart Button */}
                          <button
                            className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300 shadow-sm active:scale-95"
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(service);
                              toast.success("Added to cart! 🛒");
                            }}
                            title="Add to Cart"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-32 text-center">
                  <div className="text-6xl mb-4">🎨</div>
                  <h3 className="text-2xl font-bold text-gray-900">No masterpieces found</h3>
                  <p className="text-gray-500 mt-2">Try selecting a different category or change your search term.</p>
                  <button
                    onClick={() => { setSearch(""); setSelectedCategory("All") }}
                    className="mt-6 text-purple-600 font-bold hover:underline"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Explore;
