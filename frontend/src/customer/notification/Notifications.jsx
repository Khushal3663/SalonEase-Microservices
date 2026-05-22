import React from "react";
import NotificationCard from "./NotificationCard";
import { useSelector } from "react-redux";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

const Notifications = () => {
  // We pull notifications from the global state managed by your DataLoader/WebSocketManager
  const { notifications } = useSelector((state) => state.notification);

  return (
    <div className="px-5 flex flex-col items-center mt-10 min-h-screen">
      <h1 className="text-3xl font-bold py-5 text-green-700">Notifications</h1>
      <div className="w-full md:w-[40rem] max-h-[75vh] overflow-y-auto px-2 space-y-1">
        {notifications && notifications.length > 0 ? (
          [...notifications]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((n) => <NotificationCard key={n.id} notification={n} />)
        ) : (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
            <NotificationsNoneIcon sx={{ fontSize: 80 }} />
            <p className="text-xl font-medium">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
