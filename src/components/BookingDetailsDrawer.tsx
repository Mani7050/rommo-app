import { X, ShieldCheck, Copy, Map } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Booking } from "../types"

interface BookingDetailsDrawerProps {
  selectedBooking: Booking | null
  setSelectedBooking: (booking: Booking | null) => void
  setBookingToCancel: (booking: Booking | null) => void
  triggerToast: (msg: string) => void
}

export function BookingDetailsDrawer({
  selectedBooking,
  setSelectedBooking,
  setBookingToCancel,
  triggerToast
}: BookingDetailsDrawerProps) {
  if (!selectedBooking) return null

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    triggerToast(`Copied "${text}" to clipboard!`)
  }

  return (
    <div className="absolute inset-0 z-40 bg-zinc-900/60 backdrop-blur-xs flex items-end animate-fadeIn rounded-none">
      {/* Sheet Content */}
      <div className="w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[90%] overflow-y-auto shadow-2xl dark:bg-zinc-900 animate-slideUp">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Booking Info</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selectedBooking.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedBooking(null)}
            className="rounded-none p-1.5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          {/* Details list */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Booking Reference</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200 bg-zinc-100 px-2 py-0.5 rounded-none dark:bg-zinc-800">
                {selectedBooking.bookingCode}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Location</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200 text-right">{selectedBooking.location}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.guests} Guests</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.checkInDate}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.checkOutDate}</span>
            </div>
          </div>

          {/* Self Check-in Credentials */}
          {selectedBooking.wifiName && (
            <div className="bg-primary/5 rounded-none p-4 border border-primary/10 dark:bg-primary/10">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Self Check-in details
              </h4>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Entrance PIN:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono tracking-widest">{selectedBooking.entryPin}</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-primary/10 pt-2 mt-1">
                  <span className="text-muted-foreground">Wi-Fi network:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.wifiName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Wi-Fi password:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{selectedBooking.wifiPassword}</span>
                    <button 
                      onClick={() => selectedBooking.wifiPassword && handleCopy(selectedBooking.wifiPassword)}
                      className="p-1 text-primary hover:scale-110 transition-transform cursor-pointer rounded-none"
                      title="Copy Password"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment summary */}
          <div className="bg-zinc-50 rounded-none p-4 dark:bg-zinc-800/40">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">Payment Summary</h4>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Room Fare</span>
                <span>₹{(selectedBooking.price * 0.82).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{(selectedBooking.price * 0.18).toFixed(0)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-2 mt-1 font-bold text-zinc-900 dark:text-zinc-100 dark:border-zinc-700">
                <span>Paid Amount</span>
                <span className="text-primary">₹{selectedBooking.price}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-2">
            <Button 
              onClick={() => {
                triggerToast("Directions simulator loaded in Maps")
              }}
              className="rounded-none py-6 font-bold bg-primary text-white hover:bg-primary/95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Map className="h-4.5 w-4.5" />
              Get Directions
            </Button>
            <Button 
              onClick={() => {
                setBookingToCancel(selectedBooking)
                setSelectedBooking(null)
              }}
              variant="outline" 
              className="rounded-none border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-950/50 dark:hover:bg-red-950/20 font-semibold cursor-pointer text-xs"
            >
              Cancel Booking
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
