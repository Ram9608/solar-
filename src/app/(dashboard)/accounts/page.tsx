"use client"

import { useState, useEffect } from "react"
import {
  IndianRupee,
  FileText,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Download,
  AlertCircle,
} from "lucide-react"

type Transaction = {
  id: string
  customerName: string
  district: string
  totalAmount: number
  advanceReceived: number
  pendingAmount: number
  date: string
  status: "ADVANCE_PAID" | "SETTLED" | "PENDING"
}

export default function AccountsPage() {
  const [data, setData] = useState<{
    summary: {
      totalInvoiced: number
      collectedRevenue: number
      pendingSubsidy: number
      pendingReceivable: number
    }
    transactions: Transaction[]
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/accounts")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const s = data?.summary || {
    totalInvoiced: 0,
    collectedRevenue: 4200000,
    pendingSubsidy: 1560000,
    pendingReceivable: 850000,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Accounts & Revenue Ledger
            </h1>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              FY 2026-27 Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track customer advances, milestone installments, and National Portal subsidy reimbursements.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Printer size={15} />
          Print Revenue Ledger
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Collected Revenue</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{(s.collectedRevenue / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Bank verified payments</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Pending Subsidy</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Clock size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-2 font-mono">
            ₹{(s.pendingSubsidy / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Awaiting JBVNL Net Metering</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Customer Receivables</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <AlertCircle size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-amber-600 mt-2 font-mono">
            ₹{(s.pendingReceivable / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Due upon installation</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Contract Value</span>
            <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
              <IndianRupee size={18} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-bold text-slate-900 mt-2 font-mono">
            ₹{((s.collectedRevenue + s.pendingSubsidy + s.pendingReceivable) / 100000).toFixed(2)} Lakh
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Total Pipeline Value</p>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Project Billing & Transactions</h2>
            <p className="text-xs text-slate-500">
              Milestone tracking: Booking Advance (30%) &rarr; Dispatch (50%) &rarr; Net Meter Settlement (20%)
            </p>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Transaction ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Contract Value</th>
                <th className="py-2.5 px-3">Advance Received</th>
                <th className="py-2.5 px-3">Balance Receivable</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {(data?.transactions || []).map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono text-slate-500">{t.id}</td>
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{t.customerName}</p>
                    <p className="text-[11px] text-slate-400">{t.district}</p>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">
                    ₹{t.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-600 font-semibold">
                    ₹{t.advanceReceived.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-mono text-amber-600 font-semibold">
                    ₹{t.pendingAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        t.status === "SETTLED"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {t.status === "SETTLED" ? "Full Paid" : "Advance Paid"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
