import { AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"
import type { Booking } from "../types"

interface CancelModalProps {
  bookingToCancel: Booking | null
  setBookingToCancel: (booking: Booking | null) => void
  handleCancelBooking: (bookingId: string) => void
}

export function CancelModal({ bookingToCancel, setBookingToCancel, handleCancelBooking }: CancelModalProps) {
  if (!bookingToCancel) return null

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-6 rounded-none overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs" 
        onClick={() => setBookingToCancel(null)}
      />

      {/* Modal Card */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
        className="relative z-10 w-full bg-white rounded-none p-5 shadow-2xl dark:bg-zinc-900 max-w-[340px]"
      >
        <div className="flex flex-col items-center text-center">
          <div className="rounded-none bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-400 mb-3.5">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">Cancel this booking?</h4>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Are you sure you want to cancel your booking for <strong className="text-zinc-800 dark:text-zinc-200">{bookingToCancel.title}</strong>? A full refund will be processed to your source account.
          </p>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setBookingToCancel(null)}
            className="flex-grow rounded-none bg-zinc-100 py-2.5 text-xs font-bold text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-750 transition-colors cursor-pointer"
          >
            No, Keep it
          </button>
          <button
            onClick={() => handleCancelBooking(bookingToCancel.id)}
            className="flex-grow rounded-none bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors cursor-pointer"
          >
            Yes, Cancel
          </button>
        </div>
      </motion.div>
    </div>
  )
}
