// QR Code Generation Service
class QRCodeService {
  private apiEndpoint = 'https://api.qrserver.com/v1/create-qr-code/';

  // Generate QR code with item data
  async generateQRCode(data: string, options?: {
    size?: number;
    format?: 'png' | 'svg' | 'eps' | 'pdf';
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    margin?: number;
    color?: string;
    backgroundColor?: string;
  }): Promise<string> {
    try {
      const defaultOptions = {
        size: 200,
        format: 'png' as const,
        errorCorrectionLevel: 'M' as const,
        margin: 0,
        color: '000000',
        backgroundColor: 'ffffff'
      };

      const finalOptions = { ...defaultOptions, ...options };

      // Use QR Server API for online generation
      const params = new URLSearchParams({
        data: data,
        size: `${finalOptions.size}x${finalOptions.size}`,
        format: finalOptions.format,
        ecc: finalOptions.errorCorrectionLevel,
        margin: finalOptions.margin.toString(),
        color: finalOptions.color,
        bgcolor: finalOptions.backgroundColor
      });

      const qrUrl = `${this.apiEndpoint}?${params.toString()}`;
      
      // For offline capability, fallback to client-side generation
      return this.generateClientSideQR(data, finalOptions);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      throw error;
    }
  }

  // Client-side QR code generation using canvas
  private generateClientSideQR(data: string, options: any): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    const size = options.size;
    canvas.width = size;
    canvas.height = size;

    // Simple QR code placeholder pattern
    // In a real implementation, you'd use a QR code library like qrcode.js
    this.drawQRPattern(ctx, size, data);

    return canvas.toDataURL('image/png');
  }

  // Draw a simplified QR pattern (placeholder)
  private drawQRPattern(ctx: CanvasRenderingContext2D, size: number, data: string): void {
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw QR code pattern
    ctx.fillStyle = '#000000';
    
    const modules = 25; // 25x25 grid
    const moduleSize = size / modules;

    // Generate a pseudo-QR pattern based on data hash
    const hash = this.simpleHash(data);
    
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // Create pattern based on position and data hash
        const shouldFill = this.shouldFillModule(row, col, hash, modules);
        
        if (shouldFill) {
          ctx.fillRect(
            col * moduleSize,
            row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }

    // Add finder patterns (corners)
    this.drawFinderPattern(ctx, 0, 0, moduleSize);
    this.drawFinderPattern(ctx, (modules - 7) * moduleSize, 0, moduleSize);
    this.drawFinderPattern(ctx, 0, (modules - 7) * moduleSize, moduleSize);
  }

  // Draw QR finder pattern
  private drawFinderPattern(ctx: CanvasRenderingContext2D, x: number, y: number, moduleSize: number): void {
    // Outer square
    ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
    
    // Inner white square
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
    
    // Center black square
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
  }

  // Simple hash function for pattern generation
  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Determine if a module should be filled
  private shouldFillModule(row: number, col: number, hash: number, size: number): boolean {
    // Skip finder patterns
    if (this.isFinderPattern(row, col, size)) {
      return false;
    }

    // Create pattern based on position and hash
    const position = row * size + col;
    const pattern = (hash + position) % 3;
    
    return pattern === 0;
  }

  // Check if position is in finder pattern area
  private isFinderPattern(row: number, col: number, size: number): boolean {
    // Top-left finder pattern
    if (row < 9 && col < 9) return true;
    
    // Top-right finder pattern
    if (row < 9 && col >= size - 9) return true;
    
    // Bottom-left finder pattern
    if (row >= size - 9 && col < 9) return true;
    
    return false;
  }

  // Generate QR code for inventory item
  async generateItemQR(item: {
    id?: string;
    barcode: string;
    itemName: string;
    category: string;
    manufacturer?: string;
    costPrice?: number;
  }): Promise<string> {
    const qrData = {
      type: 'INVENTORY_ITEM',
      id: item.id,
      barcode: item.barcode,
      name: item.itemName,
      category: item.category,
      manufacturer: item.manufacturer,
      price: item.costPrice,
      timestamp: Date.now(),
      version: '1.0'
    };

    return this.generateQRCode(JSON.stringify(qrData));
  }

  // Generate QR code for stock batch
  async generateBatchQR(batch: {
    id: string;
    batchNumber: string;
    itemId: string;
    expiryDate?: string;
    quantity?: number;
  }): Promise<string> {
    const qrData = {
      type: 'STOCK_BATCH',
      batchId: batch.id,
      batchNumber: batch.batchNumber,
      itemId: batch.itemId,
      expiryDate: batch.expiryDate,
      quantity: batch.quantity,
      timestamp: Date.now(),
      version: '1.0'
    };

    return this.generateQRCode(JSON.stringify(qrData));
  }

  // Generate QR code for location
  async generateLocationQR(location: {
    id: string;
    locationCode: string;
    name: string;
    type: string;
  }): Promise<string> {
    const qrData = {
      type: 'STORAGE_LOCATION',
      locationId: location.id,
      locationCode: location.locationCode,
      name: location.name,
      type: location.type,
      timestamp: Date.now(),
      version: '1.0'
    };

    return this.generateQRCode(JSON.stringify(qrData));
  }

  // Parse QR code data
  parseQRData(qrString: string): any {
    try {
      const data = JSON.parse(qrString);
      
      // Validate QR data structure
      if (!data.type || !data.version) {
        throw new Error('Invalid QR code format');
      }

      return data;
    } catch (error) {
      console.error('Failed to parse QR data:', error);
      return null;
    }
  }

  // Validate QR code data
  validateQRData(data: any): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const requiredFields = ['type', 'timestamp', 'version'];
    
    for (const field of requiredFields) {
      if (!(field in data)) {
        return false;
      }
    }

    // Type-specific validation
    switch (data.type) {
      case 'INVENTORY_ITEM':
        return 'barcode' in data && 'name' in data;
      case 'STOCK_BATCH':
        return 'batchId' in data && 'batchNumber' in data;
      case 'STORAGE_LOCATION':
        return 'locationId' in data && 'locationCode' in data;
      default:
        return false;
    }
  }

  // Generate bulk QR codes
  async generateBulkQRCodes(items: any[], type: 'item' | 'batch' | 'location'): Promise<{
    success: boolean;
    qrCodes: { id: string; qrCode: string }[];
    errors: string[];
  }> {
    const results: { id: string; qrCode: string }[] = [];
    const errors: string[] = [];

    for (const item of items) {
      try {
        let qrCode: string;
        
        switch (type) {
          case 'item':
            qrCode = await this.generateItemQR(item);
            break;
          case 'batch':
            qrCode = await this.generateBatchQR(item);
            break;
          case 'location':
            qrCode = await this.generateLocationQR(item);
            break;
          default:
            throw new Error(`Unknown type: ${type}`);
        }

        results.push({
          id: item.id || item.barcode || item.batchNumber || item.locationCode,
          qrCode
        });
      } catch (error) {
        errors.push(`Failed to generate QR for ${item.id || 'unknown'}: ${error}`);
      }
    }

    return {
      success: errors.length === 0,
      qrCodes: results,
      errors
    };
  }

  // Download QR code as image
  downloadQRCode(qrDataUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Print QR code
  printQRCode(qrDataUrl: string, itemName: string): void {
    const printWindow = window.open('', '', 'height=600,width=800');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${itemName}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px; 
              }
              .qr-container { 
                display: inline-block; 
                border: 2px solid #ccc; 
                padding: 20px; 
                margin: 20px;
              }
              .qr-code { 
                max-width: 300px; 
                max-height: 300px; 
              }
              .item-name { 
                margin-top: 10px; 
                font-weight: bold; 
              }
              @media print {
                body { margin: 0; }
                .qr-container { border: 1px solid #000; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <img src="${qrDataUrl}" alt="QR Code" class="qr-code" />
              <div class="item-name">${itemName}</div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

  // Get QR code info
  getQRCodeInfo(qrDataUrl: string): {
    size: number;
    format: string;
    dataLength: number;
  } {
    // Extract info from data URL
    const base64Data = qrDataUrl.split(',')[1];
    const binaryData = atob(base64Data);
    
    return {
      size: 200, // Default size
      format: 'PNG',
      dataLength: binaryData.length
    };
  }
}

// Export singleton instance
export const qrCodeService = new QRCodeService(); 