"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Briefcase,
  CalendarOff,
  UserCheck,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Phone,
  Clock,
  Filter,
  Check,
  Calendar,
  Sparkles,
  ChevronRight,
  TrendingUp,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts"

type DashboardData = {
  summary: {
    totalCustomers: number
    totalLeads: number
    doneLeads: number
    lossLeads: number
    revenue: number
    totalProjects: number
    todayAttendance: number
    todayLeave: number
    materialReturn: number
    damagedMaterial: number
  }
  chartData: Array<{ name: string; customers: number; leads: number }>
  pieData: Array<{ name: string; value: number; color: string }>
  employeeLeadWork: Array<{
    id: string
    name: string
    role: string
    active: number
    won: number
    lost: number
    total: number
  }>
  followUps: Array<{
    id: string
    dueDate: string
    note: string
    status: string
    customer: { id: string; name: string; mobile: string; district: string } | null
    assignedTo: { id: string; name: string }
  }>
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEmp, setSelectedEmp] = useState<string>("ALL")
  const [currentDate, setCurrentDate] = useState<Date | null>(null)

  const loadData = async () => {
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrentDate(new Date())
    loadData()
  }, [])

  const markFollowUpDone = async (id: string) => {
    try {
      const res = await fetch(`/api/follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "DONE" }),
      })
      if (res.ok) {
        loadData()
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading Solar CRM Dashboard...</p>
        </div>
      </div>
    )
  }

  const s = data?.summary || {
    totalCustomers: 0,
    totalLeads: 0,
    doneLeads: 0,
    lossLeads: 0,
    revenue: 0,
    totalProjects: 0,
    todayAttendance: 0,
    todayLeave: 0,
    materialReturn: 0,
    damagedMaterial: 0,
  }

  const filteredEmpWork =
    selectedEmp === "ALL"
      ? data?.employeeLeadWork || []
      : (data?.employeeLeadWork || []).filter((e) => e.id === selectedEmp)

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Solar CRM Overview
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Jharkhand Operations
            </span>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Real-time solar installation pipeline, customer metrics, and team attendance.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/customers"
            className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            <Users size={16} className="text-slate-500" />
            Customers
          </Link>
          <Link
            href="/leads"
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            <Sparkles size={16} />
            Lead Pipeline
          </Link>
        </div>
      </div>

      {/* 10 Summary Cards from Reference Website */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
        <SummaryCard
          title="Total Customer"
          value={s.totalCustomers.toLocaleString()}
          icon={<Users size={20} className="text-blue-600" />}
          badge="Active"
          bg="bg-blue-50 text-blue-700"
          href="/customers"
        />
        <SummaryCard
          title="Total Leads"
          value={s.totalLeads.toLocaleString()}
          icon={<ClipboardList size={20} className="text-purple-600" />}
          badge="Inquiries"
          bg="bg-purple-50 text-purple-700"
          href="/leads"
        />
        <SummaryCard
          title="Total Done Leads"
          value={s.doneLeads.toLocaleString()}
          icon={<CheckCircle2 size={20} className="text-emerald-600" />}
          badge="Won"
          bg="bg-emerald-50 text-emerald-700"
          href="/leads"
        />
        <SummaryCard
          title="Total Loss Leads"
          value={s.lossLeads.toLocaleString()}
          icon={<XCircle size={20} className="text-rose-600" />}
          badge="Closed"
          bg="bg-rose-50 text-rose-700"
          href="/leads"
        />
        <SummaryCard
          title="Revenue (INR)"
          value={`₹${(s.revenue / 100000).toFixed(1)}L`}
          icon={<IndianRupee size={20} className="text-amber-600" />}
          badge="Approved"
          bg="bg-amber-50 text-amber-700"
          href="/accounts"
        />
        <SummaryCard
          title="Projects"
          value={s.totalProjects.toLocaleString()}
          icon={<Briefcase size={20} className="text-indigo-600" />}
          badge="Active"
          bg="bg-indigo-50 text-indigo-700"
          href="/projects"
        />
        <SummaryCard
          title="Today Attendance"
          value={s.todayAttendance.toLocaleString()}
          icon={<UserCheck size={20} className="text-teal-600" />}
          badge="Present"
          bg="bg-teal-50 text-teal-700"
          href="/attendance"
        />
        <SummaryCard
          title="Today Leave"
          value={s.todayLeave.toLocaleString()}
          icon={<CalendarOff size={20} className="text-orange-600" />}
          badge="On Leave"
          bg="bg-orange-50 text-orange-700"
          href="/attendance"
        />
        <SummaryCard
          title="Material Return"
          value={s.materialReturn.toLocaleString()}
          icon={<RotateCcw size={20} className="text-slate-600" />}
          badge="Warehouse"
          bg="bg-slate-100 text-slate-700"
          href="/inventory"
        />
        <SummaryCard
          title="Damaged Material"
          value={s.damagedMaterial.toLocaleString()}
          icon={<AlertTriangle size={20} className="text-red-600" />}
          badge="Audit"
          bg="bg-red-50 text-red-700"
          href="/inventory"
        />
      </div>

      {/* Charts Section: Leads vs Customers & Today's Lead Status */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Leads vs Customers Bar Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Leads vs Customers (by District)</h2>
              <p className="text-xs text-slate-500">Distribution across major Jharkhand territories</p>
            </div>
            <span className="text-xs font-medium text-slate-400">Jharkhand Focus</span>
          </div>

          <div className="h-72 w-full pt-4">
            {data?.chartData && data.chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} interval={0} angle={-15} textAnchor="end" />
                  <YAxis tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="customers" name="Customers" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="leads" name="Leads" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No district chart data available
              </div>
            )}
          </div>
        </div>

        {/* Today's Lead Status Pie Chart */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Lead Status Breakdown</h2>
              <p className="text-xs text-slate-500">Active pipeline stages</p>
            </div>
            <Link href="/leads" className="text-xs font-semibold text-red-600 hover:text-red-700">
              Pipeline &rarr;
            </Link>
          </div>

          <div className="h-56 w-full pt-2">
            {data?.pieData && data.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {data.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      borderRadius: "8px",
                      border: "none",
                      color: "#fff",
                      fontSize: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-slate-400">
                No lead status data
              </div>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2 border-t border-slate-100 text-[11px]">
            {(data?.pieData || []).slice(0, 5).map((p) => (
              <span key={p.name} className="inline-flex items-center gap-1 text-slate-600 font-medium">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color }}></span>
                {p.name}: {p.value}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Today Employee Lead Work & Today's Follow-ups */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Employee Lead Work Table */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm lg:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Today Employee Lead Work</h2>
              <p className="text-xs text-slate-500">Sales team productivity and lead conversion</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedEmp}
                onChange={(e) => setSelectedEmp(e.target.value)}
                className="text-xs rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="ALL">All Employees</option>
                {(data?.employeeLeadWork || []).map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              {selectedEmp !== "ALL" && (
                <button
                  onClick={() => setSelectedEmp("ALL")}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Sr.No.</th>
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">In Progress</th>
                  <th className="py-2.5 px-3">Won</th>
                  <th className="py-2.5 px-3">Lost</th>
                  <th className="py-2.5 px-3 text-right">Total Leads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredEmpWork.map((emp, idx) => (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-semibold text-slate-900">{emp.name}</td>
                    <td className="py-3 px-3">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                        {emp.role}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-amber-600">{emp.active}</td>
                    <td className="py-3 px-3 text-emerald-600 font-semibold">{emp.won}</td>
                    <td className="py-3 px-3 text-rose-500">{emp.lost}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{emp.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Today's Follow-ups & Reminders Widget */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Today's Follow-ups</h2>
              <p className="text-xs text-slate-500">Critical client touchpoints</p>
            </div>
            <Link href="/follow-ups" className="text-xs font-semibold text-red-600 hover:text-red-700">
              View All &rarr;
            </Link>
          </div>

          <div className="mt-4 flex-1 space-y-3 overflow-y-auto max-h-[340px] pr-1">
            {data?.followUps && data.followUps.length > 0 ? (
              data.followUps.map((f) => {
                const isOverdue = currentDate ? new Date(f.dueDate) < currentDate : false
                return (
                  <div
                    key={f.id}
                    className={`rounded-lg border p-3 transition-shadow hover:shadow-sm ${
                      isOverdue ? "border-red-200 bg-red-50/40" : "border-slate-100 bg-slate-50/40"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {f.customer?.name || "Customer"}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {f.customer?.district || "Jharkhand"} &bull; Assigned to {f.assignedTo.name}
                        </p>
                      </div>
                      {f.customer?.mobile && (
                        <a
                          href={`tel:${f.customer.mobile}`}
                          className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          title="Call customer"
                        >
                          <Phone size={13} />
                        </a>
                      )}
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 italic">"{f.note}"</p>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100/60 pt-2 text-[11px]">
                      <span
                        className={`flex items-center gap-1 font-semibold ${
                          isOverdue ? "text-red-600" : "text-slate-500"
                        }`}
                      >
                        <Clock size={12} />
                        {new Date(f.dueDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>

                      <button
                        onClick={() => markFollowUpDone(f.id)}
                        className="inline-flex items-center gap-1 rounded bg-white px-2 py-1 font-semibold text-emerald-600 border border-emerald-200 hover:bg-emerald-50 transition-colors"
                      >
                        <Check size={12} />
                        Mark Done
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex h-40 items-center justify-center text-xs text-slate-400">
                No pending follow-ups scheduled for today.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SummaryCard({
  title,
  value,
  icon,
  badge,
  bg,
  href,
}: {
  title: string
  value: string
  icon: React.ReactNode
  badge: string
  bg: string
  href: string
}) {
  return (
    <Link href={href}>
      <div className="group rounded-xl border border-slate-200/80 bg-white p-3.5 sm:p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer">
        <div className="flex items-center justify-between">
          <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
            {icon}
          </div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <div className="mt-3">
          <p className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
            {value}
          </p>
          <p className="mt-0.5 text-xs font-medium text-slate-500 truncate">{title}</p>
        </div>
      </div>
    </Link>
  )
}
