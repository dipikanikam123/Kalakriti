import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Footer from "../component/Footer";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  // 💰 Total Price
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.qty,
    0
  );

  if (cart.length === 0)
    return (
      <div className="h-screen flex items-center justify-center flex-col">
        <h2 className="text-3xl font-semibold text-gray-500 mb-4">
          🛒 Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
        >
          Explore Art
        </button>
      </div>
    );

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-32">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-6 p-5 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                {/* IMAGE */}
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full sm:w-32 h-32 object-cover rounded-lg"
                />

                {/* DETAILS */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h2 className="text-xl font-bold text-gray-800">{item.name}</h2>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{item.category}</p>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                        disabled={item.qty <= 1}
                      >
                        -
                      </button>
                      <span className="font-semibold w-8 text-center">{item.qty}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-xl font-bold text-orange-600">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-28">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{total}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition shadow-lg transform active:scale-95"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-400 text-center mt-4">
                Secure Checkout - 100% Buyer Protection
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CartPage;
