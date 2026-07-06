import React, { createContext, useContext, useState } from "react"
import type { Booking, Notification, MaintenanceRequest, UserProfile } from "../types"
import { API_BASE_URL } from "../config"

interface AppContextType {
  bookings: Booking[]
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
  favorites: string[]
  setFavorites: React.Dispatch<React.SetStateAction<string[]>>
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  triggerToast: (msg: string) => void
  toast: { message: string; visible: boolean }
  handleBookRoom: (room: any) => void
  handleCancelBooking: (bookingId: string) => void
  handleUpdateBooking: (bookingId: string, updates: Partial<Booking>) => Promise<void>
  handleCopyCoupon: (code: string) => void
  unreadCount: number
  isAuthenticated: boolean
  login: (userData?: any) => void
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
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("rommo_user")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {}
    }
    return {
      name: "Mani Kumar",
      email: "mani.kumar@rommo.in",
      phone: "+91 98765 43210",
      pin: "2468",
      address: ""
    }
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
    }
  ])

  const fetchUserBookings = async (emailAddress: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings?email=${encodeURIComponent(emailAddress)}`)
      if (res.ok) {
        const data = await res.json()
        const bookingList = data.bookings || data
        
        const formatDateString = (dateStr: any) => {
          try {
            const date = new Date(dateStr)
            if (isNaN(date.getTime())) return "N/A"
            return date.toLocaleDateString("en-US", {
              day: "2-digit",
              month: "short",
              weekday: "short"
            })
          } catch {
            return "N/A"
          }
        }

        const mapped: Booking[] = bookingList.map((b: any) => ({
          id: b.id || b._id,
          title: b.workspaceTitle,
          location: b.workspaceLocation || "N/A",
          status: (b.status || "PENDING").toUpperCase() as any,
          checkInDate: formatDateString(b.startDate),
          checkOutDate: formatDateString(b.endDate),
          guests: b.guests || 1,
          price: b.totalPrice || 0,
          image: b.image || "/urban_studio.png",
          bookingCode: b.bookingCode || `RM-${b.workspaceTitle.substring(0, 3).toUpperCase()}-${b.id.substring(Math.max(0, b.id.length - 4)).toUpperCase()}`,
          wifiName: b.wifiName || "Rommo_WiFi",
          wifiPassword: b.wifiPassword || "rommo123",
          entryPin: b.entryPin || "1234",
          roomMood: b.roomMood || "Standard",
          addOnServices: b.addOnServices || [],
          splitPayments: b.splitPayments || [],
          smartCheckIn: b.smartCheckIn || { checkedIn: false, checkInTime: undefined, checkInMethod: "" },
          roomUpgradeBid: b.roomUpgradeBid || 0,
          workspaceId: b.workspaceId
        }))
        
        setBookings(mapped)
      }
    } catch (err) {
      console.warn("Failed fetching bookings from server:", err)
    }
  }

  React.useEffect(() => {
    if (isAuthenticated && user && user.email) {
      fetchUserBookings(user.email)
    }
  }, [isAuthenticated, user?.email])

  const login = (userData?: any) => {
    localStorage.setItem("rommo_auth", "true")
    if (userData) {
      localStorage.setItem("rommo_user", JSON.stringify(userData))
      setUser(prev => ({
        ...prev,
        name: userData.name || prev.name,
        email: userData.email || prev.email,
        phone: userData.phone || prev.phone || "+91 98765 43210",
        pin: userData.pin || prev.pin || "2468",
        address: userData.address || prev.address || ""
      }))
    }
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem("rommo_auth")
    localStorage.removeItem("rommo_user")
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

  const handleBookRoom = async (room: any) => {
    const checkIn = new Date()
    // Simple custom date mapping if checkInDate exists (e.g. "28 Jun, Sun")
    if (room.checkInDate) {
      try {
        const parts = room.checkInDate.split(" ")
        if (parts.length >= 2) {
          const dayNum = parseInt(parts[0])
          const monthMap: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11 }
          const monthStr = parts[1].replace(",", "")
          const monthIdx = monthMap[monthStr] !== undefined ? monthMap[monthStr] : checkIn.getMonth()
          checkIn.setDate(dayNum)
          checkIn.setMonth(monthIdx)
        }
      } catch (e) {
        console.warn("Date parsing fallback:", e)
      }
    }
    const checkOut = new Date(checkIn)
    checkOut.setDate(checkOut.getDate() + 1)

    const payload = {
      workspaceId: room.id || "d3",
      workspaceTitle: room.title,
      workspaceLocation: room.location,
      name: user.name,
      email: user.email,
      phone: user.phone || "+91 98765 43210",
      startDate: checkIn.toISOString(),
      endDate: checkOut.toISOString(),
      totalPrice: room.price + (room.addOnServices || []).reduce((acc: number, curr: any) => acc + curr.price, 0),
      paymentMethod: "Pay at Venue",
      paymentStatus: "Pending",
      status: "Pending",
      roomMood: room.roomMood || "Standard",
      addOnServices: room.addOnServices || [],
      splitPayments: room.splitPayments || [],
      smartCheckIn: { checkedIn: false, checkInTime: null, checkInMethod: "" },
      roomUpgradeBid: 0
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        triggerToast(`Successfully booked ${room.title}!`)
        if (user && user.email) {
          fetchUserBookings(user.email)
        }
        return
      }
    } catch (err) {
      console.warn("Failed saving booking to API, falling back to local:", err)
    }

    const newBooking: Booking = {
      id: `b-${Date.now()}`,
      title: room.title,
      location: room.location,
      status: "PENDING",
      checkInDate: room.checkInDate || "28 Jun, Sun",
      checkOutDate: "29 Jun, Mon",
      guests: room.guests || 2,
      price: payload.totalPrice,
      image: room.image,
      bookingCode: `RM-${room.title.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
      wifiName: `${room.title.replace(/\s+/g, "")}_WiFi`,
      wifiPassword: "welcomeguest12",
      entryPin: Math.floor(1000 + Math.random() * 9000).toString(),
      roomMood: room.roomMood || "Standard",
      addOnServices: room.addOnServices || [],
      splitPayments: room.splitPayments || [],
      smartCheckIn: { checkedIn: false, checkInTime: undefined, checkInMethod: "" },
      roomUpgradeBid: 0
    }
    setBookings(prev => [newBooking, ...prev])
    triggerToast(`Successfully booked ${room.title}!`)
    
    setNotifications(prev => [
      {
        id: Date.now(),
        text: `New booking confirmed: ${room.title} for ${newBooking.checkInDate}.`,
        time: "Just now",
        read: false
      },
      ...prev
    ])
  }

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: "Cancelled" })
      })
      if (res.ok) {
        triggerToast("Booking successfully cancelled.")
        if (user && user.email) {
          fetchUserBookings(user.email)
        }
        return
      }
    } catch (err) {
      console.warn("Failed cancelling booking on server:", err)
    }

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

  const handleUpdateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        if (user && user.email) {
          fetchUserBookings(user.email)
        }
        return
      }
    } catch (err) {
      console.warn("Failed updating booking on server:", err)
    }

    setBookings(prev => 
      prev.map(b => b.id === bookingId ? { ...b, ...updates } : b)
    )
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
      handleUpdateBooking,
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
