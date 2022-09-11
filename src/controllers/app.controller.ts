import { Express, NextFunction, Request, Response } from 'express'
import { UpdateResult } from 'typeorm'
import { AppService, ValidationService, UploaderService, QueryRequest } from '../services'

export interface ControllerOptions {
    endpoint: string
    context: Express
    services?: any[]
    middlewares?: any[]
}

export function AppController(options: ControllerOptions) {
    const { context, endpoint, services, middlewares } = options

    const [uploaderService, validationService, appService]: [UploaderService?, ValidationService?, AppService?, ...any[]] = services
    const [appMiddleware]: any[] = middlewares

    // Apply Middlewares
    context.post(endpoint + '/', uploaderService.upload)
    context.post(endpoint + '/', validationService.validate)
    context.post(endpoint + '/', async (req: Request, res: Response) => {
        try {
            if (req.files.length <= 0) {
                UploaderService.rollBack(req.files as Express.Multer.File[])
                return res.status(400).json({
                    statusCode: 404,
                    message: 'Missing photo(s)'
                })
            }
            
            const currentData = await appService.saveExchange(req.body, req.files as Express.Multer.File[])
            return res.status(201).json({
                resultStatus: 'Created',
                data: currentData
            })

        } catch (err) {
            UploaderService.rollBack(req.files as Express.Multer.File[])
            res.status(500).json({
                statusCode: 500,
                message: err
            })
        }
    })

    // Get Exchange without pagination
    context.get(endpoint + '/', async (req: Request, res: Response) => {
        try {
            const { status } = req.query
            if (status !== undefined && status as string !== 'active' && status as string !== 'deactive')
                return res.status(400).json({
                    statusCode: 400,
                    message: 'Invalid status'
                })

            let statusMode
            if (status === undefined) statusMode = {}
            else statusMode = status === 'active' ? { isActive: 'Y' } : { isActive: 'N' }
            const result = await appService.findAll(statusMode)
            return res.json({
                count: result[1],
                exchanges: result[0]
            })
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err
            })
        }
    })

    // Get Exchange with pagination
    context.get(endpoint + '/exchanges', appMiddleware.normalizeQuery)
    context.get(endpoint + '/exchanges', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { page, per_page, order, status } = req.query

            const result = await appService.findWithPagination({
                page: +page, 
                per_page: +per_page,
                order, status
            })
            res.json({ page, per_page, ...result })
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err
            })
        }
    })

    // Deactivate Or Activate Exchange
    context.put(endpoint + '/:action', appMiddleware.validateUpdate(validationService))
    context.put(endpoint + '/:action', async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { action } = req.params
            if (action.toString() != 'activate' && action.toString() != 'deactivate')
                return next()
            const result = await appService.updateStatus(req.query.id as string, action.toString())
            if (!result)
                res.status(404).json({
                    statusCode: 404,
                    message: 'Not found'
                })
            else if ((result as UpdateResult).affected <= 0)
                res.json({ status: 'Nothing to Update', result })
            else res.json({
                status: 'Updated',
                result: result
            })
            return
        } catch (err) {
            res.status(500).json({
                statusCode: 500,
                message: err
            })
        }
    })
}