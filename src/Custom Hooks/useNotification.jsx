// useNotification.js
import { useState, useCallback } from "react";
import "./Notification.css";

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, color = "gray") => {
    setNotification({ message, color });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  }, []);

  const Notification = () =>
    notification ? (
      <div className={`notification notification-${notification.color}`}>
        {notification.message}
      </div>
    ) : null;

  return { showNotification, Notification };
};
