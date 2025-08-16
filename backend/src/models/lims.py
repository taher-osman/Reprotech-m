"""
Advanced Laboratory Information Management System (LIMS) Models
Comprehensive sample tracking, test management, and quality control
"""

from datetime import datetime
from typing import Dict, List, Optional, Any
import json

class Sample:
    """Comprehensive sample management with full traceability"""
    
    def __init__(self):
        self.sample_data = {
            # Sample Identification
            "sample_id": "SAMP-2024-001234",
            "barcode": "SAM240816001234",
            "qr_code": "QR-SAM-240816-001234",
            "internal_id": "GVF-BOV-001-BLD-240816",
            "external_id": "EXT-REF-789456",
            
            # Sample Details
            "sample_type": "blood",  # blood, urine, tissue, milk, semen, embryo, dna, rna
            "sample_subtype": "whole_blood",  # serum, plasma, whole_blood, etc.
            "collection_method": "venipuncture",
            "container_type": "edta_tube",
            "volume_ml": 10.0,
            "collection_date": "2024-08-16T08:30:00",
            "collection_time": "08:30:00",
            
            # Source Information
            "animal_id": "HOL-1247",
            "animal_name": "Bella",
            "species": "bovine",
            "breed": "Holstein",
            "branch_id": 1,
            "branch_name": "Green Valley Farm - Main Campus",
            "customer_id": 1,
            
            # Collection Details
            "collected_by": "Dr. Smith",
            "collection_location": "Milking Parlor A",
            "collection_notes": "Morning collection, animal fasted 12 hours",
            "collection_conditions": "Room temperature, sterile conditions",
            "anatomical_site": "jugular_vein",
            
            # Sample Processing
            "received_date": "2024-08-16T09:15:00",
            "received_by": "Lab Tech Johnson",
            "processing_date": "2024-08-16T09:30:00",
            "processed_by": "Lab Tech Davis",
            "processing_notes": "Centrifuged at 3000 RPM for 10 minutes",
            
            # Storage Information
            "storage_location": "Freezer A-1, Rack 5, Position 23",
            "storage_temperature": -80,
            "storage_conditions": "Ultra-low freezer, nitrogen backup",
            "storage_date": "2024-08-16T10:00:00",
            "expiry_date": "2025-08-16T10:00:00",
            
            # Quality Control
            "quality_status": "approved",  # pending, approved, rejected, quarantine
            "quality_notes": "Sample integrity confirmed, no hemolysis",
            "quality_checked_by": "QC Supervisor Wilson",
            "quality_check_date": "2024-08-16T09:45:00",
            
            # Chain of Custody
            "chain_of_custody": [
                {
                    "timestamp": "2024-08-16T08:30:00",
                    "action": "collected",
                    "person": "Dr. Smith",
                    "location": "Milking Parlor A",
                    "notes": "Sample collected from animal HOL-1247"
                },
                {
                    "timestamp": "2024-08-16T09:15:00",
                    "action": "received",
                    "person": "Lab Tech Johnson",
                    "location": "Sample Reception",
                    "notes": "Sample received in good condition"
                },
                {
                    "timestamp": "2024-08-16T09:30:00",
                    "action": "processed",
                    "person": "Lab Tech Davis",
                    "location": "Processing Lab",
                    "notes": "Sample processed and aliquoted"
                }
            ],
            
            # Status and Workflow
            "status": "in_testing",  # collected, received, processing, in_testing, completed, archived
            "priority": "routine",  # routine, urgent, stat, research
            "workflow_stage": "testing",
            "completion_percentage": 65,
            
            # Associated Tests
            "requested_tests": [
                "complete_blood_count",
                "blood_chemistry_panel",
                "liver_function_tests",
                "genetic_markers"
            ],
            "completed_tests": [
                "complete_blood_count",
                "blood_chemistry_panel"
            ],
            "pending_tests": [
                "liver_function_tests",
                "genetic_markers"
            ],
            
            # Metadata
            "created_at": "2024-08-16T08:30:00",
            "updated_at": "2024-08-16T14:30:00",
            "created_by": "Dr. Smith",
            "updated_by": "Lab Tech Davis"
        }

class TestType:
    """Comprehensive test type management with protocols"""
    
    def __init__(self):
        self.test_types = [
            {
                "test_id": "CBT-001",
                "test_code": "CBC",
                "test_name": "Complete Blood Count",
                "category": "hematology",
                "subcategory": "routine_hematology",
                "description": "Comprehensive blood cell analysis including RBC, WBC, platelets",
                
                # Test Specifications
                "sample_type": "blood",
                "sample_volume_required": 3.0,
                "container_type": "edta_tube",
                "processing_time_hours": 2,
                "turnaround_time_hours": 4,
                
                # Parameters Measured
                "parameters": [
                    {
                        "parameter": "red_blood_cells",
                        "unit": "x10^6/μL",
                        "reference_range_min": 5.0,
                        "reference_range_max": 10.0,
                        "critical_low": 3.0,
                        "critical_high": 15.0
                    },
                    {
                        "parameter": "white_blood_cells",
                        "unit": "x10^3/μL",
                        "reference_range_min": 4.0,
                        "reference_range_max": 12.0,
                        "critical_low": 2.0,
                        "critical_high": 20.0
                    },
                    {
                        "parameter": "hemoglobin",
                        "unit": "g/dL",
                        "reference_range_min": 8.0,
                        "reference_range_max": 15.0,
                        "critical_low": 6.0,
                        "critical_high": 18.0
                    },
                    {
                        "parameter": "hematocrit",
                        "unit": "%",
                        "reference_range_min": 24.0,
                        "reference_range_max": 46.0,
                        "critical_low": 18.0,
                        "critical_high": 55.0
                    },
                    {
                        "parameter": "platelets",
                        "unit": "x10^3/μL",
                        "reference_range_min": 100.0,
                        "reference_range_max": 800.0,
                        "critical_low": 50.0,
                        "critical_high": 1200.0
                    }
                ],
                
                # Equipment and Methods
                "equipment_required": [
                    "Automated Hematology Analyzer (Sysmex XN-1000)",
                    "Microscope for manual differential",
                    "Centrifuge"
                ],
                "methodology": "Automated flow cytometry with manual verification",
                "calibration_frequency": "daily",
                "quality_control_frequency": "every_batch",
                
                # Cost and Billing
                "cost_per_test": 25.50,
                "billing_code": "85025",
                "insurance_coverage": true,
                
                # Regulatory and Compliance
                "accreditation_required": true,
                "clia_complexity": "moderate",
                "fda_approved": true,
                "iso_standard": "ISO 15189:2012",
                
                # Status
                "status": "active",
                "created_date": "2024-01-01T00:00:00",
                "last_updated": "2024-08-16T10:00:00"
            },
            {
                "test_id": "BCH-001",
                "test_code": "CHEM",
                "test_name": "Comprehensive Metabolic Panel",
                "category": "clinical_chemistry",
                "subcategory": "metabolic_panel",
                "description": "Complete metabolic analysis including glucose, electrolytes, kidney and liver function",
                
                "sample_type": "serum",
                "sample_volume_required": 2.0,
                "container_type": "serum_separator_tube",
                "processing_time_hours": 1.5,
                "turnaround_time_hours": 3,
                
                "parameters": [
                    {
                        "parameter": "glucose",
                        "unit": "mg/dL",
                        "reference_range_min": 45.0,
                        "reference_range_max": 75.0,
                        "critical_low": 30.0,
                        "critical_high": 400.0
                    },
                    {
                        "parameter": "blood_urea_nitrogen",
                        "unit": "mg/dL",
                        "reference_range_min": 6.0,
                        "reference_range_max": 27.0,
                        "critical_low": 2.0,
                        "critical_high": 100.0
                    },
                    {
                        "parameter": "creatinine",
                        "unit": "mg/dL",
                        "reference_range_min": 1.0,
                        "reference_range_max": 2.0,
                        "critical_low": 0.5,
                        "critical_high": 10.0
                    },
                    {
                        "parameter": "total_protein",
                        "unit": "g/dL",
                        "reference_range_min": 5.7,
                        "reference_range_max": 8.9,
                        "critical_low": 4.0,
                        "critical_high": 12.0
                    },
                    {
                        "parameter": "albumin",
                        "unit": "g/dL",
                        "reference_range_min": 2.5,
                        "reference_range_max": 4.4,
                        "critical_low": 1.5,
                        "critical_high": 6.0
                    }
                ],
                
                "equipment_required": [
                    "Clinical Chemistry Analyzer (Roche Cobas c702)",
                    "Automated Sample Processor",
                    "Refrigerated Centrifuge"
                ],
                "methodology": "Automated spectrophotometry and ion-selective electrode",
                "calibration_frequency": "daily",
                "quality_control_frequency": "every_batch",
                
                "cost_per_test": 45.75,
                "billing_code": "80053",
                "insurance_coverage": true,
                
                "accreditation_required": true,
                "clia_complexity": "moderate",
                "fda_approved": true,
                "iso_standard": "ISO 15189:2012",
                
                "status": "active",
                "created_date": "2024-01-01T00:00:00",
                "last_updated": "2024-08-16T10:00:00"
            },
            {
                "test_id": "GEN-001",
                "test_code": "SNP",
                "test_name": "SNP Genotyping Panel",
                "category": "molecular_genetics",
                "subcategory": "snp_analysis",
                "description": "Single nucleotide polymorphism analysis for genetic markers and breeding values",
                
                "sample_type": "dna",
                "sample_volume_required": 50.0,
                "container_type": "dna_extraction_tube",
                "processing_time_hours": 48,
                "turnaround_time_hours": 72,
                
                "parameters": [
                    {
                        "parameter": "snp_call_rate",
                        "unit": "%",
                        "reference_range_min": 95.0,
                        "reference_range_max": 100.0,
                        "critical_low": 90.0,
                        "critical_high": 100.0
                    },
                    {
                        "parameter": "heterozygosity_rate",
                        "unit": "%",
                        "reference_range_min": 25.0,
                        "reference_range_max": 35.0,
                        "critical_low": 15.0,
                        "critical_high": 45.0
                    },
                    {
                        "parameter": "inbreeding_coefficient",
                        "unit": "F",
                        "reference_range_min": -0.05,
                        "reference_range_max": 0.15,
                        "critical_low": -0.10,
                        "critical_high": 0.30
                    }
                ],
                
                "equipment_required": [
                    "Illumina BeadChip Scanner",
                    "DNA Extraction Robot",
                    "PCR Thermal Cyclers",
                    "Automated Liquid Handlers"
                ],
                "methodology": "Illumina Infinium BeadChip technology with automated analysis",
                "calibration_frequency": "weekly",
                "quality_control_frequency": "every_plate",
                
                "cost_per_test": 125.00,
                "billing_code": "81479",
                "insurance_coverage": false,
                
                "accreditation_required": true,
                "clia_complexity": "high",
                "fda_approved": false,
                "iso_standard": "ISO 15189:2012",
                
                "status": "active",
                "created_date": "2024-01-01T00:00:00",
                "last_updated": "2024-08-16T10:00:00"
            }
        ]

class TestResult:
    """Comprehensive test result management with full traceability"""
    
    def __init__(self):
        self.test_results = [
            {
                # Result Identification
                "result_id": "RES-2024-001234",
                "sample_id": "SAMP-2024-001234",
                "test_id": "CBT-001",
                "test_code": "CBC",
                "test_name": "Complete Blood Count",
                
                # Test Execution
                "test_date": "2024-08-16T10:30:00",
                "completion_date": "2024-08-16T12:30:00",
                "technician": "Lab Tech Davis",
                "supervisor": "Lab Supervisor Wilson",
                "equipment_used": "Sysmex XN-1000 #SN123456",
                "batch_number": "BATCH-240816-001",
                
                # Results Data
                "results": [
                    {
                        "parameter": "red_blood_cells",
                        "value": 7.2,
                        "unit": "x10^6/μL",
                        "reference_range": "5.0-10.0",
                        "status": "normal",
                        "flag": "",
                        "critical": false
                    },
                    {
                        "parameter": "white_blood_cells",
                        "value": 8.5,
                        "unit": "x10^3/μL",
                        "reference_range": "4.0-12.0",
                        "status": "normal",
                        "flag": "",
                        "critical": false
                    },
                    {
                        "parameter": "hemoglobin",
                        "value": 12.3,
                        "unit": "g/dL",
                        "reference_range": "8.0-15.0",
                        "status": "normal",
                        "flag": "",
                        "critical": false
                    },
                    {
                        "parameter": "hematocrit",
                        "value": 36.8,
                        "unit": "%",
                        "reference_range": "24.0-46.0",
                        "status": "normal",
                        "flag": "",
                        "critical": false
                    },
                    {
                        "parameter": "platelets",
                        "value": 425,
                        "unit": "x10^3/μL",
                        "reference_range": "100-800",
                        "status": "normal",
                        "flag": "",
                        "critical": false
                    }
                ],
                
                # Quality Control
                "qc_status": "passed",
                "qc_notes": "All controls within acceptable limits",
                "qc_checked_by": "QC Supervisor Wilson",
                "qc_check_date": "2024-08-16T12:45:00",
                
                # Clinical Interpretation
                "interpretation": "Complete blood count within normal limits for Holstein dairy cow. No evidence of anemia, infection, or bleeding disorders.",
                "clinical_significance": "Normal hematological profile supports good health status.",
                "recommendations": "Continue routine monitoring. Repeat CBC in 6 months or if clinical signs develop.",
                "interpreted_by": "Dr. Sarah Mitchell, DVM, PhD",
                "interpretation_date": "2024-08-16T13:00:00",
                
                # Status and Workflow
                "status": "completed",  # pending, in_progress, completed, verified, reported
                "verification_status": "verified",
                "verified_by": "Lab Director Dr. Chen",
                "verification_date": "2024-08-16T13:15:00",
                "report_status": "sent",
                "report_sent_date": "2024-08-16T13:30:00",
                
                # Notifications
                "notifications_sent": [
                    {
                        "recipient": "Dr. Smith",
                        "method": "email",
                        "timestamp": "2024-08-16T13:30:00",
                        "status": "delivered"
                    },
                    {
                        "recipient": "Green Valley Farm",
                        "method": "portal",
                        "timestamp": "2024-08-16T13:30:00",
                        "status": "viewed"
                    }
                ],
                
                # Metadata
                "created_at": "2024-08-16T10:30:00",
                "updated_at": "2024-08-16T13:30:00",
                "created_by": "Lab Tech Davis",
                "updated_by": "Lab Director Dr. Chen"
            }
        ]

class Equipment:
    """Laboratory equipment management with calibration and maintenance"""
    
    def __init__(self):
        self.equipment_data = [
            {
                # Equipment Identification
                "equipment_id": "EQ-001",
                "serial_number": "SN123456789",
                "asset_tag": "LAB-HEMA-001",
                "equipment_name": "Sysmex XN-1000",
                "manufacturer": "Sysmex Corporation",
                "model": "XN-1000",
                "category": "hematology_analyzer",
                
                # Location and Assignment
                "location": "Hematology Lab - Station 1",
                "branch_id": 2,
                "branch_name": "University Research Center - Genetics Lab",
                "department": "Clinical Laboratory",
                "responsible_person": "Lab Tech Davis",
                
                # Technical Specifications
                "specifications": {
                    "throughput": "100 samples/hour",
                    "sample_volume": "88 μL",
                    "parameters": "29 parameters + 5-part differential",
                    "technology": "Flow cytometry + Fluorescence flow cytometry",
                    "connectivity": "LIS interface, barcode reader"
                },
                
                # Status and Condition
                "status": "operational",  # operational, maintenance, calibration, out_of_service
                "condition": "excellent",
                "installation_date": "2023-06-15T00:00:00",
                "warranty_expiry": "2026-06-15T00:00:00",
                "service_contract": "Full service contract with Sysmex",
                
                # Calibration Management
                "calibration_status": "current",
                "last_calibration_date": "2024-08-15T08:00:00",
                "next_calibration_date": "2024-08-16T08:00:00",
                "calibration_frequency": "daily",
                "calibration_procedure": "Automated daily calibration with certified reference materials",
                "calibration_technician": "Lab Tech Johnson",
                
                # Quality Control
                "qc_status": "passed",
                "last_qc_date": "2024-08-16T08:30:00",
                "next_qc_date": "2024-08-16T20:30:00",
                "qc_frequency": "every_12_hours",
                "qc_materials": ["Normal Control", "Abnormal Control Level 1", "Abnormal Control Level 2"],
                
                # Maintenance Schedule
                "maintenance_status": "current",
                "last_maintenance_date": "2024-08-01T00:00:00",
                "next_maintenance_date": "2024-09-01T00:00:00",
                "maintenance_frequency": "monthly",
                "maintenance_type": "preventive",
                "maintenance_notes": "Routine cleaning and performance verification completed",
                
                # Performance Metrics
                "uptime_percentage": 98.5,
                "error_rate": 0.02,
                "throughput_efficiency": 95.2,
                "last_performance_check": "2024-08-16T07:00:00",
                
                # Cost Information
                "purchase_cost": 125000.00,
                "annual_service_cost": 15000.00,
                "cost_per_test": 2.50,
                "depreciation_rate": 10.0,
                
                # Compliance and Certification
                "certifications": ["FDA 510(k)", "CE Mark", "ISO 13485"],
                "regulatory_status": "compliant",
                "last_inspection_date": "2024-07-15T00:00:00",
                "next_inspection_date": "2025-07-15T00:00:00",
                
                # Usage Statistics
                "total_tests_performed": 45678,
                "tests_this_month": 2345,
                "average_daily_usage": 78,
                "peak_usage_time": "09:00-11:00",
                
                # Metadata
                "created_at": "2023-06-15T00:00:00",
                "updated_at": "2024-08-16T08:30:00",
                "created_by": "Lab Manager",
                "updated_by": "Lab Tech Davis"
            },
            {
                "equipment_id": "EQ-002",
                "serial_number": "RC789456123",
                "asset_tag": "LAB-CHEM-001",
                "equipment_name": "Roche Cobas c702",
                "manufacturer": "Roche Diagnostics",
                "model": "Cobas c702",
                "category": "clinical_chemistry_analyzer",
                
                "location": "Clinical Chemistry Lab - Station 1",
                "branch_id": 2,
                "branch_name": "University Research Center - Genetics Lab",
                "department": "Clinical Laboratory",
                "responsible_person": "Lab Tech Miller",
                
                "specifications": {
                    "throughput": "2000 tests/hour",
                    "sample_volume": "1.5-35 μL",
                    "parameters": "100+ clinical chemistry parameters",
                    "technology": "Photometric and ion-selective electrode",
                    "connectivity": "Full LIS integration, STAT processing"
                },
                
                "status": "operational",
                "condition": "good",
                "installation_date": "2023-09-20T00:00:00",
                "warranty_expiry": "2026-09-20T00:00:00",
                "service_contract": "Comprehensive service agreement with Roche",
                
                "calibration_status": "current",
                "last_calibration_date": "2024-08-16T06:00:00",
                "next_calibration_date": "2024-08-17T06:00:00",
                "calibration_frequency": "daily",
                "calibration_procedure": "Automated calibration with certified calibrators",
                "calibration_technician": "Lab Tech Miller",
                
                "qc_status": "passed",
                "last_qc_date": "2024-08-16T06:30:00",
                "next_qc_date": "2024-08-16T18:30:00",
                "qc_frequency": "every_12_hours",
                "qc_materials": ["PreciControl ClinChem Multi 1", "PreciControl ClinChem Multi 2"],
                
                "maintenance_status": "current",
                "last_maintenance_date": "2024-07-20T00:00:00",
                "next_maintenance_date": "2024-08-20T00:00:00",
                "maintenance_frequency": "monthly",
                "maintenance_type": "preventive",
                "maintenance_notes": "Probe cleaning and system verification completed",
                
                "uptime_percentage": 99.2,
                "error_rate": 0.01,
                "throughput_efficiency": 97.8,
                "last_performance_check": "2024-08-16T06:00:00",
                
                "purchase_cost": 185000.00,
                "annual_service_cost": 22000.00,
                "cost_per_test": 1.85,
                "depreciation_rate": 10.0,
                
                "certifications": ["FDA 510(k)", "CE Mark", "ISO 13485", "CLIA Waived"],
                "regulatory_status": "compliant",
                "last_inspection_date": "2024-07-15T00:00:00",
                "next_inspection_date": "2025-07-15T00:00:00",
                
                "total_tests_performed": 78945,
                "tests_this_month": 4567,
                "average_daily_usage": 152,
                "peak_usage_time": "08:00-12:00",
                
                "created_at": "2023-09-20T00:00:00",
                "updated_at": "2024-08-16T06:30:00",
                "created_by": "Lab Manager",
                "updated_by": "Lab Tech Miller"
            }
        ]

class QualityControl:
    """Quality control and compliance management"""
    
    def __init__(self):
        self.qc_data = {
            # QC Program Overview
            "program_name": "Comprehensive Laboratory Quality Control Program",
            "program_version": "2024.1",
            "effective_date": "2024-01-01T00:00:00",
            "next_review_date": "2024-12-31T00:00:00",
            "program_manager": "QC Supervisor Wilson",
            
            # Accreditation and Compliance
            "accreditations": [
                {
                    "organization": "College of American Pathologists (CAP)",
                    "accreditation_number": "CAP-12345",
                    "status": "current",
                    "expiry_date": "2025-06-30T00:00:00",
                    "last_inspection": "2024-06-15T00:00:00",
                    "next_inspection": "2025-06-15T00:00:00"
                },
                {
                    "organization": "Clinical Laboratory Improvement Amendments (CLIA)",
                    "accreditation_number": "CLIA-67890",
                    "status": "current",
                    "expiry_date": "2026-03-31T00:00:00",
                    "last_inspection": "2024-03-20T00:00:00",
                    "next_inspection": "2026-03-20T00:00:00"
                },
                {
                    "organization": "ISO 15189:2012",
                    "accreditation_number": "ISO-15189-001",
                    "status": "current",
                    "expiry_date": "2025-12-31T00:00:00",
                    "last_audit": "2024-01-15T00:00:00",
                    "next_audit": "2025-01-15T00:00:00"
                }
            ],
            
            # Quality Metrics
            "current_metrics": {
                "overall_qc_pass_rate": 98.7,
                "equipment_uptime": 99.1,
                "turnaround_time_compliance": 96.5,
                "critical_value_notification_rate": 100.0,
                "proficiency_testing_success_rate": 99.2,
                "customer_satisfaction_score": 4.8,
                "error_rate": 0.03,
                "repeat_rate": 1.2
            },
            
            # Proficiency Testing
            "proficiency_testing": [
                {
                    "provider": "College of American Pathologists (CAP)",
                    "program": "Comprehensive Chemistry Survey",
                    "survey_code": "C-A",
                    "last_participation": "2024-07-01T00:00:00",
                    "results": "Acceptable - All analytes",
                    "score": 100,
                    "next_participation": "2024-10-01T00:00:00"
                },
                {
                    "provider": "College of American Pathologists (CAP)",
                    "program": "Hematology Survey",
                    "survey_code": "H-A",
                    "last_participation": "2024-06-01T00:00:00",
                    "results": "Acceptable - All parameters",
                    "score": 98,
                    "next_participation": "2024-09-01T00:00:00"
                }
            ],
            
            # Document Control
            "document_control": {
                "total_procedures": 45,
                "current_procedures": 45,
                "overdue_reviews": 0,
                "last_document_review": "2024-07-01T00:00:00",
                "next_document_review": "2024-10-01T00:00:00",
                "document_control_manager": "QC Supervisor Wilson"
            },
            
            # Training and Competency
            "training_program": {
                "total_staff": 12,
                "current_competency": 12,
                "overdue_training": 0,
                "last_competency_assessment": "2024-06-01T00:00:00",
                "next_competency_assessment": "2024-12-01T00:00:00",
                "training_coordinator": "Lab Manager Dr. Chen"
            }
        }

def get_lims_sample_data():
    """Get comprehensive LIMS sample data"""
    sample = Sample()
    return sample.sample_data

def get_lims_test_types():
    """Get available test types"""
    test_type = TestType()
    return test_type.test_types

def get_lims_test_results():
    """Get test results data"""
    test_result = TestResult()
    return test_result.test_results

def get_lims_equipment_data():
    """Get equipment management data"""
    equipment = Equipment()
    return equipment.equipment_data

def get_lims_qc_data():
    """Get quality control data"""
    qc = QualityControl()
    return qc.qc_data

def get_lims_dashboard_stats():
    """Get LIMS dashboard statistics"""
    return {
        "total_samples": 1247,
        "samples_today": 23,
        "pending_tests": 45,
        "completed_tests": 1189,
        "critical_results": 3,
        "equipment_operational": 8,
        "equipment_maintenance": 1,
        "qc_pass_rate": 98.7,
        "average_turnaround_time": 4.2,
        "staff_on_duty": 6,
        "monthly_test_volume": 4567,
        "revenue_this_month": 234567.89
    }

