import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { Checkbox } from "./ui/checkbox"
import { Progress } from "./ui/progress"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { ArrowLeft, Eye, EyeOff, Mail, Lock, User, Wheat, Check, X } from "lucide-react"
import { supabase } from '../supabaseClient' // <-- ADDED

interface SignUpPageProps {
  onBack: () => void
  onSignInClick: () => void
  onSignUp: () => void
}

export function SignUpPage({ onBack, onSignInClick, onSignUp }: SignUpPageProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Password strength validation
  const passwordValidation = useMemo(() => {
    const password = formData.password
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    
    const score = Object.values(checks).filter(Boolean).length
    let strength: 'weak' | 'fair' | 'good' | 'strong' = 'weak'
    
    if (score >= 5) strength = 'strong'
    else if (score >= 4) strength = 'good'
    else if (score >= 3) strength = 'fair'
    
    return {
      checks,
      score,
      strength,
      isValid: score >= 4 // Require at least 4 out of 5 criteria
    }
  }, [formData.password])

  // Password match validation
  const passwordsMatch = formData.password && formData.confirmPassword && 
    formData.password === formData.confirmPassword

  // --- UPDATED LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const newErrors: Record<string, string> = {}
    if (!passwordValidation.isValid) {
      newErrors.password = "Password must meet strength requirements"
    }
    if (!passwordsMatch) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }
    if (!formData.agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions"
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setErrors({})
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      })

      if (error) throw error

      alert('Sign up successful! Please check your email for a confirmation link before signing in.')
      onSignUp() // This navigates the user after sign-up

    } catch (error: any) {
      alert(error.error_description || error.message)
    }
  }
  // --- END OF UPDATED LOGIC ---

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Sign Up Form */}
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

          {/* Sign Up Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="border-border shadow-lg">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Create your account</CardTitle>
                <CardDescription>
                  Join thousands of farmers using AI-powered cattle breed identification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="John"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className={`pl-10 bg-input-background ${
                            errors.firstName ? "border-destructive" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.firstName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.firstName}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className={`pl-10 bg-input-background ${
                            errors.lastName ? "border-destructive" : ""
                          }`}
                          required
                        />
                      </div>
                      {errors.lastName && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-destructive"
                        >
                          {errors.lastName}
                        </motion.p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`pl-10 bg-input-background ${
                          errors.email ? "border-destructive" : ""
                        }`}
                        required
                      />
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`pl-10 pr-10 bg-input-background ${
                          errors.password ? "border-destructive" : ""
                        }`}
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
                    
                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-3"
                      >
                        {/* Strength Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Password strength</span>
                            <span className={`font-medium ${
                              passwordValidation.strength === 'strong' ? 'text-green-600' :
                              passwordValidation.strength === 'good' ? 'text-yellow-600' :
                              passwordValidation.strength === 'fair' ? 'text-orange-600' :
                              'text-destructive'
                            }`}>
                              {passwordValidation.strength.charAt(0).toUpperCase() + passwordValidation.strength.slice(1)}
                            </span>
                          </div>
                          <Progress 
                            value={(passwordValidation.score / 5) * 100} 
                            className="h-2"
                          />
                        </div>
                        
                        {/* Requirements Checklist */}
                        <div className="grid grid-cols-1 gap-1 text-xs">
                          <div className={`flex items-center gap-2 ${
                            passwordValidation.checks.length ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {passwordValidation.checks.length ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            At least 8 characters
                          </div>
                          <div className={`flex items-center gap-2 ${
                            passwordValidation.checks.uppercase ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {passwordValidation.checks.uppercase ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            One uppercase letter
                          </div>
                          <div className={`flex items-center gap-2 ${
                            passwordValidation.checks.lowercase ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {passwordValidation.checks.lowercase ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            One lowercase letter
                          </div>
                          <div className={`flex items-center gap-2 ${
                            passwordValidation.checks.number ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {passwordValidation.checks.number ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            One number
                          </div>
                          <div className={`flex items-center gap-2 ${
                            passwordValidation.checks.special ? 'text-green-600' : 'text-muted-foreground'
                          }`}>
                            {passwordValidation.checks.special ? (
                              <Check className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            One special character (!@#$%^&*)
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className={`pl-10 pr-10 bg-input-background ${
                          errors.confirmPassword ? "border-destructive" : 
                          formData.confirmPassword && passwordsMatch ? "border-green-500" : ""
                        }`}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Password Match Indicator */}
                    {formData.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`flex items-center gap-2 text-sm ${
                          passwordsMatch ? 'text-green-600' : 'text-destructive'
                        }`}
                      >
                        {passwordsMatch ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                        {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                      </motion.div>
                    )}
                    
                    {errors.confirmPassword && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.confirmPassword}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                        className={errors.terms ? "border-destructive" : ""}
                        required
                      />
                      <Label
                        htmlFor="agreeToTerms"
                        className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Button variant="link" className="px-0 text-sm text-primary hover:text-primary/80">
                          Terms of Service
                        </Button>{" "}
                        and{" "}
                        <Button variant="link" className="px-0 text-sm text-primary hover:text-primary/80">
                          Privacy Policy
                        </Button>
                      </Label>
                    </div>
                    {errors.terms && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-destructive"
                      >
                        {errors.terms}
                      </motion.p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={
                      !formData.agreeToTerms || 
                      !passwordValidation.isValid || 
                      !passwordsMatch ||
                      !formData.firstName.trim() ||
                      !formData.lastName.trim() ||
                      !formData.email.trim()
                    }
                  >
                    Create Account
                  </Button>
                </form>

                <div className="mt-6">
                  <Separator className="mb-6" />
                  <div className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Button
                      variant="link"
                      onClick={onSignInClick}
                      className="px-0 text-primary hover:text-primary/80"
                    >
                      Sign in here
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
            <p>
              🌱 Join over 10,000+ farmers using FarmLens for precision agriculture
            </p>
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
          src="https://images.unsplash.com/photo-1583308258166-0ae395db61d9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBjb3clMjBkYWlyeSUyMGZhcm0lMjBzdW5zZXR8ZW58MXx8fHwxNzU4MzU5MTg1fDA&ixlib-rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Indian dairy cows during golden hour sunset on traditional farm"
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
              Start Your Journey
            </h3>
            <p className="text-lg opacity-90" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
              Transform your farm with cutting-edge AI technology. Identify cattle breeds with 99%+ accuracy.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}