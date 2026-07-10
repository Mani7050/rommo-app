import { useState } from "react"
import { X, Key, Eye, EyeOff, Fingerprint, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { useApp } from "../context/AppContext"
import { Button } from "@/components/ui/button"
import { API_BASE_URL } from "../config"

interface SecurityPinDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function SecurityPinDrawer({ isOpen, onClose }: SecurityPinDrawerProps) {
  const { user, setUser, triggerToast, setNotifications } = useApp()
  
  const [newPin, setNewPin] = useState("")
  const [confirmPin, setConfirmPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [biometrics, setBiometrics] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPin.length !== 4 || isNaN(Number(newPin))) {
      triggerToast("PIN must be a 4-digit number!")
      return
    }

    if (newPin !== confirmPin) {
      triggerToast("PIN confirmation does not match!")
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/update-pin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: user.email, pin: newPin })
      })
      const data = await res.json()
      if (res.ok) {
        setUser(prev => ({
          ...prev,
          pin: data.pin
        }))
        // Update localStorage
        const updatedUser = { ...user, pin: data.pin }
        localStorage.setItem("rommo_user", JSON.stringify(updatedUser))
        triggerToast("Security PIN updated successfully!")
        setNotifications(prev => [
          {
            id: Date.now(),
            text: "Your security PIN was updated successfully.",
            time: "Just now",
            read: false
          },
          ...prev
        ])
        setNewPin("")
        setConfirmPin("")
        onClose()
      } else {
        triggerToast(data.error || "Failed to update PIN")
      }
    } catch (err) {
      console.error(err)
      triggerToast("Failed to connect to server")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center rounded-none overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs" 
        onClick={onClose}
      />

      {/* Drawer Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="relative z-10 w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[85%] overflow-y-auto shadow-2xl dark:bg-zinc-900"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4 mb-5 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Security Controls</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">Security & PIN</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Configure access codes and biometric validation.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 text-xs">
          
          {/* Active PIN display */}
          <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-850/50 rounded-none">
            <div>
              <span className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[8px] block">Current Security Code</span>
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 mt-0.5 block">Used for door unlock & kiosk login.</span>
            </div>
            <span className="font-mono font-black text-base text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-900 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 tracking-widest rounded-none">
              {showPin ? user.pin : "****"}
            </span>
            <button 
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="p-2 text-zinc-450 hover:text-primary transition-colors cursor-pointer rounded-none"
            >
              {showPin ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* New PIN Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Enter New 4-Digit PIN</label>
              <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
                <Key className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
                <input 
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden tracking-widest"
                  placeholder="xxxx"
                  required
                />
              </div>
            </div>

            {/* Confirm PIN Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Confirm New PIN</label>
              <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
                <Key className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
                <input 
                  type={showPin ? "text" : "password"}
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))}
                  className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden tracking-widest"
                  placeholder="xxxx"
                  required
                />
              </div>
            </div>

            {/* Simulated Biometric Toggle */}
            <div className="flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-zinc-800 mt-2">
              <div className="flex items-center gap-2.5 text-sm text-foreground font-semibold">
                <Fingerprint className="h-4.5 w-4.5 text-primary" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-zinc-900 dark:text-white">Enable FaceID / TouchID</span>
                  <span className="text-[9px] font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">Quick auth for door unlock</span>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setBiometrics(!biometrics)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-none border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${biometrics ? "bg-primary" : "bg-zinc-200 dark:bg-zinc-700"}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-none bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${biometrics ? "translate-x-5" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Save Button */}
            <Button
              type="submit"
              disabled={isSaving || newPin.length !== 4 || confirmPin.length !== 4}
              className="rounded-none py-6 mt-4 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10 border border-primary/10 w-full"
            >
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                  UPDATING PIN...
                </>
              ) : (
                "UPDATE SECURITY PIN"
              )}
            </Button>

          </form>

        </div>

      </motion.div>
    </div>
  )
}
