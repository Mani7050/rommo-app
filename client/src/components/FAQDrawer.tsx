import { useState } from "react"
import { X, Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, CreditCard, Sparkles, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface FAQDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface FAQItem {
  question: string
  answer: string
  category: "bookings" | "payments" | "amenities" | "account"
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "bookings",
    question: "How do I check in to my booked workspace?",
    answer: "You will receive a unique 4-digit Entry PIN on your booking confirmation page and in your active bookings list. Simply enter this PIN on the door lock of your designated workspace at your check-in time."
  },
  {
    category: "bookings",
    question: "Can I bring guests with me?",
    answer: "Yes! Guest entry is permitted depending on the capacity of the workspace you have booked. For example, a 4-seater meeting room allows up to 4 people in total."
  },
  {
    category: "bookings",
    question: "Is there a minimum or maximum booking duration?",
    answer: "Our standard workspaces can be booked for as short as 1 hour, or for full days. For long-term bookings, please contact our support team."
  },
  {
    category: "payments",
    question: "How do I cancel my booking?",
    answer: "Navigate to the 'Bookings' tab, select the active booking, click 'View Details', and then click 'Cancel Booking'. Please check the specific workspace's cancellation policy for refund eligibility."
  },
  {
    category: "payments",
    question: "What payment options are accepted?",
    answer: "We accept all major Credit and Debit Cards, UPI (GPay, PhonePe, Paytm), Net Banking, and 'Pay at Venue' for select locations."
  },
  {
    category: "payments",
    question: "How long do refunds take to process?",
    answer: "Once a refund is initiated from our side, it typically takes 3 to 5 business days to reflect in your original payment method, depending on your bank."
  },
  {
    category: "amenities",
    question: "How do I connect to the high-speed WiFi?",
    answer: "Once checked in, open your booking details in the 'Bookings' tab to view the unique WiFi SSID and Password assigned to your workspace."
  },
  {
    category: "amenities",
    question: "How can I request cleaning or maintenance during my stay?",
    answer: "Simply go to your Profile page and select 'Cleaning & Maintenance' to submit a request. Our maintenance team will address it within minutes."
  },
  {
    category: "account",
    question: "How do I update my profile details?",
    answer: "Go to Profile > Account Settings to update your name, phone number, and address details."
  },
  {
    category: "account",
    question: "What is my Security PIN used for?",
    answer: "Your Security PIN (under Profile > Security & PIN) is used for manual door unlocking, terminal kiosks, and securing access to your Rommo app account."
  }
]

export default function FAQDrawer({ isOpen, onClose }: FAQDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<"all" | "bookings" | "payments" | "amenities" | "account">("all")
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  if (!isOpen) return null

  const toggleExpand = (idx: number) => {
    setExpandedIndex(expandedIndex === idx ? null : idx)
  }

  // Filter FAQs based on search query and category
  const filteredFAQs = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === "all" || item.category === activeCategory
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = [
    { id: "all", label: "All FAQs", icon: HelpCircle },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "amenities", label: "Amenities", icon: Sparkles },
    { id: "account", label: "Account", icon: User }
  ] as const

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
        className="relative z-10 w-full bg-white rounded-none p-6 max-h-[92%] overflow-y-auto shadow-2xl dark:bg-zinc-900 flex flex-col"
      >
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Self Help Portal</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">Frequently Asked Questions</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Quick answers to common questions about Rommo workspaces.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-none p-1.5 bg-zinc-100 text-zinc-555 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative flex items-center border border-zinc-200 dark:border-zinc-800 px-3 py-2 bg-zinc-50/50 dark:bg-zinc-955 mb-4 rounded-none">
          <Search className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            placeholder="Search FAQs (e.g. WiFi, Refund, PIN)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-900 dark:text-white font-medium focus:outline-hidden"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="text-zinc-400 hover:text-zinc-650 text-[10px] font-bold uppercase tracking-wider"
            >
              Clear
            </button>
          )}
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id)
                  setExpandedIndex(null)
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider border whitespace-nowrap cursor-pointer transition-all ${
                  isActive 
                    ? "bg-primary text-white border-primary" 
                    : "bg-zinc-55 border-zinc-200 text-zinc-600 dark:bg-zinc-850/30 dark:border-zinc-850 dark:text-zinc-400 hover:border-zinc-300"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            )
          })}
        </div>

        {/* FAQ Items List */}
        <div className="flex flex-col gap-2.5 overflow-y-auto max-h-[350px] pr-1">
          {filteredFAQs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-zinc-200 dark:border-zinc-800 p-6">
              <HelpCircle className="h-8 w-8 text-zinc-300 dark:text-zinc-700 mb-2" />
              <span className="font-bold text-zinc-700 dark:text-zinc-300 text-xs">No FAQs match your search</span>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-555 mt-1 max-w-[240px]">
                Try using different keywords or selecting a different category.
              </p>
            </div>
          ) : (
            filteredFAQs.map((faq, idx) => {
              const isExpanded = expandedIndex === idx
              return (
                <div 
                  key={idx} 
                  className={`border transition-all duration-200 rounded-none overflow-hidden ${
                    isExpanded 
                      ? "border-primary/30 bg-primary/5 dark:bg-primary/5" 
                      : "border-zinc-150 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-900/10"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleExpand(idx)}
                    className="w-full flex items-center justify-between text-left p-4 cursor-pointer"
                  >
                    <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs pr-4 leading-snug">
                      {faq.question}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-primary shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />
                    )}
                  </button>
                  
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="px-4 pb-4 text-[11px] text-zinc-650 dark:text-zinc-350 font-medium leading-relaxed border-t border-zinc-150/45 dark:border-zinc-850/45 pt-3 overflow-hidden"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          )}
        </div>

      </motion.div>
    </div>
  )
}
