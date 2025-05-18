import { JSX } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isLoggedIn = !!localStorage.getItem("token"); // or "token"
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}
