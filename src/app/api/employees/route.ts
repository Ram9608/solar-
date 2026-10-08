import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/employees - List all active employees (for dropdowns)
export async function GET(request: NextRequest) {
  try {
    const employees = await prisma.user.findMany({
      where: { active: true },
      select: { id: true, name: true, mobile: true, role: true },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(employees)
  } catch (error) {
    console.error("Error fetching employees:", error)
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
  }
}
