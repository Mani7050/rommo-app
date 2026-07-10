import type { Notification } from "../types"
import { Bell, Trash2, CheckCheck } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface HeaderProps {
  currentNav: "home" | "bookings" | "favorites" | "offers" | "profile"
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
      <div className="max-w-3xl mx-auto w-full flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-zinc-50 border border-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 p-1.5 flex items-center justify-center shrink-0">
            <img src="/rommologo.png" alt="Rommo Logo" className="h-full w-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Welcome back</span>
            <h1 className="text-lg font-extrabold tracking-tight text-foreground mt-0.5 leading-snug">
              {currentNav === "home" && "Discover Space"}
              {currentNav === "bookings" && "My Bookings"}
              {currentNav === "favorites" && "Saved Spaces"}
              {currentNav === "offers" && "Offers & Perks"}
            </h1>
          </div>
        </div>
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-none p-1.5 bg-zinc-50 border border-zinc-100 text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 transition-all duration-200 cursor-pointer"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-none bg-primary text-[9px] font-bold text-white ring-2 ring-white dark:ring-zinc-900 animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Center Panel */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="absolute right-0 mt-2 z-30 w-72 rounded-none border border-zinc-100 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900 origin-top-right"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2 dark:border-zinc-700">
                  <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    Notifications
                    <span className="inline-block px-1.5 py-0.5 rounded-none bg-primary/10 text-primary text-[10px] font-bold">
                      {unreadCount} new
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <button 
                        onClick={() => {
                          setNotifications(prev => prev.map(item => ({ ...item, read: true })))
                          triggerToast("All notifications marked as read.")
                        }}
                        className="text-[10px] font-bold text-primary hover:underline cursor-pointer flex items-center gap-0.5"
                        title="Mark all read"
                      >
                        <CheckCheck className="h-3 w-3" />
                        Mark read
                      </button>
                    )}
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => {
                          setNotifications([])
                          triggerToast("All notifications cleared.")
                        }}
                        className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer flex items-center gap-0.5"
                        title="Clear all"
                      >
                        <Trash2 className="h-3 w-3" />
                        Clear
                      </button>
                    )}
                  </div>
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
                        className={`flex flex-col gap-0.5 rounded-none p-2.5 text-xs transition-colors cursor-pointer border-b border-zinc-50 dark:border-zinc-800 last:border-0 ${n.read ? "bg-transparent text-muted-foreground hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30" : "bg-primary/5 text-foreground font-medium hover:bg-primary/10"}`}
                      >
                        <p className="leading-snug">{n.text}</p>
                        <span className="text-[10px] text-zinc-400 mt-1 dark:text-zinc-500">{n.time}</span>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
