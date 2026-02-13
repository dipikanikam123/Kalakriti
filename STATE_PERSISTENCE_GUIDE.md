# 🔄 State Persistence Guide - Kalakriti Application

## 📋 Overview

This document explains how the Kalakriti application maintains state across page refreshes (browser reload). The solution ensures that users don't lose their login session, cart data, or current page when they refresh the browser.

---

## ✅ What Persists Across Page Refresh?

1. **User Authentication State** - Login session (both user and admin)
2. **JWT Token** - Stored securely in localStorage
3. **User Profile Data** - Name, email, phone, address, role
4. **Shopping Cart** - All cart items and quantities
5. **Current Route** - React Router automatically maintains the URL

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Refresh                       │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              1. React App Initialization                 │
│  - main.jsx loads AuthProvider & CartProvider           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│         2. State Rehydration from localStorage           │
│  - AuthContext reads token, user data                   │
│  - CartContext reads cart items                         │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│         3. Token Validation (Background)                 │
│  - API call to /auth/me to verify token                 │
│  - Updates user data if token is valid                  │
│  - Auto-logout if token is expired                      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              4. App Renders with State                   │
│  - User sees their logged-in state immediately          │
│  - Cart shows saved items                               │
│  - Protected routes work correctly                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Persistence

### How It Works

**File: `frontend/src/context/AuthContext.jsx`**

#### 1. **Initial State Rehydration**
```javascript
const getInitialAuthState = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    // ... other fields

    if (token && name && email && userId) {
        return {
            token,
            role,
            user: { id, name, email, role, phone, address }
        };
    }
    return { token: null, role: null, user: null };
};
```

**Purpose:** Immediately restore user state from localStorage when the app loads, preventing the "flash of logged-out state" on refresh.

#### 2. **Token Validation**
```javascript
useEffect(() => {
    const validateToken = async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const res = await api.get("/auth/me");
            // Update state with fresh server data
            setUser(res.data);
            setIsAuthenticated(true);
        } catch (error) {
            // Token invalid - logout
            logout();
        }
    };
    validateToken();
}, [token]);
```

**Purpose:** Verify the token is still valid with the backend and get fresh user data.

#### 3. **Login Flow**
```javascript
const login = async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const { token, role, name, id, phone, address } = response.data;

    // Save to localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    // ... other fields

    // Update React state
    setToken(token);
    setUser({ name, email, id, role, phone, address });
    setIsAuthenticated(true);
};
```

**Purpose:** Save authentication data to both localStorage (for persistence) and React state (for immediate use).

#### 4. **Logout Flow**
```javascript
const logout = () => {
    localStorage.clear();  // Clear all stored data
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
};
```

---

## 🛒 Cart Persistence

### How It Works

**File: `frontend/src/context/CartContext.jsx`**

#### 1. **Load Cart on Mount**
```javascript
useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
}, []);
```

#### 2. **Save Cart on Every Change**
```javascript
useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
}, [cart]);
```

#### 3. **Cart Operations**
All cart operations (add, remove, update quantity) automatically trigger the save effect:
```javascript
const addToCart = (product, quantity) => {
    setCart((prevCart) => {
        // ... update logic
    });
    // Automatically saved to localStorage via useEffect
};
```

---

## 🔒 JWT Token Management

### How It Works

**File: `frontend/src/utils/api.js`**

#### 1. **Request Interceptor** (Attach Token)
```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**Purpose:** Automatically attach JWT token to every API request.

#### 2. **Response Interceptor** (Handle Expiration)
```javascript
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired - auto logout
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
```

**Purpose:** Automatically logout and redirect if the token is expired (401 Unauthorized).

---

## 🛡️ Protected Routes

### How It Works

**File: `frontend/src/component/ProtectedRoute.jsx`**

Protected routes check authentication state before rendering:

```javascript
const ProtectedRoute = ({ allowedRoles }) => {
    const { user, role, loading } = useAuth();

    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
```

**Usage in App.jsx:**
```javascript
<Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
    <Route path="/adminpanel" element={<AdminPanel />} />
</Route>
```

---

## 🎯 Key Features

### ✅ No Flash of Logged-Out State
- State is rehydrated **immediately** from localStorage
- User sees their logged-in state instantly on refresh

### ✅ Automatic Token Validation
- Token is validated in the background
- Invalid tokens trigger automatic logout

### ✅ Seamless Cart Experience
- Cart items persist across sessions
- No data loss on refresh

### ✅ Role-Based Access Control
- Admin and user roles persist correctly
- Protected routes work after refresh

### ✅ SPA Behavior
- No full page reloads during navigation
- React Router handles all routing client-side

---

## 📦 localStorage Structure

```javascript
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "role": "USER" | "ADMIN",
    "name": "John Doe",
    "email": "john@example.com",
    "userId": "123",
    "phone": "1234567890",
    "address": "123 Main St",
    "cart": "[{\"id\":1,\"name\":\"Art Piece\",\"price\":1000,\"qty\":2}]"
}
```

---

## 🔄 Complete Flow Example

### Scenario: User Refreshes Browser While Logged In

1. **Browser Refresh** → Page reloads
2. **main.jsx** → Initializes React app with providers
3. **AuthContext** → Reads localStorage and sets initial state
   - `user`, `token`, `role` are immediately available
4. **CartContext** → Reads cart from localStorage
5. **App Renders** → User sees logged-in state (no flash)
6. **Background Validation** → API call to `/auth/me`
   - ✅ Success → Updates user data with fresh info
   - ❌ Failure → Auto-logout and redirect to login
7. **User Continues** → Seamless experience, no re-login needed

---

## 🚀 Testing the Solution

### Test Case 1: User Login Persistence
1. Login as a user
2. Navigate to any page
3. **Refresh the browser (F5 or Ctrl+R)**
4. ✅ User should remain logged in
5. ✅ User data should be visible in navbar
6. ✅ No redirect to login page

### Test Case 2: Admin Login Persistence
1. Login as admin (`admin@gmail.com` / `admin123`)
2. Navigate to `/adminpanel`
3. **Refresh the browser**
4. ✅ Admin should remain logged in
5. ✅ Admin panel should still be accessible
6. ✅ Role-based access should work

### Test Case 3: Cart Persistence
1. Add items to cart
2. **Refresh the browser**
3. ✅ Cart items should still be there
4. ✅ Quantities should be preserved

### Test Case 4: Token Expiration
1. Login successfully
2. Manually expire the token (or wait for expiration)
3. Try to access a protected resource
4. ✅ Should auto-logout and redirect to login

### Test Case 5: Route Persistence
1. Navigate to `/explore`
2. **Refresh the browser**
3. ✅ Should stay on `/explore` page
4. ✅ No redirect to home page

---

## 🛠️ Troubleshooting

### Issue: User gets logged out on refresh
**Solution:** Check if token is being saved to localStorage in login function.

### Issue: Cart is empty after refresh
**Solution:** Verify localStorage is not being cleared unexpectedly.

### Issue: Flash of logged-out state
**Solution:** Ensure `getInitialAuthState()` is being called before component render.

### Issue: 401 errors not triggering logout
**Solution:** Check API interceptor in `utils/api.js`.

---

## 📝 Best Practices Implemented

1. ✅ **localStorage for persistence** - Simple, reliable, client-side storage
2. ✅ **JWT token in Authorization header** - Industry standard
3. ✅ **Automatic token validation** - Security best practice
4. ✅ **Context API for state management** - React recommended approach
5. ✅ **Protected routes** - Role-based access control
6. ✅ **Axios interceptors** - Centralized request/response handling
7. ✅ **No full page reloads** - Pure SPA behavior
8. ✅ **Immediate state rehydration** - Better UX

---

## 🔐 Security Considerations

1. **Token Storage:** JWT stored in localStorage (acceptable for this use case)
   - Alternative: httpOnly cookies (requires backend changes)
2. **Token Expiration:** Backend should set appropriate expiration times
3. **HTTPS:** Always use HTTPS in production to prevent token interception
4. **XSS Protection:** Sanitize all user inputs to prevent XSS attacks

---

## 📚 Files Modified

1. ✅ `frontend/src/context/AuthContext.jsx` - Enhanced state rehydration
2. ✅ `frontend/src/context/CartContext.jsx` - Already has persistence
3. ✅ `frontend/src/utils/api.js` - Enhanced interceptors
4. ✅ `frontend/src/App.jsx` - Cleaned up duplicate providers
5. ✅ `frontend/src/main.jsx` - Already has correct provider setup

---

## 🎉 Summary

Your application now has **production-ready state persistence**! Users can:
- ✅ Refresh the browser without losing their session
- ✅ Close and reopen the browser (session persists)
- ✅ Navigate freely without losing cart data
- ✅ Access protected routes after refresh
- ✅ Experience seamless SPA behavior

**No more login prompts after page refresh!** 🚀
