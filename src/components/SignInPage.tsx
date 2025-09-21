import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, Wheat } from "lucide-react"
import { supabase } from '../supabaseClient' // <-- ADDED

interface SignInPageProps {
  onBack: () => void
  onSignUpClick: () => void
  onSignIn: () => void
}

export function SignInPage({ onBack, onSignUpClick, onSignIn }: SignInPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  // --- UPDATED LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      // If sign in is successful, call the function from App.tsx to switch pages
      onSignIn()

    } catch (error: any) {
      // Display any error from Supabase to the user (e.g., "Invalid login credentials")
      alert(error.error_description || error.message)
    }
  }
  // --- END OF UPDATED LOGIC ---

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign In Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center mb-8"
          >
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
              <Wheat className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">FarmLens</span>
          </motion.div>

          {/* Sign In Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Welcome back</CardTitle>
                <CardDescription>
                  Sign in to your FarmLens account to continue managing your cattle breed predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="pl-10 bg-input-background"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 bg-input-background"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button
                      variant="link"
                      className="px-0 text-sm text-primary hover:text-primary/80"
                    >
                      Forgot your password?
                    </Button>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    Sign In
                  </Button>
                </form>

                <div className="mt-6">
                  <Separator className="mb-6" />
                  <div className="text-center text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Button
                      variant="link"
                      className="px-0 text-primary hover:text-primary/80"
                      onClick={onSignUpClick}
                    >
                      Create account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            By signing in, you agree to our{" "}
            <Button variant="link" className="px-0 text-xs">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="px-0 text-xs">
              Privacy Policy
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Right Side - Background Image */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex flex-1 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-primary/10 to-primary/20 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1559142843-0fb2a6963c46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBidWZmYWxvJTIwY2F0dGxlJTIwZmllbGQlMjBydXJhbHxlbnwxfHx8fDE3NTgzNTYyNDB8MA&ixlib.rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium.referral"
          alt="Indian buffalo and cattle grazing in rural field landscape"
          className="w-full h-full object-cover"
        />
        
        {/* Overlay Content */}
        <div className="absolute bottom-8 left-8 z-20 text-white max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Precision Agriculture
            </h3>
            <p className="text-lg opacity-90" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              Advanced AI technology for accurate cattle breed identification and farm management.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}