import { useState, useRef, useEffect } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { motion } from "motion/react"
import { Camera, X, RotateCcw, Check, AlertCircle } from "lucide-react"

interface CameraCaptureProps {
  onCapture: (imageUrl: string) => void
  onClose: () => void
  isOpen: boolean
  onFallbackToUpload?: () => void
}

export function CameraCapture({ onCapture, onClose, isOpen, onFallbackToUpload }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isOpen) {
      checkPermissionsAndStart()
    } else {
      stopCamera()
    }

    return () => {
      stopCamera()
    }
  }, [isOpen])

  const checkPermissionsAndStart = async () => {
    // Check if permissions API is supported
    if ('permissions' in navigator) {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
        
        if (permission.state === 'denied') {
          setError('Camera access was previously denied. Please click the camera icon in your browser\'s address bar to allow access.')
          setIsLoading(false)
          return
        }
      } catch (err) {
        // Permissions API not supported or failed, continue with camera access attempt
        console.log('Permissions API not supported, proceeding with camera access')
      }
    }
    
    startCamera()
  }

  const startCamera = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera not supported in this browser')
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Prefer rear camera on mobile
        }
      })
      
      setStream(mediaStream)
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.play()
      }
    } catch (err: any) {
      console.error('Error accessing camera:', err)
      
      let errorMessage = 'Unable to access camera. '
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. Please allow camera permissions in your browser and try again.'
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on this device. Please use file upload instead.'
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application. Please close other apps using the camera and try again.'
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera settings not supported. Trying with default settings...'
        // Try again with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({ video: true })
          setStream(basicStream)
          if (videoRef.current) {
            videoRef.current.srcObject = basicStream
            videoRef.current.play()
          }
          setIsLoading(false)
          return
        } catch {
          errorMessage = 'Camera not compatible. Please use file upload instead.'
        }
      } else if (err.message === 'Camera not supported in this browser') {
        errorMessage = 'Camera not supported in this browser. Please use file upload instead.'
      } else {
        errorMessage = 'Camera access failed. Please try file upload instead.'
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setCapturedImage(null)
    setError(null)
  }

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to data URL
    const imageUrl = canvas.toDataURL('image/jpeg', 0.8)
    setCapturedImage(imageUrl)
  }

  const usePhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage)
      onClose()
    }
  }

  const retakePhoto = () => {
    setCapturedImage(null)
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl"
      >
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Camera className="h-5 w-5 text-primary" />
                <span>Camera Capture</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {error ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-6"
              >
                <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <h3 className="font-semibold text-foreground mb-2">Camera Access Issue</h3>
                <p className="text-muted-foreground text-sm mb-4 max-w-md mx-auto">{error}</p>
                
                {error.includes('denied') && (
                  <div className="bg-muted/50 rounded-lg p-4 mb-4 text-left">
                    <h4 className="font-medium text-foreground mb-2 text-sm">To enable camera access:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Click the camera icon in your browser's address bar</li>
                      <li>• Select "Allow" for camera permissions</li>
                      <li>• Refresh the page if needed</li>
                    </ul>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={startCamera} variant="outline" size="sm">
                    <Camera className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button 
                    onClick={() => {
                      onClose()
                      onFallbackToUpload?.()
                    }} 
                    size="sm"
                  >
                    Use File Upload Instead
                  </Button>
                </div>
              </motion.div>
            ) : isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">Starting camera...</p>
              </div>
            ) : capturedImage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative rounded-lg overflow-hidden border border-border">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={retakePhoto}
                    variant="outline"
                    className="flex-1"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake
                  </Button>
                  <Button
                    onClick={usePhoto}
                    className="flex-1"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Use Photo
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div className="relative rounded-lg overflow-hidden border border-border bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-80 object-cover"
                  />
                  {stream && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <Button
                        onClick={capturePhoto}
                        size="lg"
                        className="rounded-full w-16 h-16 p-0 bg-primary hover:bg-primary/90"
                      >
                        <Camera className="h-6 w-6" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Position cattle in the frame and click the capture button
                  </p>
                  <Button
                    onClick={onClose}
                    variant="ghost"
                    size="sm"
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
            
            {/* Hidden canvas for photo capture */}
            <canvas
              ref={canvasRef}
              className="hidden"
            />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}