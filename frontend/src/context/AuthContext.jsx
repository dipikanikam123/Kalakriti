import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const AuthContext = createContext();

// Helper function to get initial state from localStorage
const getInitialAuthState = () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const userId = localStorage.getItem("userId");
    const phone = localStorage.getItem("phone");
    const address = localStorage.getItem("address");

    // If we have token and basic user info, rehydrate the user state
    if (token && name && email && userId) {
        return {
            token,
            role,
            user: {
                id: userId,
                name,
                email,
                role,
                phone: phone || "",
                address: address || ""
            }
        };
    }

    return { token: null, role: null, user: null };
};

export const AuthProvider = ({ children }) => {
    // Initialize state from localStorage to prevent flash of logged-out state
    const initialState = getInitialAuthState();

    const [user, setUser] = useState(initialState.user);
    const [token, setToken] = useState(initialState.token);
    const [role, setRole] = useState(initialState.role);
    const [loading, setLoading] = useState(!!initialState.token); // Only load if we have a token
    const [isAuthenticated, setIsAuthenticated] = useState(!!initialState.token);

    useEffect(() => {
        // Validate token and fetch fresh user details from server
        const validateToken = async () => {
            // Only validate if we have a token
            if (!token) {
                setLoading(false);
                setIsAuthenticated(false);
                return;
            }

            try {
                const res = await api.get("/auth/me");
                const { name, email, role, id, phone, address } = res.data;

                // Update state with fresh data from server
                const userData = { name, email, role, id, phone, address };
                setUser(userData);
                setRole(role);
                setIsAuthenticated(true);

                // Sync localStorage with fresh data
                localStorage.setItem("role", role);
                localStorage.setItem("name", name);
                localStorage.setItem("userId", id);
                localStorage.setItem("email", email);
                localStorage.setItem("phone", phone || "");
                localStorage.setItem("address", address || "");
            } catch (error) {
                console.error("Token validation failed:", error);
                // Token is invalid, clear everything
                logout();
            } finally {
                setLoading(false);
            }
        };

        validateToken();
    }, [token]); // Re-validate when token changes

    const login = async (email, password) => {
        try {
            const response = await api.post("/auth/login", { email, password });
            if (response.status === 200) {
                const { token, role, name, id, phone, address } = response.data;

                // Save to localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("role", role);
                localStorage.setItem("name", name);
                localStorage.setItem("userId", id);
                localStorage.setItem("email", email);
                localStorage.setItem("phone", phone || "");
                localStorage.setItem("address", address || "");

                // Update state
                setToken(token);
                setRole(role);
                setUser({ name, email, id, role, phone, address });
                setIsAuthenticated(true);

                return { success: true, role };
            }
        } catch (error) {
            console.error("Login failed:", error);
            return {
                success: false,
                message: error.response?.data?.message || "Login failed"
            };
        }
    };

    const googleLogin = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Clear all localStorage
        localStorage.clear();

        // Reset all state
        setToken(null);
        setRole(null);
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (updatedData) => {
        try {
            await api.put(`/users/${user.id}`, updatedData);

            // Update local state
            const newUser = { ...user, ...updatedData };
            setUser(newUser);

            // Update localStorage
            if (updatedData.name) localStorage.setItem("name", updatedData.name);
            if (updatedData.phone) localStorage.setItem("phone", updatedData.phone);
            if (updatedData.address) localStorage.setItem("address", updatedData.address);

            return { success: true };
        } catch (error) {
            console.error("Update failed:", error);
            return { success: false, message: "Update failed" };
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                isAuthenticated,
                login,
                googleLogin,
                logout,
                updateProfile,
                loading
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
