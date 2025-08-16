import { BehaviorSubject, Observable } from 'rxjs';

// Barcode Types and Interfaces
export interface BarcodeResult {
  code: string;
  format: BarcodeFormat;
  timestamp: Date;
  confidence: number;
  rawData?: any;
}

export interface InventoryItem {
  id: string;
  barcode: string;
  itemName: string;
  category: string;
  currentStock: number;
  unitOfMeasure: string;
  location: string;
  lastUpdated: Date;
}

export interface StockUpdate {
  itemId: string;
  operation: 'ADD' | 'REMOVE' | 'ADJUST';
  quantity: number;
  reason: string;
  staffId: string;
  timestamp: Date;
  barcodeUsed: string;
}

export interface ScanSession {
  id: string;
  startTime: Date;
  endTime?: Date;
  scannedItems: ScannedItem[];
  totalScans: number;
  successfulScans: number;
  failedScans: number;
  sessionType: 'STOCK_IN' | 'STOCK_OUT' | 'CYCLE_COUNT' | 'AUDIT';
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
}

export interface ScannedItem {
  barcode: string;
  itemId?: string;
  itemName?: string;
  quantity: number;
  timestamp: Date;
  status: 'SUCCESS' | 'FAILED' | 'DUPLICATE' | 'NOT_FOUND';
  errorMessage?: string;
}

export type BarcodeFormat = 
  | 'CODE128' 
  | 'EAN13' 
  | 'EAN8' 
  | 'QR_CODE' 
  | 'DATA_MATRIX' 
  | 'PDF417' 
  | 'AZTEC' 
  | 'UPC_A' 
  | 'UPC_E';

// Barcode Scanner Configuration
export interface ScannerConfig {
  enableSound: boolean;
  enableVibration: boolean;
  enableFlashlight: boolean;
  scanDelay: number;
  maxScansPerMinute: number;
  allowDuplicates: boolean;
  requiredFormats: BarcodeFormat[];
  autoAdvance: boolean;
  showPreview: boolean;
}

class BarcodeService {
  private scanResults$ = new BehaviorSubject<BarcodeResult[]>([]);
  private currentSession$ = new BehaviorSubject<ScanSession | null>(null);
  private scannerActive$ = new BehaviorSubject<boolean>(false);
  private config: ScannerConfig;
  
  // Mock inventory database
  private mockInventory: InventoryItem[] = [
    {
      id: '1',
      barcode: 'DMEM-500ML-001',
      itemName: 'Culture Medium DMEM',
      category: 'MEDIA',
      currentStock: 750,
      unitOfMeasure: 'mL',
      location: 'RM-LAB-001',
      lastUpdated: new Date()
    },
    {
      id: '2',
      barcode: 'FSH-400IU-002',
      itemName: 'FSH (Folltropin)',
      category: 'HORMONE',
      currentStock: 1600,
      unitOfMeasure: 'IU',
      location: 'FRZ-001',
      lastUpdated: new Date()
    },
    {
      id: '3',
      barcode: 'LN2-50L-003',
      itemName: 'Liquid Nitrogen',
      category: 'CRYO_MATERIAL',
      currentStock: 150,
      unitOfMeasure: 'L',
      location: 'CRYO-STORAGE-001',
      lastUpdated: new Date()
    }
  ];

  constructor() {
    this.config = {
      enableSound: true,
      enableVibration: true,
      enableFlashlight: false,
      scanDelay: 500,
      maxScansPerMinute: 60,
      allowDuplicates: false,
      requiredFormats: ['CODE128', 'EAN13', 'QR_CODE', 'DATA_MATRIX'],
      autoAdvance: true,
      showPreview: true
    };
  }

  // Configuration Management
  updateConfig(newConfig: Partial<ScannerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): ScannerConfig {
    return { ...this.config };
  }

  // Scanner Control
  async startScanner(): Promise<boolean> {
    try {
      // In a real implementation, this would initialize the camera/scanner
      console.log('Starting barcode scanner...');
      this.scannerActive$.next(true);
      
      if (this.config.enableSound) {
        this.playSound('startup');
      }
      
      return true;
    } catch (error) {
      console.error('Failed to start scanner:', error);
      return false;
    }
  }

  async stopScanner(): Promise<void> {
    console.log('Stopping barcode scanner...');
    this.scannerActive$.next(false);
    
    if (this.config.enableSound) {
      this.playSound('shutdown');
    }
  }

  // Scan Processing
  async processBarcode(code: string, format: BarcodeFormat = 'CODE128'): Promise<BarcodeResult> {
    const result: BarcodeResult = {
      code,
      format,
      timestamp: new Date(),
      confidence: Math.random() * 30 + 70 // 70-100% confidence
    };

    // Add to scan results
    const currentResults = this.scanResults$.value;
    this.scanResults$.next([result, ...currentResults.slice(0, 99)]); // Keep last 100 scans

    // Provide feedback
    if (this.config.enableSound) {
      this.playSound('scan');
    }

    if (this.config.enableVibration && 'vibrate' in navigator) {
      navigator.vibrate(100);
    }

    // Process for current session
    if (this.currentSession$.value) {
      await this.addToSession(result);
    }

    return result;
  }

  // Session Management
  startSession(type: ScanSession['sessionType']): ScanSession {
    const session: ScanSession = {
      id: `session-${Date.now()}`,
      startTime: new Date(),
      scannedItems: [],
      totalScans: 0,
      successfulScans: 0,
      failedScans: 0,
      sessionType: type,
      status: 'ACTIVE'
    };

    this.currentSession$.next(session);
    return session;
  }

  endSession(): ScanSession | null {
    const session = this.currentSession$.value;
    if (session) {
      session.endTime = new Date();
      session.status = 'COMPLETED';
      this.currentSession$.next(null);
    }
    return session;
  }

  cancelSession(): void {
    const session = this.currentSession$.value;
    if (session) {
      session.status = 'CANCELLED';
      this.currentSession$.next(null);
    }
  }

  private async addToSession(scanResult: BarcodeResult): Promise<void> {
    const session = this.currentSession$.value;
    if (!session) return;

    // Look up item by barcode
    const item = this.mockInventory.find(inv => inv.barcode === scanResult.code);
    
    const scannedItem: ScannedItem = {
      barcode: scanResult.code,
      itemId: item?.id,
      itemName: item?.itemName,
      quantity: 1, // Default quantity, can be modified
      timestamp: scanResult.timestamp,
      status: item ? 'SUCCESS' : 'NOT_FOUND',
      errorMessage: item ? undefined : 'Item not found in inventory'
    };

    // Check for duplicates if not allowed
    if (!this.config.allowDuplicates) {
      const duplicate = session.scannedItems.find(si => si.barcode === scanResult.code);
      if (duplicate) {
        scannedItem.status = 'DUPLICATE';
        scannedItem.errorMessage = 'Item already scanned in this session';
      }
    }

    session.scannedItems.push(scannedItem);
    session.totalScans++;
    
    if (scannedItem.status === 'SUCCESS') {
      session.successfulScans++;
    } else {
      session.failedScans++;
    }

    // Update session
    this.currentSession$.next({ ...session });
  }

  // Inventory Operations
  async updateInventory(updates: StockUpdate[]): Promise<boolean> {
    try {
      for (const update of updates) {
        const item = this.mockInventory.find(inv => inv.id === update.itemId);
        if (!item) continue;

        switch (update.operation) {
          case 'ADD':
            item.currentStock += update.quantity;
            break;
          case 'REMOVE':
            item.currentStock = Math.max(0, item.currentStock - update.quantity);
            break;
          case 'ADJUST':
            item.currentStock = update.quantity;
            break;
        }

        item.lastUpdated = update.timestamp;
      }

      // In real implementation, this would sync with backend
      console.log('Inventory updated:', updates);
      return true;
    } catch (error) {
      console.error('Failed to update inventory:', error);
      return false;
    }
  }

  async lookupItem(barcode: string): Promise<InventoryItem | null> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return this.mockInventory.find(item => item.barcode === barcode) || null;
  }

  async validateBarcode(code: string): Promise<{ valid: boolean; reason?: string }> {
    // Basic validation rules
    if (!code || code.trim().length === 0) {
      return { valid: false, reason: 'Empty barcode' };
    }

    if (code.length < 6) {
      return { valid: false, reason: 'Barcode too short' };
    }

    if (code.length > 50) {
      return { valid: false, reason: 'Barcode too long' };
    }

    // Check if format is allowed
    const format = this.detectBarcodeFormat(code);
    if (!this.config.requiredFormats.includes(format)) {
      return { valid: false, reason: `Format ${format} not allowed` };
    }

    return { valid: true };
  }

  // Utility Methods
  private detectBarcodeFormat(code: string): BarcodeFormat {
    // Simple format detection logic
    if (code.includes('QR') || code.length > 20) return 'QR_CODE';
    if (code.length === 13 && /^\d+$/.test(code)) return 'EAN13';
    if (code.length === 8 && /^\d+$/.test(code)) return 'EAN8';
    if (code.length === 12 && /^\d+$/.test(code)) return 'UPC_A';
    return 'CODE128';
  }

  private playSound(type: 'startup' | 'shutdown' | 'scan' | 'error'): void {
    // In real implementation, this would play actual audio files
    const frequencies = {
      startup: 800,
      shutdown: 400,
      scan: 1000,
      error: 200
    };

    if ('AudioContext' in window || 'webkitAudioContext' in window) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioCtx();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequencies[type];
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.warn('Unable to play sound:', error);
      }
    }
  }

  // Batch Operations
  async processBatch(barcodes: string[]): Promise<{ 
    results: BarcodeResult[]; 
    summary: { total: number; successful: number; failed: number; } 
  }> {
    const results: BarcodeResult[] = [];
    let successful = 0;
    let failed = 0;

    for (const code of barcodes) {
      try {
        const result = await this.processBarcode(code);
        results.push(result);
        successful++;
      } catch (error) {
        console.error(`Failed to process barcode ${code}:`, error);
        failed++;
      }

      // Respect scan delay
      if (this.config.scanDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, this.config.scanDelay));
      }
    }

    return {
      results,
      summary: {
        total: barcodes.length,
        successful,
        failed
      }
    };
  }

  // Export/Import
  exportScanResults(): string {
    const data = {
      scanResults: this.scanResults$.value,
      config: this.config,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  }

  importScanResults(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (data.scanResults && Array.isArray(data.scanResults)) {
        this.scanResults$.next(data.scanResults);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import scan results:', error);
      return false;
    }
  }

  // Observable Getters
  getScanResults(): Observable<BarcodeResult[]> {
    return this.scanResults$.asObservable();
  }

  getCurrentSession(): Observable<ScanSession | null> {
    return this.currentSession$.asObservable();
  }

  getScannerStatus(): Observable<boolean> {
    return this.scannerActive$.asObservable();
  }

  // Cleanup
  dispose(): void {
    this.scanResults$.complete();
    this.currentSession$.complete();
    this.scannerActive$.complete();
  }
}

// Export singleton instance
export const barcodeService = new BarcodeService(); 