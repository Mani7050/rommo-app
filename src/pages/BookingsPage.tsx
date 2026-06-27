import { useState } from "react"
import { Calendar, Gift, MapPin, Star } from "lucide-react"
import { useOutletContext } from "react-router-dom"
import { useApp } from "../context/AppContext"
import type { Booking } from "../types"

interface DashboardOutletContext {
  setSelectedBooking: (booking: Booking | null) => void
  setShowOffers: (show: boolean) => void
  setBookingToCancel: (booking: Booking | null) => void
}

export default function BookingsPage() {
  const { bookings } = useApp()
  const { setSelectedBooking, setShowOffers, setBookingToCancel } = useOutletContext<DashboardOutletContext>()
  const [bookingTab, setBookingTab] = useState<"upcoming" | "completed" | "cancelled">("upcoming")

  const filteredBookings = bookings.filter((b) => {
    if (bookingTab === "upcoming") return b.status === "CONFIRMED" || b.status === "PENDING"
    if (bookingTab === "completed") return b.status === "COMPLETED"
    if (bookingTab === "cancelled") return b.status === "CANCELLED"
    return true
  })

  return (
    <div className="flex flex-col gap-5 mt-2 animate-fadeIn rounded-none">
      
      {/* Bookings Sub-Tabs */}
      <div className="flex border-b border-zinc-150 dark:border-zinc-800 rounded-none">
        {(["upcoming", "completed", "cancelled"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setBookingTab(tab)}
            className={`flex-1 pb-3 text-xs font-bold text-center border-b-2 capitalize transition-all cursor-pointer rounded-none ${
              bookingTab === tab 
                ? "border-primary text-primary font-extrabold" 
                : "border-transparent text-muted-foreground hover:text-zinc-700 dark:hover:text-zinc-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Loyalty Card Banner */}
      <div className="relative overflow-hidden bg-linear-to-r from-primary to-primary/80 p-5 shadow-lg border border-primary/20 flex items-center justify-between rounded-none">
        <div className="flex flex-col gap-1.5 z-10">
          <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase">Rommo Platinum Club</span>
          <h3 className="text-lg font-black text-white leading-none">Unlock Gold Rewards</h3>
          <p className="text-[10px] text-white/70 max-w-[200px]">Earn points on check-ins, unlock free lounge visits, and exclusive member discounts.</p>
        </div>
        <button 
          type="button"
          onClick={() => setShowOffers(true)}
          className="rounded-none bg-white p-3 shadow-md hover:scale-105 active:scale-95 transition-all text-primary cursor-pointer z-10"
        >
          <Gift className="h-5.5 w-5.5" />
        </button>
        <div className="absolute right-[-20px] bottom-[-20px] h-32 w-32 rounded-none bg-white/10 rotate-45 -z-0"></div>
      </div>

      {/* Bookings List */}
      <div>
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 p-6 rounded-none">
            <Calendar className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
            <h4 className="font-bold text-zinc-800 dark:text-zinc-300 text-sm">No reservations yet</h4>
            <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Book custom executive spaces Indiranagar on the marketplace tab.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id}
                className="flex flex-col border border-zinc-100 bg-white p-3.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/50 hover:border-zinc-200 transition-colors rounded-none"
              >
                {/* Header Info */}
                <div className="flex gap-3">
                  <div className="h-20 w-20 shrink-0 overflow-hidden bg-zinc-100 dark:bg-zinc-800 rounded-none">
                    <img src={booking.image} alt={booking.title} className="h-full w-full object-cover" />
                  </div>
                  
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-1">
                      <span className="text-[9px] font-bold text-primary tracking-widest uppercase">{booking.type || "Workspace"}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-none border ${
                        booking.status === "CONFIRMED" 
                          ? "bg-green-50/50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-950/30" 
                          : booking.status === "COMPLETED"
                          ? "bg-zinc-100 text-zinc-650 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:border-zinc-700"
                          : booking.status === "CANCELLED"
                          ? "bg-red-50/50 text-red-650 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-950/30"
                          : "bg-amber-50/50 text-amber-700 border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-955/30"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm truncate leading-snug">
                      {booking.title}
                    </h4>
                    <div className="flex items-center gap-0.5 text-[10px] text-zinc-400 dark:text-zinc-550 leading-none">
                      <MapPin className="h-3 w-3 shrink-0" />
                      <span className="truncate">{booking.location}</span>
                    </div>
                  </div>
                </div>

                {/* Reservation Dates */}
                <div className="grid grid-cols-2 gap-2 border-y border-zinc-100 my-3.5 py-3 dark:border-zinc-800 text-[11px]">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-zinc-400 dark:text-zinc-550 uppercase text-[9px] tracking-wider">CHECK-IN</span>
                    <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{booking.checkInDate}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 border-l border-zinc-100 pl-3 dark:border-zinc-800">
                    <span className="font-bold text-zinc-400 dark:text-zinc-550 uppercase text-[9px] tracking-wider">CHECK-OUT</span>
                    <span className="font-extrabold text-zinc-700 dark:text-zinc-300">{booking.checkOutDate}</span>
                  </div>
                </div>

                {/* Bottom interactive action buttons */}
                <div className="flex items-center justify-between mt-0.5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">Paid Amount</span>
                    <span className="text-sm font-black text-primary">₹{booking.price.toLocaleString("en-IN")}</span>
                  </div>
                  
                  {bookingTab === "upcoming" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setBookingToCancel(booking)}
                        className="rounded-none border border-zinc-200 px-3.5 py-2 text-[10px] font-bold text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-800 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="rounded-none bg-primary px-4 py-2 text-[10px] font-bold text-white hover:bg-primary/95 cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  ) : bookingTab === "completed" ? (
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-3.5 w-3.5 ${star <= (booking.rating || 5) ? "fill-amber-400 text-amber-400" : "text-zinc-200 dark:text-zinc-800"}`} 
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-[11px] font-bold text-red-650 dark:text-red-400 bg-red-50/50 dark:bg-red-950/20 px-2.5 py-1 rounded-none border border-red-100 dark:border-red-950/30">
                      Cancelled & Refunded
                    </span>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
