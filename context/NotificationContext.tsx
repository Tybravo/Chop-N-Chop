"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://afia-a2le.onrender.com";

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  category: string;
  isRead: boolean;
  createdAt: string;
};

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  registerDeviceToken: (token: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Helper to get auth token
  const getToken = () => typeof window !== "undefined" ? localStorage.getItem("chopnchop_token") : null;

  // --- Initial Fetch ---
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        // Fetch all chronological notifications
        const listRes = await fetch(`${API_BASE_URL}/api/v1/notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (listRes.ok) {
          const data = await listRes.json();
          setNotifications(data);
        }

        // Fetch unread count badge
        const countRes = await fetch(`${API_BASE_URL}/api/v1/notifications/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (countRes.ok) {
          const countData = await countRes.json();
          setUnreadCount(countData.unreadCount);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // --- Real-Time SSE Subscription ---
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    // Connect to the Server-Sent Events stream
    // Note: Standard EventSource does not support passing Authorization headers easily. 
    // Sending the token as a query parameter is the standard workaround for SSE.
    const eventSource = new EventSource(`${API_BASE_URL}/api/v1/notifications/stream?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const newNotification: AppNotification = JSON.parse(event.data);
        
        // Prepend new notification and increment unread count
        setNotifications((prev) => [newNotification, ...prev]);
        setUnreadCount((prev) => prev + 1);
        
        // Optional: Trigger a browser/system notification here if permitted
      } catch (err) {
        console.error("Error parsing real-time notification:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE Connection Error:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  // --- Actions ---

  const markAsRead = async (id: string) => {
    // Optimistic UI update
    setNotifications((prev) => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    setUnreadCount((prev) => Math.max(0, prev - 1));

    const token = getToken();
    if (!token) return;

    try {
      // Flag specific notification as read by UUID
      await fetch(`${API_BASE_URL}/api/v1/notifications/${id}/read`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Revert optimistic update here if necessary
    }
  };

  const markAllAsRead = async () => {
    // Optimistic UI update
    setNotifications((prev) => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);

    const token = getToken();
    if (!token) return;

    try {
      // Clears all unread notification badges
      await fetch(`${API_BASE_URL}/api/v1/notifications/read-all`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const registerDeviceToken = async (fcmToken: string) => {
    const token = getToken();
    if (!token) return;

    try {
      // Register a mobile device token for push notifications
      await fetch(`${API_BASE_URL}/api/v1/notifications/devices`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ token: fcmToken })
      });
    } catch (error) {
      console.error("Failed to register device token:", error);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, registerDeviceToken }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};