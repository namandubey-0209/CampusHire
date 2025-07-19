// src/components/Footer.tsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Footer() {
  const { data: session } = useSession();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-bold text-gray-900 mb-4">CampusHire</h3>
            <p className="text-gray-600 text-sm mb-4">
              Connecting students with their dream careers through campus recruitment.
            </p>
            <p className="text-xs text-gray-500">
              © {currentYear} CampusHire. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/jobs" className="text-gray-600 hover:text-gray-900">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="text-gray-600 hover:text-gray-900">
                  Companies
                </Link>
              </li>
              {session?.user?.role === "student" && (
                <li>
                  <Link href="/applications" className="text-gray-600 hover:text-gray-900">
                    My Applications
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-900">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                  Contact Us
                </Link>
              </li>
              {session?.user?.role === "admin" && (
                <li>
                  <Link href="/admin/support" className="text-gray-600 hover:text-gray-900">
                    Admin Support
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-gray-500">
            Built with Next.js, TypeScript, and MongoDB
          </div>
          <div className="mt-4 md:mt-0">
            <span className="text-xs text-gray-500">
              Logged in as: <span className="font-medium text-gray-700">{session?.user?.name}</span>
              {session?.user?.role && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {session.user.role.charAt(0).toUpperCase() + session.user.role.slice(1)}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
