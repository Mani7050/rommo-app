export interface Booking {
  id: string
  title: string
  location: string
  status: "CONFIRMED" | "PENDING" | "COMPLETED" | "CANCELLED"
  checkInDate: string
  checkInTime?: string
  checkOutDate: string
  checkOutTime?: string
  guests: number
  price: number
  image: string
  rating?: number
  bookingCode: string
  wifiName?: string
  wifiPassword?: string
  entryPin?: string
  type?: string
  roomMood?: string
  addOnServices?: { name: string; price: number }[]
  splitPayments?: { email: string; amount: number; status: string }[]
  smartCheckIn?: { checkedIn: boolean; checkInTime?: string; checkInMethod?: string }
  roomUpgradeBid?: number
  workspaceId?: string
}

export interface Offer {
  code: string
  discount: string
  description: string
  expiry: string
}

export interface Notification {
  id: number | string
  text: string
  time: string
  read: boolean
}

export interface MaintenanceRequest {
  id: string
  bookingTitle: string
  requestType: "CLEANING" | "MAINTENANCE"
  category: string
  details: string
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED"
  createdAt: string
}

export interface UserProfile {
  name: string
  email: string
  phone: string
  pin: string
  address?: string
}
