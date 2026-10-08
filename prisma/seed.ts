import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Hash passwords
  const passwordHash = await bcrypt.hash("password", 10)

  // ── Users / Employees ─────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { mobile: "9999999999" },
    update: {},
    create: { name: "Raj Kumar (Owner)", mobile: "9999999999", passwordHash, role: "ADMIN" },
  })
  const manager = await prisma.user.upsert({
    where: { mobile: "9876543210" },
    update: {},
    create: { name: "Vikash Singh", mobile: "9876543210", passwordHash, role: "MANAGER" },
  })
  const sales1 = await prisma.user.upsert({
    where: { mobile: "9123456780" },
    update: {},
    create: { name: "Amit Sharma", mobile: "9123456780", passwordHash, role: "SALES" },
  })
  const sales2 = await prisma.user.upsert({
    where: { mobile: "9123456781" },
    update: {},
    create: { name: "Priya Kumari", mobile: "9123456781", passwordHash, role: "SALES" },
  })
  const sales3 = await prisma.user.upsert({
    where: { mobile: "9123456782" },
    update: {},
    create: { name: "Suresh Mahto", mobile: "9123456782", passwordHash, role: "SALES" },
  })
  const tech1 = await prisma.user.upsert({
    where: { mobile: "9123456783" },
    update: {},
    create: { name: "Deepak Oraon", mobile: "9123456783", passwordHash, role: "TECHNICIAN" },
  })
  const tech2 = await prisma.user.upsert({
    where: { mobile: "9123456784" },
    update: {},
    create: { name: "Manoj Tiwari", mobile: "9123456784", passwordHash, role: "TECHNICIAN" },
  })

  const employees = [admin, manager, sales1, sales2, sales3, tech1, tech2]
  const salesTeam = [sales1, sales2, sales3]

  console.log(`✅ ${employees.length} employees created`)

  // ── Customers ─────────────────────────────────────────
  const customerData = [
    { name: "Ramesh Kumar", mobile: "7000000001", district: "Ranchi", block: "Kanke", village: "Hatia", address: "Near Hatia Station, Ranchi", pincode: "834003", monthlyBill: 2500, roofType: "RCC / Concrete" },
    { name: "Sunita Devi", mobile: "7000000002", district: "Ranchi", block: "Namkum", village: "Tupudana", address: "Tupudana Road, Ranchi", pincode: "834002", monthlyBill: 1800, roofType: "RCC / Concrete" },
    { name: "Manoj Prasad", mobile: "7000000003", district: "Ranchi", block: "Ratu", village: "Ratu", address: "Ratu Chowk, Ranchi", pincode: "835222", monthlyBill: 3200, roofType: "Metal / Tin Sheet" },
    { name: "Lakshmi Sahu", mobile: "7000000004", district: "Dhanbad", block: "Dhanbad", village: "Jharia", address: "Jharia Market, Dhanbad", pincode: "828111", monthlyBill: 2200, roofType: "RCC / Concrete" },
    { name: "Ajay Tiwari", mobile: "7000000005", district: "Dhanbad", block: "Govindpur", village: "Govindpur", address: "Main Road Govindpur", pincode: "828109", monthlyBill: 1500, roofType: "Asbestos" },
    { name: "Meena Kumari", mobile: "7000000006", district: "Bokaro", block: "Chas", village: "Sector 4", address: "BSL Township, Bokaro", pincode: "827004", monthlyBill: 4000, roofType: "RCC / Concrete" },
    { name: "Sunil Oraon", mobile: "7000000007", district: "Bokaro", block: "Gomia", village: "Bermo", address: "Bermo Road, Bokaro", pincode: "829104", monthlyBill: 1200, roofType: "Tiled" },
    { name: "Ravi Shankar", mobile: "7000000008", district: "Hazaribagh", block: "Hazaribagh", village: "Hazaribagh Town", address: "Guru Gobind Singh Rd", pincode: "825301", monthlyBill: 2800, roofType: "RCC / Concrete" },
    { name: "Anita Singh", mobile: "7000000009", district: "Hazaribagh", block: "Barhi", village: "Barhi", address: "NH 33, Barhi", pincode: "825405", monthlyBill: 900, roofType: "Metal / Tin Sheet" },
    { name: "Pankaj Mahto", mobile: "7000000010", district: "Giridih", block: "Giridih", village: "Giridih Town", address: "Station Road, Giridih", pincode: "815301", monthlyBill: 1600, roofType: "RCC / Concrete" },
    { name: "Kavita Devi", mobile: "7000000011", district: "Giridih", block: "Dumri", village: "Bengabad", address: "Bengabad, Giridih", pincode: "815314", monthlyBill: 800, roofType: "Asbestos" },
    { name: "Vikram Singh", mobile: "7000000012", district: "Jamshedpur (East Singhbhum)", block: "Jamshedpur", village: "Bistupur", address: "Bistupur Main Road, Jamshedpur", pincode: "831001", monthlyBill: 5000, roofType: "RCC / Concrete" },
    { name: "Pooja Sharma", mobile: "7000000013", district: "Jamshedpur (East Singhbhum)", block: "Potka", village: "Potka", address: "Potka Block Rd", pincode: "832104", monthlyBill: 1100, roofType: "Metal / Tin Sheet" },
    { name: "Dinesh Munda", mobile: "7000000014", district: "Deoghar", block: "Deoghar", village: "Deoghar Town", address: "Temple Road, Deoghar", pincode: "814112", monthlyBill: 2000, roofType: "RCC / Concrete" },
    { name: "Suman Kumari", mobile: "7000000015", district: "Deoghar", block: "Madhupur", village: "Madhupur", address: "Madhupur Junction", pincode: "815353", monthlyBill: 1400, roofType: "Tiled" },
    { name: "Rajesh Yadav", mobile: "7000000016", district: "Dumka", block: "Dumka", village: "Dumka Town", address: "Collectorate Rd, Dumka", pincode: "814101", monthlyBill: 1700, roofType: "RCC / Concrete" },
    { name: "Nisha Devi", mobile: "7000000017", district: "Palamu", block: "Daltonganj", village: "Daltonganj", address: "Bus Stand Road, Daltonganj", pincode: "822101", monthlyBill: 1300, roofType: "Metal / Tin Sheet" },
    { name: "Arun Kumar", mobile: "7000000018", district: "Garhwa", block: "Garhwa", village: "Garhwa Town", address: "Main Bazar, Garhwa", pincode: "822114", monthlyBill: 950, roofType: "Asbestos" },
    { name: "Priti Kumari", mobile: "7000000019", district: "Ramgarh", block: "Ramgarh", village: "Ramgarh Cantonment", address: "Cantonment Area, Ramgarh", pincode: "829122", monthlyBill: 2600, roofType: "RCC / Concrete" },
    { name: "Santosh Prasad", mobile: "7000000020", district: "Koderma", block: "Koderma", village: "Koderma Town", address: "Station Rd, Koderma", pincode: "825410", monthlyBill: 1100, roofType: "Metal / Tin Sheet" },
    { name: "Geeta Devi", mobile: "7000000021", district: "Chatra", block: "Chatra", village: "Chatra Town", address: "Civil Lines, Chatra", pincode: "825401", monthlyBill: 800, roofType: "Tiled" },
    { name: "Bikas Soren", mobile: "7000000022", district: "Latehar", block: "Latehar", village: "Latehar Town", address: "NH 75, Latehar", pincode: "829206", monthlyBill: 700, roofType: "Metal / Tin Sheet" },
    { name: "Mamta Kumari", mobile: "7000000023", district: "Lohardaga", block: "Lohardaga", village: "Lohardaga Town", address: "Main Market, Lohardaga", pincode: "835302", monthlyBill: 650, roofType: "Asbestos" },
    { name: "Rakesh Tirkey", mobile: "7000000024", district: "Gumla", block: "Gumla", village: "Gumla Town", address: "Hospital Rd, Gumla", pincode: "835207", monthlyBill: 900, roofType: "RCC / Concrete" },
    { name: "Savita Devi", mobile: "7000000025", district: "Simdega", block: "Simdega", village: "Simdega Town", address: "Ranchi Road, Simdega", pincode: "835223", monthlyBill: 750, roofType: "Metal / Tin Sheet" },
    { name: "Mohan Lal", mobile: "7000000026", district: "West Singhbhum", block: "Chaibasa", village: "Chaibasa", address: "Main Rd, Chaibasa", pincode: "833201", monthlyBill: 1500, roofType: "RCC / Concrete" },
    { name: "Rina Soy", mobile: "7000000027", district: "Seraikela-Kharsawan", block: "Seraikela", village: "Seraikela", address: "Seraikela Block Rd", pincode: "833219", monthlyBill: 1000, roofType: "Tiled" },
    { name: "Ashok Das", mobile: "7000000028", district: "Sahebganj", block: "Sahebganj", village: "Sahebganj Town", address: "Ganges Road, Sahebganj", pincode: "816109", monthlyBill: 1200, roofType: "RCC / Concrete" },
    { name: "Jyoti Kumari", mobile: "7000000029", district: "Pakur", block: "Pakur", village: "Pakur Town", address: "Main Market, Pakur", pincode: "816107", monthlyBill: 850, roofType: "Asbestos" },
    { name: "Sanjay Marandi", mobile: "7000000030", district: "Godda", block: "Godda", village: "Godda Town", address: "NH 133, Godda", pincode: "814133", monthlyBill: 1050, roofType: "Metal / Tin Sheet" },
    { name: "Poonam Devi", mobile: "7000000031", district: "Jamtara", block: "Jamtara", village: "Jamtara Town", address: "Station Rd, Jamtara", pincode: "815351", monthlyBill: 900, roofType: "RCC / Concrete" },
    { name: "Krishna Mahto", mobile: "7000000032", district: "Khunti", block: "Khunti", village: "Khunti Town", address: "Main Rd, Khunti", pincode: "835210", monthlyBill: 750, roofType: "Metal / Tin Sheet" },
    { name: "Sarita Kumari", mobile: "7000000033", district: "Ranchi", block: "Angara", village: "Angara", address: "Angara Block Rd", pincode: "835103", monthlyBill: 1100, roofType: "RCC / Concrete" },
    { name: "Birendra Oraon", mobile: "7000000034", district: "Ranchi", block: "Bundu", village: "Bundu", address: "NH 143, Bundu", pincode: "835204", monthlyBill: 850, roofType: "Tiled" },
    { name: "Lalita Devi", mobile: "7000000035", district: "Ranchi", block: "Silli", village: "Silli", address: "Silli Market Rd", pincode: "835102", monthlyBill: 1600, roofType: "RCC / Concrete" },
    { name: "Rohit Kumar", mobile: "7000000036", district: "Bokaro", block: "Chandrapura", village: "Chandrapura", address: "Power House Rd", pincode: "828404", monthlyBill: 2100, roofType: "Metal / Tin Sheet" },
    { name: "Anima Tudu", mobile: "7000000037", district: "Dumka", block: "Jama", village: "Jama", address: "Jama Block Rd", pincode: "814110", monthlyBill: 600, roofType: "Asbestos" },
    { name: "Deepika Singh", mobile: "7000000038", district: "Dhanbad", block: "Jharia", village: "Lodna", address: "Lodna Colliery Rd", pincode: "828120", monthlyBill: 1900, roofType: "RCC / Concrete" },
    { name: "Rajendra Prasad", mobile: "7000000039", district: "Hazaribagh", block: "Ichak", village: "Ichak", address: "Ichak Block", pincode: "825301", monthlyBill: 700, roofType: "Wooden" },
    { name: "Manju Devi", mobile: "7000000040", district: "Giridih", block: "Jamua", village: "Jamua", address: "Jamua Market", pincode: "815312", monthlyBill: 850, roofType: "Metal / Tin Sheet" },
    { name: "Sudhir Mahto", mobile: "7000000041", district: "Ranchi", block: "Mandar", village: "Mandar", address: "Mandar Rd, Ranchi", pincode: "834006", monthlyBill: 3500, roofType: "RCC / Concrete" },
    { name: "Rekha Kumari", mobile: "7000000042", district: "Dhanbad", block: "Topchanchi", village: "Topchanchi", address: "Dam Rd, Topchanchi", pincode: "828401", monthlyBill: 1250, roofType: "Tiled" },
    { name: "Pramod Singh", mobile: "7000000043", district: "Jamshedpur (East Singhbhum)", block: "Ghatsila", village: "Ghatsila", address: "Ghatsila Town", pincode: "832303", monthlyBill: 1800, roofType: "RCC / Concrete" },
    { name: "Champa Devi", mobile: "7000000044", district: "Deoghar", block: "Sarath", village: "Sarath", address: "Sarath Market Rd", pincode: "814153", monthlyBill: 750, roofType: "Asbestos" },
    { name: "Binod Mahto", mobile: "7000000045", district: "Palamu", block: "Hussainabad", village: "Hussainabad", address: "Hussainabad Main Rd", pincode: "822102", monthlyBill: 1050, roofType: "Metal / Tin Sheet" },
    { name: "Sakshi Devi", mobile: "7000000046", district: "Ramgarh", block: "Patratu", village: "Patratu", address: "Dam Road, Patratu", pincode: "829119", monthlyBill: 1400, roofType: "RCC / Concrete" },
    { name: "Hemant Soren", mobile: "7000000047", district: "Gumla", block: "Sisai", village: "Sisai", address: "Sisai Block Rd", pincode: "835231", monthlyBill: 600, roofType: "Wooden" },
    { name: "Radha Kumari", mobile: "7000000048", district: "West Singhbhum", block: "Chakradharpur", village: "Chakradharpur", address: "Railway Colony", pincode: "833102", monthlyBill: 2200, roofType: "RCC / Concrete" },
    { name: "Manish Kumar", mobile: "7000000049", district: "Bokaro", block: "Bermo", village: "Bermo", address: "Coal Town Rd, Bermo", pincode: "829104", monthlyBill: 1750, roofType: "RCC / Concrete" },
    { name: "Seema Devi", mobile: "7000000050", district: "Ranchi", block: "Ormanjhi", village: "Ormanjhi", address: "Ormanjhi Block Rd", pincode: "834012", monthlyBill: 2000, roofType: "RCC / Concrete" },
  ]

  const sources = ["Facebook", "Reference", "Walk-in", "Phone Inquiry", "Google", "Instagram", "Camp / Event"]
  const stages = ["NEW", "CONTACTED", "SURVEY", "QUOTATION", "NEGOTIATION", "WON", "LOST"] as const

  const createdCustomers = []
  for (const c of customerData) {
    const emp = salesTeam[Math.floor(Math.random() * salesTeam.length)]
    const customer = await prisma.customer.upsert({
      where: { mobile: c.mobile },
      update: {},
      create: {
        ...c,
        status: "ACTIVE",
        employeeId: emp.id,
        electricityConsumerNo: `JBVNL${c.mobile.slice(-6)}`,
      },
    })
    createdCustomers.push(customer)
  }
  console.log(`✅ ${createdCustomers.length} customers created`)

  // ── Leads ─────────────────────────────────────────────
  let leadsCreated = 0
  for (let i = 0; i < 40; i++) {
    const cust = createdCustomers[i % createdCustomers.length]
    const emp = salesTeam[Math.floor(Math.random() * salesTeam.length)]
    const stage = stages[Math.floor(Math.random() * stages.length)]
    await prisma.lead.create({
      data: {
        source: sources[Math.floor(Math.random() * sources.length)],
        stage,
        lossReason: stage === "LOST" ? "Price too high" : null,
        customerId: cust.id,
        employeeId: emp.id,
      },
    })
    leadsCreated++
  }
  console.log(`✅ ${leadsCreated} leads created`)

  // ── Follow-ups ────────────────────────────────────────
  let followUpsCreated = 0
  const now = new Date()
  for (let i = 0; i < 25; i++) {
    const cust = createdCustomers[i % createdCustomers.length]
    const emp = salesTeam[Math.floor(Math.random() * salesTeam.length)]
    const dayOffset = Math.floor(Math.random() * 30) - 5 // -5 to +25 days
    const dueDate = new Date(now)
    dueDate.setDate(dueDate.getDate() + dayOffset)
    await prisma.followUp.create({
      data: {
        dueDate,
        note: [
          `Customer wants 3 kW system. Call back.`,
          `Discussed pricing. Wants subsidy details.`,
          `Site survey needed. Schedule visit.`,
          `Customer comparing quotes. Follow up.`,
          `Interested after monsoon. Remind later.`,
          `Wants to install after Diwali.`,
          `Family discussion pending. Call again.`,
        ][Math.floor(Math.random() * 7)],
        status: dayOffset < -2 ? "DONE" : "PENDING",
        assignedToId: emp.id,
        customerId: cust.id,
      },
    })
    followUpsCreated++
  }
  console.log(`✅ ${followUpsCreated} follow-ups created`)

  // ── Notifications ─────────────────────────────────────
  const notifMessages = [
    { title: "New Lead", message: "New lead from Facebook - Ramesh Kumar, Ranchi" },
    { title: "Follow-up Due", message: "Follow-up due today: Sunita Devi, Ranchi, call her. Note: wants 3 kW system." },
    { title: "Attendance", message: "Amit Sharma checked in at 09:15 AM" },
    { title: "Payment Received", message: "₹50,000 advance received from Vikram Singh, Jamshedpur" },
    { title: "Low Stock", message: "Solar Panel 545W stock is low (3 remaining)" },
  ]
  for (const msg of notifMessages) {
    await prisma.notification.create({
      data: { ...msg, userId: admin.id },
    })
  }
  console.log(`✅ ${notifMessages.length} notifications created`)

  // ── Rate List ─────────────────────────────────────────
  const rateItems = [
    { item: "Solar Panel 545W Mono PERC", price: 15000, unit: "per panel" },
    { item: "Solar Panel 440W Poly", price: 11000, unit: "per panel" },
    { item: "String Inverter 3kW", price: 25000, unit: "per unit" },
    { item: "String Inverter 5kW", price: 38000, unit: "per unit" },
    { item: "Micro Inverter 1.5kW", price: 18000, unit: "per unit" },
    { item: "Mounting Structure (Ground)", price: 3500, unit: "per kW" },
    { item: "Mounting Structure (Roof)", price: 4000, unit: "per kW" },
    { item: "DC Cable 4mm", price: 30, unit: "per meter" },
    { item: "AC Cable 6mm", price: 45, unit: "per meter" },
    { item: "MC4 Connectors", price: 50, unit: "per pair" },
    { item: "Earthing Kit", price: 2500, unit: "per set" },
    { item: "Lightning Arrester", price: 3000, unit: "per unit" },
    { item: "Net Meter", price: 3500, unit: "per unit" },
    { item: "ACDB / DCDB Box", price: 4500, unit: "per set" },
    { item: "Installation Labour", price: 8000, unit: "per kW" },
    { item: "Transport / Logistics", price: 5000, unit: "per trip" },
  ]
  for (const item of rateItems) {
    await prisma.rateList.upsert({
      where: { item: item.item },
      update: { price: item.price },
      create: item,
    })
  }
  console.log(`✅ ${rateItems.length} rate list items created`)

  // ── Inventory ─────────────────────────────────────────
  const inventoryItems = [
    { name: "Solar Panel 545W Mono PERC", quantity: 50, status: "IN" as const },
    { name: "Solar Panel 440W Poly", quantity: 30, status: "IN" as const },
    { name: "String Inverter 3kW", quantity: 8, status: "IN" as const },
    { name: "String Inverter 5kW", quantity: 5, status: "IN" as const },
    { name: "Mounting Structure Set", quantity: 20, status: "IN" as const },
    { name: "DC Cable 4mm (100m roll)", quantity: 15, status: "IN" as const },
    { name: "MC4 Connectors (pair)", quantity: 100, status: "IN" as const },
    { name: "Earthing Kit", quantity: 12, status: "IN" as const },
    { name: "Net Meter", quantity: 3, status: "IN" as const },
  ]
  for (const item of inventoryItems) {
    await prisma.inventoryItem.upsert({
      where: { name: item.name },
      update: { quantity: item.quantity },
      create: item,
    })
  }
  console.log(`✅ ${inventoryItems.length} inventory items created`)

  // ── Attendance (today) ─────────────────────────────────
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const emp of [sales1, sales2, sales3, tech1]) {
    const checkIn = new Date(today)
    checkIn.setHours(9, Math.floor(Math.random() * 30), 0)
    await prisma.attendance.upsert({
      where: { userId_date: { userId: emp.id, date: today } },
      update: {},
      create: {
        userId: emp.id,
        date: today,
        checkInTime: checkIn,
        status: checkIn.getHours() >= 10 ? "LATE" : "PRESENT",
      },
    })
  }
  // tech2 on leave
  await prisma.attendance.upsert({
    where: { userId_date: { userId: tech2.id, date: today } },
    update: {},
    create: {
      userId: tech2.id,
      date: today,
      status: "LEAVE",
      leaveReason: "Personal work",
    },
  })
  console.log("✅ Attendance records created")

  console.log("\n🎉 Seeding complete! You can log in with:")
  console.log("   Mobile: 9999999999 | Password: password (Admin)")
  console.log("   Mobile: 9876543210 | Password: password (Manager)")
  console.log("   Mobile: 9123456780 | Password: password (Sales)")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
