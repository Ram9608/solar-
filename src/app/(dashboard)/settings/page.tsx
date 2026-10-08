"use client"

import { useState } from "react"
import { Save, User, Building, Clock, Bell } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage company details, working hours, and notification rules.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-64 space-y-1">
          <TabButton active={activeTab === "company"} onClick={() => setActiveTab("company")} icon={<Building size={18} />} label="Company Details" />
          <TabButton active={activeTab === "hours"} onClick={() => setActiveTab("hours")} icon={<Clock size={18} />} label="Working Hours" />
          <TabButton active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} icon={<Bell size={18} />} label="Notifications" />
          <TabButton active={activeTab === "profile"} onClick={() => setActiveTab("profile")} icon={<User size={18} />} label="My Profile" />
        </div>

        <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-6 min-h-[400px]">
          {activeTab === "company" && <CompanySettings />}
          {activeTab === "hours" && <WorkingHoursSettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "profile" && <ProfileSettings />}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? "bg-red-50 text-red-700" 
          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function CompanySettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Company Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
          <input type="text" defaultValue="DMD Solutions" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email</label>
          <input type="email" defaultValue="info@dmdsolutions.in" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">Company Logo URL</label>
          <input type="text" defaultValue="https://dmdsolutions.in/assets/dmdsolutions.png" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}

function WorkingHoursSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Working Hours & Attendance</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start Time</label>
          <input type="time" defaultValue="09:30" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">End Time</label>
          <input type="time" defaultValue="18:30" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Late Mark After</label>
          <input type="time" defaultValue="10:00" className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Weekly Off</label>
          <select className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500">
            <option value="0">Sunday</option>
            <option value="6">Saturday</option>
            <option value="1">Monday</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end">
        <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium">
          <Save size={16} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  )
}

function NotificationSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Notification Rules</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-800">Push Notifications</h3>
            <p className="text-xs text-slate-500">Receive alerts even when app is closed</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-slate-800">Follow-up Reminders</h3>
            <p className="text-xs text-slate-500">Notify 1 hour before follow-up</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
      </div>
    </div>
  )
}

function ProfileSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">My Profile</h2>
      <p className="text-sm text-slate-500">Edit your personal details and change password here.</p>
    </div>
  )
}
