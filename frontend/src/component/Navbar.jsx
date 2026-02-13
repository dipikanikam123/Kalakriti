import React, { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../assets/image/kalakriti.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";

const Navbar = forwardRef((props, ref) => {
  const { user, logout, token, role } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully 👋");
    navigate("/login");
  };

  return (
    <nav
      ref={ref}
      className="w-full fixed top-0 left-0 z-[9999] backdrop-blur-md shadow-md px-6 py-4 flex items-center justify-between"
    >
      {/* Logo */}
      <Link to="/" className="flex items-center cursor-pointer">
        <img src={img} alt="Logo" className="h-10 w-12 mr-2" />
        <h1 className="text-2xl font-bold text-black stylish-font">
          <span className="text-orange-500">Kala</span>kriti
        </h1>
      </Link>

      {/* Navigation Links */}
      <ul className="flex space-x-8 text-black font-medium">
        <li><Link to="/" className="hover:text-orange-500 transition">Home</Link></li>
        {/* <li><Link to="/explore" className="hover:text-orange-500 transition">Explore</Link></li> */}
        <li><Link to="/blog" className="hover:text-orange-500 transition">Blog</Link></li>
        <li><Link to="/contact" className="hover:text-orange-500 transition">Contact</Link></li>
      </ul>

      {/* Right Side Actions */}
      <div className="flex items-center space-x-4">
        {token ? (
          <>
            {/* Show Admin Dashboard button if role is ADMIN */}
            {role === "ADMIN" && (
              <Link
                to="/adminpanel"
                className="px-4 py-2 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition"
              >
                Admin Panel
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
            >
              Logout
            </button>
          </>
        ) : (
          /* Show Login button if NOT logged in */
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition"
          >
            Login
          </Link>
        )}




        {/* Cart Icon */}
        <Link to="/cart" className="relative text-2xl hover:scale-110 transition-transform">
          🛒
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
});

export default Navbar;