from datetime import datetime, timezone
from sqlalchemy.dialects.postgresql import UUID, JSON
from sqlalchemy import CheckConstraint, Index
import uuid
from src.database import db

class GenomicAnalysis(db.Model):
    """Genomic analysis records."""
    __tablename__ = 'genomic_analyses'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    analysis_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # Analysis information
    analysis_type = db.Column(db.String(100), nullable=False)
    analysis_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    
    # Source information
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    sample_id = db.Column(UUID(as_uuid=True), db.ForeignKey('lab_samples.id'))
    
    # Analysis parameters
    parameters = db.Column(JSON, default={})
    algorithm_version = db.Column(db.String(50))
    reference_genome = db.Column(db.String(100))
    
    # Results
    results = db.Column(JSON, default={})
    confidence_score = db.Column(db.Numeric(5, 2))
    quality_metrics = db.Column(JSON, default={})
    
    # Status and timing
    status = db.Column(db.String(50), default='PENDING')
    started_at = db.Column(db.DateTime(timezone=True))
    completed_at = db.Column(db.DateTime(timezone=True))
    
    # Processing information
    processed_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    processing_time_seconds = db.Column(db.Integer)
    
    # File information
    input_files = db.Column(JSON, default=[])
    output_files = db.Column(JSON, default=[])
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    created_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    
    # Relationships
    animal = db.relationship('Animal', backref='genomic_analyses')
    sample = db.relationship('LabSample', backref='genomic_analyses')
    
    # Constraints
    __table_args__ = (
        CheckConstraint("status IN ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED')", name='check_analysis_status'),
        Index('idx_genomic_analyses_status', 'status'),
        Index('idx_genomic_analyses_type', 'analysis_type'),
    )
    
    def __repr__(self):
        return f'<GenomicAnalysis {self.analysis_id}: {self.analysis_name}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'analysis_id': self.analysis_id,
            'analysis_type': self.analysis_type,
            'analysis_name': self.analysis_name,
            'description': self.description,
            'animal_id': str(self.animal_id) if self.animal_id else None,
            'sample_id': str(self.sample_id) if self.sample_id else None,
            'parameters': self.parameters,
            'algorithm_version': self.algorithm_version,
            'reference_genome': self.reference_genome,
            'results': self.results,
            'confidence_score': float(self.confidence_score) if self.confidence_score else None,
            'quality_metrics': self.quality_metrics,
            'status': self.status,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'processed_by': str(self.processed_by) if self.processed_by else None,
            'processing_time_seconds': self.processing_time_seconds,
            'input_files': self.input_files,
            'output_files': self.output_files,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

class SNPData(db.Model):
    """SNP (Single Nucleotide Polymorphism) data."""
    __tablename__ = 'snp_data'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'), nullable=False)
    
    # SNP information
    chromosome = db.Column(db.String(10), nullable=False)
    position = db.Column(db.BigInteger, nullable=False)
    snp_id = db.Column(db.String(50))
    reference_allele = db.Column(db.String(10))
    alternate_allele = db.Column(db.String(10))
    genotype = db.Column(db.String(10))
    
    # Quality metrics
    quality_score = db.Column(db.Numeric(8, 2))
    read_depth = db.Column(db.Integer)
    allele_frequency = db.Column(db.Numeric(5, 4))
    
    # Analysis context
    analysis_id = db.Column(UUID(as_uuid=True), db.ForeignKey('genomic_analyses.id'))
    
    # Timestamps
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    
    # Relationships
    animal = db.relationship('Animal', backref='snp_data')
    analysis = db.relationship('GenomicAnalysis', backref='snp_data')
    
    # Constraints
    __table_args__ = (
        Index('idx_snp_data_animal_chr_pos', 'animal_id', 'chromosome', 'position'),
        Index('idx_snp_data_snp_id', 'snp_id'),
    )
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'animal_id': str(self.animal_id),
            'chromosome': self.chromosome,
            'position': self.position,
            'snp_id': self.snp_id,
            'reference_allele': self.reference_allele,
            'alternate_allele': self.alternate_allele,
            'genotype': self.genotype,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'read_depth': self.read_depth,
            'allele_frequency': float(self.allele_frequency) if self.allele_frequency else None,
            'analysis_id': str(self.analysis_id) if self.analysis_id else None,
            'created_at': self.created_at.isoformat()
        }

class BeadChipMapping(db.Model):
    """BeadChip array mappings and genomic data."""
    __tablename__ = 'beadchip_mappings'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    mapping_id = db.Column(db.String(50), unique=True, nullable=False, index=True)
    
    # BeadChip information
    chip_type = db.Column(db.String(100), nullable=False)
    chip_version = db.Column(db.String(50))
    array_id = db.Column(db.String(100))
    
    # Sample information
    animal_id = db.Column(UUID(as_uuid=True), db.ForeignKey('animals.id'))
    sample_id = db.Column(UUID(as_uuid=True), db.ForeignKey('lab_samples.id'))
    
    # Mapping data
    probe_mappings = db.Column(JSON, default={})
    intensity_data = db.Column(JSON, default={})
    
    # Quality metrics
    call_rate = db.Column(db.Numeric(5, 2))
    heterozygosity_rate = db.Column(db.Numeric(5, 2))
    quality_score = db.Column(db.Numeric(5, 2))
    
    # Processing information
    processed_at = db.Column(db.DateTime(timezone=True))
    processed_by = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'))
    processing_software = db.Column(db.String(100))
    processing_version = db.Column(db.String(50))
    
    # File information
    raw_data_file = db.Column(db.String(500))
    processed_data_file = db.Column(db.String(500))
    
    # Audit fields
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationships
    animal = db.relationship('Animal', backref='beadchip_mappings')
    sample = db.relationship('LabSample', backref='beadchip_mappings')
    
    def __repr__(self):
        return f'<BeadChipMapping {self.mapping_id}>'
    
    def to_dict(self):
        """Convert to dictionary."""
        return {
            'id': str(self.id),
            'mapping_id': self.mapping_id,
            'chip_type': self.chip_type,
            'chip_version': self.chip_version,
            'array_id': self.array_id,
            'animal_id': str(self.animal_id) if self.animal_id else None,
            'sample_id': str(self.sample_id) if self.sample_id else None,
            'probe_mappings': self.probe_mappings,
            'intensity_data': self.intensity_data,
            'call_rate': float(self.call_rate) if self.call_rate else None,
            'heterozygosity_rate': float(self.heterozygosity_rate) if self.heterozygosity_rate else None,
            'quality_score': float(self.quality_score) if self.quality_score else None,
            'processed_at': self.processed_at.isoformat() if self.processed_at else None,
            'processed_by': str(self.processed_by) if self.processed_by else None,
            'processing_software': self.processing_software,
            'processing_version': self.processing_version,
            'raw_data_file': self.raw_data_file,
            'processed_data_file': self.processed_data_file,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }

