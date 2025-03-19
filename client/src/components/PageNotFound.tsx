import { Typography, Container } from "@mui/material";

const PageNotFound = () => {
  return (
    <Container sx={{ textAlign: "center", mt: 5 }}>
      <Typography variant="h3" color="error">
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" sx={{ mt: 2 }}>
        The page you are looking for does not exist.
      </Typography>
    </Container>
  );
};

export default PageNotFound;
