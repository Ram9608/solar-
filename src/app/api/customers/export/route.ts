import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

// GET /api/customers/export - Export all customers as Excel
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const district = searchParams.get("district") || ""
    const status = searchParams.get("status") || ""

    const where: any = {}
    if (district) where.district = district
    if (status) where.status = status

    const customers = await prisma.customer.findMany({
      where,
      include: { employee: { select: { name: true } } },
      orderBy: { name: "asc" },
    })

    const data = customers.map((c, i) => ({
      "Sr.No": i + 1,
      "Name": c.name,
      "Mobile": c.mobile,
      "Alt Mobile": c.altMobile || "",
      "Address": c.address,
      "District": c.district,
      "Block": c.block || "",
      "Village": c.village || "",
      "Pincode": c.pincode || "",
      "Electricity Consumer No": c.electricityConsumerNo || "",
      "Monthly Bill (₹)": c.monthlyBill || "",
      "Roof Type": c.roofType || "",
      "Status": c.status,
      "Assigned Employee": c.employee.name,
      "Created": new Date(c.createdAt).toLocaleDateString("en-IN"),
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Customers")

    // Set column widths
    ws["!cols"] = [
      { wch: 6 }, { wch: 25 }, { wch: 12 }, { wch: 12 },
      { wch: 30 }, { wch: 20 }, { wch: 15 }, { wch: 15 },
      { wch: 8 }, { wch: 18 }, { wch: 12 }, { wch: 15 },
      { wch: 10 }, { wch: 20 }, { wch: 12 },
    ]

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" })

    return new NextResponse(buf, {
      headers: {
        "Content-Disposition": `attachment; filename="customers_${new Date().toISOString().split("T")[0]}.xlsx"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return NextResponse.json({ error: "Failed to export" }, { status: 500 })
  }
}
