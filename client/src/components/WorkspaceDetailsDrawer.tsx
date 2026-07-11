import { useState, useRef, useEffect, useMemo } from "react"
import { X, Star, MapPin, Wifi, Coffee, Users, Tv, Calendar, Plus, Minus, Check, Eye, Smile, Share2, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "../context/AppContext"
import { API_BASE_URL } from "../config"
import { motion, AnimatePresence } from "framer-motion"

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
  onBook: (room: any, guests: number, date: string, preferences: { roomMood: string; addOnServices: any[]; splitPayments: any[] }) => void
}

export default function WorkspaceDetailsDrawer({ room, onClose, onBook }: WorkspaceDetailsDrawerProps) {
  const { triggerToast } = useApp()
  const [guests, setGuests] = useState(2)

  // Generate next 14 days starting from today dynamically
  const dateOptions = useMemo(() => {
    const options: string[] = []
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    const today = new Date()
    for (let i = 0; i < 14; i++) {
      const d = new Date()
      d.setDate(today.getDate() + i)
      const dayStr = daysOfWeek[d.getDay()]
      const monthStr = months[d.getMonth()]
      const dateNum = String(d.getDate()).padStart(2, '0')
      options.push(`${dateNum} ${monthStr}, ${dayStr}`)
    }
    return options
  }, [])

  const [selectedDate, setSelectedDate] = useState(dateOptions[0])
  const [isBooked, setIsBooked] = useState(false)

  // 360 Tour State
  const [show360, setShow360] = useState(false)
  const [panOffset, setPanOffset] = useState(0)
  const [perspective, setPerspective] = useState<"bed" | "work" | "washroom">("work")
  const isDragging = useRef(false)
  const startX = useRef(0)

  // Price Trend State
  const [priceTrend, setPriceTrend] = useState<any>(null)

  useEffect(() => {
    if (room?.id) {
      fetch(`${API_BASE_URL}/api/rooms/${room.id}/price-trend`)
        .then(res => res.json())
        .then(data => setPriceTrend(data))
        .catch(err => console.error("Error loading price trends:", err))
    }
  }, [room?.id])

  // Room Mood Selection (Feature 3)
  const [selectedMood, setSelectedMood] = useState("Standard")
  const moods = [
    { id: "Standard", name: "Standard", icon: "🏨", desc: "Clean & prepared room" },
    { id: "Romantic", name: "Romantic", icon: "💖", desc: "Warm lighting & flower bed decorations (+₹1000)" },
    { id: "Work", name: "Work From Hotel", icon: "💻", desc: "Dual monitor setup & high-speed router (+₹500)" },
    { id: "Family", name: "Family Setup", icon: "👨‍👩‍👧‍👦", desc: "Kids play kit & extra bedding (+₹600)" },
    { id: "Birthday", name: "Birthday Decor", icon: "🎂", desc: "Balloons, cake & party banners (+₹1200)" }
  ]

  // Nearby Experience Add-ons (Feature 9)
  const [selectedAddons, setSelectedAddons] = useState<any[]>([])
  const addonsList = [
    { id: "taxi", name: "Airport Taxi Drop/Pick", price: 700, icon: "🚕" },
    { id: "bike", name: "Bike Rental (Activa/Pulsar)", price: 350, icon: "🏍️" },
    { id: "tour", name: "Local Sightseeing Guide", price: 1200, icon: "🗺️" },
    { id: "meals", name: "Premium Restaurant Deals", price: 400, icon: "🍽" }
  ]

  // Split Payment (Feature 5)
  const [isSplitActive, setIsSplitActive] = useState(false)
  const [friendEmail, setFriendEmail] = useState("")
  const [splitEmails, setSplitEmails] = useState<string[]>([])

  if (!room) return null

  const handleAddSplitEmail = () => {
    if (friendEmail && friendEmail.includes("@")) {
      setSplitEmails(prev => [...prev, friendEmail.toLowerCase()])
      setFriendEmail("")
    }
  }

  const handleRemoveSplitEmail = (idx: number) => {
    setSplitEmails(prev => prev.filter((_, i) => i !== idx))
  }

  // Calculate pricing
  const moodPrice = selectedMood === "Romantic" ? 1000 : selectedMood === "Work" ? 500 : selectedMood === "Family" ? 600 : selectedMood === "Birthday" ? 1200 : 0
  const addonsPrice = selectedAddons.reduce((acc, curr) => acc + curr.price, 0)
  const finalPrice = room.price + moodPrice + addonsPrice
  const splitAmount = isSplitActive ? Math.round(finalPrice / (splitEmails.length + 1)) : finalPrice

  const amenities = [
    { icon: <Wifi className="h-4 w-4" />, name: "High-speed Wi-Fi" },
    { icon: <Coffee className="h-4 w-4" />, name: "Complementary Coffee/Tea" },
    { icon: <Tv className="h-4 w-4" />, name: "LED Projector / Screen" },
    { icon: <Users className="h-4 w-4" />, name: "Ergonomic Seating" },
  ]

  const handleConfirmBooking = () => {
    setIsBooked(true)
    setTimeout(() => {
      onBook(
        room, 
        guests, 
        selectedDate, 
        {
          roomMood: selectedMood,
          addOnServices: selectedAddons,
          splitPayments: isSplitActive ? [
            { email: "me", amount: splitAmount, status: "Paid" },
            ...splitEmails.map(email => ({ email, amount: splitAmount, status: "Pending" }))
          ] : []
        }
      )
      setIsBooked(false)
      onClose()
    }, 1200)
  }

  // 360 mouse-drag simulation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.clientX - panOffset
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const offset = e.clientX - startX.current
    // Bound the panning movement
    setPanOffset(Math.max(-200, Math.min(200, offset)))
  }

  const handleMouseUpOrLeave = () => {
    isDragging.current = false
  }

  const toggleAddon = (addon: any) => {
    if (selectedAddons.some(a => a.id === addon.id)) {
      setSelectedAddons(prev => prev.filter(a => a.id !== addon.id))
    } else {
      setSelectedAddons(prev => [...prev, addon])
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center rounded-none overflow-hidden">
      {/* Outer Click Closer */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 z-0 bg-zinc-900/60 backdrop-blur-xs" 
        onClick={onClose}
      />

      {/* Drawer Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full bg-white rounded-none p-6 max-h-[95%] overflow-y-auto shadow-2xl dark:bg-zinc-900"
      >
        
        {/* Header Section */}
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{room.type} Details</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">{room.title}</h3>
            <button 
              type="button"
              onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(room.location)}`, "_blank")}
              className="flex items-center gap-1 mt-1.5 text-[10px] text-zinc-400 hover:text-primary hover:underline transition-colors cursor-pointer dark:text-zinc-555"
            >
              <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
              <span>{room.location} (View on Map)</span>
            </button>
          </div>
          <button 
            onClick={onClose}
            className="rounded-none p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Gallery Image with 360 Option (Feature 2) */}
        <div className="relative h-44 w-full overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-850 rounded-none">
          <img 
            src={room.image} 
            alt={room.title}
            className="h-full w-full object-cover"
          />
          
          {/* 360 Virtual Tour Button */}
          <button
            onClick={() => setShow360(true)}
            className="absolute top-3 left-3 bg-zinc-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-none text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5 hover:bg-primary active:scale-95 transition-all cursor-pointer shadow-md"
          >
            <Eye className="h-3.5 w-3.5 text-white" />
            <span>Virtual 360° Tour</span>
          </button>

          <div className="absolute bottom-3 right-3 bg-zinc-950/75 backdrop-blur-md px-3 py-1 rounded-none text-xs font-bold text-white flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-yellow-450 text-yellow-450" />
            <span>{room.rating}</span>
            <span className="text-[9px] text-white/60 font-medium">({room.reviews} reviews)</span>
          </div>
        </div>

        {/* Smart Price Predictor Indicator with interactive SVG/HTML chart (Feature 4) */}
        <div className="bg-orange-50 border border-orange-200/50 dark:bg-orange-950/20 dark:border-orange-900/30 p-4 mb-4 rounded-none text-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">📈</span>
            <div>
              <p className="font-extrabold uppercase text-[9px] tracking-wider text-orange-500">Smart Price Predictor (Live Trends)</p>
              {priceTrend ? (
                <p className="font-bold text-[10.5px] text-zinc-800 dark:text-zinc-200 mt-0.5">
                  Best Day to Book: <span className="text-emerald-600 font-extrabold">{priceTrend.bestDayToBook.day} ({priceTrend.bestDayToBook.date})</span> at only <span className="text-primary font-extrabold">₹{priceTrend.bestDayToBook.price}</span>.
                </p>
              ) : (
                <p className="font-semibold text-[10px] text-zinc-550 dark:text-zinc-400 mt-0.5">Fetching optimal pricing dates...</p>
              )}
            </div>
          </div>

          {priceTrend && (
            <div className="flex flex-col gap-2">
              {/* Vertical Bar Chart */}
              <div className="flex items-end justify-between h-16 px-2 border-b border-zinc-200 dark:border-zinc-800 pb-1">
                {priceTrend.trends.map((t: any, idx: number) => {
                  // Calculate height percentage relative to base price
                  const heightPercent = Math.max(30, Math.min(100, (t.price / (room.price * 1.2)) * 100))
                  const isLowest = t.price === priceTrend.bestDayToBook.price
                  
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedDate(`${t.date}, ${t.day}`)
                        triggerToast(`Set booking date to ${t.date}, ${t.day}!`)
                      }}
                      className="group flex flex-col items-center flex-1 cursor-pointer"
                      title={`${t.day}: ₹${t.price} (${t.demand} demand)`}
                    >
                      <div className="text-[8px] font-bold text-zinc-400 group-hover:text-primary mb-1 scale-90 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{t.price}
                      </div>
                      <div 
                        style={{ height: `${heightPercent * 0.4}px` }} 
                        className={`w-4 transition-all duration-300 ${
                          isLowest 
                            ? "bg-emerald-500 dark:bg-emerald-600 group-hover:bg-emerald-400" 
                            : t.demand === "High" 
                              ? "bg-orange-400 dark:bg-orange-500 group-hover:bg-orange-300"
                              : "bg-zinc-300 dark:bg-zinc-700 group-hover:bg-primary"
                        }`}
                      ></div>
                      <span className="text-[8px] font-black text-zinc-500 mt-1 uppercase tracking-tighter">
                        {t.day}
                      </span>
                    </button>
                  )
                })}
              </div>
              <p className="text-[8.5px] text-zinc-450 dark:text-zinc-500 uppercase tracking-wider font-extrabold text-center mt-1">
                💡 Click any day column above to book instantly for that date
              </p>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="flex flex-col gap-5 text-xs">
          
          {/* Key Amenities */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2">
              Key Amenities Included
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {amenities.map((item) => (
                <div 
                  key={item.name} 
                  className="flex items-center gap-2 p-2.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50 rounded-none"
                >
                  <span className="text-primary">{item.icon}</span>
                  <span className="font-bold text-zinc-700 dark:text-zinc-350">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Room Mood Selector (Feature 3) */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <Smile className="h-3.5 w-3.5 text-primary" />
              Select Room Mood Theme
            </h4>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`flex flex-col items-center gap-1.5 p-2.5 border min-w-28 text-center transition-all cursor-pointer rounded-none shrink-0 ${
                    selectedMood === mood.id 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                  }`}
                >
                  <span className="text-lg">{mood.icon}</span>
                  <span className="font-black text-[9px] uppercase tracking-wider">{mood.name}</span>
                  <span className="text-[7.5px] text-zinc-400 font-medium leading-normal line-clamp-1">{mood.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Nearby Experience Bookings (Feature 9) */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2 flex items-center gap-1">
              <Compass className="h-3.5 w-3.5 text-primary" />
              Nearby Experience Booking (Add-ons)
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {addonsList.map((addon) => {
                const isActive = selectedAddons.some(a => a.id === addon.id)
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    className={`flex items-center gap-2 p-2.5 border text-left cursor-pointer transition-all rounded-none ${
                      isActive 
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-xs" 
                        : "border-zinc-200 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
                    }`}
                  >
                    <span className="text-base shrink-0">{addon.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[10px] truncate leading-tight">{addon.name}</p>
                      <p className="text-[9px] text-zinc-400 mt-0.5">+₹{addon.price}</p>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Split Payment Options (Feature 5) */}
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Share2 className="h-3.5 w-3.5 text-primary" />
                Split Payment with Friends
              </h4>
              <button 
                type="button"
                onClick={() => {
                  setIsSplitActive(!isSplitActive)
                  if (isSplitActive) setSplitEmails([])
                }}
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-none transition-all ${
                  isSplitActive ? "bg-primary text-white shadow-md shadow-primary/10" : "bg-zinc-100 text-zinc-555 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {isSplitActive ? "Split ON" : "Split OFF"}
              </button>
            </div>
            
            {isSplitActive && (
              <div className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850 mt-2 rounded-none">
                <p className="text-[9.5px] text-zinc-450 dark:text-zinc-500 font-semibold uppercase tracking-wider">
                  Invite friends to pay their share online. Total amount will be divided equally.
                </p>
                <div className="flex gap-2 mt-1">
                  <input 
                    type="email"
                    value={friendEmail}
                    onChange={(e) => setFriendEmail(e.target.value)}
                    placeholder="Enter friend's email..."
                    className="flex-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 rounded-none text-xs text-foreground focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddSplitEmail}
                    className="bg-zinc-900 text-white font-extrabold text-[9px] uppercase tracking-widest px-4.5 rounded-none hover:bg-zinc-800 cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                {splitEmails.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {splitEmails.map((email, idx) => (
                      <span 
                        key={email} 
                        className="bg-white border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 text-[9px] font-bold text-zinc-700 dark:text-zinc-350 px-3 py-1 rounded-none flex items-center gap-1.5"
                      >
                        {email}
                        <button 
                          type="button" 
                          onClick={() => handleRemoveSplitEmail(idx)} 
                          className="text-red-500 font-black cursor-pointer hover:text-red-700 text-xs"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Booking Options Selectors */}
          <div className="grid grid-cols-2 gap-3.5 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            
            {/* Guests Counter Selector */}
            <div className="flex flex-col gap-1.5">
              <span className="font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">
                Number of Guests
              </span>
              <div className="flex items-center justify-between border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-none">
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
              <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50/50 dark:bg-zinc-900/30 rounded-none">
                <Calendar className="h-3.5 w-3.5 text-primary mr-2 shrink-0" />
                <select 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden cursor-pointer"
                >
                  {dateOptions.map((opt) => (
                    <option key={opt} value={opt} className="dark:bg-zinc-900">
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

          </div>

          {/* Pricing & Checkout Summary */}
          <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider dark:text-zinc-550">
                {isSplitActive ? `Your Share (${splitEmails.length + 1} splits)` : "Total Price (Incl. GST)"}
              </span>
              <span className="text-lg font-black text-primary">
                ₹{splitAmount}
                {isSplitActive ? (
                  <span className="text-[9px] font-bold text-zinc-550 dark:text-zinc-400"> (Total: ₹{finalPrice})</span>
                ) : (
                  <span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-400">/day</span>
                )}
              </span>
            </div>

            <Button 
              onClick={handleConfirmBooking}
              disabled={isBooked}
              className="rounded-none py-3.5 px-6 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/20 border border-primary/10 flex items-center gap-1.5"
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

      </motion.div>

      {/* 360 VIRTUAL TOUR DIALOG OVERLAY (Feature 2) */}
      <AnimatePresence>
        {show360 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-60 bg-zinc-955/95 flex flex-col items-center justify-center p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg flex flex-col items-center text-center"
            >
              
              {/* Header */}
              <div className="flex justify-between w-full border-b border-zinc-800 pb-3 mb-6 items-center">
                <div className="text-left">
                  <span className="text-[8px] font-bold text-primary uppercase tracking-widest">Interactive 360 View</span>
                  <h4 className="text-sm font-black text-white uppercase tracking-wider leading-snug">{room.title}</h4>
                </div>
                <button 
                  onClick={() => setShow360(false)}
                  className="rounded-none p-2 bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Draggable panorama screen */}
              <div 
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="relative h-60 w-full overflow-hidden border border-zinc-800 cursor-grab active:cursor-grabbing bg-zinc-900 flex items-center justify-center"
              >
                <img 
                  src={
                    perspective === "bed" ? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800" :
                    perspective === "washroom" ? "https://images.unsplash.com/photo-1552321554-5fecd8c78568?auto=format&fit=crop&q=80&w=800" :
                    "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
                  }
                  alt="360 view"
                  style={{
                    transform: `scale(2.2) translateX(${panOffset}px)`,
                    transition: isDragging.current ? "none" : "transform 0.4s ease-out"
                  }}
                  className="h-full w-full object-cover select-none pointer-events-none"
                />
                
                {/* Floating parallax hotspots (3D coordinate illusion) */}
                <button
                  type="button"
                  onClick={() => { setPerspective("bed"); setPanOffset(-120); }}
                  style={{ left: `calc(25% + ${panOffset * 1.5}px)` }}
                  className={`absolute top-[45%] -translate-y-1/2 z-10 h-7 w-7 rounded-none border border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                    perspective === "bed" ? "bg-primary animate-ping" : "bg-primary/80"
                  }`}
                >
                  🛏️
                </button>

                <button
                  type="button"
                  onClick={() => { setPerspective("work"); setPanOffset(0); }}
                  style={{ left: `calc(50% + ${panOffset * 1.5}px)` }}
                  className={`absolute top-[35%] -translate-y-1/2 z-10 h-7 w-7 rounded-none border border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                    perspective === "work" ? "bg-blue-600 animate-ping" : "bg-blue-600/80"
                  }`}
                >
                  💻
                </button>

                <button
                  type="button"
                  onClick={() => { setPerspective("washroom"); setPanOffset(120); }}
                  style={{ left: `calc(75% + ${panOffset * 1.5}px)` }}
                  className={`absolute top-[60%] -translate-y-1/2 z-10 h-7 w-7 rounded-none border border-white flex items-center justify-center text-white text-[10px] font-bold shadow-lg transition-transform hover:scale-110 active:scale-95 ${
                    perspective === "washroom" ? "bg-emerald-600 animate-ping" : "bg-emerald-600/80"
                  }`}
                >
                  🚿
                </button>

                {/* Overlay compass/guideline */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-10 w-10 rounded-none border-2 border-white/20 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-white/50 animate-spin" />
                  </div>
                </div>
                
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/65 backdrop-blur-xs px-3.5 py-1 rounded-none text-[9px] font-bold text-white uppercase tracking-wider whitespace-nowrap">
                  ↔ Drag left/right OR click hotspots to pan view
                </div>
              </div>

              {/* Clickable Hotspots selector (Feature 2) */}
              <div className="grid grid-cols-3 gap-2 w-full mt-4 text-[9px] uppercase tracking-wider font-extrabold">
                <button
                  type="button"
                  onClick={() => {
                    setPerspective("bed")
                    setPanOffset(-120)
                  }}
                  className={`p-2 border rounded-none transition-all cursor-pointer ${
                    perspective === "bed" ? "border-primary bg-primary/5 text-primary" : "border-zinc-850 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  🛏️ King Bed Area
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPerspective("work")
                    setPanOffset(0)
                  }}
                  className={`p-2 border rounded-none transition-all cursor-pointer ${
                    perspective === "work" ? "border-primary bg-primary/5 text-primary" : "border-zinc-855 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  💻 Work Desk Area
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPerspective("washroom")
                    setPanOffset(120)
                  }}
                  className={`p-2 border rounded-none transition-all cursor-pointer ${
                    perspective === "washroom" ? "border-primary bg-primary/5 text-primary" : "border-zinc-850 bg-zinc-900/40 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  🚿 Luxury Washroom
                </button>
              </div>
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
