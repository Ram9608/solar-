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
    const items = await prisma.rateList.findMany({
      orderBy: { item: "asc" },
    })
    return NextResponse.json(items)
  } catch (error) {
    console.error("Rate list error:", error)
    return NextResponse.json({ error: "Failed to fetch rate list" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || !["ADMIN", "MANAGER"].includes(session.user.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  try {
    const { id, price } = await request.json()
    const updated = await prisma.rateList.update({
      where: { id },
      data: { price: parseFloat(price) },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "Updated Rate List Price",
        details: `${updated.item}: ₹${updated.price} / ${updated.unit}`,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Rate list update error:", error)
    return NextResponse.json({ error: "Failed to update rate list" }, { status: 500 })
  }
}
