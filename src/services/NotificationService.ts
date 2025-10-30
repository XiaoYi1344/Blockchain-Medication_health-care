"use client";

import axios from "axios";
import { getCookie } from "cookies-next";

const API_BASE = process.env.NEXT_PUBLIC_BE_API_BASE;

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Cache-Control": "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const token = getCookie("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface Notification {
  _id?: string;
  title?: string;
  message?: string;
  type?: "system" | "complaint" | "inventory" | "order" | "shipment" | "license" | "other";
  relatedEntityType?: "order" | "shipment" | "license" | "complaint" | "inventory" | "other";
  relatedEntityId?: string;
  isRead?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const notificationService = {
  async getAllNotification(): Promise<Notification[]> {
    const res = await api.get("/notification/get-all");
    return Array.isArray(res.data.data) ? res.data.data : [];
  },
  
  async markAsRead(notificationId: string | string[]): Promise<void> {
    // Accept either a single ID or an array of IDs
    const ids = Array.isArray(notificationId) ? notificationId : [notificationId];

    await api.put("/notification", {
      notificationIds: ids,
    });
  },
};

