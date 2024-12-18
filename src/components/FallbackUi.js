import { Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const FallbackUi = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/login");
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
        textAlign: "center",
        backgroundColor: "#f9f9f9",
        padding: 4,
      }}
    >
      <Typography variant="h3" color="primary" gutterBottom>
        404 - Page Not Found
      </Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        Oops! The page you are looking for does not exist.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ marginTop: 2 }}
        onClick={handleGoHome}
      >
        Go Back to Home
      </Button>
    </Container>
  );
};

export default FallbackUi;
