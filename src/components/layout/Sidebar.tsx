"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  LayoutDashboard,
  Calendar,
  ClipboardList,
  Package,
  IndianRupee,
  Settings,
  LogOut,
  Sun,
  Clock,
  FileSpreadsheet,
  Briefcase,
  History,
} from "lucide-react"
import { signOut } from "next-auth/react"

export function Sidebar() {
  const pathname = usePathname()

  const links = [
    { href: "/", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/customers", icon: Users, label: "Customers" },
    { href: "/leads", icon: ClipboardList, label: "Lead Pipeline" },
    { href: "/follow-ups", icon: Clock, label: "Follow-ups & Alerts" },
    { href: "/quotations", icon: FileSpreadsheet, label: "AI Quotations" },
    { href: "/attendance", icon: Calendar, label: "Attendance" },
    { href: "/projects", icon: Briefcase, label: "Projects" },
    { href: "/inventory", icon: Package, label: "Inventory" },
    { href: "/accounts", icon: IndianRupee, label: "Accounts" },
    { href: "/activity-log", icon: History, label: "Activity Log" },
  ]

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col h-full shadow-sm select-none">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-white shadow-md">
            <Sun size={20} className="animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              Solar CRM
            </h1>
            <span className="text-[10px] font-semibold text-red-600 uppercase tracking-wider">
              Jharkhand Ops
            </span>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href)

          return (
            <Link key={link.href} href={link.href}>
              <div
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-red-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <Icon size={17} />
                <span>{link.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Footer / Settings & Logout */}
      <div className="p-3 border-t border-slate-200 space-y-1">
        <Link href="/settings">
          <div
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              pathname.startsWith("/settings")
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Settings size={17} />
            <span>Settings</span>
          </div>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex w-full items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
