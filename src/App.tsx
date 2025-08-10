import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/home/home";
import "./App.css";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import { useState } from "react";
import Toast from "./components/toast";
import { LoaderProvider } from "./context/loader_context";
import { setToastSetter } from "./utils/toast";
import { AuthProvider } from "./context/auth_context";
import ProtectedRoute from "./protected_route";
import UnprotectedRoute from "./unprotected_route";

export default function App(){
  
  const [toast,setToast]=useState<{
    msg:string|null,
    backgroundColor?:string|null,
    color?:string|null,
  }>({
    msg:null,
    backgroundColor:null,
    color:null,
  });
  setToastSetter(setToast);
  return (
    <LoaderProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={
            <UnprotectedRoute>
              <Login />
            </UnprotectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/register" element={
            <UnprotectedRoute>
              <Register />
            </UnprotectedRoute>
          } />
        </Routes>
        
        {(toast.msg)&&<Toast 
            message={toast.msg} 
            backgroundColor={toast.backgroundColor || undefined}
            color={toast.color || undefined}
        />}
      </AuthProvider>
    </LoaderProvider>
  );
}