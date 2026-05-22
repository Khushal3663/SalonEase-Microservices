import {
  AccountBalanceWallet,
  AccountBox,
  Add,
  Dashboard,
  Inventory,
  Logout,
  NotificationsOutlined,
  Receipt,
  ShoppingBag,
} from "@mui/icons-material";
import CategoryIcon from "@mui/icons-material/Category";
import React from "react";
import DrawerList from "../../adminSalon/DrawerList";
import { logout } from "../../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const menu = [
  {
    name: "Dashboard",
    path: "/salon-dashboard",
    icon: <Dashboard className="text-primary" />,
    activeIcon: <Dashboard className="text-secondary" />,
  },
  {
    name: "Bookings",
    path: "/salon-dashboard/bookings",
    icon: <ShoppingBag className="text-primary" />,
    activeIcon: <ShoppingBag className="text-secondary" />,
  },
  {
    name: "Services",
    path: "/salon-dashboard/services",
    icon: <Inventory className="text-primary" />,
    activeIcon: <Inventory className="text-secondary" />,
  },
  {
    name: "Add Services",
    path: "/salon-dashboard/add-services",
    icon: <Add className="text-primary" />,
    activeIcon: <Add className="text-secondary" />,
  },
  {
    name: "Payment",
    path: "/salon-dashboard/payment",
    icon: <AccountBalanceWallet className="text-primary" />,
    activeIcon: <AccountBalanceWallet className="text-secondary" />,
  },
  {
    name: "Transaction",
    path: "/salon-dashboard/transaction",
    icon: <Receipt className="text-primary" />,
    activeIcon: <Receipt className="text-secondary" />,
  },
  {
    name: "Category",
    path: "/salon-dashboard/category",
    icon: <CategoryIcon className="text-primary" />,
    activeIcon: <CategoryIcon className="text-secondary" />,
  },
  {
    name: "Notifications",
    path: "/salon-dashboard/notifications",
    icon: <NotificationsOutlined className="text-primary" />,
    activeIcon: <NotificationsOutlined className="text-secondary" />,
  },
];

const SalonDrawerList = ({ toggleDrawer }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());

    // navigate("/", { replace: true });
    window.location.href = "/";
  };

  const menu2 = [
    {
      name: "Account",
      path: "/salon-dashboard/account",
      icon: <AccountBox className="text-primary" />,
      activeIcon: <AccountBox className="text-secondary" />,
    },
    {
      name: "Logout",
      action: handleLogout,
      icon: <Logout className="text-primary" />,
      activeIcon: <Logout className="text-secondary" />,
    },
  ];

  return (
    <div className="h-full">
      <DrawerList menu={menu} menu2={menu2} toggleDrawer={toggleDrawer} />
    </div>
  );
};

export default SalonDrawerList;
