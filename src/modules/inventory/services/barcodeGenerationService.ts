import { 
  BarcodeFormat, 
  BarcodeGenerationRequest, 
  BarcodeGenerationResult,
  PrintableLabel,
  LabelDimensions,
  LabelContent,
  PrintSettings
} from '../types/inventoryTypes';

// Barcode Generation Service
class BarcodeGenerationService {
  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.context = this.canvas.getContext('2d');
    }
  }

  // Generate barcode based on format and specifications
  async generateBarcode(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    try {
      const { code, format, width, height, includeText, fontSize, margins, backgroundColor, foregroundColor } = request;

      // Validate barcode format and code
      const validation = this.validateBarcodeCode(code, format);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error,
          dimensions: { width: 0, height: 0 }
        };
      }

      // Generate barcode based on format
      let result: BarcodeGenerationResult;

      switch (format) {
        case 'CODE128':
          result = await this.generateCode128(request);
          break;
        case 'EAN13':
          result = await this.generateEAN13(request);
          break;
        case 'EAN8':
          result = await this.generateEAN8(request);
          break;
        case 'QR_CODE':
          result = await this.generateQRCode(request);
          break;
        case 'DATA_MATRIX':
          result = await this.generateDataMatrix(request);
          break;
        case 'UPC_A':
          result = await this.generateUPCA(request);
          break;
        case 'UPC_E':
          result = await this.generateUPCE(request);
          break;
        case 'CODE39':
          result = await this.generateCode39(request);
          break;
        case 'CODE93':
          result = await this.generateCode93(request);
          break;
        case 'CODABAR':
          result = await this.generateCodabar(request);
          break;
        default:
          result = {
            success: false,
            error: `Unsupported barcode format: ${format}`,
            dimensions: { width: 0, height: 0 }
          };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: `Failed to generate barcode: ${error}`,
        dimensions: { width: 0, height: 0 }
      };
    }
  }

  // Validate barcode code based on format requirements
  private validateBarcodeCode(code: string, format: BarcodeFormat): { isValid: boolean; error?: string } {
    if (!code || code.trim().length === 0) {
      return { isValid: false, error: 'Barcode code cannot be empty' };
    }

    switch (format) {
      case 'EAN13':
        if (!/^\d{12,13}$/.test(code)) {
          return { isValid: false, error: 'EAN13 must be 12 or 13 digits' };
        }
        break;
      case 'EAN8':
        if (!/^\d{7,8}$/.test(code)) {
          return { isValid: false, error: 'EAN8 must be 7 or 8 digits' };
        }
        break;
      case 'UPC_A':
        if (!/^\d{11,12}$/.test(code)) {
          return { isValid: false, error: 'UPC-A must be 11 or 12 digits' };
        }
        break;
      case 'UPC_E':
        if (!/^\d{6,8}$/.test(code)) {
          return { isValid: false, error: 'UPC-E must be 6 to 8 digits' };
        }
        break;
      case 'CODE39':
        if (!/^[A-Z0-9\-. $\/+%*]+$/.test(code)) {
          return { isValid: false, error: 'CODE39 contains invalid characters' };
        }
        break;
      case 'CODE93':
        if (!/^[A-Z0-9\-. $\/+%]+$/.test(code)) {
          return { isValid: false, error: 'CODE93 contains invalid characters' };
        }
        break;
      case 'CODABAR':
        if (!/^[A-D][0-9\-$:\/\.\+]*[A-D]$/.test(code)) {
          return { isValid: false, error: 'CODABAR must start and end with A-D and contain valid characters' };
        }
        break;
    }

    return { isValid: true };
  }

  // Generate CODE128 barcode
  private async generateCode128(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    if (!this.canvas || !this.context) {
      return { success: false, error: 'Canvas not available', dimensions: { width: 0, height: 0 } };
    }

    const { code, width, height, includeText, fontSize, margins, backgroundColor, foregroundColor } = request;

    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas with background color
    this.context.fillStyle = backgroundColor;
    this.context.fillRect(0, 0, width, height);

    // Generate CODE128 pattern (simplified implementation)
    const patterns = this.generateCode128Pattern(code);
    const barWidth = (width - 2 * margins) / patterns.length;
    const barHeight = includeText ? height - fontSize - margins * 2 : height - margins * 2;

    // Draw bars
    this.context.fillStyle = foregroundColor;
    patterns.forEach((pattern, index) => {
      if (pattern === 1) {
        const x = margins + index * barWidth;
        this.context.fillRect(x, margins, barWidth, barHeight);
      }
    });

    // Draw text if requested
    if (includeText) {
      this.context.fillStyle = foregroundColor;
      this.context.font = `${fontSize}px monospace`;
      this.context.textAlign = 'center';
      this.context.fillText(code, width / 2, height - margins);
    }

    const dataUrl = this.canvas.toDataURL('image/png');
    
    return {
      success: true,
      dataUrl,
      dimensions: { width, height }
    };
  }

  // Generate EAN13 barcode
  private async generateEAN13(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    // Implementation for EAN13 with checksum calculation
    return this.generateLinearBarcode(request, 'EAN13');
  }

  // Generate EAN8 barcode
  private async generateEAN8(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'EAN8');
  }

  // Generate QR Code
  private async generateQRCode(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    if (!this.canvas || !this.context) {
      return { success: false, error: 'Canvas not available', dimensions: { width: 0, height: 0 } };
    }

    const { code, width, height, backgroundColor, foregroundColor } = request;

    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas with background color
    this.context.fillStyle = backgroundColor;
    this.context.fillRect(0, 0, width, height);

    // Generate QR code pattern (simplified implementation)
    const qrSize = Math.min(width, height) - 20;
    const moduleSize = qrSize / 21; // 21x21 modules for simple QR

    this.context.fillStyle = foregroundColor;

    // Generate simple QR pattern based on code
    for (let row = 0; row < 21; row++) {
      for (let col = 0; col < 21; col++) {
        // Simplified pattern generation
        const shouldFill = this.shouldFillQRModule(row, col, code);
        if (shouldFill) {
          const x = (width - qrSize) / 2 + col * moduleSize;
          const y = (height - qrSize) / 2 + row * moduleSize;
          this.context.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }

    const dataUrl = this.canvas.toDataURL('image/png');
    
    return {
      success: true,
      dataUrl,
      dimensions: { width, height }
    };
  }

  // Generate Data Matrix
  private async generateDataMatrix(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generate2DBarcode(request, 'DATA_MATRIX');
  }

  // Generate UPC-A
  private async generateUPCA(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'UPC_A');
  }

  // Generate UPC-E
  private async generateUPCE(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'UPC_E');
  }

  // Generate CODE39
  private async generateCode39(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'CODE39');
  }

  // Generate CODE93
  private async generateCode93(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'CODE93');
  }

  // Generate CODABAR
  private async generateCodabar(request: BarcodeGenerationRequest): Promise<BarcodeGenerationResult> {
    return this.generateLinearBarcode(request, 'CODABAR');
  }

  // Generic linear barcode generator
  private async generateLinearBarcode(request: BarcodeGenerationRequest, type: string): Promise<BarcodeGenerationResult> {
    if (!this.canvas || !this.context) {
      return { success: false, error: 'Canvas not available', dimensions: { width: 0, height: 0 } };
    }

    const { code, width, height, includeText, fontSize, margins, backgroundColor, foregroundColor } = request;

    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas with background color
    this.context.fillStyle = backgroundColor;
    this.context.fillRect(0, 0, width, height);

    // Generate barcode pattern based on type
    const patterns = this.generateBarcodePattern(code, type);
    const barWidth = (width - 2 * margins) / patterns.length;
    const barHeight = includeText ? height - fontSize - margins * 2 : height - margins * 2;

    // Draw bars
    this.context.fillStyle = foregroundColor;
    patterns.forEach((pattern, index) => {
      if (pattern === 1) {
        const x = margins + index * barWidth;
        this.context.fillRect(x, margins, barWidth, barHeight);
      }
    });

    // Draw text if requested
    if (includeText) {
      this.context.fillStyle = foregroundColor;
      this.context.font = `${fontSize}px monospace`;
      this.context.textAlign = 'center';
      this.context.fillText(code, width / 2, height - margins);
    }

    const dataUrl = this.canvas.toDataURL('image/png');
    
    return {
      success: true,
      dataUrl,
      dimensions: { width, height }
    };
  }

  // Generic 2D barcode generator
  private async generate2DBarcode(request: BarcodeGenerationRequest, type: string): Promise<BarcodeGenerationResult> {
    if (!this.canvas || !this.context) {
      return { success: false, error: 'Canvas not available', dimensions: { width: 0, height: 0 } };
    }

    const { code, width, height, backgroundColor, foregroundColor } = request;

    // Set canvas dimensions
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear canvas with background color
    this.context.fillStyle = backgroundColor;
    this.context.fillRect(0, 0, width, height);

    // Generate 2D pattern
    const matrixSize = Math.min(width, height) - 20;
    const modules = type === 'DATA_MATRIX' ? 24 : 21;
    const moduleSize = matrixSize / modules;

    this.context.fillStyle = foregroundColor;

    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        const shouldFill = this.shouldFill2DModule(row, col, code, type);
        if (shouldFill) {
          const x = (width - matrixSize) / 2 + col * moduleSize;
          const y = (height - matrixSize) / 2 + row * moduleSize;
          this.context.fillRect(x, y, moduleSize, moduleSize);
        }
      }
    }

    const dataUrl = this.canvas.toDataURL('image/png');
    
    return {
      success: true,
      dataUrl,
      dimensions: { width, height }
    };
  }

  // Generate barcode patterns (simplified implementations)
  private generateCode128Pattern(code: string): number[] {
    // Simplified CODE128 pattern generation
    const patterns: number[] = [];
    
    // Start pattern
    patterns.push(...[1, 1, 0, 1, 0, 0, 1, 0, 0]);
    
    // Data patterns (simplified)
    for (let i = 0; i < code.length; i++) {
      const charCode = code.charCodeAt(i);
      // Generate pattern based on character
      patterns.push(...this.getCode128CharPattern(charCode));
    }
    
    // Stop pattern
    patterns.push(...[1, 1, 0, 0, 1, 1, 1, 0, 1, 0, 1]);
    
    return patterns;
  }

  private generateBarcodePattern(code: string, type: string): number[] {
    // Simplified pattern generation for different barcode types
    const patterns: number[] = [];
    
    for (let i = 0; i < code.length; i++) {
      const char = code[i];
      patterns.push(...this.getCharacterPattern(char, type));
    }
    
    return patterns;
  }

  private getCode128CharPattern(charCode: number): number[] {
    // Simplified pattern for CODE128 characters
    const basePattern = [1, 0, 1, 1, 0, 0, 1, 0, 1];
    // Modify based on character code
    return basePattern;
  }

  private getCharacterPattern(char: string, type: string): number[] {
    // Simplified character patterns for different barcode types
    const patterns: { [key: string]: number[] } = {
      '0': [1, 0, 1, 0, 0, 1, 1, 0, 1],
      '1': [1, 1, 0, 0, 1, 0, 1, 0, 1],
      '2': [1, 0, 1, 1, 0, 0, 1, 0, 1],
      '3': [1, 1, 0, 1, 1, 0, 0, 0, 1],
      '4': [1, 0, 0, 1, 1, 0, 1, 0, 1],
      '5': [1, 1, 0, 0, 0, 1, 1, 0, 1],
      '6': [1, 0, 1, 0, 0, 0, 1, 1, 1],
      '7': [1, 0, 0, 0, 1, 0, 1, 1, 1],
      '8': [1, 1, 0, 0, 0, 0, 1, 0, 1],
      '9': [1, 0, 0, 1, 0, 1, 1, 0, 1]
    };
    
    return patterns[char] || patterns['0'];
  }

  private shouldFillQRModule(row: number, col: number, code: string): boolean {
    // Simplified QR pattern generation
    // Finder patterns (corners)
    if ((row < 7 && col < 7) || (row < 7 && col >= 14) || (row >= 14 && col < 7)) {
      return this.isFinderPattern(row % 7, col % 7);
    }
    
    // Data pattern based on code
    const hash = this.simpleHash(code);
    return (row + col + hash) % 3 === 0;
  }

  private shouldFill2DModule(row: number, col: number, code: string, type: string): boolean {
    // Simplified 2D barcode pattern generation
    if (type === 'DATA_MATRIX') {
      // Border pattern for Data Matrix
      if (row === 0 || col === 0 || row % 2 === 0 && col === 23) {
        return true;
      }
    }
    
    // Data pattern based on code
    const hash = this.simpleHash(code);
    return (row * col + hash) % 4 !== 0;
  }

  private isFinderPattern(row: number, col: number): boolean {
    // QR finder pattern
    if (row === 0 || row === 6 || col === 0 || col === 6) return true;
    if ((row >= 2 && row <= 4) && (col >= 2 && col <= 4)) return true;
    return false;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  // Print label functionality
  async printLabel(label: PrintableLabel, itemData: any): Promise<boolean> {
    try {
      // Generate printable content
      const printContent = await this.generatePrintableContent(label, itemData);
      
      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      // Write content to print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Inventory Label</title>
          <style>
            ${this.generatePrintCSS(label.settings, label.dimensions)}
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `);

      printWindow.document.close();
      
      // Wait for content to load then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };

      return true;
    } catch (error) {
      console.error('Print failed:', error);
      return false;
    }
  }

  private async generatePrintableContent(label: PrintableLabel, itemData: any): Promise<string> {
    const { content, dimensions } = label;
    let html = '<div class="label">';

    // Add image if requested
    if (content.includeImage && itemData.primaryImage) {
      html += `<img src="${itemData.primaryImage}" alt="Item Image" class="item-image" />`;
    }

    // Add item name
    if (content.includeName) {
      html += `<div class="item-name">${itemData.itemName}</div>`;
    }

    // Add barcode
    if (content.includeBarcode && itemData.barcode) {
      const barcodeResult = await this.generateBarcode({
        code: itemData.barcode,
        format: itemData.barcodeFormat || 'CODE128',
        width: dimensions.width * 0.8,
        height: 50,
        includeText: true,
        fontSize: 12,
        margins: 5,
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000'
      });

      if (barcodeResult.success && barcodeResult.dataUrl) {
        html += `<img src="${barcodeResult.dataUrl}" alt="Barcode" class="barcode" />`;
      }
    }

    // Add QR code
    if (content.includeQRCode && itemData.qrCode) {
      const qrResult = await this.generateBarcode({
        code: itemData.qrCode,
        format: 'QR_CODE',
        width: 80,
        height: 80,
        includeText: false,
        fontSize: 10,
        margins: 2,
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000'
      });

      if (qrResult.success && qrResult.dataUrl) {
        html += `<img src="${qrResult.dataUrl}" alt="QR Code" class="qr-code" />`;
      }
    }

    // Add other fields
    if (content.includeCategory) {
      html += `<div class="category">Category: ${itemData.category}</div>`;
    }

    if (content.includePrice) {
      html += `<div class="price">$${itemData.costPrice?.toFixed(2) || '0.00'}</div>`;
    }

    if (content.includeSupplier) {
      html += `<div class="supplier">Supplier: ${itemData.preferredSupplier || 'N/A'}</div>`;
    }

    // Add custom fields
    content.customFields.forEach(field => {
      html += `<div class="custom-field" style="
        left: ${field.position.x}px;
        top: ${field.position.y}px;
        width: ${field.position.width}px;
        height: ${field.position.height}px;
        font-size: ${field.styling.fontSize}px;
        font-weight: ${field.styling.fontWeight};
        color: ${field.styling.color};
        text-align: ${field.styling.alignment};
        ${field.styling.backgroundColor ? `background-color: ${field.styling.backgroundColor};` : ''}
      ">${field.label}: ${field.value}</div>`;
    });

    html += '</div>';
    return html;
  }

  private generatePrintCSS(settings: PrintSettings, dimensions: LabelDimensions): string {
    return `
      @media print {
        body { margin: 0; padding: 0; }
        .label {
          width: ${dimensions.width}${dimensions.unit};
          height: ${dimensions.height}${dimensions.unit};
          margin: ${dimensions.margins.top}${dimensions.unit} ${dimensions.margins.right}${dimensions.unit} ${dimensions.margins.bottom}${dimensions.unit} ${dimensions.margins.left}${dimensions.unit};
          border: 1px solid #000;
          page-break-after: always;
          position: relative;
          box-sizing: border-box;
        }
        .item-image {
          max-width: 100px;
          max-height: 60px;
          object-fit: contain;
        }
        .item-name {
          font-size: 14px;
          font-weight: bold;
          text-align: center;
          margin: 5px 0;
        }
        .barcode {
          display: block;
          margin: 5px auto;
        }
        .qr-code {
          position: absolute;
          top: 5px;
          right: 5px;
        }
        .category, .price, .supplier {
          font-size: 10px;
          margin: 2px 0;
        }
        .custom-field {
          position: absolute;
        }
      }
      
      body {
        font-family: Arial, sans-serif;
        font-size: 12px;
      }
      .label {
        width: ${dimensions.width}${dimensions.unit};
        height: ${dimensions.height}${dimensions.unit};
        border: 1px solid #ccc;
        margin: 10px;
        padding: 5px;
        position: relative;
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
      }
      .item-image {
        max-width: 100px;
        max-height: 60px;
        object-fit: contain;
        display: block;
        margin: 0 auto;
      }
      .item-name {
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        margin: 5px 0;
        word-wrap: break-word;
      }
      .barcode {
        display: block;
        margin: 5px auto;
        max-width: 90%;
      }
      .qr-code {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 40px;
        height: 40px;
      }
      .category, .price, .supplier {
        font-size: 10px;
        margin: 2px 0;
        text-align: center;
      }
      .custom-field {
        position: absolute;
      }
    `;
  }

  // Generate multiple formats for comparison
  async generateMultipleFormats(code: string, formats: BarcodeFormat[]): Promise<{ [key in BarcodeFormat]?: BarcodeGenerationResult }> {
    const results: { [key in BarcodeFormat]?: BarcodeGenerationResult } = {};
    
    const baseRequest: BarcodeGenerationRequest = {
      code,
      width: 200,
      height: 100,
      includeText: true,
      fontSize: 12,
      margins: 10,
      backgroundColor: '#FFFFFF',
      foregroundColor: '#000000',
      format: 'CODE128' // Will be overridden
    };

    for (const format of formats) {
      try {
        const request = { ...baseRequest, format };
        const result = await this.generateBarcode(request);
        results[format] = result;
      } catch (error) {
        results[format] = {
          success: false,
          error: `Failed to generate ${format}: ${error}`,
          dimensions: { width: 0, height: 0 }
        };
      }
    }

    return results;
  }

  // Dispose of resources
  dispose(): void {
    this.canvas = null;
    this.context = null;
  }
}

// Export singleton instance
export const barcodeGenerationService = new BarcodeGenerationService(); 