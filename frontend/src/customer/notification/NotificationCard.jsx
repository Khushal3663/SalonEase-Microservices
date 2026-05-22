import { Card, Box, Typography, IconButton } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CircleIcon from "@mui/icons-material/Circle";
import { useDispatch } from "react-redux";
import { markNotificationAsRead } from "../../redux/notificationSlice";
import { formatDistanceToNow } from "date-fns";

const NotificationCard = ({ notification }) => {
  const dispatch = useDispatch();

  // Safely extract data from the nested structure
  const booking = notification.booking;
  const salon = booking?.salon;

  const handleReadNotification = () => {
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification.id));
    }
  };

  const timeAgo = notification.createdAt
    ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })
    : "";

  return (
    <Card
      onClick={handleReadNotification}
      elevation={0}
      sx={{
        border: "1px solid #f0f0f0",
        transition: "all 0.2s",
        "&:hover": { bgcolor: "#f9fafb" },
        bgcolor: notification.isRead ? "white" : "#f0fdf4",
        borderLeft: notification.isRead
          ? "4px solid #e5e7eb"
          : "4px solid #15803d",
      }}
      className="cursor-pointer p-4 flex items-start gap-4 mb-3"
    >
      <Box className="mt-1">
        <div
          className={`p-2 rounded-full ${notification.isRead ? "bg-gray-100 text-gray-400" : "bg-green-100 text-green-700"}`}
        >
          <NotificationsActiveIcon fontSize="small" />
        </div>
      </Box>

      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            {/* Show Salon Name as the Primary Header */}
            {salon?.name && (
              <Typography
                variant="subtitle2"
                className="text-green-800 font-bold uppercase tracking-wider text-[10px]"
              >
                {salon.name}
              </Typography>
            )}
            <Typography
              variant="body1"
              className={`${notification.isRead ? "text-gray-600" : "font-semibold text-gray-900"}`}
            >
              {notification.description}
            </Typography>
          </div>
          {!notification.isRead && (
            <CircleIcon sx={{ fontSize: 10, color: "#15803d" }} />
          )}
        </div>

        {/* New Informational Row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <Typography variant="caption" className="text-gray-400">
            {timeAgo}
          </Typography>

          {/* Booking Status Badge */}
          {booking?.status && (
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                booking.status === "CONFIRMED"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {booking.status}
            </span>
          )}

          {/* Location Info */}
          {salon?.city && (
            <span className="text-[10px] text-gray-500 italic">
              • {salon.city}
            </span>
          )}

          {/* Price Info */}
          {booking?.totalPrice && (
            <span className="text-[10px] font-bold text-gray-700 ml-auto">
              ₹{booking.totalPrice}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
};

export default NotificationCard;
