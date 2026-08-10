/* ═══════════════════════════════════════════════════════════════
   INVESTORS — sample directory records.
   Real accounts arrive with authentication; these mirror the future
   profiles table so the admin screens are ready to bind.
═══════════════════════════════════════════════════════════════ */

export type KycStatus = "verified" | "pending" | "rejected" | "high-risk"

export interface Investor {
  id: string
  fullName: string
  email: string
  phone: string
  country: string
  idType: string
  kycStatus: KycStatus
  joined: string
  invested: number
  properties: number
  shares: number
  lastActive: string
  holdings: { propertyId: string; propertyName: string; shares: number; value: number }[]
}

export const investors: Investor[] = [
  {
    id: "inv-001", fullName: "John Okello", email: "j.okello@gmail.com", phone: "+256 772 118 442",
    country: "Uganda", idType: "National ID", kycStatus: "verified", joined: "10 Aug 2025",
    invested: 4800000, properties: 3, shares: 12400, lastActive: "2h ago",
    holdings: [
      { propertyId: "sunrise-apartments", propertyName: "Sunrise Apartments", shares: 800, value: 1000000 },
      { propertyId: "acacia-office-park", propertyName: "Acacia Office Park", shares: 200, value: 420000 },
      { propertyId: "ibis-residences-ii", propertyName: "Ibis Residences Phase II", shares: 810, value: 3380000 },
    ],
  },
  {
    id: "inv-002", fullName: "Amina Nakato", email: "amina.nk@yahoo.com", phone: "+256 704 556 810",
    country: "Uganda", idType: "Passport", kycStatus: "verified", joined: "22 Sep 2025",
    invested: 12500000, properties: 4, shares: 8200, lastActive: "1d ago",
    holdings: [
      { propertyId: "naalya-business-park", propertyName: "Naalya Business Park", shares: 2100, value: 5040000 },
      { propertyId: "green-heights", propertyName: "Green Heights", shares: 3000, value: 2520000 },
      { propertyId: "kololo-towers-ii", propertyName: "Kololo Towers Phase II", shares: 900, value: 4905000 },
      { propertyId: "kololo-heights", propertyName: "Kololo Heights", shares: 2200, value: 1628000 },
    ],
  },
  {
    id: "inv-003", fullName: "David Mugisha", email: "d.mugisha@outlook.com", phone: "+256 750 223 981",
    country: "Uganda", idType: "National ID", kycStatus: "pending", joined: "3 Feb 2026",
    invested: 0, properties: 0, shares: 0, lastActive: "5h ago",
    holdings: [],
  },
  {
    id: "inv-004", fullName: "Grace Tumusiime", email: "grace.t@gmail.com", phone: "+256 772 940 133",
    country: "Uganda", idType: "Passport", kycStatus: "verified", joined: "14 Nov 2025",
    invested: 7300000, properties: 2, shares: 4600, lastActive: "3d ago",
    holdings: [
      { propertyId: "lake-view-residences", propertyName: "Lake View Residences", shares: 3100, value: 5208000 },
      { propertyId: "sunrise-apartments", propertyName: "Sunrise Apartments", shares: 1500, value: 1875000 },
    ],
  },
  {
    id: "inv-005", fullName: "Peter Ssemwanga", email: "pssemwanga@proton.me", phone: "+254 711 302 655",
    country: "Kenya", idType: "Passport", kycStatus: "pending", joined: "28 Jan 2026",
    invested: 0, properties: 0, shares: 0, lastActive: "1h ago",
    holdings: [],
  },
  {
    id: "inv-006", fullName: "Sarah Lubega", email: "sarah.lubega@gmail.com", phone: "+256 705 881 240",
    country: "Uganda", idType: "National ID", kycStatus: "verified", joined: "7 Oct 2025",
    invested: 2100000, properties: 1, shares: 1680, lastActive: "6h ago",
    holdings: [
      { propertyId: "sunrise-apartments", propertyName: "Sunrise Apartments", shares: 1680, value: 2100000 },
    ],
  },
  {
    id: "inv-007", fullName: "Brian Ssekandi", email: "b.ssekandi@mail.com", phone: "+256 786 004 512",
    country: "Uganda", idType: "Driving Permit", kycStatus: "rejected", joined: "19 Jan 2026",
    invested: 0, properties: 0, shares: 0, lastActive: "2w ago",
    holdings: [],
  },
  {
    id: "inv-008", fullName: "Mohamed Farah", email: "m.farah@gmail.com", phone: "+252 61 550 3312",
    country: "Somalia", idType: "Passport", kycStatus: "high-risk", joined: "30 Jan 2026",
    invested: 0, properties: 0, shares: 0, lastActive: "4d ago",
    holdings: [],
  },
]

export const pendingKycCount = investors.filter(i => i.kycStatus === "pending").length
