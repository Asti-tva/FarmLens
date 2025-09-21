import { useState } from "react"
import { motion } from "motion/react"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar"
import { Progress } from "./ui/progress"
import { Separator } from "./ui/separator"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  Camera, 
  Upload, 
  TrendingUp, 
  Bell, 
  Search, 
  Settings, 
  ChevronDown,
  Plus,
  Eye,
  Download,
  Filter,
  Calendar,
  BarChart3,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Star,
  Wheat,
  LogOut,
  Package
} from "lucide-react"

interface DashboardProps {
  onSignOut: () => void
}

export function Dashboard({ onSignOut }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "scans" | "analytics" | "inventory">("overview")

  // Mock data for demonstration
  const recentScans = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1624370095729-79bd8d8b5196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBicmVlZCUyMGlkZW50aWZpY2F0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzNjAxMTB8MA&ixlib=rb-4.1.0&q=80&w=300",
      breed: "Holstein Friesian",
      confidence: 96,
      date: "2 hours ago",
      location: "Barn A - Sector 3",
      status: "verified"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1591028889054-bef569748f23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBmYXJtJTIwbWFuYWdlbWVudCUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NTgzNjAxMTN8MA&ixlib=rb-4.1.0&q=80&w=300",
      breed: "Jersey",
      confidence: 92,
      date: "5 hours ago",
      location: "Pasture B",
      status: "pending"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1624370095729-79bd8d8b5196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXR0bGUlMjBicmVlZCUyMGlkZW50aWZpY2F0aW9uJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NTgzNjAxMTB8MA&ixlib=rb-4.1.0&q=80&w=300",
      breed: "Brahman",
      confidence: 89,
      date: "1 day ago",
      location: "Field C",
      status: "verified"
    }
  ]

  const stats = [
    { label: "Total Scans", value: "2,847", change: "+12%", positive: true },
    { label: "Accuracy Rate", value: "97.3%", change: "+0.8%", positive: true },
    { label: "Active Cattle", value: "423", change: "+7", positive: true },
    { label: "Breeds Identified", value: "28", change: "+3", positive: true }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="border-b border-border bg-card shadow-sm"
      >
        <div className="flex h-16 items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wheat className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">FarmLens</span>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search cattle, breeds..."
                className="pl-10 pr-4 py-2 w-64 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <Button variant="ghost" size="sm">
              <Bell className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarImage src="" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Farmer</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-64 border-r border-border bg-card h-[calc(100vh-64px)]"
        >
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </Button>
            <Button
              variant={activeTab === "scans" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("scans")}
            >
              <Camera className="w-4 h-4 mr-2" />
              Recent Scans
            </Button>
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("analytics")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </Button>
            <Button
              variant={activeTab === "inventory" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("inventory")}
            >
              <Package className="w-4 h-4 mr-2" />
              Cattle Inventory
            </Button>
          </nav>

          {/* Quick Actions */}
          <div className="p-4 border-t border-border mt-8">
            <h4 className="font-medium mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Upload className="w-4 h-4 mr-2" />
                Upload Images
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add Cattle
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Welcome Section */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
                  <p className="text-muted-foreground">Here's what's happening on your farm today.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Camera className="w-4 h-4 mr-2" />
                  New Scan
                </Button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader className="pb-2">
                        <CardDescription>{stat.label}</CardDescription>
                        <CardTitle className="text-2xl">{stat.value}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-sm">
                          <TrendingUp className={`w-4 h-4 mr-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`} />
                          <span className={stat.positive ? 'text-green-600' : 'text-red-600'}>
                            {stat.change}
                          </span>
                          <span className="text-muted-foreground ml-1">from last month</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Scans */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Recent Scans</CardTitle>
                        <Button variant="ghost" size="sm">
                          View All
                          <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentScans.map((scan) => (
                          <div key={scan.id} className="flex items-center space-x-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                              <ImageWithFallback
                                src={scan.image}
                                alt={`${scan.breed} cattle`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">{scan.breed}</h4>
                                <Badge variant={scan.status === "verified" ? "default" : "secondary"}>
                                  {scan.status === "verified" ? (
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                  ) : (
                                    <Clock className="w-3 h-3 mr-1" />
                                  )}
                                  {scan.status}
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {scan.location}
                                </div>
                                <div className="flex items-center text-sm">
                                  <Star className="w-3 h-3 mr-1 text-yellow-500" />
                                  {scan.confidence}% confidence
                                </div>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">{scan.date}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats & Actions */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Scans Completed</span>
                        <span className="font-medium">23</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Confidence</span>
                        <span className="font-medium">94.2%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">New Breeds Found</span>
                        <span className="font-medium">2</span>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Weekly Goal</span>
                          <span>156/200</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Model Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">All Systems Operational</p>
                          <p className="text-sm text-muted-foreground">Last updated: 2 min ago</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "scans" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Recent Scans</h1>
                <div className="flex items-center space-x-3">
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button>
                    <Camera className="w-4 h-4 mr-2" />
                    New Scan
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...recentScans, ...recentScans].map((scan, index) => (
                      <motion.div
                        key={`${scan.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className="group cursor-pointer"
                      >
                        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className="aspect-video w-full overflow-hidden">
                            <ImageWithFallback
                              src={scan.image}
                              alt={`${scan.breed} cattle`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{scan.breed}</h3>
                              <Badge variant={scan.status === "verified" ? "default" : "secondary"}>
                                {scan.confidence}%
                              </Badge>
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {scan.location}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="w-3 h-3 mr-1" />
                              {scan.date}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === "analytics" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-3xl font-bold">Analytics</h1>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Scan Analytics</CardTitle>
                    <CardDescription>Performance over the last 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Chart visualization would go here</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Breed Distribution</CardTitle>
                    <CardDescription>Most common breeds identified</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground">Pie chart would go here</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === "inventory" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Cattle Inventory</h1>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Cattle
                </Button>
              </div>
              
              <Card>
                <CardContent className="p-6">
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Cattle Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Track and manage your cattle inventory with detailed breed information and health records.
                    </p>
                    <Button>Get Started</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}