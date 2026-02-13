// ============================================
// STATE PERSISTENCE - QUICK REFERENCE
// ============================================

// ============================================
// 1. HOW TO USE AUTH CONTEXT
// ============================================

import { useAuth } from './context/AuthContext';

function MyComponent() {
    const {
        user,              // Current user object { id, name, email, role, phone, address }
        token,             // JWT token string
        role,              // User role: 'USER' or 'ADMIN'
        isAuthenticated,   // Boolean: true if logged in
        loading,           // Boolean: true while validating token
        login,             // Function: login(email, password)
        logout,            // Function: logout()
        updateProfile      // Function: updateProfile(data)
    } = useAuth();

    // Check if user is logged in
    if (isAuthenticated) {
        console.log('User is logged in:', user.name);
    }

    // Check user role
    if (role === 'ADMIN') {
        console.log('User is admin');
    }

    return <div>Hello {user?.name}</div>;
}

// ============================================
// 2. HOW TO USE CART CONTEXT
// ============================================

import { useCart } from './context/CartContext';

function CartComponent() {
    const {
        cart,              // Array of cart items
        addToCart,         // Function: addToCart(product, quantity)
        removeFromCart,    // Function: removeFromCart(productId)
        updateQuantity,    // Function: updateQuantity(productId, newQty)
        clearCart          // Function: clearCart()
    } = useCart();

    // Add item to cart
    const handleAddToCart = () => {
        const product = { id: 1, name: 'Art Piece', price: 1000 };
        addToCart(product, 1);
    };

    // Get cart total
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    return (
        <div>
            <p>Cart Items: {cart.length}</p>
            <p>Total: ₹{total}</p>
        </div>
    );
}

// ============================================
// 3. HOW TO MAKE AUTHENTICATED API CALLS
// ============================================

import api from './utils/api';

// GET request (token automatically attached)
const fetchUserData = async () => {
    try {
        const response = await api.get('/users/me');
        console.log(response.data);
    } catch (error) {
        console.error('Error:', error);
    }
};

// POST request
const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};

// PUT request
const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error:', error);
    }
};

// ============================================
// 4. HOW TO CREATE PROTECTED ROUTES
// ============================================

import { Route } from 'react-router-dom';
import ProtectedRoute from './component/ProtectedRoute';

// Protect a route (any logged-in user)
<Route element={<ProtectedRoute />}>
    <Route path="/dashboard" element={<Dashboard />} />
</Route>

// Protect a route (admin only)
<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
    <Route path="/admin" element={<AdminPanel />} />
</Route>

// Protect a route (specific roles)
<Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MODERATOR']} />}>
    <Route path="/manage" element={<ManagePage />} />
</Route>

// ============================================
// 5. HOW TO HANDLE LOGIN
// ============================================

import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = await login(email, password);

        if (result.success) {
            toast.success('Login successful!');

            // Redirect based on role
            if (result.role === 'ADMIN') {
                navigate('/adminpanel');
            } else {
                navigate('/');
            }
        } else {
            toast.error(result.message || 'Login failed');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <input type="email" name="email" required />
            <input type="password" name="password" required />
            <button type="submit">Login</button>
        </form>
    );
}

// ============================================
// 6. HOW TO HANDLE LOGOUT
// ============================================

import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

function LogoutButton() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    return <button onClick={handleLogout}>Logout</button>;
}

// ============================================
// 7. HOW TO CHECK AUTH STATUS IN COMPONENTS
// ============================================

import { useAuth } from './context/AuthContext';

function Navbar() {
    const { isAuthenticated, user, role } = useAuth();

    return (
        <nav>
            {isAuthenticated ? (
                <>
                    <span>Welcome, {user.name}!</span>
                    {role === 'ADMIN' && <a href="/adminpanel">Admin Panel</a>}
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <>
                    <a href="/login">Login</a>
                    <a href="/signup">Sign Up</a>
                </>
            )}
        </nav>
    );
}

// ============================================
// 8. HOW TO ACCESS LOCALSTORAGE DIRECTLY
// ============================================

// Get token
const token = localStorage.getItem('token');

// Get user data
const userName = localStorage.getItem('name');
const userEmail = localStorage.getItem('email');
const userRole = localStorage.getItem('role');

// Get cart
const cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Clear all data (logout)
localStorage.clear();

// ============================================
// 9. HOW TO CONDITIONALLY RENDER BASED ON AUTH
// ============================================

import { useAuth } from './context/AuthContext';

function ConditionalComponent() {
    const { isAuthenticated, role, loading } = useAuth();

    // Show loading state
    if (loading) {
        return <div>Loading...</div>;
    }

    // Not authenticated
    if (!isAuthenticated) {
        return <div>Please login to continue</div>;
    }

    // Admin only content
    if (role === 'ADMIN') {
        return <div>Admin Content</div>;
    }

    // Regular user content
    return <div>User Content</div>;
}

// ============================================
// 10. HOW TO UPDATE USER PROFILE
// ============================================

import { useAuth } from './context/AuthContext';
import toast from 'react-hot-toast';

function ProfilePage() {
    const { user, updateProfile } = useAuth();

    const handleUpdate = async (e) => {
        e.preventDefault();

        const updatedData = {
            phone: e.target.phone.value,
            address: e.target.address.value
        };

        const result = await updateProfile(updatedData);

        if (result.success) {
            toast.success('Profile updated!');
        } else {
            toast.error('Update failed');
        }
    };

    return (
        <form onSubmit={handleUpdate}>
            <input
                type="tel"
                name="phone"
                defaultValue={user?.phone}
            />
            <input
                type="text"
                name="address"
                defaultValue={user?.address}
            />
            <button type="submit">Update</button>
        </form>
    );
}

// ============================================
// 11. DEBUGGING - CHECK STATE PERSISTENCE
// ============================================

// Add this to any component to debug state
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';

function DebugInfo() {
    const { user, token, isAuthenticated } = useAuth();
    const { cart } = useCart();

    console.log('=== STATE DEBUG ===');
    console.log('Authenticated:', isAuthenticated);
    console.log('User:', user);
    console.log('Token:', token?.substring(0, 20) + '...');
    console.log('Cart Items:', cart.length);
    console.log('localStorage token:', localStorage.getItem('token'));
    console.log('===================');

    return null;
}

// ============================================
// 12. COMMON PATTERNS
// ============================================

// Pattern 1: Redirect if not logged in
import { useAuth } from './context/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedPage() {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" />;

    return <div>Protected Content</div>;
}

// Pattern 2: Show different content based on role
function DynamicContent() {
    const { role } = useAuth();

    switch (role) {
        case 'ADMIN':
            return <AdminDashboard />;
        case 'USER':
            return <UserDashboard />;
        default:
            return <GuestView />;
    }
}

// Pattern 3: Cart operations
function ProductCard({ product }) {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(product, 1);
        toast.success('Added to cart!');
    };

    return (
        <div>
            <h3>{product.name}</h3>
            <button onClick={handleAddToCart}>Add to Cart</button>
        </div>
    );
}

// ============================================
// END OF QUICK REFERENCE
// ============================================
