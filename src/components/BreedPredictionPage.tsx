import { useState, useRef, useEffect } from "react"
import { CameraCapture } from "./CameraCapture"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { motion } from "motion/react"
import { Upload, ArrowLeft, Camera, Zap, CheckCircle, LogOut, User, History, Clock, Star, Eye, Trash2, Wheat } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { supabase } from '../supabaseClient'

// --- INTERFACES FOR YOUR DATA ---
interface BreedPredictionPageProps {
  onBack: () => void
  onSignOut: () => void
  isAuthenticated: boolean
}

interface PredictionResult {
  predictions: {
    breed: string
    score: number
  }[]
}

interface PastScan {
  id: number
  image_url: string
  image_filename: string
  predicted_breed: string
  confidence_score: number
  created_at: string
}

// --- HELPER FUNCTION TO CONVERT CAMERA IMAGE TO FILE ---
async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type });
}

export function BreedPredictionPage({ onBack, onSignOut, isAuthenticated }: BreedPredictionPageProps) {
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"prediction" | "details">("prediction")
  const [selectedScanDetails, setSelectedScanDetails] = useState<PastScan | null>(null)
  const [pastScans, setPastScans] = useState<PastScan[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchPastScans = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('predictions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const scansWithUrls = data.map(scan => {
        const { data: urlData } = supabase.storage
          .from('cattle-images')
          .getPublicUrl(scan.image_filename);
        return { ...scan, image_url: urlData.publicUrl };
      });
      
      setPastScans(scansWithUrls as any);
    } catch (error: any) {
      console.error("Error fetching past scans:", error.message);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPastScans();
    }
  }, [isAuthenticated]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setSelectedImage(previewUrl);
    setPrediction(null);
  };
  
  const handleCameraCapture = async (imageUrl: string) => {
    setIsCameraOpen(false);
    setSelectedImage(imageUrl);
    setPrediction(null);
    const file = await dataUrlToFile(imageUrl, `capture-${Date.now()}.jpg`);
    setSelectedImageFile(file);
  };

  const analyzeCattle = async () => {
    if (!selectedImageFile) {
      alert("Please select an image first.");
      return;
    }

    setIsAnalyzing(true);
    setPrediction(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to perform an analysis.");

      const fileExt = selectedImageFile.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('cattle-images')
        .upload(filePath, selectedImageFile);
        
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('cattle-images')
        .getPublicUrl(filePath);

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: urlData.publicUrl })
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(errorBody.error || "Prediction API failed");
      }
      
      const predictionResult: PredictionResult = await response.json();
      setPrediction(predictionResult);

      const topPrediction = predictionResult.predictions[0];
      
      // --- FINAL FIX IS HERE ---
      // The user_id is now removed from the insert call.
      // The database will set it automatically and securely using the default value.
      const { error: insertError } = await supabase
        .from('predictions')
        .insert({
          image_filename: filePath,
          predicted_breed: topPrediction.breed,
          confidence_score: topPrediction.score
        });
      // --- END OF FINAL FIX ---
      
      if (insertError) throw insertError;

      await fetchPastScans();

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const deletePastScan = async (scan: PastScan) => {
    try {
      const { error: dbError } = await supabase
        .from('predictions')
        .delete()
        .match({ id: scan.id });
      if (dbError) throw dbError;

      const { error: storageError } = await supabase.storage
        .from('cattle-images')
        .remove([scan.image_filename]);
      if (storageError) throw storageError;

      setPastScans(prev => prev.filter(s => s.id !== scan.id));

    } catch (error: any) {
      alert(error.message);
    }
  };

  const triggerFileInput = () => fileInputRef.current?.click();
  const openCamera = () => setIsCameraOpen(true);
  const handleCameraFallback = () => setTimeout(() => fileInputRef.current?.click(), 100);

  const viewScanDetails = (scan: PastScan) => {
    setSelectedScanDetails(scan);
    setViewMode("details");
  };

  const backToPrediction = () => {
    setViewMode("prediction");
    setSelectedScanDetails(null);
    setSelectedImage(null);
    setPrediction(null);
    setSelectedImageFile(null);
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onBack}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Wheat className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">FarmLens</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                AI Cattle Breed Prediction
              </div>
              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-2 px-3 py-1.5 bg-primary/10 rounded-full">
                    <User className="h-3 w-3 text-primary" />
                    <span className="text-xs text-primary font-medium">Signed In</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={onSignOut}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Sign Out
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-80 border-r border-border p-6 overflow-y-auto"
          style={{ backgroundColor: '#0D4E3B25' }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-primary mb-1">Past Scans</h2>
            <p className="text-sm text-primary/70">View your previous predictions</p>
          </div>

          <Separator className="mb-6" />

          <div className="space-y-3">
            {pastScans.map((scan) => (
              <Card 
                key={scan.id} 
                className="cursor-pointer hover:shadow-md transition-shadow group border-primary/20 bg-white/80"
              >
                <CardContent className="p-4">
                  <div className="flex space-x-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <ImageWithFallback
                        src={scan.image_url}
                        alt={scan.predicted_breed}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium text-primary text-sm truncate">
                          {scan.predicted_breed}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePastScan(scan);
                          }}
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          <Star className="h-2.5 w-2.5 mr-1" />
                          {(scan.confidence_score * 100).toFixed(2)}%
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-primary/60">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(scan.created_at).toLocaleDateString()} • {new Date(scan.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="flex space-x-1 mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewScanDetails(scan)}
                          className="h-6 text-xs px-2 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                          <Eye className="h-2.5 w-2.5 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {pastScans.length === 0 && (
            <div className="text-center py-8">
              <History className="h-8 w-8 text-primary/40 mx-auto mb-2" />
              <p className="text-sm text-primary/60">No past scans yet</p>
              <p className="text-xs text-primary/40 mt-1">Your predictions will appear here</p>
            </div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {viewMode === "details" && selectedScanDetails ? (
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Button
                    variant="ghost"
                    onClick={backToPrediction}
                    className="mb-4 text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Prediction
                  </Button>
                  <h1 className="text-3xl font-bold text-foreground">
                    Scan Details
                  </h1>
                   <p className="text-muted-foreground mt-2">
                    {new Date(selectedScanDetails.created_at).toLocaleDateString()} at {new Date(selectedScanDetails.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Scanned Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg overflow-hidden border border-border">
                      <img 
                        src={selectedScanDetails.image_url} 
                        alt={selectedScanDetails.predicted_breed}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Prediction Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-6 bg-primary/5 rounded-lg border border-primary/20">
                      <h3 className="text-2xl font-bold text-primary mb-2">
                        {selectedScanDetails.predicted_breed}
                      </h3>
                      <div className="text-3xl font-bold text-foreground mb-1">
                        {(selectedScanDetails.confidence_score * 100).toFixed(2)}%
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Confidence Level
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Cattle Breed Prediction
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Upload an image of cattle and let our AI identify the breed with precision and detail
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Camera className="h-5 w-5 text-primary" />
                    <span>Upload Cattle Image</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border border-border">
                        <img 
                          src={selectedImage} 
                          alt="Selected cattle" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <Button onClick={triggerFileInput} variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload New
                        </Button>
                        <Button onClick={openCamera} variant="outline" className="hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                          <Camera className="h-4 w-4 mr-2" />
                          Take Photo
                        </Button>
                      </div>
                      <Button onClick={analyzeCattle} disabled={isAnalyzing} className="w-full">
                        {isAnalyzing ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Zap className="h-4 w-4 mr-2" />
                            Analyze Breed
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div onClick={triggerFileInput} className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="font-semibold text-foreground mb-2">
                          Upload Image
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Click to select or drag and drop
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Separator className="flex-1" />
                        <span className="text-xs text-muted-foreground">OR</span>
                        <Separator className="flex-1" />
                      </div>
                      <Button onClick={openCamera} variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors">
                        <Camera className="h-4 w-4 mr-2" />
                        Take Photo with Camera
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span>Prediction Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isAnalyzing ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground">Analyzing Image...</h3>
                      <p className="text-muted-foreground text-sm">Our AI is identifying the breed. This may take a moment.</p>
                    </div>
                  ) : prediction ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4"
                    >
                      {prediction.predictions.map((pred, index) => (
                        <div key={index} className={`p-4 rounded-lg border ${index === 0 ? 'bg-primary/5 border-primary/20' : 'bg-muted/50'}`}>
                          <div className="flex justify-between items-center">
                            <span className={`font-semibold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>{index + 1}. {pred.breed}</span>
                            <Badge variant={index === 0 ? "default" : "secondary"}>{(pred.score * 100).toFixed(2)}%</Badge>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Zap className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        Ready to Analyze
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Upload an image to see the top 3 breed predictions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>
          )}
        </div>
      </div>

      <CameraCapture
        isOpen={isCameraOpen}
        onCapture={handleCameraCapture}
        onClose={() => setIsCameraOpen(false)}
        onFallbackToUpload={handleCameraFallback}
      />
    </div>
  )
}