import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const exhibitions = [
  {
    id: 1,
    category: "Abstract Art",
    title: "Modern Expressions",
    price: "₹2,500",
    image: "https://i.pinimg.com/736x/ad/60/8c/ad608c80f4ae2421fc2cb8b54213c75c.jpg",
  },
  {
    id: 2,
    category: "Portrait",
    title: "Human Emotions",
    price: "₹3,200",
    image: "https://i.pinimg.com/736x/16/02/f1/1602f1a884f9a759dcfc30fcc59531ce.jpg",
  },
  {
    id: 3,
    category: "Landscape",
    title: "Nature's Beauty",
    price: "₹2,800",
    image: "https://i.pinimg.com/736x/ee/55/c3/ee55c35ddf391723c2ed66675fe82635.jpg",
  },
  {
    id: 4,
    category: "Contemporary",
    title: "Urban Stories",
    price: "₹3,500",
    image: "https://i.pinimg.com/736x/b9/0f/a1/b90fa184d4b1579b8287347d3a0d18f6.jpg",
  },
];

const Page1 = () => {
  const cardsRef = useRef([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    gsap.fromTo(
      cardsRef.current,
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.2,
        ease: "power3.out",
      }
    );
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/art/${id}`);
  };

  const handleExploreAll = () => {
    if (!isAuthenticated) {
      // Redirect to login with return URL to explore
      navigate("/login?returnTo=/explore");
    } else {
      navigate("/explore");
    }
  };

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-purple-50">
      {/* Title */}
      <div className="text-center mb-16">
        <h2 className="text-5xl md:text-6xl font-serif tracking-wide stylish-font text-gray-800 mb-4">
          Featured Collection
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Discover handpicked artworks from talented artists around the world
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {exhibitions.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
          >
            {/* Image with Overlay */}
            <div className="relative overflow-hidden h-80">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                {/* <button
                  onClick={() => handleViewDetails(item.id)}
                  className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                >
                  View Details
                </button> */}
              </div>
              {/* Category Badge */}
              {/* <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                {item.category}
              </div> */}
            </div>

            {/* Card Content */}
            {/* <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors duration-300">
                {item.title}
              </h3>
              <div className="flex items-center justify-between mb-4">
                <p className="text-2xl font-bold text-purple-600">{item.price}</p>
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <button
                onClick={() => handleViewDetails(item.id)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Add to Cart
              </button>
            </div> */}
          </div>
        ))}
      </div>

      {/* Explore All Button */}
      <div className="text-center mt-16">
        <button
          onClick={handleExploreAll}
          className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2"
        >
          Explore All Artworks
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Page1;
