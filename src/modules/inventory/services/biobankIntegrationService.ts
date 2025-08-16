// Biobank Integration Service for Inventory Management
// Phase 4: Biobank Integration with LN₂ Tank Management

export interface LN2Tank {
  id: string;
  tankNumber: string;
  location: string;
  capacity: number; // Liters
  currentLevel: number; // Liters
  temperature: number; // Always -196°C for LN2
  lastRefillDate: string;
  nextRefillDate: string;
  status: 'OPERATIONAL' | 'LOW_LEVEL' | 'CRITICAL' | 'MAINTENANCE' | 'OFFLINE';
  samples: TankSample[];
  pressureReading: number; // PSI
  alarmStatus: 'NORMAL' | 'WARNING' | 'CRITICAL';
  lastMaintenanceDate: string;
  maintenanceInterval: number; // Days
  notes?: string;
}

export interface TankSample {
  id: string;
  sampleId: string;
  sampleType: 'embryo' | 'oocyte' | 'semen' | 'blood' | 'DNA' | 'fibroblast';
  animalId: string;
  animalName: string;
  position: string; // e.g., "Rack-A-Box-3-Position-15"
  storageDate: string;
  quality: number; // 1-10
  viabilityStatus: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNKNOWN';
  containerType: 'STRAW' | 'VIAL' | 'TUBE' | 'CRYOTUBE';
  volumeML?: number;
  concentration?: number;
  notes?: string;
}

export interface BiobankTransfer {
  id: string;
  transferId: string; // Auto-generated BT-YYYY-NNNN
  fromLocation: string; // Inventory location
  toTank: string; // LN2 tank ID
  transferDate: string;
  transferredBy: string;
  samples: TankSample[];
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  temperature_at_transfer: number;
  transfer_duration_minutes: number;
  quality_control_passed: boolean;
  notes?: string;
}

export interface TemperatureAlert {
  id: string;
  tankId: string;
  tankNumber: string;
  alertType: 'TEMPERATURE_DEVIATION' | 'LOW_LEVEL' | 'PRESSURE_ALARM' | 'MAINTENANCE_DUE';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  resolved: boolean;
  resolvedAt?: string;
}

export interface BiobankInventoryStats {
  totalTanks: number;
  operationalTanks: number;
  totalSamplesStored: number;
  samplesByType: Record<string, number>;
  averageTemperature: number;
  criticalAlerts: number;
  pendingTransfers: number;
  capacityUtilization: number; // Percentage
  lastUpdateTime: string;
}

export interface SampleLocationHistory {
  id: string;
  sampleId: string;
  fromLocation: string;
  toLocation: string;
  transferDate: string;
  transferredBy: string;
  reason: string;
  temperature?: number;
  notes?: string;
}

class BiobankIntegrationService {
  private baseUrl = '/api/inventory/biobank-integration';

  // LN₂ Tank Management
  async getLN2Tanks(): Promise<LN2Tank[]> {
    // Mock data for development
    return [
      {
        id: '1',
        tankNumber: 'LN2-001',
        location: 'Main Laboratory - Section A',
        capacity: 500,
        currentLevel: 425,
        temperature: -196,
        lastRefillDate: '2025-01-15',
        nextRefillDate: '2025-02-15',
        status: 'OPERATIONAL',
        samples: this.generateMockTankSamples(180),
        pressureReading: 22.5,
        alarmStatus: 'NORMAL',
        lastMaintenanceDate: '2024-12-01',
        maintenanceInterval: 90,
        notes: 'Primary embryo storage tank'
      },
      {
        id: '2',
        tankNumber: 'LN2-002',
        location: 'Field Laboratory - Mobile Unit',
        capacity: 200,
        currentLevel: 45,
        temperature: -195.8,
        lastRefillDate: '2025-01-20',
        nextRefillDate: '2025-01-25',
        status: 'LOW_LEVEL',
        samples: this.generateMockTankSamples(95),
        pressureReading: 18.2,
        alarmStatus: 'WARNING',
        lastMaintenanceDate: '2025-01-10',
        maintenanceInterval: 60,
        notes: 'Requires refill within 5 days'
      },
      {
        id: '3',
        tankNumber: 'LN2-003',
        location: 'Research Laboratory - Section B',
        capacity: 750,
        currentLevel: 680,
        temperature: -196.1,
        lastRefillDate: '2025-01-10',
        nextRefillDate: '2025-02-25',
        status: 'OPERATIONAL',
        samples: this.generateMockTankSamples(245),
        pressureReading: 25.1,
        alarmStatus: 'NORMAL',
        lastMaintenanceDate: '2024-11-15',
        maintenanceInterval: 120,
        notes: 'Research samples and long-term storage'
      },
      {
        id: '4',
        tankNumber: 'LN2-004',
        location: 'Backup Storage - Section C',
        capacity: 300,
        currentLevel: 15,
        temperature: -194.5,
        lastRefillDate: '2025-01-01',
        nextRefillDate: '2025-01-03',
        status: 'CRITICAL',
        samples: this.generateMockTankSamples(25),
        pressureReading: 15.8,
        alarmStatus: 'CRITICAL',
        lastMaintenanceDate: '2024-10-01',
        maintenanceInterval: 90,
        notes: 'URGENT: Temperature deviation detected - requires immediate attention'
      }
    ];
  }

  private generateMockTankSamples(count: number): TankSample[] {
    const samples: TankSample[] = [];
    const sampleTypes = ['embryo', 'oocyte', 'semen', 'blood', 'DNA', 'fibroblast'];
    const containerTypes = ['STRAW', 'VIAL', 'TUBE', 'CRYOTUBE'];
    const viabilityStatuses = ['HIGH', 'MEDIUM', 'LOW', 'UNKNOWN'];

    for (let i = 1; i <= count; i++) {
      samples.push({
        id: `ts-${i.toString().padStart(3, '0')}`,
        sampleId: `SMPL-2025-${(1000 + i).toString()}`,
        sampleType: sampleTypes[Math.floor(Math.random() * sampleTypes.length)] as any,
        animalId: `RT-A-${(2000 + i).toString()}`,
        animalName: `Animal-${i}`,
        position: `Rack-${String.fromCharCode(65 + Math.floor(i / 25))}-Box-${Math.floor((i % 25) / 5) + 1}-Position-${(i % 5) + 1}`,
        storageDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quality: Math.floor(Math.random() * 4) + 7, // 7-10 quality for stored samples
        viabilityStatus: viabilityStatuses[Math.floor(Math.random() * viabilityStatuses.length)] as any,
        containerType: containerTypes[Math.floor(Math.random() * containerTypes.length)] as any,
        volumeML: Math.random() > 0.5 ? Math.random() * 2 + 0.5 : undefined,
        concentration: Math.random() > 0.5 ? Math.random() * 1000000 + 100000 : undefined,
        notes: Math.random() > 0.7 ? 'High priority sample' : undefined
      });
    }
    return samples;
  }

  // Sample Transfer Management
  async createBiobankTransfer(samples: string[], targetTankId: string, transferredBy: string): Promise<BiobankTransfer> {
    const transferId = `BT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      transferId,
      fromLocation: 'Laboratory Processing Area',
      toTank: targetTankId,
      transferDate: new Date().toISOString(),
      transferredBy,
      samples: [], // Would be populated from actual sample data
      status: 'PENDING',
      temperature_at_transfer: -196,
      transfer_duration_minutes: 15,
      quality_control_passed: true,
      notes: `Automated transfer of ${samples.length} samples to biobank storage`
    };
  }

  async getBiobankTransfers(): Promise<BiobankTransfer[]> {
    // Mock recent transfers
    return [
      {
        id: '1',
        transferId: 'BT-2025-0001',
        fromLocation: 'Laboratory Processing Area',
        toTank: 'LN2-001',
        transferDate: '2025-01-25T10:30:00Z',
        transferredBy: 'Dr. Smith',
        samples: this.generateMockTankSamples(15),
        status: 'COMPLETED',
        temperature_at_transfer: -196,
        transfer_duration_minutes: 12,
        quality_control_passed: true,
        notes: 'Routine embryo transfer to primary storage'
      },
      {
        id: '2',
        transferId: 'BT-2025-0002',
        fromLocation: 'Field Collection Station',
        toTank: 'LN2-002',
        transferDate: '2025-01-25T14:15:00Z',
        transferredBy: 'Tech Johnson',
        samples: this.generateMockTankSamples(8),
        status: 'IN_PROGRESS',
        temperature_at_transfer: -195.8,
        transfer_duration_minutes: 18,
        quality_control_passed: true,
        notes: 'Field collection batch transfer'
      }
    ];
  }

  // Temperature Monitoring
  async getTemperatureAlerts(): Promise<TemperatureAlert[]> {
    return [
      {
        id: '1',
        tankId: '4',
        tankNumber: 'LN2-004',
        alertType: 'TEMPERATURE_DEVIATION',
        severity: 'CRITICAL',
        message: 'Temperature deviation detected: -194.5°C (normal: -196°C)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        acknowledged: false,
        resolved: false
      },
      {
        id: '2',
        tankId: '2',
        tankNumber: 'LN2-002',
        alertType: 'LOW_LEVEL',
        severity: 'WARNING',
        message: 'LN₂ level below 25% capacity (45L remaining)',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        acknowledged: true,
        acknowledgedBy: 'Maintenance Team',
        resolved: false
      },
      {
        id: '3',
        tankId: '1',
        tankNumber: 'LN2-001',
        alertType: 'MAINTENANCE_DUE',
        severity: 'INFO',
        message: 'Routine maintenance due in 7 days',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        acknowledged: true,
        acknowledgedBy: 'Dr. Smith',
        resolved: false
      }
    ];
  }

  // Integration Statistics
  async getBiobankStats(): Promise<BiobankInventoryStats> {
    const tanks = await this.getLN2Tanks();
    const totalSamples = tanks.reduce((sum, tank) => sum + tank.samples.length, 0);
    const operationalTanks = tanks.filter(tank => tank.status === 'OPERATIONAL').length;
    const alerts = await this.getTemperatureAlerts();
    const criticalAlerts = alerts.filter(alert => alert.severity === 'CRITICAL' && !alert.resolved).length;

    return {
      totalTanks: tanks.length,
      operationalTanks,
      totalSamplesStored: totalSamples,
      samplesByType: {
        embryo: Math.floor(totalSamples * 0.35),
        oocyte: Math.floor(totalSamples * 0.25),
        semen: Math.floor(totalSamples * 0.20),
        blood: Math.floor(totalSamples * 0.10),
        DNA: Math.floor(totalSamples * 0.07),
        fibroblast: Math.floor(totalSamples * 0.03)
      },
      averageTemperature: -195.8,
      criticalAlerts,
      pendingTransfers: 2,
      capacityUtilization: 75.5,
      lastUpdateTime: new Date().toISOString()
    };
  }

  // Sample Location Tracking
  async getSampleLocationHistory(sampleId: string): Promise<SampleLocationHistory[]> {
    return [
      {
        id: '1',
        sampleId,
        fromLocation: 'Collection Point - Field Lab',
        toLocation: 'Laboratory Processing Area',
        transferDate: '2025-01-20T09:00:00Z',
        transferredBy: 'Field Technician',
        reason: 'Sample processing',
        temperature: 4,
        notes: 'Initial collection transfer'
      },
      {
        id: '2',
        sampleId,
        fromLocation: 'Laboratory Processing Area',
        toLocation: 'LN2-001 - Rack-A-Box-2-Position-8',
        transferDate: '2025-01-20T11:30:00Z',
        transferredBy: 'Dr. Smith',
        reason: 'Long-term storage',
        temperature: -196,
        notes: 'Quality control passed - stored for breeding program'
      }
    ];
  }

  // Automated Integration Functions
  async checkSampleReadyForBiobank(): Promise<string[]> {
    // Returns sample IDs that are ready for biobank transfer
    // This would integrate with Sample Management module
    return ['SMPL-2025-1234', 'SMPL-2025-1235', 'SMPL-2025-1236'];
  }

  async updateInventoryAfterTransfer(transferId: string): Promise<void> {
    // Updates inventory quantities after biobank transfer
    console.log(`Updating inventory after transfer ${transferId}`);
  }

  async generateTransferReport(transferId: string): Promise<any> {
    // Generates compliance report for transfer
    return {
      transferId,
      samples: 15,
      temperatureLog: 'Within acceptable range',
      qualityControl: 'All samples passed QC',
      compliance: 'ISO 17025 compliant'
    };
  }
}

export const biobankIntegrationService = new BiobankIntegrationService();
export default biobankIntegrationService; 