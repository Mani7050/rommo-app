import { Award, Moon, Sun, Settings, ShieldCheck, LogOut, ChevronRight, Wrench, HelpCircle, Coins, Calendar, MessageSquare } from "lucide-react"
import { useNavigate, useOutletContext } from "react-router-dom"
import { useTheme } from "@/components/theme-provider"
import { useApp } from "../context/AppContext"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const { bookings, triggerToast, logout, user } = useApp()
  const { setShowMaintenance, setShowAccountSettings, setShowSecurityPin, setShowHelpSupport, setShowFAQ } = useOutletContext<any>()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6 mt-2 animate-fadeIn rounded-none">
      
      {/* Clean Premium Profile Header */}
      <div className="flex items-center gap-4 bg-zinc-50/30 border border-zinc-100 p-4.5 dark:bg-zinc-900/30 dark:border-zinc-850 rounded-none relative">
        {/* Rounded Profile Avatar */}
        <div className="h-15 w-15 rounded-none bg-primary text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0 border border-primary/15">
          {user.name.split(" ").map(n => n[0]).join("")}
        </div>
        
        <div className="flex flex-col min-w-0">
          <h3 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-base leading-tight tracking-tight">{user.name}</h3>
          <p className="text-xs text-zinc-400 dark:text-zinc-550 mt-0.5 truncate">{user.email}</p>
          
          <div className="flex items-center gap-1.5 mt-2 bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary w-fit rounded-none">
            <Award className="h-3.5 w-3.5" />
            Gold Tier
          </div>
        </div>
      </div>

      {/* Clean Dashboard Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Loyalty Points Card */}
        <div className="bg-zinc-50/30 border border-zinc-100 p-4 flex items-center gap-3.5 dark:bg-zinc-900/30 dark:border-zinc-850 rounded-none">
          <div className="p-2 bg-primary/10 text-primary rounded-none shrink-0">
            <Coins className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-widest leading-none">Loyalty Points</span>
            <span className="text-lg font-black text-primary mt-1.5 leading-none">1,250</span>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="bg-zinc-50/30 border border-zinc-150 p-4 flex items-center gap-3.5 dark:bg-zinc-900/30 dark:border-zinc-850 rounded-none">
          <div className="p-2 bg-primary/10 text-primary rounded-none shrink-0">
            <Calendar className="h-4.5 w-4.5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-zinc-450 font-bold uppercase tracking-widest leading-none">Total Bookings</span>
            <span className="text-lg font-black text-primary mt-1.5 leading-none">
              {bookings.filter(b => b.status === "COMPLETED" || b.status === "CONFIRMED").length}
            </span>
          </div>
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

        <button 
          type="button"
          onClick={() => setShowHelpSupport(true)}
          className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 text-sm font-semibold text-foreground dark:bg-zinc-800/30 dark:border-zinc-850 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="h-4.5 w-4.5 text-zinc-400" />
            <span>Help & Support</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </button>

        <button 
          type="button"
          onClick={() => setShowFAQ(true)}
          className="flex items-center justify-between bg-zinc-50/50 border border-zinc-100 rounded-none px-4 py-3.5 text-sm font-semibold text-foreground dark:bg-zinc-800/30 dark:border-zinc-850 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="h-4.5 w-4.5 text-zinc-400" />
            <span>FAQs</span>
          </div>
          <ChevronRight className="h-4 w-4 text-zinc-400" />
        </button>

        {/* Integrated Log Out button */}
        <button 
          type="button"
          onClick={() => {
            logout()
            triggerToast("Successfully logged out.")
            navigate("/")
          }}
          className="flex items-center justify-between bg-red-50/20 border border-red-100/50 dark:bg-red-950/5 dark:border-red-900/30 rounded-none px-4 py-3.5 text-sm font-semibold text-red-650 hover:bg-red-50/50 dark:text-red-400 dark:hover:bg-red-950/10 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-4.5 w-4.5 text-red-500" />
            <span>Log Out</span>
          </div>
          <ChevronRight className="h-4 w-4 text-red-400" />
        </button>
      </div>
    </div>
  )
}
