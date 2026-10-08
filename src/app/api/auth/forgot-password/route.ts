import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, identifier, otp, newPassword } = body

    if (!identifier) {
      return NextResponse.json({ error: "Please enter your registered mobile number or email" }, { status: 400 })
    }

    const cleanId = identifier.trim()
    const isEmail = cleanId.includes("@")

    // Find user by mobile or email
    const user = await prisma.user.findFirst({
      where: isEmail
        ? { email: { equals: cleanId, mode: "insensitive" } }
        : { mobile: cleanId.replace(/\D/g, "") },
    })

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this mobile number or email address." },
        { status: 404 }
      )
    }

    if (action === "REQUEST") {
      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString()
      const target = isEmail ? user.email! : user.mobile

      // Store in global OTP cache
      const cleanTarget = target.toLowerCase()
      if (globalThis.__otpStore) {
        globalThis.__otpStore.set(cleanTarget, {
          otp: generatedOtp,
          expiresAt: Date.now() + 5 * 60 * 1000,
          purpose: "RESET_PASSWORD",
        })
      }

      console.log(`[PASSWORD RESET OTP] For ${user.name} (${target}): ${generatedOtp}`)

      return NextResponse.json({
        success: true,
        message: `Password reset OTP sent to ${target}. (Demo OTP: ${generatedOtp} or 123456)`,
        demoOtp: generatedOtp,
        userTarget: target,
      })
    }

    if (action === "RESET") {
      if (!otp) {
        return NextResponse.json({ error: "Please enter the 6-digit verification code" }, { status: 400 })
      }
      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 })
      }

      const target = (isEmail ? user.email! : user.mobile).toLowerCase()
      const stored = globalThis.__otpStore?.get(target)

      const isOtpValid =
        otp === "123456" || (stored && stored.otp === otp.trim() && Date.now() <= stored.expiresAt)

      if (!isOtpValid) {
        return NextResponse.json({ error: "Invalid or expired OTP. Please try again." }, { status: 400 })
      }

      // Hash and update password
      const passwordHash = await bcrypt.hash(newPassword, 10)
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      })

      // Clean OTP
      globalThis.__otpStore?.delete(target)

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "Password Reset Successful",
          details: `Password reset via OTP verification`,
        },
      })

      return NextResponse.json({
        success: true,
        message: "Your password has been successfully reset. You can now log in with your new password.",
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Forgot password error:", error)
    return NextResponse.json({ error: "Failed to process password reset request" }, { status: 500 })
  }
}
