import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, ArrowRight, ChevronRight } from "lucide-react"
import { useApp } from "../context/AppContext"

const onboardingData = [
  {
    title: "Find Your Perfect Workspace",
    description: "Browse high-end cozy rooms, executive work cabins, and conference spaces in prime locations across Bangalore.",
    image: "/comfort_room.png",
    tag: "DISCOVER"
  },
  {
    title: "Easy & Secure Booking",
    description: "Instantly reserve workspaces, complete secure payments, and manage check-ins directly from your phone.",
    image: "/meeting_room.png",
    tag: "BOOKINGS"
  },
  {
    title: "Unlock Exclusive Perks",
    description: "Earn loyalty points on every booking, access high-speed Wi-Fi details, and unlock gold-tier privileges.",
    image: "/urban_studio.png",
    tag: "MEMBERSHIP"
  }
]

export default function OnboardingPage() {
  console.log("OnboardingPage rendering...")
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const { completeOnboarding } = useApp()
  const step = onboardingData[currentStep]

  const handleNext = () => {
    if (currentStep < onboardingData.length - 1) {
      setCurrentStep(prev => prev + 1)
    } else {
      completeOnboarding()
      navigate("/signin")
    }
  }

  const handleSkip = () => {
    completeOnboarding()
    navigate("/signin")
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 select-none overflow-hidden transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <div className="relative z-10 border-b border-zinc-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/50 w-full">
        <div className="max-w-md mx-auto w-full flex justify-between items-center p-5 pt-4">
          <div className="flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
          <span className="font-extrabold tracking-widest text-xs text-zinc-900 dark:text-white">ROMMO</span>
        </div>
        <button 
          onClick={handleSkip}
          className="text-[10px] font-bold text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer bg-zinc-100 dark:bg-zinc-800 px-3.5 py-1.5 border border-zinc-200 dark:border-zinc-700 tracking-widest uppercase rounded-none"
        >
          Skip
        </button>
      </div>
    </div>

      {/* Main visual and text content */}
      <div className="flex-1 flex flex-col justify-between p-6 w-full">
        <div className="max-w-md mx-auto w-full flex-1 flex flex-col justify-between">
        
        {/* Onboarding Image Box */}
        <div className="flex-1 flex items-center justify-center py-4">
          <div className="relative h-64 w-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-850 rounded-none shadow-xs">
            <img 
              key={currentStep} // Triggers re-animation on step change
              src={step.image} 
              alt={step.title}
              className="h-full w-full object-cover transition-all duration-500 ease-in-out scale-100 animate-fadeIn"
            />
            {/* Soft inner vignette gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/45 via-transparent to-transparent"></div>
            {/* Floating Tag */}
            <span className="absolute bottom-3 left-3 bg-zinc-900/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-bold text-white uppercase tracking-wider rounded-none">
              {step.tag}
            </span>
          </div>
        </div>

        {/* Text Details Area */}
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">
              Step 0{currentStep + 1}
            </span>
            <span className="text-xs font-bold font-mono text-zinc-450 dark:text-zinc-550">
              0{currentStep + 1} / 03
            </span>
          </div>
          <div className="flex flex-col gap-2.5">
            <h2 className="text-xl font-bold uppercase tracking-tight text-zinc-900 dark:text-white leading-snug">
              {step.title}
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>
      </div>
    </div>

      {/* Bottom Control Bar */}
      <div className="bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-900 rounded-none w-full">
        <div className="max-w-md mx-auto w-full p-6 flex items-center justify-between">
        
        {/* Flat Progress Dashes */}
        <div className="flex gap-1.5">
          {onboardingData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-1.5 transition-all duration-300 cursor-pointer rounded-none ${
                currentStep === idx ? "w-6 bg-primary" : "w-2.5 bg-zinc-200 dark:bg-zinc-800"
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          className="px-5 py-2.5 font-extrabold text-xs uppercase tracking-widest text-white bg-primary hover:bg-primary/95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-primary/10 border border-primary/20 rounded-none"
        >
          {currentStep === onboardingData.length - 1 ? (
            <>
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
        </div>
      </div>

    </div>
  )
}
