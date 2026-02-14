import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { configService } from '../services/config-service.js';

cloudinary.config({
  cloud_name: configService.cloudinaryCloudName,
  api_key: configService.cloudinaryApiKey,
  api_secret: configService.cloudinaryApiSecret,
});

export class CloudinaryService {
  public static async uploadOnCloudinary(fileBuffer: Buffer, fileMimetype: string): Promise<UploadApiResponse | null> {
    try {
      if (!fileBuffer) return null;

      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) {
              console.error('Cloudinary Upload Error:', error);
              reject(null);
            } else {
              resolve(result as UploadApiResponse);
            }
          }
        );

        uploadStream.end(fileBuffer);
      });
    } catch (error) {
      console.error('Cloudinary upload failed', error);
      return null;
    }
  }

  public static async deleteFromCloudinary(publicId: string): Promise<any> {
    try {
      if (!publicId) return null;
      const result = await cloudinary.uploader.destroy(publicId);
      console.log('Image deleted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
      return null;
    }
  }
}
