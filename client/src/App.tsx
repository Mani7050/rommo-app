import { useEffect, useRef } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"

// Providers
import { AppProvider, useApp } from "./context/AppContext"

// Pages
import SplashPage from "./pages/SplashPage"
import OnboardingPage from "./pages/OnboardingPage"
import SignInPage from "./pages/SignInPage"
import SignUpPage from "./pages/SignUpPage"
import DashboardLayout from "./pages/DashboardLayout"
import DiscoverPage from "./pages/DiscoverPage"
import BookingsPage from "./pages/BookingsPage"
import FavoritesPage from "./pages/FavoritesPage"
import OffersPage from "./pages/OffersPage"
import ProfilePage from "./pages/ProfilePage"

// Guards
function ProtectedRoute() {
  const { isAuthenticated } = useApp()
  console.log("ProtectedRoute evaluated. isAuthenticated:", isAuthenticated)
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

function GuestRoute() {
  const { isAuthenticated, hasSeenOnboarding } = useApp()
  console.log("GuestRoute evaluated. isAuthenticated:", isAuthenticated, "hasSeenOnboarding:", hasSeenOnboarding)
  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />
  }
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />
}

function AppContent() {
  const { toast, isAuthenticated } = useApp()
  const navigate = useNavigate()
  const isInitialMount = useRef(true)

  useEffect(() => {
    // If not authenticated, force initial load/refresh to start from the Splash page
    if (isInitialMount.current) {
      isInitialMount.current = false
      if (!isAuthenticated) {
        navigate("/", { replace: true })
      }
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="relative flex h-dvh w-full flex-col overflow-hidden bg-white dark:bg-zinc-900 font-sans transition-colors duration-300">
      
      {/* Interactive Toast */}
      {toast.visible && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-55 flex items-center gap-2 rounded-none bg-zinc-900 px-4 py-3 text-sm text-white shadow-xl animate-bounce dark:bg-zinc-100 dark:text-zinc-900">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>{toast.message}</span>
        </div>
      )}

      <Routes>
        {/* Public Splash Route */}
        <Route path="/" element={<SplashPage />} />
          
          {/* Guest Only Routes */}
          <Route element={<GuestRoute />}>
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Route>

          {/* Publicly Accessible Onboarding Route (allows refresh/direct testing) */}
          <Route path="/onboarding" element={<OnboardingPage />} />
          
          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/home" element={<DiscoverPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          {/* Legacy Redirect for /dashboard paths */}
          <Route path="/dashboard/*" element={<Navigate to="/home" replace />} />

          {/* Wildcard fallback redirects to Splash */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    )
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </Router>
  )
}
