import React, { createContext, useContext } from "react"
import { Provider, useDispatch, useSelector } from "react-redux"
import { store } from "../store"
import type { RootState, AppDispatch } from "../store"
import type { Booking, Notification, MaintenanceRequest, UserProfile } from "../types"
import {
  setBookings,
  setFavorites,
  toggleFavorite,
  setNotifications,
  addMaintenanceRequest,
  setUser,
  login as loginAction,
  logout as logoutAction,
  completeOnboarding as completeOnboardingAction,
  fetchUserBookings,
  handleBookRoomThunk,
  handleCancelBookingThunk,
  handleUpdateBookingThunk,
  triggerToast as triggerToastThunk
} from "../store/appSlice"

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

// Internal component that connects to Redux store
function AppContextConsumer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  
  // Select state from Redux
  const bookings = useSelector((state: RootState) => state.app.bookings)
  const favorites = useSelector((state: RootState) => state.app.favorites)
  const notifications = useSelector((state: RootState) => state.app.notifications)
  const toast = useSelector((state: RootState) => state.app.toast)
  const isAuthenticated = useSelector((state: RootState) => state.app.isAuthenticated)
  const hasSeenOnboarding = useSelector((state: RootState) => state.app.hasSeenOnboarding)
  const maintenanceRequests = useSelector((state: RootState) => state.app.maintenanceRequests)
  const user = useSelector((state: RootState) => state.app.user)

  // Fetch bookings on mount or email changes
  React.useEffect(() => {
    if (isAuthenticated && user && user.email) {
      dispatch(fetchUserBookings(user.email))
    }
  }, [isAuthenticated, user?.email, dispatch])

  // Adapter functions that dispatch actions
  const triggerToast = (msg: string) => {
    dispatch(triggerToastThunk(msg))
  }

  const handleBookRoom = (room: any) => {
    dispatch(handleBookRoomThunk(room))
  }

  const handleCancelBooking = (bookingId: string) => {
    dispatch(handleCancelBookingThunk(bookingId))
  }

  const handleUpdateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    dispatch(handleUpdateBookingThunk({ bookingId, updates }))
  }

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code)
    triggerToast(`Coupon code "${code}" copied to clipboard!`)
  }

  const login = (userData?: any) => {
    dispatch(loginAction(userData))
  }

  const logout = () => {
    dispatch(logoutAction())
  }

  const completeOnboarding = () => {
    dispatch(completeOnboardingAction())
  }

  const handleToggleFavorite = (id: string) => {
    dispatch(toggleFavorite(id))
    const isFav = favorites.includes(id)
    triggerToast(isFav ? "Removed from favorites." : "Added to favorites.")
  }

  const handleAddMaintenanceRequest = (req: Omit<MaintenanceRequest, "id" | "status" | "createdAt">) => {
    dispatch(addMaintenanceRequest(req))
    triggerToast("Request submitted successfully!")
  }

  const handleSetBookings: React.Dispatch<React.SetStateAction<Booking[]>> = (value) => {
    if (typeof value === "function") {
      dispatch(setBookings(value(bookings)))
    } else {
      dispatch(setBookings(value))
    }
  }

  const handleSetFavorites: React.Dispatch<React.SetStateAction<string[]>> = (value) => {
    if (typeof value === "function") {
      dispatch(setFavorites(value(favorites)))
    } else {
      dispatch(setFavorites(value))
    }
  }

  const handleSetNotifications: React.Dispatch<React.SetStateAction<Notification[]>> = (value) => {
    if (typeof value === "function") {
      dispatch(setNotifications(value(notifications)))
    } else {
      dispatch(setNotifications(value))
    }
  }

  const handleSetUser: React.Dispatch<React.SetStateAction<UserProfile>> = (value) => {
    if (typeof value === "function") {
      dispatch(setUser(value(user)))
    } else {
      dispatch(setUser(value))
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const contextValue: AppContextType = {
    bookings,
    setBookings: handleSetBookings,
    favorites,
    setFavorites: handleSetFavorites,
    notifications,
    setNotifications: handleSetNotifications,
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
    toggleFavorite: handleToggleFavorite,
    maintenanceRequests,
    addMaintenanceRequest: handleAddMaintenanceRequest,
    user,
    setUser: handleSetUser
  }

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  )
}

// Wrapper component to provide Redux context
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AppContextConsumer>
        {children}
      </AppContextConsumer>
    </Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
