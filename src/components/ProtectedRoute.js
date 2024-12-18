import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = !!localStorage.getItem("jwtToken"); 

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
