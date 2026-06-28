import { Home as HomeIcon, Calendar, Heart, UserCircle } from "lucide-react"

interface BottomNavProps {
  currentNav: "home" | "bookings" | "favorites" | "profile"
  setCurrentNav: (nav: "home" | "bookings" | "favorites" | "profile") => void
  setShowNotifications: (show: boolean) => void
}

export function BottomNav({ currentNav, setCurrentNav, setShowNotifications }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "profile", label: "Profile", icon: UserCircle }
  ] as const

  return (
    <div className="w-full border-t border-zinc-100 bg-white/95 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95 rounded-none z-20 shrink-0">
      <div className="max-w-3xl mx-auto w-full flex px-4 py-1.5 pb-2 justify-between">
        {tabs.map((item) => {
          const Icon = item.icon
          const isActive = currentNav === item.id
          return (
            <button
              key={item.id}
              onClick={() => {
                setCurrentNav(item.id)
                setShowNotifications(false)
              }}
              className="flex flex-col items-center gap-1 py-0.5 px-3.5 transition-colors relative cursor-pointer group rounded-none"
            >
              {isActive && (
                <span className="absolute -top-[8px] left-1/2 -translate-x-1/2 h-[3px] w-[20px] rounded-none bg-primary animate-pulse"></span>
              )}
              <Icon className={`h-5.5 w-5.5 transition-all duration-200 ${
                isActive 
                  ? "text-primary scale-110" 
                  : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
              }`} />
              <span className={`text-[10px] font-medium tracking-wide transition-all ${
                isActive 
                  ? "text-primary" 
                  : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
              }`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
