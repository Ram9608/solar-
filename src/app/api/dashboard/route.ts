import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // 1. Core summary stats
    const [
      totalCustomers,
      totalLeads,
      doneLeads,
      lossLeads,
      totalProjects,
      todayPresent,
      todayLeave,
      materialReturn,
      damagedMaterial,
      quotationRevenueAgg,
    ] = await Promise.all([
      prisma.customer.count(),
      prisma.lead.count(),
      prisma.lead.count({ where: { stage: "WON" } }),
      prisma.lead.count({ where: { stage: "LOST" } }),
      prisma.project.count(),
      prisma.attendance.count({
        where: {
          date: today,
          status: { in: ["PRESENT", "LATE", "HALF_DAY"] },
        },
      }),
      prisma.attendance.count({
        where: {
          date: today,
          status: "LEAVE",
        },
      }),
      prisma.inventoryItem.count({ where: { status: "RETURNED" } }),
      prisma.inventoryItem.count({ where: { status: "DAMAGED" } }),
      prisma.quotation.aggregate({
        _sum: { totalCost: true },
        where: { status: "APPROVED" },
      }),
    ])

    // Estimated revenue fallback
    const revenue = quotationRevenueAgg._sum.totalCost || (doneLeads * 185000)

    // 2. Leads vs Customers distribution by district (Top districts)
    const customersByDistrict = await prisma.customer.groupBy({
      by: ["district"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 6,
    })

    const chartData = await Promise.all(
      customersByDistrict.map(async (item) => {
        const leadCount = await prisma.lead.count({
          where: { customer: { district: item.district } },
        })
        return {
          name: item.district.replace(" (East Singhbhum)", "").replace(" Cantonment", ""),
          customers: item._count.id,
          leads: leadCount,
        }
      })
    )

    // 3. Lead Status distribution (Pie Chart)
    const leadsByStage = await prisma.lead.groupBy({
      by: ["stage"],
      _count: { id: true },
    })

    const stageColors: Record<string, string> = {
      NEW: "#3b82f6",
      CONTACTED: "#8b5cf6",
      SURVEY: "#f59e0b",
      QUOTATION: "#06b6d4",
      NEGOTIATION: "#ec4899",
      WON: "#10b981",
      LOST: "#ef4444",
    }

    const pieData = leadsByStage.map((s) => ({
      name: s.stage,
      value: s._count.id,
      color: stageColors[s.stage] || "#94a3b8",
    }))

    // 4. Today Employee Lead Work
    const employees = await prisma.user.findMany({
      where: { active: true, role: { in: ["SALES", "MANAGER"] } },
      select: {
        id: true,
        name: true,
        role: true,
        leads: {
          select: {
            id: true,
            stage: true,
          },
        },
      },
    })

    const employeeLeadWork = employees.map((emp) => {
      const activeCount = emp.leads.filter((l) => !["WON", "LOST"].includes(l.stage)).length
      const wonCount = emp.leads.filter((l) => l.stage === "WON").length
      const lostCount = emp.leads.filter((l) => l.stage === "LOST").length
      return {
        id: emp.id,
        name: emp.name,
        role: emp.role,
        active: activeCount,
        won: wonCount,
        lost: lostCount,
        total: emp.leads.length,
      }
    })

    // 5. Follow-ups (Today + Overdue)
    const followUps = await prisma.followUp.findMany({
      where: {
        status: "PENDING",
      },
      include: {
        customer: {
          select: { id: true, name: true, mobile: true, district: true },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: "asc" },
      take: 10,
    })

    return NextResponse.json({
      summary: {
        totalCustomers,
        totalLeads,
        doneLeads,
        lossLeads,
        revenue,
        totalProjects,
        todayAttendance: todayPresent,
        todayLeave,
        materialReturn,
        damagedMaterial,
      },
      chartData,
      pieData,
      employeeLeadWork,
      followUps,
    })
  } catch (error) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: "Failed to load dashboard data" }, { status: 500 })
  }
}
