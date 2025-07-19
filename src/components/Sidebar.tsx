// src/components/Sidebar.tsx
"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Briefcase, 
  Building2, 
  User, 
  Bell, 
  FileText,
  Users,
  Settings,
  CheckCircle,
  Clock,
  XCircle
} from "lucide-react";

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isStudent = session?.user?.role === "student";
  const isAdmin = session?.user?.role === "admin";

  const isActive = (path: string) => pathname === path;

  const LinkItem = ({ href, icon: Icon, children, isActive }: {
    href: string;
    icon: any;
    children: React.ReactNode;
    isActive?: boolean;
  }) => (
    <Link
      href={href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700" 
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span className="font-medium">{children}</span>
    </Link>
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200 px-4 py-6">
      <nav className="space-y-2">
        {/* Common navigation items */}
        <LinkItem 
          href="/dashboard" 
          icon={Home} 
          isActive={isActive("/dashboard")}
        >
          Dashboard
        </LinkItem>
        
        <LinkItem 
          href="/jobs" 
          icon={Briefcase} 
          isActive={isActive("/jobs")}
        >
          {isAdmin ? "Manage Jobs" : "Browse Jobs"}
        </LinkItem>
        
        <LinkItem 
          href="/companies" 
          icon={Building2} 
          isActive={isActive("/companies")}
        >
          Companies
        </LinkItem>

        {/* Student-specific navigation */}
        {isStudent && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Student Portal
              </h3>
            </div>
            
            <LinkItem 
              href="/student/profile" 
              icon={User} 
              isActive={isActive("/student/profile")}
            >
              My Profile
            </LinkItem>
            
            {/* Applications with status breakdown */}
            <div className="space-y-1">
              <LinkItem 
                href="/applications" 
                icon={FileText} 
                isActive={pathname?.startsWith("/applications")}
              >
                My Applications
              </LinkItem>
              
              {/* Sub-navigation for application status */}
              <div className="ml-8 space-y-1">
                <Link
                  href="/applications?status=applied"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === "/applications" && new URLSearchParams(window.location.search).get("status") === "applied"
                      ? "bg-yellow-50 text-yellow-700"
                      : "text-gray-500 hover:text-yellow-600"
                  }`}
                >
                  <Clock className="h-4 w-4" />
                  <span>In Progress</span>
                </Link>
                
                <Link
                  href="/applications?status=accepted"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === "/applications" && new URLSearchParams(window.location.search).get("status") === "accepted"
                      ? "bg-green-50 text-green-700"
                      : "text-gray-500 hover:text-green-600"
                  }`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Accepted</span>
                </Link>
                
                <Link
                  href="/applications?status=rejected"
                  className={`flex items-center space-x-2 px-3 py-2 text-sm rounded-md transition-colors ${
                    pathname === "/applications" && new URLSearchParams(window.location.search).get("status") === "rejected"
                      ? "bg-red-50 text-red-700"
                      : "text-gray-500 hover:text-red-600"
                  }`}
                >
                  <XCircle className="h-4 w-4" />
                  <span>Rejected</span>
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Admin-specific navigation */}
        {isAdmin && (
          <>
            <div className="pt-4 pb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Admin Portal
              </h3>
            </div>
            
            <LinkItem 
              href="/admin/companies" 
              icon={Building2} 
              isActive={isActive("/admin/companies")}
            >
              Manage Companies
            </LinkItem>
            
            <LinkItem 
              href="/admin/students" 
              icon={Users} 
              isActive={isActive("/admin/students")}
            >
              View Students
            </LinkItem>
            
            <LinkItem 
              href="/admin/settings" 
              icon={Settings} 
              isActive={isActive("/admin/settings")}
            >
              Settings
            </LinkItem>
          </>
        )}

        {/* Common bottom navigation */}
        <div className="pt-4 border-t border-gray-200">
          <LinkItem 
            href="/notifications" 
            icon={Bell} 
            isActive={isActive("/notifications")}
          >
            Notifications
          </LinkItem>
        </div>
      </nav>
    </aside>
  );
}
