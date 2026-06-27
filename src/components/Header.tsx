import type { Notification } from "../types"
import { Bell } from "lucide-react"

interface HeaderProps {
  currentNav: "home" | "bookings" | "favorites" | "profile"
  unreadCount: number
  showNotifications: boolean
  setShowNotifications: (show: boolean) => void
  notifications: Notification[]
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>
  triggerToast: (msg: string) => void
}

export function Header({
  currentNav,
  unreadCount,
  showNotifications,
  setShowNotifications,
  notifications,
  setNotifications,
  triggerToast
}: HeaderProps) {
  if (currentNav === "profile") return null

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800/80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-20 shrink-0 rounded-none w-full">
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between px-4 py-3">
        <div>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Welcome back</span>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {currentNav === "home" && "Discover Space"}
            {currentNav === "bookings" && "My Bookings"}
            {currentNav === "favorites" && "Saved Spaces"}
          </h1>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-none p-2.5 bg-zinc-50 border border-zinc-100 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 transition-all duration-200 cursor-pointer"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-none bg-primary text-[10px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Center Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 z-30 w-72 rounded-none border border-zinc-100 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-805 animate-in fade-in-50 slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2 dark:border-zinc-700">
                <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                  Notifications
                  <span className="inline-block px-1.5 py-0.5 rounded-none bg-primary/10 text-primary text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(item => ({ ...item, read: true })))
                      triggerToast("All notifications marked as read.")
                    }}
                    className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="flex flex-col gap-1.5 max-h-64 overflow-y-auto scrollbar-none">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => {
                        setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, read: true } : item))
                      }}
                      className={`flex flex-col gap-0.5 rounded-none p-2.5 text-xs transition-colors cursor-pointer ${n.read ? "bg-transparent text-muted-foreground" : "bg-primary/5 text-foreground font-medium"}`}
                    >
                      <p className="leading-snug">{n.text}</p>
                      <span className="text-[10px] text-zinc-400 mt-1 dark:text-zinc-500">{n.time}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
