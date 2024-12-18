import { AppBar, Button, Toolbar, Typography, Box } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out from Firebase
      localStorage.removeItem("jwtToken"); // Removing token from localStorage
      navigate("/"); 
    } catch (error) {
      console.error("Logout failed:", error); 
    }
  };

  return (
    <AppBar position="sticky" color="primary" sx={{ boxShadow: 3 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingX: 3 }}>
        <Box display="flex" alignItems="center">
          <Typography variant="h5" component="div" sx={{ fontWeight: "bold", letterSpacing: 1 }}>
            Pixelmind
          </Typography>
        </Box>

        <Box>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={handleLogout} 
            sx={{
              fontWeight: 600,
              paddingX: 3,
              paddingY: 1.2,
              fontSize: "16px",
              borderRadius: 2,
              "&:hover": {
                backgroundColor: "#474E93", 
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
