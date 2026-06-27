import { useState, useEffect } from "react"
import { X, User, Mail, Phone, Check } from "lucide-react"
import { useApp } from "../context/AppContext"
import { Button } from "@/components/ui/button"

interface AccountSettingsDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function AccountSettingsDrawer({ isOpen, onClose }: AccountSettingsDrawerProps) {
  if (!isOpen) return null

  const { user, setUser, triggerToast } = useApp()
  
  // Form states initialized with context values
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  const [phone, setPhone] = useState(user.phone)
  const [isSaving, setIsSaving] = useState(false)

  // Reset form values if user context changes
  useEffect(() => {
    setName(user.name)
    setEmail(user.email)
    setPhone(user.phone)
  }, [user])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !phone.trim()) {
      triggerToast("All fields are required!")
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      setUser(prev => ({
        ...prev,
        name,
        email,
        phone
      }))
      triggerToast("Account details updated successfully!")
      setIsSaving(false)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-end animate-fadeIn rounded-none">
      {/* Outer Click Closer */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Drawer Sheet */}
      <div className="relative z-10 w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[85%] overflow-y-auto shadow-2xl dark:bg-zinc-900 animate-slideUp">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4 mb-5 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Personal Info</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">Account Settings</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Manage your display profile and contact information.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          
          {/* Name Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Full Name</label>
            <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
              <User className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden"
                placeholder="Enter full name"
                required
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Email Address</label>
            <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
              <Mail className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Phone Field */}
          <div className="flex flex-col gap-1.5">
            <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Phone Number</label>
            <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2.5 bg-zinc-50/50 dark:bg-zinc-900/30">
              <Phone className="h-4 w-4 text-zinc-400 mr-2.5 shrink-0" />
              <input 
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-transparent text-zinc-900 dark:text-white font-extrabold focus:outline-hidden"
                placeholder="Enter phone number"
                required
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            disabled={isSaving}
            className="rounded-none py-6 mt-4 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10 border border-primary/10 w-full"
          >
            {isSaving ? (
              <>
                <Check className="h-4 w-4 mr-1.5" />
                SAVING CHANGES...
              </>
            ) : (
              "SAVE CHANGES"
            )}
          </Button>

        </form>

      </div>
    </div>
  )
}
