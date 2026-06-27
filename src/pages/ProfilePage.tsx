import { Award, Moon, Sun, Settings, ShieldCheck, LogOut, ChevronRight, Wrench } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "../context/AppContext"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const { bookings, triggerToast, logout, user } = useApp()
  const { setShowMaintenance, setShowAccountSettings, setShowSecurityPin } = useOutletContext<any>()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 mt-2 animate-fadeIn rounded-none">
      
      {/* Profile Card */}
      <div className="flex items-center gap-4 bg-linear-to-r from-primary/10 to-primary/5 rounded-none p-5 border border-primary/5 dark:from-primary/15 dark:to-primary/5">
        <div className="relative h-16 w-16 overflow-hidden rounded-none bg-primary text-white flex items-center justify-center font-bold text-2xl shadow-md border border-white/50">
          {user.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base leading-tight">{user.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
          <div className="flex items-center gap-1.5 mt-2 bg-primary/20 dark:bg-primary/30 w-fit px-2 py-0.5 rounded-none">
            <Award className="h-3 w-3 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Gold Tier</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-zinc-50 border border-zinc-100 rounded-none p-3.5 text-center dark:bg-zinc-800/40 dark:border-zinc-800">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Loyalty Points</span>
          <span className="block text-xl font-extrabold text-primary mt-1">1,250</span>
        </div>
        <div className="bg-zinc-50 border border-zinc-100 rounded-none p-3.5 text-center dark:bg-zinc-800/40 dark:border-zinc-800">
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Bookings</span>
          <span className="block text-xl font-extrabold text-primary mt-1">
            {bookings.filter(b => b.status === "COMPLETED" || b.status === "CONFIRMED").length}
          </span>
        </div>
      </div>

      {/* Settings Group */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 mb-1">Preferences</span>
        
        {/* Theme Selector */}
        <div className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 dark:bg-zinc-800/30 dark:border-zinc-850">
          <div className="flex items-center gap-3 text-sm text-foreground font-semibold">
            {theme === "dark" ? <Moon className="h-4.5 w-4.5 text-primary" /> : <Sun className="h-4.5 w-4.5 text-primary" />}
            <span>Dark Theme</span>
          </div>
          <button 
            type="button"
            onClick={() => {
              const nextTheme = theme === "dark" ? "light" : "dark"
              setTheme(nextTheme)
              triggerToast(`Switched to ${nextTheme} theme`)
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2 ${theme === "dark" ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${theme === "dark" ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>

        <button 
          type="button"
          onClick={() => setShowAccountSettings(true)}
          className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 text-sm font-semibold text-foreground dark:bg-zinc-800/30 dark:border-zinc-850 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Settings className="h-4.5 w-4.5 text-zinc-400" />
            <span>Account Settings</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </button>

        <button 
          type="button"
          onClick={() => setShowSecurityPin(true)}
          className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 text-sm font-semibold text-foreground dark:bg-zinc-800/30 dark:border-zinc-850 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-4.5 w-4.5 text-zinc-400" />
            <span>Security & PIN</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </button>

        <button 
          type="button"
          onClick={() => setShowMaintenance(true)}
          className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 text-sm font-semibold text-foreground dark:bg-zinc-800/30 dark:border-zinc-850 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Wrench className="h-4.5 w-4.5 text-zinc-400" />
            <span>Cleaning & Maintenance</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </button>
      </div>

      {/* Logout Button */}
      <Button 
        type="button"
        onClick={() => {
          logout()
          triggerToast("Successfully logged out.")
          navigate("/signin")
        }}
        variant="outline" 
        className="mt-4 rounded-none border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-950/50 dark:hover:bg-red-950/20 font-semibold cursor-pointer w-full py-6 flex items-center justify-center gap-2 text-sm"
      >
        <LogOut className="h-4.5 w-4.5" />
        Log Out
      </Button>
    </div>
  )
}
