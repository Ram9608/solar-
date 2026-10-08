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
  const status = searchParams.get("status") || "PENDING"
  const employeeId = searchParams.get("employeeId")

  try {
    const where: any = {}
    if (status !== "ALL") {
      where.status = status
    }
    if (employeeId && employeeId !== "ALL") {
      where.assignedToId = employeeId
    }

    const followUps = await prisma.followUp.findMany({
      where,
      include: {
        customer: {
          select: { id: true, name: true, mobile: true, district: true, address: true },
        },
        assignedTo: {
          select: { id: true, name: true },
        },
      },
      orderBy: { dueDate: "asc" },
    })

    return NextResponse.json(followUps)
  } catch (error) {
    console.error("Failed to fetch follow-ups:", error)
    return NextResponse.json({ error: "Failed to fetch follow-ups" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { dueDate, note, customerId, leadId, assignedToId } = body

    if (!dueDate || !note) {
      return NextResponse.json({ error: "Due date and note are required" }, { status: 400 })
    }

    const followUp = await prisma.followUp.create({
      data: {
        dueDate: new Date(dueDate),
        note,
        customerId: customerId || null,
        leadId: leadId || null,
        assignedToId: assignedToId || session.user.id,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "Created Follow-Up",
        details: `Note: ${note} | Due: ${new Date(dueDate).toLocaleDateString()}`,
      },
    })

    return NextResponse.json(followUp)
  } catch (error) {
    console.error("Failed to create follow-up:", error)
    return NextResponse.json({ error: "Failed to create follow-up" }, { status: 500 })
  }
}
