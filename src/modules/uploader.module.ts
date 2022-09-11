import multer, { ErrorCode, MulterError } from 'multer'
import { extname } from 'path'

interface UploadConfig {
    storage: multer.StorageEngine
    accepts: string[]
    maxSize: number
    maxCount: number
}

// Storage configuration
const createStorage = (dest: string) => multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, dest)
    },
    
    filename: (req, file, callback) => {
        callback(null, Date.now() + extname(file.originalname))
    }
})

// Uploader configuration for incoming files
const createUploader = (uploadConfig: UploadConfig) => multer({
    storage: uploadConfig.storage,
    fileFilter: (req, file, callback) => {
        let ext = extname(file.originalname)

        if (uploadConfig.accepts.includes(ext))
            return callback(null, true)

        return callback(new MulterError('UNACCEPTABLE_FILE_FORMAT' as ErrorCode))
    },
    limits: {
        fileSize: (1024 * 1024) * uploadConfig.maxSize,
        files: uploadConfig.maxCount
    }
})

export { createUploader, createStorage }