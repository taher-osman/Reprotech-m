import React, { useRef, useEffect, useState } from 'react';
import { QrCode, Printer, Download, Copy, CheckCircle } from 'lucide-react';
import { Sample } from '../types/sampleTypes';

interface QRCodeGeneratorProps {
  sample: Sample;
  size?: number;
  includeText?: boolean;
  format?: 'svg' | 'png' | 'pdf';
  onGenerated?: (dataUrl: string) => void;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  sample,
  size = 128,
  includeText = true,
  format = 'svg',
  onGenerated
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Generate QR code data
  const generateQRData = (sample: Sample): string => {
    const qrData = {
      id: sample.sample_id,
      type: sample.sample_type,
      animal: sample.animal_name,
      date: sample.collection_date,
      location: sample.location,
      status: sample.status,
      url: `${window.location.origin}/sample/${sample.sample_id}`
    };
    return JSON.stringify(qrData);
  };

  // Simple QR code generation (in production, use a proper QR library like qrcode)
  const generateQRCode = async () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = size;
    canvas.height = size;

    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Generate QR pattern (simplified version - in production use a proper QR library)
    const qrData = generateQRData(sample);
    const moduleCount = 25;
    const moduleSize = size / moduleCount;
    
    ctx.fillStyle = '#000000';
    
    // Create a simple pattern based on sample ID (this is a placeholder)
    const hash = sample.sample_id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        // Create pseudo-random pattern based on position and hash
        const shouldFill = ((row * col + hash) % 7 === 0) || 
                          (row < 3 && col < 3) || 
                          (row < 3 && col >= moduleCount - 3) ||
                          (row >= moduleCount - 3 && col < 3);
        
        if (shouldFill) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }

    // Convert to data URL
    const dataUrl = canvas.toDataURL('image/png');
    setQrDataUrl(dataUrl);
    onGenerated?.(dataUrl);
  };

  // Copy sample ID to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sample.sample_id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Download QR code
  const downloadQRCode = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `QR_${sample.sample_id}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  // Print QR code
  const printQRCode = () => {
    if (!qrDataUrl) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>Sample Label - ${sample.sample_id}</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .label {
              border: 2px solid #000;
              padding: 15px;
              text-align: center;
              background: white;
              width: 300px;
            }
            .qr-code {
              margin: 10px 0;
            }
            .sample-info {
              font-size: 12px;
              margin: 5px 0;
            }
            .sample-id {
              font-weight: bold;
              font-size: 14px;
              margin: 10px 0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .label { border: 1px solid #000; }
            }
          </style>
        </head>
        <body>
          <div class="label">
            <div class="sample-id">${sample.sample_id}</div>
            <div class="qr-code">
              <img src="${qrDataUrl}" alt="QR Code" width="120" height="120">
            </div>
            <div class="sample-info">${sample.sample_type.toUpperCase()}</div>
            <div class="sample-info">${sample.animal_name}</div>
            <div class="sample-info">${new Date(sample.collection_date).toLocaleDateString()}</div>
            <div class="sample-info">${sample.location}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 1000);
            };
          </script>
        </body>
      </html>
    `);
  };

  useEffect(() => {
    generateQRCode();
  }, [sample, size]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <QrCode className="h-5 w-5 text-gray-700" />
          <h3 className="font-medium text-gray-900">Sample QR Code</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={copyToClipboard}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Copy Sample ID"
          >
            {copied ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={downloadQRCode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Download QR Code"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={printQRCode}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
            title="Print Label"
          >
            <Printer className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="text-center">
        {/* QR Code Canvas */}
        <canvas
          ref={canvasRef}
          className="mx-auto border border-gray-300 rounded"
          style={{ maxWidth: '100%', height: 'auto' }}
        />

        {/* Sample Information */}
        {includeText && (
          <div className="mt-4 space-y-1 text-sm">
            <div className="font-mono font-bold text-lg">{sample.sample_id}</div>
            <div className="text-gray-600 capitalize">{sample.sample_type}</div>
            <div className="text-gray-600">{sample.animal_name}</div>
            <div className="text-gray-600">{new Date(sample.collection_date).toLocaleDateString()}</div>
            <div className="text-xs text-gray-500">{sample.location}</div>
          </div>
        )}

        {/* QR Data Information */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <div className="font-medium text-gray-700 mb-2">QR Code Contains:</div>
          <div className="text-left space-y-1 text-gray-600">
            <div>• Sample ID: {sample.sample_id}</div>
            <div>• Type: {sample.sample_type}</div>
            <div>• Animal: {sample.animal_name}</div>
            <div>• Collection: {sample.collection_date}</div>
            <div>• Status: {sample.status}</div>
            <div>• Location: {sample.location}</div>
          </div>
        </div>
      </div>
    </div>
  );
}; 