import { Request, Response, NextFunction } from 'express'
import { ValidationService } from '../services'

export class AppMiddleware {

    static normalizeQuery(req: Request, res: Response, next: NextFunction) {
        const sortAccepts = ['createdAt', 'username', 'title', 'updatedAt']
        let { status, page, per_page, sort } = req.query

        if (status === undefined) req.query.status = {}
        else switch (status) {
            case '':
                req.query.status = {}
                break
            case 'active':
                req.query.status = { isActive: 'Y' }
                break
            case 'deactive':
                req.query.status = { isActive: 'N' }
                break
            default:
                req.query.status = null
                break
        }

        if (page === undefined) req.query.page = '1'
        if (per_page === undefined) req.query.per_page = '10'
        if (sort === undefined) req.query.sort = 'updatedAt'

        if (parseInt(page as string) === NaN || parseInt(per_page as string) === NaN ||
        !sortAccepts.includes(sort as string) || req.query.status === null)
            return res.status(400).json({
                statusCode: 400,
                message: 'Invalid Query Request'
            })

        const order = []
        order[req.query.sort as string] = 'DESC'
        req.query.order = order

        return next()
    }

    static validateUpdate(validationService: ValidationService) {
        return (req: Request, res: Response, next: NextFunction) => {
            if (req.query.id === undefined)
                return res.status(400).json({
                    statusCode: 400,
                    message: `Missing query 'id'`
                })

            else if (!validationService.isUUIDValid(req.query.id as string))
                return res.status(400).json({
                    statusCode: 400,
                    message: `Invalid UUID '${req.query.id}'`
                })
            return next()
        }
    }

}
