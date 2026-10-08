import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// This endpoint can be triggered by cron (e.g. AWS EventBridge or Vercel Cron or local scheduler)
export async function GET(request: Request) {
  try {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Find pending follow-ups due now or within the next 24 hours that haven't been reminded
    const pendingFollowUps = await prisma.followUp.findMany({
      where: {
        status: "PENDING",
        reminded: false,
        dueDate: {
          lte: tomorrow,
        },
      },
      include: {
        customer: true,
        assignedTo: true,
      },
    })

    let notificationsCreated = 0

    // Get Admin user to also notify the owner/admin
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN", active: true },
    })

    for (const f of pendingFollowUps) {
      const isOverdue = new Date(f.dueDate) < now
      const customerName = f.customer?.name || "Customer"
      const district = f.customer?.district || "Jharkhand"

      const title = isOverdue ? "⚠️ Overdue Follow-up" : "⏰ Follow-up Due Today"
      const message = `Follow-up for ${customerName} (${district}). Note: ${f.note}`

      // Notify the assigned employee
      await prisma.notification.create({
        data: {
          userId: f.assignedToId,
          title,
          message,
        },
      })
      notificationsCreated++

      // Also notify Admin if different
      if (admin && admin.id !== f.assignedToId) {
        await prisma.notification.create({
          data: {
            userId: admin.id,
            title,
            message: `[${f.assignedTo.name}] ${message}`,
          },
        })
        notificationsCreated++
      }

      // Mark reminded
      await prisma.followUp.update({
        where: { id: f.id },
        data: { reminded: true },
      })
    }

    return NextResponse.json({
      success: true,
      checkedCount: pendingFollowUps.length,
      notificationsCreated,
      timestamp: now.toISOString(),
    })
  } catch (error) {
    console.error("Follow-up scheduler check error:", error)
    return NextResponse.json({ error: "Scheduler check failed" }, { status: 500 })
  }
}
