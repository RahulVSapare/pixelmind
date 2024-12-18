import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import FallbackUi from "../components/FallbackUi";
import { Box, CircularProgress } from "@mui/material";

const Gallery = React.lazy(() => import("../pages/Gallery"));
const Login = React.lazy(() => import("../pages/Login"));
const Register = React.lazy(() => import("../pages/Register"));

function RoutesPage() {
  const isAuthenticated = !!localStorage.getItem("jwtToken");

  return (
    <Router>
      <Suspense
        fallback={
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <Navigate to="/image-gallery" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/image-gallery" /> : <Login />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/image-gallery" /> : <Register />
            }
          />
          <Route
            path="/image-gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<FallbackUi />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default RoutesPage;
