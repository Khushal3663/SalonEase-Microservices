import { Client } from "@stomp/stompjs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import { addNotification } from "../redux/notificationSlice";
import { useSnackbar } from "../snackbar/SnackbarContext";
import { API_BASE_URL } from "../config/api";

const WebSocketManager = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { salon } = useSelector((state) => state.salon);

  const showMessage = useSnackbar();

  useEffect(() => {
    if (!user?.id) return;

    const socket = new SockJS(`${API_BASE_URL}/api/notifications/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    client.onConnect = (frame) => {
      // 1. Subscribe to User Topic
      client.subscribe(`/notifications/user/${user.id}`, (message) => {
        const newNotification = JSON.parse(message.body);
        dispatch(addNotification(newNotification)); // Updates Redux state globally
        showMessage(
          newNotification.description || "New notification received!",
          "info",
        );
      });

      // 2. Subscribe to Salon Topic if applicable
      if (user.role === "SALON_OWNER" && salon?.id) {
        client.subscribe(`/notifications/salon/${salon.id}`, (message) => {
          const newNotification = JSON.parse(message.body);
          dispatch(addNotification(newNotification));
          showMessage(`Salon: ${newNotification.description}`, "success");
        });
      }
    };

    client.activate();

    return () => {
      if (client.active) client.deactivate();
    };
  }, [user?.id, salon?.id, dispatch, showMessage]);

  return null; // This component doesn't render anything, it just listens
};

export default WebSocketManager;
