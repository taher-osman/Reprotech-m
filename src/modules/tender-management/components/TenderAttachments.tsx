import React, { useState, useCallback } from 'react';
import { 
  Upload, 
  File, 
  FileText, 
  Image, 
  X, 
  Download, 
  Eye, 
  Trash2,
  Paperclip,
  AlertCircle
} from 'lucide-react';
import { TenderAttachment, AttachmentType } from '../types/tenderTypes';

interface TenderAttachmentsProps {
  attachments: TenderAttachment[];
  onUpload: (file: File, type: AttachmentType) => Promise<void>;
  onDelete: (attachmentId: string) => Promise<void>;
  onPreview?: (attachment: TenderAttachment) => void;
  maxFileSize?: number; // in MB
  allowedTypes?: string[];
  className?: string;
}

const fileTypeIcons: Record<string, React.ComponentType<any>> = {
  'application/pdf': FileText,
  'application/msword': FileText,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': FileText,
  'application/vnd.ms-excel': FileText,
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': FileText,
  'image/': Image,
  'default': File
};

const getFileIcon = (mimeType: string) => {
  for (const [type, Icon] of Object.entries(fileTypeIcons)) {
    if (mimeType.startsWith(type)) {
      return Icon;
    }
  }
  return fileTypeIcons.default;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const TenderAttachments: React.FC<TenderAttachmentsProps> = ({
  attachments,
  onUpload,
  onDelete,
  onPreview,
  maxFileSize = 10, // 10MB default
  allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png'],
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<AttachmentType>(AttachmentType.TECHNICAL_DOCS);
  const [errors, setErrors] = useState<string[]>([]);

  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    
    if (!allowedTypes.some(type => file.type.startsWith(type))) {
      return 'File type not allowed';
    }
    
    return null;
  };

  const handleFileUpload = async (files: FileList | File[]) => {
    setErrors([]);
    const newErrors: string[] = [];
    
    for (const file of Array.from(files)) {
      const error = validateFile(file);
      if (error) {
        newErrors.push(`${file.name}: ${error}`);
        continue;
      }
      
      try {
        setUploading(true);
        await onUpload(file, selectedType);
      } catch (error) {
        newErrors.push(`Failed to upload ${file.name}`);
      }
    }
    
    setErrors(newErrors);
    setUploading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  }, [selectedType]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
    }
  };

  const handleDelete = async (attachmentId: string) => {
    try {
      await onDelete(attachmentId);
    } catch (error) {
      console.error('Failed to delete attachment:', error);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Section */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragOver 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <div className="mt-4">
          <label htmlFor="file-upload" className="cursor-pointer">
            <span className="mt-2 block text-sm font-medium text-gray-900">
              Drop files here or click to upload
            </span>
            <span className="mt-1 block text-xs text-gray-500">
              PDF, Word, Excel, Images up to {maxFileSize}MB
            </span>
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            multiple
            className="sr-only"
            onChange={handleFileInput}
            accept={allowedTypes.join(',')}
          />
        </div>
        
        {/* File Type Selector */}
        <div className="mt-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as AttachmentType)}
            className="block w-full max-w-xs mx-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            {Object.values(AttachmentType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Upload Errors
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Uploading Indicator */}
      {uploading && (
        <div className="flex items-center justify-center p-4 bg-blue-50 rounded-md">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-blue-600">Uploading...</span>
        </div>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
          <div className="grid gap-3">
            {attachments.map((attachment) => {
              const FileIcon = getFileIcon(attachment.file_url);
              return (
                <div
                  key={attachment.attachment_id}
                  className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-3">
                    <FileIcon className="h-8 w-8 text-gray-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {attachment.name}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{attachment.type}</span>
                        <span>•</span>
                        <span>{formatFileSize(attachment.file_size)}</span>
                        <span>•</span>
                        <span>{new Date(attachment.uploaded_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {onPreview && (
                      <button
                        onClick={() => onPreview(attachment)}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Preview"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <a
                      href={attachment.file_url}
                      download
                      className="p-1 text-gray-400 hover:text-gray-600"
                      title="Download"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(attachment.attachment_id)}
                      className="p-1 text-red-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TenderAttachments; 