import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const month = searchParams.get("month") // YYYY-MM
  const userId = searchParams.get("userId") || session.user.id

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // User's today record
    const todayRecord = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: session.user.id,
          date: today,
        },
      },
    })

    // If manager or admin, get all employees today attendance
    let teamToday: any[] = []
    if (["ADMIN", "MANAGER"].includes(session.user.role)) {
      teamToday = await prisma.user.findMany({
        where: { active: true },
        select: {
          id: true,
          name: true,
          mobile: true,
          role: true,
          deviceId: true,
          attendances: {
            where: { date: today },
            take: 1,
          },
        },
      })
    }

    // Monthly calendar records for requested userId
    let monthlyRecords: any[] = []
    if (month) {
      const [year, m] = month.split("-").map(Number)
      const startDate = new Date(year, m - 1, 1)
      const endDate = new Date(year, m, 0)

      monthlyRecords = await prisma.attendance.findMany({
        where: {
          userId,
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        orderBy: { date: "asc" },
      })
    }

    return NextResponse.json({
      todayRecord,
      teamToday,
      monthlyRecords,
    })
  } catch (error) {
    console.error("Attendance GET error:", error)
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    let { action, selfie, deviceId, leaveReason, location } = body // action: 'CHECK_IN' | 'CHECK_OUT' | 'LEAVE'

    // If location is lat,lon coordinates, convert to proper address using backend fetch
    if (location && /^[-+]?\d+(\.\d+)?,[-+]?\d+(\.\d+)?$/.test(location)) {
      try {
        const [lat, lon] = location.split(",")
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`, {
          headers: { "User-Agent": "SolarCRM/1.0 (Contact: admin@solarcrm.local)" }
        })
        if (geoRes.ok) {
          const geoData = await geoRes.json()
          if (geoData.display_name) {
            location = geoData.display_name
          }
        }
      } catch (e) {
        console.error("Geocoding failed:", e)
      }
    }

    // Server time guaranteed
    const serverNow = new Date()
    const today = new Date(serverNow)
    today.setHours(0, 0, 0, 0)

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Device binding validation
    if (deviceId) {
      if (!user.deviceId) {
        // First login/check-in binds device
        await prisma.user.update({
          where: { id: user.id },
          data: { deviceId },
        })
      } else if (user.deviceId !== deviceId && user.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Device mismatch! Attendance can only be marked from registered mobile/laptop." },
          { status: 403 }
        )
      }
    }

    if (action === "LEAVE") {
      const leaveRecord = await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {
          status: "LEAVE",
          leaveReason: leaveReason || "Casual Leave",
        },
        create: {
          userId: user.id,
          date: today,
          status: "LEAVE",
          leaveReason: leaveReason || "Casual Leave",
        },
      })

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "Leave Request Submitted",
          details: `Reason: ${leaveReason || "Casual Leave"}`,
        },
      })

      return NextResponse.json(leaveRecord)
    }

    if (action === "CHECK_IN") {
      // Determine status based on office rules (9:30 AM late threshold)
      const hours = serverNow.getHours()
      const minutes = serverNow.getMinutes()
      const isLate = hours > 9 || (hours === 9 && minutes > 30)

      const record = await prisma.attendance.upsert({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
        update: {
          checkInTime: serverNow,
          status: isLate ? "LATE" : "PRESENT",
          selfieCheckIn: selfie || null,
          checkInLocation: location || null,
        },
        create: {
          userId: user.id,
          date: today,
          checkInTime: serverNow,
          status: isLate ? "LATE" : "PRESENT",
          selfieCheckIn: selfie || null,
          checkInLocation: location || null,
        },
      })

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: `Checked In (${isLate ? "Late" : "On Time"})`,
          details: `Time: ${serverNow.toLocaleTimeString()} | Server verified`,
        },
      })

      return NextResponse.json(record)
    }

    if (action === "CHECK_OUT") {
      const existing = await prisma.attendance.findUnique({
        where: {
          userId_date: {
            userId: user.id,
            date: today,
          },
        },
      })

      if (!existing) {
        return NextResponse.json({ error: "Cannot check out without checking in first" }, { status: 400 })
      }

      const updated = await prisma.attendance.update({
        where: { id: existing.id },
        data: {
          checkOutTime: serverNow,
          selfieCheckOut: selfie || null,
          checkOutLocation: location || null,
        },
      })

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "Checked Out",
          details: `Time: ${serverNow.toLocaleTimeString()}`,
        },
      })

      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Attendance POST error:", error)
    return NextResponse.json({ error: "Failed to process attendance" }, { status: 500 })
  }
}

// Manager corrections & Device reset
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { attendanceId, status, resetDeviceId, userId } = await request.json()

    if (resetDeviceId && userId) {
      await prisma.user.update({
        where: { id: userId },
        data: { deviceId: null },
      })
      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "Reset Employee Device Binding",
          details: `Target User ID: ${userId}`,
        },
      })
      return NextResponse.json({ success: true, message: "Device binding reset" })
    }

    if (attendanceId && status) {
      const updated = await prisma.attendance.update({
        where: { id: attendanceId },
        data: { status },
      })

      await prisma.activityLog.create({
        data: {
          userId: session.user.id,
          action: "Manual Attendance Correction",
          details: `Record: ${attendanceId} updated to ${status}`,
        },
      })

      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
  } catch (error) {
    console.error("Attendance PATCH error:", error)
    return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 })
  }
}
