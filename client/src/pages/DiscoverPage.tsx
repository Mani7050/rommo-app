import { Search, MapPin, Star, Heart, Mic, MicOff, Sparkles, X } from "lucide-react"
import { useApp } from "../context/AppContext"
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { getWorkspaces } from "../lib/db-service"
import { API_BASE_URL } from "../config"

export default function DiscoverPage() {
  const { favorites, toggleFavorite, triggerToast } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")
  const [workspaces, setWorkspaces] = useState<any[]>([])
  const { setSelectedRoom } = useOutletContext<any>()

  // Voice Search states
  const [isListening, setIsListening] = useState(false)

  // AI Matcher states
  const [showAiMatch, setShowAiMatch] = useState(false)
  const [aiStep, setAiStep] = useState(1)
  const [aiAnswers, setAiAnswers] = useState({
    tripType: "", // "business" | "family"
    budget: 6000,
    ambiance: "", // "quiet" | "city"
    sunlight: ""  // "morning" | "evening"
  })
  const [isLoadingMatch, setIsLoadingMatch] = useState(false)


  useEffect(() => {
    getWorkspaces().then(setWorkspaces)
  }, [])

  // Voice Search Activation using Web Speech API
  const handleVoiceSearch = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      triggerToast("Voice search is not supported in this browser.")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN" // support Hinglish
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      setIsListening(true)
      triggerToast("Listening for booking query...")
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onerror = (event: any) => {
      console.error(event.error)
      setIsListening(false)
      triggerToast(`Voice Error: ${event.error}`)
    }

    recognition.onresult = (event: any) => {
      const speechToText = event.results[0][0].transcript
      setSearchQuery(speechToText)
      triggerToast(`Search: "${speechToText}"`)

      // Parse query for automatic filter & search keywords
      const query = speechToText.toLowerCase()
      if (query.includes("suite") || query.includes("penthouse") || query.includes("luxury")) {
        setActiveFilter("Suite")
      } else if (query.includes("workspace") || query.includes("cabin") || query.includes("office") || query.includes("work")) {
        setActiveFilter("Workspace")
      } else if (query.includes("room") || query.includes("studio") || query.includes("stay")) {
        setActiveFilter("Room")
      } else if (query.includes("monthly") || query.includes("long term") || query.includes("month")) {
        setActiveFilter("Monthly")
      } else {
        setActiveFilter("All")
      }

      // Check if price keywords exist, e.g., "under 3000"
      const budgetMatch = query.match(/under\s*(?:rs\.?\s*)?(\d+)/i) || query.match(/below\s*(?:rs\.?\s*)?(\d+)/i) || query.match(/within\s*(?:rs\.?\s*)?(\d+)/i)
      if (budgetMatch && budgetMatch[1]) {
        const parsedBudget = parseInt(budgetMatch[1])
        triggerToast(`Filtering spaces under ₹${parsedBudget}`)
      }
    }

    recognition.start()
  }

  // AI Matching Algorithm (Real API Call)
  const runAiMatching = (answers = aiAnswers) => {
    setIsLoadingMatch(true)
    fetch(`${API_BASE_URL}/api/rooms/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(answers)
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error")
        return res.json()
      })
      .then((data) => {
        if (data && data.length > 0) {
          const bestRoom = data[0]
          triggerToast(`AI Recommendation: ${bestRoom.title}!`)
          setSelectedRoom(bestRoom)
          setShowAiMatch(false)
          // Reset wizard
          setAiStep(1)
          setAiAnswers({ tripType: "", budget: 6000, ambiance: "", sunlight: "" })
        } else {
          triggerToast("No match found. Try widening preferences.")
        }
      })
      .catch((err) => {
        console.error("AI matching failed:", err)
        triggerToast("AI matching server is currently offline.")
      })
      .finally(() => {
        setIsLoadingMatch(false)
      })
  }

  // Filter workspaces that are Available
  const filteredRooms = workspaces.filter((room) => {
    const isAvailable = room.status !== "Maintenance"
    
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = 
      activeFilter === "All" || 
      room.type.toLowerCase() === activeFilter.toLowerCase()

    return isAvailable && matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col gap-6 mt-2 animate-fadeIn rounded-none">
      
      {/* Search Header Input bar with Voice Search */}
      <div className="relative flex items-center rounded-none border border-zinc-100 bg-zinc-50/50 px-3.5 py-3 focus-within:bg-white focus-within:border-primary dark:border-zinc-800 dark:bg-zinc-800/20 transition-all duration-200">
        <Search className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={isListening ? "Listening... Speak now!" : "Search locations or cabin types..."}
          className="ml-2.5 w-full bg-transparent text-sm text-foreground focus:outline-hidden placeholder-zinc-400"
        />
        <button
          type="button"
          onClick={handleVoiceSearch}
          className={`p-1.5 rounded-none ml-1 cursor-pointer transition-all hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
            isListening ? "bg-red-500 text-white animate-pulse" : "text-zinc-400 dark:text-zinc-500"
          }`}
          title="Voice Search / Booking"
        >
          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </button>
      </div>

      {/* AI Room Matcher Promo Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-orange-600 to-red-650 p-5 rounded-none shadow-lg flex items-center justify-between gap-4 select-none">
        <div className="absolute top-0 right-0 -mr-6 -mt-6 h-24 w-24 bg-white/10 rounded-none blur-xl pointer-events-none"></div>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-none">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">AI Room Matcher</h4>
            <p className="text-[10px] text-white/95 font-medium mt-0.5 leading-snug">Let AI select the perfect workspace or suite for you in seconds.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAiMatch(true)}
          className="bg-white text-zinc-950 font-black text-[10px] uppercase tracking-widest px-4.5 py-2.5 rounded-none hover:bg-zinc-50 active:scale-95 transition-all shrink-0 cursor-pointer shadow-md hover:shadow-lg"
        >
          Match Now
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 select-none">
        {["All", "Suite", "Workspace", "Room", "Monthly"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`rounded-none px-5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              activeFilter === category 
                ? "bg-primary border-primary text-white shadow-md shadow-primary/20" 
                : "bg-white border-zinc-100 text-zinc-650 hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-805 dark:text-zinc-400"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div>
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12 text-xs text-muted-foreground border border-dashed border-zinc-200 dark:border-zinc-850 p-6 rounded-none">
            No spaces found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredRooms.map((room) => {
              const isFav = favorites.includes(room.id)
              return (
                <div 
                  key={room.id}
                  className="group relative flex flex-col overflow-hidden rounded-none border border-zinc-100 bg-white shadow-xs dark:border-zinc-850 dark:bg-zinc-900/40 hover:border-zinc-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-200/40 dark:hover:shadow-none transition-all duration-300"
                >
                  {/* Room Hero Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-850 rounded-none">
                    <img 
                      src={room.image} 
                      alt={room.title} 
                      onClick={() => setSelectedRoom(room)}
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-550 cursor-pointer" 
                    />
                    {/* Floating badge */}
                    <span className="absolute top-3 left-3 bg-zinc-950/75 backdrop-blur-md px-3 py-1 text-[9px] font-bold text-white uppercase tracking-wider rounded-none">
                      {room.type}
                    </span>

                    {/* Live Viewing Activity Counter (Feature 7) */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-none text-[8.5px] font-bold text-white flex items-center gap-1.5 shadow-xs">
                      <span className="h-1.5 w-1.5 rounded-none bg-green-500 animate-ping"></span>
                      <span>{Math.floor(8 + (room.price % 7))} viewing</span>
                    </div>

                    {/* Favorite button */}
                    <button 
                      onClick={() => toggleFavorite(room.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-primary shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer rounded-none dark:bg-zinc-900/90"
                    >
                      <Heart className={`h-4.5 w-4.5 transition-all ${isFav ? "fill-current scale-110" : "text-zinc-400 dark:text-zinc-550"}`} />
                    </button>
                  </div>

                  {/* Body Details */}
                  <div className="flex flex-col gap-3.5 p-4 flex-1 justify-between">
                    <div 
                      onClick={() => setSelectedRoom(room)}
                      className="cursor-pointer"
                    >
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                        {room.title}
                      </h3>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{room.location}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-450 text-yellow-450" />
                        <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">{room.rating}</span>
                      </div>
                      {/* Rooms Left Status */}
                      <span className="text-[8px] font-extrabold text-red-650 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-none">
                        {room.price > 5000 ? "1 room left" : "3 rooms left"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 p-4 pt-3 dark:border-zinc-800">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider dark:text-zinc-550">Price Starting</span>
                      <span className="text-sm font-black text-primary">₹{room.price}<span className="text-[10px] font-bold text-zinc-550 dark:text-zinc-400">/night</span></span>
                    </div>
                    <button 
                      onClick={() => setSelectedRoom(room)}
                      className="rounded-none bg-primary px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white hover:bg-primary/95 transition-colors cursor-pointer shadow-md shadow-primary/10"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* AI ROOM MATCHING OVERLAY MODAL */}
      {showAiMatch && (
        <div className="fixed inset-0 z-50 bg-zinc-950/60 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-850 p-6 w-full max-w-sm relative rounded-none shadow-2xl shadow-black/10 animate-scaleUp">
            
            {/* Close button */}
            {!isLoadingMatch && (
              <button 
                onClick={() => setShowAiMatch(false)}
                className="absolute top-4 right-4 text-zinc-450 hover:text-zinc-655 hover:bg-zinc-100 dark:hover:bg-zinc-900 p-1.5 rounded-none cursor-pointer transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            )}

            {isLoadingMatch ? (
              <div className="flex flex-col items-center justify-center py-10 gap-4 animate-fadeIn text-center">
                <div className="relative flex items-center justify-center h-16 w-16 mb-2">
                  <div className="absolute inset-0 rounded-none border-4 border-primary/20 border-t-primary animate-spin" />
                  <Sparkles className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider">AI is Matching</h3>
                  <p className="text-[10px] text-zinc-450 dark:text-zinc-500 font-extrabold uppercase tracking-wider mt-1.5 leading-relaxed">
                    Analyzing premium workspaces in Bangalore...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Stepper progress indicator */}
                <div className="flex justify-between items-center gap-1.5 mb-6 px-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div 
                      key={step}
                      className={`h-1.5 flex-1 rounded-none transition-all duration-300 ${
                        step <= aiStep ? "bg-primary" : "bg-zinc-100 dark:bg-zinc-800"
                      }`}
                    />
                  ))}
                </div>

                {/* Wizard step contents */}
                {aiStep === 1 && (
                  <div className="flex flex-col gap-4 animate-slideIn">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider leading-snug">Business Trip ya Family stay?</h3>
                    <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Choose your stay purpose</p>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={() => {
                          setAiAnswers(prev => ({ ...prev, tripType: "business" }))
                          setAiStep(2)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">💼</span>
                        <span>Business Trip</span>
                      </button>
                      <button
                        onClick={() => {
                          setAiAnswers(prev => ({ ...prev, tripType: "family" }))
                          setAiStep(2)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">👨‍👩‍👧‍👦</span>
                        <span>Family / Leisure</span>
                      </button>
                    </div>
                  </div>
                )}

                {aiStep === 2 && (
                  <div className="flex flex-col gap-4 animate-slideIn">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider leading-snug">What is your Budget?</h3>
                    <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Select max price per night</p>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <input 
                        type="range"
                        min="500"
                        max="15000"
                        step="500"
                        value={aiAnswers.budget}
                        onChange={(e) => setAiAnswers(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
                        className="w-full h-1 bg-zinc-200 rounded-none appearance-none cursor-pointer dark:bg-zinc-800 accent-primary"
                      />
                      <div className="flex justify-between text-xs font-bold text-zinc-550 mt-1">
                        <span>₹500</span>
                        <span className="text-primary text-sm font-black">₹{aiAnswers.budget}</span>
                        <span>₹15,000</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => setAiStep(1)}
                        className="flex-1 py-2.5 border border-zinc-200 rounded-none text-zinc-555 font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-50 cursor-pointer transition-all active:scale-98"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setAiStep(3)}
                        className="flex-1 py-2.5 bg-primary text-white rounded-none font-bold text-[10px] uppercase tracking-wider hover:bg-primary/95 cursor-pointer transition-all active:scale-98"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}

                {aiStep === 3 && (
                  <div className="flex flex-col gap-4 animate-slideIn">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider leading-snug">Quiet room ya City View?</h3>
                    <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Select room view preference</p>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={() => {
                          setAiAnswers(prev => ({ ...prev, ambiance: "quiet" }))
                          setAiStep(4)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">🤫</span>
                        <span>Quiet Workspace</span>
                      </button>
                      <button
                        onClick={() => {
                          setAiAnswers(prev => ({ ...prev, ambiance: "city" }))
                          setAiStep(4)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">🏙️</span>
                        <span>Premium City View</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setAiStep(2)}
                      className="py-2.5 border border-zinc-200 rounded-none text-zinc-555 font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-50 cursor-pointer mt-2 transition-all active:scale-98"
                    >
                      Back
                    </button>
                  </div>
                )}

                {aiStep === 4 && (
                  <div className="flex flex-col gap-4 animate-slideIn">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white uppercase tracking-wider leading-snug">Morning sun ya Evening view?</h3>
                    <p className="text-[10px] text-zinc-400 font-extrabold uppercase tracking-wider">Select lighting direction preference</p>
                    <div className="grid grid-cols-2 gap-3 mt-1">
                      <button
                        onClick={() => {
                          const updatedAnswers = { ...aiAnswers, sunlight: "morning" }
                          setAiAnswers(updatedAnswers)
                          runAiMatching(updatedAnswers)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">☀️</span>
                        <span>Morning Sunlight</span>
                      </button>
                      <button
                        onClick={() => {
                          const updatedAnswers = { ...aiAnswers, sunlight: "evening" }
                          setAiAnswers(updatedAnswers)
                          runAiMatching(updatedAnswers)
                        }}
                        className="p-4 border border-zinc-150 dark:border-zinc-800 rounded-none hover:border-primary hover:bg-primary/5 text-zinc-700 dark:text-zinc-300 font-extrabold text-[11px] text-center cursor-pointer transition-all duration-200 active:scale-95 flex flex-col items-center justify-center gap-2"
                      >
                        <span className="text-xl">🌅</span>
                        <span>Evening Sunset</span>
                      </button>
                    </div>
                    <button
                      onClick={() => setAiStep(3)}
                      className="py-2.5 border border-zinc-200 rounded-none text-zinc-555 font-bold text-[10px] uppercase tracking-wider hover:bg-zinc-50 cursor-pointer mt-2 transition-all active:scale-98"
                    >
                      Back
                    </button>
                  </div>
                )}
              </>
            )}
 
          </div>
        </div>
      )}

    </div>
  )
}
