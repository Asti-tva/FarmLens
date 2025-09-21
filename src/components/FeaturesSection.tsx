import { motion } from "motion/react"
import { Shield, Zap, Target, Users, Database, Award } from "lucide-react"
import { Card } from "./ui/card"

const features = [
  {
    icon: Target,
    title: "99.2% Accuracy",
    description: "Industry-leading precision in breed identification powered by advanced computer vision algorithms trained on millions of cattle images."
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get comprehensive breed analysis in seconds, not hours. Our optimized AI infrastructure delivers real-time insights for immediate decision-making."
  },
  {
    icon: Database,
    title: "Comprehensive Database",
    description: "Access to the world's most extensive cattle breed database, covering over 200 breeds with detailed genetic and morphological profiles."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Advanced security protocols ensure your livestock data remains confidential. All images are processed securely and never stored without permission."
  },
  {
    icon: Users,
    title: "Expert Validated",
    description: "Our AI models are continuously validated by leading veterinarians and livestock specialists to ensure accuracy and reliability."
  },
  {
    icon: Award,
    title: "Technology Excellence",
    description: "Built with cutting-edge computer vision algorithms and recognized as an innovative precision agriculture solution for modern livestock management."
  }
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Precision Agriculture Technology
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Advanced AI capabilities designed specifically for modern agricultural operations 
            and livestock professionals
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 h-full bg-card border-border/50 hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}