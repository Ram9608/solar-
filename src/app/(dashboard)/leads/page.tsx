"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Sparkles,
  Plus,
  Search,
  Filter,
  Kanban,
  List,
  Phone,
  Clock,
  ArrowRight,
  CheckCircle2,
  XCircle,
  MoreVertical,
  X,
  IndianRupee,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react"
import { DISTRICT_LIST, JHARKHAND_DISTRICTS } from "@/lib/master-data"

type LeadItem = {
  id: string
  source: string
  stage: string
  lossReason: string | null
  customerId: string
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    mobile: string
    district: string
    block: string | null
    monthlyBill: number | null
    roofType: string | null
  }
  employee: {
    id: string
    name: string
    mobile: string
  }
  followUps?: Array<{
    id: string
    dueDate: string
    note: string
    status: string
  }>
}

const STAGES = [
  { key: "NEW", label: "New Lead", color: "border-t-blue-500", badge: "bg-blue-100 text-blue-700" },
  { key: "CONTACTED", label: "Contacted", color: "border-t-purple-500", badge: "bg-purple-100 text-purple-700" },
  { key: "SURVEY", label: "Site Survey", color: "border-t-amber-500", badge: "bg-amber-100 text-amber-700" },
  { key: "QUOTATION", label: "Quotation Sent", color: "border-t-cyan-500", badge: "bg-cyan-100 text-cyan-700" },
  { key: "NEGOTIATION", label: "Negotiation", color: "border-t-pink-500", badge: "bg-pink-100 text-pink-700" },
  { key: "WON", label: "Won / Deal Closed", color: "border-t-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  { key: "LOST", label: "Lost", color: "border-t-rose-500", badge: "bg-rose-100 text-rose-700" },
]

export default function LeadsPipelinePage() {
  const [leads, setLeads] = useState<LeadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"board" | "list">("board")
  const [search, setSearch] = useState("")
  const [selectedStage, setSelectedStage] = useState("ALL")
  const [selectedEmp, setSelectedEmp] = useState("ALL")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLostModal, setShowLostModal] = useState<string | null>(null)
  const [lossReason, setLossReason] = useState("")

  // Form states for new lead
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    district: "Ranchi",
    block: "",
    monthlyBill: "",
    roofType: "RCC / Concrete",
    source: "Reference",
    stage: "NEW",
  })

  const loadLeads = async () => {
    try {
      const res = await fetch("/api/leads")
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  const handleStageChange = async (leadId: string, newStage: string) => {
    if (newStage === "LOST") {
      setShowLostModal(leadId)
      return
    }

    try {
      // Optimistic update
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l))
      )

      await fetch(`/api/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStage }),
      })
      loadLeads()
    } catch (e) {
      console.error(e)
    }
  }

  const confirmLost = async () => {
    if (!showLostModal) return
    try {
      await fetch(`/api/leads/${showLostModal}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: "LOST", lossReason }),
      })
      setShowLostModal(null)
      setLossReason("")
      loadLeads()
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setShowAddModal(false)
        setFormData({
          name: "",
          mobile: "",
          district: "Ranchi",
          block: "",
          monthlyBill: "",
          roofType: "RCC / Concrete",
          source: "Reference",
          stage: "NEW",
        })
        loadLeads()
      } else {
        const err = await res.json()
        alert(err.error || "Failed to create lead")
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((l) => {
      const matchesSearch =
        !search ||
        l.customer.name.toLowerCase().includes(search.toLowerCase()) ||
        l.customer.mobile.includes(search) ||
        l.customer.district.toLowerCase().includes(search.toLowerCase())

      const matchesStage = selectedStage === "ALL" || l.stage === selectedStage
      const matchesEmp = selectedEmp === "ALL" || l.employee.id === selectedEmp

      return matchesSearch && matchesStage && matchesEmp
    })
  }, [leads, search, selectedStage, selectedEmp])

  // Group by stage for Board
  const stageGroups = useMemo(() => {
    const map: Record<string, LeadItem[]> = {}
    STAGES.forEach((s) => (map[s.key] = []))
    filteredLeads.forEach((l) => {
      if (map[l.stage]) {
        map[l.stage].push(l)
      }
    })
    return map
  }, [filteredLeads])

  // HTML5 Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData("text/plain", leadId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault()
    const leadId = e.dataTransfer.getData("text/plain")
    if (leadId) {
      handleStageChange(leadId, stageKey)
    }
  }

  const availableBlocks = formData.district ? JHARKHAND_DISTRICTS[formData.district] || [] : []

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Lead Sales Pipeline
            </h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
              {leads.length} Active Leads
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track inquiries, site surveys, quotations, and closed installations across Jharkhand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Toggle */}
          <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "board" ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Kanban size={14} />
              Board
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                viewMode === "list" ? "bg-red-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List size={14} />
              List
            </button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
          >
            <Plus size={16} />
            New Lead
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search leads by customer name, phone, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-red-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {viewMode === "list" && (
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Stages</option>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          )}

          {(search || selectedStage !== "ALL") && (
            <button
              onClick={() => {
                setSearch("")
                setSelectedStage("ALL")
              }}
              className="text-xs font-semibold text-red-600 hover:text-red-700"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : viewMode === "board" ? (
        /* KANBAN BOARD VIEW */
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x">
          {STAGES.map((stage) => {
            const items = stageGroups[stage.key] || []
            return (
              <div
                key={stage.key}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage.key)}
                className={`w-72 sm:w-80 flex-shrink-0 snap-start flex flex-col rounded-xl border border-slate-200 bg-slate-100/60 p-3 border-t-4 ${stage.color}`}
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      {stage.label}
                    </h3>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-slate-700 shadow-xs border border-slate-200">
                      {items.length}
                    </span>
                  </div>
                </div>

                {/* Cards Container */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[150px] pr-0.5">
                  {items.length > 0 ? (
                    items.map((lead) => (
                      <div
                        key={lead.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        className="group relative cursor-grab active:cursor-grabbing rounded-lg border border-slate-200 bg-white p-3.5 shadow-sm transition-all hover:shadow-md hover:border-slate-300"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <Link
                            href={`/customers/${lead.customer.id}`}
                            className="text-xs font-bold text-slate-900 hover:text-red-600 hover:underline"
                          >
                            {lead.customer.name}
                          </Link>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
                            {lead.source}
                          </span>
                        </div>

                        <div className="mt-2 space-y-1 text-[11px] text-slate-500">
                          <p className="flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            {lead.customer.district}
                            {lead.customer.block ? `, ${lead.customer.block}` : ""}
                          </p>

                          {lead.customer.monthlyBill && (
                            <p className="flex items-center gap-1 font-medium text-slate-700">
                              <IndianRupee size={12} className="text-emerald-600" />
                              Bill: ₹{lead.customer.monthlyBill.toLocaleString()}/mo
                            </p>
                          )}
                        </div>

                        {/* Quick Actions & Stage Select */}
                        <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px]">
                          <a
                            href={`tel:${lead.customer.mobile}`}
                            className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                          >
                            <Phone size={12} />
                            Call
                          </a>

                          {/* Quick Mobile Touch Select for changing stage */}
                          <select
                            value={lead.stage}
                            onChange={(e) => handleStageChange(lead.id, e.target.value)}
                            className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 focus:outline-none"
                          >
                            {STAGES.map((s) => (
                              <option key={s.key} value={s.key}>
                                &rarr; {s.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex h-28 items-center justify-center rounded-lg border border-dashed border-slate-300 text-xs text-slate-400">
                      Drag lead here
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* LIST VIEW */
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Monthly Bill</th>
                  <th className="py-3 px-4">Source</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4">Assigned To</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredLeads.map((lead) => {
                  const stageObj = STAGES.find((s) => s.key === lead.stage)
                  return (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <Link
                          href={`/customers/${lead.customer.id}`}
                          className="font-bold text-slate-900 hover:text-red-600 hover:underline"
                        >
                          {lead.customer.name}
                        </Link>
                        <p className="text-[11px] text-slate-400">{lead.customer.mobile}</p>
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {lead.customer.district}
                        {lead.customer.block ? `, ${lead.customer.block}` : ""}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-800">
                        {lead.customer.monthlyBill
                          ? `₹${lead.customer.monthlyBill.toLocaleString()}`
                          : "—"}
                      </td>
                      <td className="py-3 px-4 text-slate-500">{lead.source}</td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.stage}
                          onChange={(e) => handleStageChange(lead.id, e.target.value)}
                          className={`rounded-md px-2 py-1 text-xs font-bold ${
                            stageObj?.badge || "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{lead.employee.name}</td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`tel:${lead.customer.mobile}`}
                          className="inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 hover:bg-emerald-100"
                        >
                          <Phone size={12} />
                          Call
                        </a>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: New Lead */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Add New Solar Lead</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    District (Jharkhand) *
                  </label>
                  <select
                    value={formData.district}
                    onChange={(e) =>
                      setFormData({ ...formData, district: e.target.value, block: "" })
                    }
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  >
                    {DISTRICT_LIST.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Block</label>
                  <select
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  >
                    <option value="">Select Block</option>
                    {availableBlocks.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Monthly Electricity Bill (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 2500"
                    value={formData.monthlyBill}
                    onChange={(e) => setFormData({ ...formData, monthlyBill: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Roof Type</label>
                  <select
                    value={formData.roofType}
                    onChange={(e) => setFormData({ ...formData, roofType: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  >
                    <option value="RCC / Concrete">RCC / Concrete</option>
                    <option value="Metal / Tin Sheet">Metal / Tin Sheet</option>
                    <option value="Asbestos">Asbestos</option>
                    <option value="Tiled">Tiled</option>
                    <option value="Ground / Open Space">Ground / Open Space</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  >
                    <option value="Reference">Reference</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Camp / Event">Camp / Event</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Phone Inquiry">Phone Inquiry</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Initial Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                  >
                    {STAGES.map((s) => (
                      <option key={s.key} value={s.key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-3.5 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Lost Reason */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Mark Lead as Lost</h3>
            <p className="mt-1 text-xs text-slate-500">
              Please specify the reason for losing this lead to help improve conversion.
            </p>

            <div className="mt-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Reason</label>
              <select
                value={lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:outline-none"
              >
                <option value="">Select a reason</option>
                <option value="Price too high">Price too high / Budget constraint</option>
                <option value="Competitor offered cheaper">Competitor offered cheaper</option>
                <option value="Subsidy delay / JBVNL issues">Subsidy delay / JBVNL issues</option>
                <option value="Roof structural issues">Roof structural issues</option>
                <option value="Customer dropped idea">Customer dropped idea</option>
                <option value="Not reachable">Not reachable</option>
              </select>
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowLostModal(null)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmLost}
                className="rounded-lg bg-rose-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
              >
                Confirm Lost
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
