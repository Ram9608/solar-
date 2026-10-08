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
  const stage = searchParams.get("stage")
  const technicianId = searchParams.get("technicianId")

  try {
    const where: any = {}
    if (stage && stage !== "ALL") {
      where.stage = stage
    }
    if (technicianId && technicianId !== "ALL") {
      where.assignedTechId = technicianId
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        customer: true,
        assignedTech: {
          select: { id: true, name: true, mobile: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { customerId, stage, assignedTechId, subsidyStatus } = body

    const project = await prisma.project.create({
      data: {
        customerId,
        stage: stage || "SURVEY",
        assignedTechId: assignedTechId || null,
        subsidyStatus: subsidyStatus || "Application Submitted",
      },
      include: {
        customer: true,
        assignedTech: true,
      },
    })

    // If technician assigned, send in-app notification
    if (assignedTechId) {
      await prisma.notification.create({
        data: {
          userId: assignedTechId,
          title: "New Project Assigned",
          message: `You have been assigned to project for ${project.customer.name} (${project.customer.district}).`,
        },
      })
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "Created Project",
        details: `Customer: ${project.customer.name} | Stage: ${project.stage}`,
      },
    })

    return NextResponse.json(project)
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
