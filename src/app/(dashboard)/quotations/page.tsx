"use client"

import { useState, useEffect } from "react"
import {
  Sparkles,
  FileText,
  IndianRupee,
  Download,
  Share2,
  Printer,
  CheckCircle2,
  Layers,
  Edit2,
  Save,
  X,
  Sun,
  ShieldCheck,
  TrendingUp,
  Cpu,
  Percent,
} from "lucide-react"

import PrintQuotation from "@/components/print/PrintQuotation"
import PrintInvoice from "@/components/print/PrintInvoice"

type Customer = {
  id: string
  name: string
  mobile: string
  district: string
  monthlyBill: number | null
  roofType: string | null
}

type RateItem = {
  id: string
  item: string
  price: number
  unit: string
}

type BOMItem = {
  item: string
  qty: number
  unit: string
  rate: number
  total: number
}

type QuotationResult = {
  systemSizeKW: number
  panelChoice: string
  inverterChoice: string
  billOfMaterials: BOMItem[]
  subtotal: number
  gst: number
  totalCost: number
  subsidyExpected: number
  netPayable: number
  monthlySavings: number
  annualSavings: number
  paybackYears: number
  aiExplanation: string
}

export default function QuotationsPage() {
  const [activeTab, setActiveTab] = useState<"generator" | "ratelist">("generator")
  const [printMode, setPrintMode] = useState<"QUOTATION" | "INVOICE">("QUOTATION")
  const [customers, setCustomers] = useState<Customer[]>([])
  const [rateList, setRateList] = useState<RateItem[]>([])
  const [editingRateId, setEditingRateId] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState<string>("")

  // Generator form
  const [selectedCustomerId, setSelectedCustomerId] = useState("")
  const [monthlyBill, setMonthlyBill] = useState("2500")
  const [roofAreaSqFt, setRoofAreaSqFt] = useState("400")
  const [roofType, setRoofType] = useState("RCC / Concrete")
  const [notes, setNotes] = useState("")
  const [generating, setGenerating] = useState(false)
  const [quoteResult, setQuoteResult] = useState<QuotationResult | null>(null)

  useEffect(() => {
    // Load customers and rate list
    fetch("/api/customers?limit=100")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .catch(console.error)

    fetchRateList()
  }, [])

  const fetchRateList = async () => {
    try {
      const res = await fetch("/api/rate-list")
      if (res.ok) {
        const data = await res.json()
        setRateList(data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleCustomerSelect = (custId: string) => {
    setSelectedCustomerId(custId)
    const cust = customers.find((c) => c.id === custId)
    if (cust) {
      if (cust.monthlyBill) setMonthlyBill(String(cust.monthlyBill))
      if (cust.roofType) setRoofType(cust.roofType)
    }
  }

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const res = await fetch("/api/quotations/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          monthlyBill,
          roofAreaSqFt,
          roofType,
          notes,
        }),
      })

      if (res.ok) {
        const result = await res.json()
        setQuoteResult(result)
      } else {
        alert("Failed to generate AI quotation")
      }
    } catch (e) {
      console.error(e)
    } finally {
      setGenerating(false)
    }
  }

  const handleSaveRate = async (id: string) => {
    try {
      await fetch("/api/rate-list", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, price: editPrice }),
      })
      setEditingRateId(null)
      fetchRateList()
    } catch (e) {
      console.error(e)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)
    const shareText = `Solar Proposal for ${selectedCustomer?.name || "Client"}: ${
      quoteResult?.systemSizeKW
    } kW System. Net Investment: ₹${quoteResult?.netPayable.toLocaleString()} after ₹${quoteResult?.subsidyExpected.toLocaleString()} PM Surya Ghar Subsidy.`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Solar Quotation",
          text: shareText,
          url: window.location.href,
        })
      } catch (err) {
        console.warn(err)
      }
    } else {
      navigator.clipboard.writeText(shareText)
      alert("Quotation details copied to clipboard!")
    }
  }

  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              AI Solar Quotations & Rate List
            </h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700 flex items-center gap-1">
              <Cpu size={12} />
              Groq GPT-OSS 120B
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Automated PM Surya Ghar subsidy optimization with strict database rate-list pricing.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
          <button
            onClick={() => setActiveTab("generator")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "generator" ? "bg-red-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sparkles size={14} />
            AI Generator
          </button>
          <button
            onClick={() => setActiveTab("ratelist")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
              activeTab === "ratelist" ? "bg-red-600 text-white" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers size={14} />
            Master Rate List ({rateList.length})
          </button>
        </div>
      </div>

      {activeTab === "ratelist" ? (
        /* RATE LIST EDITOR */
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Editable Master Rate List</h2>
              <p className="text-xs text-slate-500">
                AI quotations pull baseline rates strictly from this table. AI never invents prices.
              </p>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Equipment / Component</th>
                  <th className="py-2.5 px-3">Unit</th>
                  <th className="py-2.5 px-3">Base Price (INR)</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {rateList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-900">{item.item}</td>
                    <td className="py-3 px-3 text-slate-500">{item.unit}</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {editingRateId === item.id ? (
                        <div className="flex items-center gap-1">
                          <span>₹</span>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 rounded border border-slate-300 px-2 py-0.5 text-xs"
                          />
                        </div>
                      ) : (
                        `₹${item.price.toLocaleString()}`
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      {editingRateId === item.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleSaveRate(item.id)}
                            className="inline-flex items-center gap-1 rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-emerald-700"
                          >
                            <Save size={12} /> Save
                          </button>
                          <button
                            onClick={() => setEditingRateId(null)}
                            className="rounded border border-slate-200 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingRateId(item.id)
                            setEditPrice(String(item.price))
                          }}
                          className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* AI GENERATOR & PROPOSAL VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Parameters Form */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm print:hidden">
            <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-1.5">
              <Sparkles size={16} className="text-red-600" />
              Customer Inputs
            </h2>

            <form onSubmit={handleGenerate} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerSelect(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="">Select a customer...</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.district}) - {c.mobile}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Monthly Electricity Bill (₹) *
                </label>
                <input
                  type="number"
                  required
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Available Roof Area (sq. ft.)
                </label>
                <input
                  type="number"
                  value={roofAreaSqFt}
                  onChange={(e) => setRoofAreaSqFt(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Roof Type</label>
                <select
                  value={roofType}
                  onChange={(e) => setRoofType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                >
                  <option value="RCC / Concrete">RCC / Concrete</option>
                  <option value="Metal / Tin Sheet">Metal / Tin Sheet</option>
                  <option value="Asbestos">Asbestos</option>
                  <option value="Tiled">Tiled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Engineering Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Inverter location near staircase, 3-phase connection available."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs focus:border-red-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 font-bold text-xs text-white shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Sparkles size={16} />
                {generating ? "Engineering Solution..." : "Generate AI Quotation"}
              </button>
            </form>
          </div>

          {/* Quotation Preview / Printable Sheet */}
          <div className="lg:col-span-8">
            {quoteResult ? (
              <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
                {/* Proposal Action Buttons */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 print:hidden">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                      Engineering Verified
                    </span>
                    <span className="text-xs text-slate-400">Version 1.0 (Final)</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleShare}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Share2 size={14} />
                      Share
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => { setPrintMode("QUOTATION"); setTimeout(handlePrint, 100); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-red-700 shadow-sm"
                      >
                        <Printer size={14} />
                        Print Quotation
                      </button>
                      <button
                        onClick={() => { setPrintMode("INVOICE"); setTimeout(handlePrint, 100); }}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
                      >
                        <Printer size={14} />
                        Print GST Bill
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden print:block">
                  {printMode === "QUOTATION" ? (
                    <PrintQuotation quoteResult={quoteResult} selectedCustomer={selectedCustomer} />
                  ) : (
                    <PrintInvoice quoteResult={quoteResult} selectedCustomer={selectedCustomer} />
                  )}
                </div>

                {/* UI Preview (Hidden in Print) */}
                <div className="print:hidden">

                {/* Printable Header */}
                <div className="flex justify-between items-start border-b-2 border-red-600 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md">
                      <Sun size={28} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        SOLAR CRM EPC SOLUTIONS
                      </h2>
                      <p className="text-xs text-slate-500 font-medium">
                        PM Surya Ghar: Muft Bijli Yojana Authorized Channel Partner &bull; Jharkhand
                      </p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <p className="font-bold text-slate-900">OFFICIAL PROPOSAL</p>
                    <p className="text-slate-500 font-mono">
                      REF-JH-{Math.floor(100000 + Math.random() * 900000)}
                    </p>
                    <p className="text-slate-400 mt-1">
                      Date: {new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Customer Details & System Highlights */}
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-4 text-xs">
                  <div>
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                      Prepared For:
                    </span>
                    <p className="font-extrabold text-sm text-slate-900 mt-0.5">
                      {selectedCustomer?.name || "Valued Client"}
                    </p>
                    <p className="text-slate-600">
                      {selectedCustomer?.district || "Jharkhand"}, India
                    </p>
                    <p className="text-slate-500">{selectedCustomer?.mobile || ""}</p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                      Proposed System:
                    </span>
                    <p className="font-extrabold text-sm text-red-600 mt-0.5">
                      {quoteResult.systemSizeKW} kW On-Grid Solar System
                    </p>
                    <p className="text-slate-600">{quoteResult.panelChoice}</p>
                    <p className="text-slate-500">{quoteResult.inverterChoice}</p>
                  </div>
                </div>

                {/* AI Engineering Rationale */}
                <div className="rounded-xl border border-red-100 bg-red-50/50 p-3.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-red-700 mb-1">
                    <Sparkles size={14} />
                    AI Engineering Analysis (Groq GPT-OSS 120B)
                  </div>
                  <p className="text-slate-700 leading-relaxed italic">{quoteResult.aiExplanation}</p>
                </div>

                {/* Bill of Materials (BOM Table) */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Commercial Proposal
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-2 px-3">Description</th>
                          <th className="py-2 px-3 text-center">Qty</th>
                          <th className="py-2 px-3 text-right">Taxable Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        <tr className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-900">
                            Principle supply of (PREMIER) solar on grid {quoteResult.systemSizeKW}Kwp spgs system
                          </td>
                          <td className="py-2 px-3 text-center">1 SET</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{(quoteResult.subtotal * 0.8).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                        <tr className="hover:bg-slate-50">
                          <td className="py-2 px-3 font-medium text-slate-900">
                            {quoteResult.systemSizeKW}Kwp AC side material supply & Installation
                          </td>
                          <td className="py-2 px-3 text-center">1 SET</td>
                          <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                            ₹{(quoteResult.subtotal * 0.2).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Financial Summary Calculation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="rounded-xl border border-slate-200 p-4 text-xs space-y-2">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1">
                      <TrendingUp size={14} className="text-emerald-600" />
                      Estimated Return on Investment
                    </h4>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Estimated Monthly Savings:</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        ~₹{quoteResult.monthlySavings.toLocaleString()}/mo
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Estimated Annual Savings:</span>
                      <span className="font-bold text-emerald-600 font-mono">
                        ~₹{quoteResult.annualSavings.toLocaleString()}/yr
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Estimated Payback Period:</span>
                      <span className="font-bold text-slate-900 font-mono">
                        {quoteResult.paybackYears} Years
                      </span>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs space-y-2 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal (Equip & Labour):</span>
                      <span>₹{quoteResult.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>GST (Solar EPC ~13.8%):</span>
                      <span>₹{quoteResult.gst.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1.5">
                      <span>Total Project Cost:</span>
                      <span>₹{quoteResult.totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                      <span>PM Surya Ghar Subsidy:</span>
                      <span>- ₹{quoteResult.subsidyExpected.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-extrabold text-sm text-red-600 border-t-2 border-slate-900 pt-2">
                      <span className="font-sans">Net Customer Investment:</span>
                      <span>₹{quoteResult.netPayable.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                </div>
              </div>
            ) : (
              <div className="flex h-96 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
                <FileText size={40} className="text-slate-300 mb-2" />
                <h3 className="text-sm font-bold text-slate-700">No Quotation Generated Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in customer monthly bill and roof area on the left and click "Generate AI Quotation" to construct an automated proposal with subsidy calculations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
