import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import path from 'path'

if (!process.env.NODE_ENV) config()

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: DB_HOST,
    port: +DB_PORT,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    synchronize: false,
    logging: false,
    entities: [path.resolve(__dirname, 'entities/**/*.ts')],
    migrations: [path.resolve(__dirname, 'migrations/**/*.ts')]
})
