import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import * as XLSX from "xlsx"

// POST /api/customers/import - Bulk import from Excel/CSV
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const workbook = XLSX.read(buffer, { type: "buffer" })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const rows: any[] = XLSX.utils.sheet_to_json(sheet)

    const results = {
      total: rows.length,
      success: 0,
      errors: [] as { row: number; message: string; data?: any }[],
      duplicates: 0,
    }

    // Get all employees for validation
    const employees = await prisma.user.findMany({
      select: { id: true, name: true, mobile: true },
    })

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i]
      const rowNum = i + 2 // Excel row (1 is header)

      // Validate required fields
      if (!row.name || !row.mobile) {
        results.errors.push({
          row: rowNum,
          message: "Missing required fields: name, mobile",
          data: row,
        })
        continue
      }

      // Normalize mobile
      const mobile = String(row.mobile).replace(/\D/g, "").slice(-10)
      if (mobile.length !== 10) {
        results.errors.push({
          row: rowNum,
          message: `Invalid mobile number: ${row.mobile}`,
          data: row,
        })
        continue
      }

      // Check duplicate
      const existing = await prisma.customer.findUnique({
        where: { mobile },
      })

      if (existing) {
        results.duplicates++
        results.errors.push({
          row: rowNum,
          message: `Duplicate mobile number: ${mobile} (existing customer: ${existing.name})`,
          data: row,
        })
        continue
      }

      // Find employee by name or mobile
      let employeeId = employees[0]?.id // default fallback
      if (row.employee || row.employeeMobile) {
        const emp = employees.find(
          (e) =>
            e.name.toLowerCase() === String(row.employee || "").toLowerCase() ||
            e.mobile === String(row.employeeMobile || "")
        )
        if (emp) employeeId = emp.id
      }

      if (!employeeId) {
        results.errors.push({
          row: rowNum,
          message: "No employee found to assign",
          data: row,
        })
        continue
      }

      try {
        await prisma.customer.create({
          data: {
            name: String(row.name).trim(),
            mobile,
            altMobile: row.altMobile ? String(row.altMobile).replace(/\D/g, "").slice(-10) : null,
            address: String(row.address || "").trim(),
            district: String(row.district || "").trim(),
            block: row.block ? String(row.block).trim() : null,
            village: row.village ? String(row.village).trim() : null,
            pincode: row.pincode ? String(row.pincode).trim() : null,
            electricityConsumerNo: row.electricityConsumerNo
              ? String(row.electricityConsumerNo).trim()
              : null,
            monthlyBill: row.monthlyBill ? parseFloat(String(row.monthlyBill)) : null,
            roofType: row.roofType ? String(row.roofType).trim() : null,
            status: "ACTIVE",
            employeeId,
          },
        })
        results.success++
      } catch (err: any) {
        results.errors.push({
          row: rowNum,
          message: err.message || "Database error",
          data: row,
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
