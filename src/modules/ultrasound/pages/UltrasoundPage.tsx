import React, { useState, useEffect } from 'react';
import { 
  Monitor, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Users,
  Target,
  Heart,
  RefreshCw,
  X,
  Stethoscope,
  ArrowRight,
  Clock,
  Star,
  Filter,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Printer,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Enhanced interfaces with new fields
interface FollicleMeasurement {
  id: string;
  ovary: 'LEFT' | 'RIGHT';
  diameter: number; // in mm
  isDominant: boolean;
}

interface UltrasoundRecord {
  id: string;
  date: string;
  sessionId: string;
  animalName: string;
  animalId: string;
  species: string;
  animalType: string;
  treatmentStage: string;
  examRoom: string;
  veterinarian: string;
  follicleCount: number;
  dominantFollicles: number;
  follicles: FollicleMeasurement[]; // NEW: Individual follicle measurements
  leftCL: boolean;
  rightCL: boolean;
  pregnancyStatus?: 'PREGNANT' | 'NOT_PREGNANT' | 'INCONCLUSIVE';
  uterineTone: string;
  clinicalNotes: string;
  timestamp: string;
  
  // NEW FIELDS
  scanType: 'DONOR_FOLLICULAR' | 'RECIPIENT_UTERUS' | 'PREGNANCY_CHECK' | 'POST_ET_FOLLOWUP' | 'BASELINE_ASSESSMENT' | 'PROBLEM_INVESTIGATION';
  scanScore: 'GOOD' | 'AVERAGE' | 'POOR';
  performedBy: string;
  scanTime: string;
  nextScanDate?: string;
  uterineScore: {
    tone: 0 | 1 | 2; // 0 - Atonic, 1 - Normal, 2 - Hypertonic
    edema: 0 | 1 | 2 | 3; // 0 - None, 1 - Mild, 2 - Moderate, 3 - Severe
  };
  autoSaveDraft: boolean;
}

const UltrasoundPage: React.FC = () => {
  // Simple state management
  const [records, setRecords] = useState<UltrasoundRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<UltrasoundRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecord, setSelectedRecord] = useState<UltrasoundRecord | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNewScanModal, setShowNewScanModal] = useState(false);

  // NEW: Comprehensive scan form state
  const [newScanData, setNewScanData] = useState({
    animalId: '',
    animalName: '',
    species: 'BOVINE',
    animalType: 'DONOR',
    scanType: 'DONOR_FOLLICULAR' as const,
    treatmentStage: '',
    examRoom: 'Ultrasound Room 1',
    scanScore: 'GOOD' as const,
    performedBy: 'Dr. Sarah Ahmed', // Auto-populated
    scanTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
    nextScanDate: '',
    follicles: [] as FollicleMeasurement[],
    leftCL: false,
    rightCL: false,
    pregnancyStatus: '' as '',
    uterineScore: { tone: 1 as const, edema: 0 as const },
    clinicalNotes: '',
    autoSaveDraft: true
  });

  // Auto-save draft functionality
  const [draftSaved, setDraftSaved] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // NEW: Advanced filtering state
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: { start: '', end: '' },
    scanTypes: [] as string[],
    scanScores: [] as string[],
    veterinarians: [] as string[],
    species: [] as string[],
    animalTypes: [] as string[],
    follicleRange: { min: '', max: '' },
    pregnancyStatus: [] as string[],
    clinicalFindings: {
      leftCL: '',  // '', 'true', 'false'
      rightCL: '',
      uterineTone: [] as string[]
    }
  });

  // Analytics & Export state
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    avgFollicles: 0,
    pregnancyRate: 0,
    scansByType: {} as Record<string, number>,
    scansByScore: {} as Record<string, number>,
    vetPerformance: {} as Record<string, { scans: number, avgScore: string }>,
    trends: {
      weeklyScans: [] as number[],
      follicleGrowth: [] as number[]
    }
  });

  // Statistics
  const [stats, setStats] = useState({
    totalExams: 0,
    todayExams: 0,
    weekExams: 0,
    uniqueAnimals: 0,
    avgFollicles: 0,
    pregnancyRate: 0
  });

  // Load demo data on component mount
  useEffect(() => {
    loadDemoData();
  }, []);

  // Filter records when search or filters change
  useEffect(() => {
    filterRecords();
  }, [records, searchTerm, filters]);

  // Calculate stats when filtered records change
  useEffect(() => {
    calculateStatistics();
    calculateAnalytics();
  }, [filteredRecords]);

  // Auto-save draft functionality
  useEffect(() => {
    if (newScanData.autoSaveDraft && hasUnsavedChanges) {
      const timer = setTimeout(() => {
        localStorage.setItem('ultrasound_draft', JSON.stringify(newScanData));
        setDraftSaved(true);
        setTimeout(() => setDraftSaved(false), 2000);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [newScanData, hasUnsavedChanges]);

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('ultrasound_draft');
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setNewScanData(prev => ({ ...prev, ...draft }));
      } catch (e) {
        console.warn('Could not load saved draft');
      }
    }
  }, []);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && showNewScanModal) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave without saving the scan?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, showNewScanModal]);

  const loadDemoData = () => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const demoRecords: UltrasoundRecord[] = [
      {
        id: 'exam_001',
        date: today,
        sessionId: 'U-SCAN-001',
        animalName: 'Luna',
        animalId: 'BOV-2025-001',
        species: 'BOVINE',
        animalType: 'DONOR',
        treatmentStage: 'Superovulation Day 7',
        examRoom: 'Ultrasound Room 1',
        veterinarian: 'Dr. Sarah Ahmed',
        follicleCount: 9,
        dominantFollicles: 4,
        follicles: [
          { id: 'f1', ovary: 'LEFT', diameter: 12.5, isDominant: true },
          { id: 'f2', ovary: 'LEFT', diameter: 11.8, isDominant: true },
          { id: 'f3', ovary: 'LEFT', diameter: 8.2, isDominant: false },
          { id: 'f4', ovary: 'LEFT', diameter: 7.1, isDominant: false },
          { id: 'f5', ovary: 'RIGHT', diameter: 13.2, isDominant: true },
          { id: 'f6', ovary: 'RIGHT', diameter: 10.9, isDominant: true },
          { id: 'f7', ovary: 'RIGHT', diameter: 9.4, isDominant: false },
          { id: 'f8', ovary: 'RIGHT', diameter: 6.8, isDominant: false },
          { id: 'f9', ovary: 'RIGHT', diameter: 5.9, isDominant: false }
        ],
        leftCL: false,
        rightCL: false,
        pregnancyStatus: 'NOT_PREGNANT',
        uterineTone: 'NORMAL',
        clinicalNotes: 'Excellent superovulation response. Multiple follicles >10mm. Ready for OPU procedure tomorrow.',
        timestamp: `${today}T09:15:00Z`,
        scanType: 'DONOR_FOLLICULAR',
        scanScore: 'GOOD',
        performedBy: 'Dr. Sarah Ahmed',
        scanTime: '09:15',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_002',
        date: today,
        sessionId: 'U-SCAN-002',
        animalName: 'Shahrazad',
        animalId: 'EQU-2025-003',
        species: 'EQUINE',
        animalType: 'RECIPIENT',
        treatmentStage: 'Pregnancy Check Day 30',
        examRoom: 'Ultrasound Room 2',
        veterinarian: 'Dr. Ahmad Ali',
        follicleCount: 0,
        dominantFollicles: 0,
        follicles: [],
        leftCL: true,
        rightCL: false,
        pregnancyStatus: 'PREGNANT',
        uterineTone: 'HYPERTONIC',
        clinicalNotes: 'Confirmed pregnancy at 30 days. Fetal heartbeat detected. CL functioning well on left ovary.',
        timestamp: `${today}T14:30:00Z`,
        scanType: 'RECIPIENT_UTERUS',
        scanScore: 'GOOD',
        performedBy: 'Dr. Ahmad Ali',
        scanTime: '14:30',
        uterineScore: { tone: 2, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_003',
        date: today,
        sessionId: 'U-SCAN-003',
        animalName: 'Noor',
        animalId: 'CAM-2025-012',
        species: 'CAMEL',
        animalType: 'DONOR',
        treatmentStage: 'Estrus Synchronization',
        examRoom: 'Mobile Unit 1',
        veterinarian: 'Dr. Fatima Hassan',
        follicleCount: 3,
        dominantFollicles: 1,
        follicles: [
          { id: 'f1', ovary: 'LEFT', diameter: 14.1, isDominant: true },
          { id: 'f2', ovary: 'LEFT', diameter: 6.2, isDominant: false },
          { id: 'f3', ovary: 'RIGHT', diameter: 7.8, isDominant: false }
        ],
        leftCL: false,
        rightCL: false,
        uterineTone: 'NORMAL',
        clinicalNotes: 'Large pre-ovulatory follicle detected. Moderate uterine edema indicates approaching estrus.',
        timestamp: `${today}T11:45:00Z`,
        scanType: 'DONOR_FOLLICULAR',
        scanScore: 'GOOD',
        performedBy: 'Dr. Fatima Hassan',
        scanTime: '11:45',
        uterineScore: { tone: 1, edema: 1 },
        autoSaveDraft: false
      },
      {
        id: 'exam_004',
        date: yesterday,
        sessionId: 'U-SCAN-004',
        animalName: 'Barakah',
        animalId: 'OVI-2025-008',
        species: 'OVINE',
        animalType: 'RECIPIENT',
        treatmentStage: 'Recipient Preparation',
        examRoom: 'Ultrasound Room 1',
        veterinarian: 'Dr. Omar Abdullah',
        follicleCount: 2,
        dominantFollicles: 2,
        follicles: [
          { id: 'f1', ovary: 'LEFT', diameter: 11.5, isDominant: true },
          { id: 'f2', ovary: 'RIGHT', diameter: 10.8, isDominant: true }
        ],
        leftCL: true,
        rightCL: true,
        uterineTone: 'NORMAL',
        clinicalNotes: 'Excellent recipient with bilateral CL formation. Ready for embryo transfer.',
        timestamp: `${yesterday}T15:20:00Z`,
        scanType: 'RECIPIENT_UTERUS',
        scanScore: 'GOOD',
        performedBy: 'Dr. Omar Abdullah',
        scanTime: '15:20',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_005',
        date: yesterday,
        sessionId: 'U-SCAN-005',
        animalName: 'Yasmin',
        animalId: 'CAP-2025-015',
        species: 'CAPRINE',
        animalType: 'DONOR',
        treatmentStage: 'Superovulation Day 5',
        examRoom: 'Ultrasound Room 2',
        veterinarian: 'Dr. Sarah Ahmed',
        follicleCount: 6,
        dominantFollicles: 0,
        follicles: [
          { id: 'f1', ovary: 'LEFT', diameter: 6.8, isDominant: false },
          { id: 'f2', ovary: 'LEFT', diameter: 7.2, isDominant: false },
          { id: 'f3', ovary: 'LEFT', diameter: 5.9, isDominant: false },
          { id: 'f4', ovary: 'RIGHT', diameter: 8.1, isDominant: false },
          { id: 'f5', ovary: 'RIGHT', diameter: 6.5, isDominant: false },
          { id: 'f6', ovary: 'RIGHT', diameter: 7.8, isDominant: false }
        ],
        leftCL: false,
        rightCL: false,
        uterineTone: 'NORMAL',
        clinicalNotes: 'Multiple follicles developing. Continue FSH protocol. Expect rapid growth in next 48h.',
        timestamp: `${yesterday}T10:10:00Z`,
        scanType: 'DONOR_FOLLICULAR',
        scanScore: 'GOOD',
        performedBy: 'Dr. Sarah Ahmed',
        scanTime: '10:10',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_006',
        date: twoDaysAgo,
        sessionId: 'U-SCAN-006',
        animalName: 'Amira',
        animalId: 'BOV-2025-025',
        species: 'BOVINE',
        animalType: 'BREEDING',
        treatmentStage: 'Post-AI Check',
        examRoom: 'Mobile Unit 2',
        veterinarian: 'Dr. Ahmad Ali',
        follicleCount: 1,
        dominantFollicles: 0,
        follicles: [],
        leftCL: true,
        rightCL: false,
        uterineTone: 'NORMAL',
        clinicalNotes: 'Ovulation confirmed. Corpus hemorrhagicum visible on left ovary. AI timing was optimal.',
        timestamp: `${twoDaysAgo}T13:45:00Z`,
        scanType: 'PREGNANCY_CHECK',
        scanScore: 'GOOD',
        performedBy: 'Dr. Ahmad Ali',
        scanTime: '13:45',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_007',
        date: twoDaysAgo,
        sessionId: 'U-SCAN-007',
        animalName: 'Malika',
        animalId: 'EQU-2025-009',
        species: 'EQUINE',
        animalType: 'BREEDING',
        treatmentStage: 'Problem Investigation',
        examRoom: 'Ultrasound Room 1',
        veterinarian: 'Dr. Fatima Hassan',
        follicleCount: 2,
        dominantFollicles: 0,
        follicles: [],
        leftCL: false,
        rightCL: false,
        uterineTone: 'HYPOTONIC',
        clinicalNotes: 'Pathological findings: ovarian cyst and endometritis. Requires treatment before breeding.',
        timestamp: `${twoDaysAgo}T16:30:00Z`,
        scanType: 'PROBLEM_INVESTIGATION',
        scanScore: 'POOR',
        performedBy: 'Dr. Fatima Hassan',
        scanTime: '16:30',
        uterineScore: { tone: 0, edema: 3 },
        autoSaveDraft: false
      },
      {
        id: 'exam_008',
        date: weekAgo,
        sessionId: 'U-SCAN-008',
        animalName: 'Sahra',
        animalId: 'CAM-2025-031',
        species: 'CAMEL',
        animalType: 'DONOR',
        treatmentStage: 'Baseline Assessment',
        examRoom: 'Ultrasound Room 2',
        veterinarian: 'Dr. Omar Abdullah',
        follicleCount: 4,
        dominantFollicles: 0,
        follicles: [],
        leftCL: false,
        rightCL: false,
        uterineTone: 'NORMAL',
        clinicalNotes: 'Baseline examination before superovulation protocol. Normal ovarian activity with multiple small follicles.',
        timestamp: `${weekAgo}T09:00:00Z`,
        scanType: 'BASELINE_ASSESSMENT',
        scanScore: 'GOOD',
        performedBy: 'Dr. Omar Abdullah',
        scanTime: '09:00',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_009',
        date: weekAgo,
        sessionId: 'U-SCAN-009',
        animalName: 'Najma',
        animalId: 'OVI-2025-044',
        species: 'OVINE',
        animalType: 'RECIPIENT',
        treatmentStage: 'Pregnancy Confirmation',
        examRoom: 'Mobile Unit 1',
        veterinarian: 'Dr. Sarah Ahmed',
        follicleCount: 0,
        dominantFollicles: 0,
        follicles: [],
        leftCL: true,
        rightCL: false,
        pregnancyStatus: 'PREGNANT',
        uterineTone: 'HYPERTONIC',
        clinicalNotes: 'Early pregnancy confirmed at Day 21 post-transfer. Strong CL on left ovary. Excellent prognosis.',
        timestamp: `${weekAgo}T14:15:00Z`,
        scanType: 'RECIPIENT_UTERUS',
        scanScore: 'GOOD',
        performedBy: 'Dr. Sarah Ahmed',
        scanTime: '14:15',
        uterineScore: { tone: 2, edema: 0 },
        autoSaveDraft: false
      },
      {
        id: 'exam_010',
        date: weekAgo,
        sessionId: 'U-SCAN-010',
        animalName: 'Layla',
        animalId: 'CAP-2025-052',
        species: 'CAPRINE',
        animalType: 'RECIPIENT',
        treatmentStage: 'Failed Transfer Follow-up',
        examRoom: 'Ultrasound Room 1',
        veterinarian: 'Dr. Ahmad Ali',
        follicleCount: 2,
        dominantFollicles: 0,
        follicles: [],
        leftCL: false,
        rightCL: false,
        pregnancyStatus: 'NOT_PREGNANT',
        uterineTone: 'NORMAL',
        clinicalNotes: 'Transfer failed. CL regression complete. New follicular wave beginning. Ready for next protocol.',
        timestamp: `${weekAgo}T11:30:00Z`,
        scanType: 'POST_ET_FOLLOWUP',
        scanScore: 'POOR',
        performedBy: 'Dr. Ahmad Ali',
        scanTime: '11:30',
        uterineScore: { tone: 1, edema: 0 },
        autoSaveDraft: false
      }
    ];

    setRecords(demoRecords);
  };

  const filterRecords = () => {
    let filtered = records;

    // Apply search term filter
    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.animalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.animalId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.treatmentStage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.clinicalNotes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply advanced filters
    filtered = applyAdvancedFilters(filtered);
    setFilteredRecords(filtered);
  };

  // NEW: Advanced filtering function
  const applyAdvancedFilters = (records: UltrasoundRecord[]) => {
    let filtered = [...records];

    // Date range filter
    if (filters.dateRange.start) {
      filtered = filtered.filter(record => record.date >= filters.dateRange.start);
    }
    if (filters.dateRange.end) {
      filtered = filtered.filter(record => record.date <= filters.dateRange.end);
    }

    // Scan type filter
    if (filters.scanTypes.length > 0) {
      filtered = filtered.filter(record => filters.scanTypes.includes(record.scanType));
    }

    // Scan score filter
    if (filters.scanScores.length > 0) {
      filtered = filtered.filter(record => filters.scanScores.includes(record.scanScore));
    }

    // Veterinarian filter
    if (filters.veterinarians.length > 0) {
      filtered = filtered.filter(record => filters.veterinarians.includes(record.performedBy));
    }

    // Species filter
    if (filters.species.length > 0) {
      filtered = filtered.filter(record => filters.species.includes(record.species));
    }

    // Animal type filter
    if (filters.animalTypes.length > 0) {
      filtered = filtered.filter(record => filters.animalTypes.includes(record.animalType));
    }

    // Follicle range filter
    if (filters.follicleRange.min) {
      filtered = filtered.filter(record => record.follicleCount >= parseInt(filters.follicleRange.min));
    }
    if (filters.follicleRange.max) {
      filtered = filtered.filter(record => record.follicleCount <= parseInt(filters.follicleRange.max));
    }

    // Pregnancy status filter
    if (filters.pregnancyStatus.length > 0) {
      filtered = filtered.filter(record => 
        record.pregnancyStatus && filters.pregnancyStatus.includes(record.pregnancyStatus)
      );
    }

    // Clinical findings filters
    if (filters.clinicalFindings.leftCL !== '') {
      const leftCLValue = filters.clinicalFindings.leftCL === 'true';
      filtered = filtered.filter(record => record.leftCL === leftCLValue);
    }
    if (filters.clinicalFindings.rightCL !== '') {
      const rightCLValue = filters.clinicalFindings.rightCL === 'true';
      filtered = filtered.filter(record => record.rightCL === rightCLValue);
    }
    if (filters.clinicalFindings.uterineTone.length > 0) {
      filtered = filtered.filter(record => 
        filters.clinicalFindings.uterineTone.includes(record.uterineTone)
      );
    }

    return filtered;
  };

  const calculateStatistics = () => {
    const today = new Date().toISOString().split('T')[0];
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const todayExams = filteredRecords.filter(r => r.date === today).length;
    const weekExams = filteredRecords.filter(r => r.date >= weekAgo).length;
    const uniqueAnimals = new Set(filteredRecords.map(r => r.animalId)).size;
    const avgFollicles = filteredRecords.length > 0 
      ? Math.round(filteredRecords.reduce((sum, r) => sum + r.follicleCount, 0) / filteredRecords.length * 10) / 10
      : 0;
    const pregnantRecords = filteredRecords.filter(r => r.pregnancyStatus === 'PREGNANT').length;
    const totalWithPregnancyStatus = filteredRecords.filter(r => r.pregnancyStatus).length;
    const pregnancyRate = totalWithPregnancyStatus > 0 
      ? Math.round((pregnantRecords / totalWithPregnancyStatus) * 100)
      : 0;

    setStats({
      totalExams: filteredRecords.length,
      todayExams,
      weekExams,
      uniqueAnimals,
      avgFollicles,
      pregnancyRate
    });
  };

  // NEW: Calculate analytics
  const calculateAnalytics = () => {
    const scansByType: Record<string, number> = {};
    const scansByScore: Record<string, number> = {};
    const vetPerformance: Record<string, { scans: number, avgScore: string }> = {};

    filteredRecords.forEach(record => {
      // Count by scan type
      scansByType[record.scanType] = (scansByType[record.scanType] || 0) + 1;
      
      // Count by scan score
      scansByScore[record.scanScore] = (scansByScore[record.scanScore] || 0) + 1;
      
      // Calculate vet performance
      if (!vetPerformance[record.performedBy]) {
        vetPerformance[record.performedBy] = { scans: 0, avgScore: 'GOOD' };
      }
      vetPerformance[record.performedBy].scans += 1;
    });

    // Calculate average scores for vets
    Object.keys(vetPerformance).forEach(vet => {
      const vetRecords = filteredRecords.filter(r => r.performedBy === vet);
      const goodScans = vetRecords.filter(r => r.scanScore === 'GOOD').length;
      const avgScans = vetRecords.filter(r => r.scanScore === 'AVERAGE').length;
      const poorScans = vetRecords.filter(r => r.scanScore === 'POOR').length;
      
      if (goodScans >= avgScans && goodScans >= poorScans) {
        vetPerformance[vet].avgScore = 'GOOD';
      } else if (avgScans >= poorScans) {
        vetPerformance[vet].avgScore = 'AVERAGE';
      } else {
        vetPerformance[vet].avgScore = 'POOR';
      }
    });

    // Calculate trends (simplified)
    const weeklyScans = [8, 12, 15, 18, 22, 19, filteredRecords.length];
    const follicleGrowth = [4.5, 5.2, 6.1, 6.8, 7.2, 7.9, stats.avgFollicles];

    setAnalytics({
      totalScans: filteredRecords.length,
      avgFollicles: stats.avgFollicles,
      pregnancyRate: stats.pregnancyRate,
      scansByType,
      scansByScore,
      vetPerformance,
      trends: {
        weeklyScans,
        follicleGrowth
      }
    });
  };

  const handleView = (record: UltrasoundRecord) => {
    setSelectedRecord(record);
    setShowViewModal(true);
  };

  const handleEdit = (record: UltrasoundRecord) => {
    setSelectedRecord(record);
    setShowEditModal(true);
  };

  const handleDelete = (record: UltrasoundRecord) => {
    if (confirm(`Are you sure you want to delete examination record for ${record.animalName}?`)) {
      setRecords(prev => prev.filter(r => r.id !== record.id));
    }
  };

  const handleSaveEdit = (updatedNotes: string, updatedPregnancyStatus: string) => {
    if (!selectedRecord) return;

    setRecords(prev => prev.map(record => 
      record.id === selectedRecord.id 
        ? { 
            ...record, 
            clinicalNotes: updatedNotes,
            pregnancyStatus: updatedPregnancyStatus as any || undefined
          }
        : record
    ));
    setShowEditModal(false);
    setSelectedRecord(null);
  };

  // NEW: Comprehensive scan form handlers
  const handleNewScan = () => {
    setShowNewScanModal(true);
    setHasUnsavedChanges(false);
  };

  const handleScanDataChange = (field: string, value: any) => {
    setNewScanData(prev => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleAddFollicle = () => {
    const newFollicle: FollicleMeasurement = {
      id: `f${Date.now()}`,
      ovary: 'LEFT',
      diameter: 5.0,
      isDominant: false
    };
    setNewScanData(prev => ({
      ...prev,
      follicles: [...prev.follicles, newFollicle]
    }));
    setHasUnsavedChanges(true);
  };

  const handleUpdateFollicle = (follicleId: string, updates: Partial<FollicleMeasurement>) => {
    setNewScanData(prev => ({
      ...prev,
      follicles: prev.follicles.map(f => 
        f.id === follicleId ? { ...f, ...updates } : f
      )
    }));
    setHasUnsavedChanges(true);
  };

  const handleRemoveFollicle = (follicleId: string) => {
    setNewScanData(prev => ({
      ...prev,
      follicles: prev.follicles.filter(f => f.id !== follicleId)
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveNewScan = () => {
    const newRecord: UltrasoundRecord = {
      id: `exam_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      sessionId: `U-SCAN-${String(records.length + 1).padStart(3, '0')}`,
      animalName: newScanData.animalName,
      animalId: newScanData.animalId,
      species: newScanData.species,
      animalType: newScanData.animalType,
      treatmentStage: newScanData.treatmentStage,
      examRoom: newScanData.examRoom,
      veterinarian: newScanData.performedBy,
      follicleCount: newScanData.follicles.length,
      dominantFollicles: newScanData.follicles.filter(f => f.isDominant).length,
      follicles: newScanData.follicles,
      leftCL: newScanData.leftCL,
      rightCL: newScanData.rightCL,
      pregnancyStatus: newScanData.pregnancyStatus as any || undefined,
      uterineTone: (newScanData.uterineScore.tone as number) === 0 ? 'HYPOTONIC' : 
                   (newScanData.uterineScore.tone as number) === 1 ? 'NORMAL' : 'HYPERTONIC',
      clinicalNotes: newScanData.clinicalNotes,
      timestamp: new Date().toISOString(),
      scanType: newScanData.scanType,
      scanScore: newScanData.scanScore,
      performedBy: newScanData.performedBy,
      scanTime: newScanData.scanTime,
      nextScanDate: newScanData.nextScanDate || undefined,
      uterineScore: newScanData.uterineScore,
      autoSaveDraft: newScanData.autoSaveDraft
    };

    setRecords(prev => [newRecord, ...prev]);
    setShowNewScanModal(false);
    setHasUnsavedChanges(false);
    localStorage.removeItem('ultrasound_draft');
    
    // Reset form
    setNewScanData({
      animalId: '',
      animalName: '',
      species: 'BOVINE',
      animalType: 'DONOR',
      scanType: 'DONOR_FOLLICULAR',
      treatmentStage: '',
      examRoom: 'Ultrasound Room 1',
      scanScore: 'GOOD',
      performedBy: 'Dr. Sarah Ahmed',
      scanTime: new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      nextScanDate: '',
      follicles: [],
      leftCL: false,
      rightCL: false,
      pregnancyStatus: '',
      uterineScore: { tone: 1, edema: 0 },
      clinicalNotes: '',
      autoSaveDraft: true
    });
  };

  const handleCancelNewScan = () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        setShowNewScanModal(false);
        setHasUnsavedChanges(false);
      }
    } else {
      setShowNewScanModal(false);
    }
  };

  // NEW: Advanced filtering handlers
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleMultiSelectFilter = (filterType: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...(prev[filterType as keyof typeof prev] as string[]), value]
        : (prev[filterType as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      dateRange: { start: '', end: '' },
      scanTypes: [],
      scanScores: [],
      veterinarians: [],
      species: [],
      animalTypes: [],
      follicleRange: { min: '', max: '' },
      pregnancyStatus: [],
      clinicalFindings: {
        leftCL: '',
        rightCL: '',
        uterineTone: []
      }
    });
  };

  // Export handlers
  const handleExportPDF = () => {
    const content = generatePDFContent();
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ultrasound-report-${new Date().toISOString().split('T')[0]}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Animal Name', 'Animal ID', 'Species', 'Scan Type', 'Follicle Count', 'Dominant Follicles', 'Scan Score', 'Performed By', 'Clinical Notes'];
    const csvData = [
      headers.join(','),
      ...filteredRecords.map(record => [
        record.date,
        record.animalName,
        record.animalId,
        record.species,
        record.scanType.replace(/_/g, ' '),
        record.follicleCount,
        record.dominantFollicles,
        record.scanScore,
        record.performedBy,
        `"${record.clinicalNotes.replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ultrasound-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generatePDFContent = () => {
    return `
ULTRASOUND EXAMINATION REPORT
Generated: ${new Date().toLocaleDateString()}
Total Records: ${filteredRecords.length}

SUMMARY STATISTICS:
- Total Examinations: ${stats.totalExams}
- Today's Examinations: ${stats.todayExams}
- Unique Animals: ${stats.uniqueAnimals}
- Average Follicles: ${stats.avgFollicles}
- Pregnancy Rate: ${stats.pregnancyRate}%

DETAILED RECORDS:
${filteredRecords.map(record => `
Date: ${record.date}
Animal: ${record.animalName} (${record.animalId})
Species: ${record.species}
Scan Type: ${record.scanType.replace(/_/g, ' ')}
Follicles: ${record.follicleCount} (${record.dominantFollicles} dominant)
Performed by: ${record.performedBy}
Score: ${record.scanScore}
Notes: ${record.clinicalNotes}
---
`).join('')}
    `;
  };

  // View Modal Component
  const ViewModal = () => {
    if (!showViewModal || !selectedRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Examination Details - {selectedRecord.sessionId}
              </h3>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Animal Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-blue-600" />
                  Animal Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Name:</span> {selectedRecord.animalName}</div>
                  <div><span className="font-medium">ID:</span> {selectedRecord.animalId}</div>
                  <div><span className="font-medium">Species:</span> {selectedRecord.species}</div>
                  <div><span className="font-medium">Type:</span> {selectedRecord.animalType}</div>
                </div>
              </div>

              {/* Scan Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Monitor className="h-4 w-4 mr-2 text-green-600" />
                  Scan Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Date:</span> {selectedRecord.date}</div>
                  <div><span className="font-medium">Scan Type:</span> 
                    <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedRecord.scanType === 'DONOR_FOLLICULAR' ? 'bg-blue-100 text-blue-800' :
                      selectedRecord.scanType === 'RECIPIENT_UTERUS' ? 'bg-green-100 text-green-800' :
                      selectedRecord.scanType === 'PREGNANCY_CHECK' ? 'bg-pink-100 text-pink-800' :
                      selectedRecord.scanType === 'POST_ET_FOLLOWUP' ? 'bg-purple-100 text-purple-800' :
                      selectedRecord.scanType === 'BASELINE_ASSESSMENT' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedRecord.scanType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div><span className="font-medium">Treatment Stage:</span> {selectedRecord.treatmentStage}</div>
                  <div><span className="font-medium">Scan Score:</span> 
                    <span className={`ml-2 inline-flex items-center space-x-1 ${
                      selectedRecord.scanScore === 'GOOD' ? 'text-green-600' :
                      selectedRecord.scanScore === 'AVERAGE' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      <Star className="h-3 w-3" />
                      <span className="text-xs font-medium">{selectedRecord.scanScore}</span>
                    </span>
                  </div>
                  <div><span className="font-medium">Performed By:</span> {selectedRecord.performedBy}</div>
                  <div><span className="font-medium">Time:</span> {selectedRecord.scanTime}</div>
                  <div><span className="font-medium">Exam Room:</span> {selectedRecord.examRoom}</div>
                  <div><span className="font-medium">Session ID:</span> {selectedRecord.sessionId}</div>
                </div>
              </div>

              {/* Follicle Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="h-4 w-4 mr-2 text-purple-600" />
                  Follicle Data
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-medium">Total Count:</span> {selectedRecord.follicleCount}</div>
                    <div><span className="font-medium">Dominant:</span> {selectedRecord.dominantFollicles}</div>
                    <div><span className="font-medium">Left CL:</span> {selectedRecord.leftCL ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">Right CL:</span> {selectedRecord.rightCL ? 'Yes' : 'No'}</div>
                  </div>
                  
                  {selectedRecord.follicles.length > 0 && (
                    <div>
                      <div className="font-medium mb-2">Individual Measurements:</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">LEFT OVARY</div>
                          {selectedRecord.follicles.filter(f => f.ovary === 'LEFT').map(follicle => (
                            <div key={follicle.id} className="flex justify-between items-center py-1">
                              <span className="text-xs">{follicle.diameter} mm</span>
                              {follicle.isDominant && <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">DOM</span>}
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">RIGHT OVARY</div>
                          {selectedRecord.follicles.filter(f => f.ovary === 'RIGHT').map(follicle => (
                            <div key={follicle.id} className="flex justify-between items-center py-1">
                              <span className="text-xs">{follicle.diameter} mm</span>
                              {follicle.isDominant && <span className="text-xs bg-purple-100 text-purple-800 px-1 rounded">DOM</span>}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Clinical Findings */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Stethoscope className="h-4 w-4 mr-2 text-red-600" />
                  Clinical Findings
                </h4>
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div><span className="font-medium">Pregnancy Status:</span> {selectedRecord.pregnancyStatus || 'Not determined'}</div>
                    <div><span className="font-medium">Uterine Tone:</span> {selectedRecord.uterineTone}</div>
                  </div>
                  
                  <div>
                    <div className="font-medium mb-2">Uterine Scoring:</div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Tone:</span>
                        <span className={`px-2 py-1 rounded-full ${
                          selectedRecord.uterineScore.tone === 0 ? 'bg-red-100 text-red-800' :
                          selectedRecord.uterineScore.tone === 1 ? 'bg-green-100 text-green-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedRecord.uterineScore.tone === 0 ? 'Atonic' :
                           selectedRecord.uterineScore.tone === 1 ? 'Normal' : 'Hypertonic'}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">Edema:</span>
                        <span className={`px-2 py-1 rounded-full ${
                          selectedRecord.uterineScore.edema === 0 ? 'bg-green-100 text-green-800' :
                          selectedRecord.uterineScore.edema === 1 ? 'bg-yellow-100 text-yellow-800' :
                          selectedRecord.uterineScore.edema === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {selectedRecord.uterineScore.edema === 0 ? 'None' :
                           selectedRecord.uterineScore.edema === 1 ? 'Mild' :
                           selectedRecord.uterineScore.edema === 2 ? 'Moderate' : 'Severe'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedRecord.nextScanDate && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Next Scan:</span>
                      <span className="text-blue-600">{selectedRecord.nextScanDate}</span>
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <span className="font-medium">Clinical Notes:</span>
                    <div className="mt-1 p-2 bg-white rounded text-xs">
                      {selectedRecord.clinicalNotes}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // NEW: Comprehensive Scan Form Modal
  const NewScanModal = () => {
    if (!showNewScanModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <Monitor className="h-6 w-6" />
                  <span>New Ultrasound Examination</span>
                </h3>
                <p className="text-purple-100 text-sm mt-1">Professional veterinary ultrasound recording system</p>
              </div>
              <div className="flex items-center space-x-3">
                {draftSaved && (
                  <div className="flex items-center space-x-1 bg-green-500 bg-opacity-20 px-3 py-1 rounded-full">
                    <div className="h-2 w-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-100">Draft saved</span>
                  </div>
                )}
                {hasUnsavedChanges && (
                  <div className="flex items-center space-x-1 bg-yellow-500 bg-opacity-20 px-3 py-1 rounded-full">
                    <div className="h-2 w-2 bg-yellow-300 rounded-full"></div>
                    <span className="text-xs text-yellow-100">Unsaved changes</span>
                  </div>
                )}
                <button
                  onClick={handleCancelNewScan}
                  className="text-white hover:text-gray-300 p-1"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT COLUMN: Animal & Scan Info */}
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-600" />
                    Animal Information
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Animal ID</label>
                      <input
                        type="text"
                        value={newScanData.animalId}
                        onChange={(e) => handleScanDataChange('animalId', e.target.value)}
                        placeholder="e.g., BOV-2025-001"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Animal Name</label>
                      <input
                        type="text"
                        value={newScanData.animalName}
                        onChange={(e) => handleScanDataChange('animalName', e.target.value)}
                        placeholder="e.g., Luna"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Species</label>
                        <select
                          value={newScanData.species}
                          onChange={(e) => handleScanDataChange('species', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="BOVINE">Bovine</option>
                          <option value="EQUINE">Equine</option>
                          <option value="CAMEL">Camel</option>
                          <option value="OVINE">Ovine</option>
                          <option value="CAPRINE">Caprine</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Animal Type</label>
                        <select
                          value={newScanData.animalType}
                          onChange={(e) => handleScanDataChange('animalType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="DONOR">Donor</option>
                          <option value="RECIPIENT">Recipient</option>
                          <option value="BREEDING">Breeding</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Monitor className="h-4 w-4 mr-2 text-green-600" />
                    Scan Configuration
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scan Type</label>
                      <select
                        value={newScanData.scanType}
                        onChange={(e) => handleScanDataChange('scanType', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="DONOR_FOLLICULAR">Donor - Follicular Check</option>
                        <option value="RECIPIENT_UTERUS">Recipient - Uterus Evaluation</option>
                        <option value="PREGNANCY_CHECK">Pregnancy Check</option>
                        <option value="POST_ET_FOLLOWUP">Post-ET Follow-Up</option>
                        <option value="BASELINE_ASSESSMENT">Baseline Assessment</option>
                        <option value="PROBLEM_INVESTIGATION">Problem Investigation</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Treatment Stage</label>
                      <input
                        type="text"
                        value={newScanData.treatmentStage}
                        onChange={(e) => handleScanDataChange('treatmentStage', e.target.value)}
                        placeholder="e.g., Superovulation Day 7"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scan Response</label>
                      <select
                        value={newScanData.scanScore}
                        onChange={(e) => handleScanDataChange('scanScore', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="GOOD">Good</option>
                        <option value="AVERAGE">Average</option>
                        <option value="POOR">Poor</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exam Room</label>
                        <select
                          value={newScanData.examRoom}
                          onChange={(e) => handleScanDataChange('examRoom', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        >
                          <option value="Ultrasound Room 1">Ultrasound Room 1</option>
                          <option value="Ultrasound Room 2">Ultrasound Room 2</option>
                          <option value="Mobile Unit 1">Mobile Unit 1</option>
                          <option value="Mobile Unit 2">Mobile Unit 2</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Next Scan Date</label>
                        <input
                          type="date"
                          value={newScanData.nextScanDate}
                          onChange={(e) => handleScanDataChange('nextScanDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-gray-600" />
                    Session Details
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Performed By</label>
                      <input
                        type="text"
                        value={newScanData.performedBy}
                        onChange={(e) => handleScanDataChange('performedBy', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Scan Time</label>
                      <input
                        type="time"
                        value={newScanData.scanTime}
                        onChange={(e) => handleScanDataChange('scanTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="autoSave"
                        checked={newScanData.autoSaveDraft}
                        onChange={(e) => handleScanDataChange('autoSaveDraft', e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="autoSave" className="text-sm text-gray-700">Auto-save draft</label>
                    </div>
                  </div>
                </div>
              </div>

              {/* MIDDLE COLUMN: Clinical Findings */}
              <div className="space-y-6">
                <div className="bg-purple-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Target className="h-4 w-4 mr-2 text-purple-600" />
                    Follicle Measurements
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Individual Follicles</span>
                      <button
                        onClick={handleAddFollicle}
                        className="px-3 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                      >
                        Add Follicle
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2">
                      {newScanData.follicles.map((follicle, index) => (
                        <div key={follicle.id} className="flex items-center space-x-2 bg-white p-2 rounded border">
                          <select
                            value={follicle.ovary}
                            onChange={(e) => handleUpdateFollicle(follicle.id, { ovary: e.target.value as 'LEFT' | 'RIGHT' })}
                            className="px-2 py-1 border rounded text-xs"
                          >
                            <option value="LEFT">L</option>
                            <option value="RIGHT">R</option>
                          </select>
                          <input
                            type="number"
                            value={follicle.diameter}
                            onChange={(e) => handleUpdateFollicle(follicle.id, { diameter: parseFloat(e.target.value) || 0 })}
                            placeholder="mm"
                            step="0.1"
                            min="0"
                            className="w-16 px-2 py-1 border rounded text-xs"
                          />
                          <span className="text-xs text-gray-500">mm</span>
                          <label className="flex items-center space-x-1">
                            <input
                              type="checkbox"
                              checked={follicle.isDominant}
                              onChange={(e) => handleUpdateFollicle(follicle.id, { isDominant: e.target.checked })}
                              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-xs text-gray-600">DOM</span>
                          </label>
                          <button
                            onClick={() => handleRemoveFollicle(follicle.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newScanData.leftCL}
                          onChange={(e) => handleScanDataChange('leftCL', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Left CL</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={newScanData.rightCL}
                          onChange={(e) => handleScanDataChange('rightCL', e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm text-gray-700">Right CL</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Stethoscope className="h-4 w-4 mr-2 text-pink-600" />
                    Uterine Assessment
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uterine Tone</label>
                      <select
                        value={newScanData.uterineScore.tone}
                        onChange={(e) => handleScanDataChange('uterineScore', { ...newScanData.uterineScore, tone: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value={0}>0 - Atonic</option>
                        <option value={1}>1 - Normal</option>
                        <option value={2}>2 - Hypertonic</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Uterine Edema</label>
                      <select
                        value={newScanData.uterineScore.edema}
                        onChange={(e) => handleScanDataChange('uterineScore', { ...newScanData.uterineScore, edema: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value={0}>0 - None</option>
                        <option value={1}>1 - Mild</option>
                        <option value={2}>2 - Moderate</option>
                        <option value={3}>3 - Severe</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pregnancy Status</label>
                      <select
                        value={newScanData.pregnancyStatus}
                        onChange={(e) => handleScanDataChange('pregnancyStatus', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                      >
                        <option value="">Not determined</option>
                        <option value="PREGNANT">Pregnant</option>
                        <option value="NOT_PREGNANT">Not Pregnant</option>
                        <option value="INCONCLUSIVE">Inconclusive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Clinical Notes</h4>
                  <textarea
                    rows={4}
                    value={newScanData.clinicalNotes}
                    onChange={(e) => handleScanDataChange('clinicalNotes', e.target.value)}
                    placeholder="Enter detailed clinical observations, recommendations, and notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 text-sm"
                  />
                </div>
              </div>

              {/* RIGHT COLUMN: Preview Summary */}
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                    <Eye className="h-4 w-4 mr-2 text-blue-600" />
                    Scan Preview Summary
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-gray-700 mb-2">Animal & Scan Info</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div><span className="font-medium">Animal:</span> {newScanData.animalName || 'Not specified'} ({newScanData.animalId || 'ID not set'})</div>
                        <div><span className="font-medium">Species:</span> {newScanData.species}</div>
                        <div><span className="font-medium">Type:</span> {newScanData.animalType}</div>
                        <div><span className="font-medium">Scan Type:</span> {newScanData.scanType.replace(/_/g, ' ')}</div>
                        <div><span className="font-medium">Stage:</span> {newScanData.treatmentStage || 'Not specified'}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-gray-700 mb-2">Follicle Summary</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div><span className="font-medium">Total Count:</span> {newScanData.follicles.length}</div>
                        <div><span className="font-medium">Dominant:</span> {newScanData.follicles.filter(f => f.isDominant).length}</div>
                        {newScanData.follicles.length > 0 && (
                          <div><span className="font-medium">Largest:</span> {Math.max(...newScanData.follicles.map(f => f.diameter))} mm</div>
                        )}
                        <div><span className="font-medium">Left CL:</span> {newScanData.leftCL ? 'Present' : 'Absent'}</div>
                        <div><span className="font-medium">Right CL:</span> {newScanData.rightCL ? 'Present' : 'Absent'}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-gray-700 mb-2">Uterine Assessment</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div><span className="font-medium">Tone:</span> {
                          (newScanData.uterineScore.tone as number) === 0 ? 'Atonic' :
                          (newScanData.uterineScore.tone as number) === 1 ? 'Normal' : 'Hypertonic'
                        }</div>
                        <div><span className="font-medium">Edema:</span> {
                          newScanData.uterineScore.edema === 0 ? 'None' :
                          newScanData.uterineScore.edema === 1 ? 'Mild' :
                          newScanData.uterineScore.edema === 2 ? 'Moderate' : 'Severe'
                        }</div>
                        <div><span className="font-medium">Pregnancy:</span> {newScanData.pregnancyStatus || 'Not determined'}</div>
                      </div>
                    </div>

                    <div className="bg-white rounded p-3 shadow-sm">
                      <div className="font-medium text-gray-700 mb-2">Session Details</div>
                      <div className="space-y-1 text-xs text-gray-600">
                        <div><span className="font-medium">Performed by:</span> {newScanData.performedBy}</div>
                        <div><span className="font-medium">Time:</span> {newScanData.scanTime}</div>
                        <div><span className="font-medium">Room:</span> {newScanData.examRoom}</div>
                        <div><span className="font-medium">Score:</span> 
                          <span className={`ml-1 ${
                            newScanData.scanScore === 'GOOD' ? 'text-green-600' :
                            newScanData.scanScore === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                          }`}>
                            {newScanData.scanScore}
                          </span>
                        </div>
                        {newScanData.nextScanDate && (
                          <div><span className="font-medium">Next scan:</span> {newScanData.nextScanDate}</div>
                        )}
                      </div>
                    </div>

                    {newScanData.clinicalNotes && (
                      <div className="bg-white rounded p-3 shadow-sm">
                        <div className="font-medium text-gray-700 mb-2">Clinical Notes</div>
                        <div className="text-xs text-gray-600 max-h-16 overflow-y-auto">
                          {newScanData.clinicalNotes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Star className="h-4 w-4 mr-2 text-yellow-600" />
                    Quick Assessment
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Scan Quality:</span>
                      <span className={`font-medium ${
                        newScanData.scanScore === 'GOOD' ? 'text-green-600' :
                        newScanData.scanScore === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {newScanData.scanScore}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion:</span>
                      <span className="font-medium text-blue-600">
                        {Math.round(((newScanData.animalName ? 1 : 0) + 
                                   (newScanData.animalId ? 1 : 0) + 
                                   (newScanData.treatmentStage ? 1 : 0) + 
                                   (newScanData.clinicalNotes ? 1 : 0)) / 4 * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Data entries:</span>
                      <span className="font-medium text-purple-600">{newScanData.follicles.length} follicles</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200 mt-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleCancelNewScan}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    localStorage.setItem('ultrasound_draft', JSON.stringify(newScanData));
                    alert('Draft saved successfully!');
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Save Draft
                </button>
              </div>
              <button
                onClick={handleSaveNewScan}
                disabled={!newScanData.animalName || !newScanData.animalId}
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Save Examination</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Modal Component
  const EditModal = () => {
    if (!showEditModal || !selectedRecord) return null;

    const [editNotes, setEditNotes] = useState(selectedRecord.clinicalNotes);
    const [editPregnancyStatus, setEditPregnancyStatus] = useState(selectedRecord.pregnancyStatus || '');

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                Edit Examination - {selectedRecord.sessionId}
              </h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pregnancy Status
              </label>
              <select
                value={editPregnancyStatus}
                onChange={(e) => setEditPregnancyStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Not determined</option>
                <option value="PREGNANT">Pregnant</option>
                <option value="NOT_PREGNANT">Not Pregnant</option>
                <option value="INCONCLUSIVE">Inconclusive</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Notes
              </label>
              <textarea
                rows={4}
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                placeholder="Enter clinical observations and notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveEdit(editNotes, editPregnancyStatus)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Analytics Modal Component
  const AnalyticsModal = () => {
    if (!showAnalytics) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6" />
                  <span>Ultrasound Analytics Dashboard</span>
                </h3>
                <p className="text-blue-100 text-sm mt-1">Comprehensive performance metrics and insights</p>
              </div>
              <button
                onClick={() => setShowAnalytics(false)}
                className="text-white hover:text-gray-300 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Summary Stats */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Performance Summary
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analytics.totalScans}</div>
                    <div className="text-sm text-gray-600">Total Scans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{analytics.avgFollicles}</div>
                    <div className="text-sm text-gray-600">Avg Follicles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{analytics.pregnancyRate}%</div>
                    <div className="text-sm text-gray-600">Pregnancy Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{Object.keys(analytics.vetPerformance).length}</div>
                    <div className="text-sm text-gray-600">Active Vets</div>
                  </div>
                </div>
              </div>

              {/* Scan Types Distribution */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Scan Types Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.scansByType).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{type.replace(/_/g, ' ')}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(count / analytics.totalScans) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scan Scores Distribution */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Quality Scores Distribution</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.scansByScore).map(([score, count]) => (
                    <div key={score} className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${
                        score === 'GOOD' ? 'text-green-600' :
                        score === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                      }`}>{score}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              score === 'GOOD' ? 'bg-green-500' :
                              score === 'AVERAGE' ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${(count / analytics.totalScans) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Veterinarian Performance */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Veterinarian Performance</h4>
                <div className="space-y-3">
                  {Object.entries(analytics.vetPerformance).map(([vet, data]) => (
                    <div key={vet} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vet}</div>
                        <div className="text-xs text-gray-500">{data.scans} scans</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className={`h-4 w-4 ${
                          data.avgScore === 'GOOD' ? 'text-green-500' :
                          data.avgScore === 'AVERAGE' ? 'text-yellow-500' : 'text-red-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          data.avgScore === 'GOOD' ? 'text-green-600' :
                          data.avgScore === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{data.avgScore}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weekly Trends */}
              <div className="bg-white rounded-lg p-6 border border-gray-200 lg:col-span-2">
                <h4 className="font-semibold text-gray-900 mb-4">Weekly Scan Trends</h4>
                <div className="flex items-end space-x-2 h-32">
                  {analytics.trends.weeklyScans.map((count, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="bg-blue-500 rounded-t w-full"
                        style={{ height: `${(count / Math.max(...analytics.trends.weeklyScans)) * 100}%` }}
                      ></div>
                      <div className="text-xs text-gray-500 mt-1">W{index + 1}</div>
                      <div className="text-xs font-medium text-gray-700">{count}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowAnalytics(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Export Modal Component
  const ExportModal = () => {
    if (!showExportModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Download className="h-5 w-5 text-green-600" />
                  <span>Export Data</span>
                </h3>
                <p className="text-gray-600 text-sm mt-1">Choose your export format</p>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              <div className="text-sm text-gray-600 mb-4">
                Exporting {filteredRecords.length} records
              </div>

              <button
                onClick={() => {
                  handleExportCSV();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-6 w-6 text-green-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">CSV Export</div>
                  <div className="text-sm text-gray-600">Spreadsheet-compatible format</div>
                </div>
              </button>

              <button
                onClick={() => {
                  handleExportPDF();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FileText className="h-6 w-6 text-red-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">PDF Report</div>
                  <div className="text-sm text-gray-600">Professional examination report</div>
                </div>
              </button>

              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Printer className="h-6 w-6 text-blue-600" />
                <div className="text-left">
                  <div className="font-medium text-gray-900">Print View</div>
                  <div className="text-sm text-gray-600">Print current page</div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Monitor className="h-8 w-8 text-purple-600" />
              <span>🔬 Ultrasound Records</span>
            </h1>
            <p className="text-gray-600 mt-1">
              Reproductive ultrasound examination records and management
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnalytics(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
            >
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Analytics</span>
            </button>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span className="text-sm">Export</span>
            </button>
            <button
              onClick={loadDemoData}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="text-sm">Refresh</span>
            </button>
            <button
              onClick={handleNewScan}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <Plus className="h-5 w-5" />
              <span>New Examination</span>
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Monitor className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.totalExams}</div>
              <div className="text-xs text-gray-600">Total Exams</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.todayExams}</div>
              <div className="text-xs text-gray-600">Today's Exams</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.uniqueAnimals}</div>
              <div className="text-xs text-gray-600">Unique Animals</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Target className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.avgFollicles}</div>
              <div className="text-xs text-gray-600">Avg Follicles</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-pink-100 rounded-lg">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.pregnancyRate}%</div>
              <div className="text-xs text-gray-600">Pregnancy Rate</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Monitor className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{stats.weekExams}</div>
              <div className="text-xs text-gray-600">This Week</div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4">
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search animals, sessions, veterinarians, or notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                showAdvancedFilters ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">Advanced Filters</span>
              {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            {(Object.values(filters.scanTypes).some(arr => arr.length > 0) || 
              filters.dateRange.start || filters.dateRange.end ||
              filters.follicleRange.min || filters.follicleRange.max) && (
              <button
                onClick={clearAllFilters}
                className="flex items-center space-x-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                <X className="h-4 w-4" />
                <span>Clear Filters</span>
              </button>
            )}
          </div>

          {/* Advanced Filters Panel */}
          {showAdvancedFilters && (
            <div className="border-t pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={filters.dateRange.start}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Start date"
                    />
                    <input
                      type="date"
                      value={filters.dateRange.end}
                      onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="End date"
                    />
                  </div>
                </div>

                {/* Scan Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scan Types</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {['DONOR_FOLLICULAR', 'RECIPIENT_UTERUS', 'PREGNANCY_CHECK', 'POST_ET_FOLLOWUP', 'BASELINE_ASSESSMENT', 'PROBLEM_INVESTIGATION'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.scanTypes.includes(type)}
                          onChange={(e) => handleMultiSelectFilter('scanTypes', type, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-600">{type.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Scan Scores */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Scan Scores</label>
                  <div className="space-y-1">
                    {['GOOD', 'AVERAGE', 'POOR'].map(score => (
                      <label key={score} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.scanScores.includes(score)}
                          onChange={(e) => handleMultiSelectFilter('scanScores', score, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className={`text-xs font-medium ${
                          score === 'GOOD' ? 'text-green-600' :
                          score === 'AVERAGE' ? 'text-yellow-600' : 'text-red-600'
                        }`}>{score}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Follicle Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Follicle Count</label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.follicleRange.min}
                      onChange={(e) => handleFilterChange('follicleRange', { ...filters.follicleRange, min: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.follicleRange.max}
                      onChange={(e) => handleFilterChange('follicleRange', { ...filters.follicleRange, max: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>

                {/* Species Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                  <div className="space-y-1">
                    {['BOVINE', 'EQUINE', 'CAMEL', 'OVINE', 'CAPRINE'].map(species => (
                      <label key={species} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.species.includes(species)}
                          onChange={(e) => handleMultiSelectFilter('species', species, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-600">{species}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Animal Types */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Animal Types</label>
                  <div className="space-y-1">
                    {['DONOR', 'RECIPIENT', 'BREEDING'].map(type => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.animalTypes.includes(type)}
                          onChange={(e) => handleMultiSelectFilter('animalTypes', type, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-600">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pregnancy Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pregnancy Status</label>
                  <div className="space-y-1">
                    {['PREGNANT', 'NOT_PREGNANT', 'INCONCLUSIVE'].map(status => (
                      <label key={status} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.pregnancyStatus.includes(status)}
                          onChange={(e) => handleMultiSelectFilter('pregnancyStatus', status, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-600">{status.replace(/_/g, ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Veterinarians */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Veterinarians</label>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {Array.from(new Set(records.map(r => r.performedBy))).map(vet => (
                      <label key={vet} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filters.veterinarians.includes(vet)}
                          onChange={(e) => handleMultiSelectFilter('veterinarians', vet, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-xs text-gray-600">{vet}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>

              {/* Applied Filters Summary */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredRecords.length} of {records.length} records
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {filters.scanTypes.map(type => (
                      <span key={type} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                        {type.replace(/_/g, ' ')}
                        <button 
                          onClick={() => handleMultiSelectFilter('scanTypes', type, false)}
                          className="ml-1 hover:text-purple-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    {filters.scanScores.map(score => (
                      <span key={score} className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        score === 'GOOD' ? 'bg-green-100 text-green-800' :
                        score === 'AVERAGE' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {score}
                        <button 
                          onClick={() => handleMultiSelectFilter('scanScores', score, false)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Examination Records ({filteredRecords.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scan Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Follicles</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clinical Findings</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Veterinarian</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{record.date}</div>
                    <div className="text-xs text-gray-500">{record.sessionId}</div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-purple-800">
                            {record.animalName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{record.animalName}</div>
                        <div className="text-xs text-gray-500">
                          {record.animalId} • {record.species}
                        </div>
                        <div className="text-xs">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            record.animalType === 'DONOR' ? 'bg-blue-100 text-blue-800' :
                            record.animalType === 'RECIPIENT' ? 'bg-green-100 text-green-800' :
                            record.animalType === 'BREEDING' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.animalType}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        record.scanType === 'DONOR_FOLLICULAR' ? 'bg-blue-100 text-blue-800' :
                        record.scanType === 'RECIPIENT_UTERUS' ? 'bg-green-100 text-green-800' :
                        record.scanType === 'PREGNANCY_CHECK' ? 'bg-pink-100 text-pink-800' :
                        record.scanType === 'POST_ET_FOLLOWUP' ? 'bg-purple-100 text-purple-800' :
                        record.scanType === 'BASELINE_ASSESSMENT' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.scanType.replace(/_/g, ' ')}
                      </div>
                      <div className="text-xs text-gray-500">{record.treatmentStage}</div>
                      <div className="flex items-center space-x-1">
                        <Star className={`h-3 w-3 ${
                          record.scanScore === 'GOOD' ? 'text-green-500' :
                          record.scanScore === 'AVERAGE' ? 'text-yellow-500' :
                          'text-red-500'
                        }`} />
                        <span className="text-xs text-gray-500">{record.scanScore}</span>
                      </div>
                    </div>
                  </td>
                  
                                  <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <span className="text-lg font-bold text-gray-900">{record.follicleCount}</span>
                      <span className="text-xs text-gray-500">total</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {record.dominantFollicles} dominant
                    </div>
                  </div>
                  {record.follicles.length > 0 && (
                    <div className="mt-1 space-y-1">
                      <div className="text-xs text-gray-600">Diameters (mm):</div>
                      <div className="flex flex-wrap gap-1">
                        {record.follicles.slice(0, 4).map((follicle) => (
                          <span 
                            key={follicle.id}
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              follicle.isDominant ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                            }`}
                            title={`${follicle.ovary} ovary${follicle.isDominant ? ' (dominant)' : ''}`}
                          >
                            {follicle.diameter}
                          </span>
                        ))}
                        {record.follicles.length > 4 && (
                          <span className="text-xs text-gray-500">+{record.follicles.length - 4} more</span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ 
                          width: `${Math.min(record.follicleCount / 20 * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {record.leftCL && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          CL-L
                        </span>
                      )}
                      {record.rightCL && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          CL-R
                        </span>
                      )}
                      {record.uterineTone !== 'NORMAL' && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                          {record.uterineTone}
                        </span>
                      )}
                      {record.pregnancyStatus && (
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          record.pregnancyStatus === 'PREGNANT' ? 'bg-pink-100 text-pink-800' :
                          record.pregnancyStatus === 'NOT_PREGNANT' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {record.pregnancyStatus}
                        </span>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <Stethoscope className="h-4 w-4 text-gray-400" />
                      <span>{record.veterinarian}</span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleView(record)}
                        className="p-1 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(record)}
                        className="p-1 text-green-600 hover:text-green-900 hover:bg-green-50 rounded transition-colors"
                        title="Edit Record"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(record)}
                        className="p-1 text-red-600 hover:text-red-900 hover:bg-red-50 rounded transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="text-center py-8">
            <Monitor className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No examination records found</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Try adjusting your search terms' : 'Start by adding a new examination record'}
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewModal />
      <EditModal />
      <NewScanModal />
      <AnalyticsModal />
      <ExportModal />
    </div>
  );
};

export default UltrasoundPage; 