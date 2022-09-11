import express, { Request, Response } from 'express'
import helmet from 'helmet'
import compression from 'compression'

const app = express()

// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(compression())
app.use(helmet())

app.use('/uploads', express.static('/uploads'))

function ApplyGlobalResponse() {
    app.use('*', (req: Request, res: Response) => {
        res.status(404).json({
            statusCode: 404,
            message: `Cannot ${req.method} ${req.url}`
        })
    })
}

export { app, ApplyGlobalResponse }