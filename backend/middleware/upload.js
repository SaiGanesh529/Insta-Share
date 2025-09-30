import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { config } from '../config.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = config.CLOUDINARY.cloud_name !== 'your_cloud_name' && 
                               config.CLOUDINARY.api_key !== 'your_api_key' && 
                               config.CLOUDINARY.api_secret !== 'your_api_secret';

if (isCloudinaryConfigured) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: config.CLOUDINARY.cloud_name,
    api_key: config.CLOUDINARY.api_key,
    api_secret: config.CLOUDINARY.api_secret
  });
}

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for local storage (development) or memory storage (production)
const storage = isCloudinaryConfigured ? multer.memoryStorage() : multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// Upload to Cloudinary or return local file path
export const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    if (isCloudinaryConfigured) {
      // Use Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'auto',
          folder: 'insta-share'
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      
      uploadStream.end(file.buffer);
    } else {
      // Use local file path
      resolve({
        secure_url: `/uploads/${file.filename}`
      });
    }
  });
};

export { upload };
