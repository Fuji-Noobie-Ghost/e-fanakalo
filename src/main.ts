import { config } from 'dotenv'
import { resolve } from 'path'
import { AppDataSource, Exchange, Photo } from './database'
import { app, ApplyGlobalResponse, createStorage, createUploader } from './modules'
import { AppController } from './controllers'
import { AppService, UploaderService, ValidationService } from './services'
import { AppMiddleware } from './middlewares/app.middleware'

async function Server() {
    // Configuration for Environment Variables
    config()
    const { PORT, HOST, MAX_FILE_COUNT, MAX_FILE_SIZE } = process.env

    // Database Connection initialize
    console.log('Initializing database connection...')
    await AppDataSource.initialize()
    console.log('Database Connected')
    
    // Database Repository
    const exchange = AppDataSource.getRepository(Exchange)
    const photo = AppDataSource.getRepository(Photo)

    // Create an uploader
    const uploader = createUploader({
        storage: createStorage(resolve(__dirname, '../uploads')),
        accepts: ['.png', '.jpg', '.jpeg'],
        maxCount: +MAX_FILE_COUNT,
        maxSize: +MAX_FILE_SIZE
    })

    // Main application controller
    AppController({
        endpoint: '',
        context: app,
        services: [
            new UploaderService(uploader, 'photos'),
            new ValidationService(UploaderService.rollBack),
            new AppService(exchange, photo),
        ],
        middlewares: [AppMiddleware]
    })

    ApplyGlobalResponse()

    app.listen(+PORT, HOST, () => {
        console.log(`Server running on http://${HOST}:${PORT}`)
    })
}

Server()