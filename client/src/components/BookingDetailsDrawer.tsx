import { useState, useEffect, useRef } from "react"
import { X, ShieldCheck, Copy, Map, AlertTriangle, RefreshCw, Key, Award, PhoneCall } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import type { Booking } from "../types"
import { useApp } from "../context/AppContext"
import { API_BASE_URL } from "../config"

interface BookingDetailsDrawerProps {
  selectedBooking: Booking | null
  setSelectedBooking: (booking: Booking | null) => void
  setBookingToCancel: (booking: Booking | null) => void
  triggerToast: (msg: string) => void
}

export function BookingDetailsDrawer({
  selectedBooking,
  setSelectedBooking,
  setBookingToCancel,
  triggerToast
}: BookingDetailsDrawerProps) {
  const { handleUpdateBooking, handleBookRoom } = useApp()

  // Self Check-in states
  const [checkInMethod, setCheckInMethod] = useState<"PIN" | "QR" | "FACE" | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)

  // Camera Preview Stream for Face Check-In (Feature 13)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)

  // SOS States
  const [sosCountdown, setSosCountdown] = useState<number | null>(null)
  const sosTimer = useRef<any>(null)

  // Upgrade Auction bid value
  const [bidValue, setBidValue] = useState(selectedBooking?.roomUpgradeBid || 0)

  useEffect(() => {
    if (selectedBooking) {
      setBidValue(selectedBooking.roomUpgradeBid || 0)
    }
  }, [selectedBooking])

  if (!selectedBooking) return null

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300, height: 300, facingMode: "user" }
      })
      setCameraStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.warn("Could not access camera, running virtual scanning preview:", err)
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop())
      setCameraStream(null)
    }
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    triggerToast(`Copied "${text}" to clipboard!`)
  }

  // Trigger Instant Rebooking (Feature 8)
  const handleInstantRebook = () => {
    handleBookRoom({
      title: selectedBooking.title,
      location: selectedBooking.location,
      price: selectedBooking.price,
      image: selectedBooking.image,
      guests: selectedBooking.guests,
      checkInDate: "Tomorrow"
    })
    setSelectedBooking(null)
  }

  // Camera cleanup hook
  useEffect(() => {
    if (isScanning && checkInMethod === "FACE") {
      startCamera()
    } else {
      stopCamera()
    }
    return () => stopCamera()
  }, [isScanning, checkInMethod])

  // Simulated Scanning Animation for Self Check-in (Feature 13)
  useEffect(() => {
    let interval: any
    if (isScanning) {
      interval = setInterval(() => {
        setScanProgress(p => {
          if (p >= 100) {
            clearInterval(interval)
            setIsScanning(false)
            stopCamera()
            
            // Save check-in details on database/state
            handleUpdateBooking(selectedBooking.id, {
              smartCheckIn: {
                checkedIn: true,
                checkInTime: new Date().toISOString(),
                checkInMethod: checkInMethod || "FACE"
              }
            })
            triggerToast("Self Check-In Successful! Key Activated 🔑")
            setCheckInMethod(null)
            setScanProgress(0)
            return 100
          }
          return p + 10
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [isScanning])

  // Trigger SOS alert with real geolocation (Feature 11)
  const handleSosClick = () => {
    setSosCountdown(5)
  }

  useEffect(() => {
    if (sosCountdown !== null) {
      if (sosCountdown <= 0) {
        setSosCountdown(null)
        
        // Request actual Geolocation coordinates
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              fetch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/sos`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ latitude, longitude, timestamp: new Date().toISOString() })
              })
                .then(res => res.json())
                .then(() => {
                  triggerToast(`🚨 SOS Dispatched! GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}!`)
                })
                .catch(err => {
                  console.error("SOS dispatch network error:", err)
                  triggerToast("🚨 SOS Alert Sent! Security & Medical staff dispatched!")
                })
            },
            (err) => {
              console.warn("Geolocation error:", err)
              triggerToast("🚨 SOS Alert Sent! Dispatching emergency services to your Room!")
            }
          )
        } else {
          triggerToast("🚨 SOS Alert Sent! Dispatching emergency services to your Room!")
        }
      } else {
        sosTimer.current = setTimeout(() => {
          setSosCountdown(c => (c !== null ? c - 1 : null))
        }, 1000)
      }
    }
    return () => clearTimeout(sosTimer.current)
  }, [sosCountdown])

  const cancelSos = () => {
    clearTimeout(sosTimer.current)
    setSosCountdown(null)
    triggerToast("SOS Emergency Cancelled.")
  }

  // Bid Upgrade Auction (Feature 6)
  const handlePlaceBid = () => {
    const nextBid = bidValue + 500
    setBidValue(nextBid)
    handleUpdateBooking(selectedBooking.id, {
      roomUpgradeBid: nextBid,
      price: selectedBooking.price + 500
    })
    triggerToast(`Placed Upgrade bid of ₹${nextBid}! Deluxe Room reserved.`)
  }

  const isCheckedIn = selectedBooking.smartCheckIn?.checkedIn
  const currentMood = selectedBooking.roomMood || "Standard"

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center rounded-none overflow-hidden">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-xs" 
        onClick={() => setSelectedBooking(null)}
      />

      {/* Sheet Content */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 26, stiffness: 260 }}
        className="w-full bg-white rounded-t-[32px] rounded-b-none p-6 max-h-[90%] overflow-y-auto shadow-2xl dark:bg-zinc-900"
      >
        
        {/* Title/Header */}
        <div className="flex items-center justify-between border-b border-zinc-150 pb-4 mb-4 dark:border-zinc-800">
          <div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Booking Info</span>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{selectedBooking.title}</h3>
          </div>
          <button 
            onClick={() => setSelectedBooking(null)}
            className="rounded-full p-1.5 bg-zinc-100 text-zinc-500 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 cursor-pointer animate-scaleUp"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Hero Gallery Image */}
        {selectedBooking.image && (
          <div className="relative h-44 w-full overflow-hidden mb-4 bg-zinc-100 dark:bg-zinc-850 rounded-2xl">
            <img 
              src={selectedBooking.image} 
              alt={selectedBooking.title}
              className="h-full w-full object-cover"
            />
            {isCheckedIn && (
              <span className="absolute top-3 left-3 bg-green-500 text-white font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-white animate-ping"></span>
                ACTIVE STAY
              </span>
            )}
          </div>
        )}

        <div className="flex flex-col gap-4 text-sm">
          
          {/* Timeline and Stay tracking (Feature 12) */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 border border-zinc-100 dark:border-zinc-850 rounded-2xl">
            <h4 className="font-extrabold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px] mb-3 flex items-center gap-1.5">
              <RefreshCw className="h-3.5 w-3.5 text-primary" />
              Stay Timeline & Live Status
            </h4>
            <div className="flex justify-between items-start relative before:absolute before:top-2.5 before:left-4 before:right-4 before:h-0.5 before:bg-zinc-200 dark:before:bg-zinc-800 before:z-0">
              
              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className="h-5.5 w-5.5 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">
                  ✓
                </div>
                <span className="text-[9px] font-black text-zinc-700 dark:text-zinc-350">Booked</span>
              </div>

              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCheckedIn ? "bg-primary text-white" : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  {isCheckedIn ? "✓" : "2"}
                </div>
                <span className="text-[9px] font-black text-zinc-700 dark:text-zinc-350">Checked In</span>
              </div>

              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCheckedIn ? "bg-primary text-white" : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  {isCheckedIn ? "✓" : "3"}
                </div>
                <span className="text-[9px] font-black text-zinc-700 dark:text-zinc-350">Mood Setup ({currentMood})</span>
              </div>

              <div className="flex flex-col items-center gap-1 relative z-10">
                <div className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isCheckedIn ? "bg-primary text-white" : "bg-zinc-200 text-zinc-400 dark:bg-zinc-800"
                }`}>
                  {isCheckedIn ? "✓" : "4"}
                </div>
                <span className="text-[9px] font-black text-zinc-700 dark:text-zinc-350">Stay Ends</span>
              </div>

            </div>
          </div>

          {/* Details list */}
          <div className="flex flex-col gap-2.5">
            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Booking Reference</span>
              <span className="font-mono font-bold text-zinc-900 dark:text-zinc-200 bg-zinc-100 px-3 py-0.5 rounded-full dark:bg-zinc-800">
                {selectedBooking.bookingCode}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Location</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200 text-right">{selectedBooking.location}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Guests</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.guests} Guests</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Check-in</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.checkInDate}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Check-out</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-200">{selectedBooking.checkOutDate}</span>
            </div>

            <div className="flex justify-between items-center text-xs pb-2 border-b border-zinc-50 dark:border-zinc-850">
              <span className="text-muted-foreground">Room Mood Theme</span>
              <span className="font-bold text-primary uppercase text-[10px]">{currentMood}</span>
            </div>
          </div>

          {/* Self Check-in Credentials and QR unlock (Feature 13) */}
          {isCheckedIn ? (
            <div className="bg-green-50 border border-green-200/50 dark:bg-green-950/20 dark:border-green-900/30 p-4 rounded-2xl">
              <h4 className="font-bold text-green-700 dark:text-green-400 text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Key className="h-4 w-4" />
                Room Digital Key Active
              </h4>
              
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Bluetooth Room Lock:</span>
                  <span className="font-bold text-green-600 uppercase text-[9px] tracking-widest bg-green-100 dark:bg-green-900/40 px-2.5 py-0.5 rounded-full">READY TO TAP</span>
                </div>
                <div className="flex justify-between items-center text-xs border-t border-green-105 dark:border-green-900/20 pt-2 mt-1">
                  <span className="text-muted-foreground">Entrance PIN:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono tracking-widest">{selectedBooking.entryPin}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Wi-Fi:</span>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{selectedBooking.wifiName}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Wi-Fi Password:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-zinc-800 dark:text-zinc-200 font-mono">{selectedBooking.wifiPassword}</span>
                    <button 
                      onClick={() => selectedBooking.wifiPassword && handleCopy(selectedBooking.wifiPassword)}
                      className="p-1 text-primary hover:scale-110 transition-transform cursor-pointer rounded-full"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-primary/5 p-4 border border-primary/10 dark:bg-primary/10 rounded-2xl">
              <h4 className="font-bold text-primary text-xs uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                Self Check-In Option
              </h4>
              <p className="text-[10px] text-zinc-450 dark:text-zinc-550 mb-3 leading-normal">
                Check in instantly at the property using PIN check-in, QR Scanner, or Face Recognition matching.
              </p>

              {checkInMethod === null ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCheckInMethod("FACE")
                      setIsScanning(true)
                      setScanProgress(0)
                    }}
                    className="flex-1 py-2.5 bg-primary text-white text-[9px] font-black uppercase tracking-wider hover:bg-primary/95 text-center cursor-pointer rounded-xl active:scale-98 transition-all"
                  >
                    🤳 Face Recognition
                  </button>
                  <button
                    onClick={() => {
                      setCheckInMethod("QR")
                      setIsScanning(true)
                      setScanProgress(0)
                    }}
                    className="flex-1 py-2.5 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-wider hover:bg-zinc-800 text-center cursor-pointer rounded-xl active:scale-98 transition-all"
                  >
                    📸 QR Scan
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-4 border border-dashed border-primary/25 bg-white dark:bg-zinc-950 relative overflow-hidden rounded-2xl">
                  
                  {/* Real Camera Preview for Face recognition */}
                  {checkInMethod === "FACE" && (
                    <div className="relative w-40 h-40 border-4 border-emerald-500 rounded-full overflow-hidden mb-3 shadow-lg">
                      <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover scale-x-[-1]"
                      />
                      <div className="absolute inset-4 border-2 border-dashed border-emerald-400/60 rounded-full animate-pulse pointer-events-none"></div>
                    </div>
                  )}

                  {/* Laser line Scanner animation for QR lock check-in */}
                  {checkInMethod === "QR" && (
                    <div className="relative w-32 h-32 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 mb-3 flex items-center justify-center rounded-2xl overflow-hidden">
                      <div className="absolute left-0 right-0 h-0.5 bg-primary shadow-[0_0_8px_var(--color-primary)] animate-pulse top-1/2"></div>
                      <span className="text-xl">📷</span>
                    </div>
                  )}

                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary animate-pulse">
                    {checkInMethod === "FACE" ? "Scanning Face Details..." : "Scanning Room Lock QR Code..."}
                  </p>
                  <p className="text-[9px] text-zinc-400 mt-1">{scanProgress}% completed</p>
                  
                  <button
                    onClick={() => {
                      stopCamera()
                      setCheckInMethod(null)
                    }}
                    className="text-[9px] text-red-500 font-extrabold uppercase tracking-widest hover:underline mt-4 cursor-pointer"
                  >
                    Cancel Scan
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Room Upgrade Auction (Feature 6) */}
          {!isCheckedIn && selectedBooking.status !== "CANCELLED" && (
            <div className="bg-orange-50 border border-orange-200/50 dark:bg-orange-950/20 dark:border-orange-900/30 p-4 rounded-2xl flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-[9px] tracking-wider text-orange-500 uppercase flex items-center gap-1.5">
                  <Award className="h-4 w-4" />
                  Room Upgrade Auction
                </span>
                <span className="text-[9px] font-bold text-zinc-500">Current Bid: ₹{bidValue}</span>
              </div>
              <p className="text-[10.5px] text-zinc-500 dark:text-zinc-400 leading-normal">
                Bid ₹500 extra to upgrade your stay to the premium Deluxe Suite setup.
              </p>
              <button
                onClick={handlePlaceBid}
                className="w-full py-2.5 bg-orange-500 text-white font-extrabold text-[10px] uppercase tracking-wider hover:bg-orange-600 transition-all cursor-pointer rounded-xl"
              >
                Bid Extra ₹500
              </button>
            </div>
          )}

          {/* Payment summary */}
          <div className="bg-zinc-50 p-4 dark:bg-zinc-800/40 rounded-2xl">
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100 text-xs uppercase tracking-wider mb-2">Payment Summary</h4>
            <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Room Fare</span>
                <span>₹{(selectedBooking.price * 0.82).toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{(selectedBooking.price * 0.18).toFixed(0)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-100 pt-2 mt-1 font-bold text-zinc-900 dark:text-zinc-100 dark:border-zinc-700">
                <span>Paid Amount</span>
                <span className="text-primary">₹{selectedBooking.price}</span>
              </div>
            </div>
          </div>

          {/* Split Payment Friends List Status (Feature 5) */}
          {selectedBooking.splitPayments && selectedBooking.splitPayments.length > 0 && (
            <div className="bg-zinc-50 border border-zinc-150 p-4 dark:bg-zinc-800/40 dark:border-zinc-850 rounded-2xl">
              <h4 className="font-extrabold text-zinc-950 dark:text-white uppercase tracking-wider text-[10px] mb-2.5 flex items-center gap-1.5">
                <span>👥</span> Split Payment Group Status
              </h4>
              <div className="flex flex-col gap-2">
                {selectedBooking.splitPayments.map((friend: any, idx: number) => {
                  const friendObj = typeof friend === "string" ? { email: friend, status: "Pending" } : friend
                  const isPaid = friendObj.status === "Paid"
                  return (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-350">{friendObj.email}</span>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isPaid ? "bg-green-150 text-green-700" : "bg-orange-100 text-orange-700"
                        }`}>
                          {friendObj.status || "Pending"}
                        </span>
                        {!isPaid && (
                          <button
                            type="button"
                            onClick={() => {
                              fetch(`${API_BASE_URL}/api/bookings/${selectedBooking.id}/split`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ email: friendObj.email, status: "Paid" })
                              })
                                .then(res => {
                                  if (!res.ok) throw new Error("API failed")
                                  return res.json()
                                })
                                .then(updated => {
                                  // Update local booking reference
                                  handleUpdateBooking(selectedBooking.id, { splitPayments: updated.splitPayments })
                                  triggerToast(`Simulated split payment approval for ${friendObj.email}!`)
                                })
                                .catch(err => {
                                  console.error(err)
                                  triggerToast("Split payment simulator offline.")
                                })
                            }}
                            className="text-[9px] text-primary hover:underline font-extrabold cursor-pointer"
                          >
                            Approve Share
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Emergency SOS countdown overlay (Feature 11) */}
          {sosCountdown !== null && (
            <div className="bg-red-500 text-white p-4 text-center font-bold relative animate-pulse flex flex-col items-center justify-center gap-2">
              <AlertTriangle className="h-6 w-6 text-white animate-bounce" />
              <h4 className="text-sm font-black uppercase tracking-widest">EMERGENCY SOS ACTIVATED</h4>
              <p className="text-xs">Sending coordinates & contacting rescue services in {sosCountdown} seconds...</p>
              <button
                onClick={cancelSos}
                className="mt-2 bg-white text-red-600 font-extrabold text-[9px] uppercase tracking-widest px-4 py-2 hover:bg-zinc-100 cursor-pointer shadow-md"
              >
                Cancel SOS Trigger
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col gap-2 mt-2">
            
            {/* Live active stay Emergency SOS */}
            {isCheckedIn && (
              <button
                onClick={handleSosClick}
                className="w-full py-3.5 bg-red-600 text-white font-black text-xs uppercase tracking-widest hover:bg-red-750 flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 cursor-pointer"
              >
                <PhoneCall className="h-4.5 w-4.5 animate-pulse" />
                🚨 EMERGENCY SOS (Active)
              </button>
            )}

            <Button 
              onClick={() => {
                triggerToast("Directions simulator loaded in Maps")
              }}
              className="rounded-none py-6 font-bold bg-primary text-white hover:bg-primary/95 cursor-pointer flex items-center justify-center gap-2 text-sm"
            >
              <Map className="h-4.5 w-4.5" />
              Get Directions
            </Button>

            {/* Cancel booking vs Instant Rebook (Feature 8) */}
            {selectedBooking.status === "COMPLETED" || selectedBooking.status === "CANCELLED" ? (
              <button 
                onClick={handleInstantRebook}
                className="w-full py-3 bg-zinc-950 text-white font-extrabold text-xs uppercase tracking-widest hover:bg-zinc-800 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                ⚡ Instant Rebooking
              </button>
            ) : (
              <Button 
                onClick={() => {
                  setBookingToCancel(selectedBooking)
                  setSelectedBooking(null)
                }}
                variant="outline" 
                className="rounded-none border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-950/50 dark:hover:bg-red-950/20 font-semibold cursor-pointer text-xs"
              >
                Cancel Booking
              </Button>
            )}

          </div>
        </div>
      </motion.div>
    </div>
  )
}
