import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { API_BASE_URL } from "../config"
import { Lock, Eye, EyeOff, Loader2, User, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "../context/AppContext"

export default function SignUpPage() {
  console.log("SignUpPage rendering...")
  const navigate = useNavigate()
  const { login, triggerToast } = useApp()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirmPassword?: string }>({})

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!name.trim()) newErrors.name = "Full Name is required"
    
    if (!email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!password) {
      newErrors.password = "Password is required"
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    if (!agreeTerms) {
      triggerToast("Please agree to the Terms & Conditions")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      })
      const data = await res.json()
      if (res.ok) {
        login({ name, email })
        triggerToast("Account created successfully!")
        navigate("/home")
      } else {
        triggerToast(data.error || "Registration failed")
      }
    } catch (err) {
      console.error(err)
      triggerToast("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-muted/45 select-none animate-fadeIn transition-colors duration-300">
      
      <div className="relative bg-primary px-6 pt-10 pb-28 flex flex-col justify-between w-full">
        <div className="max-w-md mx-auto w-full flex items-center justify-end">
          {/* Header Link */}
          <span className="text-xs font-bold text-primary-foreground/80 tracking-wide">
            CREATE ACCOUNT
          </span>
        </div>
      </div>

      {/* Overlapping White Form Container */}
      <div className="flex-1 flex flex-col bg-card text-card-foreground rounded-t-[32px] -mt-8 pt-8 px-6 pb-6 z-10 shadow-lg w-full">
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between">
          
          {/* Input details & Form Fields */}
          <div className="flex flex-col gap-4">
            {/* Title Block */}
            <div className="mb-2">
              <h2 className="text-2xl font-semibold text-foreground tracking-tight">
                Let's get registered
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                Join Rommo to unlock premium workspaces.
              </p>
            </div>

            {/* Name Input */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }))
                  }}
                  placeholder="Full Name"
                  className={`w-full rounded-none border bg-muted/40 py-3 pl-12 pr-4 text-sm text-foreground placeholder-muted-foreground/60 focus:bg-background focus:outline-hidden transition-all duration-200 ${
                    errors.name 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border focus:border-primary"
                  }`}
                />
              </div>
              {errors.name && (
                <span className="text-[10px] font-bold text-destructive px-1">{errors.name}</span>
              )}
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                  }}
                  placeholder="Email Address"
                  className={`w-full rounded-none border bg-muted/40 py-3 pl-12 pr-10 text-sm text-foreground placeholder-muted-foreground/60 focus:bg-background focus:outline-hidden transition-all duration-200 ${
                    errors.email 
                      ? "border-destructive focus:border-destructive" 
                      : (/\S+@\S+\.\S+/.test(email) 
                          ? "border-emerald-500 focus:border-emerald-500" 
                          : "border-border focus:border-primary")
                  }`}
                />
                {/\S+@\S+\.\S+/.test(email) && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-500 text-white animate-fadeIn">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                  </span>
                )}
              </div>
              {errors.email && (
                <span className="text-[10px] font-bold text-destructive px-1">{errors.email}</span>
              )}
            </div>

            {/* Password Input */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                  }}
                  placeholder="Password"
                  className={`w-full rounded-none border bg-muted/40 py-3 pl-12 pr-12 text-sm text-foreground placeholder-muted-foreground/60 focus:bg-background focus:outline-hidden transition-all duration-200 ${
                    errors.password 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <span className="text-[10px] font-bold text-destructive px-1">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="flex flex-col gap-1">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: undefined }))
                  }}
                  placeholder="Confirm Password"
                  className={`w-full rounded-none border bg-muted/40 py-3 pl-12 pr-12 text-sm text-foreground placeholder-muted-foreground/60 focus:bg-background focus:outline-hidden transition-all duration-200 ${
                    errors.confirmPassword 
                      ? "border-destructive focus:border-destructive" 
                      : "border-border focus:border-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="text-[10px] font-bold text-destructive px-1">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms & Conditions Toggle */}
            <div className="flex items-center justify-between py-1 mt-1">
              <span className="text-xs font-bold text-muted-foreground">
                I agree to the Terms & Conditions
              </span>
              <button
                type="button"
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`relative inline-flex h-6.5 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  agreeTerms ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5.5 w-5.5 transform rounded-full bg-background shadow-md ring-0 transition duration-200 ease-in-out ${
                    agreeTerms ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex flex-col gap-4">
            <Button 
              type="submit"
              disabled={loading}
              className="rounded-none py-6 font-extrabold uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 flex items-center justify-center gap-2 text-xs w-full cursor-pointer shadow-md shadow-primary/25 border border-primary/10"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-primary-foreground" />
                  CREATING ACCOUNT...
                </>
              ) : (
                "SIGN UP"
              )}
            </Button>
            
            <div className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => navigate("/signin")} 
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                Sign In
              </button>
            </div>
          </div>

        </form>

      </div>

    </div>
  )
}
