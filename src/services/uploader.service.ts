import { NextFunction, Request, Response } from 'express'
import { Multer, MulterError, ErrorCode } from 'multer'
import { unlink } from 'fs'

interface CommonError {
    statusCode: number
    message: string
}

// Service for uploading files
export class UploaderService {

    constructor(private uploader: Multer, private field: string) {
        this.upload = this.upload.bind(this)
    }

    upload(req: Request, res: Response, next: NextFunction) {
        const upld = this.uploader.array(this.field)

        upld(req, res, err => {
            if (err) {
                const errResult = this.getError(err)
                res.status(errResult.statusCode).json(errResult)
                return
            }
            return next()
        })
    }

    // Exception Handling
    getError(err: any): CommonError {
        let message = err
        let statusCode = 500

        if (err instanceof MulterError) {
            statusCode = 400

            switch (err.code) {
                case 'LIMIT_FILE_COUNT':
                    message = 'Too many files'
                    break
                case 'LIMIT_UNEXPECTED_FILE':
                    message = `${err.message} '${err.field}'`
                    break
                case 'UNACCEPTABLE_FILE_FORMAT' as ErrorCode:
                    message = 'Unacceptable file format'
                    break
                case 'LIMIT_FILE_SIZE':
                    message = 'File too large'
                    break
                default:
                    statusCode = 500
                    message = err.message
                    break
            }
        }
            
        return { statusCode, message }
    }

    // This method will delete all files uploaded before an error
    static rollBack(files: Express.Multer.File[]) {
        const filepaths = files.map(file => file.path)
        filepaths.forEach(filepath => unlink(filepath, () => {}))
    }

}