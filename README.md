# Solar CRM - Jharkhand Operations ☀️

A production-grade Solar CRM web application custom-tailored for solar rooftop installation companies operating across Jharkhand, India. Built with **Next.js (App Router)**, **TypeScript**, **Prisma ORM**, **Neon PostgreSQL**, **Tailwind CSS**, and **Groq AI**.

---

## 🚀 Key Features by Phase

### 1. Dashboard Overview (Reference: DMD Solutions)
- **10 Core Summary KPI Cards**:
  - Total Customers
  - Total Leads
  - Total Done Leads (Won)
  - Total Loss Leads (Closed)
  - Revenue (INR)
  - Active Projects
  - Today Attendance
  - Today Leave
  - Material Returns
  - Damaged Material
- **Visual Analytics with Recharts**:
  - *Leads vs Customers* bar chart grouped by Jharkhand districts (Ranchi, Dhanbad, Bokaro, etc.)
  - *Lead Status Breakdown* interactive donut/pie chart
- **Today Employee Lead Work Table**: Filterable by sales employee with stage conversion breakdown and Reset button.
- **Today's Follow-ups Widget**: Interactive touchpoint reminders with quick "Call" and "Mark Done" buttons.

### 2. Customer Database (List View Only - No Geolocation / No Map)
- Filterable and searchable by all **24 Jharkhand Districts & Blocks**.
- Fields: Name, Mobile, Alternate Mobile, Address, District, Block, Village, Pincode, Electricity Consumer No (JBVNL), Monthly Bill, Roof Type, Status, Assigned Employee.
- One-touch phone dialing link (`tel:`) for immediate calling from mobile or laptop.
- Bulk Excel/CSV Import and Export.
- Detailed Customer Profile page (`/customers/[id]`) with history of visit notes, leads, follow-ups, quotations, and projects.

### 3. Lead & Sales Pipeline
- **Interactive Drag-and-Drop Board + List View** (`/leads`).
- 7 Pipeline Stages:
  1. `NEW`
  2. `CONTACTED`
  3. `SURVEY`
  4. `QUOTATION`
  5. `NEGOTIATION`
  6. `WON` (Auto-creates project in Survey stage upon closing)
  7. `LOST` (Modal prompt for loss reason)

### 4. Follow-up & Reminder Engine
- Quick preset buttons for scheduling next touchpoint:
  - `+2 Days`, `+1 Week`, `+1 Month`, `+3 Months`, `+6 Months`, `+1 Year`, or Custom Date.
- Tabs for **Today's Follow-ups**, **Overdue** (in prominent red), **Upcoming**, and **Completed**.
- Quick Snooze (`+1 Hour`, `Tomorrow Morning`, `3 Days`, `Next Week`).
- In-App Notification Center in Header with live unread badge and mark-all-read.
- Background worker endpoint: `/api/scheduler/follow-up-check`.

### 5. Employee Management & Attendance
- One-touch **Selfie Check-In & Check-Out** (`/attendance`) using front camera (no GPS tracking).
- Time strictly derived from the server (IST).
- Single registered device policy (device ID bound on first check-in; Admin/Manager can reset).
- Monthly visual calendar view color-coded:
  - 🟢 **Green** = Present
  - 🟡 **Yellow** = Late
  - 🔴 **Red** = Absent
  - 🔵 **Blue** = Approved Leave
- Leave application and Manager approval/manual correction table.

### 6. AI Quotation Generator & Master Rate List
- **Groq API** integration with model `openai/gpt-oss-120b`.
- **PM Surya Ghar: Muft Bijli Yojana** Central Subsidy calculation (₹30,000/kW up to 2kW, capped at ₹78,000 for 3kW+).
- **Strict Rate List Enforced**: Final prices and Bill of Materials (BOM) are calculated exclusively from the editable database Rate List (AI never invents prices).
- Professional printable single-page PDF proposal with company branding, terms, warranties, and Web Share API native sharing.

### 7. Project Execution & JBVNL Net Metering
- 5 Lifecycle Stages: `SURVEY` ➔ `MATERIAL_DISPATCH` ➔ `INSTALLATION` ➔ `NET_METER` ➔ `COMMISSIONING`.
- Technician assignment with auto-notification alerts.
- JBVNL consumer number and National Portal subsidy tracking.

### 8. Warehouse Inventory
- Track stock levels of Tier-1 solar modules, string inverters, and BOS hardware.
- Real-time categorization: `In Stock`, `Dispatched`, `Material Return`, and `Damaged Material`.
- Automated low-stock in-app alerts when quantity falls below 5 units.

### 9. Accounts & Revenue Ledger
- Advance and milestone installment tracking (30% Booking Advance, 50% Dispatch, 20% Net Meter Settlement).
- Subsidy receivable ledger and customer contract value reporting.

---

## 🔐 Demo Credentials

Seed data includes pre-configured realistic accounts:

| Role | Mobile | Password |
|---|---|---|
| **Admin (Owner)** | `9999999999` | `password` |
| **Manager** | `9876543210` | `password` |
| **Sales Executive** | `9123456780` | `password` |

---

## 🛠️ Environment Variables (`.env`)

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>"
NEXTAUTH_SECRET="your_secure_random_string_here"
NEXTAUTH_URL="http://localhost:3000"
GROQ_API_KEY="your_groq_api_key_here"
```

---

## 🏃 Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Synchronize Prisma schema with Neon DB:**
   ```bash
   npx prisma db push
   ```

3. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

4. **Seed realistic Jharkhand demo data (50 customers, leads, follow-ups):**
   ```bash
   npx tsx prisma/seed.ts
   ```

5. **Start Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) and log in with `9999999999` / `password`.
