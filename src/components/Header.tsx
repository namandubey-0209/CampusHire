// src/components/Header.tsx
"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Bell, User, LogOut, Briefcase, Building2 } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const isStudent = session?.user?.role === "student";
  const isAdmin = session?.user?.role === "admin";
  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const unread = data.notifications.filter((n: any) => !n.isRead).length;
          setUnreadCount(unread);
        }
      });
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/dashboard" className="text-2xl font-bold text-gray-900">
            CampusHire
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Dashboard
            </Link>

            <Link
              href="/jobs"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Jobs
            </Link>

            <Link
              href="/companies"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Companies
            </Link>

            {/* Student-only navigation */}
            {isStudent && (
              <Link
                href="/applications"
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <Briefcase className="h-4 w-4" />
                <span>My Applications</span>
              </Link>
            )}

          </nav>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications - visible to both roles */}
          <Link
            href="/notifications"
            className="relative text-gray-500 hover:text-gray-700"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Link>

          {/* Profile dropdown */}
          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">{session?.user?.name}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <div className="py-2">
                  {isStudent && (
                    <Link
                      href={`/student/profile`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setOpen(false)} // close on click
                    >
                      My Profile
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
