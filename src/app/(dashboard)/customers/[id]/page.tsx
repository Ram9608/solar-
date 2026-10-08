"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import {
  ArrowLeft, Phone, Edit2, Save, X, User, MapPin, Zap, Calendar,
  ClipboardList, FileText, Briefcase, AlertCircle, CheckCircle, Clock
} from "lucide-react"

type CustomerDetail = {
  id: string
  name: string
  mobile: string
  altMobile: string | null
  address: string
  district: string
  block: string | null
  village: string | null
  pincode: string | null
  electricityConsumerNo: string | null
  monthlyBill: number | null
  roofType: string | null
  status: string
  employee: { id: string; name: string; mobile: string }
  leads: any[]
  followUps: any[]
  quotations: any[]
  projects: any[]
  createdAt: string
  updatedAt: string
}

import { Suspense } from "react"

function CustomerProfileContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<CustomerDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error)
        setCustomer(data)
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <AlertCircle size={48} className="mb-3" />
        <p className="font-medium text-slate-600">Customer not found</p>
        <Link href="/customers" className="text-red-600 text-sm mt-2 hover:underline">← Back to Customers</Link>
      </div>
    )
  }

  const tabs = [
    { key: "overview", label: "Overview", icon: <User size={16} /> },
    { key: "followups", label: `Follow-ups (${customer.followUps.length})`, icon: <Clock size={16} /> },
    { key: "leads", label: `Leads (${customer.leads.length})`, icon: <ClipboardList size={16} /> },
    { key: "quotations", label: `Quotations (${customer.quotations.length})`, icon: <FileText size={16} /> },
    { key: "projects", label: `Projects (${customer.projects.length})`, icon: <Briefcase size={16} /> },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/customers" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-slate-600" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{customer.name}</h1>
            <p className="text-sm text-slate-500 flex items-center space-x-2 mt-0.5">
              <MapPin size={14} />
              <span>{customer.district}{customer.block ? `, ${customer.block}` : ""}{customer.village ? `, ${customer.village}` : ""}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href={`tel:${customer.mobile}`}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm"
          >
            <Phone size={16} />
            <span>Call {customer.mobile}</span>
          </a>
          {customer.altMobile && (
            <a
              href={`tel:${customer.altMobile}`}
              className="flex items-center space-x-2 px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-50 transition-colors text-sm"
              title={`Alt: ${customer.altMobile}`}
            >
              <Phone size={14} />
              <span className="hidden sm:inline">Alt</span>
            </a>
          )}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <InfoCard label="Status" value={customer.status} color={customer.status === "ACTIVE" ? "emerald" : "slate"} />
        <InfoCard label="Monthly Bill" value={customer.monthlyBill ? `₹${customer.monthlyBill.toLocaleString("en-IN")}` : "N/A"} />
        <InfoCard label="Roof Type" value={customer.roofType || "N/A"} />
        <InfoCard label="Assigned To" value={customer.employee?.name || "N/A"} />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="border-b border-slate-100 overflow-x-auto">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.key
                    ? "border-red-600 text-red-600"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && <OverviewTab customer={customer} />}
          {activeTab === "followups" && <FollowUpsTab followUps={customer.followUps} />}
          {activeTab === "leads" && <LeadsTab leads={customer.leads} />}
          {activeTab === "quotations" && <QuotationsTab quotations={customer.quotations} />}
          {activeTab === "projects" && <ProjectsTab projects={customer.projects} />}
        </div>
      </div>
    </div>
  )
}

export default function CustomerProfilePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    }>
      <CustomerProfileContent params={params} />
    </Suspense>
  )
}

function InfoCard({ label, value, color = "slate" }: { label: string; value: string; color?: string }) {
  const colors: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-50 text-slate-700",
  }
  return (
    <div className={`rounded-xl p-3 ${colors[color] || colors.slate}`}>
      <p className="text-xs font-medium opacity-70 uppercase tracking-wider">{label}</p>
      <p className="font-bold mt-1 text-sm">{value}</p>
    </div>
  )
}

function OverviewTab({ customer }: { customer: CustomerDetail }) {
  const details = [
    { label: "Full Name", value: customer.name },
    { label: "Mobile", value: customer.mobile },
    { label: "Alt Mobile", value: customer.altMobile || "-" },
    { label: "Address", value: customer.address || "-" },
    { label: "District", value: customer.district },
    { label: "Block", value: customer.block || "-" },
    { label: "Village", value: customer.village || "-" },
    { label: "Pincode", value: customer.pincode || "-" },
    { label: "Electricity Consumer No", value: customer.electricityConsumerNo || "-" },
    { label: "Monthly Bill", value: customer.monthlyBill ? `₹${customer.monthlyBill.toLocaleString("en-IN")}` : "-" },
    { label: "Roof Type", value: customer.roofType || "-" },
    { label: "Created", value: new Date(customer.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {details.map((d) => (
        <div key={d.label}>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{d.label}</p>
          <p className="text-sm text-slate-800 font-medium mt-0.5">{d.value}</p>
        </div>
      ))}
    </div>
  )
}

function FollowUpsTab({ followUps }: { followUps: any[] }) {
  if (followUps.length === 0) {
    return <EmptyState icon={<Clock size={36} />} title="No follow-ups" message="No follow-ups scheduled for this customer yet." />
  }
  return (
    <div className="space-y-3">
      {followUps.map((f) => (
        <div key={f.id} className={`flex items-start space-x-3 p-3 rounded-lg border ${
          f.status === "DONE" ? "border-emerald-100 bg-emerald-50/50" :
          new Date(f.dueDate) < new Date() ? "border-red-100 bg-red-50/50" :
          "border-slate-100"
        }`}>
          <div className="pt-0.5">
            {f.status === "DONE" ? <CheckCircle size={18} className="text-emerald-500" /> : <Clock size={18} className="text-orange-500" />}
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-800 font-medium">{f.note}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Due: {new Date(f.dueDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              {f.assignedTo && ` • Assigned to ${f.assignedTo.name}`}
            </p>
          </div>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            f.status === "DONE" ? "bg-emerald-100 text-emerald-700" : "bg-orange-100 text-orange-700"
          }`}>
            {f.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function LeadsTab({ leads }: { leads: any[] }) {
  if (leads.length === 0) {
    return <EmptyState icon={<ClipboardList size={36} />} title="No leads" message="No leads created for this customer yet." />
  }
  const stageColors: Record<string, string> = {
    NEW: "bg-blue-100 text-blue-700",
    CONTACTED: "bg-indigo-100 text-indigo-700",
    SURVEY: "bg-purple-100 text-purple-700",
    QUOTATION: "bg-yellow-100 text-yellow-700",
    NEGOTIATION: "bg-orange-100 text-orange-700",
    WON: "bg-emerald-100 text-emerald-700",
    LOST: "bg-red-100 text-red-700",
  }
  return (
    <div className="space-y-3">
      {leads.map((l) => (
        <div key={l.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
          <div>
            <p className="text-sm text-slate-800 font-medium">Source: {l.source}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {new Date(l.createdAt).toLocaleDateString("en-IN")} • {l.employee?.name}
            </p>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${stageColors[l.stage] || "bg-slate-100"}`}>
            {l.stage}
          </span>
        </div>
      ))}
    </div>
  )
}

function QuotationsTab({ quotations }: { quotations: any[] }) {
  if (quotations.length === 0) {
    return <EmptyState icon={<FileText size={36} />} title="No quotations" message="No quotations generated for this customer yet." />
  }
  return (
    <div className="space-y-3">
      {quotations.map((q) => (
        <div key={q.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
          <div>
            <p className="text-sm text-slate-800 font-medium">{q.systemSizeKW} kW System</p>
            <p className="text-xs text-slate-500 mt-0.5">
              ₹{q.totalCost?.toLocaleString("en-IN")} • {new Date(q.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
            q.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" :
            q.status === "REJECTED" ? "bg-red-100 text-red-700" :
            "bg-slate-100 text-slate-700"
          }`}>
            {q.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function ProjectsTab({ projects }: { projects: any[] }) {
  if (projects.length === 0) {
    return <EmptyState icon={<Briefcase size={36} />} title="No projects" message="No projects created for this customer yet." />
  }
  const stageLabels: Record<string, string> = {
    SURVEY: "Survey",
    MATERIAL_DISPATCH: "Material Dispatch",
    INSTALLATION: "Installation",
    NET_METER: "Net Meter",
    COMMISSIONING: "Commissioning",
  }
  return (
    <div className="space-y-3">
      {projects.map((p) => (
        <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100">
          <div>
            <p className="text-sm text-slate-800 font-medium">{stageLabels[p.stage] || p.stage}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              {p.assignedTech ? `Tech: ${p.assignedTech.name}` : "Unassigned"} • {new Date(p.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
          {p.subsidyStatus && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium">{p.subsidyStatus}</span>
          )}
        </div>
      ))}
    </div>
  )
}

function EmptyState({ icon, title, message }: { icon: React.ReactNode; title: string; message: string }) {
  return (
    <div className="py-12 text-center text-slate-400">
      <div className="flex justify-center mb-3 text-slate-300">{icon}</div>
      <p className="font-medium text-slate-600">{title}</p>
      <p className="text-sm mt-1">{message}</p>
    </div>
  )
}
