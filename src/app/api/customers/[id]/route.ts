import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/customers/[id] - Get single customer with full history
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: {
        employee: { select: { id: true, name: true, mobile: true } },
        leads: {
          include: { employee: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
        followUps: {
          include: { assignedTo: { select: { id: true, name: true } } },
          orderBy: { dueDate: "desc" },
        },
        quotations: { orderBy: { createdAt: "desc" } },
        projects: {
          include: { assignedTech: { select: { id: true, name: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error fetching customer:", error)
    return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 })
  }
}

// PUT /api/customers/[id] - Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check duplicate mobile if changed
    if (body.mobile) {
      const existing = await prisma.customer.findFirst({
        where: { mobile: body.mobile, NOT: { id } },
      })
      if (existing) {
        return NextResponse.json(
          { error: "A customer with this mobile number already exists" },
          { status: 409 }
        )
      }
    }

    const customer = await prisma.customer.update({
      where: { id },
      data: {
        name: body.name,
        mobile: body.mobile,
        altMobile: body.altMobile || null,
        address: body.address,
        district: body.district,
        block: body.block || null,
        village: body.village || null,
        pincode: body.pincode || null,
        electricityConsumerNo: body.electricityConsumerNo || null,
        monthlyBill: body.monthlyBill ? parseFloat(body.monthlyBill) : null,
        roofType: body.roofType || null,
        status: body.status,
        employeeId: body.employeeId,
      },
      include: { employee: { select: { id: true, name: true } } },
    })

    return NextResponse.json(customer)
  } catch (error) {
    console.error("Error updating customer:", error)
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}

// DELETE /api/customers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.customer.delete({ where: { id } })
    return NextResponse.json({ message: "Customer deleted" })
  } catch (error) {
    console.error("Error deleting customer:", error)
    return NextResponse.json({ error: "Failed to delete customer" }, { status: 500 })
  }
}
