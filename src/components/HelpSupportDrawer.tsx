import { useState } from "react"
import { X, HelpCircle, Phone, Mail, MessageSquare, ChevronDown, ChevronUp, Send, Check } from "lucide-react"
import { useApp } from "../context/AppContext"
import { Button } from "@/components/ui/button"

interface HelpSupportDrawerProps {
  isOpen: boolean
  onClose: () => void
}

interface FaqItem {
  question: string
  answer: string
}

export default function HelpSupportDrawer({ isOpen, onClose }: HelpSupportDrawerProps) {
  if (!isOpen) return null

  const { triggerToast } = useApp()
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null)
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const faqs: FaqItem[] = [
    {
      question: "How do I check-in to my workspace?",
      answer: "Go to your Bookings tab, tap on your active booking, and you'll see your Entry PIN and Wi-Fi credentials. Simply enter the PIN on the room's smart lock to open it."
    },
    {
      question: "What is the cancellation policy?",
      answer: "You can cancel any booking up to 24 hours before the scheduled time slot for a full 100% refund. Cancellations made within 24 hours may attract a 50% fee."
    },
    {
      question: "Can I bring guests to my workspace?",
      answer: "Yes, you can bring guests based on the space capacity. When booking, select the 'Number of Guests' to ensure the room size meets your requirements."
    },
    {
      question: "How do I connect to the Wi-Fi?",
      answer: "Once you arrive at the space, open your active booking details to find the Wi-Fi Name and Password. Select the network on your device and enter the credentials."
    },
    {
      question: "Who do I contact in case of emergency?",
      answer: "You can call our host instantly using the 'Call Host' button inside your active booking page, or call our central support hotline at +91 80 4700 9000."
    }
  ]

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketDescription.trim()) return

    setIsSubmitting(true)
    setTimeout(() => {
      triggerToast("Support ticket raised successfully! Ticket ID: #" + Math.floor(100000 + Math.random() * 900000))
      setTicketSubject("")
      setTicketDescription("")
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-zinc-900/60 backdrop-blur-xs flex items-end animate-fadeIn rounded-none">
      {/* Outer Click Closer */}
      <div className="absolute inset-0 z-0" onClick={onClose}></div>

      {/* Drawer Sheet */}
      <div className="relative z-10 w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[92%] overflow-y-auto shadow-2xl dark:bg-zinc-900 animate-slideUp">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Customer Care</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">Help & Support</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Find quick answers or get in touch with our helpdesk team.</p>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 text-xs">
          
          {/* Quick Contact Grid */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2.5">
              Connect With Us
            </h4>
            <div className="grid grid-cols-3 gap-2">
              <a 
                href="tel:+918047009000"
                className="flex flex-col items-center justify-center p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50 hover:border-primary/20 transition-all text-center rounded-none"
              >
                <Phone className="h-4.5 w-4.5 text-primary mb-1.5" />
                <span className="font-extrabold text-[9px] text-zinc-800 dark:text-zinc-250">Call Us</span>
                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 mt-0.5">24/7 Hotline</span>
              </a>

              <a 
                href="mailto:support@rommo.in"
                className="flex flex-col items-center justify-center p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50 hover:border-primary/20 transition-all text-center rounded-none"
              >
                <Mail className="h-4.5 w-4.5 text-primary mb-1.5" />
                <span className="font-extrabold text-[9px] text-zinc-800 dark:text-zinc-250">Email Support</span>
                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 mt-0.5">1-hr response</span>
              </a>

              <button 
                type="button"
                onClick={() => triggerToast("Live Chat simulator loaded. Representative joining shortly.")}
                className="flex flex-col items-center justify-center p-3.5 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50 hover:border-primary/20 transition-all text-center rounded-none cursor-pointer"
              >
                <MessageSquare className="h-4.5 w-4.5 text-primary mb-1.5" />
                <span className="font-extrabold text-[9px] text-zinc-800 dark:text-zinc-250">Live Chat</span>
                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 mt-0.5">Instant chat</span>
              </button>
            </div>
          </div>

          {/* FAQs Accordion */}
          <div>
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2.5">
              Frequently Asked Questions
            </h4>
            <div className="flex flex-col border border-zinc-100 dark:border-zinc-800 rounded-none divide-y divide-zinc-100 dark:divide-zinc-800">
              {faqs.map((faq, idx) => (
                <div key={idx} className="flex flex-col bg-zinc-50/20 dark:bg-zinc-900/10">
                  <button
                    type="button"
                    onClick={() => handleToggleFaq(idx)}
                    className="flex justify-between items-center p-3.5 text-left font-bold text-zinc-800 dark:text-zinc-200 hover:text-primary transition-colors cursor-pointer w-full"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-primary/70 shrink-0" />
                      {faq.question}
                    </span>
                    {openFaqIndex === idx ? <ChevronUp className="h-4 w-4 text-zinc-400 shrink-0" /> : <ChevronDown className="h-4 w-4 text-zinc-400 shrink-0" />}
                  </button>

                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed bg-white dark:bg-zinc-900/40 border-t border-zinc-100/30 dark:border-zinc-850/20 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Raise a Support Ticket Form */}
          <div className="border-t border-zinc-100 pt-4 dark:border-zinc-800">
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-2.5">
              Raise a Support Ticket
            </h4>
            <form onSubmit={handleSubmitTicket} className="flex flex-col gap-3">
              
              {/* Subject */}
              <div className="flex flex-col gap-1">
                <input 
                  type="text"
                  placeholder="Ticket Subject (e.g. Refund inquiry, Locker issue)"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-bold focus:outline-hidden"
                  required
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1">
                <textarea 
                  placeholder="Describe your issue in detail. Our agents will assist you..."
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  rows={3}
                  className="w-full border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-medium focus:outline-hidden resize-none"
                  required
                />
              </div>

              {/* Submit btn */}
              <Button
                type="submit"
                disabled={isSubmitting || !ticketSubject.trim() || !ticketDescription.trim()}
                className="rounded-none py-5 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10 border border-primary/10 w-full flex items-center justify-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <Check className="h-4 w-4" />
                    SUBMITTING TICKET...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    SUBMIT SUPPORT TICKET
                  </>
                )}
              </Button>

            </form>
          </div>

        </div>

      </div>
    </div>
  )
}
