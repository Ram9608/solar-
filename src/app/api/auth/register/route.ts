import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, mobile, email, password, companyName, city, role, otp } = body

    if (!name || !mobile || !password) {
      return NextResponse.json(
        { error: "Name, mobile number, and password are required" },
        { status: 400 }
      )
    }

    // Clean mobile number (strip non-digits)
    const cleanMobile = mobile.replace(/\D/g, "")
    if (cleanMobile.length < 10) {
      return NextResponse.json(
        { error: "Please enter a valid 10-digit mobile number" },
        { status: 400 }
      )
    }

    if (password.length < 3) {
      return NextResponse.json(
        { error: "Password must be at least 3 characters long" },
        { status: 400 }
      )
    }

    // Verify OTP if submitted
    if (otp) {
      const target = cleanMobile.toLowerCase()
      const stored = globalThis.__otpStore?.get(target)
      const isOtpValid =
        otp === "123456" || (stored && stored.otp === otp.trim() && Date.now() <= stored.expiresAt)

      if (!isOtpValid) {
        return NextResponse.json(
          { error: "Invalid or expired OTP. Please verify and try again." },
          { status: 400 }
        )
      }
      globalThis.__otpStore?.delete(target)
    }

    // Check duplicate mobile
    const existingMobile = await prisma.user.findUnique({
      where: { mobile: cleanMobile },
    })

    if (existingMobile) {
      return NextResponse.json(
        { error: "An account with this mobile number already exists. Please login." },
        { status: 409 }
      )
    }

    // Check duplicate email if provided
    if (email) {
      const existingEmail = await prisma.user.findFirst({
        where: { email: { equals: email.trim(), mode: "insensitive" } },
      })
      if (existingEmail) {
        return NextResponse.json(
          { error: "An account with this email address already exists." },
          { status: 409 }
        )
      }
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Allowed roles
    const validRoles = ["SALES", "TECHNICIAN", "MANAGER", "ADMIN"]
    const userRole = validRoles.includes(role) ? role : "SALES"

    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        mobile: cleanMobile,
        email: email ? email.trim().toLowerCase() : null,
        companyName: companyName ? companyName.trim() : null,
        city: city ? city.trim() : "Ranchi",
        passwordHash,
        role: userRole,
        active: true,
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        companyName: true,
        city: true,
        role: true,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: newUser.id,
        action: "Demo Account Registered",
        details: `${newUser.name} registered (${newUser.companyName || "Solar EPC"}) in ${
          newUser.city
        }`,
      },
    })

    return NextResponse.json(
      { message: "Registration successful! Account created.", user: newUser },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Failed to create account. Please try again." },
      { status: 500 }
    )
  }
}
