import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import type { Booking, Notification, MaintenanceRequest, UserProfile } from "../types"
import { API_BASE_URL } from "../config"

// Helper function to format date
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

interface AppState {
  bookings: Booking[]
  favorites: string[]
  notifications: Notification[]
  maintenanceRequests: MaintenanceRequest[]
  toast: { message: string; visible: boolean }
  user: UserProfile
  isAuthenticated: boolean
  hasSeenOnboarding: boolean
  isLoadingBookings: boolean
}

// Initial state helpers
const getSavedUser = (): UserProfile => {
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
}

const getInitialAuth = (): boolean => {
  return localStorage.getItem("rommo_auth") === "true"
}

const initialState: AppState = {
  bookings: [
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
  ],
  favorites: ["d3"],
  notifications: [
    { id: 1, text: "Urban Studio Room booking is confirmed for tomorrow!", time: "2 hrs ago", read: false },
    { id: 2, text: "Your booking for Meeting Room - 4 Seater is pending host approval.", time: "5 hrs ago", read: false },
    { id: 3, text: "Welcome to Rommo! Complete your profile to get 500 bonus points.", time: "1 day ago", read: true }
  ],
  maintenanceRequests: [
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
  ],
  toast: { message: "", visible: false },
  user: getSavedUser(),
  isAuthenticated: getInitialAuth(),
  hasSeenOnboarding: false,
  isLoadingBookings: false
}

// Async Thunks
export const fetchUserBookings = createAsyncThunk(
  "app/fetchUserBookings",
  async (emailAddress: string) => {
    const res = await fetch(`${API_BASE_URL}/api/bookings?email=${encodeURIComponent(emailAddress)}`)
    if (!res.ok) throw new Error("Failed to fetch bookings")
    const data = await res.json()
    const bookingList = data.bookings || data
    
    return bookingList.map((b: any) => ({
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
    })) as Booking[]
  }
)

export const handleBookRoomThunk = createAsyncThunk(
  "app/bookRoom",
  async (room: any, { getState, dispatch }) => {
    const state = getState() as { app: AppState }
    const checkIn = new Date()
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
      name: state.app.user.name,
      email: state.app.user.email,
      phone: state.app.user.phone || "+91 98765 43210",
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        dispatch(triggerToast(`Successfully booked ${room.title}!`))
        if (state.app.user.email) {
          dispatch(fetchUserBookings(state.app.user.email))
        }
        return null // Fetched updated from server
      }
    } catch (err) {
      console.warn("Failed saving booking to API, falling back to local:", err)
    }

    // Fallback local booking
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

    dispatch(addBookingLocal(newBooking))
    dispatch(triggerToast(`Successfully booked ${room.title}!`))
    dispatch(addNotification({
      id: Date.now(),
      text: `New booking confirmed: ${room.title} for ${newBooking.checkInDate}.`,
      time: "Just now",
      read: false
    }))
    return newBooking
  }
)

export const handleCancelBookingThunk = createAsyncThunk(
  "app/cancelBooking",
  async (bookingId: string, { getState, dispatch }) => {
    const state = getState() as { app: AppState }
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Cancelled" })
      })
      if (res.ok) {
        dispatch(triggerToast("Booking successfully cancelled."))
        if (state.app.user.email) {
          dispatch(fetchUserBookings(state.app.user.email))
        }
        return
      }
    } catch (err) {
      console.warn("Failed cancelling booking on server:", err)
    }

    // Local fallback
    dispatch(cancelBookingLocal(bookingId))
    const booking = state.app.bookings.find(b => b.id === bookingId)
    dispatch(triggerToast(`${booking?.title || "Booking"} successfully cancelled.`))
    dispatch(addNotification({
      id: Date.now(),
      text: `You cancelled your booking for ${booking?.title}. Refund of ${booking?.price} is initiated.`,
      time: "Just now",
      read: false
    }))
  }
)

export const handleUpdateBookingThunk = createAsyncThunk(
  "app/updateBooking",
  async ({ bookingId, updates }: { bookingId: string; updates: Partial<Booking> }, { getState, dispatch }) => {
    const state = getState() as { app: AppState }
    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates)
      })
      if (res.ok) {
        if (state.app.user.email) {
          dispatch(fetchUserBookings(state.app.user.email))
        }
        return
      }
    } catch (err) {
      console.warn("Failed updating booking on server:", err)
    }

    // Local fallback
    dispatch(updateBookingLocal({ bookingId, updates }))
  }
)

export const triggerToast = createAsyncThunk(
  "app/triggerToastThunk",
  async (message: string, { dispatch }) => {
    dispatch(setToast({ message, visible: true }))
    setTimeout(() => {
      dispatch(setToast({ message: "", visible: false }))
    }, 3000)
  }
)

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setToast(state, action: PayloadAction<{ message: string; visible: boolean }>) {
      state.toast = action.payload
    },
    setBookings(state, action: PayloadAction<Booking[]>) {
      state.bookings = action.payload
    },
    setFavorites(state, action: PayloadAction<string[]>) {
      state.favorites = action.payload
    },
    toggleFavorite(state, action: PayloadAction<string>) {
      const id = action.payload
      const isFav = state.favorites.includes(id)
      state.favorites = isFav
        ? state.favorites.filter(fId => fId !== id)
        : [...state.favorites, id]
    },
    addBookingLocal(state, action: PayloadAction<Booking>) {
      state.bookings.unshift(action.payload)
    },
    cancelBookingLocal(state, action: PayloadAction<string>) {
      state.bookings = state.bookings.map(b => 
        b.id === action.payload ? { ...b, status: "CANCELLED" } : b
      )
    },
    updateBookingLocal(state, action: PayloadAction<{ bookingId: string; updates: Partial<Booking> }>) {
      const { bookingId, updates } = action.payload
      state.bookings = state.bookings.map(b => 
        b.id === bookingId ? { ...b, ...updates } : b
      )
    },
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.notifications = action.payload
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload)
    },
    addMaintenanceRequest(state, action: PayloadAction<Omit<MaintenanceRequest, "id" | "status" | "createdAt">>) {
      const newReq: MaintenanceRequest = {
        ...action.payload,
        id: `req-${Date.now()}`,
        status: "PENDING",
        createdAt: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", weekday: "short" })
      }
      state.maintenanceRequests.unshift(newReq)
    },
    setUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload
      localStorage.setItem("rommo_user", JSON.stringify(action.payload))
    },
    login(state, action: PayloadAction<any>) {
      localStorage.setItem("rommo_auth", "true")
      state.isAuthenticated = true
      if (action.payload) {
        localStorage.setItem("rommo_user", JSON.stringify(action.payload))
        state.user = {
          ...state.user,
          name: action.payload.name || state.user.name,
          email: action.payload.email || state.user.email,
          phone: action.payload.phone || state.user.phone || "+91 98765 43210",
          pin: action.payload.pin || state.user.pin || "2468",
          address: action.payload.address || state.user.address || ""
        }
      }
    },
    logout(state) {
      localStorage.removeItem("rommo_auth")
      localStorage.removeItem("rommo_user")
      state.isAuthenticated = false
      state.hasSeenOnboarding = false
    },
    completeOnboarding(state) {
      state.hasSeenOnboarding = true
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.isLoadingBookings = true
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload
        state.isLoadingBookings = false
      })
      .addCase(fetchUserBookings.rejected, (state) => {
        state.isLoadingBookings = false
      })
  }
})

export const {
  setToast,
  setBookings,
  setFavorites,
  toggleFavorite,
  addBookingLocal,
  cancelBookingLocal,
  updateBookingLocal,
  setNotifications,
  addNotification,
  addMaintenanceRequest,
  setUser,
  login,
  logout,
  completeOnboarding
} = appSlice.actions

export default appSlice.reducer
