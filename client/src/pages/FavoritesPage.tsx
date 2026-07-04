import { Heart, MapPin } from "lucide-react"
import { useApp } from "../context/AppContext"

const discoverRooms = [
  { id: "d1", title: "Luxury Penthouse Suite", location: "Lavelle Road, Bangalore", price: 5499, image: "/comfort_room.png", rating: 4.9, type: "Suite", reviews: 48 },
  { id: "d2", title: "Creative Focus Cabin", location: "HSR Layout, Bangalore", price: 650, image: "/meeting_room.png", rating: 4.7, type: "Workspace", reviews: 112 },
  { id: "d3", title: "Greenery Studio Apartment", location: "Koramangala, Bangalore", price: 1899, image: "/urban_studio.png", rating: 4.8, type: "Room", reviews: 89 },
  { id: "d4", title: "Executive Boardroom", location: "Indiranagar, Bangalore", price: 1500, image: "/meeting_room.png", rating: 4.6, type: "Workspace", reviews: 34 }
]

export default function FavoritesPage() {
  const { favorites, toggleFavorite, handleBookRoom } = useApp()

  const favoriteRooms = discoverRooms.filter((room) => favorites.includes(room.id))

  return (
    <div className="flex flex-col gap-5 mt-2 animate-fadeIn rounded-none">
      {favoriteRooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-200 dark:border-zinc-800 p-6 rounded-none">
          <Heart className="h-10 w-10 text-zinc-300 dark:text-zinc-750 mb-2.5" />
          <h4 className="font-bold text-zinc-800 dark:text-zinc-300 text-sm">No favorites saved yet</h4>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">Mark custom suites as favorites on the home search page.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {favoriteRooms.map((room) => (
            <div 
              key={room.id}
              className="flex overflow-hidden rounded-none border border-zinc-100 bg-white p-2.5 shadow-xs dark:border-zinc-800 dark:bg-zinc-900 hover:border-zinc-200 transition-colors"
            >
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-none bg-zinc-100">
                <img src={room.image} alt={room.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-col justify-between flex-1 min-w-0 pl-3">
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs truncate leading-tight pr-1">
                    {room.title}
                  </h4>
                  <button 
                    onClick={() => toggleFavorite(room.id)}
                    className="text-primary p-0.5 cursor-pointer hover:scale-115 active:scale-90 transition-transform"
                  >
                    <Heart className="h-4 w-4 fill-current" />
                  </button>
                </div>
                <div className="flex items-center gap-0.5 text-[10px] text-muted-foreground leading-none">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{room.location}</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs font-extrabold text-primary">₹{room.price}/night</span>
                  <button 
                    onClick={() => handleBookRoom(room)}
                    className="text-[10px] font-bold text-white bg-primary px-3 py-1 rounded-none hover:bg-primary/95 transition-colors cursor-pointer"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
