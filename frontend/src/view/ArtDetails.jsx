import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";
import toast from "react-hot-toast";
import ReviewStats from "../component/ReviewStats";
import ReviewForm from "../component/ReviewForm";
import ReviewList from "../component/ReviewList";
import api from "../utils/api";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const ArtDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [art, setArt] = useState(null);
  const [relatedArt, setRelatedArt] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("description");

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch current art
        const res = await fetch(`${API_BASE_URL}/api/services/${id}`);
        if (!res.ok) throw new Error("Failed to fetch artwork");
        const data = await res.json();
        setArt(data);

        // Fetch all art for related section
        const allRes = await fetch(`${API_BASE_URL}/api/services`);
        if (allRes.ok) {
          const allData = await allRes.json();
          const related = allData
            .filter((item) => item.category === data.category && (item.serviceId || item.id) !== (data.serviceId || data.id))
            .slice(0, 4);
          setRelatedArt(related);
        }

        // Fetch reviews
        await fetchReviews(id);
        await fetchReviewStats(id);

      } catch (err) {
        console.error(err);
        setError("Artwork not found");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  // Fetch reviews for this artwork
  const fetchReviews = async (serviceId) => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  // Fetch review statistics
  const fetchReviewStats = async (serviceId) => {
    try {
      const response = await api.get(`/reviews/service/${serviceId}/stats`);
      setReviewStats(response.data);
    } catch (error) {
      console.error('Error fetching review stats:', error);
    }
  };

  // Handle new review submission
  const handleReviewSubmitted = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    fetchReviewStats(id); // Refresh stats
    setShowReviewForm(false);
  };

  // Handle review update (helpful votes)
  const handleReviewUpdate = (updatedReview) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === updatedReview.id ? updatedReview : review
      )
    );
  };

  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(art, qty);
    toast.success("Added to cart successfully 🛒");
  };

  const handleBuyNow = () => {
    addToCart(art, qty);
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-600 border-solid"></div>
      </div>
    );
  }

  if (error || !art) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <p className="text-red-500 text-2xl font-bold">{error || "Artwork not found"}</p>
        <button
          onClick={() => navigate('/explore')}
          className="ml-4 text-purple-600 underline hover:text-purple-800"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 md:px-8">
        <div className="max-w-7xl mx-auto pb-16">

          {/* Breadcrumbs */}
          <nav className="text-gray-500 text-sm mb-12  animate-fade-in">
            <span className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <span className="mx-2">/</span>
            <span className="hover:text-purple-600 cursor-pointer" onClick={() => navigate('/explore')}>Explore</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-semibold">{art.name}</span>
          </nav>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-start animate-fade-in-up mt-10">

            {/* LEFT: Image Section */}
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white p-2 ">
              <div className="overflow-hidden rounded-2xl relative bg-gray-50 flex items-center justify-center h-[500px]">
                <img
                  src={art.image}
                  alt={art.name}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
                  {art.category || "Art Piece"}
                </div>
              </div>
            </div>

            {/* RIGHT: Details Section */}
            <div className="flex flex-col space-y-8 pt-4">
              <div>
                <h1 className="text-5xl font-black text-gray-900 leading-tight tracking-tight mb-2">
                  {art.name}
                </h1>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold text-gray-900">₹{art.price}</span>
                <span className="text-gray-400 text-lg mb-1 line-through">₹{Math.round(art.price * 1.2)}</span>
                <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded mb-2">20% OFF</span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                {art.description}
              </p>

              {/* Quantity Selector */}
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block w-full sm:w-auto">
                <div className="flex items-center justify-between gap-6">
                  <span className="font-semibold text-gray-700">Quantity</span>
                  <div className="flex items-center bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => setQty(qty > 1 ? qty - 1 : 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm transition"
                    >
                      −
                    </button>
                    <span className="w-12 text-center text-xl font-bold text-gray-900">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold text-gray-600 hover:bg-white hover:shadow-sm transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleBuyNow}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1 active:scale-95"
                >
                  Buy Now
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-gray-900 text-gray-900 hover:bg-gray-50 py-4 rounded-xl font-bold text-lg transition transform hover:-translate-y-1 active:scale-95"
                >
                  Add to Cart
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex items-center gap-6 text-sm text-gray-500 pt-4">
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🛡️</span> Secure Checkout
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">🚚</span> Free Shipping
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-600">✅</span> Authenticity Guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Tabs Section */}
          <div className="mt-10">
            {/* <div className="flex border-b border-gray-200">
            {['description', 'shipping'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-8 text-lg font-medium transition-all relative ${activeTab === tab
                  ? "text-purple-600"
                  : "text-gray-500 hover:text-gray-800"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-purple-600 rounded-t-lg"></span>
                )}
              </button>
            ))}
          </div> */}
            {/* 
          <div className="py-10 animate-fade-in">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-gray-600">
                <p className="text-lg">
                  Experience the depth and emotion of "{art.name}". This masterpiece is created with high-quality materials
                  and great attention to detail. Perfect for adding a touch of elegance to your living space or office.
                </p>
                <ul className="list-disc pl-6 mt-4 space-y-2">
                  <li>Original artwork by a verified artist.</li>
                  <li>High-quality protective coating.</li>
                  <li>Certificate of Authenticity included.</li>
                </ul>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="text-gray-600">
                <p>We offer free worldwide shipping on all orders over ₹5000. Each piece is carefully packaged in custom-built crates to ensure it arrives in perfect condition.</p>
                <p className="mt-4 font-semibold">Estimated Delivery: 5-7 Business Days</p>
              </div>
            )}
          </div> */}
          </div>

          {/* Related Artworks Section */}
          {relatedArt.length > 0 && (
            <div className=" border-t border-gray-200 pt-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">You Might Also Like</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {relatedArt.map((item) => (
                  <div
                    key={item.serviceId || item.id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/art/${item.serviceId || item.id}`)}
                  >
                    <div className="overflow-hidden rounded-xl mb-4 h-64 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition truncate">{item.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{item.category}</p>
                    <span className="font-bold text-purple-700">₹{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews & Ratings Section */}
          <div className="mt-20 border-t border-gray-200 pt-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-10">Reviews & Ratings</h2>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              {/* Review Stats */}
              <div className="lg:col-span-1">
                <ReviewStats stats={reviewStats} />
              </div>

              {/* Write Review Section */}
              <div className="lg:col-span-2">
                {localStorage.getItem('userId') ? (
                  <>
                    {!showReviewForm ? (
                      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 text-center">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                          Share Your Experience
                        </h3>
                        <p className="text-gray-600 mb-6">
                          Have you purchased this artwork? Let others know what you think!
                        </p>
                        <button
                          onClick={() => setShowReviewForm(true)}
                          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 hover:shadow-xl"
                        >
                          Write a Review
                        </button>
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => setShowReviewForm(false)}
                          className="mb-4 text-purple-600 hover:text-purple-800 font-medium flex items-center gap-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                          </svg>
                          Cancel
                        </button>
                        <ReviewForm
                          serviceId={id}
                          onReviewSubmitted={handleReviewSubmitted}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl shadow-lg p-8 border border-purple-100 text-center">
                    <div className="mb-4">
                      <svg className="w-16 h-16 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Login to Write a Review
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please login to share your experience with this artwork
                    </p>
                    <button
                      onClick={() => navigate('/login')}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-xl transition-all transform hover:scale-105 hover:shadow-xl"
                    >
                      Login Now
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Reviews List */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                All Reviews ({reviews.length})
              </h3>
              <ReviewList
                reviews={reviews}
                onReviewUpdate={handleReviewUpdate}
              />
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default ArtDetails;
