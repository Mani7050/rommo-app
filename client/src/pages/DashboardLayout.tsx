import { useState, useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Header } from "../components/Header"
import { BottomNav } from "../components/BottomNav"
import { BookingDetailsDrawer } from "../components/BookingDetailsDrawer"
import { OffersDrawer } from "../components/OffersDrawer"
import { CancelModal } from "../components/CancelModal"
import WorkspaceDetailsDrawer from "../components/WorkspaceDetailsDrawer"
import MaintenanceCleaningDrawer from "../components/MaintenanceCleaningDrawer"
import AccountSettingsDrawer from "../components/AccountSettingsDrawer"
import SecurityPinDrawer from "../components/SecurityPinDrawer"
import HelpSupportDrawer from "../components/HelpSupportDrawer"
import FAQDrawer from "../components/FAQDrawer"
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
    handleCopyCoupon,
    handleBookRoom
  } = useApp()

  // Derive active tab from location
  const [currentNav, setCurrentNav] = useState<"home" | "bookings" | "favorites" | "offers" | "profile">("home")
  
  useEffect(() => {
    const path = location.pathname
    if (path.includes("/home")) {
      setCurrentNav("home")
    } else if (path.includes("/bookings")) {
      setCurrentNav("bookings")
    } else if (path.includes("/favorites")) {
      setCurrentNav("favorites")
    } else if (path.includes("/offers")) {
      setCurrentNav("offers")
    } else if (path.includes("/profile")) {
      setCurrentNav("profile")
    }
  }, [location])

  // Navigation action
  const handleNavChange = (navId: "home" | "bookings" | "favorites" | "offers" | "profile") => {
    navigate(`/${navId}`)
    setShowNotifications(false)
  }

  // Local popup states
  const [showNotifications, setShowNotifications] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showOffers, setShowOffers] = useState(false)
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<any | null>(null)
  const [showMaintenance, setShowMaintenance] = useState(false)
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  const [showSecurityPin, setShowSecurityPin] = useState(false)
  const [showHelpSupport, setShowHelpSupport] = useState(false)
  const [showFAQ, setShowFAQ] = useState(false)

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
      <div className="flex-1 overflow-y-auto pb-6 pt-4 scrollbar-none z-10">
        <div className="max-w-3xl mx-auto w-full px-4">
          <Outlet context={{ 
            setSelectedBooking, 
            setShowOffers, 
            setBookingToCancel, 
            setSelectedRoom, 
            setShowMaintenance,
            setShowAccountSettings,
            setShowSecurityPin,
            setShowHelpSupport,
            setShowFAQ
          }} />
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

      {/* WORKSPACE/ROOM DETAIL DRAWER */}
      <WorkspaceDetailsDrawer 
        room={selectedRoom} 
        onClose={() => setSelectedRoom(null)} 
        onBook={(room, guests, date, preferences) => {
          handleBookRoom({
            ...room,
            guests,
            checkInDate: date,
            ...preferences
          })
        }}
      />

      {/* MAINTENANCE/CLEANING SERVICES DRAWER */}
      <MaintenanceCleaningDrawer 
        isOpen={showMaintenance}
        onClose={() => setShowMaintenance(false)}
      />

      {/* ACCOUNT SETTINGS DRAWER */}
      <AccountSettingsDrawer 
        isOpen={showAccountSettings}
        onClose={() => setShowAccountSettings(false)}
      />

      {/* SECURITY PIN DRAWER */}
      <SecurityPinDrawer 
        isOpen={showSecurityPin}
        onClose={() => setShowSecurityPin(false)}
      />

      {/* HELP & SUPPORT SERVICES DRAWER */}
      <HelpSupportDrawer 
        isOpen={showHelpSupport}
        onClose={() => setShowHelpSupport(false)}
      />

      {/* FAQ DRAWER */}
      <FAQDrawer 
        isOpen={showFAQ}
        onClose={() => setShowFAQ(false)}
      />
    </>
  )
}
