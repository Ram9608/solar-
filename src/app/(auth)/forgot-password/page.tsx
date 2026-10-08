"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Sun,
  Phone,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
} from "lucide-react"

export default function ForgotPasswordPage() {
  const [mobile, setMobile] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!mobile || mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)

    try {
      // Simulate API call for forgot password
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSuccess(true)
    } catch (err) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-screen">
        {/* Left Side: Authentication Form */}
        <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 lg:p-16 max-w-xl mx-auto w-full">
          <div>
            {/* Logo */}
            <div className="text-center sm:text-left mb-6">
              <div className="inline-flex items-center gap-2.5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
                  <Sun size={24} className="animate-spin-slow" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                    DMD SOLUTIONS
                  </h1>
                  <span className="text-[10px] font-bold text-red-600 uppercase tracking-widest">
                    Solar CRM &bull; Customer Management
                  </span>
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Reset Password
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Enter your mobile number and we'll send you a link to reset your password.
              </p>
            </div>

            {success ? (
              <div className="text-center py-6 space-y-3 bg-slate-50 rounded-2xl border border-slate-100 p-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-1">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Reset Link Sent!</h2>
                <p className="text-xs text-slate-500">
                  If an account exists for {mobile}, you will receive a password reset link shortly via SMS/WhatsApp.
                </p>
                <div className="pt-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-bold text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm transition-all"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Mobile Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-900 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-1.5 py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md transition-all disabled:opacity-50 active:scale-98 min-h-[46px]"
                  >
                    {loading ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Reset Link
                        <ArrowRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Back to Login */}
            <div className="text-center mt-6 text-xs text-slate-600">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </div>

          {/* Footer copyright */}
          <div className="text-center pt-8 text-[11px] text-slate-400">
            &copy; {currentYear || ""} | Designed &amp; Developed by{" "}
            <strong className="text-red-600">DMD Solutions</strong>
          </div>
        </div>

        {/* Right Side: Visual Showcase Banner (account-bg-01) */}
        <div className="hidden lg:flex lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-12 flex-col justify-between relative overflow-hidden">
          {/* Subtle decorative circles */}
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-orange-600/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex justify-between items-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md border border-white/10">
              <ShieldCheck size={14} className="text-emerald-400" />
              Jharkhand Rooftop Solar Initiative
            </span>
            <span className="text-xs text-slate-400 font-mono">v2.5.0</span>
          </div>

          <div className="relative z-10 space-y-6 my-auto py-12">
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Empowering Jharkhand's <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-amber-300">
                Solar Revolution
              </span>
            </h2>

            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Comprehensive CRM tailored for solar EPC installers: real-time lead pipeline, PM
              Surya Ghar subsidy calculations, offline attendance, and automated follow-up reminders.
            </p>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-2 gap-3 max-w-lg pt-2">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
                <Zap size={20} className="text-amber-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">PM Surya Ghar</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Automated subsidy ledger up to ₹78,000</p>
              </div>

              <div className="rounded-xl bg-white/5 border border-white/10 p-3.5 backdrop-blur-sm">
                <Sun size={20} className="text-orange-400 mb-1.5" />
                <h4 className="text-xs font-bold text-white">24 Districts</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Full coverage of Jharkhand blocks</p>
              </div>
            </div>
          </div>

          <div className="relative z-10 text-xs text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
            <span>Official EPC Channel Partner</span>
            <span>JBVNL Net Metering Ready</span>
          </div>
        </div>
      </div>
    </div>
  )
}
