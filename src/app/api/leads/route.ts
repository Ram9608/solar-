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
  const employeeId = searchParams.get("employeeId")
  const search = searchParams.get("search")

  try {
    const where: any = {}
    if (stage && stage !== "ALL") {
      where.stage = stage
    }
    if (employeeId && employeeId !== "ALL") {
      where.employeeId = employeeId
    }
    if (search) {
      where.OR = [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { mobile: { contains: search, mode: "insensitive" } } },
        { customer: { district: { contains: search, mode: "insensitive" } } },
      ]
    }

    const leads = await prisma.lead.findMany({
      where,
      include: {
        customer: true,
        employee: {
          select: { id: true, name: true, mobile: true },
        },
        followUps: {
          orderBy: { dueDate: "asc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(leads)
  } catch (error) {
    console.error("Failed to fetch leads:", error)
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      mobile,
      address,
      district,
      block,
      monthlyBill,
      roofType,
      source,
      stage,
      employeeId,
    } = body

    if (!name || !mobile || !district) {
      return NextResponse.json({ error: "Name, mobile, and district are required" }, { status: 400 })
    }

    const assignedEmpId = employeeId || session.user.id

    // Check or create customer
    let customer = await prisma.customer.findUnique({
      where: { mobile },
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          name,
          mobile,
          address: address || `${district}, Jharkhand`,
          district,
          block: block || null,
          monthlyBill: monthlyBill ? parseFloat(monthlyBill) : null,
          roofType: roofType || "RCC / Concrete",
          status: "ACTIVE",
          employeeId: assignedEmpId,
        },
      })
    }

    // Create Lead
    const lead = await prisma.lead.create({
      data: {
        source: source || "Reference",
        stage: stage || "NEW",
        customerId: customer.id,
        employeeId: assignedEmpId,
      },
      include: {
        customer: true,
        employee: true,
      },
    })

    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "Created Lead",
        details: `Customer: ${customer.name} (${customer.district}) - Source: ${source || "Reference"}`,
      },
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error("Failed to create lead:", error)
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 })
  }
}
