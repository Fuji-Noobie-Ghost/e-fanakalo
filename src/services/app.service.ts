import { Repository, UpdateResult, Like } from 'typeorm'
import { Exchange, Photo } from '../database'
import { ExchangeDTO } from '../dto/exchange.dto'

export interface QueryRequest {
    page: number
    per_page: number
    order: any
    status?: any
}

export class AppService {

    constructor(
        private exchange: Repository<Exchange>,
        private photo: Repository<Photo>
    ) {}

    async findAll(status: any): Promise<[Exchange[], number]> {
        return await this.exchange.findAndCount({
            where: status,
            relations: ['photos']
        })
    }

    async findWithPagination({ page, order, per_page, status }: QueryRequest): Promise<any> {
        const count = await this.exchange.countBy(status)

        const exchanges = await this.exchange.find({
            where: status,
            relations: ['photos'],
            take: per_page * page,
            skip: (per_page * page) - per_page,
            order: { isActive: 'DESC', ...order }
        })
        
        return { count, exchanges }
    }

    async saveExchange(exDTO: ExchangeDTO, files: Express.Multer.File[]): Promise<Exchange> {
        const exchange = ExchangeDTO.fromDTO(exDTO)
        const filenames = files.map(file => file.filename) // List of filename
        const photos = filenames.map(filename => this.createPhoto(filename))
        exchange.photos = photos
        return await this.exchange.save(exchange)
    }

    createPhoto(filename: string): Photo {
        const photo = new Photo()
        photo.name = filename
        return photo
    }

    async updateStatus(id: string, action: string): Promise<UpdateResult | boolean> {
        const isActive = action === 'activate' ? 'Y' : 'N'
        if (!await this.exchange.findOneBy({ id }))
            return false
        return await this.exchange.update({ id }, {
            updatedAt: new Date(), isActive
        })
    }

}