"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Sun,
  Lock,
  MessageSquare,
  Eye,
  EyeOff,
  User,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react"
import { signIn } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"password" | "otp">("password")

  // Password Login State
  const [mobile, setMobile] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  // OTP Login State
  const [otpMobile, setOtpMobile] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState("")
  const [otpTimer, setOtpTimer] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const [otpHint, setOtpHint] = useState("")

  // Status & Error
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1)
      }, 1000)
    } else if (otpTimer === 0) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [otpSent, otpTimer])

  const formatTimer = () => {
    const mins = Math.floor(otpTimer / 60)
    const secs = otpTimer % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  // Handle Password Submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        mobile,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid mobile number or password")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpMobile || otpMobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "SEND", target: otpMobile }),
      })

      const data = await res.json()
      if (res.ok) {
        setOtpSent(true)
        setOtpTimer(300)
        setCanResend(false)
        if (data.demoOtp) {
          setOtpHint(`Demo OTP: ${data.demoOtp}`)
        }
      } else {
        setError(data.error || "Failed to send OTP")
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Handle Verify OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!otpCode || otpCode.length < 6) {
      setError("Please enter the 6-digit OTP")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await signIn("credentials", {
        mobile: otpMobile,
        isOtpLogin: "true",
        otp: otpCode,
        redirect: false,
      })

      if (res?.error) {
        setError("Invalid or expired OTP. Please try again.")
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("OTP verification failed. Please try again.")
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
                Welcome Back
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in to access your Solar CRM account.
              </p>
            </div>

            {/* Login Method Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("password")
                  setError("")
                }}
                className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "password"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <Lock size={15} />
                Login with Password
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("otp")
                  setError("")
                }}
                className={`flex items-center gap-2 pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all ${
                  activeTab === "otp"
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-slate-400 hover:text-slate-700"
                }`}
              >
                <MessageSquare size={15} />
                Login with OTP
              </button>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="mb-4 flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                <AlertCircle size={16} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Password Login Section */}
            {activeTab === "password" ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number / Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Enter mobile number"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all min-h-[44px]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <User size={16} />
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-3 pr-10 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 transition-all min-h-[44px]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-slate-700 font-medium">Remember Me</span>
                  </label>

                  <Link
                    href="/forgot-password"
                    className="font-bold text-red-600 hover:text-red-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md transition-all disabled:opacity-50 active:scale-98 min-h-[46px]"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>
            ) : (
              /* OTP Login Section */
              <div>
                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500">
                        <span className="bg-slate-50 px-3 py-2.5 text-slate-600 font-semibold border-r border-slate-200 flex items-center">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="Enter 10-digit mobile number"
                          value={otpMobile}
                          onChange={(e) => setOtpMobile(e.target.value)}
                          className="flex-1 py-2.5 px-3 text-xs text-slate-900 focus:outline-none min-h-[44px]"
                        />
                        <span className="px-3 flex items-center text-slate-400">
                          <Smartphone size={16} />
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md transition-all disabled:opacity-50 min-h-[46px]"
                    >
                      {loading ? "Sending OTP..." : "Send OTP"}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
                    {otpHint && (
                      <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-2 text-center text-emerald-800 font-bold">
                        {otpHint}
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1 text-center">
                        Enter 6-Digit OTP sent to +91 {otpMobile}
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="••••••"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full text-center tracking-[8px] font-mono font-extrabold text-xl py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:outline-none min-h-[48px]"
                      />
                    </div>

                    <div className="text-center text-xs text-slate-500">
                      OTP expires in{" "}
                      <span className="font-mono font-bold text-red-600">
                        {otpTimer > 0 ? formatTimer() : "Expired"}
                      </span>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-red-600 hover:bg-red-700 shadow-md transition-all disabled:opacity-50 min-h-[46px]"
                    >
                      {loading ? "Verifying..." : "Verify OTP & Sign In"}
                    </button>

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        disabled={!canResend}
                        onClick={handleSendOtp}
                        className="text-xs font-semibold text-red-600 disabled:text-slate-300 hover:underline"
                      >
                        Resend OTP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false)
                          setOtpCode("")
                        }}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                      >
                        Change Mobile Number
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Demo Quick Logins */}
            <div className="mt-6 rounded-xl bg-slate-50 p-3.5 border border-slate-200/80 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Quick Demo Accounts:</p>
              <div className="grid grid-cols-3 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setMobile("9999999999")
                    setPassword("password")
                    setActiveTab("password")
                  }}
                  className="rounded-md bg-white border border-slate-200 py-1 px-2 font-medium text-slate-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobile("9876543210")
                    setPassword("password")
                    setActiveTab("password")
                  }}
                  className="rounded-md bg-white border border-slate-200 py-1 px-2 font-medium text-slate-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  Manager
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobile("9123456780")
                    setPassword("password")
                    setActiveTab("password")
                  }}
                  className="rounded-md bg-white border border-slate-200 py-1 px-2 font-medium text-slate-700 hover:border-red-500 hover:text-red-600 transition-colors"
                >
                  Sales
                </button>
              </div>
            </div>

            {/* Register link */}
            <div className="text-center mt-6 text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-red-600 hover:text-red-700 hover:underline"
              >
                Register Now
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
