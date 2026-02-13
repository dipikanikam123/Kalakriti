import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./view/Home";
import Contact from "./component/Contact";
import Blog from "./component/Blog";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Explore from "./view/Explore";
import ArtDetails from "./view/ArtDetails";
import AdminPanel from "./view/AdminPanel";
import CartPage from "./view/CartPage";

import UserDashboard from "./view/UserDashboard";
import Checkout from "./view/Checkout";
import OrderConfirmation from "./view/OrderConfirmation";
import Navbar from "./component/Navbar";
import ProtectedRoute from "./component/ProtectedRoute";

import "./App.css";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow pt-20"> {/* Added padding-top to account for fixed navbar */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/art/:id" element={<ArtDetails />} />
          <Route path="/details" element={<ArtDetails />} /> {/* Backward compatibility */}

          {/* Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/adminpanel" element={<AdminPanel />} />
            <Route path="/admin/dashboard" element={<AdminPanel />} />
          </Route>

          <Route path="/cart" element={<CartPage />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />

          <Route path="/userdashboard" element={<UserDashboard />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
