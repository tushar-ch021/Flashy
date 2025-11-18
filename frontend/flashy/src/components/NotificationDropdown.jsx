import React, { useEffect, useState } from "react";
import { useChat } from "../hooks/useChat";
import { useSelector, useDispatch } from "react-redux";
import { addNotification } from "../redux/notificationSlice";

const NotificationDropdown = () => {
  const { userData } = useSelector((state) => state.user);
  const [notifications, setNotifications] = useState([]);
  const chat = useChat(userData?._id);
  const dispatch = useDispatch()

  useEffect(() => {
    if (!userData?._id) return
    chat.onNotification((notif) => {
      setNotifications((prev) => [notif, ...prev]);
      dispatch(addNotification(notif))
    });
  }, [userData?._id]);

  return (
    <div  className="notification-dropdown absolute left-0 mt-2 w-80 min-h-[200px] rounded-lg overflow-hidden bg-white shadow z-50">
      <ul className="p-3">
        {notifications?.length === 0 && <li className="text-sm text-gray-500">No notifications</li>}
        {notifications?.map((n, i) => (
          <li key={i} className="py-2 border-b last:border-b-0">{n.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
