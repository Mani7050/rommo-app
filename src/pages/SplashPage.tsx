import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { useApp } from "../context/AppContext"

export default function SplashPage() {
  const navigate = useNavigate()
  const { isAuthenticated, hasSeenOnboarding } = useApp()

  useEffect(() => {
    console.log("SplashPage mounted. isAuthenticated state:", isAuthenticated, "hasSeenOnboarding:", hasSeenOnboarding)
    const timer = setTimeout(() => {
      const destination = isAuthenticated 
        ? "/bookings" 
        : (hasSeenOnboarding ? "/signin" : "/onboarding")
      console.log("SplashPage timer finished. Navigating to:", destination)
      navigate(destination)
    }, 2800)
    return () => clearTimeout(timer)
  }, [navigate, isAuthenticated, hasSeenOnboarding])

  return (
    <div className="flex h-full w-full flex-col items-center justify-between bg-zinc-950 p-8 text-white select-none animate-fadeIn">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        {/* Pulsing Modern Logo */}
        <div className="relative flex h-20 w-20 items-center justify-center rounded-none bg-linear-to-br from-primary to-primary/60 shadow-xl shadow-primary/20 animate-pulse">
          <Sparkles className="h-10 w-10 text-white" />
          <div className="absolute -inset-1 rounded-none bg-primary/25 blur-sm -z-10 animate-ping duration-1000"></div>
        </div>
        
        {/* Brand details */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-widest bg-linear-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            ROMMO
          </h1>
          <p className="text-[10px] text-zinc-500 mt-1.5 tracking-widest uppercase font-bold">
            Premium Workspaces
          </p>
        </div>

        {/* Bouncing Dots Loader */}
        <div className="flex items-center gap-2 mt-8">
          <div className="h-2 w-2 rounded-none bg-primary animate-bounce [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 rounded-none bg-primary animate-bounce [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 rounded-none bg-primary animate-bounce"></div>
        </div>
      </div>

      <div className="text-[10px] text-zinc-600 tracking-wider uppercase font-bold">
        Version 2.0.1 • Loaded Securely
      </div>
    </div>
  )
}
