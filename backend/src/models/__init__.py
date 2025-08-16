# Import all models to ensure they are registered with SQLAlchemy
from .user import User, UserProfile, Role, Permission, TokenBlacklist
from .customer import Customer, CustomerContact, CustomerAddress
from .animal import Animal, AnimalRole, AnimalInternalNumber, AnimalGenomicData, AnimalActivity
from .laboratory import LabSample, LabProtocol, LabTest, LabEquipment
from .genomics import GenomicAnalysis, SNPData, BeadChipMapping
from .biobank import BiobankStorageUnit, BiobankSample, TemperatureLog
from .analytics import AnalyticsMetric, DashboardWidget, Report, ReportExecution
from .workflow import Workflow, WorkflowInstance, WorkflowStepExecution

__all__ = [
    # User management
    'User', 'UserProfile', 'Role', 'Permission', 'TokenBlacklist',
    
    # Customer management
    'Customer', 'CustomerContact', 'CustomerAddress',
    
    # Animal management
    'Animal', 'AnimalRole', 'AnimalInternalNumber', 'AnimalGenomicData', 'AnimalActivity',
    
    # Laboratory management
    'LabSample', 'LabProtocol', 'LabTest', 'LabEquipment',
    
    # Genomics and intelligence
    'GenomicAnalysis', 'SNPData', 'BeadChipMapping',
    
    # Biobank and samples
    'BiobankStorageUnit', 'BiobankSample', 'TemperatureLog',
    
    # Analytics and dashboard
    'AnalyticsMetric', 'DashboardWidget', 'Report', 'ReportExecution',
    
    # Workflow management
    'Workflow', 'WorkflowInstance', 'WorkflowStepExecution'
]

