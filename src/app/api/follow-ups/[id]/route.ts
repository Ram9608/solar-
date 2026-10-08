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

    const updated = await prisma.followUp.update({
      where: { id },
      data: {
        ...(body.status && { status: body.status }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
        ...(body.note && { note: body.note }),
      },
    })

    // Log action
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Follow-up updated: ${body.status || "rescheduled"}`,
        details: `FollowUp ID: ${id}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Failed to update follow-up:", error)
    return NextResponse.json({ error: "Failed to update follow-up" }, { status: 500 })
  }
}
