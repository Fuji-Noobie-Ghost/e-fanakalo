import { Exchange } from "../database"

export class ExchangeDTO {
    username: string
    contact: string
    title: string
    searchFor: string
    isActive: string

    static getProperties() {
        return ['username', 'contact', 'title', 'searchFor', 'isActive']
    }

    static create(exchange: Exchange): ExchangeDTO {
        const exDTO = new ExchangeDTO()
        ExchangeDTO.getProperties().forEach(key => {
            exDTO[key] = exchange[key]
        })
        return exDTO
    }

    static fromDTO(exDTO: ExchangeDTO): Exchange {
        const exchange = new Exchange()
        ExchangeDTO.getProperties().forEach(key => {
            exchange[key] = exDTO[key]
        })
        return exchange
    }
}