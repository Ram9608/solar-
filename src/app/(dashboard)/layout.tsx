"use client"

import { useState, Suspense } from "react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { MobileNav } from "@/components/layout/MobileNav"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <Suspense fallback={<div className="w-64 h-full bg-slate-900" />}>
        <Sidebar />
      </Suspense>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-64 h-full bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Suspense fallback={<div className="w-64 h-full" />}>
              <Sidebar />
            </Suspense>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-3.5 sm:p-5 lg:p-6 pb-20 md:pb-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        <Suspense fallback={null}>
          <MobileNav />
        </Suspense>
      </div>
    </div>
  )
}
