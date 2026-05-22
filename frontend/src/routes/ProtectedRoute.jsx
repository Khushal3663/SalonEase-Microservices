import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { jwt, user, role: initialRole } = useSelector((state) => state.auth);
  const location = useLocation();

  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    // Give the app 800ms to settle down, fetch the profile, and update Redux
    const timer = setTimeout(() => {
      setIsSyncing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [jwt]);

  // 1. If it's booting up, just show the spinner and hold the gates closed
  if (isSyncing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress color="success" />
      </div>
    );
  }

  // 2. If no token, kick to login
  if (!jwt) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const currentRole = user?.role || initialRole;

  // 3. Check roles safely
  if (allowedRoles && !allowedRoles.includes(currentRole)) {
    return <Navigate to="/" replace />;
  }

  // Let them pass
  return children;
};

export default ProtectedRoute;
