import { useState } from "react"
import { X, Wrench, Sparkles, AlertCircle, Clock, CheckCircle2, ChevronRight, CornerDownRight } from "lucide-react"
import { useApp } from "../context/AppContext"
import { Button } from "@/components/ui/button"

interface MaintenanceCleaningDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function MaintenanceCleaningDrawer({ isOpen, onClose }: MaintenanceCleaningDrawerProps) {
  if (!isOpen) return null

  const { bookings, maintenanceRequests, addMaintenanceRequest } = useApp()
  
  // Form states
  const [selectedBooking, setSelectedBooking] = useState("General Space")
  const [requestType, setRequestType] = useState<"CLEANING" | "MAINTENANCE">("CLEANING")
  const [category, setCategory] = useState("Trash Removal")
  const [details, setDetails] = useState("")

  const cleaningCategories = [
    "Trash Removal",
    "Floor Sweeping / Mopping",
    "Sanitization",
    "Desk Cleaning",
    "Water / Tea Refill"
  ]

  const maintenanceCategories = [
    "AC / Climate Control",
    "Wi-Fi / Internet",
    "Electrical Outlet / Power",
    "Lights / Bulb replacement",
    "Chair / Desk adjustment"
  ]

  const handleTypeChange = (type: "CLEANING" | "MAINTENANCE") => {
    setRequestType(type)
    setCategory(type === "CLEANING" ? cleaningCategories[0] : maintenanceCategories[0])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!details.trim()) return

    addMaintenanceRequest({
      bookingTitle: selectedBooking,
      requestType,
      category,
      details
    })

    // Reset form
    setDetails("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-3.5 w-3.5 text-zinc-400" />
      case "IN_PROGRESS":
        return <AlertCircle className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
      case "RESOLVED":
        return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
      default:
        return null
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-zinc-100 text-zinc-650 dark:bg-zinc-800 dark:text-zinc-400"
      case "IN_PROGRESS":
        return "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400"
      case "RESOLVED":
        return "bg-green-50 text-green-600 dark:bg-green-950/20 dark:text-green-400"
      default:
        return "bg-zinc-100 text-zinc-600"
    }
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
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Office Services</span>
            <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5 leading-snug">Cleaning & Maintenance</h3>
            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">Request cleaning or report facility issues in real-time.</p>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-550 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 text-xs">
          
          {/* Service request form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-zinc-50/50 dark:bg-zinc-900/30 p-4 border border-zinc-100 dark:border-zinc-850/55 rounded-none">
            
            {/* Space selector */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Select Space/Cabin</label>
              <select 
                value={selectedBooking}
                onChange={(e) => setSelectedBooking(e.target.value)}
                className="w-full border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-extrabold focus:outline-hidden cursor-pointer"
              >
                <option value="General Space">General Space (Common Area)</option>
                {bookings.filter(b => b.status === "CONFIRMED").map((b) => (
                  <option key={b.id} value={b.title}>{b.title}</option>
                ))}
              </select>
            </div>

            {/* Toggle service type */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Service Request Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTypeChange("CLEANING")}
                  className={`flex items-center justify-center gap-2 p-3 font-bold border transition-all ${
                    requestType === "CLEANING"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  <Sparkles className="h-4 w-4" />
                  Request Cleaning
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange("MAINTENANCE")}
                  className={`flex items-center justify-center gap-2 p-3 font-bold border transition-all ${
                    requestType === "MAINTENANCE"
                      ? "bg-primary border-primary text-white"
                      : "bg-white border-zinc-200 text-zinc-600 dark:bg-zinc-950 dark:border-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  <Wrench className="h-4 w-4" />
                  Report Maintenance
                </button>
              </div>
            </div>

            {/* Category dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Request Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-extrabold focus:outline-hidden cursor-pointer"
              >
                {requestType === "CLEANING" 
                  ? cleaningCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                  : maintenanceCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)
                }
              </select>
            </div>

            {/* Details input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-extrabold text-zinc-400 dark:text-zinc-550 uppercase tracking-wider text-[9px]">Details / Description</label>
              <textarea 
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder={requestType === "CLEANING" ? "E.g. Clean the table and sanitize the keys..." : "E.g. The Wi-Fi is constantly dropping / thermostat is broken..."}
                rows={3}
                className="w-full border border-zinc-200 dark:border-zinc-800 p-2.5 bg-white dark:bg-zinc-950 text-zinc-900 dark:text-white font-semibold focus:outline-hidden resize-none placeholder-zinc-400"
              />
            </div>

            {/* Submit btn */}
            <Button
              type="submit"
              disabled={!details.trim()}
              className="rounded-none py-6 font-extrabold text-xs uppercase tracking-widest text-primary-foreground bg-primary hover:bg-primary/95 cursor-pointer shadow-md shadow-primary/10 border border-primary/10 w-full"
            >
              SUBMIT SERVICE REQUEST
            </Button>

          </form>

          {/* Recent requests list */}
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px]">
              Active Requests History ({maintenanceRequests.length})
            </h4>

            {maintenanceRequests.length === 0 ? (
              <div className="text-center py-6 text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-none">
                No services requested yet.
              </div>
            ) : (
              <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {maintenanceRequests.map((req) => (
                  <div 
                    key={req.id}
                    className="flex flex-col gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-850/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-none ${
                          req.requestType === "CLEANING" ? "bg-spark-orange/10 text-primary border border-primary/10" : "bg-blue-500/10 text-blue-500 border border-blue-500/10"
                        }`}>
                          {req.requestType}
                        </span>
                        <span className="font-extrabold text-zinc-800 dark:text-zinc-200 font-mono text-[9px]">{req.createdAt}</span>
                      </div>
                      
                      {/* Status badge */}
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-none ${getStatusStyle(req.status)}`}>
                        {getStatusIcon(req.status)}
                        <span>{req.status.replace("_", " ")}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-1">
                      <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="font-extrabold text-zinc-900 dark:text-zinc-100 text-xs">{req.category}</span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-400 dark:text-zinc-550 mt-0.5">
                          <CornerDownRight className="h-3 w-3 shrink-0" />
                          <span>Space: <span className="font-bold text-zinc-650 dark:text-zinc-350">{req.bookingTitle}</span></span>
                        </div>
                        <p className="text-[10px] text-zinc-500 dark:text-zinc-400 mt-2 font-medium bg-white dark:bg-zinc-900/50 p-2 border border-zinc-100/50 dark:border-zinc-850/30">
                          {req.details}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}
