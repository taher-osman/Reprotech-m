import { 
  PrintableLabel, 
  LabelDimensions, 
  LabelContent, 
  PrintSettings,
  CustomField,
  BarcodeGenerationRequest,
  InventoryItem
} from '../types/inventoryTypes';
import { barcodeGenerationService } from './barcodeGenerationService';
import { imageManagementService } from './imageManagementService';

// Printable Label Service
class PrintableLabelService {
  private standardTemplates: { [key: string]: PrintableLabel } = {};

  constructor() {
    this.initializeStandardTemplates();
  }

  // Initialize standard label templates
  private initializeStandardTemplates(): void {
    // Standard 2" x 1" label
    this.standardTemplates.standard_2x1 = {
      id: 'std_2x1',
      itemId: '',
      templateType: 'STANDARD',
      dimensions: {
        width: 50.8,
        height: 25.4,
        unit: 'mm',
        margins: { top: 2, right: 2, bottom: 2, left: 2 }
      },
      content: {
        includeImage: false,
        includeBarcode: true,
        includeQRCode: true,
        includeName: true,
        includeCategory: false,
        includePrice: true,
        includeExpiry: false,
        includeSupplier: false,
        customFields: [],
        layout: 'HORIZONTAL'
      },
      settings: {
        copies: 1,
        paperSize: 'Label_2x1',
        orientation: 'landscape',
        quality: 'high',
        colorMode: 'monochrome',
        labelsPerPage: 30,
        spacing: { horizontal: 2, vertical: 1 }
      }
    };

    // Compact label
    this.standardTemplates.compact = {
      id: 'compact',
      itemId: '',
      templateType: 'COMPACT',
      dimensions: {
        width: 40,
        height: 20,
        unit: 'mm',
        margins: { top: 1, right: 1, bottom: 1, left: 1 }
      },
      content: {
        includeImage: false,
        includeBarcode: true,
        includeQRCode: false,
        includeName: true,
        includeCategory: false,
        includePrice: false,
        includeExpiry: false,
        includeSupplier: false,
        customFields: [],
        layout: 'VERTICAL'
      },
      settings: {
        copies: 1,
        paperSize: 'Label_2x1',
        orientation: 'portrait',
        quality: 'normal',
        colorMode: 'monochrome',
        labelsPerPage: 40,
        spacing: { horizontal: 1, vertical: 1 }
      }
    };

    // Detailed label with image
    this.standardTemplates.detailed = {
      id: 'detailed',
      itemId: '',
      templateType: 'DETAILED',
      dimensions: {
        width: 101.6,
        height: 50.8,
        unit: 'mm',
        margins: { top: 3, right: 3, bottom: 3, left: 3 }
      },
      content: {
        includeImage: true,
        includeBarcode: true,
        includeQRCode: true,
        includeName: true,
        includeCategory: true,
        includePrice: true,
        includeExpiry: true,
        includeSupplier: true,
        customFields: [],
        layout: 'GRID'
      },
      settings: {
        copies: 1,
        paperSize: 'Label_4x2',
        orientation: 'landscape',
        quality: 'high',
        colorMode: 'color',
        labelsPerPage: 10,
        spacing: { horizontal: 3, vertical: 3 }
      }
    };
  }

  // Get available templates
  getAvailableTemplates(): PrintableLabel[] {
    return Object.values(this.standardTemplates);
  }

  // Get template by ID
  getTemplate(templateId: string): PrintableLabel | null {
    return this.standardTemplates[templateId] || null;
  }

  // Create custom template
  createCustomTemplate(template: Omit<PrintableLabel, 'id'>): PrintableLabel {
    const customTemplate: PrintableLabel = {
      ...template,
      id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
    };

    this.standardTemplates[customTemplate.id] = customTemplate;
    return customTemplate;
  }

  // Generate single label
  async generateLabel(
    template: PrintableLabel, 
    item: InventoryItem, 
    customData?: { [key: string]: any }
  ): Promise<string> {
    try {
      const labelHtml = await this.createLabelHTML(template, item, customData);
      return labelHtml;
    } catch (error) {
      throw new Error(`Failed to generate label: ${error}`);
    }
  }

  // Generate multiple labels
  async generateBatchLabels(
    template: PrintableLabel,
    items: InventoryItem[],
    customData?: { [key: string]: any }[]
  ): Promise<string> {
    try {
      const labels: string[] = [];

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const itemCustomData = customData?.[i] || {};
        const labelHtml = await this.createLabelHTML(template, item, itemCustomData);
        labels.push(labelHtml);
      }

      return this.createBatchHTML(labels, template);
    } catch (error) {
      throw new Error(`Failed to generate batch labels: ${error}`);
    }
  }

  // Create label HTML
  private async createLabelHTML(
    template: PrintableLabel,
    item: InventoryItem,
    customData?: { [key: string]: any }
  ): Promise<string> {
    const { dimensions, content, settings } = template;
    
    let html = `<div class="label" style="
      width: ${dimensions.width}${dimensions.unit};
      height: ${dimensions.height}${dimensions.unit};
      margin: ${dimensions.margins.top}${dimensions.unit} ${dimensions.margins.right}${dimensions.unit} ${dimensions.margins.bottom}${dimensions.unit} ${dimensions.margins.left}${dimensions.unit};
      border: 1px solid #000;
      position: relative;
      box-sizing: border-box;
      page-break-after: always;
      background: white;
      font-family: Arial, sans-serif;
      display: ${content.layout === 'GRID' ? 'grid' : 'flex'};
      ${content.layout === 'HORIZONTAL' ? 'flex-direction: row;' : ''}
      ${content.layout === 'VERTICAL' ? 'flex-direction: column;' : ''}
      ${content.layout === 'GRID' ? 'grid-template-columns: 1fr 1fr; grid-gap: 2px;' : ''}
      align-items: center;
      justify-content: center;
      padding: 2px;
    ">`;

    // Add image if requested and available
    if (content.includeImage && item.images.length > 0) {
      const primaryImage = item.images.find(img => img.isPrimary) || item.images[0];
      html += `<div class="image-container" style="
        ${content.layout === 'GRID' ? 'grid-column: 1; grid-row: 1;' : ''}
        flex: ${content.layout === 'HORIZONTAL' ? '0 0 30%' : '0 0 40px'};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img src="${imageManagementService.getImageUrl(primaryImage, 'thumbnail')}" 
             alt="Item Image" 
             style="max-width: 100%; max-height: 100%; object-fit: contain;" />
      </div>`;
    }

    // Add item name
    if (content.includeName) {
      html += `<div class="item-name" style="
        ${content.layout === 'GRID' ? 'grid-column: 2; grid-row: 1;' : ''}
        flex: 1;
        font-size: ${dimensions.height < 30 ? '8' : '10'}px;
        font-weight: bold;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.2;
      ">${item.itemName}</div>`;
    }

    // Add category
    if (content.includeCategory) {
      html += `<div class="category" style="
        font-size: ${dimensions.height < 30 ? '6' : '8'}px;
        text-align: center;
        color: #666;
        margin: 1px 0;
      ">${item.category}</div>`;
    }

    // Add barcode
    if (content.includeBarcode && item.barcode) {
      const barcodeRequest: BarcodeGenerationRequest = {
        code: item.barcode,
        format: item.barcodeFormat || 'CODE128',
        width: Math.min(dimensions.width * 0.8, 150),
        height: Math.min(dimensions.height * 0.3, 30),
        includeText: dimensions.height > 25,
        fontSize: 8,
        margins: 1,
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000'
      };

      const barcodeResult = await barcodeGenerationService.generateBarcode(barcodeRequest);
      if (barcodeResult.success && barcodeResult.dataUrl) {
        html += `<div class="barcode-container" style="
          ${content.layout === 'GRID' ? 'grid-column: 1/3; grid-row: 2;' : ''}
          flex: 0 0 auto;
          display: flex;
          justify-content: center;
          margin: 2px 0;
        ">
          <img src="${barcodeResult.dataUrl}" 
               alt="Barcode" 
               style="max-width: 100%; height: auto;" />
        </div>`;
      }
    }

    // Add QR code
    if (content.includeQRCode && (item.qrCode || item.barcode)) {
      const qrRequest: BarcodeGenerationRequest = {
        code: item.qrCode || item.barcode,
        format: 'QR_CODE',
        width: Math.min(dimensions.width * 0.25, 40),
        height: Math.min(dimensions.width * 0.25, 40),
        includeText: false,
        fontSize: 8,
        margins: 1,
        backgroundColor: '#FFFFFF',
        foregroundColor: '#000000'
      };

      const qrResult = await barcodeGenerationService.generateBarcode(qrRequest);
      if (qrResult.success && qrResult.dataUrl) {
        html += `<div class="qr-code" style="
          position: absolute;
          top: 2px;
          right: 2px;
          width: ${Math.min(dimensions.width * 0.25, 40)}px;
          height: ${Math.min(dimensions.width * 0.25, 40)}px;
        ">
          <img src="${qrResult.dataUrl}" 
               alt="QR Code" 
               style="width: 100%; height: 100%;" />
        </div>`;
      }
    }

    // Add price
    if (content.includePrice) {
      html += `<div class="price" style="
        font-size: ${dimensions.height < 30 ? '7' : '9'}px;
        font-weight: bold;
        text-align: center;
        color: #333;
      ">$${item.costPrice?.toFixed(2) || '0.00'}</div>`;
    }

    // Add expiry information
    if (content.includeExpiry && customData?.expiryDate) {
      const expiryDate = new Date(customData.expiryDate);
      html += `<div class="expiry" style="
        font-size: ${dimensions.height < 30 ? '6' : '7'}px;
        text-align: center;
        color: #d32f2f;
        margin: 1px 0;
      ">Exp: ${expiryDate.toLocaleDateString()}</div>`;
    }

    // Add supplier
    if (content.includeSupplier) {
      html += `<div class="supplier" style="
        font-size: ${dimensions.height < 30 ? '6' : '7'}px;
        text-align: center;
        color: #666;
        margin: 1px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      ">${item.preferredSupplier || 'N/A'}</div>`;
    }

    // Add custom fields
    for (const field of content.customFields) {
      const value = customData?.[field.id] || field.value;
      html += `<div class="custom-field" style="
        position: absolute;
        left: ${field.position.x}px;
        top: ${field.position.y}px;
        width: ${field.position.width}px;
        height: ${field.position.height}px;
        font-size: ${field.styling.fontSize}px;
        font-weight: ${field.styling.fontWeight};
        color: ${field.styling.color};
        text-align: ${field.styling.alignment};
        ${field.styling.backgroundColor ? `background-color: ${field.styling.backgroundColor};` : ''}
        display: flex;
        align-items: center;
        justify-content: ${field.styling.alignment === 'center' ? 'center' : field.styling.alignment === 'right' ? 'flex-end' : 'flex-start'};
      ">${field.label}: ${value}</div>`;
    }

    html += '</div>';
    return html;
  }

  // Create batch HTML with multiple labels
  private createBatchHTML(labels: string[], template: PrintableLabel): string {
    const { settings } = template;
    
    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Inventory Labels - Batch Print</title>
        <style>
          ${this.generateBatchCSS(template)}
        </style>
      </head>
      <body>
        <div class="print-container">
    `;

    // Group labels by page
    const labelsPerPage = settings.labelsPerPage;
    for (let i = 0; i < labels.length; i += labelsPerPage) {
      html += '<div class="page">';
      const pageLabels = labels.slice(i, i + labelsPerPage);
      
      pageLabels.forEach(label => {
        html += label;
      });
      
      html += '</div>';
      
      if (i + labelsPerPage < labels.length) {
        html += '<div class="page-break"></div>';
      }
    }

    html += `
        </div>
      </body>
      </html>
    `;

    return html;
  }

  // Generate CSS for batch printing
  private generateBatchCSS(template: PrintableLabel): string {
    const { dimensions, settings } = template;
    
    return `
      @page {
        size: ${settings.paperSize === 'A4' ? 'A4' : settings.paperSize === 'Letter' ? 'letter' : 'auto'};
        margin: 10mm;
      }
      
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: black;
        background: white;
      }
      
      .print-container {
        width: 100%;
      }
      
      .page {
        display: grid;
        grid-template-columns: repeat(auto-fit, ${dimensions.width}${dimensions.unit});
        grid-gap: ${settings.spacing.horizontal}${dimensions.unit} ${settings.spacing.vertical}${dimensions.unit};
        justify-content: center;
        page-break-after: always;
        padding: 5mm;
      }
      
      .page:last-child {
        page-break-after: avoid;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      .label {
        width: ${dimensions.width}${dimensions.unit};
        height: ${dimensions.height}${dimensions.unit};
        border: 1px solid #000;
        position: relative;
        box-sizing: border-box;
        background: white;
        font-family: Arial, sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 2px;
        overflow: hidden;
      }
      
      .item-name {
        font-weight: bold;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        width: 100%;
      }
      
      .barcode-container {
        display: flex;
        justify-content: center;
        margin: 2px 0;
      }
      
      .qr-code {
        position: absolute;
        top: 2px;
        right: 2px;
      }
      
      .category, .price, .supplier, .expiry {
        text-align: center;
        margin: 1px 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .custom-field {
        position: absolute;
      }
      
      @media print {
        body { 
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
        }
        .page {
          page-break-after: always;
        }
        .page:last-child {
          page-break-after: avoid;
        }
      }
    `;
  }

  // Print labels
  async printLabels(
    template: PrintableLabel,
    items: InventoryItem[],
    customData?: { [key: string]: any }[]
  ): Promise<boolean> {
    try {
      const batchHtml = await this.generateBatchLabels(template, items, customData);
      
      // Create print window
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      printWindow.document.write(batchHtml);
      printWindow.document.close();
      
      // Wait for content to load then print
      return new Promise((resolve) => {
        printWindow.onload = () => {
          setTimeout(() => {
            printWindow.print();
            printWindow.close();
            resolve(true);
          }, 500);
        };
      });
    } catch (error) {
      console.error('Print failed:', error);
      return false;
    }
  }

  // Export labels as PDF (requires additional library in real implementation)
  async exportToPDF(
    template: PrintableLabel,
    items: InventoryItem[],
    customData?: { [key: string]: any }[]
  ): Promise<Blob | null> {
    try {
      // In a real implementation, use a library like jsPDF or Puppeteer
      const batchHtml = await this.generateBatchLabels(template, items, customData);
      
      // For now, return HTML as blob
      const blob = new Blob([batchHtml], { type: 'text/html' });
      return blob;
    } catch (error) {
      console.error('PDF export failed:', error);
      return null;
    }
  }

  // Preview labels
  async previewLabels(
    template: PrintableLabel,
    items: InventoryItem[],
    customData?: { [key: string]: any }[]
  ): Promise<string> {
    try {
      // Generate preview with limited items (max 10 for preview)
      const previewItems = items.slice(0, 10);
      const previewCustomData = customData?.slice(0, 10);
      
      const batchHtml = await this.generateBatchLabels(template, previewItems, previewCustomData);
      return batchHtml;
    } catch (error) {
      throw new Error(`Failed to generate preview: ${error}`);
    }
  }

  // Create label from template
  createLabelFromTemplate(templateId: string, itemId: string): PrintableLabel | null {
    const template = this.getTemplate(templateId);
    if (!template) {
      return null;
    }

    return {
      ...template,
      id: `label_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      itemId
    };
  }

  // Save custom template
  saveCustomTemplate(template: PrintableLabel): boolean {
    try {
      this.standardTemplates[template.id] = template;
      // In a real implementation, save to database or local storage
      localStorage.setItem(`label_template_${template.id}`, JSON.stringify(template));
      return true;
    } catch (error) {
      console.error('Failed to save template:', error);
      return false;
    }
  }

  // Load custom templates
  loadCustomTemplates(): PrintableLabel[] {
    const customTemplates: PrintableLabel[] = [];
    
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('label_template_')) {
          const templateData = localStorage.getItem(key);
          if (templateData) {
            const template = JSON.parse(templateData);
            customTemplates.push(template);
            this.standardTemplates[template.id] = template;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load custom templates:', error);
    }

    return customTemplates;
  }

  // Delete template
  deleteTemplate(templateId: string): boolean {
    try {
      delete this.standardTemplates[templateId];
      localStorage.removeItem(`label_template_${templateId}`);
      return true;
    } catch (error) {
      console.error('Failed to delete template:', error);
      return false;
    }
  }
}

// Export singleton instance
export const printableLabelService = new PrintableLabelService(); 