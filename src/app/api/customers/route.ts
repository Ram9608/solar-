import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/customers - List customers with search, filters, pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const district = searchParams.get("district") || ""
    const block = searchParams.get("block") || ""
    const status = searchParams.get("status") || ""
    const employeeId = searchParams.get("employeeId") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    const where: any = {}

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { mobile: { contains: search } },
        { address: { contains: search, mode: "insensitive" } },
        { village: { contains: search, mode: "insensitive" } },
      ]
    }
    if (district) where.district = district
    if (block) where.block = block
    if (status) where.status = status
    if (employeeId) where.employeeId = employeeId

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({
        where,
        include: { employee: { select: { id: true, name: true } } },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.customer.count({ where }),
    ])

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}

// POST /api/customers - Create a new customer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Check duplicate mobile number
    const existing = await prisma.customer.findUnique({
      where: { mobile: body.mobile },
    })
    if (existing) {
      return NextResponse.json(
        { error: "A customer with this mobile number already exists" },
        { status: 409 }
      )
    }

    const customer = await prisma.customer.create({
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
        status: body.status || "ACTIVE",
        employeeId: body.employeeId,
      },
      include: { employee: { select: { id: true, name: true } } },
    })

    return NextResponse.json(customer, { status: 201 })
  } catch (error: any) {
    console.error("Error creating customer:", error)
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A customer with this mobile number already exists" },
        { status: 409 }
      )
    }
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
