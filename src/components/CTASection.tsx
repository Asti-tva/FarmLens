import { motion } from "motion/react"
import { Shield, Users, Award } from "lucide-react"

const trustIndicators = [
  {
    icon: Users,
    title: "Global",
    subtitle: "Community Ready"
  },
  {
    icon: Award,
    title: "80.15%",
    subtitle: "Accuracy Rate"
  },
  {
    icon: Shield,
    title: "Secure",
    subtitle: "Technology"
  }
]

export function CTASection() {
  return (
    <section id="about" className="py-24 bg-gradient-to-br from-primary via-primary to-primary/90 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6">
            Built for Modern
            <span className="block">Agriculture</span>
          </h2>
          
          <p className="text-xl text-primary-foreground/90 mb-12 max-w-2xl mx-auto">
            Experience the future of livestock management with cutting-edge AI technology 
            designed for precision breed identification and agricultural innovation.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {trustIndicators.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 border border-primary-foreground/20"
              >
                <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-accent-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary-foreground mb-2">
                  {item.title}
                </div>
                <div className="text-primary-foreground/80">
                  {item.subtitle}
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-primary-foreground/70 text-sm mt-12"
          >
            Advanced AI Technology • Computer Vision Powered • Research-Grade Accuracy
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}