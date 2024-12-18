import { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  CircularProgress,
  Divider,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import companyLogo from "../assets/images/companyLogo.jpg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastSeverity, setToastSeverity] = useState("success");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password); // Firebase login attempt
      const user = auth.currentUser;
      const idToken = await user.getIdToken(); // Get the token from Firebase
      localStorage.setItem("jwtToken", idToken); // Store token in localStorage
      setToastMessage("Successfully logged in!");
      setToastSeverity("success");
      setToastOpen(true);
      setTimeout(() => navigate("/image-gallery"), 1000);
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      setToastMessage("Failed to login. Please check your credentials.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");
    try {
      const result = await signInWithPopup(auth, provider); // Google login attempt
      const user = result.user;
      const idToken = await user.getIdToken(); // Get token from Google login
      localStorage.setItem("jwtToken", idToken);
      setToastMessage("Successfully logged in with Google!");
      setToastSeverity("success");
      setToastOpen(true);
      setTimeout(() => navigate("/image-gallery"), 1000);
    } catch (err) {
      setError("Failed to login with Google.");
      setToastMessage("Failed to login with Google.");
      setToastSeverity("error");
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleToastClose = (event, reason) => {
    if (reason === "clickaway") return;
    setToastOpen(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#f9f9f9",
        padding: 4,
        borderRadius: 2,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ mb: 2 }}>
        <img
          src={companyLogo}
          alt="Pixelmind"
          style={{ width: "100%", maxWidth: "80px", objectFit: "contain" }}
        />
      </Box>
      <Typography variant="h4" align="center" gutterBottom>
        Login
      </Typography>
      {error && (
        <Typography
          color="error"
          sx={{ mb: 2, fontWeight: 500, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
      <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={loading}
          sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
        <Divider sx={{ my: 3 }}>OR</Divider>
        <Button
          onClick={handleGoogleLogin}
          variant="outlined"
          fullWidth
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: 1.5,
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            <>
              <GoogleIcon size={24} style={{ marginRight: 8 }} /> Login with
              Google
            </>
          )}
        </Button>
        <Button
          onClick={() => navigate("/register")}
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
        >
          Register
        </Button>
      </Box>

      <Snackbar
        open={toastOpen}
        autoHideDuration={3000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleToastClose}
          severity={toastSeverity}
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default LoginPage;
