import { useState, useEffect } from "react";
import { TextField, Button, Container, Typography, Snackbar, Alert, Box } from "@mui/material";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import companyLogo from "../assets/images/companyLogo.jpg";

const RegisterPage = () => {
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [error, setError] = useState(""); 
  const [showToast, setShowToast] = useState(false); 
  const [passwordMatch, setPasswordMatch] = useState(true); 
  const navigate = useNavigate();

  // debouncing implemented for password check
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPasswordMatch(password === confirmPassword); 
    }, 500);

    return () => clearTimeout(timeout);
  }, [password, confirmPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordMatch) {
      setError("Passwords do not match.");
      setShowToast(true);
      return; 
    }
    try {
      await createUserWithEmailAndPassword(auth, email, password); // Firebase registration
      navigate("/");
    } catch (err) {
      setError("Failed to register. Please try again.");
      setShowToast(true); 
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100%",
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
        Register
      </Typography>
      {error && (
        <Snackbar
          open={showToast}
          autoHideDuration={4000}
          onClose={() => setShowToast(false)} 
        >
          <Alert severity="error" onClose={() => setShowToast(false)}>
            {error}
          </Alert>
        </Snackbar>
      )}
      <Box component="form" onSubmit={handleRegister} sx={{ width: "100%" }}>
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
        <TextField
          label="Confirm Password"
          type="password"
          fullWidth
          margin="normal"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          error={!passwordMatch} 
          helperText={!passwordMatch ? "Passwords do not match." : ""} 
          variant="outlined"
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
        >
          Register
        </Button>
        <Button
          onClick={() => navigate("/")}
          fullWidth
          sx={{ mt: 2, py: 1.5, fontWeight: 600 }}
        >
          Back to Login
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;
