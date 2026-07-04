import { useState } from "react"
import { X, Star, MapPin, Wifi, Coffee, Users, Tv, Calendar, Plus, Minus, Check, Map } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WorkspaceDetailsDrawerProps {
  room: {
    id: string
    title: string
    location: string
    price: number
    image: string
    rating: number
    type: string
    reviews: number
  } | null
  onClose: () => void
  onBook: (room: any, guests: number, date: string) => void
}

export default function WorkspaceDetailsDrawer({ room, onClose, onBook }: WorkspaceDetailsDrawerProps) {
  if (!room) return null

  const [guests, setGuests] = useState(2)
  const [selectedDate, setSelectedDate] = useState("28 Jun, Sun")
  const [isBooked, setIsBooked] = useState(false)

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />, name: "High-speed Wi-Fi" },
    { icon: <Coffee className="h-4 w-4" />, name: "Complementary Coffee/Tea" },
    { icon: <Tv className="h-4 w-4" />, name: "LED Projector / Screen" },
    { icon: <Users className="h-4 w-4" />, name: "Ergonomic Seating" },
  ]

  const handleConfirmBooking = () => {
    setIsBooked(true)
    setTimeout(() => {
      onBook(room, guests, selectedDate)
      setIsBooked(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-end animate-fadeIn rounded-none">
      {/* Outer Click Closer */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Drawer Sheet */}
      <div className="relative z-10 w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[95%] overflow-y-auto shadow-2xl dark:bg-zinc-900 animate-slideUp">
        
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{room.type} Details</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">{room.title}</h3>
            <button 
              type="button"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`, "_blank")}
              className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-400 hover:text-primary hover:underline transition-colors cursor-pointer dark:text-zinc-550"
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{room.location} (View on Map)</span>
            </button>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Gallery Image */}
        <div className="relative h-44 w-full overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-850">
          <img 
            src={room.image} 
            alt={room.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 right-3 bg-zinc-950/75 backdrop-blur-md px-3 py-1 text-xs font-bold text-white flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-450 text-yellow-450" />
            <span>{room.rating}</span>
            <span className="text-[9px] text-white/60 font-medium">({room.reviews} reviews)</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-4 text-xs">
          
          {/* About Workspace */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-1.5">
              About this Space
            </h4>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
              Premium premium serviced space fully equipped with smart technologies. Ideal for meetings, collaborative work, or high-focus individual sessions. Includes secure printing access and clean pantry services.
            </p>
          </div>

          {/* Simulated Map View Card */}
          <div 
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`, "_blank")}
            className="group relative h-20 w-full overflow-hidden border border-zinc-200 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-950 cursor-pointer flex flex-col justify-end p-2.5 transition-all hover:border-primary/30"
          >
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d9531e_1px,transparent_1px)] [background-size:12px_12px] dark:opacity-25"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1 bg-white/95 dark:bg-zinc-900/95 shadow-md px-3.5 py-2 border border-zinc-100 dark:border-zinc-800 rounded-none group-hover:scale-103 transition-transform duration-300">
                <div className="flex items-center gap-1.5">
                  <Map className="h-3.5 w-3.5 text-primary animate-bounce" />
                  <span className="font-extrabold text-[8px] uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Open in Google Maps</span>
                </div>
              </div>
            </div>
            <span className="relative z-10 text-[8px] font-bold text-zinc-450 dark:text-zinc-500 truncate w-[75%]">
              {room.location}
            </span>
          </div>

          {/* Key Amenities */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2">
              Key Amenities Included
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50"
                >
                  <span className="text-primary">{item.icon}</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-350">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Options Selectors */}
          <div className="grid grid-cols-2 gap-3.5 border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-1">
            
            {/* Guests Counter Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">
                Number of Guests
              </span>
              <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
                <button 
                  type="button" 
                  disabled={guests <= 1}
                  onClick={() => setGuests(prev => prev - 1)}
                  className="p-1 text-zinc-500 hover:text-primary disabled:opacity-30 cursor-pointer"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-black text-zinc-900 dark:text-white">{guests}</span>
                <button 
                  type="button"
                  onClick={() => setGuests(prev => prev + 1)}
                  className="p-1 text-zinc-500 hover:text-primary cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Date Selection */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">
                Select Date
              </span>
              <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
                <Calendar className="h-3.5 w-3.5 text-primary mr-2 shrink-0" />
                <select 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden cursor-pointer"
                >
                  <option value="28 Jun, Sun">28 Jun, Sun</option>
                  <option value="29 Jun, Mon">29 Jun, Mon</option>
                  <option value="30 Jun, Tue">30 Jun, Tue</option>
                  <option value="01 Jul, Wed">01 Jul, Wed</option>
                </select>
              </div>
            </div>

          </div>

          {/* Pricing & Checkout Summary */}
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider dark:text-zinc-550">
                Total Price (Incl. GST)
              </span>
              <span className="text-lg font-black text-primary">
                ₹{room.price}
                <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-400">/day</span>
              </span>
            </div>

            <Button 
              onClick={handleConfirmBooking}
              disabled={isBooked}
              className="rounded-none py-6 px-6 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/20 border border-primary/10 flex items-center gap-1.5"
            >
              {isBooked ? (
                <>
                  <Check className="h-4 w-4" />
                  BOOKED!
                </>
              ) : (
                "CONFIRM BOOKING"
              )}
            </Button>
          </div>

        </div>

      </div>
    </div>
  )
}
