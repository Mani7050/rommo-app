import React, { createContext, useContext, useState } from "react"
import type { Booking, Notification, MaintenanceRequest, UserProfile } from "../types"

interface AppContextType {
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  favorites: string[]
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  triggerToast: (msg: string) => void
  toast: { message: string; visible: boolean }
  handleBookRoom: (room: { title: string; location: string; price: number; image: string }) => void
  handleCancelBooking: (bookingId: string) => void
  handleCopyCoupon: (code: string) => void
  unreadCount: number
  isAuthenticated: boolean
  login: () => void
  logout: () => void
  hasSeenOnboarding: boolean
  completeOnboarding: () => void
  toggleFavorite: (id: string) => void
  maintenanceRequests: MaintenanceRequest[]
  addMaintenanceRequest: (req: Omit<MaintenanceRequest, "id" | "status" | "createdAt">) => void
  user: UserProfile
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: "", visible: false })
  const [favorites, setFavorites] = useState<string[]>(["d3"])
  const [user, setUser] = useState<UserProfile>({
    name: "Mani Kumar",
    email: "mani.kumar@rommo.in",
    phone: "+91 98765 43210",
    pin: "2468"
  })
  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>([
    {
      id: "req-1",
      bookingTitle: "Urban Studio Room",
      requestType: "CLEANING",
      category: "Trash Removal",
      details: "Please empty the trash cans in the studio.",
      status: "RESOLVED",
      createdAt: "25 May, Sat"
    },
    {
      id: "req-2",
      bookingTitle: "Luxury Penthouse Suite",
      requestType: "MAINTENANCE",
      category: "AC Issue",
      details: "AC thermostat is stuck and temperature cannot be adjusted.",
      status: "IN_PROGRESS",
      createdAt: "27 Jun, Sat"
    }
  ])
  
  // Auth state initialized from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("rommo_auth") === "true"
  })

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(false)

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, text: "Urban Studio Room booking is confirmed for tomorrow!", time: "2 hrs ago", read: false },
    { id: 2, text: "Your booking for Meeting Room - 4 Seater is pending host approval.", time: "5 hrs ago", read: false },
    { id: 3, text: "Welcome to Rommo! Complete your profile to get 500 bonus points.", time: "1 day ago", read: true }
  ])

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "b1",
      title: "Urban Studio Room",
      location: "Koramangala, Bangalore",
      status: "CONFIRMED",
      checkInDate: "25 May, Sat",
      checkOutDate: "26 May, Sun",
      guests: 2,
      price: 1649,
      image: "/urban_studio.png",
      bookingCode: "RM-URB-8492",
      wifiName: "UrbanStudio_5G",
      wifiPassword: "cozybedroom99",
      entryPin: "8492"
    },
    {
      id: "b2",
      title: "Comfort Room",
      location: "Indiranagar, Bangalore",
      status: "CONFIRMED",
      checkInDate: "05 Jun, Wed",
      checkOutDate: "07 Jun, Fri",
      guests: 1,
      price: 2198,
      image: "/comfort_room.png",
      bookingCode: "RM-CMF-1748",
      wifiName: "ComfortRoom_Guest",
      wifiPassword: "comfortstay123",
      entryPin: "3184"
    },
    {
      id: "b3",
      title: "Meeting Room – 4 Seater",
      location: "HSR Layout, Bangalore",
      status: "PENDING",
      checkInDate: "10 Jun, Mon",
      checkInTime: "09:00 AM",
      checkOutDate: "10 Jun, Mon",
      checkOutTime: "11:00 AM",
      guests: 4,
      price: 799,
      image: "/meeting_room.png",
      bookingCode: "RM-MTG-0922",
      wifiName: "HSR_Workspace_HighSpeed",
      wifiPassword: "hsroffice2026",
      entryPin: "0900"
    },
    {
      id: "b4",
      title: "Deluxe Suite Room",
      location: "Whitefield, Bangalore",
      status: "COMPLETED",
      checkInDate: "12 Apr, Sun",
      checkOutDate: "15 Apr, Wed",
      guests: 2,
      price: 4500,
      image: "/urban_studio.png",
      rating: 5,
      bookingCode: "RM-DLX-9382"
    },
    {
      id: "b5",
      title: "Solo Work Pod",
      location: "MG Road, Bangalore",
      status: "COMPLETED",
      checkInDate: "01 May, Fri",
      checkOutDate: "01 May, Fri",
      guests: 1,
      price: 399,
      image: "/meeting_room.png",
      rating: 4,
      bookingCode: "RM-POD-3301"
    },
    {
      id: "b6",
      title: "Conference Room B",
      location: "Electronic City, Bangalore",
      status: "CANCELLED",
      checkInDate: "18 May, Mon",
      checkOutDate: "18 May, Mon",
      guests: 8,
      price: 1200,
      image: "/meeting_room.png",
      bookingCode: "RM-CNF-4491"
    }
  ])

  const login = () => {
    localStorage.setItem("rommo_auth", "true")
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("rommo_auth")
    setIsAuthenticated(false)
    setHasSeenOnboarding(false)
  }

  const completeOnboarding = () => {
    setHasSeenOnboarding(true)
  }

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id)
      const nextFavs = isFav ? prev.filter(fId => fId !== id) : [...prev, id]
      triggerToast(isFav ? "Removed from favorites." : "Added to favorites.")
      return nextFavs
    })
  }

  const triggerToast = (msg: string) => {
    setToast({ message: msg, visible: true })
    setTimeout(() => {
      setToast({ message: "", visible: false })
    }, 3000)
  }

  const handleBookRoom = (room: { title: string; location: string; price: number; image: string }) => {
    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      title: room.title,
      location: room.location,
      status: "CONFIRMED",
      checkInDate: "28 Jun, Sun",
      checkOutDate: "29 Jun, Mon",
      guests: 2,
      price: room.price,
      image: room.image,
      bookingCode: `RM-${room.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      wifiName: `${room.title.replace(/\s+/g, "")}_WiFi`,
      wifiPassword: "welcomeguest12",
      entryPin: Math.floor(1000 + Math.random() * 9000).toString()
    }
    setBookings(prev => [newBooking, ...prev])
    triggerToast(`Successfully booked ${room.title}!`)
    
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `New booking confirmed: ${room.title} for 28 Jun.`,
        time: "Just now",
        read: false
      },
      ...prev
    ])
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, status: "CANCELLED" } : b)
    )
    const booking = bookings.find(b => b.id === bookingId)
    triggerToast(`${booking?.title || "Booking"} successfully cancelled.`)
    
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `You cancelled your booking for ${booking?.title}. Refund of ${booking?.price} is initiated.`,
        time: "Just now",
        read: false
      },
      ...prev
    ])
  }

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    triggerToast(`Coupon code "${code}" copied to clipboard!`)
  }

  const addMaintenanceRequest = (req: Omit<MaintenanceRequest, "id" | "status" | "createdAt">) => {
    const newReq: MaintenanceRequest = {
      ...req,
      id: `req-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })
    }
    setMaintenanceRequests(prev => [newReq, ...prev])
    triggerToast("Request submitted successfully!")
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <AppContext.Provider value={{
      bookings,
      setBookings,
      favorites,
      setFavorites,
      notifications,
      setNotifications,
      triggerToast,
      toast,
      handleBookRoom,
      handleCancelBooking,
      handleCopyCoupon,
      unreadCount,
      isAuthenticated,
      login,
      logout,
      hasSeenOnboarding,
      completeOnboarding,
      toggleFavorite,
      maintenanceRequests,
      addMaintenanceRequest,
      user,
      setUser
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
