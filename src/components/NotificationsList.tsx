"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Bell, CheckCircle, Circle } from "lucide-react";

interface Notification {
  _id: string;
  message: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export default function NotificationsList() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications")
      .then(res => res.json())
      .then(data => {
        if (data.success) setNotifications(data.notifications);
      })
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PUT" });
    setNotifications(notifications.map(n =>
      n._id === id ? { ...n, read: true } : n
    ));
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
        notifications.map(n => (
          <div
            key={n._id}
            className={`flex items-center justify-between p-4 rounded-lg border ${
              n.read ? "bg-gray-50 border-gray-200" : "bg-white border-blue-200"
            } hover:shadow-sm transition`}
          >
            <a
              href={n.link}
              onClick={() => markAsRead(n._id)}
              className="flex items-center space-x-3 text-gray-800 hover:text-blue-600"
            >
              {n.read
                ? <CheckCircle className="h-5 w-5 text-green-500" />
                : <Circle className="h-5 w-5 text-blue-600" />}
              <span>{n.message}</span>
            </a>
            <span className="text-xs text-gray-500">
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}
