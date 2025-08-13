import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "./context/auth_context";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user,authChecked} = useAuthContext();

  if (authChecked && !user){
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
