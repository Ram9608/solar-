"use client"

import { useState, useEffect } from "react"
import {
  Package,
  Plus,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  TrendingDown,
  Warehouse,
  X,
  Search,
} from "lucide-react"

type InventoryItem = {
  id: string
  name: string
  quantity: number
  status: "IN" | "OUT" | "RETURNED" | "DAMAGED"
  updatedAt: string
}

export default function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [counts, setCounts] = useState({ inStock: 0, dispatched: 0, returned: 0, damaged: 0 })
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [filter, setFilter] = useState("ALL")
  const [search, setSearch] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    quantity: "10",
    status: "IN",
  })

  const loadInventory = async () => {
    try {
      const res = await fetch("/api/inventory")
      if (res.ok) {
        const data = await res.json()
        setItems(data.items || [])
        setCounts(data.counts || { inStock: 0, dispatched: 0, returned: 0, damaged: 0 })
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        setShowAddModal(false)
        setFormData({ name: "", quantity: "10", status: "IN" })
        loadInventory()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filteredItems = items.filter((i) => {
    const matchFilter = filter === "ALL" || i.status === filter
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Warehouse Inventory & Material Tracking
            </h1>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              Ranchi Central Depot
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track solar panels, string inverters, DC cables, returns from site, and damaged goods.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
        >
          <Plus size={16} />
          Log Item / Stock
        </button>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Stock</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <Warehouse size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.inStock}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Dispatched (Out)</span>
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Package size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{counts.dispatched}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Material Return</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <RotateCcw size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-2">{counts.returned}</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Damaged Material</span>
            <div className="p-2 rounded-lg bg-rose-50 text-rose-600">
              <AlertTriangle size={18} />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 mt-2">{counts.damaged}</p>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search inventory items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="IN">In Stock</option>
              <option value="OUT">Dispatched</option>
              <option value="RETURNED">Returned</option>
              <option value="DAMAGED">Damaged</option>
            </select>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-2.5 px-3">Item Name</th>
                <th className="py-2.5 px-3">Quantity</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{item.name}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-mono font-bold ${
                        item.quantity <= 5 && item.status === "IN"
                          ? "text-rose-600"
                          : "text-slate-800"
                      }`}
                    >
                      {item.quantity}
                    </span>
                    {item.quantity <= 5 && item.status === "IN" && (
                      <span className="ml-2 rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold text-rose-600">
                        Low Stock
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.status === "IN"
                          ? "bg-emerald-100 text-emerald-800"
                          : item.status === "OUT"
                          ? "bg-blue-100 text-blue-800"
                          : item.status === "RETURNED"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400 text-[11px]">
                    {new Date(item.updatedAt).toLocaleDateString([], {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Inventory Item */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Log Inventory Item</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Item Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solar Panel 545W Mono PERC"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Condition / Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full rounded-lg border border-slate-200 p-2 focus:border-red-500 focus:outline-none"
                >
                  <option value="IN">In Warehouse (Stock Available)</option>
                  <option value="OUT">Dispatched to Site</option>
                  <option value="RETURNED">Material Return (Surplus from site)</option>
                  <option value="DAMAGED">Damaged / Transit Breakage</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-1.5 font-semibold text-white hover:bg-red-700"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
