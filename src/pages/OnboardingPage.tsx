import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useApp } from "../context/AppContext"

const onboardingData = [
  {
    title: "Find Your Perfect Workspace",
    description: "Browse high-end cozy rooms, executive work cabins, and conference spaces in prime locations across Bangalore.",
    image: "/comfort_room.png"
  },
  {
    title: "Easy & Secure Booking",
    description: "Instantly reserve workspaces, complete secure payments, and manage check-ins directly from your phone.",
    image: "/meeting_room.png"
  },
  {
    title: "Unlock Exclusive Perks",
    description: "Earn loyalty points on every booking, access high-speed Wi-Fi details, and unlock gold-tier privileges.",
    image: "/urban_studio.png"
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

  return (
    <div className="relative flex h-full w-full flex-col justify-between select-none overflow-hidden transition-colors duration-300">
      
      {/* Full screen Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          key={currentStep} // Triggers fade-in on transition
          src={step.image} 
          alt={step.title}
          className="h-full w-full object-cover transition-all duration-700 ease-in-out scale-102 animate-fadeIn"
        />
        {/* Soft dark vignette to ensure top indicators are visible */}
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Top Indicators Bar */}
      <div className="relative z-10 w-full flex justify-end p-6 pt-10 max-w-md mx-auto">
        <div className="flex items-center gap-1.5 bg-black/35 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/5">
          {onboardingData.map((_, idx) => (
            <span
              key={idx}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                currentStep === idx ? "w-5 bg-primary" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Overlapping White Card */}
      <div className="relative z-10 w-full bg-white dark:bg-zinc-950 rounded-t-[36px] pt-6 px-6 pb-4 shadow-2xl mt-auto transition-colors duration-300">
        <div className="max-w-md mx-auto w-full flex flex-col justify-between">
          
          {/* Card Text Content */}
          <div className="flex flex-col">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
              {step.title}
            </h2>
            <p className="text-sm font-medium text-zinc-550 dark:text-zinc-400 mt-2 leading-relaxed">
              {step.description}
            </p>
          </div>

          {/* Footer Controls Row */}
          <div className="flex justify-end mt-5 w-full">
            <button 
              onClick={handleNext}
              className="flex items-center justify-center bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 cursor-pointer rounded-none px-6 py-3.5 text-xs font-black uppercase tracking-widest gap-2 transition-all duration-200 active:scale-98 border border-primary/10"
            >
              {currentStep === onboardingData.length - 1 ? (
                <>
                  GET STARTED
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  NEXT
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
