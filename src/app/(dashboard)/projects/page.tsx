"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Briefcase,
  Plus,
  CheckCircle2,
  Clock,
  ArrowRight,
  Phone,
  User,
  Zap,
  MapPin,
  FileCheck,
  Truck,
  Wrench,
  Gauge,
  X,
} from "lucide-react"

type Project = {
  id: string
  stage: "SURVEY" | "MATERIAL_DISPATCH" | "INSTALLATION" | "NET_METER" | "COMMISSIONING"
  subsidyStatus: string | null
  createdAt: string
  updatedAt: string
  customer: {
    id: string
    name: string
    mobile: string
    district: string
    address: string
    electricityConsumerNo: string | null
  }
  assignedTech: {
    id: string
    name: string
    mobile: string
  } | null
}

const STAGES = [
  { key: "SURVEY", label: "Site Survey", icon: FileCheck, color: "bg-blue-50 text-blue-700 border-blue-200" },
  { key: "MATERIAL_DISPATCH", label: "Material Dispatch", icon: Truck, color: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "INSTALLATION", label: "Installation", icon: Wrench, color: "bg-purple-50 text-purple-700 border-purple-200" },
  { key: "NET_METER", label: "Net Meter (JBVNL)", icon: Gauge, color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { key: "COMMISSIONING", label: "Commissioned", icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
]

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [stageFilter, setStageFilter] = useState("ALL")
  const [technicians, setTechnicians] = useState<any[]>([])

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const loadTechnicians = async () => {
    try {
      const res = await fetch("/api/employees")
      if (res.ok) {
        const data = await res.json()
        setTechnicians(data.filter((e: any) => e.role === "TECHNICIAN" || e.role === "SALES"))
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    loadProjects()
    loadTechnicians()
  }, [])

  const updateStage = async (id: string, stage: string) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      })
      loadProjects()
    } catch (e) {
      console.error(e)
    }
  }

  const assignTech = async (id: string, assignedTechId: string) => {
    try {
      await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTechId }),
      })
      loadProjects()
    } catch (e) {
      console.error(e)
    }
  }

  const filteredProjects =
    stageFilter === "ALL" ? projects : projects.filter((p) => p.stage === stageFilter)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Project Execution & JBVNL Net Metering
            </h1>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-700">
              {projects.length} Total Projects
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500">
            Track site survey, hardware transit, rooftop mounting, and DISCOM net meter approvals.
          </p>
        </div>
      </div>

      {/* Stage pipeline steps ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 border-b border-slate-200 pb-4">
        {STAGES.map((s) => {
          const count = projects.filter((p) => p.stage === s.key).length
          const Icon = s.icon
          const isActive = stageFilter === s.key

          return (
            <button
              key={s.key}
              onClick={() => setStageFilter(isActive ? "ALL" : s.key)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isActive
                  ? "border-red-600 bg-red-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon size={18} className={isActive ? "text-red-600" : "text-slate-500"} />
                <span className="font-bold text-xs text-slate-900">{count}</span>
              </div>
              <p className="text-xs font-bold text-slate-900 mt-2 truncate">{s.label}</p>
            </button>
          )
        })}
      </div>

      {/* Projects List */}
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const currentStageObj = STAGES.find((s) => s.key === project.stage)
            return (
              <div
                key={project.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/customers/${project.customer.id}`}
                        className="text-sm font-bold text-slate-900 hover:text-red-600 hover:underline"
                      >
                        {project.customer.name}
                      </Link>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-slate-400" />
                        {project.customer.district} &bull; {project.customer.address}
                      </p>
                    </div>

                    <a
                      href={`tel:${project.customer.mobile}`}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    >
                      <Phone size={14} />
                    </a>
                  </div>

                  {/* Stage Badge & Subsidy */}
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        Current Stage
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${currentStageObj?.color}`}
                      >
                        {currentStageObj?.label}
                      </span>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-2 text-[11px] text-slate-600 space-y-1">
                      <p className="font-semibold text-slate-700">
                        JBVNL Consumer No: {project.customer.electricityConsumerNo || "Pending"}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Subsidy Status: {project.subsidyStatus || "Processing with National Portal"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                  {/* Technician Assign */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">Assigned Tech:</span>
                    <select
                      value={project.assignedTech?.id || ""}
                      onChange={(e) => assignTech(project.id, e.target.value)}
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-800"
                    >
                      <option value="">Unassigned</option>
                      {technicians.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.role})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Move Stage Action */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500">Change Stage:</span>
                    <select
                      value={project.stage}
                      onChange={(e) => updateStage(project.id, e.target.value)}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-900"
                    >
                      {STAGES.map((s) => (
                        <option key={s.key} value={s.key}>
                          &rarr; {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center">
          <Briefcase size={36} className="text-slate-300 mb-2" />
          <p className="text-xs font-semibold text-slate-600">No projects in this stage</p>
        </div>
      )}
    </div>
  )
}
