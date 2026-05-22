import { NotificationsActive } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import Badge from "@mui/material/Badge";
import MenuIcon from "@mui/icons-material/Menu";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ DrawerList: DrawerContent }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  return (
    <div className="h-[10vh] flex items-center justify-between px-5 border-b bg-white sticky top-0 z-50">
      <div className="flex items-center gap-3">
        {/* Toggle only on mobile/tablet if preferred, or keep for all */}
        <IconButton onClick={handleDrawerOpen}>
          <MenuIcon color="primary" />
        </IconButton>
        <h1 className="text-xl cursor-pointer font-bold text-green-800">
          SalonEase
        </h1>
      </div>

      <IconButton onClick={() => navigate("/salon-dashboard/notifications")}>
        <Badge badgeContent={4} color="error">
          <NotificationsActive color="primary" />
        </Badge>
      </IconButton>

      <Drawer anchor="left" open={open} onClose={handleDrawerClose}>
        <div className="w-[280px]">
          <DrawerContent toggleDrawer={handleDrawerClose} />
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar;
