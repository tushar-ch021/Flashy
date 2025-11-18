import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { serverUrl } from "../App";

export const useChat = (userId) => {
  const socket = useRef();

  useEffect(() => {
    if (!userId) return;
    // derive socket base from serverUrl (http://host:port)
    socket.current = io(serverUrl.replace(/\/$/, ""));
    socket.current.emit("join", userId);
    return () => {
      socket.current && socket.current.disconnect();
    };
  }, [userId]);

  const sendMessage = (to, message) => {
    if (!socket.current) return;
    socket.current.emit("sendMessage", { to, message, from: userId });
  };

  const onMessage = (callback) => {
    socket.current && socket.current.on("receiveMessage", callback);
  };

  const onNotification = (callback) => {
    socket.current && socket.current.on("notification", callback);
  };

  return { sendMessage, onMessage, onNotification };
};
