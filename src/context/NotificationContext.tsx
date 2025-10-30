// src/context/NotificationContext.tsx
"use client";

import React, { createContext, useContext, useState } from "react";

export interface Notification {
  id: string;
  message: string;
  type?: "success" | "warning";
}

interface NotificationContextType {
  notify: (message: string, type?: "success" | "warning") => void;
  notifications: Notification[];
  remove: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notify: () => {},
  notifications: [],
  remove: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const notify = (message: string, type: "success" | "warning" = "success") => {
    const newNoti = { id: Date.now().toString(), message, type };
    setNotifications((prev) => [newNoti, ...prev]);
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ notify, notifications, remove }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
