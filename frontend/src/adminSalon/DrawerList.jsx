import { Divider, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DrawerList = ({ menu, menu2, toggleDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = (item) => {
    // 1. Prioritize executing the custom callback if it exists (e.g., Logout)
    if (typeof item.action === "function") {
      console.log(`Executing custom action for: ${item.name}`);
      item.action();

      // Close the drawer overlay seamlessly
      if (typeof toggleDrawer === "function") {
        toggleDrawer();
      }
      return; // EXIT EARLY so it does not touch standard navigation logic below!
    }

    // 2. Fallback to standard navigation if a path is provided
    if (item.path) {
      console.log(`Navigating to: ${item.path}`);
      navigate(item.path);

      if (typeof toggleDrawer === "function") {
        toggleDrawer();
      }
    } else {
      console.warn(
        `Menu item "${item.name}" has neither an action nor a valid path.`,
      );
    }
  };

  return (
    <div className="flex flex-col justify-between h-full w-[300px] border-r py-5 bg-white">
      <div className="space-y-2">
        {menu.map((item) => {
          // Check if current path matches exactly or starts with item path (for sub-routes)
          const isActive = location.pathname === item.path;

          return (
            <div
              key={item.name}
              onClick={() => handleClick(item)}
              // pr-4 ensures the pill doesn't touch the very edge of the divider/content
              className="w-full pr-4 cursor-pointer"
            >
              <div
                className={`flex items-center px-6 py-3 rounded-r-full transition-all duration-200 ${
                  isActive
                    ? "bg-green-700 text-white shadow-md" // Your "pill" look
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Menu (Account/Logout) */}
      <div className="pb-5">
        <Divider className="mb-4" />
        {menu2.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div
              key={item.name}
              onClick={() => handleClick(item)}
              className="pr-4 cursor-pointer"
            >
              <div
                className={`flex items-center px-6 py-3 rounded-r-full ${isActive ? "bg-green-700 text-white" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <ListItemIcon sx={{ minWidth: "40px", color: "inherit" }}>
                  {isActive ? item.activeIcon : item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DrawerList;
