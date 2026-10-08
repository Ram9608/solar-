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
    const items = await prisma.inventoryItem.findMany({
      orderBy: { updatedAt: "desc" },
    })

    const counts = {
      inStock: items.filter((i) => i.status === "IN").reduce((sum, i) => sum + i.quantity, 0),
      dispatched: items.filter((i) => i.status === "OUT").reduce((sum, i) => sum + i.quantity, 0),
      returned: items.filter((i) => i.status === "RETURNED").reduce((sum, i) => sum + i.quantity, 0),
      damaged: items.filter((i) => i.status === "DAMAGED").reduce((sum, i) => sum + i.quantity, 0),
    }

    return NextResponse.json({ items, counts })
  } catch (error) {
    console.error("Failed to fetch inventory:", error)
    return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, quantity, status } = body

    const item = await prisma.inventoryItem.upsert({
      where: { name },
      update: {
        quantity: parseInt(quantity),
        status: status || "IN",
      },
      create: {
        name,
        quantity: parseInt(quantity),
        status: status || "IN",
      },
    })

    // Low stock alert check
    if (item.quantity <= 5 && item.status === "IN") {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          title: "⚠️ Low Stock Alert",
          message: `${item.name} is low on stock (${item.quantity} remaining). Reorder recommended.`,
        },
      })
    }

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: `Inventory Updated: ${item.name}`,
        details: `Quantity: ${item.quantity} | Status: ${item.status}`,
      },
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error("Failed to save inventory:", error)
    return NextResponse.json({ error: "Failed to save inventory" }, { status: 500 })
  }
}
