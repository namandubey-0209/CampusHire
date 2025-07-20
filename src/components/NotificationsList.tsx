"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle, Circle, Trash2 } from "lucide-react";
import axios from "axios";

interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsList() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/notifications")
      .then((res) => {
        if (res.data.success) setNotifications(res.data.notifications);
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Failed to delete notification:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-gray-600">You have no notifications.</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              n.isRead ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200"
            } hover:shadow-sm transition`}
          >
            <div
              className="flex items-center space-x-3 text-gray-800 cursor-pointer"
              onClick={() => markAsRead(n._id)}
            >
              {n.isRead ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-blue-600" />
              )}
              <span>{n.message}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </span>
              <button
                onClick={() => deleteNotification(n._id)}
                className="text-red-500 hover:text-red-700"
                title="Delete notification"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
