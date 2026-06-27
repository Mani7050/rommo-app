import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { BottomNav } from "../components/BottomNav"
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer"
import { OffersDrawer } from "../components/OffersDrawer"
import { CancelModal } from "../components/CancelModal"
import { useApp } from "../context/AppContext"
import type { Booking, Offer } from "../types"

export default function DashboardLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { 
    unreadCount, 
    notifications, 
    setNotifications, 
    triggerToast,
    handleCancelBooking,
    handleCopyCoupon
  } = useApp()

  // Derive active tab from location
  const [currentNav, setCurrentNav] = useState<"home" | "bookings" | "favorites" | "profile">("bookings")
  
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/home")) {
      setCurrentNav("home")
    } else if (path.includes("/bookings")) {
      setCurrentNav("bookings")
    } else if (path.includes("/favorites")) {
      setCurrentNav("favorites")
    } else if (path.includes("/profile")) {
      setCurrentNav("profile")
    }
  }, [location])

  // Navigation action
  const handleNavChange = (navId: "home" | "bookings" | "favorites" | "profile") => {
    navigate(`/${navId}`)
    setShowNotifications(false)
  }

  // Local popup states
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showOffers, setShowOffers] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)

  // Available loyalty offers
  const offers: Offer[] = [
    { code: "ROMMOSAVE15", discount: "15% OFF", description: "Get 15% off on any Studio Room bookings this month.", expiry: "Valid till 30 Jun" },
    { code: "MEETFREE90", discount: "FREE 2 HOURS", description: "Book any meeting room for 4 hours and pay only for 2.", expiry: "Valid till 15 Jul" },
    { code: "LOYALTY500", discount: "₹500 OFF", description: "Exclusive gold member discount on premium suites.", expiry: "Valid till 31 Dec" }
  ]

  return (
    <>
      {/* FIXED HEADER SECTION */}
      <Header 
        currentNav={currentNav}
        unreadCount={unreadCount}
        showNotifications={showNotifications}
        setShowNotifications={setShowNotifications}
        notifications={notifications}
        setNotifications={setNotifications}
        triggerToast={triggerToast}
      />

      {/* SCROLLABLE INNER VIEWPORT */}
      <div className="flex-1 overflow-y-auto pb-28 pt-4 scrollbar-none z-10">
        <div className="max-w-3xl mx-auto w-full px-4">
          <Outlet context={{ setSelectedBooking, setShowOffers, setBookingToCancel }} />
        </div>
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <BottomNav 
        currentNav={currentNav}
        setCurrentNav={handleNavChange}
        setShowNotifications={setShowNotifications}
      />

      {/* DETAILS BOTTOM SHEET (View Details drawer) */}
      <BookingDetailsDrawer 
        selectedBooking={selectedBooking}
        setSelectedBooking={setSelectedBooking}
        setBookingToCancel={setBookingToCancel}
        triggerToast={triggerToast}
      />

      {/* OFFERS DRAWER */}
      <OffersDrawer 
        showOffers={showOffers}
        setShowOffers={setShowOffers}
        offers={offers}
        handleCopyCoupon={handleCopyCoupon}
      />

      {/* CANCELLATION MODAL */}
      <CancelModal 
        bookingToCancel={bookingToCancel}
        setBookingToCancel={setBookingToCancel}
        handleCancelBooking={handleCancelBooking}
      />
    </>
  )
}
