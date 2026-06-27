import { Search, MapPin, Star, Heart } from "lucide-react"
import { useApp } from "../context/AppContext"
import { useState } from "react"

const discoverRooms = [
  { id: "d1", title: "Luxury Penthouse Suite", location: "Lavelle Road, Bangalore", price: 5499, image: "/comfort_room.png", rating: 4.9, type: "Suite", reviews: 48 },
  { id: "d2", title: "Creative Focus Cabin", location: "HSR Layout, Bangalore", price: 650, image: "/meeting_room.png", rating: 4.7, type: "Workspace", reviews: 112 },
  { id: "d3", title: "Greenery Studio Apartment", location: "Koramangala, Bangalore", price: 1899, image: "/urban_studio.png", rating: 4.8, type: "Room", reviews: 89 },
  { id: "d4", title: "Executive Boardroom", location: "Indiranagar, Bangalore", price: 1500, image: "/meeting_room.png", rating: 4.6, type: "Workspace", reviews: 34 },
  { id: "d5", title: "Bachelor Monthly Room", location: "Koramangala, Bangalore", price: 14500, image: "/urban_studio.png", rating: 4.5, type: "Monthly", reviews: 67 }
]

export default function DiscoverPage() {
  const { favorites, toggleFavorite, handleBookRoom } = useApp()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredRooms = discoverRooms.filter((room) => {
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      room.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = 
      activeFilter === "All" || 
      room.type.toLowerCase() === activeFilter.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col gap-6 mt-2 animate-fadeIn rounded-none">
      
      {/* Search Header Input bar */}
      <div className="relative flex items-center rounded-none border border-zinc-100 bg-zinc-50/50 px-3.5 py-3 focus-within:bg-white focus-within:border-primary dark:border-zinc-800 dark:bg-zinc-800/20 transition-all duration-200">
        <Search className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-505" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search locations or cabin types..."
          className="ml-2.5 w-full bg-transparent text-sm text-foreground focus:outline-hidden placeholder-zinc-400"
        />
      </div>

      {/* Category Pills */}
      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1 -mx-4 px-4 select-none">
        {["All", "Suite", "Workspace", "Room", "Monthly"].map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`rounded-none px-4.5 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer border ${
              activeFilter === category 
                ? "bg-primary border-primary text-white" 
                : "bg-white border-zinc-100 text-zinc-600 hover:border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400"
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
                  className="group relative flex flex-col overflow-hidden rounded-none border border-zinc-100 bg-white shadow-xs dark:border-zinc-850 dark:bg-zinc-900/40 hover:border-zinc-200 transition-all duration-300"
                >
                  {/* Room Hero Image */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                    <img 
                      src={room.image} 
                      alt={room.title} 
                      className="h-full w-full object-cover group-hover:scale-103 transition-transform duration-500" 
                    />
                    {/* Floating badge */}
                    <span className="absolute top-3 left-3 bg-zinc-950/70 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider rounded-none">
                      {room.type}
                    </span>

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
                    <div className="flex justify-between items-start gap-1">
                      <div>
                        <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white leading-snug group-hover:text-primary transition-colors line-clamp-1">
                          {room.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="truncate">{room.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0">
                        <Star className="h-3 w-3 fill-yellow-450 text-yellow-450" />
                        <span className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">{room.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-zinc-100 pt-3 dark:border-zinc-800 mt-2">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-extrabold text-zinc-400 uppercase tracking-wider dark:text-zinc-550">Price Starting</span>
                        <span className="text-sm font-black text-primary">₹{room.price}<span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">/night</span></span>
                      </div>
                      <button 
                        onClick={() => handleBookRoom(room)}
                        className="rounded-none bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/95 transition-colors cursor-pointer"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>

                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
