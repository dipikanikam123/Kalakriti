import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

/**
 * StateDebugger Component
 * 
 * This component displays the current application state for debugging purposes.
 * It shows authentication status, user data, and cart contents.
 * 
 * Usage: Add <StateDebugger /> to any page to see current state
 */
const StateDebugger = () => {
    const { user, token, role, isAuthenticated, loading } = useAuth();
    const { cart } = useCart();

    // Get localStorage data for comparison
    const localStorageData = {
        token: localStorage.getItem('token'),
        role: localStorage.getItem('role'),
        name: localStorage.getItem('name'),
        email: localStorage.getItem('email'),
        userId: localStorage.getItem('userId'),
        cart: localStorage.getItem('cart')
    };

    return (
        <div className="fixed bottom-4 right-4 bg-white border-2 border-purple-500 rounded-lg shadow-xl p-4 max-w-md max-h-96 overflow-auto z-50">
            <h3 className="text-lg font-bold text-purple-600 mb-3">🔍 State Debugger</h3>

            {/* Loading State */}
            <div className="mb-3">
                <span className="font-semibold">Loading:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${loading ? 'bg-yellow-200' : 'bg-green-200'}`}>
                    {loading ? '⏳ Loading...' : '✅ Ready'}
                </span>
            </div>

            {/* Authentication State */}
            <div className="mb-3">
                <span className="font-semibold">Authenticated:</span>
                <span className={`ml-2 px-2 py-1 rounded text-sm ${isAuthenticated ? 'bg-green-200' : 'bg-red-200'}`}>
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                </span>
            </div>

            {/* User Data */}
            <div className="mb-3">
                <h4 className="font-semibold text-purple-600 mb-1">👤 User Data (React State):</h4>
                {user ? (
                    <div className="bg-purple-50 p-2 rounded text-sm">
                        <div><strong>Name:</strong> {user.name}</div>
                        <div><strong>Email:</strong> {user.email}</div>
                        <div><strong>Role:</strong> <span className="bg-purple-200 px-2 py-1 rounded">{user.role}</span></div>
                        <div><strong>ID:</strong> {user.id}</div>
                    </div>
                ) : (
                    <div className="text-gray-500 italic">No user data</div>
                )}
            </div>

            {/* Token */}
            <div className="mb-3">
                <h4 className="font-semibold text-purple-600 mb-1">🔑 Token:</h4>
                <div className="bg-gray-100 p-2 rounded text-xs break-all">
                    {token ? `${token.substring(0, 30)}...` : 'No token'}
                </div>
            </div>

            {/* Cart Data */}
            <div className="mb-3">
                <h4 className="font-semibold text-purple-600 mb-1">🛒 Cart ({cart.length} items):</h4>
                {cart.length > 0 ? (
                    <div className="bg-blue-50 p-2 rounded text-sm max-h-32 overflow-auto">
                        {cart.map((item, index) => (
                            <div key={index} className="mb-1">
                                • {item.name || item.title} (Qty: {item.qty})
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-gray-500 italic">Cart is empty</div>
                )}
            </div>

            {/* localStorage Data */}
            <div className="mb-3">
                <h4 className="font-semibold text-purple-600 mb-1">💾 localStorage:</h4>
                <div className="bg-gray-50 p-2 rounded text-xs">
                    <div><strong>Token:</strong> {localStorageData.token ? '✅ Stored' : '❌ None'}</div>
                    <div><strong>Role:</strong> {localStorageData.role || 'None'}</div>
                    <div><strong>Name:</strong> {localStorageData.name || 'None'}</div>
                    <div><strong>Cart Items:</strong> {localStorageData.cart ? JSON.parse(localStorageData.cart).length : 0}</div>
                </div>
            </div>

            {/* Test Instructions */}
            <div className="mt-4 pt-3 border-t border-purple-200">
                <p className="text-xs text-gray-600">
                    <strong>🧪 Test:</strong> Press <kbd className="bg-gray-200 px-1 rounded">F5</kbd> to refresh the page.
                    All data should persist!
                </p>
            </div>
        </div>
    );
};

export default StateDebugger;
