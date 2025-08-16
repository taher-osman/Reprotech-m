"""
Background task system for handling long-running operations.
"""

import json
import traceback
from datetime import datetime, timezone, timedelta
from enum import Enum
from threading import Thread
from queue import Queue, Empty
import time
from flask import current_app
from src.database import db

class TaskStatus(Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"

class BackgroundTask(db.Model):
    """Background task model for tracking long-running operations."""
    
    __tablename__ = 'background_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    
    # Task identification
    task_id = db.Column(db.String(100), unique=True, nullable=False, index=True)
    task_name = db.Column(db.String(200), nullable=False)
    task_description = db.Column(db.Text)
    
    # Task status
    status = db.Column(db.Enum(TaskStatus), default=TaskStatus.PENDING, nullable=False, index=True)
    progress = db.Column(db.Integer, default=0)  # 0-100
    
    # User information
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), index=True)
    
    # Task data
    input_data = db.Column(db.JSON)
    result_data = db.Column(db.JSON)
    error_message = db.Column(db.Text)
    
    # Timing
    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    started_at = db.Column(db.DateTime(timezone=True))
    completed_at = db.Column(db.DateTime(timezone=True))
    
    # Metadata
    task_metadata = db.Column(db.JSON)
    
    def __repr__(self):
        return f'<BackgroundTask {self.task_id} - {self.status.value}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'task_id': self.task_id,
            'task_name': self.task_name,
            'task_description': self.task_description,
            'status': self.status.value,
            'progress': self.progress,
            'user_id': self.user_id,
            'input_data': self.input_data,
            'result_data': self.result_data,
            'error_message': self.error_message,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'started_at': self.started_at.isoformat() if self.started_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'metadata': self.task_metadata
        }
    
    def update_progress(self, progress, message=None):
        """Update task progress."""
        self.progress = min(100, max(0, progress))
        if message:
            if not self.task_metadata:
                self.task_metadata = {}
            self.task_metadata['progress_message'] = message
        db.session.commit()
    
    def mark_completed(self, result_data=None):
        """Mark task as completed."""
        self.status = TaskStatus.COMPLETED
        self.progress = 100
        self.completed_at = datetime.now(timezone.utc)
        if result_data:
            self.result_data = result_data
        db.session.commit()
    
    def mark_failed(self, error_message):
        """Mark task as failed."""
        self.status = TaskStatus.FAILED
        self.completed_at = datetime.now(timezone.utc)
        self.error_message = error_message
        db.session.commit()

class TaskManager:
    """Task manager for handling background tasks."""
    
    def __init__(self, app=None):
        self.app = app
        self.task_queue = Queue()
        self.workers = []
        self.running = False
        
        if app:
            self.init_app(app)
    
    def init_app(self, app):
        """Initialize task manager with Flask app."""
        self.app = app
        
        # Start worker threads
        num_workers = app.config.get('TASK_WORKERS', 2)
        self.start_workers(num_workers)
    
    def start_workers(self, num_workers=2):
        """Start worker threads."""
        if self.running:
            return
        
        self.running = True
        for i in range(num_workers):
            worker = Thread(target=self._worker, args=(i,), daemon=True)
            worker.start()
            self.workers.append(worker)
        
        if self.app:
            with self.app.app_context():
                current_app.logger.info(f"Started {num_workers} background task workers")
    
    def stop_workers(self):
        """Stop worker threads."""
        self.running = False
        if self.app:
            with self.app.app_context():
                current_app.logger.info("Stopping background task workers")
    
    def _worker(self, worker_id):
        """Worker thread function."""
        if self.app:
            with self.app.app_context():
                current_app.logger.info(f"Task worker {worker_id} started")
        
        while self.running:
            try:
                # Get task from queue with timeout
                task_data = self.task_queue.get(timeout=1)
                
                with self.app.app_context():
                    self._execute_task(task_data)
                
                self.task_queue.task_done()
                
            except Empty:
                continue
            except Exception as e:
                if self.app:
                    with self.app.app_context():
                        current_app.logger.error(f"Worker {worker_id} error: {str(e)}")
        
        if self.app:
            with self.app.app_context():
                current_app.logger.info(f"Task worker {worker_id} stopped")
    
    def _execute_task(self, task_data):
        """Execute a background task."""
        task_id = task_data['task_id']
        task_func = task_data['func']
        args = task_data.get('args', ())
        kwargs = task_data.get('kwargs', {})
        
        # Get task from database
        task = BackgroundTask.query.filter_by(task_id=task_id).first()
        if not task:
            current_app.logger.error(f"Task {task_id} not found in database")
            return
        
        try:
            # Mark task as running
            task.status = TaskStatus.RUNNING
            task.started_at = datetime.now(timezone.utc)
            db.session.commit()
            
            current_app.logger.info(f"Executing task {task_id}: {task.task_name}")
            
            # Execute task function
            result = task_func(task, *args, **kwargs)
            
            # Mark task as completed
            task.mark_completed(result)
            
            current_app.logger.info(f"Task {task_id} completed successfully")
            
        except Exception as e:
            # Mark task as failed
            error_message = f"{str(e)}\n\nTraceback:\n{traceback.format_exc()}"
            task.mark_failed(error_message)
            
            current_app.logger.error(f"Task {task_id} failed: {str(e)}")
    
    def submit_task(self, task_name, task_func, user_id=None, description=None, 
                   input_data=None, *args, **kwargs):
        """Submit a task for background execution."""
        import uuid
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Create task record in database
        task = BackgroundTask(
            task_id=task_id,
            task_name=task_name,
            task_description=description,
            user_id=user_id,
            input_data=input_data
        )
        
        db.session.add(task)
        db.session.commit()
        
        # Add task to queue
        task_data = {
            'task_id': task_id,
            'func': task_func,
            'args': args,
            'kwargs': kwargs
        }
        
        self.task_queue.put(task_data)
        
        current_app.logger.info(f"Submitted task {task_id}: {task_name}")
        
        return task_id
    
    def get_task_status(self, task_id):
        """Get task status."""
        task = BackgroundTask.query.filter_by(task_id=task_id).first()
        return task.to_dict() if task else None
    
    def cancel_task(self, task_id):
        """Cancel a pending task."""
        task = BackgroundTask.query.filter_by(task_id=task_id).first()
        if task and task.status == TaskStatus.PENDING:
            task.status = TaskStatus.CANCELLED
            task.completed_at = datetime.now(timezone.utc)
            db.session.commit()
            return True
        return False

# Global task manager instance
task_manager = TaskManager()

# Task functions
def bulk_import_animals_task(task, file_path, user_id):
    """Background task for bulk importing animals."""
    import csv
    from src.models.animal import Animal
    from src.models.customer import Customer
    
    try:
        task.update_progress(10, "Reading CSV file")
        
        imported_count = 0
        errors = []
        
        with open(file_path, 'r') as file:
            csv_reader = csv.DictReader(file)
            total_rows = sum(1 for _ in csv_reader)
            file.seek(0)
            csv_reader = csv.DictReader(file)
            
            task.update_progress(20, f"Processing {total_rows} rows")
            
            for row_num, row in enumerate(csv_reader, start=1):
                try:
                    # Validate required fields
                    if not row.get('Animal ID') or not row.get('Name'):
                        errors.append(f"Row {row_num}: Animal ID and Name are required")
                        continue
                    
                    # Check if animal already exists
                    existing_animal = Animal.query.filter_by(animal_id=row['Animal ID']).first()
                    if existing_animal:
                        errors.append(f"Row {row_num}: Animal with ID {row['Animal ID']} already exists")
                        continue
                    
                    # Find customer if specified
                    customer = None
                    if row.get('Customer Name'):
                        customer = Customer.query.filter_by(name=row['Customer Name']).first()
                        if not customer:
                            errors.append(f"Row {row_num}: Customer '{row['Customer Name']}' not found")
                            continue
                    
                    # Create animal
                    animal = Animal(
                        animal_id=row['Animal ID'],
                        name=row['Name'],
                        species=row.get('Species', ''),
                        breed=row.get('Breed', ''),
                        sex=row.get('Sex', ''),
                        weight=float(row['Weight']) if row.get('Weight') else None,
                        status=row.get('Status', 'ACTIVE'),
                        customer_id=customer.id if customer else None,
                        created_by=user_id
                    )
                    
                    db.session.add(animal)
                    imported_count += 1
                    
                    # Update progress
                    progress = 20 + (row_num / total_rows) * 70
                    task.update_progress(int(progress), f"Processed {row_num}/{total_rows} rows")
                    
                except Exception as e:
                    errors.append(f"Row {row_num}: {str(e)}")
        
        # Commit all changes
        db.session.commit()
        
        task.update_progress(95, "Cleaning up")
        
        # Clean up file
        if os.path.exists(file_path):
            os.remove(file_path)
        
        return {
            'imported_count': imported_count,
            'total_rows': total_rows,
            'errors': errors[:100]  # Limit errors to prevent large results
        }
        
    except Exception as e:
        db.session.rollback()
        raise e

def generate_report_task(task, report_type, filters, user_id):
    """Background task for generating large reports."""
    from src.routes.analytics import _execute_report_query
    from src.models.analytics import AnalyticsReport
    
    try:
        task.update_progress(10, "Initializing report generation")
        
        # Get report configuration
        report = AnalyticsReport.query.filter_by(report_type=report_type).first()
        if not report:
            raise ValueError(f"Report type {report_type} not found")
        
        task.update_progress(30, "Executing report query")
        
        # Execute report
        results = _execute_report_query(report, filters, {})
        
        task.update_progress(80, "Formatting results")
        
        # Generate CSV if requested
        csv_file = None
        if filters.get('format') == 'csv':
            import csv
            import tempfile
            
            csv_file = tempfile.NamedTemporaryFile(mode='w', suffix='.csv', delete=False)
            writer = csv.writer(csv_file)
            
            # Write header
            if results['data']:
                writer.writerow(results['data'][0].keys())
                
                # Write data
                for row in results['data']:
                    writer.writerow(row.values())
            
            csv_file.close()
        
        task.update_progress(95, "Finalizing report")
        
        return {
            'report_type': report_type,
            'total_records': len(results.get('data', [])),
            'summary': results.get('summary', {}),
            'csv_file': csv_file.name if csv_file else None,
            'generated_at': datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        raise e

def cleanup_old_tasks(days_to_keep=30):
    """Clean up old completed tasks."""
    try:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_to_keep)
        
        deleted_count = BackgroundTask.query.filter(
            BackgroundTask.completed_at < cutoff_date,
            BackgroundTask.status.in_([TaskStatus.COMPLETED, TaskStatus.FAILED, TaskStatus.CANCELLED])
        ).delete()
        
        db.session.commit()
        
        current_app.logger.info(f"Cleaned up {deleted_count} old background tasks")
        return deleted_count
        
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"Task cleanup failed: {str(e)}")
        return 0

# Convenience functions
def submit_bulk_import(file_path, user_id):
    """Submit bulk import task."""
    return task_manager.submit_task(
        task_name="Bulk Import Animals",
        task_func=bulk_import_animals_task,
        user_id=user_id,
        description="Import animals from CSV file",
        input_data={'file_path': file_path},
        file_path=file_path
    )

def submit_report_generation(report_type, filters, user_id):
    """Submit report generation task."""
    return task_manager.submit_task(
        task_name=f"Generate {report_type} Report",
        task_func=generate_report_task,
        user_id=user_id,
        description=f"Generate {report_type} report with filters",
        input_data={'report_type': report_type, 'filters': filters},
        report_type=report_type,
        filters=filters
    )

