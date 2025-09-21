import { Button } from "./ui/button"
import { motion } from "motion/react"
import { Wheat } from "lucide-react"

interface NavigationProps {
  onSignInClick?: () => void
  isAuthenticated?: boolean
  onSignOut?: () => void
}

export function Navigation({ onSignInClick, isAuthenticated = false, onSignOut }: NavigationProps) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Wheat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">FarmLens</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-muted-foreground hover:text-primary hover:scale-110 hover:shadow-md transition-all duration-200 px-3 py-2 rounded-lg">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-primary hover:scale-110 hover:shadow-md transition-all duration-200 px-3 py-2 rounded-lg">
              How It Works
            </a>
            <a href="#about" className="text-muted-foreground hover:text-primary hover:scale-110 hover:shadow-md transition-all duration-200 px-3 py-2 rounded-lg">
              About
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={onSignOut}
              >
                Sign Out
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-foreground"
                onClick={onSignInClick}
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}