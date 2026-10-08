import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// In-memory or database OTP store for fast, reliable verification
// Key: mobile or email -> { otp: string, expiresAt: number }
declare global {
  var __otpStore: Map<string, { otp: string; expiresAt: number; purpose: string }> | undefined
}

const otpStore = globalThis.__otpStore ?? new Map<string, { otp: string; expiresAt: number; purpose: string }>()
if (process.env.NODE_ENV !== "production") globalThis.__otpStore = otpStore

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, target, otp, purpose } = body // action: 'SEND' | 'VERIFY'

    if (!target) {
      return NextResponse.json({ error: "Mobile number or Email is required" }, { status: 400 })
    }

    const cleanTarget = target.trim().toLowerCase()

    if (action === "SEND") {
      // Generate realistic 6-digit OTP
      // For instant testability, 123456 is always accepted in demo mode as well
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes validity

      otpStore.set(cleanTarget, {
        otp: generatedOtp,
        expiresAt,
        purpose: purpose || "LOGIN",
      })

      console.log(`[AUTH OTP] Sent to ${cleanTarget}: ${generatedOtp} (Expires in 5m)`)

      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to ${target}. (For demo testing: use ${generatedOtp} or 123456)`,
        demoOtp: generatedOtp,
      })
    }

    if (action === "VERIFY") {
      if (!otp) {
        return NextResponse.json({ error: "Please enter the 6-digit OTP" }, { status: 400 })
      }

      // Check master demo code or stored code
      const stored = otpStore.get(cleanTarget)

      if (otp === "123456") {
        return NextResponse.json({ success: true, message: "OTP verified successfully!" })
      }

      if (!stored) {
        return NextResponse.json({ error: "No OTP found. Please request a new OTP." }, { status: 400 })
      }

      if (Date.now() > stored.expiresAt) {
        otpStore.delete(cleanTarget)
        return NextResponse.json({ error: "OTP has expired. Please resend." }, { status: 400 })
      }

      if (stored.otp !== otp.trim()) {
        return NextResponse.json({ error: "Invalid OTP. Please check and try again." }, { status: 400 })
      }

      // Clear used OTP
      otpStore.delete(cleanTarget)
      return NextResponse.json({ success: true, message: "OTP verified successfully!" })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("OTP API error:", error)
    return NextResponse.json({ error: "Failed to process OTP request" }, { status: 500 })
  }
}
