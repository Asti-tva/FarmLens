import { motion } from "motion/react"
import { Upload, Cpu, BarChart3 } from "lucide-react"
import { Card } from "./ui/card"

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    description: "Simply upload a photo of your cattle through our intuitive interface. Our system accepts various image formats and automatically optimizes for analysis."
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Our advanced machine learning algorithms analyze key morphological features, comparing against our comprehensive breed database with 80.15% accuracy."
  },
  {
    icon: BarChart3,
    title: "Get Results",
    description: "Receive detailed breed identification with confidence scores, genetic insights, and actionable recommendations for your livestock management."
  }
]

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            How FarmLens Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to unlock precise cattle breed identification using cutting-edge AI technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 text-center h-full bg-card border-border/50 hover:shadow-lg transition-shadow duration-300">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="text-2xl font-semibold text-foreground mb-2">
                    {step.title}
                  </div>
                  <div className="w-12 h-1 bg-accent mx-auto rounded-full"></div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Connection Lines */}
        <div className="hidden md:block relative max-w-6xl mx-auto mt-8">
          <div className="absolute top-1/2 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-primary/50 to-accent/50 transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-1/3 w-1/3 h-0.5 bg-gradient-to-r from-accent/50 to-primary/50 transform -translate-y-1/2"></div>
        </div>
      </div>
    </section>
  )
}