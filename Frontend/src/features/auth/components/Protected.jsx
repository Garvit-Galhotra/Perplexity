import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router";

const Protected = ({ children }) => {
  const loading = useSelector((state) => state.auth.loading);
  const user = useSelector((state) => state.auth.user);

  if (loading) {
    return <div>Loading.......</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
