import {
  AccountCircle,
  NotificationsActive,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile, logout } from "../../redux/authSlice";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isDashboard = location.pathname.includes("salon-dashboard");

  const { jwt, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notification);

  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const toggleDrawer = (open) => () => setMobileOpen(open);

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate("/");
  };

  useEffect(() => {
    if (jwt) {
      dispatch(getUserProfile());
    }
  }, [jwt, dispatch]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Become Partner", path: "/become-partner" },
  ];

  console.log(user);

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm px-4 md:px-10 flex items-center justify-between py-3">
      {/* LEFT: Logo and Desktop Links */}
      <div className="flex items-center gap-8">
        <h1
          onClick={() => navigate("/")}
          className="cursor-pointer font-bold text-xl md:text-2xl text-green-700"
        >
          SalonEase
        </h1>
        {!isMobile && (
          <div className="flex items-center gap-6 text-gray-600 font-medium">
            <span
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-green-700"
            >
              Home
            </span>
          </div>
        )}
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-2 md:gap-4">
        {!isMobile && !isDashboard && (!user || user.role === "USER") && (
          <Button
            onClick={() => navigate("/become-partner")}
            variant="outlined"
            size="small"
          >
            Become partner
          </Button>
        )}

        {/* Show 'Dashboard' link for Salon Owners so they can easily navigate back */}
        {user?.role === "SALON_OWNER" && !isDashboard && !isMobile && (
          <Button
            onClick={() => navigate("/salon-dashboard")}
            variant="contained"
            color="success"
            size="small"
          >
            Dashboard
          </Button>
        )}

        <IconButton onClick={() => navigate("/notifications")}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActive className="text-gray-600" />
          </Badge>
        </IconButton>

        {user?.id ? (
          <div className="flex items-center gap-2">
            {!isMobile && (
              <span className="font-semibold">
                {user.fullName.split(" ")[0]}
              </span>
            )}
            <IconButton onClick={handleClick}>
              <Avatar
                sx={{
                  bgcolor: "green",
                  color: "white",
                  width: isMobile ? 28 : 32,
                  height: isMobile ? 28 : 32,
                  fontSize: isMobile ? "0.8rem" : "1rem",
                }}
              >
                {user?.fullName[0].toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
              <MenuItem
                onClick={() => {
                  navigate("/bookings");
                  handleClose();
                }}
              >
                My Bookings
              </MenuItem>
              {user.role === "SALON_OWNER" && (
                <MenuItem
                  onClick={() => {
                    navigate("/salon-dashboard");
                    handleClose();
                  }}
                >
                  Dashboard
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {!isMobile ? (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  variant="text"
                  color="inherit"
                  className="text-gray-600 font-medium capitalize"
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  variant="contained"
                  color="success"
                  size="small"
                  className="capitalize"
                  sx={{ borderRadius: "6px" }}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <Button
                onClick={() => navigate("/login")}
                size="small"
                color="success"
                variant="text"
                className="font-semibold text-sm"
              >
                Login
              </Button>
            )}
          </div>
        )}

        {/* Mobile Menu Toggle */}
        {isMobile && (
          <IconButton onClick={toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}
      </div>

      {/* Mobile Sidebar Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer(false)}>
        <div className="w-64 p-5" onClick={toggleDrawer(false)}>
          <div>
            <h2 className="font-bold text-lg mb-4 border-b pb-2">Menu</h2>
            <List>
              {navLinks.map((link) => (
                <ListItem
                  button
                  key={link.label}
                  onClick={() => navigate(link.path)}
                >
                  <ListItemText primary={link.label} />
                </ListItem>
              ))}
              {user?.role === "SALON_OWNER" && (
                <ListItem button onClick={() => navigate("/salon-dashboard")}>
                  <ListItemText primary="Salon Dashboard" />
                </ListItem>
              )}
            </List>
          </div>
          <div className="mt-auto pt-4 border-t space-y-2">
            {user?.id ? (
              <Button
                fullWidth
                variant="outlined"
                color="error"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  fullWidth
                  variant="outlined"
                  color="success"
                  onClick={() => navigate("/login")}
                  sx={{ mb: 1 }}
                >
                  Login
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => navigate("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </nav>
  );
};

export default Navbar;
