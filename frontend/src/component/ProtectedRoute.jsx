import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, token, role, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid"></div>
            </div>
        );
    }

    // If not logged in, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // If roles are defined and user doesn't have permissions
    if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to home or user dashboard if unauthorized
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
