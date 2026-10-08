"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Sparkles,
  CalendarCheck,
  Clock,
} from "lucide-react"

export function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home", icon: LayoutDashboard },
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/leads", label: "Leads", icon: Sparkles },
    { href: "/follow-ups", label: "Follow-ups", icon: Clock },
    { href: "/attendance", label: "Attendance", icon: CalendarCheck },
  ]

  return (
    <nav className="fixed bottom-0 left-0 z-30 flex h-16 w-full items-center justify-around border-t border-slate-200 bg-white/95 backdrop-blur-md px-2 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 transition-colors ${
              isActive ? "text-red-600 font-semibold" : "text-slate-500 hover:text-slate-900"
            }`}
          >
            <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="mt-1 text-[10px] tracking-tight">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
