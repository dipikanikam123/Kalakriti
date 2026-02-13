import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

const OrderConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const orderData = location.state?.orderData;

    useEffect(() => {
        // If no order data, redirect to home
        if (!orderData) {
            navigate("/");
        }
    }, [orderData, navigate]);

    if (!orderData) {
        return null;
    }

    return (
        <>

            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 pt-28 pb-20 px-4 md:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Success Header with Animation */}
                    <div className="text-center mb-12 animate-fade-in">
                        <div className="inline-block mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl animate-bounce-slow">
                                <svg
                                    className="w-12 h-12 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
                            Order Placed Successfully! 🎉
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Thank you for your order! We'll start working on it right away.
                        </p>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden mb-6">
                        {/* Order Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6 text-white">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <p className="text-purple-200 text-sm mb-1">Order ID</p>
                                    <h2 className="text-2xl font-black">{orderData.id}</h2>
                                </div>
                                <div className="text-left md:text-right">
                                    <p className="text-purple-200 text-sm mb-1">Order Date</p>
                                    <p className="text-lg font-bold">
                                        {new Date().toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-8 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                Order Items
                            </h3>
                            <div className="space-y-4">
                                {orderData.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-4 items-center p-4 bg-gray-50 rounded-xl">
                                        <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                                                    🎨
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{item.name || "Art Piece"}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Quantity: {item.quantity} × ₹{item.price}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">₹{item.price * item.quantity}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery & Payment Info */}
                        <div className="p-8 bg-gray-50">
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Delivery Address */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Delivery Address
                                    </h3>
                                    <div className="text-gray-900">
                                        <p className="font-semibold">{orderData.customerName}</p>
                                        <p className="text-sm text-gray-600 mt-1">{orderData.address}</p>
                                        <p className="text-sm text-gray-600 mt-1">📞 {orderData.phone}</p>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div>
                                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                        Payment Method
                                    </h3>
                                    <p className="text-gray-900 font-semibold">
                                        {orderData.paymentMethod === 'cod' ? '💵 Cash on Delivery' : orderData.paymentMethod}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="px-8 py-6 bg-gradient-to-r from-gray-50 to-purple-50 border-t border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-700 font-semibold">Total Amount</span>
                                <span className="text-3xl font-black text-purple-600">₹{orderData.totalPrice}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate("/explore")}
                            className="px-8 py-4 bg-white hover:bg-gray-50 text-gray-900 font-bold rounded-xl border-2 border-gray-200 transition-all duration-300 hover:shadow-lg"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate("/userdashboard")}
                            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            View My Orders
                        </button>
                    </div>

                    {/* Thank You Message */}
                    <div className="mt-12 text-center">
                        <p className="text-gray-500 mb-2">
                            We've sent a confirmation email to your registered email address.
                        </p>
                        <p className="text-gray-400 text-sm">
                            Need help? Contact us at{" "}
                            <a href="mailto:info@kalakriti.com" className="text-purple-600 hover:underline">
                                info@kalakriti.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default OrderConfirmation;
