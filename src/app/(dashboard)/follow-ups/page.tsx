"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import {
  Clock,
  Plus,
  Phone,
  CheckCircle2,
  AlertCircle,
  Calendar,
  RotateCw,
  Search,
  Filter,
  X,
  User,
  MapPin,
  CalendarDays,
  Sparkles,
} from "lucide-react"

type FollowUp = {
  id: string
  dueDate: string
  note: string
  status: string
  reminded: boolean
  customerId: string | null
  assignedToId: string
  customer: {
    id: string
    name: string
    mobile: string
    district: string
    address: string
  } | null
  assignedTo: {
    id: string
    name: string
  }
}

export default function FollowUpsPage() {
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<"today" | "overdue" | "upcoming" | "all" | "done">("today")
  const [search, setSearch] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [customers, setCustomers] = useState<any[]>([])

  // New follow up form
  const [newFollowUp, setNewFollowUp] = useState({
    customerId: "",
    note: "",
    dueDate: "",
  })

  // Snooze modal
  const [snoozeModalId, setSnoozeModalId] = useState<string | null>(null)

  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  useEffect(() => {
    setCurrentDate(new Date())
  }, [])

  const loadFollowUps = async () => {
    try {
      const res = await fetch("/api/follow-ups?status=ALL")
      if (res.ok) {
        const data = await res.json()
        setFollowUps(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadCustomers = async () => {
    try {
      const res = await fetch("/api/customers?limit=100")
      if (res.ok) {
        const data = await res.json()
        setCustomers(data.customers || [])
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadFollowUps()
    loadCustomers()
  }, [])

  const markStatus = async (id: string, status: "DONE" | "PENDING") => {
    try {
      await fetch(`/api/follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })
      loadFollowUps()
    } catch (e) {
      console.error(e)
    }
  }

  const snoozeFollowUp = async (id: string, daysToAdd: number, hoursToAdd = 0) => {
    const target = new Date()
    if (hoursToAdd) {
      target.setHours(target.getHours() + hoursToAdd)
    } else {
      target.setDate(target.getDate() + daysToAdd)
    }

    try {
      await fetch(`/api/follow-ups/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dueDate: target.toISOString(), status: "PENDING" }),
      })
      setSnoozeModalId(null)
      loadFollowUps()
    } catch (e) {
      console.error(e)
    }
  }

  // Quick preset calculation for new follow up
  const setQuickDate = (offsetDays: number) => {
    const date = new Date()
    date.setDate(date.getDate() + offsetDays)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    setNewFollowUp((prev) => ({ ...prev, dueDate: `${yyyy}-${mm}-${dd}` }))
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFollowUp.dueDate || !newFollowUp.note) {
      alert("Please provide both due date and note")
      return
    }

    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFollowUp),
      })
      if (res.ok) {
        setShowAddModal(false)
        setNewFollowUp({ customerId: "", note: "", dueDate: "" })
        loadFollowUps()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Categorize
  const todayStart = useMemo(() => {
    if (!currentDate) return null
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate())
  }, [currentDate])

  const todayEnd = useMemo(() => {
    if (!todayStart) return null
    const d = new Date(todayStart)
    d.setDate(d.getDate() + 1)
    return d
  }, [todayStart])

  const categorized = useMemo(() => {
    const overdue: FollowUp[] = []
    const today: FollowUp[] = []
    const upcoming: FollowUp[] = []
    const done: FollowUp[] = []

    if (!todayStart || !todayEnd) return { overdue, today, upcoming, done, all: followUps }

    followUps.forEach((f) => {
      if (f.status === "DONE") {
        done.push(f)
        return
      }
      const due = new Date(f.dueDate)
      if (due < todayStart) {
        overdue.push(f)
      } else if (due >= todayStart && due < todayEnd) {
        today.push(f)
      } else {
        upcoming.push(f)
      }
    })

    return { overdue, today, upcoming, done, all: followUps }
  }, [followUps, todayStart, todayEnd])

  const currentList = categorized[tab] || []
  const filteredList = currentList.filter((f) => {
    if (!search) return true
    const term = search.toLowerCase()
    return (
      f.note.toLowerCase().includes(term) ||
      f.customer?.name.toLowerCase().includes(term) ||
      f.customer?.mobile.includes(term) ||
      f.customer?.district.toLowerCase().includes(term)
    )
  })

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Follow-ups & Reminder Engine
            </h1>
            {categorized.overdue.length > 0 && (
              <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700 animate-pulse">
                {categorized.overdue.length} Overdue
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Never miss a customer inquiry. Auto-notifications sent to sales agents and owner.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700 transition-colors"
        >
          <Plus size={16} />
          Schedule Follow-up
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab("today")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === "today"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Calendar size={14} />
          Today's Follow-ups ({categorized.today.length})
        </button>

        <button
          onClick={() => setTab("overdue")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === "overdue"
              ? "bg-rose-600 text-white"
              : "text-rose-600 hover:bg-rose-50"
          }`}
        >
          <AlertCircle size={14} />
          Overdue ({categorized.overdue.length})
        </button>

        <button
          onClick={() => setTab("upcoming")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === "upcoming"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CalendarDays size={14} />
          Upcoming ({categorized.upcoming.length})
        </button>

        <button
          onClick={() => setTab("done")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === "done"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 size={14} />
          Completed ({categorized.done.length})
        </button>

        <button
          onClick={() => setTab("all")}
          className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
            tab === "all"
              ? "bg-slate-900 text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          All ({categorized.all.length})
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          type="text"
          placeholder="Filter follow-ups by customer name, phone, district, or note..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-red-500 focus:outline-none shadow-sm"
        />
      </div>

      {/* Follow-ups List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredList.map((f) => {
            const isOverdue = todayStart ? new Date(f.dueDate) < todayStart && f.status !== "DONE" : false
            const isDone = f.status === "DONE"

            return (
              <div
                key={f.id}
                className={`rounded-xl border p-4 shadow-sm transition-all hover:shadow-md flex flex-col justify-between ${
                  isDone
                    ? "border-slate-200 bg-slate-50 opacity-75"
                    : isOverdue
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {f.customer ? (
                        <Link
                          href={`/customers/${f.customer.id}`}
                          className="text-sm font-bold text-slate-900 hover:text-red-600 hover:underline"
                        >
                          {f.customer.name}
                        </Link>
                      ) : (
                        <span className="text-sm font-bold text-slate-900">General Reminder</span>
                      )}
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-slate-400" />
                        {f.customer?.district || "Jharkhand"} &bull; Agent: {f.assignedTo.name}
                      </p>
                    </div>

                    {f.customer?.mobile && (
                      <a
                        href={`tel:${f.customer.mobile}`}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                        title="Call Customer"
                      >
                        <Phone size={14} />
                      </a>
                    )}
                  </div>

                  <div className="mt-3 rounded-lg bg-white/80 p-2.5 border border-slate-100 text-xs text-slate-700 italic">
                    "{f.note}"
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span
                    className={`flex items-center gap-1 font-semibold ${
                      isDone
                        ? "text-emerald-600"
                        : isOverdue
                        ? "text-rose-600"
                        : "text-slate-500"
                    }`}
                  >
                    <Clock size={13} />
                    {new Date(f.dueDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {!isDone && (
                      <button
                        onClick={() => setSnoozeModalId(f.id)}
                        className="rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Snooze
                      </button>
                    )}

                    <button
                      onClick={() => markStatus(f.id, isDone ? "PENDING" : "DONE")}
                      className={`inline-flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                        isDone
                          ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                          : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                      }`}
                    >
                      <CheckCircle2 size={12} />
                      {isDone ? "Undo" : "Mark Done"}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 text-center">
          <Clock size={32} className="text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">No follow-ups in this category</p>
          <p className="text-[11px] text-slate-400 mt-0.5">Use the button above to schedule one.</p>
        </div>
      )}

      {/* Modal: Schedule Follow-up with Quick Buttons */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Schedule Quick Follow-up</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  value={newFollowUp.customerId}
                  onChange={(e) =>
                    setNewFollowUp({ ...newFollowUp, customerId: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="">General reminder (No specific customer)</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district}) - {c.mobile}
                    </option>
                  ))}
                </select>
              </div>

              {/* QUICK BUTTONS as requested by user! */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Quick Due Date Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setQuickDate(2)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +2 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(7)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +1 Week
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(30)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +1 Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(90)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +3 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(180)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickDate(365)}
                    className="rounded-lg border border-slate-200 bg-slate-50 py-1.5 font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  >
                    +1 Year
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Custom Due Date *
                </label>
                <input
                  type="date"
                  required
                  value={newFollowUp.dueDate}
                  onChange={(e) =>
                    setNewFollowUp({ ...newFollowUp, dueDate: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Follow-up Note *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. Wants 5kW on-grid system after monsoon. Call to explain PM Surya Ghar subsidy."
                  value={newFollowUp.note}
                  onChange={(e) => setNewFollowUp({ ...newFollowUp, note: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                />
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
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Snooze */}
      {snoozeModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-xs rounded-xl border border-slate-200 bg-white p-4 shadow-2xl">
            <h3 className="text-sm font-bold text-slate-900">Snooze Follow-up</h3>
            <p className="mt-1 text-xs text-slate-500">Delay reminder notification:</p>

            <div className="mt-3 space-y-2 text-xs">
              <button
                onClick={() => snoozeFollowUp(snoozeModalId, 0, 1)}
                className="w-full rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                +1 Hour
              </button>
              <button
                onClick={() => snoozeFollowUp(snoozeModalId, 1)}
                className="w-full rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Tomorrow Morning
              </button>
              <button
                onClick={() => snoozeFollowUp(snoozeModalId, 3)}
                className="w-full rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                3 Days Later
              </button>
              <button
                onClick={() => snoozeFollowUp(snoozeModalId, 7)}
                className="w-full rounded-lg border border-slate-200 py-2 font-medium text-slate-700 hover:bg-slate-50"
              >
                Next Week
              </button>
            </div>

            <button
              onClick={() => setSnoozeModalId(null)}
              className="mt-3 w-full rounded-lg bg-slate-100 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
