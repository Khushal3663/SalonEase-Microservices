import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { jwt, user, role, isInitialized } = useSelector((state) => state.auth);
  const location = useLocation();

  // 1. If we have a local token but Redux hasn't finished loading the profile,
  // hold the user here with a smooth loading spinner.
  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <CircularProgress color="success" />
      </div>
    );
  }

  // 2. If the auth check is completely finished and no token is present, route to login
  if (!jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role || role;

  // 3. Verify user roles securely
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  // 4. Passed authorization checks successfully
  return children;
};

export default ProtectedRoute;
