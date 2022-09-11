import { NextFunction, Request, Response } from 'express'

export class ValidationService {

    constructor (private rollback: Function) {
        this.validate = this.validate.bind(this)
    }

    isUsernameValid(username: string): boolean {
        const pattern = /^[a-zA-Z0-9_\-\s\.]{3,}$/
        return pattern.test(username)
    }

    isContactValid(contact: string): boolean {
        const pattern = /^[\+]?\d{1,3}[\s\-]?\d{1,2}[\s\-]?\d{2,3}[\s\-]?\d{2,3}[\s\-]?\d{2,3}$/
        return pattern.test(contact)
    }

    isTitleValid(title: string): boolean {
        const pattern = /^[a-zA-Z0-9\-\s]{2,}$/
        return pattern.test(title)
    }

    isUUIDValid(uuid: string): boolean {
        const pattern = /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
        return pattern.test(uuid)
    }

    validate(req: Request, res: Response, next: NextFunction) {
        const { username, contact, title, searchFor } = req.body
        const statusCode = 400
        let message: string

        if (username && contact && title && searchFor) {
            if (!this.isUsernameValid(username))
                message = `Invalid username '${username}'`
            else if (username.length > 100)
                message = 'Username too large'
            else if (!this.isContactValid(contact))
                message = `Invalid mobile number '${contact}'`
            else if (!this.isTitleValid(title))
                message = `Invalid title '${title}'`
            
            if (message) {
                this.rollback(req.files)
                res.status(statusCode).json({ statusCode, message })
                return
            }
            return next()
        }

        message = 'Missing payload'
        this.rollback(req.files)
        res.status(statusCode).json({ statusCode, message })
    }

}