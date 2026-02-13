import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import Footer from "../component/Footer";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { cart, clearCart } = useCart();

  // Form state
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");

  useEffect(() => {
    if (!token) {
      toast.error("Please login to proceed with checkout.");
      navigate("/login");
    }
  }, [token, navigate]);

  // Calculate total from Cart
  const totalAmount = cart.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.phone || !formData.address) {
      toast.error("Please fill all details ❌");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty ❌");
      return;
    }

    // If COD, use old flow
    if (paymentMethod === "cod") {
      const orderData = {
        userId: user?.id,
        customerName: formData.name,
        phone: formData.phone,
        address: formData.address,
        userEmail: user?.email || "customer@example.com",
        paymentMethod: "COD",
        totalPrice: totalAmount,
        items: cart.map(item => ({
          serviceId: item.serviceId || item.id,
          quantity: item.qty,
          price: item.price,
          name: item.name,
          image: item.image
        })),
      };

      try {
        const res = await api.post("/orders", orderData);

        if (res.status === 201 || res.status === 200) {
          toast.success("Order placed successfully! 🎉");
          clearCart();

          navigate("/order-confirmation", {
            state: {
              orderData: {
                ...orderData,
                id: res.data.id || res.data.orderId || Date.now(),
              }
            }
          });
        }
      } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Order placement failed ❌");
      }
      return;
    }

    // Online Payment Flow with Razorpay
    try {
      // Step 1: Create Razorpay Order
      const orderResponse = await api.post("/orders/create-razorpay-order", {
        amount: totalAmount
      });

      const { orderId, amount, currency, keyId } = orderResponse.data;

      // Step 2: Open Razorpay Payment Modal
      const options = {
        key: keyId,
        amount: amount,
        currency: currency,
        name: "Kalakriti",
        description: "Art & Creativity Hub",
        order_id: orderId,
        handler: async function (response) {
          // Step 3: Payment Success - Verify and Save Order
          try {
            const orderData = {
              userId: user?.id,
              customerName: formData.name,
              phone: formData.phone,
              address: formData.address,
              userEmail: user?.email || "customer@example.com",
              totalPrice: totalAmount,
              items: cart.map(item => ({
                serviceId: item.serviceId || item.id,
                quantity: item.qty,
                price: item.price,
                name: item.name,
                image: item.image
              })),
            };

            const verifyResponse = await api.post("/orders/verify-payment", {
              razorpayOrderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              orderData: orderData
            });

            if (verifyResponse.status === 200) {
              toast.success("Payment successful! Order confirmed 🎉");
              clearCart();

              navigate("/order-confirmation", {
                state: {
                  orderData: {
                    ...orderData,
                    id: verifyResponse.data.id,
                    paymentMethod: "ONLINE"
                  }
                }
              });
            }
          } catch (error) {
            console.error("Payment verification failed:", error);
            toast.error("Payment verification failed! Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          contact: formData.phone
        },
        theme: {
          color: "#7c3aed" // Purple theme
        },
        modal: {
          ondismiss: function () {
            toast.error("Payment cancelled");
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment. Please try again.");
    }
  };

  if (!token) return null;

  return (
    <>
      <div className="min-h-screen bg-gray-50 px-4 md:px-8">
        <div className="max-w-6xl mx-auto pb-20">
          <h1 className="text-4xl font-black text-center mb-15 text-gray-900 tracking-tight">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN: Shipping & Payment (Takes up 2 cols on large screens) */}
            <div className="lg:col-span-2 space-y-8">

              {/* Shipping Details Card */}
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">

                  Shipping Details
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50 focus:bg-white"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Delivery Address</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-5 py-3 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                      placeholder="Enter your complete address"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">

                  Payment Method
                </h2>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-purple-600' : 'border-gray-400'}`}>
                      {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>}
                    </div>
                    <span className="font-semibold text-gray-700">Cash on Delivery</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('online')}
                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${paymentMethod === 'online' ? 'border-purple-600 bg-purple-50' : 'border-gray-100 hover:border-gray-200 opacity-60'}`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? 'border-purple-600' : 'border-gray-400'}`}>
                      {paymentMethod === 'online' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600"></div>}
                    </div>
                    <span className="font-semibold text-gray-700">UPI / Cards</span>
                  </div>
                </div>
              </div>

            </div>


            {/* RIGHT COLUMN: Order Summary (Sticky) */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 lg:sticky lg:top-32">
              <h2 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center p-2 hover:bg-gray-50 rounded-xl transition">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm truncate">{item.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">Qty: {item.qty} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold text-gray-900">₹{item.price * item.qty}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-300 pt-6 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-4 pt-4 mb-8">
                <div className="flex justify-between items-center text-2xl font-black text-gray-900">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform transition hover:-translate-y-1 active:scale-95"
              >
                Confirm Order
              </button>

              <p className="text-xs text-center text-gray-400 mt-4">
                Secure checkout verified by Stripe
              </p>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
