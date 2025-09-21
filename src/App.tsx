import { useState, useEffect } from "react"
import { Navigation } from "./components/Navigation"
import { HeroSection } from "./components/HeroSection"
import { FeaturesSection } from "./components/FeaturesSection"
import { HowItWorksSection } from "./components/HowItWorksSection"
import { CTASection } from "./components/CTASection"
import { Footer } from "./components/Footer"
import { SignInPage } from "./components/SignInPage"
import { SignUpPage } from "./components/SignUpPage"
import { BreedPredictionPage } from "./components/BreedPredictionPage"
import { supabase } from './supabaseClient'
import { type Session } from '@supabase/supabase-js'

export default function App() {
  const [currentPage, setCurrentPage] = useState<"home" | "signin" | "signup" | "prediction">("home")
  // --- UPDATED STATE ---
  // We now store the entire session object, not just a boolean
  const [session, setSession] = useState<Session | null>(null)

  // --- NEW LOGIC: SESSION MANAGEMENT ---
  useEffect(() => {
    // Check for an active session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setCurrentPage("prediction")
      }
    })

    // Listen for changes in authentication state (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setCurrentPage("prediction")
      } else {
        setCurrentPage("home")
      }
    })

    // Cleanup the listener when the component unmounts
    return () => subscription.unsubscribe()
  }, [])
  
  // Handle Get Started click - check authentication
  const handleGetStarted = () => {
    if (session) { // <-- Use session to check for authentication
      setCurrentPage("prediction")
    } else {
      setCurrentPage("signin")
    }
  }

  // Handle successful sign in - This is now handled by onAuthStateChange
  const handleSignIn = () => {
    // No longer need to manually set state, Supabase listener will do it.
    // The listener will automatically set the page to "prediction".
  }

  // Handle successful sign up
  const handleSignUp = () => {
    // Send user to the sign-in page after they sign up
    setCurrentPage("signin")
  }

  // Handle sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // The onAuthStateChange listener will automatically handle setting the session to null
    // and redirecting to the home page.
  }

  if (currentPage === "signin") {
    return (
      <SignInPage 
        onBack={() => setCurrentPage("home")}
        onSignUpClick={() => setCurrentPage("signup")}
        onSignIn={handleSignIn}
      />
    )
  }

  if (currentPage === "signup") {
    return (
      <SignUpPage 
        onBack={() => setCurrentPage("home")}
        onSignInClick={() => setCurrentPage("signin")}
        onSignUp={handleSignUp}
      />
    )
  }

  if (currentPage === "prediction") {
    return (
      <BreedPredictionPage 
        onBack={() => setCurrentPage("home")}
        onSignOut={handleSignOut}
        isAuthenticated={!!session} // <-- Use session to determine if authenticated
      />
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        onSignInClick={() => setCurrentPage("signin")} 
        isAuthenticated={!!session} // <-- Use session to determine if authenticated
        onSignOut={handleSignOut}
      />
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </div>
  )
}