import { logoutUser } from "../services/authServices"
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Divider, Snackbar, IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Close } from '@mui/icons-material'

const drawerWidth = 240;

const Dashboard = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const navigate = useNavigate();
     const menuItems = [
       { text: "Home", path: "/dashboard/home" },
       { text: "Customers", path: "/dashboard/customers" },
       { text: "Products", path: "/dashboard/products" },
       { text: "Sales", path: "/dashboard/sales" },
     ];
    const handleLogout = async() => {
        await logoutUser()
        localStorage.setItem('logout success', 'Logout Successfull')
        console.log('loged out')
    }

useEffect(() => {
  const message = localStorage.getItem("loginSuccessMessage");
  if (message) {
    setSnackbarMessage(message);
    setOpenSnackbar(true);
    localStorage.removeItem("loginSuccessMessage");
  }
}, []);

    return (
    <Box sx={{ display: "flex", bgcolor: "#f4f6f9", height: "100vh" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#f8f9fa",
          },
        }}
      >
        <AppBar position="relative">
          <Toolbar sx={{ bgcolor: "#34495e" }}>
            <Typography variant="h6" noWrap component="div">
              Stock Nest
            </Typography>
          </Toolbar>
        </AppBar>
        <List
          sx={{
            mt: 1,
            // px: 1,
            gap: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {menuItems.map((item) => (
            <ListItem
              component="button"
              key={item.text}
              onClick={() => navigate(item.path)}
              sx={{
                cursor: "pointer",
                textAlign: "left",
                width: "100%",
                border: "none",
                background: "none",
                py: 1,
              }}
            >
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <ListItem
            component="button"
            onClick={handleLogout}
            sx={{
              cursor: "pointer",
              textAlign: "left",
              width: "100%",
              border: "none",
              background: "none",
            }}
          >
            <ListItemText primary={"Logout"} />
          </ListItem>
        </List>
      </Drawer>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, ml: `${drawerWidth}px`, mt: 0 }}
      >
        <Outlet />
      </Box>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
        autoHideDuration={2000}
        action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={() => setOpenSnackbar(false)}>
            <Close fontSize="small" />
          </IconButton>
        }
      />
    </Box>
  );
}

export default Dashboard;
