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
    const { stage, lossReason, employeeId } = body

    const existingLead = await prisma.lead.findUnique({
      where: { id },
      include: { customer: true },
    })

    if (!existingLead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 })
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        ...(stage && { stage }),
        ...(lossReason !== undefined && { lossReason }),
        ...(employeeId && { employeeId }),
      },
      include: {
        customer: true,
        employee: true,
      },
    })

    // If stage changed to WON, auto-create a project if not already created
    if (stage === "WON" && existingLead.stage !== "WON") {
      const existingProject = await prisma.project.findFirst({
        where: { customerId: existingLead.customerId },
      })

      if (!existingProject) {
        await prisma.project.create({
          data: {
            customerId: existingLead.customerId,
            stage: "SURVEY",
            subsidyStatus: "Pending JBVNL Application",
          },
        })

        // Also create a celebratory in-app notification
        await prisma.notification.create({
          data: {
            userId: session.user.id,
            title: "🎉 Lead Won!",
            message: `Lead for ${existingLead.customer.name} marked Won. Project created in Survey stage.`,
          },
        })
      }
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Lead Stage Updated: ${stage}`,
        details: `Customer: ${existingLead.customer.name} | Stage: ${stage}${
          lossReason ? ` | Reason: ${lossReason}` : ""
        }`,
      },
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Failed to update lead:", error)
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.lead.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete lead:", error)
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 })
  }
}
