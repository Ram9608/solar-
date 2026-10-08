import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { stage, assignedTechId, subsidyStatus } = body

    const existing = await prisma.project.findUnique({
      where: { id },
      include: { customer: true },
    })

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(stage && { stage }),
        ...(assignedTechId !== undefined && { assignedTechId }),
        ...(subsidyStatus !== undefined && { subsidyStatus }),
      },
      include: {
        customer: true,
        assignedTech: true,
      },
    })

    // If stage changed and there is an assigned technician, notify them
    if (stage && stage !== existing.stage && updated.assignedTechId) {
      await prisma.notification.create({
        data: {
          userId: updated.assignedTechId,
          title: "Project Stage Updated",
          message: `Project for ${existing.customer.name} moved to ${stage}.`,
        },
      })
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Updated Project Stage: ${stage || existing.stage}`,
        details: `Customer: ${existing.customer.name} | Subsidy: ${subsidyStatus || existing.subsidyStatus}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}
