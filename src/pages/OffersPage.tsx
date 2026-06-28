import { useState } from "react"
import { Award, Copy, Gift, Share2, Coffee, Wifi, Sparkles, Check, Lock } from "lucide-react"
import { useApp } from "../context/AppContext"
import type { Offer } from "../types"

export default function OffersPage() {
  const { handleCopyCoupon, user } = useApp()
  const [copiedReferral, setCopiedReferral] = useState(false)

  // Available coupon codes
  const offers: Offer[] = [
    { code: "ROMMOSAVE15", discount: "15% OFF", description: "Get 15% off on any Studio Room bookings this month.", expiry: "Valid till 30 Jun" },
    { code: "MEETFREE90", discount: "FREE 2 HOURS", description: "Book any meeting room for 4 hours and pay only for 2.", expiry: "Valid till 15 Jul" },
    { code: "LOYALTY500", discount: "₹500 OFF", description: "Exclusive gold member discount on premium suites.", expiry: "Valid till 31 Dec" },
    { code: "WEEKEND30", discount: "30% OFF", description: "Special weekend discount for collaborative open desks.", expiry: "Valid till 31 Aug" }
  ]

  const referralCode = "ROMMO-MANI50"

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralCode)
    setCopiedReferral(true)
    handleCopyCoupon(referralCode)
    setTimeout(() => setCopiedReferral(false), 2000)
  }

  // Tier perks data
  const tierPerks = [
    {
      tier: "Silver",
      points: "0 - 1,000 PTS",
      status: "unlocked",
      perks: ["Free high-speed Wi-Fi", "5% discount on meeting rooms"],
      icon: Wifi,
      color: "text-zinc-400 bg-zinc-100 dark:bg-zinc-800"
    },
    {
      tier: "Gold (Your Level)",
      points: "1,000 - 2,000 PTS",
      status: "active",
      perks: ["10% discount on all bookings", "Complimentary beverages", "Priority host response"],
      icon: Coffee,
      color: "text-amber-500 bg-amber-50 dark:bg-amber-950/20"
    },
    {
      tier: "Platinum",
      points: "2,000+ PTS",
      status: "locked",
      perks: ["15% discount on all bookings", "Unlimited free lounge access", "Free upgrade to cabins when available"],
      icon: Sparkles,
      color: "text-primary bg-primary/5 dark:bg-primary/10"
    }
  ]

  return (
    <div className="flex flex-col gap-6 mt-2 animate-fadeIn rounded-none pb-20">
      
      {/* Loyalty Reward Tier Card */}
      <div className="relative overflow-hidden bg-linear-to-br from-zinc-900 to-zinc-850 p-6 border border-zinc-800 shadow-xl rounded-none text-white dark:from-zinc-950 dark:to-zinc-900">
        
        {/* Decorative background details */}
        <div className="absolute right-[-30px] top-[-30px] h-40 w-40 rounded-full bg-primary/10 blur-2xl"></div>
        <div className="absolute left-[-40px] bottom-[-40px] h-40 w-40 rounded-full bg-amber-500/10 blur-2xl"></div>
        
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-primary uppercase tracking-widest">Rommo Rewards Club</span>
              <h3 className="text-lg font-black text-zinc-100">{user.name}</h3>
            </div>
            
            <div className="flex items-center gap-1 bg-amber-500/25 border border-amber-500/30 px-3 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              <Award className="h-4 w-4" />
              Gold Member
            </div>
          </div>

          {/* Points Meter */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Total Reward Points</span>
                <span className="text-3xl font-black text-primary leading-none mt-1">1,250 <span className="text-xs font-bold text-zinc-450 uppercase">pts</span></span>
              </div>
              <span className="text-[10px] text-zinc-400 font-bold">
                750 pts to Platinum
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 w-full bg-zinc-800 border border-zinc-700/50 overflow-hidden">
              <div className="h-full bg-linear-to-r from-amber-500 to-primary transition-all duration-500" style={{ width: "62.5%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Refer & Earn section */}
      <div className="border border-zinc-150 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 rounded-none relative overflow-hidden">
        <div className="absolute right-[-10px] bottom-[-10px] text-zinc-100 dark:text-zinc-800/40 rotate-12 -z-0">
          <Share2 className="h-24 w-24" />
        </div>
        
        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary p-2 dark:bg-primary/20">
              <Share2 className="h-5 w-5" />
            </span>
            <div>
              <h4 className="font-extrabold text-zinc-900 dark:text-zinc-100 text-sm">Refer & Earn 500 Pts</h4>
              <p className="text-[10px] text-muted-foreground mt-0.5">Invite your coworker to book spaces, and both get ₹500 off.</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 mt-1.5 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider">Your Referral Code</span>
              <span className="font-mono text-xs font-black text-zinc-800 dark:text-zinc-200 tracking-wider uppercase bg-zinc-50 dark:bg-zinc-900 px-3 py-1 border border-zinc-200 dark:border-zinc-800">
                {referralCode}
              </span>
            </div>
            
            <button
              onClick={handleCopyReferral}
              className={`rounded-none px-4 py-2 text-xs font-bold text-white transition-all cursor-pointer flex items-center gap-1.5 ${
                copiedReferral ? "bg-green-600" : "bg-primary hover:bg-primary/95"
              }`}
            >
              {copiedReferral ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Coupons Section */}
      <div className="flex flex-col gap-3">
        <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] px-1 flex items-center gap-1.5">
          <Gift className="h-4 w-4 text-primary" />
          Active Discount Coupons
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.code} 
              className="relative flex flex-col gap-2.5 rounded-none border border-zinc-100 bg-white p-4 shadow-xs dark:border-zinc-800 dark:bg-zinc-900/40 hover:border-zinc-200 transition-colors"
            >
              {/* Dashed Left / Right side ticket notch details */}
              <div className="absolute -left-[5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white dark:bg-zinc-900 border-r border-zinc-100 dark:border-zinc-800"></div>
              <div className="absolute -right-[5px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 rounded-full bg-white dark:bg-zinc-900 border-l border-zinc-100 dark:border-zinc-800"></div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="text-base font-black text-primary">{offer.discount}</span>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-200 text-xs mt-0.5 leading-snug">{offer.description}</h4>
                </div>
                <span className="text-[8.5px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-550 shrink-0">{offer.expiry}</span>
              </div>

              <div className="flex items-center justify-between border-t border-dashed border-zinc-100 pt-3 mt-1 dark:border-zinc-800">
                <span className="font-mono text-xs font-extrabold text-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 border border-zinc-150 dark:border-zinc-750 tracking-wider">
                  {offer.code}
                </span>
                <button
                  onClick={() => handleCopyCoupon(offer.code)}
                  className="rounded-none bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary/95 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Tier Benefits Breakdown */}
      <div className="flex flex-col gap-3">
        <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] px-1">
          Membership Tiers & Perks
        </h4>
        
        <div className="flex flex-col gap-3.5">
          {tierPerks.map((t) => {
            const Icon = t.icon
            const isActive = t.status === "active"
            const isLocked = t.status === "locked"

            return (
              <div 
                key={t.tier}
                className={`flex flex-col p-4 border rounded-none relative overflow-hidden transition-all ${
                  isActive 
                    ? "bg-amber-50/20 border-amber-500/30 dark:bg-amber-950/5 dark:border-amber-500/20 shadow-xs" 
                    : "bg-white border-zinc-100 dark:bg-zinc-900/30 dark:border-zinc-850"
                }`}
              >
                {/* Active Indicator background */}
                {isActive && (
                  <div className="absolute right-0 top-0 bg-amber-500 text-white text-[8px] font-black uppercase tracking-wider px-3 py-1">
                    CURRENT TIER
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-none shrink-0 ${t.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h5 className="font-black text-sm text-zinc-850 dark:text-zinc-100 flex items-center gap-2">
                      {t.tier}
                      {isLocked && <Lock className="h-3.5 w-3.5 text-zinc-400" />}
                    </h5>
                    <span className="text-[10px] text-zinc-400 font-bold">{t.points}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 mt-4 border-t border-zinc-100 dark:border-zinc-800 pt-3 text-[11.5px] text-zinc-600 dark:text-zinc-400">
                  {t.perks.map((perk, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-amber-500" : "bg-zinc-350 dark:bg-zinc-650"}`}></span>
                      <span className={isActive ? "font-semibold text-zinc-850 dark:text-zinc-200" : ""}>{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
