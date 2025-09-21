import { Button } from "./ui/button"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useEffect, useState } from "react"

interface HeroSectionProps {
  onGetStarted?: () => void
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Parallax Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-forest-green/40 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1659788596863-96e31a910bf6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBoZXJkJTIwZ3JhemluZyUyMGdyZWVuJTIwcGFzdHVyZXxlbnwxfHx8fDE3NTgzNTA2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Cattle herd grazing in lush green pasture"
          className="w-full h-full object-cover scale-110"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.8)' }}
          >
            Precision Cattle Breed
            <span className="block text-white drop-shadow-lg" style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.9), 0 0 20px rgba(255,255,255,0.3)' }}> Prediction</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-white/95 mb-12 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.8)' }}
          >
            Harness the power of AI to identify cattle breeds with unprecedented accuracy. 
            Transform your livestock management with cutting-edge computer vision technology.
          </motion.p>
          
          <motion.div 
            className="flex justify-center items-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-12 py-6 text-2xl group font-bold shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-xl border-2 border-primary/20"
              onClick={onGetStarted}
            >
              Get Started
              <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}