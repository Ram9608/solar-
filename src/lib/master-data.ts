// Master data for Jharkhand's 24 districts and their blocks
export const JHARKHAND_DISTRICTS: Record<string, string[]> = {
  "Ranchi": [
    "Angara", "Bundu", "Burmu", "Chanho", "Kanke", "Karra",
    "Khunti", "Lapung", "Mandar", "Namkum", "Ormanjhi", "Ratu",
    "Silli", "Sonahatu", "Tamar"
  ],
  "Dhanbad": [
    "Baghmara", "Baliapur", "Dhanbad", "Govindpur", "Jharia",
    "Katras", "Nirsa", "Topchanchi", "Tundi"
  ],
  "Bokaro": [
    "Bermo", "Chandankiyari", "Chandrapura", "Chas", "Gomia",
    "Jaridih", "Kasmar", "Nawadih", "Peterbar"
  ],
  "Hazaribagh": [
    "Barhi", "Bishnugarh", "Chouparan", "Churchu", "Daru",
    "Hazaribagh", "Ichak", "Katkamsandi", "Keredari", "Padma",
    "Tatijharia"
  ],
  "Giridih": [
    "Bagodar", "Bengabad", "Birni", "Deori", "Dhanwar",
    "Dumri", "Gande", "Giridih", "Jamua", "Pirtand",
    "Suriya", "Tisri"
  ],
  "Jamshedpur (East Singhbhum)": [
    "Baharagora", "Boram", "Chakulia", "Dhalbhumgarh", "Dumaria",
    "Ghatsila", "Golmuri-cum-Jugsalai", "Ghatshila", "Jamshedpur",
    "Musabani", "Patamda", "Potka"
  ],
  "Deoghar": [
    "Deoghar", "Devipur", "Jasidih", "Karon", "Madhupur",
    "Margomunda", "Mohanpur", "Palojori", "Sarath", "Sona Rai Thari"
  ],
  "Dumka": [
    "Dumka", "Gopikandar", "Jama", "Jarmundi", "Kathikund",
    "Masalia", "Ramgarh", "Raneshwar", "Shikaripara"
  ],
  "Palamu": [
    "Chainpur", "Chhatarpur", "Daltonganj", "Hariharganj",
    "Hussainabad", "Lesliganj", "Manatu", "Medininagar",
    "Pandwa", "Satbarwa"
  ],
  "Garhwa": [
    "Bharno", "Bhandaria", "Chinia", "Dhandai", "Garhwa",
    "Ketar", "Majhiaon", "Meral", "Nagar Untari", "Ranka"
  ],
  "Ramgarh": [
    "Chitarpur", "Dulmi", "Gola", "Mandu", "Patratu", "Ramgarh"
  ],
  "Koderma": [
    "Chandwara", "Domchanch", "Jainagar", "Koderma", "Markachho",
    "Satgawan"
  ],
  "Chatra": [
    "Chatra", "Hunterganj", "Itkhori", "Kanhachatti",
    "Lawalong", "Pathalgada", "Pratappur", "Simaria", "Tandwa"
  ],
  "Latehar": [
    "Balumath", "Bariyatu", "Barwadih", "Chandwa", "Garu",
    "Latehar", "Mahuadanr", "Manika"
  ],
  "Lohardaga": [
    "Bhandra", "Kisko", "Kuru", "Lohardaga", "Senha"
  ],
  "Gumla": [
    "Albert Ekka Nagar", "Bishunpur", "Chainpur", "Dumri",
    "Ghaghra", "Gumla", "Kamdara", "Palkot", "Raidih",
    "Sisai"
  ],
  "Simdega": [
    "Bano", "Bolba", "Jaldega", "Kolebira", "Kurdeg",
    "Pachchamba", "Simdega", "Thethaitangar"
  ],
  "West Singhbhum": [
    "Chakradharpur", "Chaibasa", "Goilkera", "Gudri",
    "Hatgamharia", "Jagannathpur", "Jhinkpani", "Khuntpani",
    "Kumardungi", "Majhgaon", "Manoharpur", "Noamundi",
    "Sonua", "Tantnagar", "Tonto"
  ],
  "Seraikela-Kharsawan": [
    "Chandil", "Gamharia", "Ichagarh", "Kharsawan",
    "Kuchai", "Nimdih", "Rajnagar", "Seraikela"
  ],
  "Sahebganj": [
    "Barharwa", "Barhait", "Borio", "Maheshpur", "Pathna",
    "Rajmahal", "Sahebganj", "Taljhari", "Udhwa"
  ],
  "Pakur": [
    "Amrapara", "Hiranpur", "Littipara", "Maheshpur",
    "Pakur", "Pakuria"
  ],
  "Godda": [
    "Boarijore", "Godda", "Mahagama", "Meherma",
    "Pathargama", "Poraiyahat", "Sundarpahari", "Thakurgangti"
  ],
  "Jamtara": [
    "Fatehpur", "Jamtara", "Kundhit", "Narayanpur", "Nala"
  ],
  "Khunti": [
    "Arki", "Karra", "Khunti", "Murhu", "Rania", "Torpa"
  ]
}

export const DISTRICT_LIST = Object.keys(JHARKHAND_DISTRICTS).sort()

export const ROOF_TYPES = [
  "RCC / Concrete",
  "Metal / Tin Sheet",
  "Tiled",
  "Asbestos",
  "Wooden",
  "Other"
]

export const LEAD_SOURCES = [
  "Facebook",
  "Instagram",
  "Google",
  "Reference",
  "Walk-in",
  "Phone Inquiry",
  "WhatsApp Inquiry",
  "Website",
  "Camp / Event",
  "Other"
]

export const CUSTOMER_STATUSES = ["ACTIVE", "INACTIVE"] as const
