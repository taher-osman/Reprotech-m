import { 
  ItemImage, 
  ImageUploadRequest, 
  ImageUploadResult 
} from '../types/inventoryTypes';

// Image Management Service
class ImageManagementService {
  private maxFileSize = 5 * 1024 * 1024; // 5MB
  private allowedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  private thumbnailSize = { width: 150, height: 150 };
  private mediumSize = { width: 400, height: 400 };

  // Upload and process image
  async uploadImage(request: ImageUploadRequest): Promise<ImageUploadResult> {
    try {
      const { file, itemId, description, isPrimary } = request;

      // Validate file
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique filename
      const filename = this.generateFilename(file.name);
      
      // Process image (resize, optimize)
      const processedImages = await this.processImage(file);

      // Create ItemImage object
      const itemImage: ItemImage = {
        id: this.generateImageId(),
        filename,
        originalName: file.name,
        url: processedImages.original,
        thumbnailUrl: processedImages.thumbnail,
        size: file.size,
        mimeType: file.type,
        width: processedImages.dimensions.width,
        height: processedImages.dimensions.height,
        isPrimary: isPrimary || false,
        description,
        uploadedAt: new Date().toISOString(),
        uploadedBy: 'current-user' // Should come from auth context
      };

      // In a real implementation, upload to cloud storage
      // await this.uploadToStorage(processedImages, filename);

      return {
        success: true,
        image: itemImage
      };
    } catch (error) {
      return {
        success: false,
        error: `Failed to upload image: ${error}`
      };
    }
  }

  // Validate uploaded file
  private validateFile(file: File): { isValid: boolean; error?: string } {
    if (!file) {
      return { isValid: false, error: 'No file provided' };
    }

    if (file.size > this.maxFileSize) {
      return { 
        isValid: false, 
        error: `File size too large. Maximum size is ${this.maxFileSize / 1024 / 1024}MB` 
      };
    }

    if (!this.allowedFormats.includes(file.type)) {
      return { 
        isValid: false, 
        error: `Invalid file format. Allowed formats: ${this.allowedFormats.join(', ')}` 
      };
    }

    return { isValid: true };
  }

  // Process image (create thumbnail and optimized versions)
  private async processImage(file: File): Promise<{
    original: string;
    thumbnail: string;
    medium: string;
    dimensions: { width: number; height: number };
  }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        try {
          const originalDimensions = { width: img.width, height: img.height };

          // Create original data URL
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const original = canvas.toDataURL('image/jpeg', 0.9);

          // Create thumbnail
          const thumbnailDimensions = this.calculateAspectRatio(
            originalDimensions, 
            this.thumbnailSize
          );
          canvas.width = thumbnailDimensions.width;
          canvas.height = thumbnailDimensions.height;
          ctx.drawImage(img, 0, 0, thumbnailDimensions.width, thumbnailDimensions.height);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);

          // Create medium size
          const mediumDimensions = this.calculateAspectRatio(
            originalDimensions, 
            this.mediumSize
          );
          canvas.width = mediumDimensions.width;
          canvas.height = mediumDimensions.height;
          ctx.drawImage(img, 0, 0, mediumDimensions.width, mediumDimensions.height);
          const medium = canvas.toDataURL('image/jpeg', 0.85);

          resolve({
            original,
            thumbnail,
            medium,
            dimensions: originalDimensions
          });
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      // Load image from file
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Calculate aspect ratio for resizing
  private calculateAspectRatio(
    original: { width: number; height: number },
    target: { width: number; height: number }
  ): { width: number; height: number } {
    const aspectRatio = original.width / original.height;
    
    let width = target.width;
    let height = target.height;

    if (aspectRatio > 1) {
      // Landscape
      height = width / aspectRatio;
    } else {
      // Portrait
      width = height * aspectRatio;
    }

    return { width: Math.round(width), height: Math.round(height) };
  }

  // Generate unique filename
  private generateFilename(originalName: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop() || 'jpg';
    return `inv_${timestamp}_${random}.${extension}`;
  }

  // Generate unique image ID
  private generateImageId(): string {
    return `img_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }

  // Delete image
  async deleteImage(imageId: string): Promise<boolean> {
    try {
      // In a real implementation, delete from cloud storage
      // await this.deleteFromStorage(imageId);
      
      console.log(`Image ${imageId} deleted successfully`);
      return true;
    } catch (error) {
      console.error(`Failed to delete image ${imageId}:`, error);
      return false;
    }
  }

  // Update image metadata
  async updateImageMetadata(
    imageId: string, 
    updates: Partial<Pick<ItemImage, 'description' | 'isPrimary'>>
  ): Promise<boolean> {
    try {
      // In a real implementation, update in database
      console.log(`Image ${imageId} metadata updated:`, updates);
      return true;
    } catch (error) {
      console.error(`Failed to update image metadata:`, error);
      return false;
    }
  }

  // Set primary image
  async setPrimaryImage(itemId: string, imageId: string): Promise<boolean> {
    try {
      // In a real implementation, update in database
      console.log(`Set image ${imageId} as primary for item ${itemId}`);
      return true;
    } catch (error) {
      console.error(`Failed to set primary image:`, error);
      return false;
    }
  }

  // Get image URL with size variant
  getImageUrl(image: ItemImage, size: 'original' | 'thumbnail' | 'medium' = 'original'): string {
    switch (size) {
      case 'thumbnail':
        return image.thumbnailUrl;
      case 'medium':
        // In a real implementation, this would be a separate URL
        return image.url;
      case 'original':
      default:
        return image.url;
    }
  }

  // Compress image for storage
  async compressImage(file: File, quality: number = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        }, 'image/jpeg', quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Create image placeholder
  createPlaceholder(width: number, height: number, text?: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#ccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, width, height);

    // Text
    if (text) {
      ctx.fillStyle = '#666';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, width / 2, height / 2);
    }

    return canvas.toDataURL();
  }

  // Batch upload images
  async uploadMultipleImages(requests: ImageUploadRequest[]): Promise<ImageUploadResult[]> {
    const results: ImageUploadResult[] = [];
    
    for (const request of requests) {
      const result = await this.uploadImage(request);
      results.push(result);
    }

    return results;
  }

  // Extract metadata from image
  async extractMetadata(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height,
          size: file.size,
          type: file.type,
          name: file.name,
          lastModified: file.lastModified
        });
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Generate image variants for different use cases
  async generateImageVariants(file: File): Promise<{
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
  }> {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          const variants: any = {};

          // Original
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          variants.original = canvas.toDataURL('image/jpeg', 0.95);

          // Thumbnail (150x150)
          const thumbDim = this.calculateAspectRatio(
            { width: img.width, height: img.height },
            { width: 150, height: 150 }
          );
          canvas.width = thumbDim.width;
          canvas.height = thumbDim.height;
          ctx.drawImage(img, 0, 0, thumbDim.width, thumbDim.height);
          variants.thumbnail = canvas.toDataURL('image/jpeg', 0.8);

          // Medium (400x400)
          const mediumDim = this.calculateAspectRatio(
            { width: img.width, height: img.height },
            { width: 400, height: 400 }
          );
          canvas.width = mediumDim.width;
          canvas.height = mediumDim.height;
          ctx.drawImage(img, 0, 0, mediumDim.width, mediumDim.height);
          variants.medium = canvas.toDataURL('image/jpeg', 0.85);

          // Large (800x800)
          const largeDim = this.calculateAspectRatio(
            { width: img.width, height: img.height },
            { width: 800, height: 800 }
          );
          canvas.width = largeDim.width;
          canvas.height = largeDim.height;
          ctx.drawImage(img, 0, 0, largeDim.width, largeDim.height);
          variants.large = canvas.toDataURL('image/jpeg', 0.9);

          resolve(variants);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }
}

// Export singleton instance
export const imageManagementService = new ImageManagementService(); 