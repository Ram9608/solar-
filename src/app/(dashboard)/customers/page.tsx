"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import {
  Search, Filter, Download, Upload, Plus, Phone, ChevronLeft, ChevronRight,
  X, Users, AlertCircle, Loader2
} from "lucide-react"
import { DISTRICT_LIST, JHARKHAND_DISTRICTS } from "@/lib/master-data"

type Customer = {
  id: string
  name: string
  mobile: string
  altMobile: string | null
  address: string
  district: string
  block: string | null
  village: string | null
  pincode: string | null
  monthlyBill: number | null
  roofType: string | null
  status: string
  employee: { id: string; name: string }
  createdAt: string
}

type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [district, setDistrict] = useState("")
  const [block, setBlock] = useState("")
  const [status, setStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const fetchCustomers = useCallback(async (page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "20",
        ...(search && { search }),
        ...(district && { district }),
        ...(block && { block }),
        ...(status && { status }),
      })
      const res = await fetch(`/api/customers?${params}`)
      const data = await res.json()
      setCustomers(data.customers || [])
      setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    } catch (err) {
      console.error("Failed to fetch customers:", err)
    } finally {
      setLoading(false)
    }
  }, [search, district, block, status])

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(1), 300)
    return () => clearTimeout(timer)
  }, [fetchCustomers])

  const handleExport = async () => {
    const params = new URLSearchParams()
    if (district) params.set("district", district)
    if (status) params.set("status", status)
    window.open(`/api/customers/export?${params}`, "_blank")
  }

  const blocks = district ? JHARKHAND_DISTRICTS[district] || [] : []

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Customers</h1>
          <p className="text-slate-500 text-sm mt-1">
            {pagination.total} total customers
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Upload size={16} />
            <span>Import</span>
          </button>
          <button
            onClick={handleExport}
            className="flex items-center space-x-1.5 px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Download size={16} />
            <span>Export</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by name, mobile, address, village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center space-x-1.5 px-4 py-2.5 text-sm border rounded-lg transition-colors ${
              showFilters || district || status
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Filter size={16} />
            <span>Filters</span>
            {(district || status) && (
              <span className="ml-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
                {[district, status].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">District</label>
              <select
                value={district}
                onChange={(e) => { setDistrict(e.target.value); setBlock("") }}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All Districts</option>
                {DISTRICT_LIST.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Block</label>
              <select
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                disabled={!district}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                <option value="">All Blocks</option>
                {blocks.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">All</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
            {(district || status || block) && (
              <div className="sm:col-span-3">
                <button
                  onClick={() => { setDistrict(""); setBlock(""); setStatus("") }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center space-x-1"
                >
                  <X size={14} />
                  <span>Clear all filters</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Customer Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={32} className="animate-spin mb-3" />
            <p className="text-sm">Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-slate-400">
            <Users size={48} className="mb-3 text-slate-300" />
            <p className="font-medium text-slate-600">No customers found</p>
            <p className="text-sm mt-1">
              {search || district || status
                ? "Try adjusting your search or filters"
                : "Add your first customer to get started"}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Mobile</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">District</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Monthly Bill</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Assigned To</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/customers/${customer.id}`} className="hover:text-red-600 transition-colors">
                          <p className="font-medium text-slate-900">{customer.name}</p>
                          <p className="text-xs text-slate-500 sm:hidden">{customer.mobile}</p>
                          <p className="text-xs text-slate-400 md:hidden">{customer.district}</p>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-slate-700 font-mono text-xs">{customer.mobile}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-slate-700">{customer.district}</span>
                        {customer.block && (
                          <span className="text-xs text-slate-400 block">{customer.block}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {customer.monthlyBill ? (
                          <span className="text-slate-700">₹{customer.monthlyBill.toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-slate-600 text-xs">{customer.employee?.name || "-"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <a
                            href={`tel:${customer.mobile}`}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Call customer"
                          >
                            <Phone size={16} />
                          </a>
                          <Link
                            href={`/customers/${customer.id}`}
                            className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors font-medium"
                          >
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => fetchCustomers(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const p = i + 1
                    return (
                      <button
                        key={p}
                        onClick={() => fetchCustomers(p)}
                        className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                          p === pagination.page
                            ? "bg-red-600 text-white"
                            : "hover:bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => fetchCustomers(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-1.5 rounded-md hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <AddCustomerModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => { setShowAddModal(false); fetchCustomers(1) }}
        />
      )}

      {/* Import Modal */}
      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => { setShowImportModal(false); fetchCustomers(1) }}
        />
      )}
    </div>
  )
}

// ─── Add Customer Modal ───────────────────────────────────────────
function AddCustomerModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [form, setForm] = useState({
    name: "", mobile: "", altMobile: "", address: "", district: "", block: "",
    village: "", pincode: "", electricityConsumerNo: "", monthlyBill: "",
    roofType: "", employeeId: "",
  })
  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([])
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/employees").then((r) => r.json()).then(setEmployees).catch(() => {})
  }, [])

  const blocks = form.district ? JHARKHAND_DISTRICTS[form.district] || [] : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.mobile || !form.district || !form.employeeId) {
      setError("Please fill in Name, Mobile, District and Assigned Employee")
      return
    }
    setSaving(true)
    setError("")
    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Failed to create customer")
        return
      }
      onSuccess()
    } catch (err) {
      setError("Network error. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-slate-900">Add New Customer</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm border border-red-100">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mobile *</label>
              <input type="text" required maxLength={10} value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono" placeholder="10-digit number" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alternate Mobile</label>
              <input type="text" maxLength={10} value={form.altMobile} onChange={(e) => setForm({ ...form, altMobile: e.target.value.replace(/\D/g, "").slice(0, 10) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">District *</label>
              <select required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value, block: "" })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                <option value="">Select district</option>
                {DISTRICT_LIST.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Block</label>
              <select value={form.block} onChange={(e) => setForm({ ...form, block: e.target.value })} disabled={!form.district}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:opacity-50">
                <option value="">Select block</option>
                {blocks.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Village</label>
              <input type="text" value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
              <input type="text" maxLength={6} value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Electricity Consumer No.</label>
              <input type="text" value={form.electricityConsumerNo} onChange={(e) => setForm({ ...form, electricityConsumerNo: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Bill (₹)</label>
              <input type="number" value={form.monthlyBill} onChange={(e) => setForm({ ...form, monthlyBill: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Roof Type</label>
              <select value={form.roofType} onChange={(e) => setForm({ ...form, roofType: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                <option value="">Select</option>
                <option value="RCC / Concrete">RCC / Concrete</option>
                <option value="Metal / Tin Sheet">Metal / Tin Sheet</option>
                <option value="Tiled">Tiled</option>
                <option value="Asbestos">Asbestos</option>
                <option value="Wooden">Wooden</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assigned Employee *</label>
              <select required value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
                <option value="">Select employee</option>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 font-medium">
              {saving ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Import Modal ───────────────────────────────────────────────
function ImportModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleImport = async () => {
    if (!file) return
    setImporting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/customers/import", { method: "POST", body: formData })
      const data = await res.json()
      setResult(data)
      if (data.success > 0) {
        setTimeout(onSuccess, 2000)
      }
    } catch (err) {
      setResult({ error: "Failed to process file" })
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Import Customers</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          {!result ? (
            <>
              <p className="text-sm text-slate-600">
                Upload an Excel (.xlsx) or CSV file. Required columns: <strong>name</strong>, <strong>mobile</strong>.
                Optional: altMobile, address, district, block, village, pincode, electricityConsumerNo, monthlyBill, roofType, employee, employeeMobile.
              </p>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center">
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mx-auto text-sm"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                <button
                  onClick={handleImport}
                  disabled={!file || importing}
                  className="px-6 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium"
                >
                  {importing ? "Importing..." : "Upload & Import"}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-emerald-600">{result.success}</p>
                  <p className="text-xs text-emerald-700">Imported</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-orange-600">{result.duplicates}</p>
                  <p className="text-xs text-orange-700">Duplicates</p>
                </div>
                <div className="bg-red-50 rounded-lg p-3">
                  <p className="text-2xl font-bold text-red-600">{result.errors?.length || 0}</p>
                  <p className="text-xs text-red-700">Errors</p>
                </div>
              </div>
              {result.errors && result.errors.length > 0 && (
                <div className="max-h-48 overflow-y-auto bg-slate-50 rounded-lg p-3 text-xs space-y-1">
                  {result.errors.map((err: any, i: number) => (
                    <div key={i} className="flex items-start space-x-2">
                      <span className="text-slate-400 shrink-0">Row {err.row}:</span>
                      <span className="text-red-600">{err.message}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-end">
                <button onClick={onClose} className="px-4 py-2 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg font-medium">Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
