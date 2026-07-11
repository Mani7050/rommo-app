import { X, Copy } from "lucide-react"
import { motion } from "framer-motion"
import type { Offer } from "../types"

interface OffersDrawerProps {
  showOffers: boolean
  setShowOffers: (show: boolean) => void
  offers: Offer[]
  handleCopyCoupon: (code: string) => void
}

export function OffersDrawer({ showOffers, setShowOffers, offers, handleCopyCoupon }: OffersDrawerProps) {
  if (!showOffers) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center rounded-none overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs" 
        onClick={() => setShowOffers(false)}
      />

      {/* Drawer Sheet */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="relative z-10 w-full bg-white rounded-none p-6 max-h-[85%] overflow-y-auto shadow-2xl dark:bg-zinc-900"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Loyalty Rewards</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Exclusive Offers</h3>
          </div>
          <button 
            onClick={() => setShowOffers(false)}
            className="rounded-none p-1.5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {offers.map((offer) => (
            <div 
              key={offer.code} 
              className="relative flex flex-col gap-2 rounded-none border border-primary/10 bg-primary/5 p-4 dark:border-primary/20 dark:bg-primary/10"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-lg font-extrabold text-primary">{offer.discount}</span>
                  <h4 className="font-bold text-zinc-955 dark:text-zinc-50 text-xs mt-0.5">{offer.description}</h4>
                </div>
                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider dark:text-zinc-505">{offer.expiry}</span>
              </div>

              <div className="flex items-center justify-between border-t border-primary/10 pt-3 mt-1.5 dark:border-primary/20">
                <span className="font-mono text-xs font-extrabold text-zinc-850 bg-zinc-100/80 dark:bg-zinc-800/80 px-3 py-1 rounded-none border border-zinc-205 dark:border-zinc-700 tracking-wider">
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
      </motion.div>
    </div>
  )
}
