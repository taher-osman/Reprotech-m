import React, { useState, useRef, useEffect } from 'react';
import { Camera, ScanLine, X, Check, RefreshCw, Flashlight, Zap } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { BarcodeFormat } from '../types/inventoryTypes';

interface BarcodeScannerProps {
  onScan: (barcode: string, format: BarcodeFormat) => void;
  onClose: () => void;
  isOpen: boolean;
  allowedFormats?: BarcodeFormat[];
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose,
  isOpen,
  allowedFormats = ['CODE128', 'EAN13', 'EAN8', 'QR_CODE', 'UPC_A', 'UPC_E']
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [error, setError] = useState<string>('');
  const [manualCode, setManualCode] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<BarcodeFormat>('CODE128');
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize camera when component opens
  useEffect(() => {
    if (isOpen && isScanning) {
      initializeCamera();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isOpen, isScanning]);

  // Check camera availability
  useEffect(() => {
    checkCameraAvailability();
  }, []);

  const checkCameraAvailability = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasCamera(videoDevices.length > 0);
    } catch (error) {
      console.error('Error checking camera availability:', error);
      setHasCamera(false);
    }
  };

  const initializeCamera = async () => {
    try {
      setError('');
      
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startScanning();
      }
    } catch (error) {
      console.error('Error initializing camera:', error);
      setError('Unable to access camera. Please check permissions.');
      setIsScanning(false);
    }
  };

  const startScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
    }

    // Simulate barcode scanning (in a real implementation, use a library like ZXing or QuaggaJS)
    scanIntervalRef.current = setInterval(() => {
      // This is a mock implementation
      // In a real app, you would use a barcode scanning library here
      const mockScan = Math.random() < 0.1; // 10% chance of mock scan
      if (mockScan) {
        const mockBarcode = generateMockBarcode();
        handleScanSuccess(mockBarcode, 'CODE128');
      }
    }, 1000);
  };

  const stopScanning = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const generateMockBarcode = (): string => {
    // Generate mock barcode for demonstration
    const prefix = 'INV';
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const handleScanSuccess = (code: string, format: BarcodeFormat) => {
    if (validateBarcode(code, format)) {
      setScanHistory(prev => [code, ...prev.slice(0, 4)]); // Keep last 5 scans
      onScan(code, format);
      setIsScanning(false);
      setError('');
    } else {
      setError(`Invalid ${format} barcode format`);
    }
  };

  const validateBarcode = (code: string, format: BarcodeFormat): boolean => {
    switch (format) {
      case 'EAN13':
        return /^\d{13}$/.test(code);
      case 'EAN8':
        return /^\d{8}$/.test(code);
      case 'UPC_A':
        return /^\d{12}$/.test(code);
      case 'UPC_E':
        return /^\d{8}$/.test(code);
      case 'CODE128':
        return code.length > 0 && code.length <= 48;
      case 'QR_CODE':
        return code.length > 0;
      default:
        return true;
    }
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      if (validateBarcode(manualCode.trim(), selectedFormat)) {
        handleScanSuccess(manualCode.trim(), selectedFormat);
        setManualCode('');
      } else {
        setError(`Invalid ${selectedFormat} format`);
      }
    }
  };

  const toggleTorch = async () => {
    if (streamRef.current) {
      try {
        const track = streamRef.current.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: !torchEnabled }]
          });
          setTorchEnabled(!torchEnabled);
        }
      } catch (error) {
        console.error('Error toggling torch:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 bg-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Scan Barcode</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scanner content */}
        <div className="p-4 space-y-4">
          {/* Camera section */}
          {hasCamera && (
            <div className="space-y-3">
              {isScanning ? (
                <div className="relative">
                  <video
                    ref={videoRef}
                    className="w-full h-48 bg-black rounded-lg object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  
                  {/* Scan overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-32 border-2 border-red-500 border-dashed rounded-lg animate-pulse">
                      <ScanLine className="w-full h-full text-red-500 opacity-50" />
                    </div>
                  </div>

                  {/* Camera controls */}
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleTorch}
                      className="bg-black bg-opacity-50 text-white hover:bg-opacity-75"
                    >
                      {torchEnabled ? (
                        <Zap className="w-4 h-4" />
                      ) : (
                        <Flashlight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {/* Scanning indicator */}
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      Scanning...
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 mb-3">Camera ready</p>
                    <Button onClick={() => setIsScanning(true)}>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                </div>
              )}

              {isScanning && (
                <div className="flex justify-center">
                  <Button variant="outline" onClick={() => setIsScanning(false)}>
                    Stop Scanning
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Manual input section */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Manual Entry</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Barcode Format</label>
                <select
                  value={selectedFormat}
                  onChange={(e) => setSelectedFormat(e.target.value as BarcodeFormat)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {allowedFormats.map(format => (
                    <option key={format} value={format}>{format}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Barcode</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Enter barcode manually"
                    className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleManualSubmit();
                      }
                    }}
                  />
                  <Button onClick={handleManualSubmit} disabled={!manualCode.trim()}>
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Scan history */}
          {scanHistory.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">Recent Scans</h4>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {scanHistory.map((code, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setManualCode(code);
                      setSelectedFormat('CODE128');
                    }}
                    className="w-full text-left px-2 py-1 text-sm bg-gray-50 hover:bg-gray-100 rounded truncate"
                  >
                    {code}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Camera permission help */}
          {!hasCamera && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                Camera not available. Please ensure you have a camera connected and have granted camera permissions.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Position the barcode within the red frame for automatic scanning, or enter manually above.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default BarcodeScanner; 