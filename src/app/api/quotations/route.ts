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
    const quotations = await prisma.quotation.findMany({
      include: {
        customer: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(quotations)
  } catch (error) {
    console.error("Failed to fetch quotations:", error)
    return NextResponse.json({ error: "Failed to fetch quotations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { customerId, systemSizeKW, panelChoice, inverterChoice, totalCost, subsidyExpected, status } = body

    const quote = await prisma.quotation.create({
      data: {
        customerId,
        systemSizeKW: parseFloat(systemSizeKW),
        panelChoice,
        inverterChoice,
        totalCost: parseFloat(totalCost),
        subsidyExpected: parseFloat(subsidyExpected),
        status: status || "FINAL",
      },
      include: {
        customer: true,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "Generated Quotation",
        details: `${quote.systemSizeKW} kW for ${quote.customer.name} - Total: ₹${quote.totalCost.toLocaleString()}`,
      },
    })

    return NextResponse.json(quote)
  } catch (error) {
    console.error("Failed to save quotation:", error)
    return NextResponse.json({ error: "Failed to save quotation" }, { status: 500 })
  }
}
